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
    //	Check if users are on blocked list
    //

	// function isUserBlocked(currentID, friendID){ }
	
	
	function getSessionID(id_1, id_2) {
		var sesID = '';
		var query1 = firestore.collection("Chat-Groups").where("user_1", "==", id_1).where("user_2", "==", id_2);
		query1.get().then(function(results) {
			if (results.empty) {
				console.log("No documents found query1!");
			} else {
                var doc = results.docs[0];
                sesID = String(doc.id);
				console.log('1st. SESSION ID: ', sessionID);
			}
        })
        .catch(function(error){
            console.log("Error getting document ID: ", error);
        });
		return sesID;
	}
	
	

    // =======================================================
    //	Create elements and render friends list
    //

    function openMessengerWith(value){
        var friend_id = String(value);
		var current_id = String(uid);
		var found=false;
        console.log('Opening messenger with : ', friend_id, '&', current_id);
		promise.then(function(){
			var sessionID = getSessionID(current_id,friend_id);
		})
		.then(function(){
			if(sessionID == ''){
				sessionID = getSessionID(friend_id,current_id);
			}
		console.log('2nd. SESSION ID: ', sessionID);
		}).then(function(){
			if(sessionID == '') {
				console.log('Adding new session');
				firestore.collection("Chat-Groups").add({
					user_1: current_id,
					user_2: friend_id
				}).then(function(){
					firestore.collection("Chat-Groups").where("user_2", "==", friend_id).where("user_1", "==", current_id)
						.get()
						.then(function(querySnapshot){
							var doc = querySnapshot.docs[0];
							sessionID = String(doc.id);
							found = true;
						})
						.catch(function(error){
                        console.log("Error getting document ID: ", error);
						});
				}).then(function(){
					firestore.collection("Chat-Groups").doc(sessionID).collection("Messages").add({
						messages_approved: "true"
					})
			})
			.then(function(){
				console.log("Messages collection successfully written!");
			})
			.catch(function(error){
				console.error("Error writing collection: ", error);
			});
		}});
		
		// REDIRECT USER TO THE MESSENGER
		var messengerURL = 'https://focalpointkent.pythonanywhere.com/messenger?SID=' + sessionID;
		window.open(messengerURL, '_blank', 'height=500,width=400,top=100,left=100');
    }

	
	
    // =======================================================
    //	Create elements and render friends list
    //

    function renderFriendsList(doc1){
        console.log('Rendering friend...');
		
		var friendProfile = firestore.collection('Users').doc(doc1.id).get()
			.then(doc => {
				if (!doc.exists) {
					console.log('No such document!');
				} else {
					console.log('doc data: ', doc.data());
					var first_name = String(doc.get("first_Name"));
					var last_name = String(doc.get("last_Name"));
					var displayName = first_name + ' ' + last_name;
					var but = document.createElement("button");
					but.setAttribute("value", doc1.id);
					but.id = doc1.id;
					but.innerHTML = displayName;
					but.setAttribute("class", "btn btn-primary btn-lg btn-block");
					connectedFriendsList.appendChild(but);
					attachClickEvent(doc1.id);
				}
			})
			.catch(err => {
				console.log('Error getting document', err);
			});

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
