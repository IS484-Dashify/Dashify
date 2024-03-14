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

class Services(db.Model):
    sid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)

    def json(self):
        return {
            "sid": self.sid,    
            "name": self.name
        }

@app.route('/get-all-services', methods=['GET'])
def get_all_services():
    all_services = Services.query.all()
    services = [service.json() for service in all_services]
    return jsonify(services)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
