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
        console.log("initializeApp in loadProfile.js");
        //console.log(app);
    }

    // Fetch an instance of the DB
    const db = firebase.firestore(app);
    //console.log(db);

    // Disable deprecated features
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    // Get page elements to load

    const fullNameDOM = document.getElementById('name');
    const majorDOM = document.getElementById('major');
    const minorDOM = document.getElementById('minor');
    const graduationDOM = document.getElementById('graduation');
    const emaiDOM = document.getElementById('minor');
    const websiteDOM = document.getElementById('website');

    var initialLoad = true;
    var currentUser = firebase.auth().currentUser;
    var inputUser = document.currentScript.getAttribute('inputUser');

    // Used by queries in onAuthStateChange()
    var inputUsersID = "";
    var firstName = "";
    var lastName = "";
    
    function LoadProfile(uidToLoad, fName, lName)
    {
        console.log("Inside loadProfile()");
        var FN = fName;
        console.log(uidToLoad, "+", fName, "+", lName);
        //db.collection("Users").doc(uidToLoad).get().then((snapshot) => {
        //    firstName = snapshot.get("first_Name");
        //});
    };

    function AddUserToDB(currentUID, currentEmail){
        // Create new document in 'Users' collection
        db.collection("Users").doc(currentUID).set({   // Need to confirm that 'currentUID' is properly converted to a string
            first_Name: sFirstName,
            last_Name: sLastName,
            email: currentEmail,                          
            userType: currentUserType,
            userID: currentUID,
            verified: false
        })
        .then(function(){
            console.log("Users documents successfully written!");
        })
        .catch(function(error){
            console.error("Error writing document: ", error);
        });

        // Create new document in the 'Profiles' collection
        // Fields must be populated later when users provide more information
        db.collection("Profiles").doc(currentUID).set({
            major: "Fill in Major",
            minor: "Fill in Minor",
            bio: "Bio goes here",
            faculty_position: "test-position",
            website: "test-website.com",
            facebook: "facebook-link",
            instagram: "insta-link",
            twitter: "twitter-link",
            graduation_year: "2010",
            userID: currentUID
        })
        .then(function(){
            console.log("Profile documents successfully written!");
        })
        .catch(function(error){
            console.error("Error writing document: ", error);
        });

        // Create new document in the 'Blocks' collection
        // Feilds must be populated at the time of the block
        // Blocking requires a merge with the existing feilds
        db.collection("Blocks").doc(currentUID).set({                  
            uid: currentUID
        })
        .then(function(){
            console.log("Blocks documents successfully written!");
        })
        .catch(function(error){
            console.error("Error writing document: ", error);
        });
		
		// Create new collection 'Friends' for each user
		db.collection("Users").doc(currentUID).collection("Friends").doc(currentUID).set({
			uid: currentUID
		})
		.then(function(){
            console.log("Friends collection successfully written!");
        })
        .catch(function(error){
            console.error("Error writing collection: ", error);
        });
    };

    firebase.auth().onAuthStateChanged(user => {
        if (user)
        {
            currentUser = user;

            // View this user's profile
            if (inputUser)
            {
                var email = String(inputUser + "@kent.edu");

                db.collection("Users").where("email", "==", email)
                    .get()
                    .then(function(querySnapshot){
                        var doc = querySnapshot.docs[0];
                            inputUsersID = String(doc.id);
                            firstName = String(doc.get("first_Name"));
                            lastName = String(doc.get("last_Name"));
                            //console.log(inputUsersID, " + ", firstName, " + ", lastName);
                            console.log(doc.id, " => ", doc.data());
                            LoadProfile(inputUsersID, firstName, lastName); // Function call must be here otherwise values aren't passed
                    })
                    .catch(function(error){
                        console.log("Error getting document ID: ", error);
                    });
            }
        
            // View your own
            else
            {
                LoadProfile(currentUser.uid, " ", " "); // Filled in empty passed variables for now
            }
        }
        else
        {
            // User is not logged in and shouldn't be able to see anyone's profile.
        }
    });
}());
