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
            { insert: 'function main(x){' },
            { insert: '\n\n'},
            { insert: '}'}
        ]);
        quill.formatLine(1,100, 'code-block', true);

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
        
        var code = quill.getText();
        eval(code);
        
        var input = 5;
        var output = 5;
        try{
            var godkjent = main(input) == output;
        }catch(err){
            console.log(err);
            document.getElementById("GodkjentAvslaatP").innerHTML = "Avslått";
            document.getElementById("GodkjentAvslaatIMG").src= "../../img/avslaatt.png"
        }
        
        if (godkjent){
            document.getElementById("GodkjentAvslaatP").innerHTML = "Godkjent";
            document.getElementById("GodkjentAvslaatIMG").src= "../../img/godkjent.png"
            
        } else{
            document.getElementById("GodkjentAvslaatP").innerHTML = "Avslått";
            document.getElementById("GodkjentAvslaatIMG").src= "../../img/avslaatt.png"
        }
        
    })
    
    $('#reset').click(function(){
        quill.setContents([
            { insert: 'function main(x){' },
            { insert: '\n\n'},
            { insert: '}'}
        ]);
        quill.formatLine(1,100, 'code-block', true);
    })

});
