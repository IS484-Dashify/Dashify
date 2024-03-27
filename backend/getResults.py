from flask import jsonify, request
import requests
from app import app

@app.route('/', methods=['GET'])
def index():
    print("Hello, World!");
    return {'message': 'Hello, World!'}

@app.route('/processresult', methods=['POST'])
def processResult():
    data = request.json
    rawResult = {
        "mid": int(data['mid']),
        "cid": int(data['cid']),
        "datetime" : data['datetime'],
        "disk_usage": float(data['disk_usage']),
        "traffic_in": int(data['traffic_in']),
        "traffic_out": int(data['traffic_out']),
        "clock": float(data['clock']),
        "cpu_usage": float(data['cpu_usage']),
        "system_uptime": float(data['system_uptime']),
        "memory_usage": float(data['memory_usage'])
    }
    
    # * 1. Derive statuses from raw data
    if rawResult:
        statuses = {}
        
        if rawResult['system_uptime'] == 0:
            statuses['system_uptime'] = 'Critical'
            return jsonify(statuses)
        else:
            statuses['system_uptime'] = 'Normal'
        
        if rawResult['disk_usage'] > 90:
            diskUsageStatus = 'Critical'
        elif rawResult['disk_usage'] > 70:
            diskUsageStatus = 'Warning'
        else:
            diskUsageStatus = 'Normal'
        statuses['disk_usage'] = diskUsageStatus
        
        if rawResult['traffic_in'] > 1000:
            trafficInStatus='Critical'
        elif rawResult['traffic_in'] > 500:
            trafficInStatus='Warning'
        else:
            trafficInStatus='Normal'
        statuses['traffic_in'] = trafficInStatus

        if rawResult['traffic_out'] > 100000:
            trafficOutStatus='Critical'
        elif rawResult['traffic_out'] > 50000:
            trafficOutStatus='Warning'
        else:
            trafficOutStatus='Normal'
        statuses['traffic_out'] = trafficOutStatus


        if rawResult['cpu_usage'] > 90:
            cpuUsageStatus='Critical'
        elif rawResult['cpu_usage'] > 70:
            cpuUsageStatus='Warning'
        else:
            cpuUsageStatus='Normal'
        statuses['traffic_out'] = cpuUsageStatus

        if rawResult['memory_usage'] > 90:
            memoryUsageStatus='Critical'
        elif rawResult['memory_usage'] > 70:
            memoryUsageStatus='Warning'
        else:
            memoryUsageStatus='Normal'
        statuses['memory_usage'] = memoryUsageStatus
        # TODO: 2. if any status are Critical/Warning, fire to notification system
        
        # TODO: 3. Store the data in the database
        response = requests.post("http://127.0.0.1:5004/add-result", 
            json=rawResult, 
            headers = {
                'Content-Type': 'application/json', 
            }
        )
        response = response.json()
        print("Response status:", response)
        if response["status_code"] == 200:
            response_data = {
                'message': 'Data processed successfully',
                'status_code': response["status_code"]
            }
            return jsonify(response_data), 200
        else:
            # Return relevant information from the response
            response_data = {
                'error': 'Failed to process data',
                'status_code': response["status_code"]
            }
            return jsonify(response_data), 500
    else:
        return jsonify({"message": "No result found for the specified cid and mid."})

if __name__ == '__main__':
    app.run(debug=True, port=5007)