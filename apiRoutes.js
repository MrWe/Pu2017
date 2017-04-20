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

router.post('/user_is_lecturer', function(req, res) {
  var db = firebase.database();
  var ref = db.ref("aurora");
  var users = ref.child("users");
  //var creator = users.child(firebase.auth()
  //.currentUser.uid);
  var user = users.child(firebase.auth()
      .currentUser.uid)
    .child('isLecturer');


  var isLecturer = function(callback) {
    user.once("value", function(snapshot) {
      callback(snapshot);
    });
  }

  isLecturer(function(value) {
    res.send(value);
  })

});

router.post('/add_lecture', function(req, res) {
  var title = req.body.title;
  var course = req.body.course;
  var db = firebase.database();
  var ref = db.ref("aurora");
  var users = ref.child("users");
  //var creator = users.child(firebase.auth()
  //.currentUser.uid);
  var creator = firebase.auth()
    .currentUser.uid;

  var courses = ref.child('courses');
  var courseChild = courses.child(course);
  var lectures = courseChild.child('lectures');
  var lectureChild = lectures.child(title);


  lectureChild.set({
    title: title,
    creator: creator,
    numPowerpoints: 0
  }, function(error) {
    if (error) {
      res.send(error);
    } else {
      res.send("200");
    }
  });

});

router.post('/get_all_courses', function(req, res) {
  var db = firebase.database();
  var ref = db.ref("aurora");

  var values = {};

  var get_courses = function(callback) {
    var courses = ref.child('courses');
    courses.once("value", function(snapshot) {
      values = snapshot.val();
      callback();
    });
  }

  get_courses(function() {
    res.send(values);
  })
});


router.post('/get_courses', function(req, res) {
  var db = firebase.database();
  var ref = db.ref("aurora");
  var creator = firebase.auth()
    .currentUser.uid;

  var values = {};

  var get_courses = function(callback) {
    var courses = ref.child('courses');

    courses.once("value", function(snapshot) {
      values = snapshot.val();
      callback();
    });
  }

  get_courses(function() {
    for (var key in values) {
      if (values[key].creator !== creator) {
        delete values[key];
      }
    }
    res.send(values);
  })
});

router.post('/add_course', function(req, res) {
  var course = req.body.course;
  var db = firebase.database();
  var ref = db.ref("aurora");
  var creator = firebase.auth()
    .currentUser.uid;
  var courses = ref.child('courses');
  var courseChild = courses.child(course);

  courseChild.set({
    course: course,
    lectures: {},
    creator: creator
  });

});

router.post('/get_lectures', function(req, res) {
  var course = req.body.course;
  var db = firebase.database();
  var ref = db.ref("aurora");
  var creator = firebase.auth()
    .currentUser.uid;

  var values = {};

  var get_lectures = function(callback) {
    var firebasecourse = ref.child('courses')
      .child(course);
    var lectures = firebasecourse.child('lectures');
    lectures.once("value", function(snapshot) {
      values = snapshot.val();
      callback();
    });
  }

  get_lectures(function() {
    res.send(values);

  })
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

    var lecture = filename.split(':')[1].split('.')[0];
    var course = filename.split(':')[0].split('.')[0];
    console.log("Lecture:", lecture)
    console.log("Course:", course)
    var value;
    var lectures;

    var update_lecture = function(callback) {
      lectures = ref.child('courses').child(course)
        .child('lectures')
        .child(lecture);
      lectures.once("value", function(snapshot) {
        value = snapshot.val();
        callback(value.numPowerpoints);
      });
    }

    update_lecture(function(value) {
      if (!isNaN(value)) {
        value = value + 1;
        lectures.update({
          numPowerpoints: value
        })
      }

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
  var course = req.body.course;

  var update_lecture = function(callback) {
    lectures = ref.child('courses').child(course)
      .child('lectures')
      .child(lecture);
    lectures.once("value", function(snapshot) {
      value = snapshot.val();
      callback(value.numPowerpoints);
    });
  }

  update_lecture(function(value) {
    res.send(value + '');
  });
});



/*
May not get used
*/
/*
router.post('/get_exercises', function(req, res) {
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
*/

router.post('/store_content', function(req, res) {
  var userCode = req.body.userCode;
  var exerciseId = req.body.exerciseId;
  console.log(userCode, exerciseId);
  var db = firebase.database();
  var ref = db.ref("aurora");
  var users = ref.child("users");
  var user = users.child(firebase.auth()
    .currentUser.uid);
  var scripts = user.child('scripts');
  var exercise = scripts.child(exerciseId);

  exercise.set({
    userCode
  });
});

router.post('/get_content', function(req, res) {
  var exerciseId = req.body.exerciseId;
  var db = firebase.database();
  var ref = db.ref("aurora");
  var users = ref.child("users");
  var user = users.child(firebase.auth()
    .currentUser.uid);
  var scripts = user.child('scripts');
  var exercise = scripts.child(exerciseId);


  var get_code = function(callback) {
    exercise.once("value", function(snapshot) {
      callback(snapshot.val());
    });
  }

  get_code(function(value) {
    console.log(value);
    return res.send(value);
  })


});

router.post('/add_exercise', function(req, res) {
  var course = req.body.course;
  var lecture_title = req.body.lecture_title;
  var exercise_title = req.body.exercise_title;
  var exercise_desc = req.body.exercise_desc;
  var exercise_input_1 = req.body.exercise_input_1;
  var exercise_output_1 = req.body.exercise_output_1;
  var exercise_input_2 = req.body.exercise_input_2;
  var exercise_output_2 = req.body.exercise_output_2;
  var exercise_input_3 = req.body.exercise_input_3;
  var exercise_output_3 = req.body.exercise_output_3;

  var db = firebase.database();
  var ref = db.ref("aurora");
  var firebasecourse = ref.child('courses')
    .child(course);
  var lectures = firebasecourse.child("lectures");
  var lecture = lectures.child(lecture_title)
    .push();

  lecture.set({
    'exercise_title': exercise_title,
    'exercise_desc': exercise_desc,
    'exercise_input_1': exercise_input_1,
    'exercise_output_1': exercise_output_1,
    'exercise_input_2': exercise_input_2,
    'exercise_output_2': exercise_output_2,
    'exercise_input_3': exercise_input_3,
    'exercise_output_3': exercise_output_3,

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
  var db = firebase.database();
  var ref = db.ref("aurora");
  var users = ref.child("users");
  if (user) {
    var user = users.child(firebase.auth()
      .currentUser.uid);

    var get_user = function(callback) {
      user.once("value", function(snapshot) {
        callback(snapshot.val());
      });
    }

    get_user(function(value) {
      return res.send(value.fname + ',' + value.isLecturer);
    })

    //console.log(user.email + ',' + isLecturer);
  } else {
    return res.send('Not logged in');
  }
});




//for internal calls
function userIsLoggedIn(req, res, next) {
  var user = firebase.auth()
    .currentUser;

  if (user) {
    // User is signed in.
    return true;
  }

  return false;
}

function userIsLecturer(req, res, next) {
  var user = firebase.auth()
    .currentUser;
  var db = firebase.database();
  var ref = db.ref("aurora");
  var users = ref.child("users");
  if (user) {
    var user = users.child(firebase.auth()
      .currentUser.uid);

    var get_user = function(callback) {
      user.once("value", function(snapshot) {
        callback(snapshot.val());
      });
    }

    get_user(function(value) {
      console.log(value['isLecturer']);
      return value['isLecturer'];
    })

    //console.log(user.email + ',' + isLecturer);
  } else {
    return false;
  }
}

module.exports = {
  router: router,
  userIsLoggedIn: userIsLoggedIn,
  userIsLecturer: userIsLecturer

};
