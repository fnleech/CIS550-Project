// This is the intermediate page for quiz queries

function display_quiz(res, results) {
	res.render('quiz.jade',
		   { results: results }
	  );
}


exports.load_quiz = function(req, res){
    // Do other stuff
    display_quiz(res, null)
};