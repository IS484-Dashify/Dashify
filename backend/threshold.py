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

class Thresholds(db.Model):
    tid = db.Column(db.Integer, primary=True)
    mid = db.Column(db.Integer, db.ForeignKey('machine.mid'))
    sid = db.Column(db.Integer, db.ForeignKey('service.sid'))    
    cid = db.Column(db.Integer, db.ForeignKey('component.cid'))
    threshold = db.Column(db.Float)

    def json(self):
        return {
            "tid": self.tid,
            "mid": self.mid,
            "sid": self.sid,
            "cid": self.cid,
            "threshold": self.threshold
        }

@app.route('/get-all-thresholds', methods=['GET'])
def get_all_thresholds():
    all_thresholds = Thresholds.query.all()
    thresholds = [thresholds.json() for threshold in all_thresholds]
    return jsonify(thresholds)

@app.route('/get-threshold-by-mid-sid-cid/<int:sid>/<int:mid>/<int:cid>', methods=['GET'])
def get_threshold_by_mid_and_sid_and_cid(sid, mid, cid):
    threshold = Thresholds.query.filter_by(sid=sid, mid=mid, cid=cid).all()
    return jsonify({'result': threshold})
    
if __name__ == '__main__':
    app.run(debug=True, port=5005)
