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

    // Varibles used by block() / unblock(), addBlocktoDB() / removeBlockFromDB(), & isBlocked() functions
    var blockUserProfile = document.currentScript.getAttribute('inputUser');
    var blockUserEmail = String(blockUserProfile + "@kent.edu");
    var blockUsersID = "";
    var unblockUserID = "";

    // Get elements/user input
    const btnBlockAcct = document.getElementById('btnBlockAcct');

    // Add record of currentUser's block to the DB
    function addBlocktoDB(cUID, blockUID, blockEmail){
        db.collection("Users").doc(cUID).collection("Blocks").doc(blockUID).set({
            uid_blocked: blockUID,
            email_blocked: blockEmail,
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

    // Updates block record in the DB so that user is no longer seen as blocked, does NOT delete block document
    function removeBlockFromDB(cUID, ubUID){
        db.collection("Users").doc(cUID).collection("Blocks").doc(ubUID).set({
            date_unblocked: firebase.firestore.Timestamp.now(),
            block_removed: true                        
        })
        .then(function(){
            console.log("Blocks documents were successfully overwritten!");
        })
        .catch(function(error){
            console.error("Error writing document: ", error);
        });
    }

    // Takes the userID of the current user looking to unblock another user
    // Unblocks the user whose profile is currently being viewed.
    function unblock(currentUID){
        db.collection("Users").doc(currentUID).collection("Blocks").where("email_blocked", "==", blockUserEmail)
            .get()
                .then(function(querySnapshot){
                    var doc = querySnapshot.docs[0];
                    unblockUserID = String(doc.id);

                    removeBlockFromDB(currentUID, unblockUserID);
                })
                .catch(function(error){
                    console.log("Error getting document ID: ", error);
                });
    }

    // Main block / unblock functionality
    // Query from isBlockedE() with block & unblock functionality nested inside it 
    // (because firebase asynchronous queries are finicky and annoying)
    function blockUnblockSequence(){
        var cUser = firebase.auth().currentUser;
        var curUID = cUser.uid;
        var currentEmail = String(cUser.email);
        var currentShortEmail = currentEmail.substring(0, currentEmail.indexOf("@"));

        db.collection("Users").doc(curUID).collection("Blocks").where("email_blocked", "==", blockUserEmail)
            .get()
                .then(function(querySnapshot){
                    if(Number(querySnapshot.size) == 0){ // if .size = 0 there are no documents (user is NOT blocked )
                        swal({
                            title: "Are you sure?",
                            type: "warning",
                            text:  "Blocking " + blockUserProfile + " will prevent you from seeing their profile and sending them messages.",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            allowEnterKey: true,
                            showConfirmButton: true,
                            confirmButtonText: "Block",
                            showCancelButton: true,
                            cancelButtonText: "Cancel"
                        })
                        .then((result) => {
                            if(result.value){
                                block(curUID);
                                swal({
                                    title: "" + blockUserProfile + " was blocked.",
                                    type: "success",
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                    allowEnterKey: true,
                                    showConfirmButton: true,
                                    confirmButtonText: "Continue"
                                    })
                                    .then((result) => {
                                        // Redirect user to their profile after block
                                        window.location.href = "/profile?user=" + currentShortEmail;
                                        return;
                                    }); 
                            }
                        })
                    } 
                    else { // Otherwise the user is blocked
                        swal({
                            title: "Are you sure?",
                            type: "info",
                            text:  "Please confirm you want to unblock " + blockUserProfile + ".",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            allowEnterKey: true,
                            showConfirmButton: true,
                            confirmButtonText: "Unblock",
                            showCancelButton: true,
                            cancelButtonText: "Cancel"
                        })
                        .then((result) => {
                            if(result.value){
                                unblock(curUID);
                                swal({
                                    title: "" + blockUserProfile + " was unblocked.",
                                    type: "success",
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                    allowEnterKey: true,
                                    showConfirmButton: true,
                                    confirmButtonText: "Continue"
                                })
                                .then((result) => {
                                    // Reload the page after unblocking
                                    window.location.href = "/profile?user=" + blockUserProfile;
                                    return;
                                }); 
                            }
                            return;
                        });
                    }
                })                              
                .catch(function(error){
                    console.log("Error getting document ID: ", error);
                });
        return;
    } 

    // Add event listner for block / unblock event
    if (btnBlockAcct != null) {
        btnBlockAcct.addEventListener('click', function(){
            blockUnblockSequence();
        })
    }

    //////////////////////
    //(Example Queries)///
    //////////////////////

    // Return 0 if user IS blocked
    // Return 1 if user IS NOT blocked
    // Return 2 if an error has occured
    function isBlockedE(cUID, bEmail){
        var bVal = 2;
        db.collection("Users").doc(cUID).collection("Blocks").where("email_blocked", "==", bEmail)
            .get()
                .then(function(querySnapshot){
                    console.log("Inside isBlockedE query");
                    console.log("Snapshot size = ", querySnapshot.size);
                    if(Number(querySnapshot.size) == 0){ bVal = 1; } // if .size = 0 there are no documents in the query(user NOT blocked)  
                    else { bVal = 0; }                               // Otherwise user IS blocked
                })                              
                .catch(function(error){
                    console.log("Error getting document ID: ", error);
                    bVal = 2;
                });
        return bVal; 
    }

    // Takes a current user's UID & a blocked user's UID to check if the current user blocked the other UID
    // Returns true if cUID is blocking bUID
    // Returns false otherwise
    function isBlockedID(cUID, bUID){
        db.collection("Users").doc(cUID).collection("Blocks").where("uid_blocked", "==", bUID)
            .get()
                .then(function(querySnapshot){
                    return querySnapshot.empty; // Should be true if there are no documents with the blocked UID (User is not blocked),
                })                              // Otherwise (empty) should be false (User is blocked)
                .catch(function(error){
                    console.log("Error getting document ID: ", error);
                });
    }
}());