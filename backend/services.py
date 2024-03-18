from flask import jsonify
from models import Services
from app import app
import time

@app.route('/get-all-services', methods=['GET'])
def get_all_services():
    overall_start_time = time.time()
    all_services = Services.query.all()
    services = [service.json() for service in all_services]
    print(services)
    overall_end_time = time.time()
    app.logger.info(f"Overall Request took {overall_end_time - overall_start_time:.6f} seconds")
    return jsonify({'results': services})

@app.route('/get-service-by-sid/<int:sid>', methods=['GET'])
def get_service_by_sid(sid):
    overall_start_time = time.time()
    service = Services.query.filter_by(sid=sid).first().json()
    overall_end_time = time.time()
    app.logger.info(f"Overall Request took {overall_end_time - overall_start_time:.6f} seconds")
    return jsonify({'results': service})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
