from datetime import datetime, timedelta, timezone
from collections import defaultdict
import requests
import json

def delete_testdata():
    url = "http://4.231.173.235:5004/delete-result"
    
    try:
        # Assuming you want to delete data between two specific datetimes
        start_datetime = "2024-03-04 00:00:00"
        end_datetime = "2024-03-10 23:59:59"

        # Create a JSON payload containing the start and end datetimes
        data = {"start_datetime": start_datetime, "end_datetime": end_datetime}
        
        # Send a DELETE request with the JSON payload
        response = requests.delete(url, json=data)
        
        # Check the response status code
        if response.status_code == 200:
            print("Test data deletion successful:", response.json())
        else:
            print("Failed to delete test data:", response.status_code, response.json())
    
    except requests.exceptions.RequestException as e:
        # If an error occurs during the request, print the error message
        print("Error deleting test data:", e)

def delete_notifications():
    url = "http://4.231.173.235:5008/delete-notification"

    try:
        # Send a DELETE request to the specified URL
        response = requests.delete(url)
        
        # Check the response status code
        if response.status_code == 200:
            print("Notifications deleted successfully.")
        else:
            print(f"Failed to delete notifications. Status code: {response.status_code}")
    
    except requests.exceptions.RequestException as e:
        # If an error occurs during the request, print the error message
        print("Error deleting notifications:", e)


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
# print(extracted_data)

# Get yesterday's date and the start and end timestamps for yesterday
yesterday = datetime.now(timezone.utc) - timedelta(days=1)
start_of_yesterday = datetime(yesterday.year, yesterday.month, yesterday.day, 0, 0, 0, tzinfo=timezone.utc)
end_of_yesterday = datetime(yesterday.year, yesterday.month, yesterday.day, 23, 59, 59, tzinfo=timezone.utc)
# start_of_yesterday = datetime(2024, 3, 4, 0, 0, 0, tzinfo=timezone.utc)
# end_of_yesterday = datetime(2024, 3, 4, 23, 59, 59, tzinfo=timezone.utc)

# Get today's date and the start and end timestamps for today
today = datetime.now(timezone.utc)
start_of_today = datetime(today.year, today.month, today.day, 0, 0, 0, tzinfo=timezone.utc)
end_of_today = datetime(today.year, today.month, today.day, 23, 59, 59, tzinfo=timezone.utc)
# start_of_today = datetime(2024, 3, 5, 0, 0, 0, tzinfo=timezone.utc)
# end_of_today = datetime(2024, 3, 5, 23, 59, 59, tzinfo=timezone.utc)


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
    cpu_usage = entry["cpu_usage"]
    memory_usage = entry["memory_usage"]
    if disk_usage is not None:
        sum_by_cid_ytd_data[cid]['DISK_USAGE'] += disk_usage
        count_by_cid_ytd_data[cid]['DISK_USAGE'] += 1
    if cpu_usage is not None:
        sum_by_cid_ytd_data[cid]['CPU_USAGE'] += cpu_usage
        count_by_cid_ytd_data[cid]['CPU_USAGE'] += 1
    if memory_usage is not None:
        sum_by_cid_ytd_data[cid]['MEMORY_USAGE'] += memory_usage
        count_by_cid_ytd_data[cid]['MEMORY_USAGE'] += 1

average_by_cid_ytd_data = {}
for cid in sum_by_cid_ytd_data:
    average_by_cid_ytd_data[cid] = {
        metric: sum_by_cid_ytd_data[cid][metric] / count_by_cid_ytd_data[cid][metric]
        for metric in sum_by_cid_ytd_data[cid]
    }

# print("ytd avg: ", average_by_cid_ytd_data)


# FOR DATA_TODAY
# Initialize dictionaries to store sum and count and average of each metric for each CID
# Initialize dictionaries to store sum and count of each metric for each CID 
sum_by_cid_today_data = defaultdict(lambda: defaultdict(float))
count_by_cid_today_data = defaultdict(lambda: defaultdict(int))

# Iterate through the data and calculate sum and count and average for each metric for each CID
for entry in data_today:
    cid = entry["cid"]
    disk_usage = entry["disk_usage"]
    cpu_usage = entry["cpu_usage"]
    memory_usage = entry["memory_usage"]
    if disk_usage is not None:
        sum_by_cid_today_data[cid]['DISK_USAGE'] += disk_usage 
        count_by_cid_today_data[cid]['DISK_USAGE'] += 1
    if cpu_usage is not None:
        sum_by_cid_today_data[cid]['CPU_USAGE'] += cpu_usage
        count_by_cid_today_data[cid]['CPU_USAGE'] += 1
    if memory_usage is not None:
        sum_by_cid_today_data[cid]['MEMORY_USAGE'] += memory_usage
        count_by_cid_today_data[cid]['MEMORY_USAGE'] += 1

average_by_cid_today_data = {}
for cid in sum_by_cid_today_data:
    average_by_cid_today_data[cid] = {
        metric: sum_by_cid_today_data[cid][metric] / count_by_cid_today_data[cid][metric]
        for metric in sum_by_cid_today_data[cid]
    }

# print("today avg: ", average_by_cid_today_data )

# Calculate percentage change
percentage_change_by_cid = {}
for cid in average_by_cid_ytd_data:
    percentage_change_by_cid[cid] = {
        metric: round(((average_by_cid_today_data[cid][metric] - average_by_cid_ytd_data[cid][metric]) / average_by_cid_ytd_data[cid][metric]) * 100,2)
        for metric in average_by_cid_ytd_data[cid]
    }

print("% change: ", percentage_change_by_cid)

for cid, metrics in percentage_change_by_cid.items():
    for metric, change in metrics.items():
        if change > 20:
            reason = f"{metric} up {change}% from yesterday"
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
            


