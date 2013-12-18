DROP TABLE Service;
CREATE TABLE Service (
	id INT AUTO_INCREMENT PRIMARY KEY,
	trust_level INT,
	name VARCHAR(2048)
);


DROP TABLE Interaction;
CREATE TABLE Interaction (
	from_service INT,
	to_service INT,
	start BIGINT,
	end BIGINT,
	ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

