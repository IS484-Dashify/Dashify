from flask import request, jsonify
from models import db, Thresholds, Components
from helper import doesComponentExist, doesThresholdExist
from app import app

@app.route('/get-user/<str:email>', methods=['GET'])
def get_user_by_email(email):
    # TODO: Define User model
    user = User.query.filter_by(email).first()
    user = user.json()
    return jsonify({'results': user})
    
if __name__ == '__main__':
    app.run(debug=True, port=5010)
