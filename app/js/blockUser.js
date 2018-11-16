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
    var currentUser = firebase.auth().currentUser;
    var currentUID = String(currentUser.uid);
    var blockUserProfile = document.currentScript.getAttribute('inputUser');
    var blockUserEmail = String(blockUserProfile + "@kent.edu");
    var blockUsersID = "";

    // Returns the current Date in DD/MM/YY format
    function getDate(){
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

        today = day + '/' + month + '/' + year;

        return today;
    }

    function addBlocktoDB(blockUID, blockEmail){
        db.collection("Users").doc(currentUID).collection("Blocks").doc(blockUID).set({
            uid_Blocked: blockUID,
            email_Blocked: blockEmail,
            date_blocked: firebase.firestore.Timestamp.now(),
            block_removed: false                       
            //Feilds within document: (bool)block_removed, (timestamp)date_blocked,
            //Upon block removal, overwrite all feilds of unblocked user set: (bool)block_removed, (timestamp) date_removed 
        })
        .then(function(){
            console.log("Blocks collection successfully written!");
        })
        .catch(function(error){
            console.error("Error writing document: ", error);
        });
    }

    // Add the specified user to the current user's blocks collection
    function block(){
        db.collection("Users").where("email", "==", blockUserEmail)
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

    function isBlocked(email){

    }

    
    
}());