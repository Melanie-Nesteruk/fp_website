(function() {
    console.log("in messagesmain.js");
        
    const connectedUserList = document.querySelector('#connected-user-list');
    const connectedFriendsList = document.querySelector('#connected-friends-list');

	
    // =======================================================
    // create element and render users
    //
    /*
    function renderUsers(doc){
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
    */

    // =======================================================
    //	Create elements and render friends list
    //

    function openMessengerWith(value){
        var friend_id = value;
        console.log('Opening messenger with : ', friend_id);
		
		// USE THE USERNAME FOR NEW WINDOW TITLE
		// var newWindowTitle = 'Messenger - ' + value;
		
		// REDIRECT USER TO THE MESSENGER
		// var messengerURL = 'https://focalpointkent.pythonanywhere.com/messenger.html' + value;
		window.open('http://google.com', '_blank', 'height=500,width=400,top=100,left=100');
    }

	
	
    // =======================================================
    //	Create elements and render friends list
    //

    function renderFriendsList(doc){
        console.log('Rendering friend...');
		
		// GET THE USERNAMES INSTEAD OF THE ID FROM FIREBASE
		
        var but = document.createElement("button");
        but.setAttribute("value", doc.id);
        but.id = doc.id;
        but.innerHTML = doc.id;
        connectedFriendsList.appendChild(but);
        attachClickEvent(doc.id);
        console.log('Friend listed.');
    }

    function attachClickEvent(value){
        var friendButton = document.getElementById(value); // Button object for friend uid
		if (friendButton != null) {
			friendButton.addEventListener('click', 
			function(){
				openMessengerWith(value);
			}, false);
		}
    }

	
	
    // =======================================================
    // Check for initialized firebase connection
    //
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

    // =======================================================
    // Fetch an instance of the DB
    //
    const firestore = firebase.firestore();
    firestore.settings( {timestampsInSnapshots: true} );
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    // =======================================================
    // Check for user being logged in
    //

    firebase.auth().onAuthStateChanged(function(user) {
    if (user) { // if user is authorized
        console.log('User is signed in');
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                        // this value to authenticate with your backend server, if
                        // you have one. Use User.getToken() instead.
        
        // =======================================================
        //	Pulls all docs from 'Friends' collection in firebase
        //	and lists them. Friend's list will show each friend's
        //  display name or user name. 'Message' button next to
        //  each friend's name. 'Message' button click will bring
        //	up the conversation.
        //

        console.log('uid: ', uid);
        firestore.collection('Users').doc(uid).collection('Friends').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
				
				// DO A CHECK 'BLOCK' Function
				// if (!blocked)
					// renderFriendsList(doc);
				// else do nothing
				
                renderFriendsList(doc);
            })
        });
        
    } else { // If user is not authorized
        console.log('User is not authorized to access this webpage');
    }
	
    });
}());
