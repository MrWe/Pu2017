$(function() {

  var currentSelectedLecture = "";


  $('#username')
    .text(sessionStorage['currUser']);

  var lectureArray = [];

  $.post('/api/get_lectures', function(res) {
    for (var i in res) {
      $('#lectures')
        .append("<li class='lecture'><a  href='#'>" + i + "</a></li>")
      lectureArray.push(i);
      currentSelectedLecture = i;
    }
    $('.currentCourse').text(currentSelectedLecture);
  });

  $('#lectures')
    .on('click', 'li.lecture', function(event) {
      event.preventDefault();
      currentSelectedLecture = $(this)[0].innerText;
      console.log(currentSelectedLecture);
      $('.currentCourse').text(currentSelectedLecture);
    });


  $("#logoutbtn")
    .click(function() {
      $.post('/api/logout')
        .done(function(res) {
          window.location = '/';
        });
    });


  $('#addLecture')
    .click(function(event) {
      //var title = $('#course_title')[0].value;
      if ($('#powerpointFile')[0]) {
        var powerpointFile = $('#powerpointFile');
        
      }
      console.log(powerpointFile);
      
      
      /*

      $.post('/api/add_lecture', {
          title: title
        })
        .done(function(req, res) {
          console.log(res);
        });*/
      $.post('/api/upload_PDF', {
          PDF: $('#powerpointFile')
          //PDFPath: PDFPath
      })
      .done(function(req, res){
            console.log(res);
            })
        //location.reload();

    });


  $('#addExercise')
    .click(function(event) {
      addExercise();
    });

  function addExercise() {
    var lecture_title = currentSelectedLecture;
    console.log("Lecture", currentSelectedLecture);
    var exercise_title = $('#exercise_title')[0].value;
    var exercise_desc = $('#descriptions')[0].value;
    var exercise_input = $('#input')[0].value;
    var exercise_output = $('#output')[0].value;

    $.post('/api/add_exercise', {
        lecture_title: lecture_title,
        exercise_title: exercise_title,
        exercise_desc: exercise_desc,
        exercise_input: exercise_input,
        exercise_output: exercise_output
      })
      .done(function(res) {
        console.log("Submitted")
      });
      //location.reload();
  }


});
