
/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , query = require('./routes/query')
  , quiz = require('./routes/quiz')
  , map = require('.routes/mapquery')
  , http = require('http')
  , path = require('path')
  , stylus = require("stylus")
  , nib = require("nib")
;

// Initialize express
var app = express();
// .. and our app
init_app(app);

// When we get a request for {app}/ we should call routes/index.js
app.get('/', routes.do_work);
app.get('/quiz', quiz.load_quiz);
app.get('/query', query.do_work);
app.get('/map', map.display_mapresults);

// Listen on the port we specify
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

///////////////////
// This function compiles the stylus CSS files, etc.
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

//////
// This is app initialization code
function init_app() {
	// all environments
	app.set('port', process.env.PORT || 80);
	
	// Use Jade to do views
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	app.use(express.favicon());
	// Set the express logger: log to the console in dev mode
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	// Use Stylus, which compiles .styl --> CSS
	app.use(stylus.middleware(
	  { src: __dirname + '/public'
	  , compile: compile
	  }
	));
	app.use(express.static(path.join(__dirname, 'public')));

	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}

}