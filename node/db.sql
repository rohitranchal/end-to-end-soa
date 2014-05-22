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
(1, 'localhost:4101','localhost:4101', 10.0, 'localhost', 4101, 'http://localhost:4101', '{}', -1, 'scenarios/passive/simple/s1'),
(2, 'localhost:4102','localhost:4102', 5.0, 'localhost', 4102, 'http://localhost:4102', '{}', -1, 'scenarios/passive/simple/s2'),
(3, 'localhost:4103','localhost:4103', 10.0, 'localhost', 4103, 'http://localhost:4103', '{}', -1, 'scenarios/passive/1/s1'),
(4, 'localhost:4104','localhost:4104', 10.0, 'localhost', 4104, 'http://localhost:4104', '{}', -1, 'scenarios/passive/1/s2'),
(5, 'localhost:4105','localhost:4105', 10.0, 'localhost', 4105, 'http://localhost:4105', '{}', -1, 'scenarios/passive/1/s3'),
(6, 'localhost:4106','localhost:4106', 10.0, 'localhost', 4106, 'http://localhost:4106', '{}', -1, 'scenarios/passive/2/s1'),
(7, 'localhost:4107','localhost:4107', 10.0, 'localhost', 4107, 'http://localhost:4107', '{}', -1, 'scenarios/passive/2/s2'),
(8, 'localhost:4108','localhost:4108', 10.0, 'localhost', 4108, 'http://localhost:4108', '{}', -1, 'scenarios/passive/2/s3'),

(9, 'localhost:4109', 'Travel Agent', 10.0, 'localhost', 4109, 'http://localhost:4109', '{}', -1, 'scenarios/active/demo/s1'),
(10, 'localhost:4110', 'Car Rental', 10.0, 'localhost', 4110, 'http://localhost:4110', '{}', -1, 'scenarios/active/demo/s2'),
(11, 'localhost:4111', 'Hotel', 10.0, 'localhost', 4111, 'http://localhost:4111', '{}', -1, 'scenarios/active/demo/s3'),
(12, 'localhost:4112', 'Airline', 10.0, 'localhost', 4112, 'http://localhost:4112', '{}', -1, 'scenarios/active/demo/s4'),
(13, 'localhost:4113', 'Payment Gateway', 10.0, 'localhost', 4113, 'http://localhost:4113', '{}', -1, 'scenarios/active/demo/s5'),
(14, 'localhost:4114', 'Bank', 10.0, 'localhost', 4114, 'http://localhost:4114', '{}', -1, 'scenarios/active/demo/s6'),
(15, 'localhost:4115', "Payment Gateway[Backup]", 10.0, 'localhost', 4115, 'http://localhost:4115', '{}', -1, 'scenarios/active/demo/s7'),
(16, 'localhost:5113', 'Payment Gateway (HTTP)', 10.0, 'localhost', 5113, 'http://localhost:5113', '{"parent_service_id" : 13}', -1, 'scenarios/active/demo/s5'),

(20, 'localhost:6103','Travel Agent', 10.0, 'localhost', 6103, 'http://localhost:6103', '{}', -1, 'scenarios/active/demo_airline/s1'),
(21, 'localhost:6104','Airline', 10.0, 'localhost', 6104, 'http://localhost:6104', '{}', -1, 'scenarios/active/demo_airline/s2'),
(22, 'localhost:6105','Advertiser', 10.0, 'localhost', 6105, 'http://localhost:6105', '{}', -1, 'scenarios/active/demo_airline/s3');


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
	ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(interaction_id, trust_module)
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

DROP TABLE IF EXISTS Trust_Configurations;
CREATE TABLE Trust_Configurations (
	id VARCHAR(512) PRIMARY KEY,
	data TEXT
);
