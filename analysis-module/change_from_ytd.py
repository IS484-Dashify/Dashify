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
    query = "SELECT CID, DISK_USAGE, TRAFFIC_OUT, CPU_USAGE, MEMORY_USAGE FROM results WHERE DATETIME BETWEEN %s AND %s"
    cursor.execute(query, (start_time, end_time))
    data = cursor.fetchall()
    # conn.close()
    return data


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
data_yesterday = fetch_data(start_of_yesterday, end_of_yesterday)
data_today = fetch_data(start_of_today, end_of_today)


# FOR DATA_YESTERDAY
# Initialize dictionaries to store sum and count of each metric for each CID 
sum_by_cid_ytd_data = defaultdict(lambda: defaultdict(float))
count_by_cid_ytd_data = defaultdict(lambda: defaultdict(int))

# Iterate through the data and calculate sum and count and average for each metric for each CID
for cid, disk_usage, traffic_out, cpu_usage, memory_usage in data_yesterday:
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

# FOR DATA_TODAY
# Initialize dictionaries to store sum and count and average of each metric for each CID
sum_by_cid_today_data = defaultdict(lambda: defaultdict(float))
count_by_cid_today_data = defaultdict(lambda: defaultdict(int))

for cid, disk_usage, traffic_out, cpu_usage, memory_usage in data_today:
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


# Calculate percentage change
percentage_change_by_cid = {}
for cid in average_by_cid_ytd_data:
    percentage_change_by_cid[cid] = {
        metric: round(((average_by_cid_today_data[cid][metric] - average_by_cid_ytd_data[cid][metric]) / average_by_cid_ytd_data[cid][metric]) * 100,2)
        for metric in average_by_cid_ytd_data[cid]
    }

print(percentage_change_by_cid)


insert_query = "INSERT INTO notifications (cid, isread, reason, datetime, status) VALUES (%s, %s, %s, %s, %s)"
for cid, metrics in percentage_change_by_cid.items():
    for metric, change in metrics.items():
        if change < -20:
            reason = f"{metric} up {change}% from yesterday"
            date = datetime.now()
            cursor.execute(insert_query, (cid, 0, reason, date, "Analysis"))
            conn.commit()