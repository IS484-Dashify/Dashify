from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from os import environ
import requests

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

class Machine(db.Model):
    mid = db.Column(db.Integer, primary_key=True)
    sid = db.Column(db.Integer, db.ForeignKey('service.sid'))
    name = db.Column(db.Text)
    location = db.Column(db.Text)

    def json(self):
        return {
            "mid": self.mid,
            "sid": self.sid,
            "name": self.name,
            "location": self.location
        }

@app.route('/get-all-machines', methods=['GET'])
def get_all_machines():
    all_machines = Machine.query.all()
    machines = [machine.json() for machine in all_machines]
    return jsonify(machines)

@app.route('/get-data-from-app-b/<int:mid>', methods=['GET'])
def get_component_status():
    try:
        
        response = requests.get(f'http://localhost:5004/get-all-components/{cid}/{mid}')
        response = response.json()
        return response
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

if __name__ == '__main__':
    app.run(debug=True, port=5002)
