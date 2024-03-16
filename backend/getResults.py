from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

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
            statuses['system_uptime'] = 'red'
            return jsonify(statuses)
        else:
            statuses['system_uptime'] = 'green'
        
        if rawResult['disk_usage'] > 90:
            diskUsageStatus = 'red'
        elif rawResult['disk_usage'] > 70:
            diskUsageStatus = 'amber'
        else:
            diskUsageStatus = 'green'
        statuses['disk_usage'] = diskUsageStatus
        
        if rawResult['traffic_in'] > 1000:
            trafficInStatus='red'
        elif rawResult['traffic_in'] > 500:
            trafficInStatus='amber'
        else:
            trafficInStatus='green'
        statuses['traffic_in'] = trafficInStatus

        if rawResult['traffic_out'] > 100000:
            trafficOutStatus='red'
        elif rawResult['traffic_out'] > 50000:
            trafficOutStatus='amber'
        else:
            trafficOutStatus='green'
        statuses['traffic_out'] = trafficOutStatus


        if rawResult['cpu_usage'] > 90:
            cpuUsageStatus='red'
        elif rawResult['cpu_usage'] > 70:
            cpuUsageStatus='amber'
        else:
            cpuUsageStatus='green'
        statuses['traffic_out'] = cpuUsageStatus

        if rawResult['memory_usage'] > 90:
            memoryUsageStatus='red'
        elif rawResult['memory_usage'] > 70:
            memoryUsageStatus='amber'
        else:
            memoryUsageStatus='green'
        statuses['memory_usage'] = memoryUsageStatus
        # TODO: 2. if any status are red/amber, fire to notification system
        
        # TODO: 3. Store the data in the database
        response = requests.post("http://localhost:5004/add-result", 
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
            return jsonify(response_data)   
        else:
            # Return relevant information from the response
            response_data = {
                'error': 'Failed to process data',
                'status_code': response["status_code"]
            }
            return jsonify(response_data)
    else:
        return jsonify({"message": "No result found for the specified cid and mid."})

if __name__ == '__main__':
    app.run(debug=True, port=5007)