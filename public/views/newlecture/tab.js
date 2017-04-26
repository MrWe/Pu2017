function init() {
    //initialize the tabs with fag as first selected
    document.getElementById("fag").style.background='#4CAF50';
    document.getElementById("forelesning").style.background='#24333B';
    document.getElementById("øving").style.background='#24333B';

}

function fag() {
            //switches to fagside site
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
            //switches to forelesnings site
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
            //switches to øving site
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
