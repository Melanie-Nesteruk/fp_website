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
    var currentUID = String(firebase.auth().currentUser.uid);
    var currentEmail = String(currentUser.email);
    var currentShortEmail = currentEmail.substring(0, currentEmail.indexOf("@"));
    var blockUserProfile = document.currentScript.getAttribute('inputUser');
    var blockUserEmail = String(blockUserProfile + "@kent.edu");
    var blockUsersID = "";

    // Get elements/user input
    const btnBlockAcct = document.getElementById('btnBlockAcct');

    // Returns the current Date/Time in DD/MM/YY format
    // May or may not need for Timestamp creation
    function getTimeDate(){
        var today = new Date();
        var day = today.getDate();
        var month = today.getMonth()+1; //(Starts @ zero)
        var year = today.getFullYear();
        var hours = today.getHours();
        var minutes = today.getMinutes();
        var secounds = today.getSeconds();

        if(day < 10){
            day = '0' + day;
        }
        if(month < 10){
            month = '0' + month
        }
        if(hours < 10){
            hours = '0' + hours;
        }
        if(minutes < 10){
            minutes = '0' + minutes;
        }
        if(secounds < 10){
            secounds = '0' + secounds;
        }

        //Short Date
        //today = day + '/' + month + '/' + year; Short-hand version

        //ISO Date-Time format
        today = "20" + year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + secounds + "Z";

        return today;
    }

    // Add record of currentUser's block to the DB
    function addBlocktoDB(blockUID, blockEmail){
        db.collection("Users").doc(currentUID).collection("Blocks").doc(blockUID).set({
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

    // Add the specified user to the current user's blocks collection
    // Blocks the current user profile being viewed
    function block(){
        db.collection("Users").doc(currentUID).collection("Blocks").where("email", "==", blockUserEmail)
            .get()
                .then(function(querySnapshot){
                    var doc = querySnapshot.docs[0];
                    blockUsersID = String(doc.id);

                    addBlocktoDB(blockUsersID, blockUserEmail);
                })
                .catch(function(error){
                    console.log("Error getting document ID: ", error);
                });
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
            if(!isBlockedE(currentUID, blockUserEmail)){  // If profile is currently unblocked, ask to block the user
                swal({
                    title: "Are you sure?",
                    icon: "warning",
                    text:  "Blocking " + blockUserProfile + " will prevent you from seeing their profile and sending them messages.",
                    buttons: {
                        block: {
                            text: "Block",
                            closeModal: true,
                            value: 1
                        },
                        cancel: {
                            text: "Cancel",
                            closeModal: true,
                            value: 0
                        } 
                    }
                })
                .then(value => {
                    if(value = 1){ 
                        block();
                        swal({
                            title: "" + blockUserProfile + "was blocked.",
                            icon: "success",
                            buttons: {
                                confirm: {
                                    text: "Continue",
                                    closeModal: true,
                                    value:      1
                                }
                            }
                        })
                        .then(value => {
                            window.location.href = "/profile?user=" + currentShortEmail;// Redirect user to their profile after block
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