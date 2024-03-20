DROP DATABASE IF EXISTS IS484;
CREATE DATABASE IS484;
USE IS484;

CREATE TABLE SERVICES(
    SID INTEGER PRIMARY KEY,
    NAME TEXT
);

INSERT INTO SERVICES (SID, NAME) VALUES(1, 'Service 1');
INSERT INTO SERVICES (SID, NAME) VALUES(2, 'Service 2');

CREATE TABLE MACHINES(
    MID INTEGER PRIMARY KEY,
    SID INTEGER,
    NAME TEXT,
    LOCATION TEXT,
    COUNTRY TEXT,
    ISO TEXT,
    FOREIGN KEY(SID) REFERENCES SERVICES(SID)
);
INSERT INTO MACHINES (MID, SID, NAME, LOCATION, COUNTRY, ISO) VALUES(1, 1, 'VM1', '[9.5018, 562639]', 'Denmark', 'DK');
INSERT INTO MACHINES (MID, SID, NAME, LOCATION, COUNTRY, ISO) VALUES(2, 1, 'VM2', '[9.5018, 562639]', 'Denmark', 'DK');
INSERT INTO MACHINES (MID, SID, NAME, LOCATION, COUNTRY, ISO) VALUES(3, 2, 'VM3', '[9.5018, 562639]', 'Denmark', 'DK');
INSERT INTO MACHINES (MID, SID, NAME, LOCATION, COUNTRY, ISO) VALUES(4, 2, 'VM4', '[9.5018, 562639]', 'Denmark', 'DK');

CREATE TABLE COMPONENTS(
    CID INTEGER PRIMARY KEY,
    MID INTEGER,
    NAME TEXT,
    FOREIGN KEY(MID) REFERENCES MACHINES(MID)
);

INSERT INTO COMPONENTS (CID, MID, NAME) VALUES(1, 1, 'Node.js Server 1');
INSERT INTO COMPONENTS (CID, MID, NAME) VALUES(2, 1, 'SQL Server 1');
INSERT INTO COMPONENTS (CID, MID, NAME) VALUES(3, 1, 'Machine 1');
INSERT INTO COMPONENTS (CID, MID, NAME) VALUES(4, 2, 'Node.js Server 2');
INSERT INTO COMPONENTS (CID, MID, NAME) VALUES(5, 2, 'SQL Server 2');
INSERT INTO COMPONENTS (CID, MID, NAME) VALUES(6, 2, 'Machine 2');
INSERT INTO COMPONENTS (CID, MID, NAME) VALUES(7, 3, 'Node.js Server 3');
INSERT INTO COMPONENTS (CID, MID, NAME) VALUES(8, 3, 'SQL Server 3');
INSERT INTO COMPONENTS (CID, MID, NAME) VALUES(9, 3, 'Machine 3');
INSERT INTO COMPONENTS (CID, MID, NAME) VALUES(10, 4, 'Node.js Server 4');
INSERT INTO COMPONENTS (CID, MID, NAME) VALUES(11, 4, 'SQL Server 4');
INSERT INTO COMPONENTS (CID, MID, NAME) VALUES(12, 4, 'Machine 4');

CREATE TABLE RESULTS(
    DATETIME DATETIME,
    MID INTEGER,
    CID INTEGER,
    DISK_USAGE FLOAT,
    TRAFFIC_IN INTEGER,
    TRAFFIC_OUT INTEGER,
    CLOCK FLOAT,
    CPU_USAGE FLOAT,    
    SYSTEM_UPTIME FLOAT,
    MEMORY_USAGE FLOAT,
    PRIMARY KEY(DATETIME, MID, CID),
    FOREIGN KEY(MID, CID) REFERENCES COMPONENTS(MID, CID)
);

-- cid 1 mock data for happy path
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 17:54:03', 1, 1, '32.87', '100', '35312', '1709200443', '0.43', '44573', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 17:56:03', 1, 1, '31.87', '300', '35312', '1709200443', '0.40', '44573', '2.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 17:55:03', 1, 1, '34.87', '200', '35312', '1709200443', '0.42', '44573', '4.0');

-- cid 2 mock data for system down
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 17:54:03', 1, 2, '0', '0', '0', '1709200443', '0', '0', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 18:54:03', 1, 2, '0', '0', '0', '1709200443', '0', '0', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 19:54:03', 1, 2, '0', '0', '0', '1709200443', '0', '0', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 20:54:03', 1, 2, '0', '0', '0', '1709200443', '0', '0', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 21:34:34', 1, 2, '0', '0', '0', '1709200443', '0', '0', '0.0');

-- cid 3 test for metrics warning/critical
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 17:54:03', 1, 3, '32.87', '0', '35312', '1709200443', '0.43', '44573', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 17:55:03', 1, 3, '33.87', '0', '35312', '1709200443', '9', '44573', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 17:56:03', 1, 3, '34.87', '0', '35312', '1709200443', '14', '44573', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 17:57:03', 1, 3, '35.87', '0', '35312', '1709200443', '39', '44573', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 17:58:03', 1, 3, '49', '0', '35312', '1709200443', '67', '44573', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 17:59:03', 1, 3, '52.8', '0', '35312', '1709200443', '69', '44573', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 18:00:00', 1, 3, '62', '0', '35312', '1709200443', '82', '44573', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 18:01:03', 1, 3, '67', '0', '35312', '1709200443', '88', '44573', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 18:02:03', 1, 3, '75', '0', '35312', '1709200443', '91', '44573', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 18:03:03', 1, 3, '78.8', '0', '35312', '1709200443', '95', '44573', '0.0');

INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 17:54:03', 2, 4, '32.87', '0', '35312', '1709200443', '0.43', '44573', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 17:54:03', 2, 5, '32.87', '0', '35312', '1709200443', '0.43', '44573', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 17:54:03', 2, 6, '32.87', '0', '35312', '1709200443', '0.43', '44573', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 17:54:03', 3, 7, '32.87', '0', '35312', '1709200443', '0.43', '44573', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 17:54:03', 3, 8, '32.87', '0', '35312', '1709200443', '0.43', '44573', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 17:54:03', 3, 9, '32.87', '0', '35312', '1709200443', '0.43', '44573', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 17:54:03', 4, 10, '32.87', '0', '35312', '1709200443', '0.43', '44573', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 17:54:03', 4, 11, '32.87', '0', '35312', '1709200443', '0.43', '44573', '0.0');
INSERT INTO RESULTS (DATETIME, MID, CID, DISK_USAGE, TRAFFIC_IN, TRAFFIC_OUT, CLOCK, CPU_USAGE, SYSTEM_UPTIME, MEMORY_USAGE) VALUES('2024-02-29 17:54:03', 4, 12, '32.87', '0', '35312', '1709200443', '0.43', '44573', '0.0');

CREATE TABLE THRESHOLDS(
    CID INTEGER PRIMARY KEY,
    WARNING FLOAT,
    CRITICAL FLOAT,
    FOREIGN KEY(CID) REFERENCES COMPONENTS(CID)
);

INSERT INTO THRESHOLDS (CID, WARNING, CRITICAL) VALUES(1, '80.0', '90.0');
INSERT INTO THRESHOLDS (CID, WARNING, CRITICAL) VALUES(2, '80.0', '90.0');
INSERT INTO THRESHOLDS (CID, WARNING, CRITICAL) VALUES(3, '80.0', '90.0');
INSERT INTO THRESHOLDS (CID, WARNING, CRITICAL) VALUES(4, '80.0', '90.0');
INSERT INTO THRESHOLDS (CID, WARNING, CRITICAL) VALUES(5, '80.0', '90.0');
INSERT INTO THRESHOLDS (CID, WARNING, CRITICAL) VALUES(6, '80.0', '90.0');
INSERT INTO THRESHOLDS (CID, WARNING, CRITICAL) VALUES(7, '80.0', '90.0');
INSERT INTO THRESHOLDS (CID, WARNING, CRITICAL) VALUES(8, '80.0', '90.0');
INSERT INTO THRESHOLDS (CID, WARNING, CRITICAL) VALUES(9, '80.0', '90.0');
INSERT INTO THRESHOLDS (CID, WARNING, CRITICAL) VALUES(10, '80.0', '90.0');
INSERT INTO THRESHOLDS (CID, WARNING, CRITICAL) VALUES(11, '80.0', '90.0');
INSERT INTO THRESHOLDS (CID, WARNING, CRITICAL) VALUES(12, '80.0', '90.0');

CREATE TABLE PUSHER (
    PID INTEGER PRIMARY KEY,
    APPID TEXT,
    APP_KEY TEXT,
    APP_SECRET TEXT,
    CLUSTER TEXT,
    USETLS BOOLEAN
);

INSERT INTO PUSHER (PID, APPID, APP_KEY, APP_SECRET, CLUSTER, USETLS) VALUES(1, '1765322', '580e608d2e758884818e', 'e8929c30ac69eebcabfd', 'ap1', 1);

CREATE TABLE NOTIFICATIONS (
    NID INTEGER PRIMARY KEY,
    CID INTEGER,
    ISREAD BOOLEAN,
    REASON TEXT,
    DATETIME DATETIME,
    STATUS TEXT,
    FOREIGN KEY(CID) REFERENCES COMPONENTS(CID)
);

INSERT INTO NOTIFICATIONS (NID, CID, ISREAD, REASON, DATETIME, STATUS) VALUES(1, 1, 1, 'High CPU Usage', '2024-02-29 17:54:03', 'Critical');
INSERT INTO NOTIFICATIONS (NID, CID, ISREAD, REASON, DATETIME, STATUS) VALUES(2, 2, 1, 'High Memory Usage', '2024-02-29 17:54:03', 'Warning');
INSERT INTO NOTIFICATIONS (NID, CID, ISREAD, REASON, DATETIME, STATUS) VALUES(3, 3, 0, 'High CPU Usage', '2024-02-29 17:54:03', 'Critical');
INSERT INTO NOTIFICATIONS (NID, CID, ISREAD, REASON, DATETIME, STATUS) VALUES(4, 4, 0, 'High Memory Usage', '2024-02-29 17:54:03', 'Warning');
INSERT INTO NOTIFICATIONS (NID, CID, ISREAD, REASON, DATETIME, STATUS) VALUES(5, 1, 1, 'High CPU Usage', '2024-02-29 17:54:03', 'Critical');
INSERT INTO NOTIFICATIONS (NID, CID, ISREAD, REASON, DATETIME, STATUS) VALUES(6, 2, 1, 'High Memory Usage', '2024-02-29 17:54:03', 'Warning');
INSERT INTO NOTIFICATIONS (NID, CID, ISREAD, REASON, DATETIME, STATUS) VALUES(7, 3, 0, 'High CPU Usage', '2024-02-29 17:54:03', 'Critical');
INSERT INTO NOTIFICATIONS (NID, CID, ISREAD, REASON, DATETIME, STATUS) VALUES(8, 4, 0, 'High Memory Usage', '2024-02-29 17:54:03', 'Warning');
INSERT INTO NOTIFICATIONS (NID, CID, ISREAD, REASON, DATETIME, STATUS) VALUES(9, 1, 1, 'High CPU Usage', '2024-02-29 17:54:03', 'Critical');
INSERT INTO NOTIFICATIONS (NID, CID, ISREAD, REASON, DATETIME, STATUS) VALUES(10, 2, 1, 'High Memory Usage', '2024-02-29 17:54:03', 'Warning');
INSERT INTO NOTIFICATIONS (NID, CID, ISREAD, REASON, DATETIME, STATUS) VALUES(11, 3, 0, 'High CPU Usage', '2024-02-29 17:54:03', 'Critical');
INSERT INTO NOTIFICATIONS (NID, CID, ISREAD, REASON, DATETIME, STATUS) VALUES(12, 4, 0, 'High Memory Usage', '2024-02-29 17:54:03', 'Warning');
