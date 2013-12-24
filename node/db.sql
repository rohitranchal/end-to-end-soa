DROP TABLE Scenario;
CREATE TABLE Scenario (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(2048),
	access_url VARCHAR(2048),
	description TEXT
);
INSERT INTO Scenario(id, name, access_url, description) VALUES
(1, 'Simple Proxy', 'http://localhost:4101/get_deal', 's1 -> s2'),
(2, 'Service Facade', 'http://localhost:4103/get_deal', 's1 -> s2 and s1 -> s3'),
(3, 'Service Chain', 'http://localhost:4106/get_deal', 's1 -> s2 -> s3');

DROP TABLE Service;
CREATE TABLE Service (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(2048),
	trust_level FLOAT,
	host VARCHAR(2048),
	port INT,
	url VARCHAR(2048)
);

INSERT INTO Service(id, name, trust_level, host, port, url) VALUES
(1, 'localhost:4101', 10.0, 'localhost', 4101, 'http://localhost:4101'),
(2, 'localhost:4102', 5.0, 'localhost', 4102, 'http://localhost:4102'),
(3, 'localhost:4103', 10.0, 'localhost', 4103, 'http://localhost:4103'),
(4, 'localhost:4104', 10.0, 'localhost', 4104, 'http://localhost:4104'),
(5, 'localhost:4105', 10.0, 'localhost', 4105, 'http://localhost:4105'),
(6, 'localhost:4106', 10.0, 'localhost', 4106, 'http://localhost:4106'),
(7, 'localhost:4107', 10.0, 'localhost', 4107, 'http://localhost:4107'),
(8, 'localhost:4108', 10.0, 'localhost', 4108, 'http://localhost:4108');


DROP TABLE Scenario_Service;
CREATE TABLE Scenario_Service (
	scenario INT,
	service INT
);

INSERT INTO Scenario_Service VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(2, 5),
(3, 6),
(3, 7),
(3, 8);


DROP TABLE Interaction;
CREATE TABLE Interaction (
	id INT AUTO_INCREMENT PRIMARY KEY,
	from_service INT,
	to_service INT,
	start BIGINT,
	end BIGINT,
	ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

