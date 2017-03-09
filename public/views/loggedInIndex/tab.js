function init() {
    document.getElementById("pp").style.background='#4CAF50';
    document.getElementById("ex1").style.background='#24333B';
    document.getElementById("submitbtn").style.visibility='hidden';
}

function powerpoint() {
            if(document.getElementById('powerpoint').style.display=='none') {
                document.getElementById('powerpoint').style.display='block';
                document.getElementById('editor-container').style.display='none';
                document.getElementById("pp").style.background='#4CAF50';
                document.getElementById("ex1").style.background='#24333B';
                document.getElementById("submitbtn").style.visibility='hidden';
            }
            return false;
}
function Exercise() {
            if(document.getElementById('powerpoint').style.display=='block') {
                document.getElementById('powerpoint').style.display='none';
                document.getElementById('editor-container').style.display='block';
                document.getElementById("ex1").style.background='#4CAF50';
                document.getElementById("pp").style.background='#24333B';
                document.getElementById("submitbtn").style.visibility='visible';
        }
            return false;
}
