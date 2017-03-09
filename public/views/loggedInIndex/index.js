$(function() {

  hljs.configure({ // optionally configure hljs
    languages: ['javascript']
  });

  hljs.initHighlightingOnLoad();

  var quill = new Quill('#editor-container', {
    modules: {
      syntax: true,
      toolbar: [['code-block']]
    },
    theme: 'bubble'
  });
  quill.format('code-block', true);

  $('#username').text(sessionStorage['currUser']);

  $("#logoutbtn")
    .click(function() {
      $.post('/api/logout')
        .done(function(res) {
          window.location = '/';
        });
    });


    $('#submitbtn').click(function(){
      var t = quill.getText();
      t = t.replace(/\n$/, "")
      $.post('/api/store_content', {scripts: t})
        .done(function(res) {
          console.log("Submitted")
        });
    })

});
