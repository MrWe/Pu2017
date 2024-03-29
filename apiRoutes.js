var express = require('express')
var serviceAccount = require("./serviceAccountKey.json");
var firebase = require("firebase");
var router = express.Router()
var fs = require('fs');
var Busboy = require('busboy');
var multiparty = require('multiparty');

/*
Define google cloud storage config
 */
var gcs = require('@google-cloud/storage')({projectId: 'aurora-80cde.appspot.com', keyFilename: 'serviceAccountKeygc.json'});

/*
Define firebase config
 */
var config = {
  apiKey: "AIzaSyBnf39lchWQO2z7UPf9nrJfm_AN7Tpd8Dg",
  authDomain: "aurora-80cde.firebaseapp.com",
  databaseURL: "https://aurora-80cde.firebaseio.com",
  storageBucket: "aurora-80cde.appspot.com",
  messagingSenderId: "30087111932"
};
firebase.initializeApp(config);

/**
 * Queries Firebase to see if current user is registered as a lecturer.
 * @param  {Object} req [Not used]
 * @param  {Object} res [Responds with true or false]
 */
router.post('/user_is_lecturer', function(req, res) {
  try {
    var db = firebase.database();
    var ref = db.ref("aurora");
    var users = ref.child("users");
    var user = users.child(firebase.auth().currentUser.uid).child('isLecturer');

    var isLecturer = function(callback) {
      user.once("value", function(snapshot) {
        callback(snapshot);
      });
    }

    isLecturer(function(value) {
      res.send(value);
    })
  } catch (error) {
    res.write(error.message);
    res.end();
  }

});

/**
 * Adds a lecture to the database under correct course.
 * @param  {Object} req [req.title = lecture title]
 * @param  {Object} res [Responds with error message if exists]
 */
router.post('/add_lecture', function(req, res) {
  try {
    var title = req.body.title;
    var course = req.body.course;
    var db = firebase.database();
    var ref = db.ref("aurora");
    var users = ref.child("users");
    //var creator = users.child(firebase.auth()
    //.currentUser.uid);
    var creator = firebase.auth().currentUser.uid;
    var courses = ref.child('courses');
    var courseChild = courses.child(course);
    var lectures = courseChild.child('lectures');
    var lectureChild = lectures.child(title);

    lectureChild.set({title: title, creator: creator, numPowerpoints: 0});
    res.write('lecture_added');
    res.end();
  } catch (error) {
    res.write(error.message);
    res.end();
  }
});

/**
 * Queries Firebase for all courses.
 * @param  {Object} req [Not used]
 * @param  {Object} res [Responds with courses]
 */
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

/**
 * Queries Firebase for all courses. The function
 * then removes all courses not made by this user and sends them back
 * to the client.
 * @param  {Object} req [Not used]
 * @param  {Object} res [Responds with courses]
 */
router.post('/get_courses', function(req, res) {
  var db = firebase.database();
  var ref = db.ref("aurora");
  var creator = firebase.auth().currentUser.uid;

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

/**
 * Adds a course to the database.
 * @param  {Object} req [req.body.course = course title]
 * @param  {Object} res [Responds with error message if exists]
 */
router.post('/add_course', function(req, res) {
  try {
    var course = req.body.course;
    var db = firebase.database();
    var ref = db.ref("aurora");
    var creator = firebase.auth().currentUser.uid;
    var courses = ref.child('courses');
    var courseChild = courses.child(course);
    courseChild.set({course: course, lectures: {}, creator: creator});
    res.write('course_added');
    res.end();
  } catch (error) {
    res.write(error.message);
    res.end();
  }
});

/**
 * Queries Firebase for lectures under specific course.
 * @param  {Object} req [req.body.course = course title]
 * @param  {Object} res [Responds with lectures under course]
 */
router.post('/get_lectures', function(req, res) {
  var course = req.body.course;
  var db = firebase.database();
  var ref = db.ref("aurora");
  var creator = firebase.auth().currentUser.uid;

  var values = {};

  var get_lectures = function(callback) {
    var firebasecourse = ref.child('courses').child(course);
    var lectures = firebasecourse.child('lectures');
    lectures.once("value", function(snapshot) {
      values = snapshot.val();
      callback();
    });
  }
  try {
    get_lectures(function() {
      res.send(values);
    })
  } catch (error) {
    res.write(error.message);
    res.end();
  }
});

/**
 * Queries Google cloud to upload PDF. The PDF is written to the filesystem
 * to be able to reference a path for google cloud.
 * @param  {Object} req [Contains PDF]
 * @param  {Object} res [Not used]
 */
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
      lectures = ref.child('courses').child(course).child('lectures').child(lecture);
      lectures.once("value", function(snapshot) {
        value = snapshot.val();
        callback(value.numPowerpoints);
      });
    }

    update_lecture(function(value) {
      if (!isNaN(value)) {
        value = value + 1;
        lectures.update({numPowerpoints: value})
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
    res.writeHead(200, {'Connection': 'close'});
    res.end("That's all folks!");
  });

});

/*
Currently not used. May get used for future features.
 */
router.post('/download_PDF', function(req, res) {
  var bucket = gcs.bucket('aurora-80cde.appspot.com');
  var db = firebase.database();
  var ref = db.ref("aurora");

  var lecture = req.body.lecture;
  var course = req.body.course;

  var update_lecture = function(callback) {
    lectures = ref.child('courses').child(course).child('lectures').child(lecture);
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

/**
 * Queries firebase to store scripts written by users to their account.
 * @param  {Object} req [req.body.userCode = script to be stored, req.body.exerciseId = exercise script is written for]
 * @param  {Object} res [Responds with 'content_stored' if no errors, error message if error]
 */
router.post('/store_content', function(req, res) {
  try {
    var userCode = req.body.userCode;
    var exerciseId = req.body.exerciseId;
    console.log(userCode, exerciseId);
    var db = firebase.database();
    var ref = db.ref("aurora");
    var users = ref.child("users");
    var user = users.child(firebase.auth().currentUser.uid);
    var scripts = user.child('scripts');
    var exercise = scripts.child(exerciseId);

    exercise.set({userCode});
    res.write('content_stored');
    res.end();
  } catch (error) {
    res.write(error.message);
    res.end();
  }
});

/**
 * Queries Firebase to get scripts written by users when accessing an exercise
 * @param  {Object} req [req.body.exerciseId = current exercise the user is on]
 * @param  {Object} res [Responds with script, error message if exists]
 */
router.post('/get_content', function(req, res) {
  try {
    var exerciseId = req.body.exerciseId;
    var db = firebase.database();
    var ref = db.ref("aurora");
    var users = ref.child("users");
    var user = users.child(firebase.auth().currentUser.uid);
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
  } catch (error) {
    res.write(error.message);
    res.end();
  }
});

/**
 * Queries Firebase to add exercise to specific lecture
 * @param  {Object} req [
 * req.body.course = course title
 * req.body.lecture_title = lecture title
 * req.body.exercise_title = exercise title
 * req.body.exercise_desc = exercise description
 * req.body.exercise_input_*number* = input for function in exercise
 * req.body.exercise_output_*number* = expected output for function in exercise
 * ]
 * @param  {Object} res [Responds with 'exercise_added', error message if exists]
 */
router.post('/add_exercise', function(req, res) {
  try {
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
    var firebasecourse = ref.child('courses').child(course);
    var lectures = firebasecourse.child("lectures");
    var lecture = lectures.child(lecture_title).push();

    lecture.set({
      'exercise_title': exercise_title,
      'exercise_desc': exercise_desc,
      'exercise_input_1': exercise_input_1,
      'exercise_output_1': exercise_output_1,
      'exercise_input_2': exercise_input_2,
      'exercise_output_2': exercise_output_2,
      'exercise_input_3': exercise_input_3,
      'exercise_output_3': exercise_output_3
    });
    res.write('exercise_added');
    res.end();
  } catch (error) {
    res.write(error.message);
    res.end();
  }
});

/**
 * Queries Firebase to create a user. Firebases createUserWithEmailAndPassword is used.
 * @param  {Object} req [req.body.mail = User email, req.body.password = user password]
 * @param  {Object} res [Responds with 'User created', error message if exists]
 */
router.post('/create_user', function(req, res) {
  firebase.auth().createUserWithEmailAndPassword(req.body.mail, req.body.password).then(function() {
    var db = firebase.database();
    var ref = db.ref("aurora");
    var users = ref.child("users");
    var user = users.child(firebase.auth().currentUser.uid);
    user.set({'fname': req.body.fname, 'lname': req.body.lname, 'isLecturer': req.body.isLecturer});
    res.write('User created');
    res.end();
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    if (error) {
      res.send(errorCode);
      res.end();
    }
  });

});

/**
 * Queries Firebase to login a user. Firebases signInWithEmailAndPassword is used.
 * @param  {Object} req [req.body.mail = User email, req.body.password = user password]
 * @param  {Object} res [Responds with 'Login successful', error message if exists]
 */
router.post('/login', function(req, res) {
  var mail = req.body.mail;
  var password = req.body.password;
  firebase.auth().signInWithEmailAndPassword(mail, password).then(function() {
    res.write('Login successful');
    res.end();
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    if (error) {
      res.write(errorCode);
      res.end();
    }

  });
});

/*
Logs out the current user
 */
router.post('/logout', function(req, res) {
  firebase.auth().signOut().then(function() {
    res.write('Logout successful');
    res.end();
    // Sign-out successful.
  }, function(error) {
    res.write(error.errorCode);
    res.end();
    // An error happened.
  });
});

/**
 * Queries Firebase to check if user is logged in
 * @param  {Object} req [Not used]
 * @param  {Object} res [Responds with value.fname + ',' + value.isLecturer if logged in, 'Not logged in' if not logged in]
 */
router.post('/userIsLoggedIn', function(req, res) {
  var user = firebase.auth().currentUser;
  var db = firebase.database();
  var ref = db.ref("aurora");
  var users = ref.child("users");
  if (user) {
    var user = users.child(firebase.auth().currentUser.uid);

    var get_user = function(callback) {
      user.once("value", function(snapshot) {
        callback(snapshot.val());
      });
    }

    get_user(function(value) {
      return res.send(value.fname + ',' + value.isLecturer);
    })
  } else {
    return res.send('Not logged in');
  }
});

/**
 * Queries Firebase to delete logged in user
 * @param  {Object} req [Not used]
 * @param  {Object} res [Responds with 'Delete successful', error message if exists]
 */
router.post('/delete', function(req, res) {
  try {
    var user = firebase.auth().currentUser;
    user.delete().then(function() {
      res.write('Delete successful');
      res.end();
    });
  } catch (error) {
    res.write(error.message);
    res.end();
  }
});

//for internal calls
function userIsLoggedIn(req, res, next) {
  var user = firebase.auth().currentUser;
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
