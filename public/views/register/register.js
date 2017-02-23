$(function() {

  $('header').load('../partials/header.html');

  $("#reg")
    .submit(function(event) {
      var vals = $('#reg').serializeArray();

      $.post('/api/create_user', {vals}, function(res){
        console.log(res);
      });
      event.preventDefault();
    });
});
