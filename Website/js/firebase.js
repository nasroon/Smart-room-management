const db = firebase.firestore();
const form = document.querySelector('#addForm');
const table = document.querySelector('#tbresult');

db.collection('room').orderBy('name', 'asc').get().then((snapshot) => {
    snapshot.forEach(doc => {
        showData(doc);
        db.collection('device').get().then((snapshot) => {
            snapshot.forEach(docIn => {
                if (doc.data().name == docIn.data().location) {
                    console.log(docIn.data(), doc.data());
                    createModal(doc, docIn);
                    modalPop(doc);
                }

            })
        })

    });
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('room').add({
        name: form.Roomname.value,
        link: form.Roomlink.value,
        ip: form.PIIP.value
    });
    form.Roomname.value = '';
    form.Roomlink.value = '';
    form.PIIP.value = '';
});

function showData(doc) {
    var iDiv = document.createElement('div');
    iDiv.id = 'column';
    iDiv.className = 'column';

    var innerDiv = document.createElement('div');
    innerDiv.className = 'card';

    var iA = document.createElement('a');
    iA.href = '#';
    iA.id = 'btn' + doc.data().name;
    iA.className = 'btn btn-fix';

    var iH3 = document.createElement('h3');
    iH3.className = 'card-block';
    const newContent = document.createTextNode(doc.data().name);

    iH3.appendChild(newContent);
    iA.appendChild(iH3);
    innerDiv.appendChild(iA);
    iDiv.appendChild(innerDiv);


    document.getElementById('tbresult').appendChild(iDiv);
    //document.getElementsByTagName('body')[0].appendChild(iDiv);

}