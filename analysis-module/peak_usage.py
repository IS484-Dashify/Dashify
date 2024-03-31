from datetime import datetime, timedelta, timezone
from collections import defaultdict
import requests
import json

def fetch_data_from_microservice():
    # Define the URL of the microservice's API endpoint
    url = "http://4.231.173.235:5004/get-all-results"

    try:
        # Make a GET request to the microservice's API endpoint
        response = requests.get(url)
        
        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Parse the JSON response
            data = response.json()
            
            # Extract the required information from the response
            extracted_data = data["results"]  # Assuming the data is returned in a "results" key
            
            return extracted_data
        else:
            # If the request was not successful, print an error message
            print("Failed to fetch data from microservice. Status code:", response.status_code)
            return None
    except requests.exceptions.RequestException as e:
        # If an error occurs during the request, print the error message
        print("Error fetching data from microservice:", e)
        return None

def filter_data_by_datetime(data, start_datetime, end_datetime):
    filtered_data = []
    for entry in data:
        entry_datetime = datetime.strptime(entry["datetime"], "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
        if start_datetime <= entry_datetime <= end_datetime:
            filtered_data.append(entry)
    return filtered_data

def push_notif(json_data):
    url = "http://4.231.173.235:5008/add-insight"

    try:
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, headers=headers, data=json_data)

        if response.content:
            response_data = response.json()
            if response.ok:
                print("Notification added successfully:", response_data)
            else:
                print("Failed to add notification:", response.status_code, response_data)
        else:
            print("No content in the response")
    
    except requests.exceptions.RequestException as e:
        # If an error occurs during the request, print the error message
        print("Error adding notification:", e)
        return None



extracted_data = fetch_data_from_microservice()

# Get start and end timestamps for the past week
end_time = datetime.now(timezone.utc)
# end_time = datetime(2024, 3, 10, 23, 59, 59, tzinfo=timezone.utc)
start_time = end_time - timedelta(days=7)


# Fetch data for the past week from the database
data_past_week = filter_data_by_datetime(extracted_data, start_time, end_time)


# Dictionary to store sum and count of each metric for each hour and CID
sum_by_hour_cid = defaultdict(lambda: defaultdict(lambda: defaultdict(float)))
count_by_hour_cid = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))

# Parse data and aggregate
for entry in data_past_week:
    cid = entry["cid"]
    disk_usage = entry["disk_usage"]
    cpu_usage = entry["cpu_usage"]
    memory_usage = entry["memory_usage"]
    datetime_format = entry["datetime"]
    datetime_str = datetime.strptime(entry["datetime"], "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
    timing = str(datetime_str).split(" ")[1]
    hour = timing.split(':')[0]  # Extract hour from datetime
    if disk_usage is not None:
        sum_by_hour_cid[hour][cid]['DISK_USAGE'] += disk_usage
        count_by_hour_cid[hour][cid]['DISK_USAGE'] += 1
    if cpu_usage is not None:
        sum_by_hour_cid[hour][cid]['CPU_USAGE'] += cpu_usage
        count_by_hour_cid[hour][cid]['CPU_USAGE'] += 1
    if memory_usage is not None:
        sum_by_hour_cid[hour][cid]['MEMORY_USAGE'] += memory_usage
        count_by_hour_cid[hour][cid]['MEMORY_USAGE'] += 1
    

# Calculate averages
average_by_hour_cid = defaultdict(lambda: defaultdict(dict))
for hour, cid_data in sum_by_hour_cid.items():
    for cid, metric_data in cid_data.items():
        for metric, total_sum in metric_data.items():
            count = count_by_hour_cid[hour][cid][metric]
            average = total_sum / count if count != 0 else 0  # Avoid division by zero
            average_by_hour_cid[hour][cid][metric] = average

# Find highest hour for each metric
highest_hour_by_metric = defaultdict(lambda: defaultdict(float))
highest_average_by_metric = defaultdict(lambda: defaultdict(float))
for hour, cid_data in average_by_hour_cid.items():
    for cid, metric_data in cid_data.items():
        for metric, average in metric_data.items():
            if average > highest_average_by_metric[cid][metric]:
                highest_average_by_metric[cid][metric] = round(average,2)
                highest_hour_by_metric[cid][metric] = float(hour)  # Convert hour to float


for cid, metric_data in highest_hour_by_metric.items():
    print(f"CID: {cid}")
    for metric, hour in metric_data.items():
        print(f"Metric: {metric}, Highest Hour: {hour}, Average: {highest_average_by_metric[cid][metric]}")
            

for cid, metric_data in highest_hour_by_metric.items():
    for metric, hour in metric_data.items():
        hour = int(hour)
        end_hour = int(hour + 1)
        reason = f"{metric} is highest at {highest_average_by_metric[cid][metric]} from {hour}00 to {end_hour}00 over the past week"
        date = datetime.now()
        datetime_string = date.strftime('%Y-%m-%d %H:%M:%S')
        notification_data = {
                'cid': cid,
                'isread': 0,
                'reason' : reason,
                'datetime': datetime_string,
                'lastchecked': datetime_string,
                'status': 'Analysis'
        }
        json_data = json.dumps(notification_data)
        push_notif(json_data)

