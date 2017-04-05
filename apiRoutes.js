var express = require('express')
var serviceAccount = require("./serviceAccountKey.json");
var firebase = require("firebase");
//var storage = require('firebase/storage');
var router = express.Router()
  //var gcloud = require('gcloud');
var fs = require('fs');
var Busboy = require('busboy');
var multiparty = require('multiparty');


var gcs = require('@google-cloud/storage')({
  projectId: 'aurora-80cde.appspot.com',
  keyFilename: 'serviceAccountKeygc.json'
});

//var bucket = storage.bucket('aurora-80cde.appspot.com');


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
    creator: creator,
    numPowerpoints: 0
  });

});

router.post('/upload_PDF', function(req, res) {

  var db = firebase.database();
  var ref = db.ref("aurora");
  var bucket = gcs.bucket('aurora-80cde.appspot.com');

  var options = {
    entity: 'allUsers',
    role: gcs.acl.WRITER_ROLE
  };

  bucket.acl.add(options, function(err, aclObject) {
    console.log(err)
  });

  req.pipe(req.busboy);
  req.busboy.on('error', function(err) {
    console.log(err);
  });


  req.busboy.on('field', function(fieldname, val, valTruncated, keyTruncated) {
    console.log("fieldname: " + fieldname);

  });
  var fstream;
  req.busboy.on('file', function(fieldname, file, filename) {


    var lecture = filename.split('--')[1].split('.')[0];
    var value;
    var lectures;
    var update_lecture = function(callback) {
      lectures = ref.child('lectures')
        .child(lecture);
      lectures.once("value", function(snapshot) {
        value = snapshot.val();
        callback(value.numPowerpoints);
      });
    }

    update_lecture(function(value) {
      value = value + 1;
      lectures.update({
        numPowerpoints: value
      })

      filename = filename.split('--')[1].split('.')[0] + '.' + filename.split('--')[1].split('.')[1];
      fstream = fs.createWriteStream(__dirname + '/' + filename);
      file.pipe(fstream);
      fstream.on('close', function() {
        console.log("Upload Finished of " + filename);
        //res.redirect('back'); //where to go next
      });
      bucket.upload(__dirname + '/' + filename, function(err, file) {
        if (!err) {
          console.log("lastet opp");
          fs.unlink(__dirname + '/' + filename);
        } else {
          console.log(err);
          fs.unlink(__dirname + '/' + filename);
        }
      })
    });
    // var remoteReadStream = bucket.file(file)
    //   .createReadStream();
    // var localWriteStream = fs.createWriteStream('/test/'+ filename + '.jpg');
    // remoteReadStream.pipe(localWriteStream);

  });

  req.busboy.on('finish', function() {
    //Finish it
    res.writeHead(200, {
      'Connection': 'close'
    });
    res.end("That's all folks!");
  });
});


router.post('/download_PDF', function(req, res) {
  var bucket = gcs.bucket('aurora-80cde.appspot.com');
  var db = firebase.database();
  var ref = db.ref("aurora");

  var lecture = req.body.lecture;
  console.log(req.body.lecture);

  var update_lecture = function(callback) {
    lectures = ref.child('lectures')
      .child(lecture);
    lectures.once("value", function(snapshot) {
      value = snapshot.val();
      callback(value.numPowerpoints);
    });
  }

  update_lecture(function(value) {
    res.send(value+'');
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

    console.log('//TODO');
    return res.send('//TODO');
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
