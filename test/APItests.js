var assert = require('assert');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

describe('Create_User', function() {
  it('should return status 200 on call to create_user', function(done) {
    chai.request(server)
      .post('/api/create_user')
      .send({mail:'mocha@test.com', password:'1234567'})
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

//Venter på fiks i APIet
/*
describe('userIsLoggedIn', function() {
  it('should return status 200 on call to userIsLoggedIn', function(done) {
    chai.request(server)
      .post('/api/userIsLoggedIn')
      .end(function(err, res) {
        res.should.have.status(200);
        console.log(res.text);
        done();
      });
  });
  it('should return error on not logged in', function(done) {
    chai.request(server)
      .post('/api/logout')
      .end(function(err, res) {
        chai.request(server)
          .post('/api/userIsLoggedIn')
          .end(function(err, res) {
            console.log(res.text);
            res.should.have.status(200);
            res.text.should.equal('Not logged in');
            done();
      });
    });
  });
});*/

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
/*
  after('Delete user', function(done){
    this.timeout(20000);
    chai.request(server)
      .post('/api/login')
      .send({mail:'mocha@test.com', password:'1234567'})
      .end(function(err, res) {
        chai.request(server)
          .post('/api/delete')
          .end(function(err, res) {
            done();
          });
      });
  });*/
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
        //console.log(res.text)
        console.log(res.status);
        console.log(res.text);
        res.should.have.status(200);
        res.text.should.equal("Cannot read property 'delete' of null");
        done();
      });
  });
});
