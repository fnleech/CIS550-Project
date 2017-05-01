var async = require('async');
var oracledb = require('oracledb');
var global_res;
var global_search;

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

var query_olympics = function (conn, cb) {
    console.log(global_search);
  conn.execute(
    "SELECT C.Name, O.Cost, O.Population, O.GDP"+
    "FROM Olympics O" + 
    "Inner JOIN Participates P" +
    "ON O.Year = P.Year" +
    "Inner JOIN Country C"+
    "ON C.CID = P.CID"+
    "WHERE P.Role = "both" and O.Year := year" 
    function(err, result)
    {
      if (err) {
        return cb(err, conn);
      } else {
            if (result.rows[0]) {
                output_table(global_res, result.rows[0])
                return cb(null, conn);
            } else {
                olympics_error(global_res);
                return cb(null, conn);
            }
            
      }
    });
};

////
// Query the oracle database, and call output_actors on the results
//
// res = HTTP result object sent back to the client
// name = Name to query for
function query_db(res) {
	global_res = res;
	async.waterfall(
		[
			doconnect,
			query_olympics
		],
		function (err, conn) {
			if (err) { console.error("In waterfall error cb: ==>", err, "<=="); }
			if (conn)
				dorelease(conn);
		});
}


// ///
// Given a set of query results, output a table
//
// res = HTTP result object sent back to the client
// name = Name to query for
// results = List object of query results
function output_table(res,results) {
    console.log(results);
	res.render('olympics.jade',
		   { results: results }
	  );
}

function athlete_error(res) {
    res.render('olympics.jade',
        { error: 'an error' }
    )
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
    global_search = "'" + req.body.year + "'";
    query_db(res);
};