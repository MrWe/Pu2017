$(function() {

  $('header').load('../partials/header.html');
  $("#log")
    .submit(function(event) {
      var vals = $('#log').serializeArray();

      $.post('/api/login', {vals}, function(res){
        console.log(res);
      });
      event.preventDefault();
    });
});
