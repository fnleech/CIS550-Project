/*var async = require('async');
var oracledb = require('oracledb');
var global_res;

var doconnect = function (cb) {
	oracledb.outFormat = oracledb.OBJECT;
	oracledb.getConnection(
		{
			user: "cis550project",
			password: "cis550projectkeyPENN",
			connectString: "cis550project.cgajnbzkqq1i.us-west-2.rds.amazonaws.com:1521/PENNDB"
		},
		cb);
};

var dorelease = function(conn) {
  conn.close(function (err) {
    if (err)
      console.error(err.message);
  });
};

var domapquery = function (conn, cb) {
  conn.execute("Select C.CID, COALESCE(Count(R.Medal), 0) " + 
  "From Athlete A, Country C, AFromC AFC, Result R Where C.CID = AFC.CID " +
  "and A.AID = AFC.AID and A.AID = R.AID and R.Medal = 'Gold'" +
  "Group by C.CID Order by C.CID", 
  function(err, result) {
      if (err) {
        return cb(err, conn);
      } else {
		    console.log(result.rows);
        display_mapresults(global_res, result.rows);
        return cb(null, conn);
      }
    });
};


function query_db(res, login) {
	global_res = res;
	async.waterfall(
		[
			doconnect,
			domapquery
		],
		function (err, conn) {
			if (err) { console.error("In waterfall error cb: ==>", err, "<=="); }
			if (conn)
				dorelease(conn);
		});
}*/

var mapresults = {};

// pass the results from  here to map.jade
function display_mapresults(res, mapresults) {
	res.render('map.jade',
		   { mapresults: JSON.stringify(mapresults) }
	  );
}

// if 
//a.properties.name == local_mapresuts[i,1]
// then print local_mapresults[i,2]