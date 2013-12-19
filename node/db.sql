DROP TABLE Service;
CREATE TABLE Service (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(2048),
	trust_level FLOAT
);

INSERT INTO Service(name, trust_level) VALUES
('localhost:3001', 10.0),
('localhost:3002', 5.0),
('localhost:3003', 4.0);

DROP TABLE Interaction;
CREATE TABLE Interaction (
	id INT AUTO_INCREMENT PRIMARY KEY,
	from_service INT,
	to_service INT,
	start BIGINT,
	end BIGINT,
	ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

