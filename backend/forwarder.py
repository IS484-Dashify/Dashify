import requests
import logging
import json
from azure.eventhub.exceptions import EventHubError
from azure.eventhub import EventHubProducerClient, EventData
from time import sleep

# Basic configuration for logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Configuration
PROMETHEUS_ENDPOINT = 'http://localhost:9090/api/v1/query'
METRIC_QUERIES = {
    'up': 'up{}',
    'cpu_user_seconds_total': 'process_cpu_user_seconds_total',
    'cpu_system_seconds_total': 'process_cpu_system_seconds_total',
    'cpu_seconds_total': 'rate(process_cpu_seconds_total[30s]) * 100',
    'memory_resident_bytes': 'process_resident_memory_bytes',
    'memory_virtual_bytes': 'process_virtual_memory_bytes',
    'heap_bytes': 'process_heap_bytes',
    'eventloop_lag_seconds': 'nodejs_eventloop_lag_seconds',
    'active_handles_total': 'nodejs_active_handles_total',
    'heap_size_total_bytes': 'nodejs_heap_size_total_bytes',
    'heap_size_used_bytes': 'nodejs_heap_size_used_bytes',
    'external_memory_bytes': 'nodejs_external_memory_bytes',
    'gc_duration_seconds': 'sum(rate(nodejs_gc_duration_seconds_sum[30s])) by (kind)',  # Example of aggregating GC duration
    'http_request_duration_ms': 'sum(rate(http_request_duration_ms_sum[30s])) by (route)',  # Aggregating HTTP request durations
}
eventhub_connection_str = 'Endpoint=sb://dashify-test.servicebus.windows.net/;SharedAccessKeyName=RootManageAccessKey;SharedAccessKey=dEwEWPefLmhhL+kzgE+7OhHQBKhUapkHC+AEhCMKbwc=;EntityPath=prometheus-forwarder'
eventhub_name = 'prometheus-forwarder'
retry_attempts = 3
retry_delay = 100  # this is in seconds

def fetch_prometheus_metrics(url):
    metrics = {}
    for attempt in range(retry_attempts):
        try:
            for name, query in METRIC_QUERIES.items():
                response = requests.get(url, params={'query': query}, timeout=10)
                response.raise_for_status()
                metrics[name] = response.json()['data']['result']
                print(metrics[name])
            return json.dumps(metrics)
        except (requests.exceptions.HTTPError, 
                requests.exceptions.ConnectionError,
                requests.exceptions.Timeout,
                requests.exceptions.RequestException) as e:
            logging.error(f"Error fetching metrics: {e}")
            sleep(retry_delay)  # retry logic
    return None

def send_to_eventhub(metrics_json):
    try:
        producer = EventHubProducerClient.from_connection_string(conn_str=eventhub_connection_str, eventhub_name=eventhub_name)
        with producer:
            event_data_batch = producer.create_batch()
            event_data_batch.add(EventData(metrics_json))
            producer.send_batch(event_data_batch)
            logging.info("Metrics sent to Azure Event Hubs successfully.")
    except EventHubError as e:
        logging.error(f"Failed to send metrics to Azure Event Hubs: {e}")

if __name__ == "__main__":
    while True:
        metrics_json = fetch_prometheus_metrics(PROMETHEUS_ENDPOINT)
        if metrics_json:
            send_to_eventhub(metrics_json)
        else:
            logging.error("Failed to fetch metrics from Prometheus.")
        sleep(retry_delay)
