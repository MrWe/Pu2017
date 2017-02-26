$(function() {

  $('header')
    .load('../partials/header.html');
  $("#log")
    .submit(function(event) {
      var vals = $('#log')
        .serializeArray();
      $.post('/api/login', {
          vals
        }, function(res) {
          if (res === "") {
            sessionStorage.setItem('status', 'loggedIn');
            sessionStorage.setItem('currUser', res);
            console.log("Logged in");
          }
          else{
            console.log("Could not log in");
          }
        })
      event.preventDefault();
    });
});
