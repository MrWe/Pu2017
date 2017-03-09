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
  var vals = req.body;
  var db = firebase.database();
  var ref = db.ref("aurora");
  var users = ref.child("users");
  var user = users.child(firebase.auth()
    .currentUser.uid);
  var scripts = user.child('scripts')
    .push();

  //var scripts = user.child("scripts");

  scripts.set({
    vals
  });
});


router.post('/create_user', function(req, res) {
  firebase.auth()
    .createUserWithEmailAndPassword(
      req.body.mail,
      req.body.password
    )
    .then(function() {
      var db = firebase.database();
      var ref = db.ref("aurora");
      var users = ref.child("users");
      var user = users.child(firebase.auth()
        .currentUser.uid);
        user.set({
          'fname':req.body.fname,
          'lname':req.body.lname,
          'isLecturer': req.body.isLecturer
        });
      res.write('200');
      res.end();
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (error) {
        res.send(errorCode);
        res.end();
      }
    });

});


router.post('/login', function(req, res) {
  var mail = req.body.mail;
  var password = req.body.password;
  firebase.auth()
    .signInWithEmailAndPassword(mail, password)
    .then(function() {
      res.write('200');
      res.end();
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (error) {
        res.write(errorCode);
        res.end();
      }

    });
});

router.post('/logout', function(req, res) {
  firebase.auth()
    .signOut()
    .then(function() {
      res.write('200');
      res.end();
      // Sign-out successful.
    }, function(error) {
      res.write(error.errorCode);
      res.end();
      // An error happened.
    });
});


router.post('/userIsLoggedIn', function(req, res) {
  var user = firebase.auth()
    .currentUser;
  if (user) {
    // User is signed in.
    var db = firebase.database();
    var ref = db.ref("aurora");
    var users = ref.child("users");
    var user = users.child(firebase.auth()
      .currentUser.uid);
    var isLecturer = user.child('isLecturer');
    return res.send(user.email + ',' + isLecturer);
  }
});


//for internal calls
function userIsLoggedIn() {
  var user = firebase.auth()
    .currentUser;
  if (user) {
    // User is signed in.
    return true;
  }
  return false;
}

module.exports = {
  router: router,
  userIsLoggedIn: userIsLoggedIn
};


