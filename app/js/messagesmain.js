
console.log("in messagesmain.js");
const connectedUserList = document.querySelector('#connected-user-list');

// create element and render users
function renderConnectedUsers(doc){
	console.log('Rendering user...');
	
	let li = document.createElement('li');
	let email = document.createElement('span');
	let user_id = document.createElement('span');
	// let 'element' = document.createElement('span');
	
	li.setAttribute('data-id', doc.id);
	email.textContent = doc.data().email;
	user_id.textContent = doc.data().user_id;
	// 'element'.textContent = doc.data().'element';
	
	li.appendChild(email);
	li.appendChild(user_id);
	
	connectedUserList.appendChild(li);
	console.log('User listed.');
}

if (!firebase.apps.length) {
	var config = {
		apiKey: "AIzaSyCEuT1gco387t16C2IAmN2bx5bt-n6ea6s",
		authDomain: "focal-point-student-alumni-net.firebaseapp.com",
		databaseURL: "https://focal-point-student-alumni-net.firebaseio.com",
		projectId: "focal-point-student-alumni-net",
		storageBucket: "focal-point-student-alumni-net.appspot.com",
		messagingSenderId: "1002904582612"
	} 
			
	firebase.initializeApp(config);
	console.log("initializeApp");
}

// Fetch an instance of the DB
const firestore = firebase.firestore();
firestore.settings( {timestampsInSnapshots: true} );
var user = firebase.auth().currentUser;
var name, email, photoUrl, uid, emailVerified;

if (user != null) {
	name = user.displayName;
	email = user.email;
	photoUrl = user.photoURL;
	emailVerified = user.emailVerified;
	uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
			         // this value to authenticate with your backend server, if
			         // you have one. Use User.getToken() instead.
}
console.log('name: ', name);
console.log('uid: ', user.uid);

//	Pulls all docs from 'Users' collection in firebase
//	and lists them
firestore.collection('Users').get().then((snapshot) => {
	snapshot.docs.forEach(doc => {
		renderConnectedUsers(doc);
	})

});

