var assert = require('assert');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);




describe('API', function() {
  it('should return status 200 on call to create_user', function(done) {
    chai.request(server)
      .post('/api/create_user')
      .send({mail:'mocha@test.com', password:'1234567'})
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });

  it('should return status 200 on call to logout', function(done) {
    chai.request(server)
      .post('/api/logout')
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });

  it('should return status 200 on call to userIsLoggedIn', function(done) {
    chai.request(server)
      .post('/api/userIsLoggedIn')
      .end(function(err, res) {
        res.should.have.status(200);
        console.log(res.text);
        done();
      });
  });
});
