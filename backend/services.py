from flask import jsonify
from models import Services
from app import app
import time
from flask import request
from app import db

@app.route('/get-all-services', methods=['GET'])
def get_all_services():
    all_services = Services.query.all()
    services = [service.json() for service in all_services]
    print(services)
    return jsonify({'results': services})

@app.route('/get-service-by-sid/<int:sid>', methods=['GET'])
def get_service_by_sid(sid):
    service = Services.query.filter_by(sid=sid).first().json()
    return jsonify({'results': service})
    
@app.route('/add-service', methods=['POST'])
def add_service():
    data = request.get_json()
    new_service = Services(**data)
    db.session.add(new_service)
    db.session.commit()
    return jsonify({'message': 'Service added successfully!'})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
