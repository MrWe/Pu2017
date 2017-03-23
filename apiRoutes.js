var express = require('express')
var serviceAccount = require("./serviceAccountKey.json");
var firebase = require("firebase");
var storage = require('firebase/storage');
var router = express.Router()


var config = {
  apiKey: "AIzaSyBnf39lchWQO2z7UPf9nrJfm_AN7Tpd8Dg",
  authDomain: "aurora-80cde.firebaseapp.com",
  databaseURL: "https://aurora-80cde.firebaseio.com",
  storageBucket: "aurora-80cde.appspot.com",
  messagingSenderId: "30087111932"
};
firebase.initializeApp(config);


router.post('/add_lecture', function(req, res) {
  var title = req.body.title;
  var db = firebase.database();
  var ref = db.ref("aurora");
  var users = ref.child("users");
  //var creator = users.child(firebase.auth()
  //.currentUser.uid);
  var creator = firebase.auth()
    .currentUser.uid;

  var lectures = ref.child('lectures');
  var lectureChild = lectures.child(title);

  //console.log("Title", title, "creator", creator);

  lectureChild.set({
    title: title,
    creator: creator
  });

});

router.post('/get_lectures', function(req, res) {
  var db = firebase.database();
  var ref = db.ref("aurora");
  var creator = firebase.auth()
    .currentUser.uid;

  var values = {};

  var get_lectures = function(callback) {

    var lectures = ref.child('lectures')
    lectures.once("value", function(snapshot) {
      values = snapshot.val();
      callback();
    });
  }

  get_lectures(function() {
    for (var key in values) {
      if (!values[key].creator === creator) {
        delete values.key;
      }
    }
    res.send(values);
  })
});


/*
May not get used
*/
router.post('/get_exercises', function(req, res) {
  console.log(req.body.title);
  var lecture = 'fewfew';

  var db = firebase.database();
  var ref = db.ref("aurora")
    .child('lectures');
  var dbLecture = ref.child(lecture);

  var get_exercise = function(callback) {
    dbLecture.once('value', function(snapshot) {
      callback(snapshot.val());
    });
  }

  get_exercise(function(value) {
    res.send(value);
  });

});

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

router.post('/add_exercise', function(req, res) {

  var lecture_title = req.body.lecture_title;
  var exercise_title = req.body.exercise_title;
  var exercise_desc = req.body.exercise_desc;
  var exercise_input = req.body.exercise_input;
  var exercise_output = req.body.exercise_output;

  var db = firebase.database();
  var ref = db.ref("aurora");
  var lectures = ref.child("lectures");
  var lecture = lectures.child(lecture_title)
    .push();

  lecture.set({
    'exercise_title': exercise_title,
    'exercise_desc': exercise_desc,
    'exercise_input': exercise_input,
    'exercise_output': exercise_output,
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
        'fname': req.body.fname,
        'lname': req.body.lname,
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
