const db = firebase.firestore();

db.collection('room').orderBy('name', 'asc').get().then((snapshot) => {
    snapshot.forEach(doc => {
        showData(doc)
    });
});


function showData(doc) {
    var iDiv = document.createElement('li');
    iDiv.id = 'block';
    iDiv.className = 'block';


    var innerDiv = document.createElement('a');
    innerDiv.setAttribute('data-toggle', 'tab');
    innerDiv.setAttribute('href', doc.data().link);
    innerDiv.setAttribute('target', 'iframe_a');

    const newContent = document.createTextNode(doc.data().name);

    innerDiv.appendChild(newContent);
    iDiv.appendChild(innerDiv);
    document.getElementById('content').appendChild(iDiv);

}