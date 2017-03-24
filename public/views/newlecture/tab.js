function init() {
    document.getElementById("fag").style.background='#4CAF50';
    document.getElementById("forelesning").style.background='#24333B';
    document.getElementById("øving").style.background='#24333B';

}

function fag() {
            if(document.getElementById('fagside').style.display=='none') {

                document.getElementById('fagside').style.display='block';
                document.getElementById('forelesningside').style.display='none';
                document.getElementById('øvingsside').style.display='none';

                document.getElementById("fag").style.background='#4CAF50';
                document.getElementById("forelesning").style.background='#24333B';
                document.getElementById("øving").style.background='#24333B';
                //document.getElementById("menuTitle").innerHTML = "Dine fag"
            }
            return false;
}
function forelesning() {
            if(document.getElementById('forelesningside').style.display=='none') {

                document.getElementById('fagside').style.display='none';
                document.getElementById('forelesningside').style.display='block';
                document.getElementById('øvingsside').style.display='none';

                document.getElementById("fag").style.background='#24333B';
                document.getElementById("forelesning").style.background='#4CAF50';
                document.getElementById("øving").style.background='#24333B';
                //document.getElementById("menuTitle").innerHTML="Dine forelesninger"

        }
            return false;
}

function oving() {
            if(document.getElementById('øvingsside').style.display=='none') {

                document.getElementById('fagside').style.display='none';
                document.getElementById('forelesningside').style.display='none';
                document.getElementById('øvingsside').style.display='block';

                document.getElementById("fag").style.background='#24333B';
                document.getElementById("forelesning").style.background='#24333B';
                document.getElementById("øving").style.background='#4CAF50';
                //document.getElementById("menuTitle").innerHTML="Dine øvinger"

        }
            return false;
}
