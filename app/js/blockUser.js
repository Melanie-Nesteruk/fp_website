(function() {
    if (!firebase.apps.length) {
        var config = {
		    apiKey: "AIzaSyCEuT1gco387t16C2IAmN2bx5bt-n6ea6s",
		    authDomain: "focal-point-student-alumni-net.firebaseapp.com",
		    databaseURL: "https://focal-point-student-alumni-net.firebaseio.com",
		    projectId: "focal-point-student-alumni-net",
		    storageBucket: "focal-point-student-alumni-net.appspot.com",
		    messagingSenderId: "1002904582612"
	    };
			
        var app = firebase.initializeApp(config);
        console.log("initializeApp in blockUser.js");
    }

    // Fetch an instance of the DB
    const db = firebase.firestore(app);

    // Disable deprecated features
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    // Varibles used by block(), addBlocktoDB(), & isBlocked() functions
    var blockUserProfile = document.currentScript.getAttribute('inputUser');
    var blockUserEmail = String(blockUserProfile + "@kent.edu");
    var blockUsersID = "";

    // Get elements/user input
    const btnBlockAcct = document.getElementById('btnBlockAcct');

    // Add record of currentUser's block to the DB
    function addBlocktoDB(cUID, blockUID, blockEmail){
        db.collection("Users").doc(cUID).collection("Blocks").doc(blockUID).set({
            uid_Blocked: blockUID,
            email_Blocked: blockEmail,
            date_blocked: firebase.firestore.Timestamp.now(),
            block_removed: false                        
        })
        .then(function(){
            console.log("Block user documents successfully written!");
        })
        .catch(function(error){
            console.error("Error writing document: ", error);
        });
    }
    //Upon block removal, overwrite all feilds of unblocked user set: (bool)block_removed, (timestamp) date_removed

    // Takes the userID of the current user looking to block another user
    // Blocks user whose profile is currently being viewed
    function block(currentUID){
        db.collection("Users").where("email", "==", blockUserEmail)
            .get()
                .then(function(querySnapshot){
                    var doc = querySnapshot.docs[0];
                    blockUsersID = String(doc.id);

                    addBlocktoDB(currentUID, blockUsersID, blockUserEmail);
                })
                .catch(function(error){
                    console.log("Error getting document ID: ", error);
                });
    }

    // Takes the userID of the current user looking to unblock another user
    // Unblocks the user whose profile is currently being viewed.
    function unblock(currrentUID){

    }

    // Takes a current user's UID & the email of another user to check if that user is blocked
    // Returns true user whos email was passed is being blocked by the given userID (exists in the cUID's blocks collection)
    // Returns false otherwise 
    function isBlockedE(cUID, bEmail){
        db.collection("Users").doc(cUID).collection("Blocks").where("email_blocked", "==", bEmail)
            .get()
                .then(function(querySnapshot){
                    return querySnapshot.empty; // Should be true if there are no documents with the blocked email,
                })                              // Otherwise (empty) should be false
                .catch(function(error){
                    console.log("Error getting document ID: ", error);
                });
    }

    // Takes a current user's UID & a blocked user's UID to check if the current user blocked the other UID
    // Returns true if cUID is blocking bUID
    // Returns false otherwise
    function isBlockedID(cUID, bUID){
        db.collection("Users").doc(cUID).collection("Blocks").where("uid_blocked", "==", bUID)
            .get()
                .then(function(querySnapshot){
                    return querySnapshot.empty; // Should be true if there are no documents with the blocked UID,
                })                              // Otherwise (empty) should be false
                .catch(function(error){
                    console.log("Error getting document ID: ", error);
                });
    }

    // Add event listner for block event
    if (btnBlockAcct != null) {
        btnBlockAcct.addEventListener('click', e=> {
            var cUser = firebase.auth().currentUser;
            var curUID = cUser.uid;
            var currentEmail = String(cUser.email);
            var currentShortEmail = currentEmail.substring(0, currentEmail.indexOf("@")); 

            if(!isBlockedE(curUID, blockUserEmail)){  // If profile is currently unblocked, ask to block the user
                swal({
                    title: "Are you sure?",
                    icon: "warning",
                    text:  "Blocking " + blockUserProfile + " will prevent you from seeing their profile and sending them messages.",
                    closeOnClickOutside: false,
                    closeOnEsc: false,
                    buttons: {
                        block: {
                            text: "Block",
                            value: 1,
                            visible: true,
                            closeModal: true,  
                        },
                        cancel: {
                            text: "Cancel",
                            value: 0,
                            visible: true,
                            closeModal: true,
                        }
                    }
                })
                .then(value => {
                    if(value == 1){
                        block(curUID);
                        swal({
                            title: "" + blockUserProfile + " was blocked.",
                            icon: "success",
                            closeOnClickOutside: false,
                            closeOnEsc: false,
                            buttons: {
                                confirm: {
                                    text: "Continue",
                                    closeModal: true,
                                    value:      1
                                }
                            }
                        })
                        .then(value => {
                            // Redirect user to their profile after block
                            window.location.href = "/profile?user=" + currentShortEmail;
                            return;
                        }); 
                    }
                    return;
                });
            }
            else{   // Otherwise ask to unblock the user

            }
            return;
        }); 
    }
}());