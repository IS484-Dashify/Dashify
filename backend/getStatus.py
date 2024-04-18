from flask import jsonify
import requests
from app import app
import time
from models import db
from flask_cors import CORS
from os import environ

@app.route('/get-service-status-details/<int:sid>', methods=['GET'])
def get_service_status_details(sid):
    output = {}
    response2 = requests.get(f'http://127.0.0.1:5002/get-mid-by-sid/{sid}')
    mids = response2.json()['results']

    for mid in mids:
        component_statuses = []
        all_statuses = []
        response3 = requests.get(f'http://127.0.0.1:5002/get-machine-details-by-mid/{mid}')
        data = response3.json()
        app.logger.info("Response 3:", data)
        machine_details = response3.json()
        response4 = requests.get(f'http://127.0.0.1:5003/get-cid-by-mid/{mid}')
        cids = response4.json()['results']

        output[mid] = {'status': 'red',
                        'location': machine_details['location'],
                        'country': machine_details['country'],
                        'mName' : machine_details['name'],
                        'iso': machine_details['iso']}

        for cid in cids:
            response5 = requests.get(f'http://127.0.0.1:5004/get-result-status/{cid}/{mid}')
            component_status = response5.json()['status']
            response6 = requests.get(f'http://127.0.0.1:5003/get-component-details-by-cid/{cid}')
            component_name = response6.json()['name']
            component_statuses.append({'cName':component_name,
                                       'cid': cid, 
                                      'cStatus':component_status})
            all_statuses.append(component_status)
    
        if 'Critical' in all_statuses:
            output[mid]['status'] = 'Critical'
        
        elif 'Warning' in all_statuses:
            output[mid]['status'] = 'Warning'
        
        else:
            output[mid]['status'] = 'Normal'

        output[mid]['components'] = component_statuses

    # Return the final response
    return jsonify(output)

@app.route('/get-all-service-name-and-status', methods=['GET'])
def get_all_service_name_and_status():
    output = []
    response1 = requests.get('http://127.0.0.1:5001/get-all-services')
    services = response1.json()['results']
        
    # return jsonify({"msg": "Hello World"}), 200

    for service in services:
        sid = service['sid']
        response2 = requests.get(f'http://127.0.0.1:5002/get-mid-by-sid/{sid}')
        mids = response2.json()['results']
        statuses = []
        
        for mid in mids:
            response3 = requests.get(f'http://127.0.0.1:5003/get-cid-by-mid/{mid}')
            cids = response3.json()['results']

            for cid in cids:
                response4 = requests.get(f'http://127.0.0.1:5004/get-result-status/{cid}/{mid}')
                component_status = response4.json()['status']
                print(component_status)
                statuses.append(component_status)
        
        if 'Critical' in statuses:
            output.append({"sid": sid, "name":service['name'] ,"status" : 'Critical'})
        
        elif 'Warning' in statuses:
            output.append({"sid": sid, "name":service['name'] ,"status" : 'Warning'})
        
        else:
            output.append({"sid": sid, "name":service['name'] ,"status" : 'Normal'})


    # Return the final response
    return jsonify(output)


if __name__ == '__main__':
    app.run(debug=True, port=5006)