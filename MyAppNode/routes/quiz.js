// This is the intermediate page for quiz queries

/*

// Query the oracle database, and call output_actors on the results 
// req is an object containing information about the HTTP request that raised the event. In response to req, you use res to send back the desired HTTP response

var async = require('async');
var oracledb = require('oracledb');
var global_res;

// Properties are applicable to all connections and SQL executions.
// They can also be set or overridden at the individual execute() call level
//
// This script sets outFormat in the execute() call but it could be set here instead:
// oracledb.outFormat = oracledb.OBJECT;

var doconnect = function (cb) {
	oracledb.outFormat = oracledb.OBJECT;
	oracledb.getConnection(
		{
			user: "cis550project",
			password: "cis550projectkeyPENN",
			connectString: "cis550project.cgajnbzkqq1i.us-west-2.rds.amazonaws.com:1521/PENNDB",
		},
		cb);
};

var dorelease = function(conn) {
  conn.close(function (err) {
    if (err)
      console.error(err.message);
  });
};

/////
// Query the oracle database, and call output_actors on the results
//
// res = HTTP result object sent back to the client
function query_db(res) {
	global_res = res;
	async.waterfall(
		[
			doconnect,
			doquery1,
			doquery2,
			doquery3,
			doquery4,
			doquery5
		],
		function (err, conn) {
			if (err) { console.error("In waterfall error cb: ==>", err, "<=="); }
			if (conn)
				dorelease(conn);
		});
}


// Answers
var doquery1 = function (conn, cb) {
	conn.execute("WITH ath_medals AS(" + 
	"SELECT AFC.CID, P.Year, R.Medal, count(*) as MedalCount " +
	"FROM result R INNER JOIN athlete A ON A.AID = R.AID " +
	"INNER JOIN afromC AFC ON A.AID = AFC.AID " +
	"INNER JOIN Participates P ON P.CID = AFC.CID " + 
	"Where P.year = 2012 GROUP BY AFC.CID, R.Medal,P.Year) " +
	"SELECT CID, MedalCount, Year FROM ath_medals " +
	"Where MedalCount = (SELECT MAX(AM1.MedalCount) " +
	"from ath_medals AM1 where AM1.year = 2012)", 
	function(err, rows){
  	if(err) {
    	throw err;
  	} else {
			var results = [];
			results.push(rows.rows[0].MEDALCOUNT);
			return cb(null, results, conn);
  	}
	});}

var doquery2 = function (results, conn, cb) {
	conn.execute("WITH ath_medals AS(" +
	"SELECT A.Height, R.Discipline, count(*) as MedalCount " +
	"FROM result R INNER JOIN athlete A ON A.AID = R.AID " +
	"INNER JOIN afromC AFC ON A.AID = AFC.AID " +
	"INNER JOIN Participates P ON P.CID = AFC.CID " +
	"Where A.Gender = 'Male'AND R.Discipline = 'Swimming' " +
	"AND R.Medal = 'Gold' AND A.Height != -1 " +
	"GROUP BY  R.Discipline, A.Height ) " +
	"Select AM.Height From ath_medals AM " +
	"Where AM.MedalCount = (SELECT MAX(AM2.MedalCount) " +
	"from ath_medals AM2)", 
	function(err, rows){
  	if(err) {
    	throw err;
  	} else {
			results.push(rows.rows[0].Height);
			return cb(null, results, conn);
  	}
	});}


var doquery3 = function (results, conn, cb) {
	conn.execute("WITH ath_count AS( SELECT P.Year, count(*) as NumAthletes " +
	"FROM Participates P INNER JOIN Result R ON R.Year = P.Year " +
	"INNer JOIN Athlete A ON A.AID = R.AID Group BY P.Year), " +
	"CostA AS ( SELECT C.name, ATC.Year, (O.cost/ATC.NumAthletes) * 1000000000 AS CostPerATH " +
	"FROM ath_count ATC INNER JOIN Participates P ON ATC.Year = P.Year " +
	"INNER JOIN Olympics O ON O.Year = ATC.Year INNER JOIN Country C ON C.CID = P.CID " +
	"Where P.role = 'both' and O.cost != -1 ORDER BY ATC.Year ASC) " +
	"Select CA.name From CostA CA WHERE CA.CostPerATH = (SELECT (MAX(CA1.CostPerATH)) FROM CostA CA1)", 
	function(err, rows){
  	if(err) {
    	throw err;
  	} else {
			results.push(rows.rows[0].name);
			return cb(null, results, conn);
  	}
	});}

var doquery4 = function (results, conn, cb) {
	conn.execute("With sportmedal AS(Select R.Discipline, R.Year,AFC.CID,Count(*) AS MedPerS " +
	"From Athlete A Inner Join Result R on A.Aid = R.Aid " +
	"Inner Join AFromC AFC on A.Aid = AFC.Aid Where R.Medal = 'Gold' " +
	"Group by  R.Discipline, R.Year,AFC.CID ) " +
	", GMCount AS(Select SM.* From sportmedal SM Inner join (Select Year, MAX(MedPers) as MaxMedals " +
	"From sportmedal Group by Year) groupedSM ON SM.Year = groupedSM.Year " +
	"AND SM.MedPers = groupedSM.MaxMedals) Select Count(*) AS USAwins " +
	"From GMCount GMC Where GMC.CID = 'USA'", 
	function(err, rows){
  	if(err) {
    	throw err;
  	} else {
			results.push(rows.rows[0].USAwins);
			return cb(null, results, conn);
  	}
	});}

var doquery5 = function (results, conn, cb) {
	conn.execute("WITH athmedals AS( SELECT AFC.CID, R.Medal, count(*) as MedalCount " +
	"FROM result R INNER JOIN athlete A ON A.AID = R.AID " +
	"INNER JOIN afromC AFC ON A.AID = AFC.AID INNER JOIN Participates P ON P.CID = AFC.CID " +
	"GROUP BY AFC.CID, R.Medal ) Select ATM.MedalCount, C.Name, C.Population " +
	"From athmedals ATM Inner Join Country C ON C.CID = ATM.CID " +
	"Where C.Population = (SELECT MIN(C1.Population) From Country C1 Where C1.Population != -1)", 
	function(err, rows){
  	if(err) {
    	throw err;
  	} else {
			results.push(rows.rows[0].name);
			console.log(results);
			return cb(null, conn);
  	}
	});}*/

function display_quiz(res, results) {
	res.render('quiz.jade', 
		{ results: JSON.stringify(results) });
}

exports.load_quiz = function(req, res){
    //query_db(res);
	display_quiz(res, results);
};