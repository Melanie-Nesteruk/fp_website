(function() {
	var sessionID = document.currentScript.getAttribute('SID');
	console.log('SESSION ID: ', sessionID);
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
    var uid;

    // =======================================================
    // Check for user being logged in
    //

    firebase.auth().onAuthStateChanged(function(user) {
		if (user) { // if user is authorized
			
			var currentUID = user.uid;
			var friendUID = inputUser;
			
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
				
				var observer = firestore.collection('Chat-Groups').where('user_1', '==', friendUID).where('user_2', '==', currentUID)
					.onSnapshot(querySnapshot => {
					querySnapshot.docChanges.forEach(change => {
						if (change.type === 'added') {
							displayMessage(snap.key, change.doc.data().name, change.doc.data().text);
							console.log('New message: ', change.doc.data());
						}
					});
				});
				
				var observer1 = firestore.collection('Chat-Groups').where('user_2', '==', friendUID).where('user_1', '==', currentUID)
					.onSnapshot(querySnapshot => {
					querySnapshot.docChanges.forEach(change => {
						if (change.type === 'added') {
							displayMessage(snap.key, change.doc.data().name, change.doc.data().text);
							console.log('New message: ', change.doc.data());
						}
					});
				});
			}

			// Saves a new message on the Firebase DB.
			function saveMessage(messageText) {
			  // Add a new message entry to the Firebase database.
			  firebase.database().ref('/messages/').push({
				name: getUserName(),
				text: messageText,
				profilePicUrl: getProfilePicUrl()
			  }).catch(function(error) {
				console.error('Error writing new message to Firebase Database', error);
			  });
			}

			// // Saves the messaging device token to the datastore.
			// function saveMessagingDeviceToken() {
			  // firebase.messaging().getToken().then(function(currentToken) {
				// if (currentToken) {
				  // console.log('Got FCM device token:', currentToken);
				  // // Saving the Device Token to the datastore.
				  // firebase.database().ref('/fcmTokens').child(currentToken)
					  // .set(firebase.auth().currentUser.uid);
				// } else {
				  // // Need to request permissions to show notifications.
				  // requestNotificationsPermissions();
				// }
			  // }).catch(function(error){
				// console.error('Unable to get messaging token.', error);
			  // });
			// }

			// Triggered when the send new message form is submitted.
			function onMessageFormSubmit(e) {
			  e.preventDefault();
			  // Check that the user entered a message and is signed in.
			  if (messageInputElement.value && checkSignedInWithMessage()) {
				saveMessage(messageInputElement.value).then(function() {
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

				// Show sign-in button.
				signInButtonElement.removeAttribute('hidden');
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

			// Template for messages.
			var MESSAGE_TEMPLATE =
				'<div class="message-container">' +
				  '<div class="spacing"><div class="pic"></div></div>' +
				  '<div class="message"></div>' +
				  '<div class="name"></div>' +
				'</div>';

			// Displays a Message in the UI.
			function displayMessage(key, name, text, picUrl, imageUrl) {
				console.log('Key: ', key);
				console.log('Name: ', name);
				console.log('Text: ', text);
			  var div = document.getElementById(key);
			  // If an element for that message does not exists yet we create it.
			  if (!div) {
				var container = document.createElement('div');
				container.innerHTML = MESSAGE_TEMPLATE;
				div = container.firstChild;
				div.setAttribute('id', key);
				messageListElement.appendChild(div);
			  }
			  div.querySelector('.name').textContent = name;
			  var messageElement = div.querySelector('.message');
			  if (text) { // If the message is text.
				messageElement.textContent = text;
				// Replace all line breaks by <br>.
				messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
			  } 
			  // Show the card fading-in and scroll to view the new message.
			  setTimeout(function() {div.classList.add('visible')}, 1);
			  messageListElement.scrollTop = messageListElement.scrollHeight;
			  messageInputElement.focus();
			}

			// Enables or disables the submit button depending on the values of the input
			// fields.
			function toggleButton() {
			  if (messageInputElement.value) {
				submitButtonElement.removeAttribute('disabled');
			  } else {
				submitButtonElement.setAttribute('disabled', 'true');
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