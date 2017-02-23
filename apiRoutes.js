var express = require('express')
var serviceAccount = require("./serviceAccountKey.json");
var firebase = require("firebase");
var router = express.Router()


var config = {
  apiKey: "AIzaSyBnf39lchWQO2z7UPf9nrJfm_AN7Tpd8Dg",
  authDomain: "aurora-80cde.firebaseapp.com",
  databaseURL: "https://aurora-80cde.firebaseio.com",
  storageBucket: "aurora-80cde.appspot.com",
  messagingSenderId: "30087111932"
};
firebase.initializeApp(config);


router.post('/store_content', function(req, res) {
  console.log(req.query);
  var ref = db.ref("aurora");
  var scriptsRef = ref.child("scripts");
  scriptsRef.set({
    script: "test"

  });
});


router.post('/create_user', function(req, res) {
  var vals = req.body.vals;
  console.log("Hei");
  firebase.auth()
    .createUserWithEmailAndPassword(vals[0].value, vals[1].value)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (error) {
        res.send("error");
      } else {
        res.send("success")
      }
    });


});


router.post('/login', function(req, res) {
  var vals = req.body.vals;
  firebase.auth()
    .signInWithEmailAndPassword(vals[0].value, vals[1].value)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (error) {
        res.send("error");
      } else {
        res.send("success")
      }
    });

  var user = firebase.auth()
    .currentUser;

  console.log(user);

});

router.post('/logout', function(req, res) {
  var vals = req.body.vals;
  firebase.auth()
    .signInWithEmailAndPassword(vals[0].value, vals[1].value)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (error) {
        res.send("error");
      } else {
        res.send("success")
      }
    });
});


module.exports = router;


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
