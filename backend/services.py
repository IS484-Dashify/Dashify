from flask import jsonify
from models import Services
from app import app

@app.route('/get-all-services', methods=['GET'])
def get_all_services():
    all_services = Services.query.all()
    services = [service.json() for service in all_services]
    print(services)
    return jsonify({'results': services})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
