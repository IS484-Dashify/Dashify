from flask import jsonify, request
from models import Components
from app import app, db
import requests
from os import environ
from dotenv import load_dotenv
load_dotenv()

@app.route('/get-all-components', methods=['GET'])
def get_all_components():
    all_components = Components.query.all()
    components = [component.json() for component in all_components]
    return jsonify({"results": components})

@app.route('/get-component-details-by-cid/<int:cid>', methods=['GET'])
def get_component_details_by_cid(cid):
    component = Components.query.filter_by(cid=cid).first()
    return jsonify(component.json())

@app.route('/get-cid-by-mid/<int:mid>', methods=['GET'])
def get_cid_values_by_mid(mid):
    components = Components.query.filter_by(mid=mid).all()
    cids = [component.cid for component in components]
    return jsonify({"results": cids})

@app.route('/add-component', methods=['POST'])
def add_component():
    data = request.get_json()
    component = Components(**data)
    db.session.add(component)
    db.session.commit()
    try:
        requests.post(environ.get('createThresholdURL'), json={
            "cid": data.get('cid'),
            "Warning": 80,
            "Critical": 90
        })
    except Exception as e:
        return jsonify({'error': 'There was an error creating the new component\'s threshold: ' + str(e)})

    try:
        requests.post(environ.get('setupEnvURL'), json={
            "cid": data.get('cid'),
            "email": environ.get('authorisedUserEmail'),
            "vmUsername": environ.get('vmUsername'),
            "vmIpAddress": environ.get('vmIpAddress'),
            "vmPassword": environ.get('vmPassword')
        })
    except Exception as e:
        return jsonify({'error': 'There was an error setting up the log monitoring environment for the new component: ' + str(e)})
    
    return jsonify({'message': 'Component added successfully'})

@app.route('/update-component/<int:cid>', methods=['PUT'])
def update_component(cid):
    component = Components.query.filter_by(cid=cid).first()
    data = request.get_json()
    component.update(**data)
    db.session.commit()
    return jsonify({'message': 'Component updated successfully'})

@app.route('/delete-component/<int:cid>', methods=['DELETE'])
def delete_component(cid):
    component = Components.query.filter_by(cid=cid).first()
    db.session.delete(component)
    db.session.commit()
    return jsonify({'message': 'Component deleted successfully'})


    
if __name__ == '__main__':
    app.run(debug=True, port=5003)
