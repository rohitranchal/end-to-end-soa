DROP TABLE Service;
CREATE TABLE Service (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(2048),
	display_name VARCHAR(2048),
	trust_level FLOAT,
	host VARCHAR(2048),
	port INT,
	url VARCHAR(2048),
	params TEXT
);

INSERT INTO Service(id, name, display_name, trust_level, host, port, url, params) VALUES
(1, 'localhost:4101','localhost:4101', 10.0, 'localhost', 4101, 'http://localhost:4101', '{}'),
(2, 'localhost:4102','localhost:4102', 5.0, 'localhost', 4102, 'http://localhost:4102', '{}'),
(3, 'localhost:4103','localhost:4103', 10.0, 'localhost', 4103, 'http://localhost:4103', '{}'),
(4, 'localhost:4104','localhost:4104', 10.0, 'localhost', 4104, 'http://localhost:4104', '{}'),
(5, 'localhost:4105','localhost:4105', 10.0, 'localhost', 4105, 'http://localhost:4105', '{}'),
(6, 'localhost:4106','localhost:4106', 10.0, 'localhost', 4106, 'http://localhost:4106', '{}'),
(7, 'localhost:4107','localhost:4107', 10.0, 'localhost', 4107, 'http://localhost:4107', '{}'),
(8, 'localhost:4108','localhost:4108', 10.0, 'localhost', 4108, 'http://localhost:4108', '{}'),
(9, 'localhost:4109','localhost:4109', 10.0, 'localhost', 4109, 'http://localhost:4109', '{}'),
(10, 'localhost:4110','localhost:4110', 5.0, 'localhost', 4110, 'http://localhost:4110', '{}'),
(11, 'localhost:4111','localhost:4111', 10.0, 'localhost', 4111, 'http://localhost:4111', '{}'),
(12, 'localhost:4112','localhost:4112', 10.0, 'localhost', 4112, 'http://localhost:4112', '{}'),
(13, 'localhost:4113','localhost:4113', 10.0, 'localhost', 4113, 'http://localhost:4113', '{}'),
(14, 'localhost:4114','localhost:4114', 10.0, 'localhost', 4114, 'http://localhost:4114', '{}'),
(15, 'localhost:4115','localhost:4115', 10.0, 'localhost', 4115, 'http://localhost:4115', '{}'),
(16, 'localhost:4116','localhost:4116', 10.0, 'localhost', 4116, 'http://localhost:4116', '{}'),
(17, 'localhost:4117','localhost:4117', 10.0, 'localhost', 4117, 'http://localhost:4117', '{}'),
(18, 'localhost:6101','localhost:6101', 10.0, 'localhost', 6101, 'http://localhost:6101', '{}'),
(19, 'localhost:6102','localhost:6102', 10.0, 'localhost', 6102, 'http://localhost:6102', '{"load":20}'),
(20, 'localhost:6103','Travel Agent', 10.0, 'localhost', 6103, 'http://localhost:6103', '{}'),
(21, 'localhost:6104','Airline', 10.0, 'localhost', 6104, 'http://localhost:6104', '{}'),
(22, 'localhost:6105','Advertiser', 10.0, 'localhost', 6105, 'http://localhost:6105', '{}'),
(23, 'localhost:6106','Travel Agent', 10.0, 'localhost', 6106, 'http://localhost:6106', '{}'),
(24, 'localhost:6107','Airline', 10.0, 'localhost', 6107, 'http://localhost:6107', '{}'),
(25, 'localhost:6108','Travel Agent', 10.0, 'localhost', 6108, 'http://localhost:6108', '{}'),
(26, 'localhost:6109','Payment Gateway', 10.0, 'localhost', 6109, 'http://localhost:6109', '{}');


DROP TABLE Interaction;
CREATE TABLE Interaction (
	id INT AUTO_INCREMENT PRIMARY KEY,
	from_service INT,
	to_service INT,
	from_service_trust_level_pre FLOAT,
	to_service_trust_level_pre FLOAT,
	from_service_trust_level_post FLOAT,
	to_service_trust_level_post FLOAT,
	start BIGINT,
	end BIGINT,
	ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

