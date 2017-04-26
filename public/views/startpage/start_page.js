function init() {
  //initialize the tabs with regtab as first selected
  document.getElementById("regtab").style.background = '#4CAF50';
  document.getElementById("logtab").style.background = '#24333B';
}

function create() {
  //switches to regtab tab
  if (document.getElementById('reg').style.display == 'none') {
    document.getElementById('reg').style.display = 'block';
    document.getElementById('log').style.display = 'none';
    document.getElementById("regtab").style.background = '#4CAF50';
    document.getElementById("logtab").style.background = '#24333B';
  }
  return false;
}
function login() {
  //switches to login tab
  if (document.getElementById('reg').style.display == 'block') {
    document.getElementById('reg').style.display = 'none';
    document.getElementById('log').style.display = 'block';
    document.getElementById("logtab").style.background = '#4CAF50';
    document.getElementById("regtab").style.background = '#24333B';
  }
  return false;
}

$(function() {
  //Login
  $("#loginForm").submit(function(event) {
    var mail = $('#loginForm:first-child')[0][0].value;
    var password = $('#loginForm:first-child')[0][1].value;
    $.post('/api/login', {
      'mail': mail,
      'password': password
    }).done(function(res) {
      if (res === 'Login successful') {
        sessionStorage.setItem('status', 'loggedIn');
        sessionStorage.setItem('currUser', mail);
        console.log("Logged in");
        window.location = "/";
      } else {
        document.getElementById('feilmeldinglog').innerHTML = "feil mail eller passord";
        console.log("Could not log in");
      }
    });
    event.preventDefault();
  });

  //Register
  $("#registerForm").submit(function(event) {
    var fname = $(event.currentTarget)[0][0].value;
    var lname = $(event.currentTarget)[0][1].value;
    var mail = $(event.currentTarget)[0][2].value;
    var password = $(event.currentTarget)[0][3].value;
    var passwordRepeat = $(event.currentTarget)[0][4].value;
    var isLecturer;
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //isLecturer = $('input[name="isLecturer"]:checked').length > 0;
    if ($('input[name="isLecturer"]:checked').length > 0) {
      isLecturer = true;
    } else {
      isLecturer = false;
    }
    if (password == passwordRepeat) {
      $.post('/api/create_user', {
        'isLecturer': isLecturer,
        'fname': fname,
        'lname': lname,
        'mail': mail,
        'password': password
      }).done(function(res) {
        if (res === 'User created') {
          sessionStorage.setItem('status', 'loggedIn');
          sessionStorage.setItem('currUser', mail);
          console.log("Logged in");
          window.location = '/';
        } else {
          if (password.length < 6) {
            document.getElementById('feilmelding').innerHTML = "passord er for kort"
          } else if (!regex.test(mail)) {
            document.getElementById('feilmelding').innerHTML = "ikke gyldig mail";
          }
          console.log("Could not log in");
        }
      });
    } else {
      document.getElementById('feilmelding').innerHTML = "passorende er ikke like"
    }
    return false;
  });

});
