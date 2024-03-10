from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from os import environ

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

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True, port=5002)
