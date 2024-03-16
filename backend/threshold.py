from flask import request, jsonify
from models import db, Thresholds, Components
from helper import doesComponentExist, doesThresholdExist
from app import app

@app.route('/get-all-thresholds', methods=['GET'])
def get_all_thresholds():
    all_thresholds = Thresholds.query.all()
    thresholds = [threshold.json() for threshold in all_thresholds]
    return jsonify(thresholds)

@app.route('/get-thresholds-by-mid-cid/<int:mid>/<int:cid>', methods=['GET'])
def get_thresholds_by_mid_and_cid(mid, cid):
    threshold = Thresholds.query.filter_by(mid=mid, cid=cid).first()
    threshold = threshold.json()
    return jsonify({'results': threshold})

@app.route('/create-threshold', methods=['POST'])
def create_threshold():
    data = request.get_json()
    request_mid = data["mid"]
    request_cid = data["cid"]
    request_warning = data["warning"]
    request_critical = data["critical"]

    # check if component exists
    # component = Components.query.filter_by(cid=request_cid, mid=request_mid).first()
    componentExists = doesComponentExist(request_cid, request_mid)
    if componentExists:
        component = componentExists.json()
        thresholdExists = doesThresholdExist(request_cid, request_mid)
        # check if threshold already exists for this component
        if thresholdExists:
            return jsonify({'error': 'Threshold already exists'}), 400
        try:
            new_threshold = Thresholds(cid=request_cid, mid=request_mid, warning=request_warning, critical=request_critical)
            db.session.add(new_threshold)
            db.session.commit()
            return_message = {
                'message': 'New threshold for sid: ' + str(data['sid']) + ', mid: ' + str(data['mid']) + ', cid: ' + str(data['cid']) + ' created!'
            }

            return jsonify(return_message)
        
        except Exception as e:
            return_message = {
                'error': 'There was an error adding the new threshold: ' + str(e)
            }

    else:
        return jsonify({'error': 'Component not found'}), 404

@app.route('/update-threshold', methods=['PUT'])
def update_threshold():
    data = request.get_json()
    request_mid = data["mid"]
    request_cid = data["cid"]
    request_warning = data["warning"]
    request_critical = data["critical"]
    try:
        # check if component exists
        componentExists = doesComponentExist(request_cid, request_mid)
        if componentExists:
            component = componentExists.json()
            # check if threshold already exists for this component
            thresholdExists = doesThresholdExist(request_cid, request_mid)
            if not thresholdExists:
                return jsonify({'error': 'Threshold doesn\'t exist'}), 400
            else:
                thresholdExists.warning = request_warning
                thresholdExists.critical = request_critical
                db.session.commit()
                return_message = {
                    'message': 'Threshold for mid: ' + str(data['mid']) + ', cid: ' + str(data['cid']) + ' updated!'
                }
        else:
            return jsonify({'error': 'Component not found'}), 404
    
    except Exception as e:
        return_message = {
            'error': 'There was an error updating the new threshold: ' + str(e)
        }

    return jsonify(return_message)
    
if __name__ == '__main__':
    app.run(debug=True, port=5005)
