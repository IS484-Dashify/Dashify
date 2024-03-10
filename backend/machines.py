from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///is484.db'
db = SQLAlchemy(app)

class Machine(db.Model):
    mid = db.Column(db.Integer, primary_key=True)
    sid = db.Column(db.Integer, db.ForeignKey('service.sid'))
    name = db.Column(db.Text)
    location = db.Column(db.Text)

@app.route('/get-all-machines', methods=['GET'])
def get_all_machines():
    all_machines = Machine.query.all()
    machines = [{'mid': machine.mid, 'sid': machine.sid, 'name': machine.name, 'location': machine.location} for machine in all_machines]
    return jsonify(machines)

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True, port=5002)
