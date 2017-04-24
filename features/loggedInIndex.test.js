var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

describe('loggedInIndex @watch', function () {
  before('Login', function (){

  })
  it('should load page and check init', function () {
    browser.url('http://localhost:3000/');
    browser.getUrl().should.equal('http://localhost:3000/views/startpage/');
    browser.getCssProperty('#reg','display').value.should.equal('block');
    browser.getCssProperty('#log','display').value.should.equal('none');
  });
  it('should switch to logg inn tab', function () {
    browser.click("#logtab");
    browser.getCssProperty('#log','display').value.should.equal('block');
    browser.getCssProperty('#reg','display').value.should.equal('none');
  });
  it('should switch to create_user tab', function () {
    browser.click("#regtab");
    browser.getCssProperty('#reg','display').value.should.equal('block');
    browser.getCssProperty('#log','display').value.should.equal('none');

  });
});
