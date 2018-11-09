(function() {
    console.log(firebase.apps.length);
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
        console.log("initializeApp in registerUser.js");
        //console.log(app);
    }

    // Fetch an instance of the DB
    const db = firebase.firestore(app);
    //console.log(db);

    // Disable deprecated features
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    // Get page elements to load

    const fullName = document.getElementById('name');
    const major = document.getElementById('major');
    const minor = document.getElementById('minor');
    const graduation = document.getElementById('graduation');
    const email = document.getElementById('minor');
    const website = document.getElementById('website');

    var initialLoad = true;
    var currentUser = firebase.auth().currentUser;
    var inputUser = document.currentScript.getAttribute('inputUser');

    if (currentUser)
    {
        // View this user's profile
        if (inputUser)
        {
            var email = inputUser + "@kent.edu";
            
            // firebase.auth().fetchProvidersForEmail(email)
            // .then(providers => {
            //   if (providers.length === 0) {
            //     // User not registered. Show an error on the page that says there is no profile for that user
            //   } else {
            //     // User is registered
            //     profileToLoad = providers[0].uid;
            //   }
            // });   
            // LoadProfile(inputUser.uid);
        }
    
        // View your own
        else
        {
            LoadProfile(currentUser.uid);
        }
    }
    else
    {
        // User is not logged in and shouldn't be able to see anyone's profile.
    }

    
    function LoadProfile(uidToLoad)
    {
        var firstName;
        var lastName;
        db.collection("Users").doc(uidToLoad).get().then((snapshot) => {
            firstName = snapshot.get("first_Name");
        });
    };

    // TO-DO: Add some sort of parsing functionality to sanitize user-input
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
        if(user && !initialLoad) {

            // Get current user ID  & email and convert them to strings
            var currentUID = user.uid;
            var sID = String(currentUID);
            var currentEmail = user.email;
            var sEmail = String(currentEmail);
        }
    });
}());
