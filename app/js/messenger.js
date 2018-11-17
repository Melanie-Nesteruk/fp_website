(function() {
	// var sessionID = document.currentScript.getAttribute('sid');
	var sessionID = "SDJbbC0ZioSW8Drx5pdT";
	console.log('SESSION ID: ', sessionID);
	const messageList = document.querySelector('#message-list');
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
    var currentUID = '';
	var friendUID = '';
	var authorized = false;
	var messageHasBeenSent = false;
    // =======================================================
    // Check for user being logged in
    //

		// CHECK IF USER IS AUTHORIZED FOR CONVERSATION
    firebase.auth().onAuthStateChanged(function(user) {
		if (user) { // if user is authorized
			currentUID = user.uid;
			firestore.collection("Chat-Groups").doc(sessionID)
				.get().then(doc => {
				if (!doc.exists) {
					console.log("No documents found!");
				} else {
					console.log('Document found!');
					var user_1 = String(doc.get("user_1"));
					var user_2 = String(doc.get("user_2"));
					if (user_1 == currentUID){
						console.log('user_1 is current user');
						friendUID = user_2;
						authorized = true;
					} else if (user_2 == currentUID){
						console.log('user_2 is current user');
						friendUID = user_1;
						authorized = true;
					}
					else {
						
						console.log('Invalid Session ID!');
					}
				}
			})
			.then(function(){
				if(authorized == true){
					// Returns the signed-in user's display name.
					function getUserName() {
					  return firebase.auth().currentUser.displayName;
					}

					// Returns true if a user is signed-in.
					function isUserSignedIn() {
					  return !!firebase.auth().currentUser;
					}

					// Loads chat messages history and listens for upcoming ones.
					function loadMessages() {
						
						var observer = firestore.collection('Chat-Groups').doc(sessionID).collection('Messages')
							.onSnapshot(snapshot => {
								let changes = snapshot.docChanges();
								changes.forEach(change => {
									if (change.type == 'added') {
										messageHasBeenSent = true;
										displayMessage(change.doc);
										console.log('New message: ', change.doc.data());
									}
								});
						});
						
					}

					// Saves a new message on the Firebase DB.
					function saveMessage(messageText) {
					  // Add a new message entry to the Firebase database.
					  firestore.collection('Chat-Groups').doc(sessionID).collection('Messages')
						.add({
							fromID: currentUID,
							text: messageText,
						});
					}

					// Add each user to each others friends list
					function addFriendsList() {
						db.collection("Users").doc(current_id).collection("Friends").doc(friend_id).set({
							placeholder: true
						})
						.then(function(){
							console.log("Friends collection successfully written!");
							// Create new collection 'Friends' for each user
							db.collection("Users").doc(friend_id).collection("Friends").doc(current_id).set({
							placeholder: true
							})
							.then(function(){
								console.log("Friends collection successfully written!");
							})
							.catch(function(error){
								console.error("Error writing collection: ", error);
							}); 
						})
						.catch(function(error){
							console.error("Error writing collection: ", error);
						});
						
					}
					
					// Triggered when the send new message form is submitted.
					function onMessageFormSubmit(e) {
					  e.preventDefault();
					  // Check that the user entered a message and is signed in.
					  if (messageInputElement.value && checkSignedInWithMessage()) {
						saveMessage(messageInputElement.value).then(function() {
							if (messageHasBeenSent == false){
								addFriendsList();
							}
						  // Clear message text field and re-enable the SEND button.
						  resetMaterialTextfield(messageInputElement);
						  toggleButton();
						});
					  }
					}

					// Triggers when the auth state change for instance when the user signs-in or signs-out.
					function authStateObserver(user) {
						if (user) { // User is signed in!
							// Get the signed-in user's profile pic and name.
							var profilePicUrl = getProfilePicUrl();
							var userName = getUserName();

						} else { // User is signed out!
							console.log('User is signed out!');
						}
					}

					// Returns true if user is signed-in. Otherwise false and displays a message.
					function checkSignedInWithMessage() {
					  // Return true if the user is signed in Firebase
					  if (isUserSignedIn()) {
						return true;
					  }
						// ALERT FOR NOT BEING LOGGED IN
					  return false;
					}

					// Resets the given MaterialTextField.
					function resetMaterialTextfield(element) {
					  element.value = '';
					  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
					}

					// Displays a Message in the UI.
					function displayMessage(doc) {
						console.log('Message data being displayed: ', doc.data());
						let li = document.createElement('li');
						let message = document.createElement('span');
						
						li.setAttribute('data-id', doc.id);
						message.textContent = doc.data().text;
						var fromID = String(doc.data().fromID);
						if(currentUID == fromID){
							li.setAttribute('class', 'me');
						} else {
							li.setAttribute('class', 'him');
						}
						
						li.appendChild(message);
						messageList.appendChild(li);
					}

					// Enables or disables the submit button depending on the values of the input
					// fields.
					function toggleButton() {
					  if (messageInputElement.value) {
						sendButtonElement.removeAttribute('disabled');
					  } else {
						sendButtonElement.setAttribute('disabled', 'true');
					  }
					}

					// Checks that the Firebase SDK has been correctly setup and configured.
					function checkSetup() {
					  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
						window.alert('You have not configured and imported the Firebase SDK. ' +
							'Make sure you go through the codelab setup instructions and make ' +
							'sure you are running the codelab using `firebase serve`');
					  }
					}

					// Checks that Firebase has been imported.
					checkSetup();

					// Shortcuts to DOM Elements.
					var messageListElement = document.getElementById('messages');
					var messageFormElement = document.getElementById('message-form');
					var messageInputElement = document.getElementById('message');
					var sendButtonElement = document.getElementById('sendButton');

					// Saves message on form submit.
					messageFormElement.addEventListener('submit', onMessageFormSubmit);

					// Toggle for the button.
					messageInputElement.addEventListener('keyup', toggleButton);
					messageInputElement.addEventListener('change', toggleButton);

					// We load currently existing chat messages and listen to new ones.
					loadMessages();
						} else {
							console.log('User is not authorized for this conversation');
						}
					});
			
		} else { // If user is not authorized
			console.log('User is not authorized to access this webpage');
		}
	})
	// Real Time Messaging
	
	// LOAD THE MESSAGE THREAD FROM FIREBASE
		
		// IF (me)
			// Create 'me' li element in doc
		// ELSE (him)
			// Create 'him' li element in doc
			
	// Text box with send button
		// Each message sent to firebase
	
	
	
	
	
}());