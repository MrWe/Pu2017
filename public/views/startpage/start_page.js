function init() {
    document.getElementById("regtab").style.background='#4CAF50';
    document.getElementById("logtab").style.background='#24333B';
}

function create() {
            if(document.getElementById('reg').style.display=='none') {
                document.getElementById('reg').style.display='block';
                document.getElementById('log').style.display='none';
                document.getElementById("regtab").style.background='#4CAF50';
                document.getElementById("logtab").style.background='#24333B';
            }
            return false;
        }
function login() {
            if(document.getElementById('reg').style.display=='block') {
                document.getElementById('reg').style.display='none';
                document.getElementById('log').style.display='block';
                document.getElementById("logtab").style.background='#4CAF50';
                document.getElementById("regtab").style.background='#24333B';
        }
            return false;
}

$(function() {
  //Login
  $("#loginForm")
  .submit(function(event) {
    var mail = $('#loginForm:first-child')[0][0].value;
    var password = $('#loginForm:first-child')[0][1].value;
    $.post('/api/login', {
        'mail': mail, 'password': password
      }).done(function(res) {
        if (res === '200') {
          sessionStorage.setItem('status', 'loggedIn');
          sessionStorage.setItem('currUser', mail);
          console.log("Logged in");
          window.location = "/";
        }
        else{
          console.log("Could not log in");
        }
      });
    event.preventDefault();
  });


  //Register
  $("#registerForm")
  .submit(function(event) {
    var fname = $(event.currentTarget)[0][0].value;
    var lname = $(event.currentTarget)[0][1].value;
    var mail = $(event.currentTarget)[0][2].value;
    var password = $(event.currentTarget)[0][3].value;
    var passwordRepeat = $(event.currentTarget)[0][4].value;
    var isLecturer;


    //isLecturer = $('input[name="isLecturer"]:checked').length > 0;
    if ($('input[name="isLecturer"]:checked').length > 0){
      isLecturer = true;
    }
    else{
      isLecturer = false;
    }

    $.post('/api/create_user', {
      /*
        firstname and lastname are currently not stored to firebase
      */
        'isLecturer': isLecturer,
        'fname': fname,
        'lname': lname,
        'mail': mail,
        'password': password
      }).done(function(res) {
        if (res === '200') {
          sessionStorage.setItem('status', 'loggedIn');
          sessionStorage.setItem('currUser', mail);
          console.log("Logged in");
          window.location = '/';
        }
        else{
          console.log("Could not log in");
        }
      });
    return false;
  });

});
