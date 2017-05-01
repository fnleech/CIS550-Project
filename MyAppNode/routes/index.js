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
  res.render('reference.jade', {
    title: 'Reference'
  });
};

exports.do_olym = function(req, res){
  res.render('olympics.jade', {
    title: 'Olympics'
  });
};

exports.do_map = function(req, res){
  res.render('map.jade', {
    title: 'Map'
  });
};

exports.do_cou = function(req, res){
  res.render('country.jade', {
    title: 'Countries'
  });
};

exports.do_ath = function(req, res){
  res.render('athlete.jade', {
    title: 'Athletes'
  });
};
//exports.do_quiz = function(req, res){
  //res.render('quiz.jade', {});
//};
