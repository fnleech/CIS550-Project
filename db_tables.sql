CREATE TABLE State (
State VARCHAR (225),
StateCode VARCHAR(225),
PRIMARY KEY (StateCode)
);
CREATE TABLE Cases (
StateCode VARCHAR(225),
CaseNum int, 
CaseDate VARCHAR(12),
CaseType VARCHAR(12),
PRIMARY KEY (StateCode, CaseDate, CaseType),
FOREIGN KEY (StateCode) REFERENCES State(StateCode)
);
CREATE TABLE CaseCount (
StateCode VARCHAR(225),
CaseNum int, 
PRIMARY KEY (StateCode, CaseNum),
FOREIGN KEY (StateCode) REFERENCES State(StateCode)
);
CREATE TABLE CasePredict(
StateCode VARCHAR(225),
Predict int,
PRIMARY KEY (StateCode, Predict),
FOREIGN KEY (StateCode) REFERENCES State(StateCode)
);
