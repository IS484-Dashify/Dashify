from flask import jsonify
from models import Components
from app import app, db

@app.route('/get-all-components', methods=['GET'])
def get_all_components():
    all_components = Components.query.all()
    components = [component.json() for component in all_components]
    return jsonify({"results": components})

@app.route('/get-component-details-by-cid/<int:cid>', methods=['GET'])
def get_component_details_by_cid(cid):
    component = Components.query.filter_by(cid=cid).first()
    return jsonify(component.json())

@app.route('/get-cid-by-mid/<int:mid>', methods=['GET'])
def get_cid_values_by_mid(mid):
    components = Components.query.filter_by(mid=mid).all()
    cids = [component.cid for component in components]
    return jsonify({"results": cids})

    
if __name__ == '__main__':
    app.run(debug=True, port=5003)
