let fs = require('fs');
let http = require('http');
let url = require('url');
var userModel = require('../models/userModel.js')

exports.init = function(app) {
  app.put('/signup', putUser);
  var passport = app.get('passport');
  app.all('/', index);
  app.get('/movies',
          checkAuthentication,
          doMovies);
  app.post('/login',
          passport.authenticate('local', {
                                  failureRedirect: '/index.html',
                                  successRedirect: 'movies'}));
  app.get('/logout', doLogout);
  app.post('/addfavorite', doAddFavorite);
}


index = function(req, res) {
  res.redirect('index.html');
}

// This route is called when a new favorite is added by the user
doAddFavorite = function(request,response){
  var filter = request.body.find ? request.body.find : {};
  if (!request.body.update){
    response.render('message', {title: "Movie Finder", obj: "No update operation defined"});
    return;
  }
  var update = request.body.update;
  userModel.update(filter, update, function(status){
    response.render('message', {title: 'Movie Finder', obj: status});
  });
}

// This route is called when the user logs in
doMovies = function(req, res) {
  // We only should get here if the user has logged in (authenticated) and
  // in this case req.user should be define, but be careful anyway.
  if (req.user && req.user.screenname) {
    // Render the movies profile view
    res.render('movies', {member: req.user.screenname, username: req.user.username, password: req.user.password, favorites: req.user.favorites});
  } else {
    // Render an error if, for some reason, req.user.screenname was undefined 
    res.render('error', { 'message': 'Application error...' });
  }
}

// This route checks that the user has the required credentials to log in
function checkAuthentication(req, res, next){
    // Passport will set req.isAuthenticated
    if(req.isAuthenticated()){
        // call the next bit of middleware
        //    (as defined above this means doGame)
        next();
    } else{
        // The user is not logged in. Redirect to the login page.
        res.redirect("/index.html");
    }
}

// This route logs the user out back to the login/signup screen
function doLogout(req, res){
  // Passport puts a logout method on req to use.
  req.logout();
  // Redirect the user to the welcome page which does not require
  // being authenticated.
  res.redirect('/');
}

//  This route is used when users sign up to add a user to the database
putUser = function(request, response){
	if (Object.keys(request.body).length == 0){
		response.render('message',{title:'Movie Finder', obj:"No create message body found"});
		return;
	}
	userModel.create(request.body,function(result){
		var success = (result ? "Create successful" : "Create Unsuccessful");
		response.render('message',{title:'Movie Finder', obj:success});
	});
}

