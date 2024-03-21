from flask import jsonify
from models import Notifications
from app import app, db

@app.route('/get-all-notifications', methods=['GET'])
def get_all_notifications():
    all_notifications = Notifications.query.all()
    notifications = [notification.json() for notification in all_notifications]
    return jsonify(notifications)

@app.route('/mark-notification-as-read/<int:nid>', methods=['PUT'])
def mark_notification_as_read(nid):
    notification = Notifications.query.filter_by(nid=nid).first()
    if notification:
        notification.isRead = 1
        print(notification)
        print(notification.isRead)
        db.session.commit()
        return jsonify({"message": f"Notification with nid {nid} marked as read successfully"})
    else:
        return jsonify({"error": f"Notification with nid {nid} not found"}), 404


if __name__ == '__main__':
    app.run(debug=True, port=5008)