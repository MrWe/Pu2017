var express = require('express');
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");


/* SETUP NODE SERVER */
var app = express();

var server = app.listen(process.env.PORT || 3000, listen);

function listen(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://' + host + ':' + port);
}

app.use(express.static('public'));


/* FIREBASE */

admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
 databaseURL: "https://aurora-80cde.firebaseio.com"
});


/* EXAMPLE
var db = admin.database();
var ref = db.ref("server/saving-data/fireblog");


var usersRef = ref.child("users");
usersRef.set({
  teste: {
    date_of_birth: "June 23, 1912",
    full_name: "Alan Turing"
  },
  gracehop: {
    date_of_birth: "December 9, 1906",
    full_name: "Grace Hopper"
  }
});
*/
