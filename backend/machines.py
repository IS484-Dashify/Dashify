from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from os import environ
from dotenv import load_dotenv

load_dotenv()


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

class Machines(db.Model):
    mid = db.Column(db.Integer, primary_key=True)
    sid = db.Column(db.Integer, db.ForeignKey('service.sid'))
    name = db.Column(db.Text)
    location = db.Column(db.Text)
    country = db.Column(db.Text)

    def json(self):
        return {
            "mid": self.mid,
            "sid": self.sid,
            "name": self.name,
            "location": self.location,
            "country": self.country
        }

@app.route('/get-all-machines', methods=['GET'])
def get_all_machines():
    all_machines = Machines.query.all()
    machines = [machine.json() for machine in all_machines]
    return jsonify(machines)

@app.route('/get-mid-by-sid/<int:sid>', methods=['GET'])
def get_mid_values_by_sid(sid):
    machines = Machines.query.filter_by(sid=sid).all()
    mids = [machine.mid for machine in machines]
    print(mids)
    return jsonify({'results': mids})
    

if __name__ == '__main__':
    app.run(debug=True, port=5002)
