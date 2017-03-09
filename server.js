var express = require('express');
var api = require('./apiRoutes');
var serviceAccount = require("./serviceAccountKey.json");
var bodyParser = require('body-parser')


/* SETUP NODE SERVER */
var app = express();

app.use(express.static('public'));

/*
  TEMP FIX
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

app.use('/api', api.router);
