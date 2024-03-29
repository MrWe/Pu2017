var lectures = {};
var currentSelectedLecture = "";
var currentSelectedCourse = "";
var currentExerciseId = "";
var currExercises = {};

var codeinput_1 = 0;
var codeoutput_1 = 0;
var codeinput_2 = 0;
var codeoutput_2 = 0;
var codeinput_3 = 0;
var codeoutput_3 = 0;

var PDFLINK = 'https://storage.googleapis.com/aurora-80cde.appspot.com/';
var numPdfs = 0;
$(function() {

  hljs.configure({ // Configure hljs ti highlight javascript code
    languages: ['javascript']
  });

  hljs.initHighlightingOnLoad();

  //creates quill
  var quill = new Quill('#quillText', {

    modules: {
      syntax: true,
      toolbar: false
    },
    theme: 'bubble'
  });
  //Sets the initial code to include the function
  quill.setContents([

    {
      insert: 'function main(x){'
    }, {
      insert: '\n\n'
    }, {
      insert: '}'
    }
  ]);
  //sett the quill format to start with syntax highlitning
  quill.formatLine(1, 100, 'code-block', true);

  //Sets the username in the left menu bar
  $('#username').text(sessionStorage['currUser']);

  //logs the user out
  $("#logoutbtn").click(function() {
    $.post('/api/logout').done(function(res) {
      window.location = '/';
    });
  });

  //checks if user is lecturer
  $.post('/api/user_is_lecturer', function() {}).done(function(res) {
    if (res == 'true') {
      $('#controlpanellink').removeClass('hidden');
    }
  });

  /*
  Sends a request to get all courses and displays them when they are returned
   */
  $.post('/api/get_all_courses', function(res) {
    for (var i in res) {
      $('#dropdowns').append("<li class='dropdown'><a href='#' class='course' data-toggle='dropdown'>" + i + " <i class='icon-arrow'></i></a><ul id=" + i + " class='dropdown-menu'></ul></li>");

      currentSelectedCourse = i;
    }
  });

  // $('#TODO')
  //   .click(function() {
  //     $.post('/api/get_lectures', function(res) {
  //       for (var i in res) {
  //         console.log(res);
  //         $('#lectures')
  //           .append("<li class='lecture'><a  href='#'>" + i + "</a></li>")
  //
  //       }
  //       lectures = res;
  //       currentSelectedLecture = i;
  //     });
  //   })

  /*
  On click on one course this will hide all other lectures from other courses and request
  lectures from this course from the server and display them
   */
  $(document).on('click', '.course', function(event) {

    currentSelectedCourse = $(this)[0].innerText;
    currentSelectedLecture = "";

    $('.course').each(function() {
      console.log($(this).children());

      if ($(this).siblings().attr('id') != currentSelectedCourse) {

        $(this).siblings().removeClass('show');
        $(this).siblings().addClass('hide');

        $(this).children().removeClass('open');
        $(this).children().addClass('close');
      }

    });

    $.post('/api/get_lectures', {
      course: currentSelectedCourse
    }, function(res) {
      lectures = res;
      var id = '#' + currentSelectedCourse;
      $(id).html("");
      for (var i in res) {

        $(id).append("<li id='lecture' class='lecture'><a  href='#'>" + i + "</a></li>")
        currentSelectedLecture = i;
      }
    });
  });

  /*
  On click on a lecture, display stored pdf and run update_lecture()
   */
  $(document).on('click', '#lecture', function(event) {
    event.preventDefault();
    if (lectures) {
      currentSelectedLecture = lectures[event.target.text];

      $('#pdf').remove();
      $("<object id='pdf' data='https://storage.googleapis.com/aurora-80cde.appspot.com/" + currentSelectedCourse + '%3A' + currentSelectedLecture.title + ".pdf' type='application/pdf' width='100%' height='95%'></object>").appendTo($('#powerpoint'));

      update_lecture(currentSelectedLecture);
    }
  });

  /*
  Stores current script to user and test if script returns correct values. If script is correct set script approved.
   */
  $('#submitbtn').click(function() {
    var t = quill.getText();
    t = t.replace(/\n$/, "")

    $.post('/api/store_content', {
      userCode: t,
      exerciseId: currentExerciseId
    });
    $('#consoleText').html("");

    var code = quill.getText();
    eval(code);

    //checks the output with the excpected output
    try {
      var godkjent_1 = main(codeinput_1) == codeoutput_1;
      var godkjent_2 = main(codeinput_2) == codeoutput_2;
      var godkjent_3 = main(codeinput_3) == codeoutput_3;
    } catch (err) {
      $('#consoleText').html(err);
      $('#GodkjentAvslaatP').html('Avslått');
      $("#GodkjentAvslaatIMG").attr("src", "../../img/avslaatt.png");
    }
    // if true, sett the excercise as approved
    if (godkjent_1 && godkjent_2 && godkjent_3) {
      $('#GodkjentAvslaatP').html("Godkjent");
      $("#GodkjentAvslaatIMG").attr("src", "../../img/godkjent.png");
      //sets the excercise as declined
    } else {
      $('#GodkjentAvslaatP').html("Avslått");
      $("#GodkjentAvslaatIMG").attr("src", "../../img/avslaatt.png");
    }
  });

  //resets the content of the text editor
  function reset() {
    quill.setContents([
      {
        insert: 'function main(x){'
      }, {
        insert: '\n\n'
      }, {
        insert: '}'
      }
    ]);
    quill.formatLine(1, 100, 'code-block', true);
    reset_index();
  }

  $('#reset').click(reset())

  //resets the console output
  function reset_index() {
    $('#consoleText').html("");
  }

  $(document).on('click', ".exercise", function() {
    var liId = $(this).attr('id');
    currentExerciseId = currExercises[liId];

    $(".exercise").each(function(index, t) {
      if (t.id != liId) {
        $(this).removeAttr("style");
        $(this).css('background-color', '#24333B');
      } else {
        $(this).removeAttr("style");
        $(this).css('background-color', '#4CAF50');
      }
      //console.log(index, t.id);
    });

    if (liId !== 'pp') {
      $.post('/api/get_content', {
        exerciseId: currentExerciseId
      }, function() {}).done(function(res) {
        $('#consoleText').html("");
        $('#GodkjentAvslaatP').html('Ikke levert');
        $("#GodkjentAvslaatIMG").attr("src", "../../img/ikke_levert.png");
        if (!res) {
          reset();
        } else {
          quill.setContents([
            {
              insert: res.userCode
            }

          ]);
          quill.formatLine(1, 100, 'code-block', true);
          reset_index();
          setTimeout(function() {
            $('#submitbtn').trigger("click");
          }, 10);
        }

        var data = lectures[currentSelectedLecture.title][currExercises[liId]];

        $('#exercise_desc').text(data.exercise_desc);

        //checks if input is an int
        var isInt = /^\d+$/.test(data.exercise_input_1);

        //checks if input is an array
        var isArray = data.exercise_input_1.charAt(0) == "[" && data.exercise_input_1.slice(-1) == "]";
        if (isInt) {
          //turns the String into an int
          codeinput_1 = data.exercise_input_1 * 1;
          codeoutput_1 = data.exercise_output_1 * 1;
          codeinput_2 = data.exercise_input_2 * 1;
          codeoutput_2 = data.exercise_output_2 * 1;
          codeinput_3 = data.exercise_input_3 * 1;
          codeoutput_3 = data.exercise_output_3 * 1;
        } else if (isArray) {
          //turns the string into an array
          var list = [
            data.exercise_input_1,
            data.exercise_output_1,
            data.exercise_input_2,
            data.exercise_output_2,
            data.exercise_input_3,
            data.exercise_output_3
          ]
          for (i = 0; i < list.length; i++) {
            list[i] = list[i].replace("[", "");
            list[i] = list[i].replace("]", "");
            list[i] = list[i].replace(/'/g, "")
            list[i] = list[i].replace(/ /g, "")
          }
          codeinput_1 = list[0].split(",");
          console.log("etter spllit:" + codeinput_1);
          codeoutput_1 = list[1].split(",");
          codeinput_2 = list[2].split(",");
          codeoutput_2 = list[3].split(",");
          codeinput_3 = list[4].split(",");
          codeoutput_3 = list[5].split(",");

        } else {
          //data from server allready String, so no need to convert
          codeinput_1 = data.exercise_input_1;
          codeoutput_1 = data.exercise_output_1;
          codeinput_2 = data.exercise_input_2;
          codeoutput_2 = data.exercise_output_2;
          codeinput_3 = data.exercise_input_3;
          codeoutput_3 = data.exercise_output_3;

        }

        console.log("input: " + codeinput_1 + "output: " + codeoutput_1)
        console.log("input: " + codeinput_2 + "output: " + codeoutput_2)
        console.log("input: " + codeinput_3 + "output: " + codeoutput_3)
        Exercise(liId);
      });
    } else {

      powerpoint();
    }

  });

  /*
  Adds exercise tabs for lecture
   */
  function update_lecture(lecture) {
    $('#tabsArray li:not(:first)').remove();
    for (var l in lecture) {

      if (!(typeof lecture[l] === 'string') && lecture[l].exercise_title != undefined) {
        currExercises[lecture[l].exercise_title] = l;

        $("<li><button class='exercise' id=" + lecture[l].exercise_title + " >" + lecture[l].exercise_title + "</button></li>").appendTo($('#tabsArray'));
      }
    }
  }

});
