import mysql.connector
from datetime import datetime, timedelta, timezone
from collections import defaultdict

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    database="is484"
)

cursor = conn.cursor()


def fetch_data(start_time, end_time):
    query = "SELECT DATETIME, CID, DISK_USAGE, TRAFFIC_OUT, CPU_USAGE, MEMORY_USAGE FROM results WHERE DATETIME BETWEEN %s AND %s"
    cursor.execute(query, (start_time, end_time))
    data = cursor.fetchall()
    # conn.close()
    return data


# Get start and end timestamps for the past week
# end_time = datetime.now(timezone.utc)
end_time = datetime(2024, 3, 10, 23, 59, 59, tzinfo=timezone.utc)
start_time = end_time - timedelta(days=7)



# Fetch data for the past week from the database
data_past_week = fetch_data(start_time, end_time)


# Dictionary to store sum and count of each metric for each hour and CID
sum_by_hour_cid = defaultdict(lambda: defaultdict(lambda: defaultdict(float)))
count_by_hour_cid = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))

# Parse data and aggregate
for datetime_format, cid, disk_usage, traffic_out, cpu_usage, memory_usage in data_past_week:
    datetime_str = datetime_format.strftime("%H:%M:%S")
    hour = datetime_str.split(':')[0]  # Extract hour from datetime
    sum_by_hour_cid[hour][cid]['DISK_USAGE'] += disk_usage
    sum_by_hour_cid[hour][cid]['TRAFFIC_OUT'] += traffic_out
    sum_by_hour_cid[hour][cid]['CPU_USAGE'] += cpu_usage
    sum_by_hour_cid[hour][cid]['MEMORY_USAGE'] += memory_usage
    
    count_by_hour_cid[hour][cid]['DISK_USAGE'] += 1
    count_by_hour_cid[hour][cid]['TRAFFIC_OUT'] += 1
    count_by_hour_cid[hour][cid]['CPU_USAGE'] += 1
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
            

insert_query = "INSERT INTO notifications (cid, isread, reason, datetime, status) VALUES (%s, %s, %s, %s, %s)"
for cid, metric_data in highest_hour_by_metric.items():
    for metric, hour in metric_data.items():
        hour = int(hour)
        end_hour = int(hour + 1)
        reason = f"{metric} is highest at {highest_average_by_metric[cid][metric]} from {hour}00 to {end_hour}00 over the past week"
        date = datetime.now()
        cursor.execute(insert_query, (cid, 0, reason, date, "Analysis"))
        conn.commit()

