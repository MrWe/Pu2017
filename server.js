var express = require('express');
var api = require('./apiRoutes');
var serviceAccount = require("./serviceAccountKey.json");
var bodyParser = require('body-parser')
var busboy = require('connect-busboy');

/* SETUP NODE SERVER */
var app = express();

/*
Set public folder as client side
 */
app.use(express.static('public'))

/*
Automatic redirect based on user logged in status. Redirect to views/loggedInIndex if logged in, views/startpage if not.
 */
app.all('/', function(req, res) {
  if (api.userIsLoggedIn()) {
    res.redirect('views/loggedInIndex');
  } else {
    res.redirect('views/startpage');
  }
});

var server = app.listen(process.env.PORT || 3000, listen);

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://' + host + ':' + port);
}

/* API ROUTES */
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
app.use(busboy()); // to support JSON-encoded bodies

/*
Define api endpoints
 */
app.use('/api', api.router);

/*
Error handling
 */
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.end();
});

module.exports = app; // for testing
