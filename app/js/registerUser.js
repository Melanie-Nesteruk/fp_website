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
        console.log(app);
    }

    // Fetch an instance of the DB
    const db = firebase.firestore(app);
    console.log(db);
    console.log(firebase.app().name);

    // Test quick add to DB
    /* This addition is successful, So why are additions not working inside the function?
    db.collection("Profiles").doc("test_doc2").set({
        test_sucess: true
    })
    .then(function(){
        console.log("Test DB write was successful!");
    })
    .catch(function(error){
        console.error("Could not write to DB: ", error);
    });
    */

    // Disable deprecated features
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    // Get elements/user input
    const btnSignup = document.getElementById('btnSignup');
    const userSelect = document.getElementById("user_type_selection");

    const firstName = document.getElementById('txtFirstName');
    const lastName = document.getElementById('txtLastName');
    const email = document.getElementById('txtEmail');
    const password = document.getElementById('txtPassword');
    const password2 = document.getElementById('txtPassword2');
    const userType = userSelect.options[userSelect.selectedIndex].text;

    var initialLoad = true;

    // Add signup event
    if (btnSignup != null) {
        btnSignup.addEventListener('click', e=> { 
            const auth = firebase.auth();
            initialLoad = false;

            // Logout an existing user
            if (firebase.auth().currentUser) {
                firebase.auth().signOut();
                alert("User already logged in. You have been logged out.");
            }

            // Verify name is given
            if (firstName.value == "" || lastName.value == "") {
                alert("Please enter your full name.");
                return;
            }

            // Verify email is from kent.edu
            if (/@kent.edu\s*$/.test(email.value) == false) {
                alert("The email is invalid, expected a kent.edu address.");
                return;
            }

            // Verify passwords match
            if (password.value != password2.value) {
                alert("Error: The passwords do not match.");
                return;
            }

            // Register user (not successful until onAuthStateChanged is called)
            const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
            promise.catch(e => alert(e.message));
        });
    }

    // TO-DO: Add some sort of parsing functionality to sanitize user-input
    function AddUserToDB(currentUID){

        console.log('Adding user to firestore.');

        // User input: firstName, lastName, email, userType
        // Create pre-verified database input for current input fields
        /*const currentUser = firebase.auth().currentUser;
        const currentUID = currentUser.uid;*/
        var currentUserType = 0;

        //const currentUID = user.uid;

        // Convert HTMLElements to strings to store in DB
        const sFirstName = firstName.value;
        const sLastName = lastName.value;
        const sEmail = email.value;

        // Set userType based on information given by user
        // 1 == Student | 2 == Alumni | 3 == Faculty
        if(userType == "Student") {
            currentUserType = 1;
        }
        else if(userType == "Alumni") {
            currentUserType = 2;
        }
        else {       
            currentUserType = 3;
        }

        var data ={
            test_success: true
        };

        // Test additions
        db.collection("Profiles").doc("test_doc4").set(data);/*
        .then(function(){
            console.log("Test DB write was successful!");
        })
        .catch(function(error){
            console.error("Could not write to DB: ", error);
        });*/

        console.log("Exiting addUsertoDB...");
        /*
        db.collection("Users").doc("TEST_CREATION").set({
            first_Name: "TEST_FIRSTNAME",
            verified: false
        })
        .then(function(){
            console.log("Document successfully written!");
        })
        .catch(function(error){
            console.error("Error writing document: ", error);
        });

        // Create new document in 'Users' collection
        db.collection("Users").doc(currentUID).set({   // Need to confirm that 'currentUID' is properly converted to a string
            first_Name: sFirstName,
            last_Name: sLastName,
            email: sEmail,                          
            userType: currentUserType,
            verified: false
        })
        .then(function(){
            console.log("Document successfully written!");
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
            graduation_year: "2010"
        })
        .then(function(){
            console.log("Document successfully written!");
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
            console.log("Document successfully written!");
        })
        .catch(function(error){
            console.error("Error writing document: ", error);
        });
        */
    };

    firebase.auth().onAuthStateChanged(user => {
        if(user && !initialLoad) {
            // Successful account creation
            alert("Your account has been created! You are now logged in.");
            console.log(user);

            // Testing addition before call to function
            // This addition was successful, but does not print to the console
            /*db.collection("Profiles").doc("test_doc3").set({
                test_success: true
            })
            .then(function(){
                console.log("Test DB write was successful!");
            })
            .catch(function(error){
                console.error("Could not write to DB: ", error);
            });*/

            // Add user info to DB
            var currentUserType = 0;

            // Convert HTMLElements to strings to store in DB
            const sFirstName = firstName.value;
            const sLastName = lastName.value;
            const sEmail = email.value;

            // Set userType based on information given by user
            // 1 == Student | 2 == Alumni | 3 == Faculty
            if(userType == "Student") {
                currentUserType = 1;
            }
            else if(userType == "Alumni") {
                currentUserType = 2;
            }
            else {       
                currentUserType = 3;
            }

            db.collection("Users").doc(user.uid).set({   // Need to confirm that 'currentUID' is properly converted to a string
            first_Name: sFirstName,
            last_Name: sLastName,
            email: sEmail,                          
            userType: currentUserType,
            verified: false
            })
            .then(function(){
            console.log("Document successfully written!");
            })
            .catch(function(error){
            console.error("Error writing document: ", error);
            });

            db.collection("Profiles").doc(user.uid).set({
                major: "Fill in Major",
                minor: "Fill in Minor",
                bio: "Bio goes here",
                faculty_position: "test-position",
                website: "test-website.com",
                facebook: "facebook-link",
                instagram: "insta-link",
                twitter: "twitter-link",
                graduation_year: "2010"
            })
            .then(function(){
                console.log("Document successfully written!");
            })
            .catch(function(error){
                console.error("Error writing document: ", error);
            });

            db.collection("Blocks").doc(user.uid).set({                  
                uid: user.uid
            })
            .then(function(){
                console.log("Document successfully written!");
            })
            .catch(function(error){
                console.error("Error writing document: ", error);
            });

            //AddUserToDB(user.uid);

            // Reload page to clear fields
            document.location.reload();
        }
    });
}());
