/*var chai = require('chai');
var expect = require('chai').expect;
var chaiHTTP = require('chai-http');
var server = require('../server.js')
chai.use(chaiHTTP);


describe('Create User', function(){

  it('Check if user already exist', function(){

  });

  it('Check if Create User was successful', function(){
    chai.request('../server.js')
      .post('/api/create_user')
      .send({email: 'test123@gmail.com', password: '1234567'}),
      .end(function(res)){
        console.log('Hello');
        expect(res).to.be.equal('success');
        done();
       });
  });

  it('Check if Create User input was valid', function(){

  });
});
*/
