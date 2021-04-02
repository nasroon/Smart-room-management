var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    modal.style.display = "block";
}
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



function createModal(doc, docIn) {
    var iDiv = document.createElement('div');
    iDiv.id = 'myModal' + doc.data().name;
    iDiv.className = 'modal';
    var innerDiv = document.createElement('div');
    innerDiv.className = 'modal-content';
    innerDiv.id = 'add' + doc.data().name;

    var iSpan = document.createElement('span');
    iSpan.className = 'close' + doc.data().name;


    var iA = document.createElement('h1');
    const newContent3 = document.createTextNode(doc.data().name);
    iA.appendChild(newContent3);


    if (document.getElementById('myModal' + doc.data().name)) {
        var iButton = document.createElement('button');
        iButton.className = 'ToggleButton';
        iButton.appendChild(document.createTextNode('Toggle'));
        iButton.type = 'submit';
        iButton.name = 'smessage';
        iButton.action = ' ';
        iButton.disabled;

        var iDevStatus = document.createElement('div');
        iDevStatus.className = 'formWidth';
        var iDevice = document.createElement('a');
        iDevice.appendChild(document.createTextNode(docIn.data().name + ' : '));
        iDevStatus.appendChild(iDevice);
        var iAStatus = document.createElement('a')
        iAStatus.id = "out_messages";
        iDevStatus.appendChild(iAStatus);
        iDevStatus.appendChild(iButton);
        document.getElementById('add' + doc.data().name).appendChild(iDevStatus);
    } else {
        /////////////////////
        console.log(docIn.data().name)
        var iStatus = document.createElement('div');
        iStatus.id = 'status';
        const newContent2 = document.createTextNode('Connection Status: Not Connected');
        iStatus.appendChild(newContent2);
        ////////////////////
        var iConnect = document.createElement('form');
        iConnect.name = 'connform';
        iConnect.action = ' ';
        iConnect.setAttribute('onsubmit', "return MQTTconnect()");

        var iInputCon = document.createElement('input');
        iInputCon.name = 'conn';
        iInputCon.type = 'submit';
        iInputCon.value = 'Connect';
        iConnect.appendChild(iInputCon);
        ///////////////////
        var iButton = document.createElement('button');
        iButton.className = 'ToggleButton';
        iButton.appendChild(document.createTextNode('Toggle'));
        iButton.type = 'submit';
        iButton.name = 'smessage';
        iButton.id = 'smessage';
        iButton.action = ' ';
        if (document.getElementById('smessage')) {

        } else
            iButton.setAttribute('onclick', "return send_message(Status)");
        ///////////////////////////
        var iDevStatus = document.createElement('div');
        iDevStatus.className = 'formWidth';
        var iDevice = document.createElement('a');
        iDevice.appendChild(document.createTextNode(docIn.data().name + ' : '));
        iDevStatus.appendChild(iDevice);
        //////////////////////////
        var iAStatus = document.createElement('a')
        iAStatus.id = "out_messages";
        /////////////////////
        iDevStatus.appendChild(iAStatus);
        iDevStatus.appendChild(iButton);
        innerDiv.appendChild(iSpan);
        innerDiv.appendChild(iStatus);
        innerDiv.appendChild(iA);
        innerDiv.appendChild(iConnect);
        innerDiv.appendChild(iDevStatus);
        iDiv.appendChild(innerDiv);
        document.getElementById('tbresult').appendChild(iDiv);
    }

}

function modalPop(doc) {
    var modal = document.getElementById('myModal' + doc.data().name);
    var btn = document.getElementById('btn' + doc.data().name);
    var span = document.getElementsByClassName('close' + doc.data().name)[0];

    btn.onclick = function() {
        modal.style.display = "block";
    }
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}