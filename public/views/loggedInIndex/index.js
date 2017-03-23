var lectures = {};
var currentSelectedLecture = "";
var currExercises = {};

var codeinput = 0;
var codeoutput = 0;

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
    {
      insert: 'function test(x){'
    },
    {
      insert: '\n\n'
    },
    {
      insert: '}'
    }
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
      /*
      $.post('/api/get_exercises',{lecture: currentSelectedLecture}, function(res){
        console.log(res);
      });
      */
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

      console.log(test(codeinput));

      var godkjent = test(codeinput) == codeoutput;

      if (godkjent) {
        document.getElementById("GodkjentAvslaatP")
          .innerHTML = "Godkjent";
        document.getElementById("GodkjentAvslaatIMG")
          .src = "../../img/godkjent.png"

      } else {
        document.getElementById("GodkjentAvslaatP")
          .innerHTML = "Avslått";
        document.getElementById("GodkjentAvslaatIMG")
          .src = "../../img/avslaatt.png"
      }

    })

  $('#oving')
    .click(function() {
      quill.setContents([
        {
          insert: 'function test(x){'
        },
        {
          insert: '\n\n'
        },
        {
          insert: '}'
        }
        ]);
      quill.formatLine(1, 100, 'code-block', true);
    })

});


$(document)
  .on('click', ".exercise", function() {
    var liId = $(this)
      .attr('id');

    $(".exercise")
      .each(function(index, t) {
        if (t.id != liId) {
          console.log("1", t.id);
          $(this)
            .removeAttr("style");
          $(this)
            .css('background-color', '#24333B');
        } else {
          console.log("2", t.id);
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
      codeinput = data.exercise_input * 1;
      codeoutput = data.exercise_output * 1;

      console.log(codeinput, codeoutput);
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
