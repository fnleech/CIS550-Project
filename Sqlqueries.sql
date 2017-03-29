# Question1 Total Local Cases
Select Count(*) as Total Local Cases
From Cases C 
Where CaseType = "US0002" 

# Total Travel Cases
Select Count(*) as Total Travel Cases
From Cases C 
Where CaseType = "US0001" 


# Answer Question 2 (Can be broken up by State)

Select StateCode, Predict
From Predict 
Where StateCode = "X"


# Answer Question 3 - I want to go to State X, is Zika there? 

Select StateCode = "X", Count(*) as Total Cases
From Cases
Where Cases > 0
Group by StateCode

# Answer Question 4 - what is the rate (average cases overall) of Zika spread in State X from travel?

Select AVG(Case)
From  Cases C
Where StateCode = "X" AND CaseType = "US0001"

# Which month has the highest rate of Zika travel cases from State X?

WITH Rate AS (
SELECT StateCode, Month, AVG(Cases) as Rate_per_month
FROM Cases C
WHERE CaseType = "US0001"
GROUP BY StateCode, Month
)

Select R.StateCode, R.Month
From  Rate R
Where Rate_per_month = (Select MAX(R1.Rate_per_Month), FROM Rate R1) AND
R.StateCode = "X"



# Which month has the highest rate of Zika local cases from State X?

WITH Rate AS (
SELECT StateCode, Month, AVG(Cases) as Rate_per_month
FROM Cases C
WHERE CaseType = "US0002"
GROUP BY StateCode, Month


Select R.StateCode, R.Month
From  Rate R
Where Rate_per_month = (Select MAX(R1.Rate_per_Month), FROM Rate R1) AND
R.StateCode = "X"


# Which State has the max number of cases?

Select StateCode  
From Cases
Where Case = (Select MAX(C1.Case) 
	From Cases C1)

# Which state has the greatest increase in predicted versus current cases?

WITH Diff AS (
SELECT C.StateCode, C.Case, P.Predict, P.Predict - C.Case AS Difference
FROM Cases C
INNER JOIN Predict P 
	ON P.StateCode = C.StateCode
)

SELECT D.StateCode
FROM Diff D
WHERE Difference = (SELECT MAX(D1.Difference)
	FROM Diff D1)

#% Total Cases by State and by CaseType (Travel ("US0001") or Local ("US0002"))

Select StateCode, Count(*)
From Cases C 
Where CaseType = "US0001" AND StateCode = "AZ"
Group by Statecode 