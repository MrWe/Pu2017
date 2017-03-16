$(function() {

  $('#username')
    .text(sessionStorage['currUser']);

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
      if($('#powerpointFile')[0]){
        var powerpointFile = $('#powerpointFile')[0].value;
      }

      console.log("Heisann");
      $.post('/api/add_lecture', {
          title: title
        })
        .done(function(req, res) {
          console.log(res);
        })

    });


  $('#addExercise')
    .click(function(event) {

      var exercise_title = $('#exercise_title')[0].value;
      var exercise_desc = $('#descriptions')[0].value;
      var exercise_input = $('#input')[0].value;
      var exercise_output = $('#output')[0].value;
      /*
            $.post('/api/add_exercise', {
                title: exercise_title,
                description: exercise_desc,
                input: exercise_input,
                output: exercise_output
              })
              .done(function(res) {
                console.log("Submitted")
              });
              */
    })
});
