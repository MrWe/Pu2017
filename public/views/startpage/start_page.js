function init() {
    document.getElementById("regtab").style.background='#4CAF50';
    document.getElementById("logtab").style.background='#24333B';
}

function create() { 
            if(document.getElementById('reg').style.display=='none') { 
                document.getElementById('reg').style.display='block';
                document.getElementById('log').style.display='none';
                document.getElementById("regtab").style.background='#4CAF50';
                document.getElementById("logtab").style.background='#24333B';
            }
            return false;
        } 
function login() { 
            if(document.getElementById('reg').style.display=='block') { 
                document.getElementById('reg').style.display='none'; 
                document.getElementById('log').style.display='block';
                document.getElementById("logtab").style.background='#4CAF50';
                document.getElementById("regtab").style.background='#24333B';
        } 
            return false;
}