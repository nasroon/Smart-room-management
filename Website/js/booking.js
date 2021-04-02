const db = firebase.firestore();

db.collection('room').orderBy('name', 'asc').get().then((snapshot) => {
    snapshot.forEach(doc => {
        showData(doc)
    });
});


function showData(doc) {
    if (doc.data().name == 'R100') {

    } else {
        var iDiv = document.createElement('div');
        iDiv.className = 'radio';

        var iLabel = document.createElement('label');
        iLabel.setAttribute('for', doc.data().name);


        var iInput = document.createElement('input');
        iInput.type = 'radio';
        iInput.value = doc.data().name;
        iInput.id = doc.data().name;
        const newContent = document.createTextNode(doc.data().name);

        iLabel.appendChild(newContent);


        iDiv.appendChild(iInput);
        iDiv.appendChild(iLabel);
        document.getElementById('content').appendChild(iDiv);
    }


}