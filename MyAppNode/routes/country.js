var async = require('async');
var oracledb = require('oracledb');
var global_res;
var global_search;
var global_info;

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


var query_athlete = function (conn, cb) {
    console.log(global_search);
  conn.execute(
    "SELECT * FROM ATHLETE WHERE FULLNAME=" + global_search,
    function(err, result)
    {
      if (err) {
        return cb(err, conn);
      } else {
            global_info = result.rows;
            if (global_info.length > 0) {
                global_search = global_info[0].AID;
                return cb(null, conn);
            } else {
                global_search = null;
                athlete_error(global_res);
                return cb(null, conn);
            }
            
      }
    });
};

var query_results = function (conn, cb) {
  if (global_search === null) {
      return cb(null, conn);
  } else {
  conn.execute(
    "SELECT * FROM RESULT WHERE AID=:name",
    [global_search],
    function(err, result)
    {
      if (err) {
        return cb(err, conn);
      } else {
            console.log(global_info);
            console.log(result.rows);
            output_table(global_res, global_info, result.rows);
            return cb(null, conn);
      }
    })};
};

/////
// Query the oracle database
//
// res = HTTP result object sent back to the client
function query_db(res) {
	global_res = res;
	async.waterfall(
		[
			doconnect,
			query_athlete,
            query_results
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
// info = object with athlete info results
// results = List object of query results
function output_table(res,info,results) {
    console.log(results);
	res.render('athquery.jade',
		   {   info: info,
               results: results }
	  );
}

function athlete_error(res) {
    res.render('athlete.jade',
        { error: 'an error' }
    )
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
    global_search = "'" + req.body.name + "'";
    query_db(res);
};