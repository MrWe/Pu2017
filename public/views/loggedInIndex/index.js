var lectures = {};
var currentSelectedLecture = "";
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
  quill.setContents([
            { insert: 'function test(x){' },
            { insert: '\n\n'},
            { insert: '}'}
        ]);
        quill.formatLine(1,100, 'code-block', true);

  $('#username')
    .text(sessionStorage['currUser']);

  $("#logoutbtn")
    .click(function() {
      $.post('/api/logout')
        .done(function(res) {
          window.location = '/';
        });
    });



  $.post('/api/get_lectures', function(res) {
    for (var i in res) {
      console.log(i);
      $('#lectures')
        .append("<li class='lecture'><a  href='#'>" + i + "</a></li>")
      lectures = res;

    }
    currentSelectedLecture = i;
  });

  $('#lectures')
    .on('click', 'li.lecture', function(event) {
      event.preventDefault();
      currentSelectedLecture = lectures[event.target.text];
    });

  $('#submitbtn')
    .click(function() {
      var t = quill.getText();
      t = t.replace(/\n$/, "")
      $.post('/api/store_content', {
          scripts: t
        })
        .done(function(res) {
          console.log("Submitted")
        });
        
        var code = quill.getText();
        eval(code);
        
        var input = 4;
        var output = 5;
        
        var godkjent = test(input) == output;
        
        if (godkjent){
            document.getElementById("GodkjentAvslaatP").innerHTML = "Godkjent";
            document.getElementById("GodkjentAvslaatIMG").src= "../../img/godkjent.png"
            
        } else{
            document.getElementById("GodkjentAvslaatP").innerHTML = "Avslått";
            document.getElementById("GodkjentAvslaatIMG").src= "../../img/avslaatt.png"
        }
        
    })
    
    $('#oving').click(function(){
        quill.setContents([
            { insert: 'function test(x){' },
            { insert: '\n\n'},
            { insert: '}'}
        ]);
        quill.formatLine(1,100, 'code-block', true);
    })

});
