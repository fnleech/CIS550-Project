// This is the intermediate page for quiz queries

var async = require('async');
var oracledb = require('oracledb');
var global_res;


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
// Query the oracle database
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
			results.push(rows.rows[0].CID);
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
			results.push(rows.rows[0].HEIGHT);
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
			results.push(rows.rows[0].NAME);
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
			results.push(rows.rows[0].USAWINS);
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
			results.push(rows.rows[0].MEDALCOUNT);
			console.log(results);
			display_quiz(global_res, results);
			return cb(null, conn);
  	}
	});}

//Connect to MongoDB 
var mongojs= require('mongojs');
var db = mongojs('mongodb://550G16:PENN550@ds163377.mlab.com:63377/db550', ['userscore']);

exports.save_results = function(req, res) {
	if (req.body.name && req.body.score) {
		console.log("recieved a post with username: " + req.body.name);
		db.userscore.insert({ "username" : req.body.name, "score" : req.body.score });
	}
}



  var questions = [{
    question: "Which country has the most number of gold medals in the 2012 Summer Olympics?",
    choices: ["Russia", "USA", "China", "Great Britain", "France"],
  }, {
    question: "What's the best height to win a gold medal in swimming if you're a guy?",
    choices: [190, 163, 183, 177, 185],
  }, {
    question: "Which Summer Olympics was most expensive per athlete?",
    choices: ["Soviet Union", "London", "Barcelona", "Athens", "Beijing"],
  }, {
    question: "From 1960-2012, how many Summer Olympics did the USA take home the most number of gold medals?",
    choices: [14, 13, 10, 9, 11],
  }, {
    question: "How many gold medals has the smallest IOC Country (by population) won?",
    choices: [53, 11, 33, 62, 29],
  }];

function display_quiz(res, results) {
	res.render('quiz.jade', 
		{ results: JSON.stringify(results),
		  questions: questions });
};

exports.load_quiz = function(req, res){
    //query_db(res);
	display_quiz(res, ["USA",183,"Soviet Union",11,62]);
};