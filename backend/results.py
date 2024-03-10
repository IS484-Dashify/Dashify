from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from os import environ

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

class Result(db.Model):
    datetime = db.Column(db.DateTime, primary_key=True)
    mid = db.Column(db.Integer, db.ForeignKey('machine.mid'))
    cid = db.Column(db.Integer, db.ForeignKey('component.cid'))
    disk_usage = db.Column(db.Float)
    traffic_in = db.Column(db.Integer)
    traffic_out = db.Column(db.Integer)
    clock = db.Column(db.Float)
    cpu_usage = db.Column(db.Float)
    system_uptime = db.Column(db.Float)
    memory_usage = db.Column(db.Float)

    def json(self):
        return {
            "datetime": self.datetime.strftime('%Y-%m-%d %H:%M:%S'),  # Format datetime as string
            "mid": self.mid,
            "cid": self.cid,
            "disk_usage": self.disk_usage,
            "traffic_in": self.traffic_in,
            "traffic_out": self.traffic_out,
            "clock": self.clock,
            "cpu_usage": self.cpu_usage,
            "system_uptime": self.system_uptime,
            "memory_usage": self.memory_usage
        }

@app.route('/get-all-results', methods=['GET'])
def get_all_results():
    all_results = Result.query.all()
    results = [result.json() for result in all_results]
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True, port=5004)
