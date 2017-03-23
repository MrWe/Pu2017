function init(id) {
    document.getElementById("pp").style.background='#4CAF50';
    if(id){
        document.getElementById(id).style.background='#24333B';
    }
    document.getElementById("submitbtn").style.visibility='hidden';
}

function powerpoint() {
            if(document.getElementById('powerpoint').style.display=='none') {
                document.getElementById('powerpoint').style.display='block';
                document.getElementById('editor-container').style.display='none';
                document.getElementById("pp").style.background='#4CAF50';
                document.getElementById("submitbtn").style.visibility='hidden';
            }
            return false;
}
function Exercise(id) {
            if(document.getElementById('powerpoint').style.display=='block') {
                document.getElementById('powerpoint').style.display='none';
                document.getElementById('editor-container').style.display='block';
                document.getElementById(id).style.background='#4CAF50';
                document.getElementById("pp").style.background='#24333B';
                document.getElementById("submitbtn").style.visibility='visible';
        }
            return false;
}

function pdf() {
    var url
    document.getElementById("contentarea").object.location.href = url;
}
