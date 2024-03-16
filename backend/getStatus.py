from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

@app.route('/get-all-service-name-and-status', methods=['GET'])
def get_all_service_name_and_status():
    output = {}

    response1 = requests.get('http://localhost:5001/get-all-services')
    services = response1.json()['results']

    for service in services:
        sid = service['sid']
        response2 = requests.get(f'http://localhost:5002/get-mid-by-sid/{sid}')
        mids = response2.json()['results']
        statuses = []

        for mid in mids:
            response3 = requests.get(f'http://localhost:5003/get-cid-by-mid/{mid}')
            cids = response3.json()['results']

            for cid in cids:
                response4 = requests.get(f'http://localhost:5004/get-result-status/{cid}/{mid}')
                component_status = response4.json()['status']
                statuses.append(component_status)
        
        if 'red' in statuses:
            output[service['name']] = 'red'
        
        elif 'amber' in statuses:
            output[service['name']] = 'amber'
        
        else:
            output[service['name']] = 'green'


    # Return the final response
    return jsonify(output)

@app.route('/get-service-status-details', methods=['GET'])
def get_service_status_details():
    output = {}

    response1 = requests.get('http://localhost:5001/get-all-services')
    services = response1.json()['results']

    for service in services:
        sid = service['sid']
        response2 = requests.get(f'http://localhost:5002/get-mid-by-sid/{sid}')
        mids = response2.json()['results']

        for mid in mids:
            statuses = []
            response3 = requests.get(f'http://localhost:5003/get-cid-by-mid/{mid}')
            cids = response3.json()['results']

            for cid in cids:
                response4 = requests.get(f'http://localhost:5004/get-result-status/{cid}/{mid}')
                component_status = response4.json()['status']
                statuses.append(component_status)
        
            if 'red' in statuses:
                output[service['name']] = 'red'
            
            elif 'amber' in statuses:
                output[service['name']] = 'amber'
            
            else:
                output[service['name']] = 'green'


    # Return the final response
    return jsonify(output)


if __name__ == '__main__':
    app.run(debug=True, port=5006)