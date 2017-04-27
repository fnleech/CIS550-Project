var mapresults = {connection.query("Select C.CID, COALESCE(Count(R.Medal), 0)
From Athlete A, Country C, AFromC AFC, Result R
Where C.CID = AFC.CID 
      and A.AID = AFC.AID 
      and A.AID = R.AID 
      and R.Medal = 'Gold'
Group by C.CID
Order by C.CID", function(err, rows){
  if(err) {
    throw err;
  } else {
    setValue(rows);
  }
	});}

//query for the results

// pass the results from  here to map.jade
function display_mapresults(res, mapresults) {
	res.render('map.jade',
		   { mapresults: JSON.stringify(mapresults) }
	  );
}

// if 
//a.properties.name == local_mapresuts[i,1]
// then print local_mapresults[i,2]