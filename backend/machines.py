from flask import jsonify, request
from models import Machines
from app import app, db

@app.route('/get-all-machines', methods=['GET'])
def get_all_machines():
    all_machines = Machines.query.all()
    machines = [machine.json() for machine in all_machines]
    return jsonify(machines)

@app.route('/get-machine-details-by-mid/<int:mid>', methods=['GET'])
def get_machine_details_by_mid(mid):
    machine = Machines.query.filter_by(mid=mid).first()
    return jsonify(machine.json())

@app.route('/get-mid-by-sid/<int:sid>', methods=['GET'])
def get_mid_values_by_sid(sid):
    machines = Machines.query.filter_by(sid=sid).all()
    mids = [machine.mid for machine in machines]
    print(mids)
    return jsonify({'results': mids})   

@app.route('/add-machine', methods=['POST'])
def add_machine():
    data = request.get_json()
    new_machine = Machines(**data)
    db.session.add(new_machine)
    db.session.commit()
    return jsonify({'message': 'Machine added successfully!'})

if __name__ == '__main__':
    app.run(debug=True, port=5002)
