from flask import jsonify
import requests
from app import app

@app.route('/get-all-names-and-sid', methods=['GET'])
def get_all_names_and_sid():
    output = {}
    response2 = requests.get(f'http://127.0.0.1:5003/get-all-components')
    components = response2.json()["results"]
    for component in components:
        mid = component["mid"]
        componentName = component["name"]
        response3 = requests.get(f'http://127.0.0.1:5002/get-machine-details-by-mid/{mid}')
        machine = response3.json()
        sid = machine["sid"]
        machineName = machine["name"]
        response4 = requests.get(f'http://127.0.0.1:5001/get-service-by-sid/{sid}')
        service = response4.json()
        serviceName = service["results"]["name"]    
        details = {
        "cName": componentName,
        "mName":machineName,
        "sName":serviceName,
        "sid": sid
        }
        output[component["cid"]] = details
    return jsonify(output)

@app.route('/get-all-names-and-country', methods=['GET'])
def get_all_names_and_country():
    output = {}
    response2 = requests.get(f'http://127.0.0.1:5003/get-all-components')
    components = response2.json()["results"]
    for component in components:
        mid = component["mid"]
        componentName = component["name"]
        response3 = requests.get(f'http://127.0.0.1:5002/get-machine-details-by-mid/{mid}')
        machine = response3.json()
        sid = machine["sid"]
        country = machine["country"]
        machineName = machine["name"]
        response4 = requests.get(f'http://127.0.0.1:5001/get-service-by-sid/{sid}')
        service = response4.json()
        serviceName = service["results"]["name"]    
        details = {
        "cName": componentName,
        "country": country,
        "mName":machineName,
        "sName":serviceName
        }
        output[component["cid"]] = details
    return jsonify(output)

if __name__ == '__main__':
    app.run(debug=True, port=5009)