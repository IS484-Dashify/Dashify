from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from os import environ
import requests

app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:rootroot@localhost:3306/IS484'
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('dbURL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

class Component(db.Model):
    cid = db.Column(db.Integer, primary_key=True)
    mid = db.Column(db.Integer, db.ForeignKey('machine.mid'))
    name = db.Column(db.Text)

    def json(self):
        return {
            "cid": self.cid,
            "mid": self.mid,
            "name": self.name
        }

@app.route('/get-all-components', methods=['GET'])
def get_all_components():
    all_components = Component.query.all()
    components = [component.json() for component in all_components]
    return jsonify({"results": components})

@app.route('/get-cid-by-mid/<int:mid>', methods=['GET'])
def get_cid_values_by_mid(mid):
    components = Component.query.filter_by(mid=mid).all()
    cids = [component.cid for component in components]
    return jsonify({"results": cids})

@app.route('/get-data-from-app-b/<int:cid>/<int:mid>', methods=['GET'])
def get_component_status():
    try:
        response = requests.get(f'http://localhost:5004/get-all-components/{cid}/{mid}')
        response = response.json()
        return response
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True, port=5003)
