var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

describe('newlecture ', function () {
  before('Login', function (){
    browser.url('http://localhost:3000/');
    browser.click("#logtab");
    browser.setValue('#logMail', 'UImaster@mocha.com');
    browser.setValue('#logPass', '1234567');
    browser.click('#logbtn');
    browser.waitUntil(function () {
      return browser.getUrl() != 'http://localhost:3000/views/loggedInIndex/'
    }, 5000,);
    browser.click('#settings');
  })
  it('should logout', function () {
    browser.click("#logoutbtn");
    browser.waitUntil(function () {
      return browser.getUrl() == 'http://localhost:3000/views/startpage/'
    }, 5000,);
    browser.getUrl().should.equal('http://localhost:3000/views/startpage/');
  });
  it('should return to loggedInIndex', function () {
    browser.click("#settings");
    browser.waitUntil(function () {
      return browser.getUrl() == 'http://localhost:3000/views/loggedInIndex/'
    }, 5000,);
    browser.getUrl().should.equal('http://localhost:3000/views/loggedInIndex/');
  });
});

describe('create exercise ', function () {
  before('Login', function (){
    browser.url('http://localhost:3000/');
    browser.click("#logtab");
    browser.setValue('#logMail', 'UImaster@mocha.com');
    browser.setValue('#logPass', '1234567');
    browser.click('#logbtn');
    browser.waitUntil(function () {
      return browser.getUrl() != 'http://localhost:3000/views/loggedInIndex/'
    }, 5000,);
    browser.click('#settings');
  })
  it('addcourse', function () {
    browser.click("#fag");
    browser.setValue('#course_title', 'testcourse')
    browser.click('#addCourse');
    browser.getValues('#courses').should.contain('testcourse');
  });
  it('addlecture', function () {
    browser.click("#forelesning");
    browser.setValue('#lecture_title', 'testlecture')
    browser.clikc('#addLecture');
    browser.getValues('#lectures').should.contain('testlecture');
  });
  it('addexercise', function () {
    browser.click("#øving");
    browser.setValue('#exercise_title', 'testexercise')
    browser.setValue('#descriptions', 'testexercise')
    browser.setValue('#input_1', '1');
    browser.setValue('#input_2', '2');
    browser.setValue('#input_3', '3');
    browser.setValue('#output_1', '4');
    browser.setValue('#output_2', '5');
    browser.setValue('#output_3', '6');
    browser.click('#addexercise');
    browser.getValues('#dropdown_courses').should.contain('testexercise');
  });
});

describe('newlecture tabs ', function () {
  before('Login', function (){
    browser.url('http://localhost:3000/');
    browser.click("#logtab");
    browser.setValue('#logMail', 'UImaster@mocha.com');
    browser.setValue('#logPass', '1234567');
    browser.click('#logbtn');
    browser.waitUntil(function () {
      return browser.getUrl() != 'http://localhost:3000/views/loggedInIndex/'
    }, 5000,);
    browser.click('#settings');
  })
  it('should start on addcourse tab', function () {
    browser.getCssProperty('#fagside','display').value.should.equal('block');
    browser.getCssProperty('#forelesningside','display').value.should.equal('none');
    browser.getCssProperty('#øvingsside','display').value.should.equal('none');
    browser.getCssProperty('#fag','background-color').value.should.equal('#4CAF50');
    browser.getCssProperty('#forelesning','background-color').value.should.equal('#24333B');
    browser.getCssProperty('#øving','background-color').value.should.equal('#24333B');
  });
  it('should switch to lecture tab', function () {
    browser.click('#forelesning');
    browser.getCssProperty('#fagside','display').value.should.equal('none');
    browser.getCssProperty('#forelesningside','display').value.should.equal('block');
    browser.getCssProperty('#øvingsside','display').value.should.equal('none');
    browser.getCssProperty('#fag','background-color').value.should.equal('#24333B');
    browser.getCssProperty('#forelesning','background-color').value.should.equal('#4CAF50');
    browser.getCssProperty('#øving','background-color').value.should.equal('#24333B');
  });
  it('should switch to exercise tab', function () {
    browser.click('#øving');
    browser.getCssProperty('#fagside','display').value.should.equal('none');
    browser.getCssProperty('#forelesningside','display').value.should.equal('none');
    browser.getCssProperty('#øvingsside','display').value.should.equal('block');
    browser.getCssProperty('#fag','background-color').value.should.equal('#24333B');
    browser.getCssProperty('#forelesning','background-color').value.should.equal('#24333B');
    browser.getCssProperty('#øving','background-color').value.should.equal('#4CAF50');
  });
  it('should switch to course tab', function () {
  browser.click('#fag');
  browser.getCssProperty('#fagside','display').value.should.equal('block');
  browser.getCssProperty('#forelesningside','display').value.should.equal('none');
  browser.getCssProperty('#øvingsside','display').value.should.equal('none');
  browser.getCssProperty('#fag','background-color').value.should.equal('#4CAF50');
  browser.getCssProperty('#forelesning','background-color').value.should.equal('#24333B');
  browser.getCssProperty('#øving','background-color').value.should.equal('#24333B');
  });
});
