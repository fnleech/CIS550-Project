/*
 * GET home page, which is specified in Jade.
 */

exports.do_work = function(req, res){
  res.render('index.jade', { 
	  title: 'Please enter a person login' 
  });
};


exports.load_quiz = function(req, res){
  res.render('quiz.jade', {});
};
