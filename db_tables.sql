CREATE TABLE State (
State VARCHAR (225),
StateCode VARCHAR(2),
PRIMARY KEY (StateCode)
);
CREATE TABLE Cases (
StateCode VARCHAR(2),
CaseNum int, 
CaseDate date,  
PRIMARY KEY (StateCode, CaseDate),
FOREIGN KEY (StateCode) REFERENCES State(StateCode)
);
CREATE TABLE CaseCount (
StateCode VARCHAR(2),
CaseNum int, 
PRIMARY KEY (StateCode, CaseNum),
FOREIGN KEY (StateCode) REFERENCES State(StateCode)
);
CREATE TABLE CasePredict(
StateCode VARCHAR(2),
Predict int,
PRIMARY KEY (StateCode, Predict),
FOREIGN KEY (StateCode) REFERENCES State(StateCode)
);
