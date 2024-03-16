from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Machines(db.Model):
    mid = db.Column(db.Integer, primary_key=True)
    sid = db.Column(db.Integer, db.ForeignKey('services.sid'))
    name = db.Column(db.Text)
    location = db.Column(db.Text)
    country = db.Column(db.Text)

    def json(self):
        return {
            "mid": self.mid,
            "sid": self.sid,
            "name": self.name,
            "location": self.location,
            "country": self.country
        }

class Results(db.Model):
    datetime = db.Column(db.DateTime, primary_key=True)
    mid = db.Column(db.Integer, db.ForeignKey('machines.mid'))
    cid = db.Column(db.Integer, db.ForeignKey('components.cid'))
    disk_usage = db.Column(db.Float)
    traffic_in = db.Column(db.Integer)
    traffic_out = db.Column(db.Integer)
    clock = db.Column(db.Float)
    cpu_usage = db.Column(db.Float)
    system_uptime = db.Column(db.Float)
    memory_usage = db.Column(db.Float)

    __table_args__ = (
        db.PrimaryKeyConstraint(datetime, mid, cid),
    )

    def json(self):
        return {
            "datetime": self.datetime.strftime('%Y-%m-%d %H:%M:%S'),  # Format datetime as string
            "mid": self.mid,
            "cid": self.cid,
            "disk_usage": self.disk_usage,
            "traffic_in": self.traffic_in,
            "traffic_out": self.traffic_out,
            "clock": self.clock,
            "cpu_usage": self.cpu_usage,
            "system_uptime": self.system_uptime,
            "memory_usage": self.memory_usage
        }

class Services(db.Model):
    sid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)

    def json(self):
        return {
            "sid": self.sid,    
            "name": self.name
        }
    
class Components(db.Model):
    cid = db.Column(db.Integer, primary_key=True)
    mid = db.Column(db.Integer, db.ForeignKey('machines.mid'))
    name = db.Column(db.Text)

    def json(self):
        return {
            "cid": self.cid,
            "mid": self.mid,
            "name": self.name
        }

class Thresholds(db.Model):
    cid = db.Column(db.Integer, db.ForeignKey('components.cid'), primary_key=True)
    warning = db.Column(db.Float)
    critical = db.Column(db.Float)

    def json(self):
        return {
            "cid": self.cid,
            "warning": self.warning,
            "critical": self.critical
        }