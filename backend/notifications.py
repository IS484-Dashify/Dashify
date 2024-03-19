from flask import jsonify
from models import Notifications
from app import app

@app.route('/get-all-notifications', methods=['GET'])
def get_all_notifications():
    all_notifications = Notifications.query.all()
    notifications = [notification.json() for notification in all_notifications]
    return jsonify(notifications)


if __name__ == '__main__':
    app.run(debug=True, port=5008)