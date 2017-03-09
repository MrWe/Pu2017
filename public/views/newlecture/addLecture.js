$(function() {

  $('#username').text(sessionStorage['currUser']);


  $("#logoutbtn")
    .click(function() {
      $.post('/api/logout')
        .done(function(res) {
          window.location = '/';
        });
    });
});
