var lectures = {};
var currentSelectedLecture = "";

var currExercises = {};

var codeinput_1 = 0;
var codeoutput_1 = 0;
var codeinput_2 = 0;
var codeoutput_2 = 0;
var codeinput_3 = 0;
var codeoutput_3 = 0;


$(function() {

  hljs.configure({ // optionally configure hljs
    languages: ['javascript']
  });

  hljs.initHighlightingOnLoad();


var quill = new Quill('#quillText', {

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
  quill.formatLine(1, 100, 'code-block', true);

  $('#username')
    .text(sessionStorage['currUser']);

  $("#logoutbtn")
    .click(function() {
      $.post('/api/logout')
        .done(function(res) {
          window.location = '/';
        });
    });


    $.post('/api/userIsLoggedIn', function(req, res){
           console.log(res);
       })

  $.post('/api/get_lectures', function(res) {
    for (var i in res) {

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

      update_lecture(currentSelectedLecture);


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

        document.getElementById("consoleText").innerHTML= "";

        var code = quill.getText();
        eval(code);

        try{
            console.log("input: " + codeinput_1 + "output: " + codeoutput_1)
            console.log("input: " + codeinput_2 + "output: " + codeoutput_2)
            console.log("input: " + codeinput_3 + "output: " + codeoutput_3)
            var godkjent_1 = main(codeinput_1) == codeoutput_1;
            var godkjent_2 = main(codeinput_2) == codeoutput_2;
            var godkjent_3 = main(codeinput_3) == codeoutput_3;
            console.log(godkjent_1);
            console.log(godkjent_2);
            console.log(godkjent_3);
        }catch(err){
            document.getElementById("consoleText").innerHTML= err;
            document.getElementById("GodkjentAvslaatP").innerHTML = "Avslått";
            document.getElementById("GodkjentAvslaatIMG").src= "../../img/avslaatt.png"
        }

        if (godkjent_1 && godkjent_2 && godkjent_3){
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
      quill.formatLine(1, 100, 'code-block', true);
      reset_index();
    })


});


function reset_index(){
document.getElementById("consoleText").innerHTML= "";
}


$(document)
  .on('click', ".exercise", function() {
    var liId = $(this)
      .attr('id');

    $(".exercise")
      .each(function(index, t) {
        if (t.id != liId) {
          $(this)
            .removeAttr("style");
          $(this)
            .css('background-color', '#24333B');
        } else {
          $(this)
            .removeAttr("style");
          $(this)
            .css('background-color', '#4CAF50');
        }
        //console.log(index, t.id);
      });

    if (liId !== 'pp') {
      var data = lectures[currentSelectedLecture.title][currExercises[liId]];
      $('#exercise_desc')
        .text(data.exercise_desc);
      codeinput = data.exercise_input_1 * 1;
      codeoutput = data.exercise_output_1 * 1;
      codeinput = data.exercise_input_2 * 1;
      codeoutput = data.exercise_output_2 * 1;
      codeinput = data.exercise_input_3 * 1;
      codeoutput = data.exercise_output_3 * 1;

      //console.log(codeinput, codeoutput);
      Exercise(liId);
    }
    else{

      powerpoint();
    }

  });




function update_lecture(lecture) {
  $('#tabsArray li:not(:first)')
    .remove();
  for (var l in lecture) {
    if (!(typeof lecture[l] === 'string')) {
      currExercises[lecture[l].exercise_title] = l;

      $("<li><button class='exercise' id=" + lecture[l].exercise_title + " >" + lecture[l].exercise_title + "</button></li>")
        .appendTo($('#tabsArray'));
    }
  }
}
