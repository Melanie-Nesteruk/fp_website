(function() {
	var sessionID = document.currentScript.getAttribute('sessionID');
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
					
				} else {
					var user_1 = String(doc.get("user_1"));
					var user_2 = String(doc.get("user_2"));
					if (user_1 == currentUID){
						friendUID = user_2;
						authorized = true;
					} else if (user_2 == currentUID){
						friendUID = user_1;
						authorized = true;
					}
					else {
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
						
						var observer = firestore.collection('Chat-Groups').doc(sessionID).collection('Messages').orderBy('timestamp')
							.onSnapshot(snapshot => {
								let changes = snapshot.docChanges();
								changes.forEach(change => {
									if (change.type == 'added') {
										displayMessage(change.doc);
									}
								});
						});
						
					}

					// Saves a new message on the Firebase DB.
					function saveMessage(messageText) {
						const timestamp = firebase.firestore.FieldValue.serverTimestamp();
					  // Add a new message entry to the Firebase database.
					  return firestore.collection('Chat-Groups').doc(sessionID).collection('Messages')
						.add({
							fromID: currentUID,
							text: messageText,
							timestamp: timestamp
						});
					}

					// Add each user to each others friends list
					function addFriendsList() {
						firestore.collection("Users").doc(currentUID).collection("Friends").doc(friendUID).set({
							placeholder: true
						})
						.then(function(){
							// Create new collection 'Friends' for each user
							firestore.collection("Users").doc(friendUID).collection("Friends").doc(currentUID).set({
							placeholder: true
							})
							.then(function(){
								messageHasBeenSent = true;
							})
							.catch(function(error){
								console.error("Error writing collection: ", error);
							}); 
						})
						.catch(function(error){
							console.error("Error writing collection: ", error);
						});
						
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

					//=================================================
					//=================================================
					//=================================================
					// Begin the mess
					
					var me = {};
					me.avatar = "https://lh6.googleusercontent.com/-lr2nyjhhjXw/AAAAAAAAAAI/AAAAAAAARmE/MdtfUmC0M4s/photo.jpg?sz=48";

					var you = {};
					you.avatar = "https://a11.t26.net/taringa/avatares/9/1/2/F/7/8/Demon_King1/48x48_5C5.jpg";
           
					// Displays a Message in the UI.
					function displayMessage(doc) {
						
						var control = "";
    
						
						li.setAttribute('id', doc.id);
						var text = doc.data().text;
						var fromID = String(doc.data().fromID);
						if(currentUID == fromID){
							control = '<li style="width:100%">' +
										'<div class="msj macro">' +
										'<div class="avatar"><img class="img-circle" style="width:100%;" src="'+ me.avatar +'" /></div>' +
											'<div class="text text-l">' +
												'<p>'+ text +'</p>' +
											'</div>' +
										'</div>' +
									'</li>';
						} else {
							 control = '<li style="width:100%;">' +
											'<div class="msj-rta macro">' +
												'<div class="text text-r">' +
													'<p>'+text+'</p>' +
												'</div>' +
											'<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="'+you.avatar+'" /></div>' +                                
									  '</li>';
						}
						$("ul").append(control).scrollTop($("ul").prop('scrollHeight'));
					}
					
					// End the mess
					//=================================================
					//=================================================
					//=================================================
					

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

					
					// Toggle for the button.
					$(".mytext").on("keydown", function(e){
						if (e.which == 13){
							console.log("Saving message to firebase");
							var text = $(this).val();
							// Check that the user entered a message and is signed in.
							if (text !== "" && checkSignedInWithMessage()) {
								saveMessage(text).then(function() {
									if (messageHasBeenSent == false){
										addFriendsList();
									}
								// Clear message text field and re-enable the SEND button.
								$(this).val('');
								});
							}
						}
					});

					$('body > div > div > div:nth-child(2) > span').click(function(){
						$(".mytext").trigger({type: 'keydown', which: 13, keyCode: 13});
					})
					
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

}());