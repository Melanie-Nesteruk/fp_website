// Initialize Firebase
var config = {
	apiKey: "AIzaSyCEuT1gco387t16C2IAmN2bx5bt-n6ea6s",
	authDomain: "focal-point-student-alumni-net.firebaseapp.com",
	databaseURL: "https://focal-point-student-alumni-net.firebaseio.com",
	projectId: "focal-point-student-alumni-net",
	storageBucket: "focal-point-student-alumni-net.appspot.com",
	messagingSenderId: "1002904582612"
};
firebase.initializeApp(config);

// Fetch an instance of the DB
var database = firebase.database();
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

var userRef = db.collection('Users').doc(user);
var getDoc = userRef.get()
	.then(doc => {
		if (!doc.exists) {
			console.log('No such document!');
		} else {
			console.log('Document data:', doc.data());
		}
	})
	.catch(err => {
		console.log('Error getting document', err);
	});
	
document.getElementById("connectedUser").innerHTML = "Paragraph changed.";




