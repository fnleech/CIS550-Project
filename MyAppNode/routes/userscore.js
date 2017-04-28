var express = require('express');
var router = express.Router();
var mongojs= require('mongojs');
var db = mongojs('mongodb://550G16:PENN550@ds163377.mlab.com:63377/db550', ['userscore']);


/////
// Query the mongoDB, and call output_actors on the results
//
// res = HTTP result object sent back to the client

exports.show_scores = function (req, res) {
    db.userscore.find().toArray(function (err, scores) {
        if (!err)
            res.render('userscore.jade', {title: "Show user scores", 
            							  results: scores});
        else
            res.render('userscore.jade', {title: "No user yet",
            							  results: []});
    });
};

// insert into Mongo
//db.userscore.insert({ "username" : "Kate", "score" : score });