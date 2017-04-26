/* We can add more if there are some interesting questions */

1. What is the discipline that USA most good at?

With Discipline_Gold As (
  Select R.discipline As Discipline, 
         Count(R.Medal) As Gold
  From Athlete A, Country C, AFromC AFC, Result R
  Where C.CID = AFC.CID 
        and A.AID = AFC.AID 
        and A.AID = R.AID 
        and R.Medal = 'Gold' 
        and C.CID = 'USA'
  Group by R.discipline
)
Select DG.Discipline, DG.Gold
From Discipline_Gold DG
Where DG.Gold = 
	  ( Select MAX(DG.Gold)
	    From Discipline_Gold DG);


2. The Olympics that has the greatest number of athletes is held by which country?

With Olympics_Athlete As (
  Select O.Year As Year, 
         Count(Distinct R.AID) As Athlete_Number
  From Olympics O, Result R
  Where R.Year = O.Year
  Group by O.Year
)
Select C.Name, O.Year
From Country C, Olympics O, Participates P, Olympics_Athlete OA
Where C.CID = P.CID 
      and P.Role = 'both' 
      and P.Year = O.Year 
      and OA.Year = O.Year
	  and OA.Athlete_Number = 
	  ( Select MAX(OA.Athlete_Number)
	    From Olympics_Athlete OA);


3. Which country has the smallest number of athlete?
With Athlete_Number As (
  Select C.CID AS CID, Count(A.AID) AS Athlete_count
  From Country C, Athlete A, AFromC AFC
  Where C.CID = AFC.CID 
        and A.AID = AFC.AID
  Group by C.CID
)
Select C.Name, AN.Athlete_count
From Country C, Athlete_Number AN
Where C.CID = AN.CID 
	  and AN.Athlete_count = 
          ( Select MIN(AN.Athlete_count)
            From Athlete_Number AN);


4. Number of gold medals in each country:

Select C.CID, COALESCE(Count(R.Medal), 0)
From Athlete A, Country C, AFromC AFC, Result R
Where C.CID = AFC.CID 
      and A.AID = AFC.AID 
      and A.AID = R.AID 
      and R.Medal = 'Gold'
Group by C.CID
Order by C.CID;

5. Number of total medals in each country:

Select C.CID, Count(R.Medal)
From Athlete A, Country C, AFromC AFC, Result R
Where C.CID = AFC.CID 
      and A.AID = AFC.AID 
      and A.AID = R.AID 
      and R.Medal <> 'None'
Group by C.CID
Order by C.CID;

6. The number of athletes in each Olympics?

Select O.Year, Count(Distinct R.AID) As Athlete_Number
From Olympics O, Result R
Where R.Year = O.Year
Group by O.Year
Order by O.Year;


7. The number of athletes in each country:

With Athlete_Number As (
  Select C.CID AS CID, Count(A.AID) AS Athlete_count
  From Country C, Athlete A, AFromC AFC
  Where C.CID = AFC.CID and A.AID = AFC.AID
  Group by C.CID
)
Select C.Name, AN.Athlete_count
From Country C, Athlete_Number AN
Where C.CID = AN.CID;