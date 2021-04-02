const db = firebase.firestore();
const table = document.querySelector('#tbresultdevice');
const form = document.querySelector('#addFormDevice');

db.collection('device').orderBy('location', 'asc').get().then((snapshot) => {
    snapshot.forEach(doc => {
        showResult(doc)
    });
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('device').add({
        name: form.Name.value,
        brand: form.Brand.value,
        model: form.Model.value,
        location: form.Location.value,
        ip: form.IPAddress.value,
        mac: form.MACAddress.value,
        type: form.Type.value,
        topic: form.Topic.value,
    });

});

function showResult(doc) {
    var row = table.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);
    var cell9 = row.insertCell(8);

    cell1.innerHTML = doc.data().name;
    cell2.innerHTML = doc.data().brand;
    cell3.innerHTML = doc.data().model;
    cell4.innerHTML = doc.data().location;
    cell5.innerHTML = doc.data().ip;
    cell6.innerHTML = doc.data().mac;
    cell7.innerHTML = doc.data().type;
    cell8.innerHTML = doc.data().topic;

    let btnDelete = document.createElement('button');
    btnDelete.textContent = 'Delete';
    btnDelete.setAttribute('class', 'btn btn-danger');
    btnDelete.setAttribute('onclick', "setTimeout(function () { window.location.reload(); }, 1000)");
    btnDelete.setAttribute('data-id', doc.id);
    cell9.appendChild(btnDelete);


    btnDelete.addEventListener('click', (e) => {
        // console.log(e.target.getAttribute('data-id'));
        let id = e.target.getAttribute('data-id');
        db.collection('device').doc(id).delete();
    });

}