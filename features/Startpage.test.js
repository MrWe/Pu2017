var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

describe('Start_page @watch', function () {
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
describe('Create user @watch', function () {
  it('should fill in input and trigger passord for kort',function () {
    browser.url('http://localhost:3000/');
    browser.setValue('#fornavn', 'Steinar');
    browser.setValue('#etternavn', 'Kollerud');
    browser.setValue('#regMail', 'test1234@mocha.com');
    browser.setValue('#pass', '12345');
    browser.setValue('#repPass', '12345');
    browser.click('#input_checkbox');
    browser.click('#regbtn');
    browser.getUrl().should.equal('http://localhost:3000/views/startpage/');
    browser.waitForText('#feilmelding', 5000);
    browser.getText('#feilmelding').should.equal('passord er for kort');
  });
  it('should fill in input and trigger ugyldig epost',function () {
    browser.url('http://localhost:3000/');
    browser.setValue('#fornavn', 'Steinar');
    browser.setValue('#etternavn', 'Kollerud');
    browser.setValue('#regMail', '123');
    browser.setValue('#pass', '1234567');
    browser.setValue('#repPass', '1234567');
    browser.click('#input_checkbox');
    browser.click('#regbtn');
    browser.waitForText('#feilmelding', 5000);
    browser.getUrl().should.equal('http://localhost:3000/views/startpage/');
    browser.getText('#feilmelding').should.equal('ikke gyldig mail');
  });
  it('should fill in input and trigger passord er ikke like',function () {
    browser.url('http://localhost:3000/');
    browser.setValue('#fornavn', 'Steinar');
    browser.setValue('#etternavn', 'Kollerud');
    browser.setValue('#regMail', 'test1234@mocha.com');
    browser.setValue('#pass', '1234567');
    browser.setValue('#repPass', '12345');
    browser.click('#input_checkbox');
    browser.click('#regbtn');
    browser.waitForText('#feilmelding', 5000);
    browser.getUrl().should.equal('http://localhost:3000/views/startpage/');
    browser.getText('#feilmelding').should.equal('passorende er ikke like');

  });
  it('should fill in input and create user successful',function () {
    browser.url('http://localhost:3000/');
    browser.setValue('#fornavn', 'UItemp');
    browser.setValue('#etternavn', 'mocha');
    browser.setValue('#regMail', 'UItemp@mocha.com');
    browser.setValue('#pass', '1234567');
    browser.setValue('#repPass', '1234567');
    browser.click('#input_checkbox');
    browser.click('#regbtn');
    browser.waitUntil(function () {
      return browser.getUrl() != 'http://localhost:3000/views/startpage/'
    }, 5000,);
    browser.getUrl().should.equal('http://localhost:3000/views/loggedInIndex/');
  });
  after('should delete the created user', function(done) {
    this.timeout(20000);
    chai.request(server)
      .post('/api/login')
      .send({mail:'UItemp@mocha.com', password:'1234567'})
      .end(function(err, res) {
        chai.request(server)
          .post('/api/delete')
          .end(function(err, res) {
            done();
          });
      });
  });
});

describe('Login @watch', function () {
  it('should fill in input and trigger wrong password',function () {
    browser.url('http://localhost:3000/');
    browser.click("#logtab");
    browser.setValue('#logMail', 'UImaster@mocha.com');
    browser.setValue('#logPass', '12345');
    browser.click('#regbtn');
    browser.getUrl().should.equal('http://localhost:3000/views/startpage/');
    browser.waitForText('#feilmeldinglog', 5000);
    browser.getText('#feilmeldinglog').should.equal("feil mail eller passord");
  });
  it('should fill in input and trigger wrong mail',function () {
    browser.url('http://localhost:3000/');
    browser.click("#logtab");
    browser.setValue('#logMail', 'UImaste@mocha.com');
    browser.setValue('#logPass', '1234567');
    browser.click('#regbtn');
    browser.getUrl().should.equal('http://localhost:3000/views/startpage/');
    browser.waitForText('#feilmeldinglog', 5000);
    browser.getText('#feilmeldinglog').should.equal("feil mail eller passord");
  });
  it('should fill in input and login successfuly',function () {
    browser.url('http://localhost:3000/');
    browser.click("#logtab");
    browser.setValue('#logMail', 'UImaster@mocha.com');
    browser.setValue('#logPass', '1234567');
    browser.click('#regbtn');
    browser.waitUntil(function () {
      return browser.getUrl() != 'http://localhost:3000/views/startpage/'
    }, 5000,);
    browser.getUrl().should.equal('http://localhost:3000/views/loggedInIndex/');
  });
});
