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
    $('.currentCourse')
      .text(currentSelectedLecture);
  });

  $('#lectures')
    .on('click', 'li.lecture', function(event) {
      event.preventDefault();
      currentSelectedLecture = $(this)[0].innerText;
      console.log(currentSelectedLecture);
      $('.currentCourse')
        .text(currentSelectedLecture);
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
      var title = $('#course_title')[0].value;
      event.preventDefault();

      var powerpoint = new FormData();
      if ($('#powerpointFile')[0].files[0]) {
        var nameWithCourse = $('#powerpointFile')[0].files[0].name.split('.');
        nameWithCourse[0] += '--' + currentSelectedLecture + '.';
        nameWithCourse = nameWithCourse.join('');
        powerpoint.append('file', $('#powerpointFile')[0].files[0], nameWithCourse);

        $.ajax({
          url: '/api/upload_PDF',
          data: powerpoint,
          cache: false,
          contentType: false,
          processData: false,
          type: 'POST',
          success: function(data) {

          },
          error: function(error) {
            console.log(error)
          }
        });
      }

      if (title !== '') {
        $.post('/api/add_lecture', {
            title: title
          })
          .done(function(req, res) {
            console.log(res);
          });
      }
      // $.post('/api/upload_PDF', {
      //     file:$('#powerpointFile')[0].files[0].serialize()
      //       //PDFPath: PDFPath
      //   })
      //   .done(function(req, res) {
      //     console.log(res);
      //   })

    
      location.reload();


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
    var exercise_input_1 = $('#input_1')[0].value;
    var exercise_output_1 = $('#output_1')[0].value;
    var exercise_input_2 = $('#input_2')[0].value;
    var exercise_output_2 = $('#output_2')[0].value;
    var exercise_input_3 = $('#input_3')[0].value;
    var exercise_output_3 = $('#output_3')[0].value;

    $.post('/api/add_exercise', {
        lecture_title: lecture_title,
        exercise_title: exercise_title,
        exercise_desc: exercise_desc,
        exercise_input_1: exercise_input_1,
        exercise_output_1: exercise_output_1,
        exercise_input_2: exercise_input_2,
        exercise_output_2: exercise_output_2,
        exercise_input_3: exercise_input_3,
        exercise_output_3: exercise_output_3
      })
      .done(function(res) {
        console.log("Submitted")
      });
    //location.reload();
  }


});
