from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/get-service-status-details/<int:sid>', methods=['GET'])
def get_all_service_name_and_status(sid):
    output = {}
    response2 = requests.get(f'http://localhost:5002/get-mid-by-sid/{sid}')
    mids = response2.json()['results']

    for mid in mids:
        component_statuses = {}
        response3 = requests.get(f'http://localhost:5002/get-machine-details-by-mid/{mid}')
        machine_details = response3.json()
        response4 = requests.get(f'http://localhost:5003/get-cid-by-mid/{mid}')
        cids = response4.json()['results']

        output[machine_details['name']] = {'status': 'red',
                            'location': machine_details['location'],
                            'country': machine_details['country']}

        for cid in cids:
            response5 = requests.get(f'http://localhost:5004/get-result-status/{cid}/{mid}')
            component_status = response5.json()['status']
            response6 = requests.get(f'http://localhost:5003/get-component-details-by-cid/{cid}')
            component_name = response6.json()['name']
            component_statuses[component_name] = component_status
    
        if 'red' in component_statuses.values():
            output[machine_details['name']]['status'] = 'Critical'
        
        elif 'amber' in component_statuses.values():
            output[machine_details['name']]['status'] = 'Warning'
        
        else:
            output[machine_details['name']]['status'] = 'Normal'

        output[machine_details['name']]['components'] = component_statuses

    # Return the final response
    return jsonify(output)

@app.route('/get-all-service-name-and-status', methods=['GET'])
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
            output[service['name']] = 'Critical'
        
        elif 'amber' in statuses:
            output[service['name']] = 'Warning'
        
        else:
            output[service['name']] = 'Normal'


    # Return the final response
    return jsonify(output)


if __name__ == '__main__':
    app.run(debug=True, port=5006)