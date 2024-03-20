import sqlite3
from datetime import datetime, timedelta

def fetch_cpu_usage_from_database(start_time, end_time):
    connection = sqlite3.connect('your_database_file.db')  # Replace 'your_database_file.db' with your database file
    cursor = connection.cursor()

    # Fetch CPU usage data between start_time and end_time
    query = "SELECT timestamp, cpu_percent FROM cpu_usage_data WHERE timestamp BETWEEN ? AND ?"
    cursor.execute(query, (start_time, end_time))
    cpu_usage = cursor.fetchall()

    connection.close()
    return cpu_usage

def calculate_average_cpu_usage(cpu_usage):
    total_usage = sum(usage for _, usage in cpu_usage)
    return total_usage / len(cpu_usage)

# Get yesterday's date and the start and end timestamps for yesterday
yesterday = datetime.now() - timedelta(days=1)
start_of_yesterday = datetime(yesterday.year, yesterday.month, yesterday.day, 0, 0, 0)
end_of_yesterday = datetime(yesterday.year, yesterday.month, yesterday.day, 23, 59, 59)

# Get today's date and the start and end timestamps for today
today = datetime.now()
start_of_today = datetime(today.year, today.month, today.day, 0, 0, 0)
end_of_today = datetime(today.year, today.month, today.day, 23, 59, 59)

# Fetch CPU usage for yesterday and today from the database
cpu_usage_yesterday = fetch_cpu_usage_from_database(start_of_yesterday, end_of_yesterday)
cpu_usage_today = fetch_cpu_usage_from_database(start_of_today, end_of_today)

# Calculate average CPU usage for yesterday and today
avg_cpu_usage_yesterday = calculate_average_cpu_usage(cpu_usage_yesterday)
avg_cpu_usage_today = calculate_average_cpu_usage(cpu_usage_today)

# Calculate the change in CPU usage
change_in_cpu_usage = avg_cpu_usage_today - avg_cpu_usage_yesterday

print("Average CPU Usage Yesterday: {:.2f}%".format(avg_cpu_usage_yesterday))
print("Average CPU Usage Today: {:.2f}%".format(avg_cpu_usage_today))
print("Change in CPU Usage: {:.2f}%".format(change_in_cpu_usage))
