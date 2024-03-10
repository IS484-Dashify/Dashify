from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from os import environ

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL')
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
    return jsonify(components)

@app.route('/get-component', methods=['GET'])
def get_component():
    datetime_val = request.args.get('datetime')
    mid_val = request.args.get('mid')
    cid_val = request.args.get('cid')

    if not datetime_val or not mid_val or not cid_val:
        return jsonify({'error': 'Please provide datetime, mid, and cid parameters.'}), 400

    component = Component.query.filter_by(mid=mid_val, cid=cid_val).first()

    if component:
        return jsonify(component.json())
    else:
        return jsonify({'error': 'Component not found.'}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5003)
