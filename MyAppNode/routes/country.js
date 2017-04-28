var async = require('async');
var oracledb = require('oracledb');
var global_res;
var global_login;

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


var query_country = function (conn, cb) {
  conn.execute(
    "SELECT * FROM COUNTRY",
    function(err, result)
    {
      if (err) {
        return cb(err, conn);
      } else {
				console.log(result.rows);
        output_table(global_res, result.rows);
        return cb(null, conn);
      }
    });
};

/////
// Query the oracle database, and call output_actors on the results
//
// res = HTTP result object sent back to the client
// name = Name to query for
function query_db(res) {
	global_res = res;
	async.waterfall(
		[
			doconnect,
			query_country
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
	res.render('query.jade',
		   { results: results }
	  );
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
		query_db(res);
};