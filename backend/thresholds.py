from flask import request, jsonify
from models import db, Thresholds, Components
from helper import doesComponentExist, doesThresholdExist
from app import app

@app.route('/get-all-thresholds', methods=['GET'])
def get_all_thresholds():
    all_thresholds = Thresholds.query.all()
    thresholds = [threshold.json() for threshold in all_thresholds]
    return jsonify(thresholds)

@app.route('/get-thresholds-by-cid/<int:cid>', methods=['GET'])
def get_thresholds_by_cid(cid):
    threshold = Thresholds.query.filter_by(cid=cid).first()
    threshold = threshold.json()
    return jsonify({'results': threshold})

@app.route('/create-threshold', methods=['POST'])
def create_threshold():
    data = request.get_json()
    request_cid = data["cid"]
    request_warning = data["Warning"]
    request_critical = data["Critical"]

    # check if component exists
    componentExists = doesComponentExist(request_cid)
    if componentExists:
        component = componentExists.json()
        thresholdExists = doesThresholdExist(request_cid)
        # check if threshold already exists for this component
        if thresholdExists:
            return jsonify({'error': 'Threshold already exists'}), 400
        try:
            new_threshold = Thresholds(cid=request_cid, warning=request_warning, critical=request_critical)
            db.session.add(new_threshold)
            db.session.commit()
            return_message = {
                'message': 'New threshold for cid: ' + str(request_cid) + ' created!'
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
    request_cid = data["cid"]
    request_warning = data["Warning"]
    request_critical = data["Critical"]
    request_traffic_in_warning = data["TrafficInWarning"]
    request_traffic_in_critical = data["TrafficInCritical"]
    request_traffic_out_warning = data["TrafficOutWarning"]
    request_traffic_out_critical = data["TrafficOutCritical"]
    
    try:
        # check if component exists
        componentExists = doesComponentExist(request_cid)
        if componentExists:
            # check if threshold already exists for this component
            thresholdExists = doesThresholdExist(request_cid)
            if not thresholdExists:
                return jsonify({'error': 'Threshold doesn\'t exist'}), 400
            else:
                thresholdExists.warning = request_warning
                thresholdExists.critical = request_critical
                thresholdExists.traffic_in_warning = request_traffic_in_warning
                thresholdExists.traffic_in_critical = request_traffic_in_critical
                thresholdExists.traffic_out_warning = request_traffic_out_warning
                thresholdExists.traffic_out_critical = request_traffic_out_critical
                db.session.commit()
                return_message = {
                    'message': 'Threshold for cid: ' + str(request_cid) + ' updated!'
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
