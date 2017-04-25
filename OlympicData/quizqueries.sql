#sql queries for quiz

# which country has the most number of gold medals in the 2012 summer olympics?
WITH ath_medals AS(
SELECT AFC.CID, P.Year, R.Medal, count(*) as MedalCount
FROM result R
	INNER JOIN athlete A
		ON A.AID = R.AID
	INNER JOIN afromC AFC
		ON A.AID = AFC.AID
	INNER JOIN Participates P
		ON P.CID = AFC.CID
Where P.year = 2012 
GROUP BY AFC.CID, R.Medal,P.Year
)
SELECT CID, MedalCount, Year
FROM ath_medals
Where MedalCount = (SELECT MAX(AM1.MedalCount)
	from ath_medals AM1
	where AM1.year = 2012);


# who is the oldest swimmer that won the most number of gold medals in swimming in 2012?
WITH ath_medals AS(
SELECT A.AID,A.name, A.DOB, P.Year, R.Medal, R.event, count(*) as MedalCount
FROM result R
	INNER JOIN athlete A
		ON A.AID = R.AID
	INNER JOIN afromC AFC
		ON A.AID = AFC.AID
	INNER JOIN Participates P
		ON P.CID = AFC.CID
Where P.year = 2012 AND R.event = 'Swimming'
GROUP BY A.name, A.age, P.Year, R.Medal, R.event
)
WITH ath_final AS(
SELECT TRUNC((SYSDATA-TO_DATE(ATM.DOB, 'YYYY-MM-DD'))/365) AS Age
FROM ath_medals ATM
)
SELECT ATM.name, AFM.AGE
FROM ath_medals ATM
	Inner join ath_final AFM
	ON ATM.AID = AFM.AID
Where ATM.MedalCount = (SELECT MAX(AM1.MedalCount)
	from ath_medals AM1
	where AM1.year = 2012) and AFM.AGE = (SELECT MAX(ATM1.AGE)
	from ath_final ATM1);

# What is cost per athlete for each of the olympics?
WITH ath_count AS(
SELECT P.Year, count(*) as NumAthletes
FROM Participates P
	INNER JOIN Result R
	ON R.Year = P.Year
	INNer JOIN Athlete A
	ON A.AID = R.AID
Group BY P.Year
)
SELECT C.name, ATC.Year, O.cost/ATC.NumAthletes AS CostPerATH
FROM ath_count ATC
	INNER JOIN Participates P
	ON ATC.Year = P.Year
	INNER JOIN Olympics O
	ON O.Year = ATC.Year
	INNER JOIN Country C
	ON C.CID = P.CID
Where P.role = 'both';	
)


# Which olympics was most expensive per athlete?
