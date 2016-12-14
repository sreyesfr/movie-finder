var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var flash = require('flash');
var app = express();


// Define how to log events
app.use(morgan('dev'));

// parse application/x-www-form-urlencoded, with extended qs library
app.use(bodyParser.urlencoded({ extended: true }));

// Set the views directory
app.set('views', __dirname + '/views');

// Define the view (templating) engine
app.set('view engine', 'ejs');

//Set up passport
app.set('passport', require('./models/authentication.js').init(app));

// Load all routes in the routes directory
try {
	fs.readdirSync('./routes').forEach(function (file) {
		// There might be non-js files in the directory that should not be loaded
		if (path.extname(file) == '.js') {
			console.log("Adding routes in "+file);
			require('./routes/' + file).init(app);
		}
	});
} catch (exception) {
	if (exception.code == "ENOENT") {
		// No routes directory means no routes to be loaded, just move on
	} else {
		// Else not sure what went wrong.  Time to debug...
		console.error(exception);
		process.exit(1);
	}
}

// Handle Static files
app.use(express.static(__dirname + '/public'));

// Catch any routes not already handled with an error message
app.use(function(req, res) {
	var message = 'Error, did not understand path '+req.path;
	// Set the status to 404 not foun, and render a message to the user.
	res.status(404).render('error', { 'message':message });
});

var httpServer = require('http').createServer(app);

 httpServer.listen(50000, function() {
 	console.log('Listening on port:'+this.address().port);
 });