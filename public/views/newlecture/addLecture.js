$(function() {

  var currentSelectedLecture = "";
  var currentSelectedCourse = "";

  $.post('/api/user_is_lecturer', function() {

  }).done(function(res){
    if(res == 'false'){
      $("input, text").attr("disabled", true);
      window.location.replace("/");
    }
  });

  $('#username')
    .text(sessionStorage['currUser']);

  var lectureArray = [];

  $.post('/api/get_courses', function(res) {
    for (var i in res) {
      $('#courses')
        .append("<li class='course'><a  href='#'>" + i + "</a></li>")
      lectureArray.push(i);
      currentSelectedCourse = i;
    }
    $('.currentCourse')
      .text(currentSelectedCourse);

  })

  $('#courses')
    .on('click', 'li.course', function(event) {
      event.preventDefault();
      currentSelectedCourse = $(this)[0].innerText;
      $.post('/api/get_lectures', {
        course: currentSelectedCourse
      }, function(res) {
        console.log(res);
        $('#lectures')
          .html("");
        for (var i in res) {
          $('#lectures')
            .append("<li class='lecture'><a  href='#'>" + i + "</a></li>")
          lectureArray.push(i);
          currentSelectedLecture = i;
        }
      });
    });

  $('#lectures')
    .on('click', 'li.lecture', function(event) {
      event.preventDefault();
      currentSelectedLecture = $(this)[0].innerText;
      $('.currentLecture')
        .text(currentSelectedLecture);
    });


  $("#logoutbtn")
    .click(function() {
      $.post('/api/logout')
        .done(function(res) {
          window.location = '/';
        });
    });

  $('#addCourse')
    .click(function(event) {
      event.preventDefault();
      var courseTitle = $('#course_title')[0].value;

      $.post('/api/add_course', {
        course: courseTitle
      }, function(res) {

      });
      location.reload();
    })


  $('#addLecture')
    .click(function(event) {
      var title = $('#lecture_title')[0].value;
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
      console.log(title);
      if (title !== '') {
        $.post('/api/add_lecture', {
            title: title,
            course: currentSelectedCourse
          })
          .done(function(req, res) {
            console.log(res);
          });
      }


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
    if ($('#input_1')[0].value.charAt(0) == "["){
        var list = [$('#input_1')[0].value, $('#input_2')[0].value, $('#input_3')[0].value]
        for (i = 0; i < list.length; i++){
            list[i] = list[i].replace("[", "");
            list[i] = list[i].replace("]", "");
            list[i] = list[i].replace(/'/g, "")
            list[i] = list[i].replace(/ /g, "")
        }
        var exercise_input_1 = list[0].split(",");
        var exercise_input_2 = list[1].split(",");
        var exercise_input_3 = list[2].split(",");

    } else{
        var exercise_input_1 = $('#input_1')[0].value;
        var exercise_input_2 = $('#input_2')[0].value;
        var exercise_input_3 = $('#input_3')[0].value;
    }
    if ($('#output_1')[0].value.charAt(0) == "["){
        var list = [$('#output_1')[0].value, $('#output_2')[0].value, $('#output_3')[0].value]
        for (i = 0; i < list.length; i++){
            list[i] = list[i].replace("[", "");
            list[i] = list[i].replace("]", "");
            list[i] = list[i].replace(/'/g, "")
            list[i] = list[i].replace(/ /g, "")
        }
        var exercise_output_1 = list[0];
        var exercise_output_2 = list[1];
        var exercise_output_3 = list[2];
    }else{
        var exercise_output_1 = $('#output_1')[0].value;
        var exercise_output_2 = $('#output_2')[0].value;
        var exercise_output_3 = $('#output_3')[0].value;
    }

    $.post('/api/add_exercise', {
        lecture_title: lecture_title,
        course: currentSelectedCourse,
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
    location.reload();
  }


});
