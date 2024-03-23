from datetime import datetime, timedelta, timezone
from collections import defaultdict
import requests

def fetch_data_from_microservice():
    # Define the URL of the microservice's API endpoint
    url = "http://127.0.0.1:5004/get-all-results"
    
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


extracted_data = {
    "results": [
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 3.5,
            "datetime": "2024-02-29 16:09:03",
            "disk_usage": 28.87,
            "memory_usage": 12.2,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 650,
            "traffic_out": 29000
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 1.25,
            "datetime": "2024-02-29 16:15:03",
            "disk_usage": 23.87,
            "memory_usage": 9.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 400,
            "traffic_out": 33211
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 3.5,
            "datetime": "2024-02-29 16:16:03",
            "disk_usage": 25.87,
            "memory_usage": 12.2,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 400,
            "traffic_out": 33211
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 3.5,
            "datetime": "2024-02-29 16:18:03",
            "disk_usage": 26.87,
            "memory_usage": 12.2,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 650,
            "traffic_out": 33211
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 3.5,
            "datetime": "2024-02-29 16:54:03",
            "disk_usage": 19.87,
            "memory_usage": 12.2,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 650,
            "traffic_out": 29000
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 1.25,
            "datetime": "2024-02-29 17:41:03",
            "disk_usage": 21.87,
            "memory_usage": 9.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 400,
            "traffic_out": 33211
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 1.25,
            "datetime": "2024-02-29 17:42:03",
            "disk_usage": 22.87,
            "memory_usage": 9.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 400,
            "traffic_out": 33211
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 1.25,
            "datetime": "2024-02-29 17:43:03",
            "disk_usage": 32.87,
            "memory_usage": 9.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 400,
            "traffic_out": 35312
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 0.43,
            "datetime": "2024-02-29 17:54:03",
            "disk_usage": 32.87,
            "memory_usage": 0.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 100,
            "traffic_out": 35312
        },
        {
            "cid": 2,
            "clock": 1709200000.0,
            "cpu_usage": 0.0,
            "datetime": "2024-02-29 17:54:03",
            "disk_usage": 0.0,
            "memory_usage": 0.0,
            "mid": 1,
            "system_uptime": 0.0,
            "traffic_in": 0,
            "traffic_out": 0
        },
        {
            "cid": 3,
            "clock": 1709200000.0,
            "cpu_usage": 0.43,
            "datetime": "2024-02-29 17:54:03",
            "disk_usage": 32.87,
            "memory_usage": 0.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 0,
            "traffic_out": 35312
        },
        {
            "cid": 4,
            "clock": 1709200000.0,
            "cpu_usage": 0.43,
            "datetime": "2024-02-29 17:54:03",
            "disk_usage": 32.87,
            "memory_usage": 0.0,
            "mid": 2,
            "system_uptime": 44573.0,
            "traffic_in": 0,
            "traffic_out": 35312
        },
        {
            "cid": 5,
            "clock": 1709200000.0,
            "cpu_usage": 0.43,
            "datetime": "2024-02-29 17:54:03",
            "disk_usage": 32.87,
            "memory_usage": 0.0,
            "mid": 2,
            "system_uptime": 44573.0,
            "traffic_in": 0,
            "traffic_out": 35312
        },
        {
            "cid": 6,
            "clock": 1709200000.0,
            "cpu_usage": 0.43,
            "datetime": "2024-02-29 17:54:03",
            "disk_usage": 32.87,
            "memory_usage": 0.0,
            "mid": 2,
            "system_uptime": 44573.0,
            "traffic_in": 0,
            "traffic_out": 35312
        },
        {
            "cid": 7,
            "clock": 1709200000.0,
            "cpu_usage": 0.43,
            "datetime": "2024-02-29 17:54:03",
            "disk_usage": 32.87,
            "memory_usage": 0.0,
            "mid": 3,
            "system_uptime": 44573.0,
            "traffic_in": 0,
            "traffic_out": 35312
        },
        {
            "cid": 8,
            "clock": 1709200000.0,
            "cpu_usage": 0.43,
            "datetime": "2024-02-29 17:54:03",
            "disk_usage": 32.87,
            "memory_usage": 0.0,
            "mid": 3,
            "system_uptime": 44573.0,
            "traffic_in": 0,
            "traffic_out": 35312
        },
        {
            "cid": 9,
            "clock": 1709200000.0,
            "cpu_usage": 0.43,
            "datetime": "2024-02-29 17:54:03",
            "disk_usage": 32.87,
            "memory_usage": 0.0,
            "mid": 3,
            "system_uptime": 44573.0,
            "traffic_in": 0,
            "traffic_out": 35312
        },
        {
            "cid": 10,
            "clock": 1709200000.0,
            "cpu_usage": 0.43,
            "datetime": "2024-02-29 17:54:03",
            "disk_usage": 32.87,
            "memory_usage": 0.0,
            "mid": 4,
            "system_uptime": 44573.0,
            "traffic_in": 0,
            "traffic_out": 35312
        },
        {
            "cid": 11,
            "clock": 1709200000.0,
            "cpu_usage": 0.43,
            "datetime": "2024-02-29 17:54:03",
            "disk_usage": 32.87,
            "memory_usage": 0.0,
            "mid": 4,
            "system_uptime": 44573.0,
            "traffic_in": 0,
            "traffic_out": 35312
        },
        {
            "cid": 12,
            "clock": 1709200000.0,
            "cpu_usage": 0.43,
            "datetime": "2024-02-29 17:54:03",
            "disk_usage": 32.87,
            "memory_usage": 0.0,
            "mid": 4,
            "system_uptime": 44573.0,
            "traffic_in": 0,
            "traffic_out": 35312
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 0.42,
            "datetime": "2024-02-29 17:55:03",
            "disk_usage": 34.87,
            "memory_usage": 4.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 200,
            "traffic_out": 35312
        },
        {
            "cid": 3,
            "clock": 1709200000.0,
            "cpu_usage": 9.0,
            "datetime": "2024-02-29 17:55:03",
            "disk_usage": 33.87,
            "memory_usage": 0.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 0,
            "traffic_out": 36312
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 0.4,
            "datetime": "2024-02-29 17:56:03",
            "disk_usage": 31.87,
            "memory_usage": 2.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 300,
            "traffic_out": 35312
        },
        {
            "cid": 3,
            "clock": 1709200000.0,
            "cpu_usage": 14.0,
            "datetime": "2024-02-29 17:56:03",
            "disk_usage": 34.87,
            "memory_usage": 0.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 0,
            "traffic_out": 36312
        },
        {
            "cid": 3,
            "clock": 1709200000.0,
            "cpu_usage": 39.0,
            "datetime": "2024-02-29 17:57:03",
            "disk_usage": 35.87,
            "memory_usage": 0.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 0,
            "traffic_out": 36312
        },
        {
            "cid": 3,
            "clock": 1709200000.0,
            "cpu_usage": 67.0,
            "datetime": "2024-02-29 17:58:03",
            "disk_usage": 49.0,
            "memory_usage": 0.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 0,
            "traffic_out": 45312
        },
        {
            "cid": 3,
            "clock": 1709200000.0,
            "cpu_usage": 69.0,
            "datetime": "2024-02-29 17:59:03",
            "disk_usage": 52.8,
            "memory_usage": 0.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 0,
            "traffic_out": 45312
        },
        {
            "cid": 3,
            "clock": 1709200000.0,
            "cpu_usage": 82.0,
            "datetime": "2024-02-29 18:00:00",
            "disk_usage": 62.0,
            "memory_usage": 0.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 0,
            "traffic_out": 45312
        },
        {
            "cid": 3,
            "clock": 1709200000.0,
            "cpu_usage": 88.0,
            "datetime": "2024-02-29 18:01:03",
            "disk_usage": 67.0,
            "memory_usage": 0.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 0,
            "traffic_out": 55000
        },
        {
            "cid": 3,
            "clock": 1709200000.0,
            "cpu_usage": 91.0,
            "datetime": "2024-02-29 18:02:03",
            "disk_usage": 75.0,
            "memory_usage": 0.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 0,
            "traffic_out": 55000
        },
        {
            "cid": 3,
            "clock": 1709200000.0,
            "cpu_usage": 95.0,
            "datetime": "2024-02-29 18:03:03",
            "disk_usage": 78.8,
            "memory_usage": 0.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 0,
            "traffic_out": 55000
        },
        {
            "cid": 2,
            "clock": 1709200000.0,
            "cpu_usage": 0.0,
            "datetime": "2024-02-29 18:54:03",
            "disk_usage": 0.0,
            "memory_usage": 0.0,
            "mid": 1,
            "system_uptime": 0.0,
            "traffic_in": 0,
            "traffic_out": 0
        },
        {
            "cid": 2,
            "clock": 1709200000.0,
            "cpu_usage": 0.0,
            "datetime": "2024-02-29 19:54:03",
            "disk_usage": 0.0,
            "memory_usage": 0.0,
            "mid": 1,
            "system_uptime": 0.0,
            "traffic_in": 0,
            "traffic_out": 0
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 4.9,
            "datetime": "2024-02-29 20:54:03",
            "disk_usage": 20.87,
            "memory_usage": 13.4,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 650,
            "traffic_out": 29000
        },
        {
            "cid": 2,
            "clock": 1709200000.0,
            "cpu_usage": 0.0,
            "datetime": "2024-02-29 20:54:03",
            "disk_usage": 0.0,
            "memory_usage": 0.0,
            "mid": 1,
            "system_uptime": 0.0,
            "traffic_in": 0,
            "traffic_out": 0
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 4.9,
            "datetime": "2024-02-29 20:55:03",
            "disk_usage": 21.87,
            "memory_usage": 13.4,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 650,
            "traffic_out": 29000
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 4.9,
            "datetime": "2024-02-29 20:56:03",
            "disk_usage": 22.87,
            "memory_usage": 13.4,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 300,
            "traffic_out": 29000
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 4.9,
            "datetime": "2024-02-29 20:57:03",
            "disk_usage": 22.87,
            "memory_usage": 13.4,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 300,
            "traffic_out": 32000
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 9.9,
            "datetime": "2024-02-29 20:58:03",
            "disk_usage": 23.87,
            "memory_usage": 15.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 300,
            "traffic_out": 32000
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 9.9,
            "datetime": "2024-02-29 20:59:03",
            "disk_usage": 23.87,
            "memory_usage": 15.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 300,
            "traffic_out": 32000
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 9.9,
            "datetime": "2024-02-29 21:05:03",
            "disk_usage": 23.87,
            "memory_usage": 15.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 300,
            "traffic_out": 32000
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 10.5,
            "datetime": "2024-02-29 21:09:03",
            "disk_usage": 23.87,
            "memory_usage": 19.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 200,
            "traffic_out": 27000
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 9.9,
            "datetime": "2024-02-29 21:12:03",
            "disk_usage": 23.87,
            "memory_usage": 15.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 200,
            "traffic_out": 32000
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 16.9,
            "datetime": "2024-02-29 21:15:03",
            "disk_usage": 28.0,
            "memory_usage": 19.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 150,
            "traffic_out": 27000
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 16.9,
            "datetime": "2024-02-29 21:16:03",
            "disk_usage": 28.0,
            "memory_usage": 19.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 150,
            "traffic_out": 27000
        },
        {
            "cid": 2,
            "clock": 1709200000.0,
            "cpu_usage": 0.0,
            "datetime": "2024-02-29 21:34:34",
            "disk_usage": 0.0,
            "memory_usage": 0.0,
            "mid": 1,
            "system_uptime": 0.0,
            "traffic_in": 0,
            "traffic_out": 0
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 16.9,
            "datetime": "2024-02-29 22:22:03",
            "disk_usage": 28.0,
            "memory_usage": 19.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 150,
            "traffic_out": 27000
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 16.9,
            "datetime": "2024-02-29 22:23:03",
            "disk_usage": 28.0,
            "memory_usage": 19.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 150,
            "traffic_out": 27000
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 16.9,
            "datetime": "2024-02-29 22:25:03",
            "disk_usage": 28.0,
            "memory_usage": 19.0,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 150,
            "traffic_out": 27000
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 20.0,
            "datetime": "2024-02-29 22:26:03",
            "disk_usage": 39.87,
            "memory_usage": 18.5,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 50,
            "traffic_out": 32000
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 20.0,
            "datetime": "2024-02-29 23:15:03",
            "disk_usage": 39.87,
            "memory_usage": 18.5,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 50,
            "traffic_out": 32000
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 20.0,
            "datetime": "2024-02-29 23:17:03",
            "disk_usage": 39.87,
            "memory_usage": 18.5,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 50,
            "traffic_out": 32000
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 20.0,
            "datetime": "2024-02-29 23:19:03",
            "disk_usage": 39.87,
            "memory_usage": 18.5,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 50,
            "traffic_out": 32000
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 20.0,
            "datetime": "2024-02-29 23:21:03",
            "disk_usage": 39.87,
            "memory_usage": 18.5,
            "mid": 1,
            "system_uptime": 44573.0,
            "traffic_in": 50,
            "traffic_out": 32000
        },
        {
            "cid": 1,
            "clock": 1709200000.0,
            "cpu_usage": 1.5,
            "datetime": "2024-02-28 12:00:00",
            "disk_usage": 10.0,
            "memory_usage": 6.0,
            "mid": 1,
            "system_uptime": 20000.0,
            "traffic_in": 200,
            "traffic_out": 10000
        },
        {
            "cid": 2,
            "clock": 1709200000.0,
            "cpu_usage": 0.8,
            "datetime": "2024-02-28 12:00:00",
            "disk_usage": 5.0,
            "memory_usage": 3.0,
            "mid": 1,
            "system_uptime": 15000.0,
            "traffic_in": 100,
            "traffic_out": 5000
        },
        {
            "cid": 3,
            "clock": 1709200000.0,
            "cpu_usage": 0.5,
            "datetime": "2024-02-28 12:00:00",
            "disk_usage": 8.0,
            "memory_usage": 4.0,
            "mid": 1,
            "system_uptime": 18000.0,
            "traffic_in": 150,
            "traffic_out": 8000
        },
        {
            "cid": 4,
            "clock": 1709200000.0,
            "cpu_usage": 0.3,
            "datetime": "2024-02-28 12:00:00",
            "disk_usage": 7.0,
            "memory_usage": 2.0,
            "mid": 2,
            "system_uptime": 17000.0,
            "traffic_in": 120,
            "traffic_out": 6000
        },
        {
            "cid": 5,
            "clock": 1709200000.0,
            "cpu_usage": 0.2,
            "datetime": "2024-02-28 12:00:00",
            "disk_usage": 6.0,
            "memory_usage": 1.5,
            "mid": 2,
            "system_uptime": 16000.0,
            "traffic_in": 100,
            "traffic_out": 4500
        },
        {
            "cid": 6,
            "clock": 1709200000.0,
            "cpu_usage": 0.1,
            "datetime": "2024-02-28 12:00:00",
            "disk_usage": 5.0,
            "memory_usage": 1.0,
            "mid": 2,
            "system_uptime": 15000.0,
            "traffic_in": 80,
            "traffic_out": 3000
        },
        {
            "cid": 7,
            "clock": 1709200000.0,
            "cpu_usage": 0.3,
            "datetime": "2024-02-28 12:00:00",
            "disk_usage": 7.0,
            "memory_usage": 2.5,
            "mid": 3,
            "system_uptime": 18000.0,
            "traffic_in": 130,
            "traffic_out": 7500
        },
        {
            "cid": 8,
            "clock": 1709200000.0,
            "cpu_usage": 0.2,
            "datetime": "2024-02-28 12:00:00",
            "disk_usage": 6.0,
            "memory_usage": 2.0,
            "mid": 3,
            "system_uptime": 17000.0,
            "traffic_in": 110,
            "traffic_out": 5500
        },
        {
            "cid": 9,
            "clock": 1709200000.0,
            "cpu_usage": 0.1,
            "datetime": "2024-02-28 12:00:00",
            "disk_usage": 5.0,
            "memory_usage": 1.5,
            "mid": 3,
            "system_uptime": 16000.0,
            "traffic_in": 90,
            "traffic_out": 4000
        },
        {
            "cid": 10,
            "clock": 1709200000.0,
            "cpu_usage": 0.3,
            "datetime": "2024-02-28 12:00:00",
            "disk_usage": 7.0,
            "memory_usage": 2.5,
            "mid": 4,
            "system_uptime": 18000.0,
            "traffic_in": 130,
            "traffic_out": 7500
        },
        {
            "cid": 11,
            "clock": 1709200000.0,
            "cpu_usage": 0.2,
            "datetime": "2024-02-28 12:00:00",
            "disk_usage": 6.0,
            "memory_usage": 2.0,
            "mid": 4,
            "system_uptime": 17000.0,
            "traffic_in": 110,
            "traffic_out": 5500
        },
        {
            "cid": 12,
            "clock": 1709200000.0,
            "cpu_usage": 0.1,
            "datetime": "2024-02-28 12:00:00",
            "disk_usage": 5.0,
            "memory_usage": 1.5,
            "mid": 4,
            "system_uptime": 16000.0,
            "traffic_in": 90,
            "traffic_out": 4000
        }
    ]
}


def filter_data_by_datetime(data, start_datetime, end_datetime):
    filtered_data = []
    for entry in data["results"]:
        entry_datetime = datetime.strptime(entry["datetime"], "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
        if start_datetime <= entry_datetime <= end_datetime:
            filtered_data.append(entry)
    return filtered_data

# Get yesterday's date and the start and end timestamps for yesterday
# yesterday = datetime.now(timezone.utc) - timedelta(days=1)
# start_of_yesterday = datetime(yesterday.year, yesterday.month, yesterday.day, 0, 0, 0, tzinfo=timezone.utc)
# end_of_yesterday = datetime(yesterday.year, yesterday.month, yesterday.day, 23, 59, 59, tzinfo=timezone.utc)
start_of_yesterday = datetime(2024, 2, 28, 0, 0, 0, tzinfo=timezone.utc)
end_of_yesterday = datetime(2024, 2, 28, 23, 59, 59, tzinfo=timezone.utc)

# Get today's date and the start and end timestamps for today
# today = datetime.now(timezone.utc)
# start_of_today = datetime(today.year, today.month, today.day, 0, 0, 0, tzinfo=timezone.utc)
# end_of_today = datetime(today.year, today.month, today.day, 23, 59, 59, tzinfo=timezone.utc)
start_of_today = datetime(2024, 2, 29, 0, 0, 0, tzinfo=timezone.utc)
end_of_today = datetime(2024, 2, 29, 23, 59, 59, tzinfo=timezone.utc)


# Fetch data for yesterday and today from the database
data_yesterday = filter_data_by_datetime(extracted_data, start_of_yesterday, end_of_yesterday)
data_today = filter_data_by_datetime(extracted_data, start_of_today, end_of_today)


# FOR DATA_YESTERDAY
# Initialize dictionaries to store sum and count of each metric for each CID 
sum_by_cid_ytd_data = defaultdict(lambda: defaultdict(float))
count_by_cid_ytd_data = defaultdict(lambda: defaultdict(int))

# Iterate through the data and calculate sum and count and average for each metric for each CID
for entry in data_yesterday:
    cid = entry["cid"]
    disk_usage = entry["disk_usage"]
    traffic_out = entry["traffic_out"]
    cpu_usage = entry["cpu_usage"]
    memory_usage = entry["memory_usage"]
    sum_by_cid_ytd_data[cid]['DISK_USAGE'] += disk_usage
    sum_by_cid_ytd_data[cid]['TRAFFIC_OUT'] += traffic_out
    sum_by_cid_ytd_data[cid]['CPU_USAGE'] += cpu_usage
    sum_by_cid_ytd_data[cid]['MEMORY_USAGE'] += memory_usage
    count_by_cid_ytd_data[cid]['DISK_USAGE'] += 1
    count_by_cid_ytd_data[cid]['TRAFFIC_OUT'] += 1
    count_by_cid_ytd_data[cid]['CPU_USAGE'] += 1
    count_by_cid_ytd_data[cid]['MEMORY_USAGE'] += 1

average_by_cid_ytd_data = {}
for cid in sum_by_cid_ytd_data:
    average_by_cid_ytd_data[cid] = {
        metric: sum_by_cid_ytd_data[cid][metric] / count_by_cid_ytd_data[cid][metric]
        for metric in sum_by_cid_ytd_data[cid]
    }

print("ytd avg: ", average_by_cid_ytd_data)


# FOR DATA_TODAY
# Initialize dictionaries to store sum and count and average of each metric for each CID
# Initialize dictionaries to store sum and count of each metric for each CID 
sum_by_cid_today_data = defaultdict(lambda: defaultdict(float))
count_by_cid_today_data = defaultdict(lambda: defaultdict(int))

# Iterate through the data and calculate sum and count and average for each metric for each CID
for entry in data_today:
    cid = entry["cid"]
    disk_usage = entry["disk_usage"]
    traffic_out = entry["traffic_out"]
    cpu_usage = entry["cpu_usage"]
    memory_usage = entry["memory_usage"]
    sum_by_cid_today_data[cid]['DISK_USAGE'] += disk_usage
    sum_by_cid_today_data[cid]['TRAFFIC_OUT'] += traffic_out
    sum_by_cid_today_data[cid]['CPU_USAGE'] += cpu_usage
    sum_by_cid_today_data[cid]['MEMORY_USAGE'] += memory_usage
    count_by_cid_today_data[cid]['DISK_USAGE'] += 1
    count_by_cid_today_data[cid]['TRAFFIC_OUT'] += 1
    count_by_cid_today_data[cid]['CPU_USAGE'] += 1
    count_by_cid_today_data[cid]['MEMORY_USAGE'] += 1

average_by_cid_today_data = {}
for cid in sum_by_cid_today_data:
    average_by_cid_today_data[cid] = {
        metric: sum_by_cid_today_data[cid][metric] / count_by_cid_today_data[cid][metric]
        for metric in sum_by_cid_today_data[cid]
    }

print("today avg: ", average_by_cid_today_data )

# Calculate percentage change
percentage_change_by_cid = {}
for cid in average_by_cid_ytd_data:
    percentage_change_by_cid[cid] = {
        metric: round(((average_by_cid_today_data[cid][metric] - average_by_cid_ytd_data[cid][metric]) / average_by_cid_ytd_data[cid][metric]) * 100,2)
        for metric in average_by_cid_ytd_data[cid]
    }

# print("change:", percentage_change_by_cid)


