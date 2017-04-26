var assert = require('assert');
var chai = require('chai');
var apiRoutes = require('../apiRoutes');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

/*
This file contain back-end unit tests for the project, to see front-end unit tests
see the features directory.
To run back-end unit tests, execute "run test"
To show coverage, execute "run showcoverage"
To run front-end tests, execute "chimp --mocha"
*/

describe('Create_User', function() {
  it('should return status 200 on call to create_user', function(done) {
    chai.request(server)
      .post('/api/create_user')
      .send({mail:'mocha@test.com', password:'1234567' , fname: 'backend',
       lname: 'tester', isLecturer: 'true'})
      .end(function(err, res) {
        res.should.have.status(200);
        res.text.should.equal('User created')
        done();
      });
  });

  it('Should return error if wrong password', function(done){
    chai.request(server)
      .post('/api/create_user')
      .send({mail:'mocha@test.com', password:'12345'})
      .end(function(err, res) {
        res.should.have.status(200);
        res.text.should.equal('auth/weak-password')
        done();
      });
  });

  it('Should return error if wrong username', function(done){
    chai.request(server)
      .post('/api/create_user')
      .send({mail:'WrongUsername', password:'123457'})
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.not.equal('auth/invalid-email')
        done();
      });
  });
});

describe('Login', function() {
  it('should return status 200 on valid username and password', function(done) {
    chai.request(server)
      .post('/api/login')
      .send({mail:'mocha@test.com', password:'1234567'})
      .end(function(err, res) {
        res.should.have.status(200);
        res.text.should.equal('Login successful');
        done();
      });
  });

  it('should return error on wrong username', function(done) {
    chai.request(server)
      .post('/api/login')
      .send({mail:'WrongUsername', password:'123457'})
      .end(function(err, res) {
        res.should.have.status(200);
        res.text.should.equal('auth/invalid-email');
        done();
      });
  });

  it('should return error on wrong passqord', function(done) {
    chai.request(server)
      .post('/api/login')
      .send({mail:'mocha@test.com', password:'12345'})
      .end(function(err, res) {
        res.should.have.status(200);
        res.text.should.equal('auth/wrong-password');
        done();
      });
  });
});

describe('user is lecture', function() {
  it('should return status 200 on call to userIsLoggedIn', function(done) {
    chai.request(server)
      .post('/api/login')
      .send({mail:'mocha@test.com', password:'1234567'})
      .end(function(err, res) {
        chai.request(server)
          .post('/api/user_is_lecturer')
          .end(function(err, res) {
            res.should.have.status(200);
            res.text.should.equal('"true"');
            done();
          });
      });
  });
  it('should return error on not logged in', function(done) {
    chai.request(server)
      .post('/api/logout')
      .end(function(err, res) {
        chai.request(server)
          .post('/api/user_is_lecturer')
          .end(function(err, res) {
            res.should.have.status(200);
            res.text.should.equal("Cannot read property 'uid' of null");
            done();
      });
    });
  });
});

describe('userIsLoggedIn', function() {
  it('should return status 200 on call to userIsLoggedIn', function(done) {
    chai.request(server)
      .post('/api/login')
      .send({mail:'mocha@test.com', password:'1234567'})
      .end(function(err, res) {
        chai.request(server)
          .post('/api/userIsLoggedIn')
          .end(function(err, res) {
            res.should.have.status(200);
            res.text.should.equal('backend,true');
            done();
          });
      });
  });
  it('should return error on not logged in', function(done) {
    chai.request(server)
      .post('/api/logout')
      .end(function(err, res) {
        chai.request(server)
          .post('/api/userIsLoggedIn')
          .end(function(err, res) {
            res.should.have.status(200);
            res.text.should.equal('Not logged in');
            done();
      });
    });
  });
});

describe('userIsLoggedIN', function() {
  it('should return true', function(done) {
    chai.request(server)
      .post('/api/login')
      .send({mail:'mocha@test.com', password:'1234567'})
      .end(function(err, res) {
        apiRoutes.userIsLoggedIn().should.equal(true);
        done();
      });
  });
  it('should return false', function(done) {
    chai.request(server)
      .post('/api/logout')
      .end(function(err, res) {
        apiRoutes.userIsLoggedIn().should.equal(false);
        done();
      });
  });
});

describe('Logout', function() {
  it('should return status 200 on success', function(done) {
    chai.request(server)
      .post('/api/logout')
      .end(function(err, res) {
        res.should.have.status(200);
        res.text.should.equal('Logout successful');
        done();
      });
  });
});

describe('Delete', function() {
  it('should return status 200 and user deleted', function(done) {
    this.timeout(20000);
    chai.request(server)
      .post('/api/login')
      .send({mail:'mocha@test.com', password:'1234567'})
      .end(function(err, res) {
        chai.request(server)
          .post('/api/delete')
          .end(function(err, res) {
            res.should.have.status(200);
            res.text.should.equal('Delete successful');
            done();
          });
      });
  });
  it('should return error since no user found', function(done) {
    chai.request(server)
      .post('/api/delete')
      .end(function(err, res) {
        res.should.have.status(200);
        res.text.should.equal("Cannot read property 'delete' of null");
        done();
      });
  });
});

describe('add_course', function() {
  before(function(done) {
    chai.request(server)
      .post('/api/login')
      .send({mail:'testmaster@mocha.com', password:'123456'})
      .end(function(err, res) {
      done();
    });
  });
  it('should return status 200 and course_added', function(done) {
      chai.request(server)
        .post('/api/add_course')
        .send({course:'test'})
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.equal('course_added');
          done();
      });
    });
    it('return error with null input', function(done) {
        chai.request(server)
          .post('/api/add_course')
          .send({course:''})
          .end(function(err, res) {
            res.should.have.status(200);
            res.text.should.equal("Firebase.child failed: First argument was an invalid path: \"\"."+
            " Paths must be non-empty strings and can't contain \".\", \"#\", \"$\", \"[\", or \"]\"");
            done();
        });
      });
    it('return error with invalid input', function(done) {
        chai.request(server)
          .post('/api/add_course')
          .send({course:'test.'})
          .end(function(err, res) {
            res.should.have.status(200);
            res.text.should.equal("Firebase.child failed: First argument was an invalid path: \"test.\"."+
            " Paths must be non-empty strings and can't contain \".\", \"#\", \"$\", \"[\", or \"]\"");
            done();
          });
      });
  });

describe('get_courses', function() {
  before(function(done) {
    chai.request(server)
      .post('/api/login')
      .send({mail:'testmaster@mocha.com', password:'123456'})
      .end(function(err, res) {
      done();
    });
  });
  it('should return status 200 and the courses we created', function(done) {
      chai.request(server)
        .post('/api/get_courses')
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.contain("test");
          done();
      });
    });
});

describe('get_all_courses', function() {
  before(function(done) {
    chai.request(server)
      .post('/api/login')
      .send({mail:'testmaster@mocha.com', password:'123456'})
      .end(function(err, res) {
      done();
    });
  });
  it('should return status 200 and course_added', function(done) {
      chai.request(server)
        .post('/api/get_all_courses')
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.contain("test");
          done();
      });
    });
  });

describe('add_lecture', function() {
  before(function(done) {
    chai.request(server)
      .post('/api/login')
      .send({mail:'testmaster@mocha.com', password:'123456'})
      .end(function(err, res) {
      done();
    });
  });
  it('should return status 200 and lecture_added', function(done) {
      chai.request(server)
        .post('/api/add_lecture')
        .send({title:'testlecture', course: 'test'})
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.equal('lecture_added');
          done();
      });
    });
  it('return error with null input', function(done) {
      chai.request(server)
        .post('/api/add_lecture')
        .send({title:'', course: 'test'})
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.equal("Firebase.child failed: First argument was an invalid path: \"\"."+
          " Paths must be non-empty strings and can't contain \".\", \"#\", \"$\", \"[\", or \"]\"");
          done();
      });
    });
  it('return error with invalid input', function(done) {
      chai.request(server)
        .post('/api/add_lecture')
        .send({title:'testlecture.', course: 'test'})
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.equal("Firebase.child failed: First argument was an invalid path: \"testlecture.\"."+
          " Paths must be non-empty strings and can't contain \".\", \"#\", \"$\", \"[\", or \"]\"");
          done();
        });
    });
  it('return error with no course', function(done) {
      chai.request(server)
        .post('/api/add_lecture')
        .send({title:'testlecture', course: ''})
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.equal("Firebase.child failed: First argument was an invalid path: \"\"."+
          " Paths must be non-empty strings and can't contain \".\", \"#\", \"$\", \"[\", or \"]\"");
          done();
        });
    });
});

describe('get_lectures', function() {
  before(function(done) {
    chai.request(server)
      .post('/api/login')
      .send({mail:'testmaster@mocha.com', password:'123456'})
      .end(function(err, res) {
      done();
    });
  });
  it('should return status 200 and testlecture', function(done) {
      chai.request(server)
        .post('/api/get_lectures')
        .send({course: 'test'})
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.contain("testlecture");
          done();
      });
    });
  it('should return status course cant be null', function(done) {
      chai.request(server)
        .post('/api/get_lectures')
        .send({course: ''})
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.equal("Firebase.child failed: First argument was an invalid path: \"\"."+
          " Paths must be non-empty strings and can't contain \".\", \"#\", \"$\", \"[\", or \"]\"");
          done();
      });
    });
    it('should return null if course dont exist', function(done) {
        chai.request(server)
          .post('/api/get_lectures')
          .send({course: 'wrong'})
          .end(function(err, res) {
            res.should.have.status(200);
            res.text.should.equal("");
            done();
        });
      });
});

describe('add_exercise', function() {
  before(function(done) {
    chai.request(server)
      .post('/api/login')
      .send({mail:'testmaster@mocha.com', password:'123456'})
      .end(function(err, res) {
      done();
    });
  });
  it('should return status 200 and lecture_added', function(done) {
      chai.request(server)
        .post('/api/add_exercise')
        .send({lecture_title:'testlecture', course: 'test', exercise_title: 'testexercise',
          exercise_desc: 'test123', exercise_input_1: '1', exercise_input_2: '2', exercise_input_3: '3',
          exercise_output_1: '2', exercise_output_2: '3', exercise_output_3: '3'})
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.equal('exercise_added');
          done();
      });
    });
  it('should return status 200 and lecture_added', function(done) {
      chai.request(server)
        .post('/api/add_exercise')
        .send({lecture_title:'testlecture', course: 'test', exercise_title: '',
          exercise_desc: 'test123', exercise_input_1: '1', exercise_input_2: '2', exercise_input_3: '3',
          exercise_output_1: '2', exercise_output_2: '3', exercise_output_3: '3'})
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.equal('exercise_added');
          done();
      });
    });
  it('should return status 200 and lecture_added', function(done) {
      chai.request(server)
        .post('/api/add_exercise')
        .send({lecture_title:'testlecture', course: 'test', exercise_title: 'testexercise.',
          exercise_desc: 'test123', exercise_input_1: '1', exercise_input_2: '2', exercise_input_3: '3',
          exercise_output_1: '2', exercise_output_2: '3', exercise_output_3: '3'})
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.equal('exercise_added');
          done();
        });
    });
  it('return error with no lecture', function(done) {
      chai.request(server)
        .post('/api/add_exercise')
        .send({lecture_title:'', course: 'test', exercise_title: 'testexercise',
          exercise_desc: 'test123', exercise_input_1: '1', exercise_input_2: '2', exercise_input_3: '3',
          exercise_output_1: '2', exercise_output_2: '3', exercise_output_3: '3'})
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.equal("Firebase.child failed: First argument was an invalid path: \"\"."+
          " Paths must be non-empty strings and can't contain \".\", \"#\", \"$\", \"[\", or \"]\"");
          done();
        });
    });
  it('return error with no input', function(done) {
      chai.request(server)
        .post('/api/add_exercise')
        .send({lecture_title:'', course: 'test', exercise_title: 'testexercise',
          exercise_desc: 'test123'})
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.equal("Firebase.child failed: First argument was an invalid path: \"\"."+
          " Paths must be non-empty strings and can't contain \".\", \"#\", \"$\", \"[\", or \"]\"");
          done();
        });
    });
  it('return error with no output', function(done) {
      chai.request(server)
        .post('/api/add_exercise')
        .send({lecture_title:'', course: 'test', exercise_title: 'testexercise',
          exercise_desc: 'test123', exercise_input_1: '1', exercise_input_2: '2', exercise_input_3: '3',
          exercise_output_1: '', exercise_output_2: '', exercise_output_3: ''})
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.equal("Firebase.child failed: First argument was an invalid path: \"\"."+
          " Paths must be non-empty strings and can't contain \".\", \"#\", \"$\", \"[\", or \"]\"");
          done();
        });
    });
  });

describe('store_content', function() {
  before(function(done) {
    chai.request(server)
      .post('/api/login')
      .send({mail:'testmaster@mocha.com', password:'123456'})
      .end(function(err, res) {
      done();
    });
  });
  it('should return status 200 and content_stored', function(done) {
      chai.request(server)
        .post('/api/store_content')
        .send({userCode: 'testCode', exerciseId: '-KiRwOLYZxE6wk5olKNW'})
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.equal('content_stored');
          done();
      });
    });
  it('should return error exerciseId id cant be null', function(done) {
      chai.request(server)
        .post('/api/store_content')
        .send({userCode: 'testCode', exerciseId: ''})
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.equal("Firebase.child failed: First argument was an invalid path: \"\"."+
          " Paths must be non-empty strings and can't contain \".\", \"#\", \"$\", \"[\", or \"]\"");
          done();
      });
    });
    it('should return content_stored if content is null', function(done) {
        chai.request(server)
          .post('/api/store_content')
          .send({userCode: '', exerciseId: 'KiRmh6OTczsg0PbDlrN'})
          .end(function(err, res) {
            res.should.have.status(200);
            res.text.should.equal('content_stored');
            done();
        });
      });
});

describe('get_content', function() {
  before(function(done) {
    chai.request(server)
      .post('/api/login')
      .send({mail:'testmaster@mocha.com', password:'123456'})
      .end(function(err, res) {
      done();
    });
  });
  it('should return status 200 and testCode', function(done) {
      chai.request(server)
        .post('/api/get_content')
        .send({exerciseId: '-KiRwOLYZxE6wk5olKNW'})
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.contain('testCode');
          done();
      });
    });
  it('should return error course id cant be null', function(done) {
      chai.request(server)
        .post('/api/get_content')
        .send({exerciseId: ''})
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.equal("Firebase.child failed: First argument was an invalid path: \"\"."+
          " Paths must be non-empty strings and can't contain \".\", \"#\", \"$\", \"[\", or \"]\"");
          done();
      });
    });
});
