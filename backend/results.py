from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///is484.db'
db = SQLAlchemy(app)

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

@app.route('/get-all-results', methods=['GET'])
def get_all_results():
    all_results = Result.query.all()
    results = [{'datetime': result.datetime, 'mid': result.mid, 'cid': result.cid, 'disk_usage': result.disk_usage,
                'traffic_in': result.traffic_in, 'traffic_out': result.traffic_out, 'clock': result.clock,
                'cpu_usage': result.cpu_usage, 'system_uptime': result.system_uptime, 'memory_usage': result.memory_usage} for result in all_results]
    return jsonify(results)

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True, port=5004)
