CREATE DATABASE IF NOT EXISTS soa_trust;

USE soa_trust;

DROP TABLE IF EXISTS Service;
CREATE TABLE Service (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(2048),
	display_name VARCHAR(2048),
	grade FLOAT,
	host VARCHAR(2048),
	port INT,
	url VARCHAR(2048),
	params TEXT,
	status INT,
	source_path VARCHAR(2048)
);

INSERT INTO Service(id, name, display_name, grade, host, port, url, params, status, source_path) VALUES
(1, 'localhost:4101','localhost:4101', 10.0, 'localhost', 4101, 'http://localhost:4101', '{}', -1, 'scenarios/simple/s1'),
(2, 'localhost:4102','localhost:4102', 5.0, 'localhost', 4102, 'http://localhost:4102', '{}', -1, 'scenarios/simple/s2'),
(3, 'localhost:4103','localhost:4103', 10.0, 'localhost', 4103, 'http://localhost:4103', '{}', -1, 'scenarios/1/s1'),
(4, 'localhost:4104','localhost:4104', 10.0, 'localhost', 4104, 'http://localhost:4104', '{}', -1, 'scenarios/1/s2'),
(5, 'localhost:4105','localhost:4105', 10.0, 'localhost', 4105, 'http://localhost:4105', '{}', -1, 'scenarios/1/s3'),
(6, 'localhost:4106','localhost:4106', 10.0, 'localhost', 4106, 'http://localhost:4106', '{}', -1, 'scenarios/2/s1'),
(7, 'localhost:4107','localhost:4107', 10.0, 'localhost', 4107, 'http://localhost:4107', '{}', -1, 'scenarios/2/s2'),
(8, 'localhost:4108','localhost:4108', 10.0, 'localhost', 4108, 'http://localhost:4108', '{}', -1, 'scenarios/2/s3'),
(18, 'localhost:6101','localhost:6101', 10.0, 'localhost', 6101, 'http://localhost:6101', '{}', -1, 'scenarios/active/simple/s1'),
(19, 'localhost:6102','localhost:6102', 10.0, 'localhost', 6102, 'http://localhost:6102', '{"load":20}', -1, 'scenarios/active/simple/s2'),
(20, 'localhost:6103','Travel Agent', 10.0, 'localhost', 6103, 'http://localhost:6103', '{}', -1, 'scenarios/active/demo/s1'),
(21, 'localhost:6104','Airline', 10.0, 'localhost', 6104, 'http://localhost:6104', '{}', -1, 'scenarios/active/demo/s2'),
(22, 'localhost:6105','Advertiser', 10.0, 'localhost', 6105, 'http://localhost:6105', '{}', -1, 'scenarios/active/demo/s3'),
(23, 'localhost:6106','Travel Agent', 10.0, 'localhost', 6106, 'http://localhost:6106', '{}', -1, 'scenarios/active/demo_https/s1'),
(24, 'localhost:6107','Airline', 10.0, 'localhost', 6107, 'http://localhost:6107', '{}', -1, 'scenarios/active/demo_https/s2'),
(25, 'localhost:6108','Travel Agent', 10.0, 'localhost', 6108, 'http://localhost:6108', '{}', -1, 'scenarios/active/demo_post/s1'),
(26, 'localhost:6109','Payment Gateway', 10.0, 'localhost', 6109, 'http://localhost:6109', '{}', -1, 'scenarios/active/demo_post/s2'),
(30, 'localhost:6110','localhost:6110', 10.0, 'localhost', 6110, 'http://localhost:6110', '{}', -1, 'scenarios/active/demo_redirect/s1'),
(31, 'localhost:6111','localhost:6111', 10.0, 'localhost', 6111, 'http://localhost:6111', '{"redirect":"http://localhost:6112/get_price", "status":"dead"}', -1, 'scenarios/active/demo_redirect/s2'),
(32, 'localhost:6112','localhost:6112', 10.0, 'localhost', 6112, 'http://localhost:6112', '{"Status":"Backup service"}', -1, 'scenarios/active/demo_redirect/s3');


DROP TABLE IF EXISTS Service_Trust;
CREATE TABLE Service_Trust (
	service_id INT NOT NULL,
	trust_module VARCHAR(512) NOT NULL,
	trust_level FLOAT,
	last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(service_id, trust_module)
);

DROP TABLE IF EXISTS Interaction;
CREATE TABLE Interaction (
	id VARCHAR(512) PRIMARY KEY,
	from_service INT,
	to_service INT,
	start BIGINT,
	end BIGINT,
	data TEXT,
	feedback TEXT,
	ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS Interaction_Trust;
CREATE TABLE Interaction_Trust (
	interaction_id VARCHAR(512) NOT NULL,
	trust_module VARCHAR(512) NOT NULL,
	from_pre FLOAT,
	from_post FLOAT,
	to_pre FLOAT,
	to_post FLOAT,
	ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS Heartbeat_Data;
CREATE TABLE Heartbeat_Data (
	id INT AUTO_INCREMENT PRIMARY KEY,
	ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	service VARCHAR(2048),
	data TEXT
);

DROP TABLE IF EXISTS  Inflow_Data;
CREATE TABLE Inflow_Data (
	id INT AUTO_INCREMENT PRIMARY KEY,
	ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	request_ts LONG,
	service VARCHAR(2048),
	from_ip VARCHAR(2048),
	protocol VARCHAR(1024),
	data TEXT
);
