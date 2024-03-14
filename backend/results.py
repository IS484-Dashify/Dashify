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

@app.route('/get-result-status/<int:cid>/<int:mid>', methods=['GET'])
def get_last_result(cid, mid):
    last_result = Result.query.filter_by(cid=cid, mid=mid).order_by(Result.datetime.desc()).first()
    
    if last_result:
        if last_result.system_uptime == 0:
            return {"status": "red"}
        
        statuses = []

        if last_result.disk_usage > 90:
            statuses.append('red')
        elif last_result.disk_usage > 70:
            statuses.append('amber')
        else:
            statuses.append('green')

        if last_result.traffic_in > 1000:
            statuses.append('red')
        elif last_result.traffic_in > 500:
            statuses.append('amber')
        else:
            statuses.append('green')

        if last_result.traffic_out > 1000:
            statuses.append('red')
        elif last_result.traffic_out > 500:
            statuses.append('amber')
        else:
            statuses.append('green')

        if last_result.cpu_usage > 90:
            statuses.append('red')
        elif last_result.cpu_usage > 70:
            statuses.append('amber')
        else:
            statuses.append('green')

        if last_result.memory_usage > 90:
            statuses.append('red')
        elif last_result.memory_usage > 70:
            statuses.append('amber')
        else:
            statuses.append('green')
        
        if 'red' in statuses:
            return {"status": "red"}
        elif 'amber' in statuses:
            return {"status": "amber"}
        else:
            return {"status": "green"}

    else:
        return jsonify({"message": "No result found for the specified cid and mid."})
    

if __name__ == '__main__':
    app.run(debug=True, port=5004)
