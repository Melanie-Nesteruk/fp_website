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

var userRef = database.collection('Users').doc(user);
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




