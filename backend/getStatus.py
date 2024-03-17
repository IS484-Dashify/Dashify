from flask import jsonify, request
import requests
from app import app
import time

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
    overall_start_time = time.time()
    output = {}
    service_start_time = time.time()
    response1 = requests.get('http://localhost:5001/get-all-services')
    services = response1.json()['results']
    service_end_time = time.time()
    app.logger.info(f"Service Request took {service_end_time - service_start_time:.6f} seconds")

    for service in services:
        sid = service['sid']
        machine_start_time = time.time()
        response2 = requests.get(f'http://localhost:5002/get-mid-by-sid/{sid}')
        mids = response2.json()['results']
        machine_end_time = time.time()
        app.logger.info(f"Machine Request took {machine_end_time - machine_start_time:.6f} seconds")

        for mid in mids:
            statuses = []
            component_start_time = time.time()
            response3 = requests.get(f'http://localhost:5003/get-cid-by-mid/{mid}')
            cids = response3.json()['results']
            component_end_time = time.time()
            app.logger.info(f"Component Request took {component_end_time - component_start_time:.6f} seconds")

            for cid in cids:
                results_start_time = time.time()
                response4 = requests.get(f'http://localhost:5004/get-result-status/{cid}/{mid}')
                component_status = response4.json()['status']
                statuses.append(component_status)
                results_end_time = time.time()
                app.logger.info(f"Result Request took {results_end_time - results_start_time:.6f} seconds")
        
        if 'red' in statuses:
            output[service['name']] = 'Critical'
        
        elif 'amber' in statuses:
            output[service['name']] = 'Warning'
        
        else:
            output[service['name']] = 'Normal'


    # Return the final response
    overall_end_time = time.time()
    app.logger.info(f"Overall Request took {overall_end_time - overall_start_time:.6f} seconds")
    return jsonify(output)


if __name__ == '__main__':
    app.run(debug=True, port=5006)