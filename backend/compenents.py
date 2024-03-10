from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///is484.db'
db = SQLAlchemy(app)

class Component(db.Model):
    cid = db.Column(db.Integer, primary_key=True)
    mid = db.Column(db.Integer, db.ForeignKey('machine.mid'))
    name = db.Column(db.Text)

@app.route('/get-all-components', methods=['GET'])
def get_all_components():
    all_components = Component.query.all()
    components = [{'cid': component.cid, 'mid': component.mid, 'name': component.name} for component in all_components]
    return jsonify(components)

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True, port=5003)
