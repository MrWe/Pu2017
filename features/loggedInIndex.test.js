var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

describe('loggedInIndex', function () {
  before('Login', function (){
    browser.url('http://localhost:3000/');
    browser.click("#logtab");
    browser.setValue('#logMail', 'UImaster@mocha.com');
    browser.setValue('#logPass', '1234567');
    browser.click('#logbtn');
    browser.waitUntil(function () {
      return browser.getUrl() != 'http://localhost:3000/views/startpage/'
    }, 5000,);
  })
  it('should logout', function () {
    browser.click("#logoutbtn");
    browser.waitUntil(function () {
      return browser.getUrl() == 'http://localhost:3000/views/startpage/'
    }, 5000,);
    browser.getUrl().should.equal('http://localhost:3000/views/startpage/');
  });
  it('should check that tabs init correctly', function () {
    browser.getCssProperty('#powerpoint','display').value.should.equal('block');
    browser.getCssProperty('#editor-container','display').value.should.equal('none');
  });
  it('should check text init correctly', function () {
    browser.getText('#exercise_desc').should.equal('Her kommer beskrivelsen til øvingene.');
    browser.getTaxt('#username').should.equal('UImaster@mocha.com');
  });
  it('should check settings button should be visible', function () {
    browser.getText('#settings').should.equal('Kontrollpanel');
  });
});

describe('loggedInIndex tabs', function () {
  before('Login', function (){
    browser.url('http://localhost:3000/');
    browser.click("#logtab");
    browser.setValue('#logMail', 'UImaster@mocha.com');
    browser.setValue('#logPass', '1234567');
    browser.click('#logbtn');
    browser.waitUntil(function () {
      return browser.getUrl() != 'http://localhost:3000/views/startpage/'
    }, 5000,);
  });
  it('should start on pp tab', function () {
    browser.getCssProperty('#powerpoint','display').value.should.equal('block');
    browser.getCssProperty('#editor-container','display').value.should.equal('none');
    browser.getCssProperty('#reset','visibility').value.should.equal('hidden');
    browser.getCssProperty('#GodkjentAvslaat','visibility').value.should.equal('hidden');
    browser.getCssProperty('#submitbtn','visibility').value.should.equal('hidden');
    browser.getCssProperty('#pp','background-color').value.should.equal('#4CAF50');
  });
  it('should switch to exerercise 1', function () {
    browser.click('#ex1');
    browser.getCssProperty('#powerpoint','display').value.should.equal('none');
    browser.getCssProperty('#editor-container','display').value.should.equal('block');
    browser.getCssProperty('#reset','visibility').value.should.equal('visible');
    browser.getCssProperty('#GodkjentAvslaat','visibility').value.should.equal('visible');
    browser.getCssProperty('#submitbtn','visibility').value.should.equal('visible');
    browser.getCssProperty('#ex1','background-color').value.should.equal('#4CAF50');
    browser.getCssProperty('#pp','background-color').value.should.equal('#24333B');
  });
  it('should switch to exercise 2', function () {
    browser.click('#ex2');
    browser.getCssProperty('#powerpoint','display').value.should.equal('none');
    browser.getCssProperty('#editor-container','display').value.should.equal('block');
    browser.getCssProperty('#reset','visibility').value.should.equal('visible');
    browser.getCssProperty('#GodkjentAvslaat','visibility').value.should.equal('visible');
    browser.getCssProperty('#submitbtn','visibility').value.should.equal('visible');
    browser.getCssProperty('#ex2','background-color').value.should.equal('#4CAF50');
    browser.getCssProperty('#pp','background-color').value.should.equal('#24333B');
  });
  it('should switch to powerpoint', function () {
  browser.click('#pp');
  browser.getCssProperty('#powerpoint','display').value.should.equal('block');
  browser.getCssProperty('#editor-container','display').value.should.equal('none');
  browser.getCssProperty('#reset','visibility').value.should.equal('hidden');
  browser.getCssProperty('#GodkjentAvslaat','visibility').value.should.equal('hidden');
  browser.getCssProperty('#submitbtn','visibility').value.should.equal('hidden');
  browser.getCssProperty('#pp','background-color').value.should.equal('#4CAF50');
  browser.getCssProperty('#ex2','background-color').value.should.equal('#24333B');
  });
});

describe('loggedInIndex  execute exercises', function () {
  before('Login', function (){
    browser.url('http://localhost:3000/');
    browser.click("#logtab");
    browser.setValue('#logMail', 'UImaster@mocha.com');
    browser.setValue('#logPass', '1234567');
    browser.click('#logbtn');
    browser.waitUntil(function () {
      return browser.getUrl() != 'http://localhost:3000/views/startpage/'
    }, 5000,);
  })
  it('Do exercise correctly should return godkjent', function () {
    browser.click("#ex1");
    browser.setValue('#editor-container', 'return x+1');
    broweser.click('#submitbtn');
    browser.getText('#GodkjentAvslaat').should.equal('Godkjent');
  });
  it('Fail exercise should return avslått', function () {
    browser.click("#ex1");
    browser.setValue('#editor-container', 'return x+2');
    broweser.click('#submitbtn');
    browser.getText('#GodkjentAvslaat').should.equal('Avslått');
  });
  it('should load exercise content', function () {
    browser.click("#ex1");
    browser.getText('#editor-container').should.equal('return x+2');
  });
});

describe('loggedInIndex  navigate to newlecture tab', function () {
  before('Login', function (){
    browser.url('http://localhost:3000/');
    browser.click("#logtab");
    browser.setValue('#logMail', 'UImaster@mocha.com');
    browser.setValue('#logPass', '1234567');
    browser.click('#logbtn');
    browser.waitUntil(function () {
      return browser.getUrl() != 'http://localhost:3000/views/startpage/'
    }, 5000,);
  })
  it('should should take u to the new lecture page', function () {
    browser.click("#settings");
    browser.waitUntil(function () {
      return browser.getUrl() != 'http://localhost:3000/views/loggedInIndex/'
    }, 5000,);
    browser.getUrl().should.equal('http://localhost:3000/views/newlecture/');
  });
});
