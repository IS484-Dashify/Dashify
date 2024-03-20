from flask import request, jsonify
from models import *

# .first() returns either the item or None, can't use len()
def doesComponentExist(cid):
    """
    A function that checks if a component exists in the database

    Parameters:
    cid (int): The component id
    mid (int): The machine id

    Returns:
    component (object): The component object if it exists, False otherwise
    """
    component = Components.query.filter_by(cid=cid).first()
    if component:
        return component
    else:
        return False
    
# .first() returns either the item or None, can't use len()
def doesThresholdExist(cid):
    """
    A function that checks if a threshold exists in the database

    Parameters:
    cid (int): The component id
    mid (int): The machine id

    Returns:
    threshold (object): The threshold object if it exists, False otherwise
    """
    threshold = Thresholds.query.filter_by(cid=cid).first()
    if threshold:
        return threshold
    else:
        return False
    
def convertLocationToList(location):
    location = location.strip('[').strip(']').split(', ') 
    return location


def safe_convert(value, target_type):
    """
    A function that safely converts a value to a target type
    """
    try:
        return target_type(value)
    except (ValueError, TypeError):
        return None