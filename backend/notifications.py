from flask import jsonify
from models import db, Notifications
from app import app

@app.route('/get-all-notifications', methods=['GET'])
def get_all_notifications():
    all_notifications = Notifications.query.all()
    notifications = [notification.json() for notification in all_notifications]
    return jsonify(notifications)

@app.route('/mark-notification-as-read/<int:nid>', methods=['PUT'])
def mark_notification_as_read(nid):
    notification = Notifications.query.filter_by(nid=nid).first()
    if notification:
        try:
            notification.isRead = True
            db.session.merge(notification)
            db.session.commit()
            return jsonify({"message": f"Notification with nid {nid} marked as read successfully"}), 200
        except Exception as e:
            db.session.rollback() 
            return jsonify({"error": "An error occurred while updating the notification."}), 500
    else:
        return jsonify({"error": f"Notification with nid {nid} not found"}), 404

@app.route('/mark-all-notifications-as-read', methods=['PUT'])
def mark_all_notifications_as_read():
    try:
        Notifications.query.update({Notifications.isRead: True})
        db.session.commit()
        return jsonify({"message": "All notifications marked as read successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An error occurred while updating the notifications."}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5008)