var async = require('async');
var oracledb = require('oracledb');
var global_res;
var global_login;

// Properties are applicable to all connections and SQL executions.
// They can also be set or overridden at the individual execute() call level
//
// This script sets outFormat in the execute() call but it could be set here instead:
// oracledb.outFormat = oracledb.OBJECT;

var doconnect = function (cb) {
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


// Optional Object Output Format
var doquery_object = function (conn, cb) {
  conn.execute(
    "SELECT * FROM ATHLETE WHERE rownum <= 10",
    {}, // A bind variable parameter is needed to disambiguate the following options parameter
        // otherwise you will get Error: ORA-01036: illegal variable name/number
    { outFormat: oracledb.OBJECT }, // outFormat can be OBJECT or ARRAY.  The default is ARRAY
    function(err, result)
    {
      if (err) {
        return cb(err, conn);
      } else {
        output_persons(global_res, global_login, result.rows);
        return cb(null, conn);
      }
    });
};

/////
// Query the oracle database, and call output_actors on the results
//
// res = HTTP result object sent back to the client
// name = Name to query for
function query_db(res, login) {
	global_res = res;
	global_login = login;
	async.waterfall(
		[
			doconnect,
			doquery_object
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
function output_persons(res,login,results) {
	res.render('person.jade',
		   { title: "Person with login " + login,
		     results: results }
	  );
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	query_db(res,req.query.name);
};
