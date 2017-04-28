/*
 * GET home page, which is specified in Jade.
 */


exports.do_work = function(req, res){
  res.render('index.jade', { 
	  title: 'Olympics' 
  });
};

//exports.do_map = function(req, res){
  //res.render('map.jade', {});
//};

exports.do_ref = function(req, res){
  res.render('reference.jade', {});
};

exports.do_olym = function(req, res){
  res.render('olympics.jade', {});
};

<<<<<<< HEAD
exports.do_map = function(req, res){
  res.render('map.jade', {});
=======
exports.do_coun = function(req, res){
  res.render('country.jade', {});
>>>>>>> cd7c797c53fcd4f363dd271f24eff1d8bbb92dcd
};
//exports.do_quiz = function(req, res){
  //res.render('quiz.jade', {});
//};
