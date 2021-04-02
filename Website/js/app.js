const db = firebase.firestore();
const table = document.querySelector('#tbresult');

db.collection('room').orderBy('name', 'asc').get().then((snapshot) => {
    snapshot.forEach(doc => {
        showResult(doc);
        createModal(doc);
        modalPop(doc);
    });
});


function showResult(doc) {
    var row = table.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    cell1.innerHTML = doc.data().name;
    cell2.innerHTML = doc.data().link;
    cell3.innerHTML = doc.data().ip;

    let btnDelete = document.createElement('button');
    btnDelete.textContent = 'Delete';
    btnDelete.setAttribute('class', 'btn btn-danger');
    btnDelete.setAttribute('onclick', "setTimeout(function () { window.location.reload(); }, 1000)");
    btnDelete.setAttribute('data-id', doc.id);
    cell4.appendChild(btnDelete);

    let btnEdit = document.createElement('button');
    btnEdit.textContent = 'Edit';
    btnEdit.setAttribute('class', 'btn btn-edit');
    btnEdit.setAttribute('data-id', doc.id);
    btnEdit.id = 'btn' + doc.data().name;
    cell4.appendChild(btnEdit);

    btnDelete.addEventListener('click', (e) => {
        // console.log(e.target.getAttribute('data-id'));
        let id = e.target.getAttribute('data-id');
        db.collection('room').doc(id).delete();
    });

}

function createModal(doc) {
    var iDiv = document.createElement('div');
    iDiv.id = 'myModal' + doc.data().name;
    iDiv.className = 'modal';
    var innerDiv = document.createElement('div');
    innerDiv.className = 'modal-content';
    innerDiv.id = 'add' + doc.data().name;

    var iSpan = document.createElement('span');
    iSpan.className = 'close' + doc.data().name;
    innerDiv.appendChild(iSpan);

    var iA = document.createElement('h1');
    const newContent3 = document.createTextNode('Edit');
    iA.appendChild(newContent3);
    innerDiv.appendChild(iA);

    var iform = document.createElement('form');
    iform.id = 'editform' + doc.data().name;

    var d1 = document.createElement('div')
    d1.className = "form-group";
    var l1 = document.createElement('label')
    l1.appendChild(document.createTextNode('Room name :'));
    d1.appendChild(l1);
    var i1 = document.createElement('input')
    i1.type = 'text';
    i1.name = "Roomname" + doc.data().name;
    i1.id = "Roomname" + doc.data().name;
    i1.value = doc.data().name;
    i1.required;
    d1.appendChild(i1);

    var d2 = document.createElement('div')
    d2.className = "form-group";
    var l2 = document.createElement('label')
    l2.appendChild(document.createTextNode('Room link(Google Calendar) :'));
    d2.appendChild(l2);
    var i2 = document.createElement('input')
    i2.type = 'text';
    i2.name = "Roomlink" + doc.data().name;
    i2.id = "Roomlink" + doc.data().name;
    i2.value = doc.data().link;
    i2.required;
    d2.appendChild(i2);

    var d3 = document.createElement('div')
    d3.className = "form-group";
    var l3 = document.createElement('label')
    l3.appendChild(document.createTextNode('Raspberry PI (IP address) :'));
    d3.appendChild(l3);
    var i3 = document.createElement('input')
    i3.type = 'text';
    i3.name = "PIIP" + doc.data().name;
    i3.id = "PIIP" + doc.data().name;
    i3.value = doc.data().ip;
    i3.required;
    d3.appendChild(i3);

    var d4 = document.createElement('div')
    d4.className = "form-group";
    var b = document.createElement('button');
    b.className = 'btn btn-primary';
    b.type = 'submit';
    b.setAttribute('onclick', "setTimeout(function () { window.location.reload(); }, 1000)");
    b.appendChild(document.createTextNode('Edit'));
    d4.appendChild(b);

    iform.appendChild(d1);
    iform.appendChild(d2);
    iform.appendChild(d3);
    iform.appendChild(d4);
    innerDiv.appendChild(iform);
    iDiv.appendChild(innerDiv);
    document.getElementById('tbresult').appendChild(iDiv);


    const form = document.querySelector('#editform' + doc.data().name);


    form.addEventListener('submit', (e) => {
        var nameValue = document.getElementById("Roomname" + doc.data().name).value;
        var linkValue = document.getElementById("Roomlink" + doc.data().name).value;
        var ipValue = document.getElementById("PIIP" + doc.data().name).value;
        e.preventDefault();
        db.collection('room').doc(doc.id).update({
            name: nameValue,
            link: linkValue,
            ip: ipValue
        });
    });


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