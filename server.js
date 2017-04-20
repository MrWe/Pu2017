var express = require('express');
var api = require('./apiRoutes');
var serviceAccount = require("./serviceAccountKey.json");
var bodyParser = require('body-parser')
var busboy = require('connect-busboy');

/* SETUP NODE SERVER */
var app = express();

app.use(express.static('public'))
  /*
  app.use(function(req, res, next) {
      console.log(req.path);
      console.log(req.path.indexOf('/get_all_courses'));
      if (!api.userIsLecturer() && req.path.indexOf('/get_all_courses') !== -1)
      {
        console.log("Hei2");
        res.redirect('views/loggedInIndex');
      }
      else{
        next();
      }

  });

  */

app.all('/', function(req, res) {
  //console.log("Heisann",api.userIsLecturer());
  if (api.userIsLoggedIn()) {
    res.redirect('views/loggedInIndex');
  } else {
    res.redirect('views/startpage');
  }
});

var server = app.listen(process.env.PORT || 3000, listen);

function listen() {
  var host = server.address()
    .address;
  var port = server.address()
    .port;
  console.log('App listening at http://' + host + ':' + port);
}

/* API ROUTES */
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
app.use(busboy()); // to support JSON-encoded bodies

app.use('/api', api.router);

app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.end();
});

module.exports = app; // for testing
