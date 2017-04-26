function init(id) {
  //sets the initial state as powerpoint tab selected
  document.getElementById("pp").style.background = '#4CAF50';
  $('#exercise_desc').text("Her kommer beskrivelsen til øvingene.");
  if (id) {
    document.getElementById(id).style.background = '#24333B';
  }
  document.getElementById("submitbtn").style.visibility = 'hidden';
  //document.getElementById("reset").style.visibility='hidden';
  document.getElementById("GodkjentAvslaat").style.visibility = 'hidden';
}

function powerpoint() {
  //Switches to the powerpoint tab
  if (document.getElementById('powerpoint').style.display == 'none') {
    $('#exercise_desc').text("Her kommer beskrivelsen til øvingene.");
    document.getElementById("reset").style.visibility = 'hidden';
    document.getElementById("GodkjentAvslaat").style.visibility = 'hidden';
    document.getElementById('powerpoint').style.display = 'block';
    document.getElementById('editor-container').style.display = 'none';
    document.getElementById("pp").style.background = '#4CAF50';
    document.getElementById("submitbtn").style.visibility = 'hidden';
  }
  return false;
}

function Exercise(id) {
  //Switches to the text editor
  if (document.getElementById('powerpoint').style.display == 'block') {
    document.getElementById("reset").style.visibility = 'visible';
    document.getElementById("GodkjentAvslaat").style.visibility = 'visible';
    document.getElementById('powerpoint').style.display = 'none';
    document.getElementById('editor-container').style.display = 'block';
    document.getElementById(id).style.background = '#4CAF50';
    document.getElementById("pp").style.background = '#24333B';
    document.getElementById("submitbtn").style.visibility = 'visible';

  }
  return false;
}

function pdf() {
  var url
  document.getElementById("contentarea").object.location.href = url;
}
