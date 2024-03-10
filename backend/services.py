from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///is484.db'
db = SQLAlchemy(app)

class Service(db.Model):
    sid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)

@app.route('/get-all-services', methods=['GET'])
def get_all_services():
    all_services = Service.query.all()
    services = [{'sid': service.sid, 'name': service.name} for service in all_services]
    return jsonify(services)

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True, port=5001)