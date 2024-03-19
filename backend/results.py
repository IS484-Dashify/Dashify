from flask import request, jsonify
from dotenv import load_dotenv

from models import db, Results
from app import app

@app.route('/get-all-results', methods=['GET'])
def get_all_results():
    all_results = Results.query.all()
    results = [result.json() for result in all_results]
    return jsonify({"results": results})

@app.route('/get-result/<int:cid>/<int:rows>', methods=['GET'])
def get_metrics_by_cid(cid, rows):
    try:
        results = Results.query.filter_by(cid=cid).order_by(Results.datetime.desc()).limit(rows)
        results_json = []
        if results:

            for row in results:
                results_json.append(row.json())
                
            # Return JSON response with the single result
            return jsonify(results_json), 200
        else:
            # Return an empty response with status code 404 if no results are found
            return jsonify({}), 404

    except Exception as e:
        # Handle any exceptions that occur during query execution
        error_message = str(e)
        return jsonify({'error': error_message}), 500


@app.route('/get-result-status/<int:cid>/<int:mid>', methods=['GET'])
def get_last_result(cid, mid):
    last_result = Results.query.filter_by(cid=cid, mid=mid).order_by(Results.datetime.desc()).first()
    print(last_result)
    
    if last_result:
        if last_result.system_uptime == 0:
            return jsonify({"status": "Critical"})
        
        statuses = []

        if last_result.disk_usage > 90:
            statuses.append('Critical')
        elif last_result.disk_usage > 70:
            statuses.append('Warning')
        else:
            statuses.append('Normal')

        if last_result.traffic_in > 1000:
            statuses.append('Critical')
        elif last_result.traffic_in > 500:
            statuses.append('Warning')
        else:
            statuses.append('Normal')

        if last_result.traffic_out > 100000:
            statuses.append('Critical')
        elif last_result.traffic_out > 50000:
            statuses.append('Warning')
        else:
            statuses.append('Normal')

        if last_result.cpu_usage > 90:
            statuses.append('Critical')
        elif last_result.cpu_usage > 70:
            statuses.append('Warning')
        else:
            statuses.append('Normal')

        if last_result.memory_usage > 90:
            statuses.append('Critical')
        elif last_result.memory_usage > 70:
            statuses.append('Warning')
        else:
            statuses.append('Normal')

        if 'Critical' in statuses:
            return jsonify({"status": "Critical"})
        elif 'Warning' in statuses:
            return jsonify({"status": "Warning"})
        else:
            return jsonify({"status": "Normal"})

    else:
        return jsonify({"message": "No result found for the specified cid and mid."})
    
@app.route('/add-result', methods=['POST'])
def add_result():
    data = request.json
    newResult = Results(
        datetime = data['datetime'],
        mid = int(data['mid']),
        cid = int(data['cid']),
        disk_usage = float(data['disk_usage']),
        traffic_in = int(data['traffic_in']),
        traffic_out = int(data['traffic_out']),
        clock = float(data['clock']),
        cpu_usage = float(data['cpu_usage']),
        system_uptime = float(data['system_uptime']),
        memory_usage = float(data['memory_usage'])
    )
    
    # TODO: Take care of foreign key error
    try:
        db.session.add(newResult)
        db.session.commit()
        
        return jsonify({"message": "Result added successfully.", "data": data, "status_code": 200}), 200
    except Exception as e:  
        return jsonify({"error": "An unexpected error occurCritical", "details": str(e), "status_code": 500}), 500
    
if __name__ == '__main__':
    app.run(debug=True, port=5004)
