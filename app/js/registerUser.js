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
        console.log("initializeApp in registerUser.js");
        //console.log(app);
    }

    // Fetch an instance of the DB
    const db = firebase.firestore(app);
    //console.log(db);

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
    var userType = userSelect.options[userSelect.selectedIndex].text;
    var photoInterests = ["Nature"];

    var initialLoad = true;

    // Add signup event
    if (btnSignup != null) {
        btnSignup.addEventListener('click', e=> { 
            const auth = firebase.auth();
            initialLoad = false;
            
            userType = userSelect.options[userSelect.selectedIndex].text;
            // Logout an existing user
            if (firebase.auth().currentUser) {
                firebase.auth().signOut();
                swal({
                    text: "User already logged in. You have been logged out.",
                    icon: "error"
                });
            }

            // Verify name is given
            if (firstName.value == "" || lastName.value == "") {
                swal({
                    text: "Please enter your full name.",
                    icon: "error"
                });
                return;
            }

            // Verify email is from kent.edu
            if (/@kent.edu\s*$/.test(email.value) == false) {
                swal({
                    text: "The email is invalid, expected a kent.edu address.",
                    icon: "error"
                });
                return;
            }

            // Verify passwords match
            if (password.value != password2.value) {
                swal({
                    text: "The passwords do not match.",
                    icon: "error"
                });
                return;
            }

            // Register user (not successful until onAuthStateChanged is called)
            const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
            promise.catch(e => swal(e.message));
        });
    }

    function AddUserToDB(currentUID, currentEmail){
        console.log('Adding user to firestore.');

        // Convert HTMLElements to strings to store in DB
        var sFirstName = String(firstName.value);
        var sLastName = String(lastName.value);
        var currentUserType = 0;

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

        // Create new document in 'Users' collection
        db.collection("Users").doc(currentUID).set({   // Need to confirm that 'currentUID' is properly converted to a string
            first_Name: sFirstName,
            last_Name: sLastName,
            email: currentEmail,                          
            userType: currentUserType,
            userID: currentUID,
            verified: false,
            verified_by: "NA",
            admin: false,
            date_joined: firebase.firestore.Timestamp.now()
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
            major: "Not yet set",
            minor: "Not yet set",
            bio: "No bio set",
            faculty_position: "Not yet set",
            website: "www.yourwebsitehere.com",
            facebook: "Not_yet_set",
            instagram: "Not_yet_set",
            twitter: "Not_yet_set",
            graduation_year: "2022",
            photo_interests: photoInterests,
            userID: currentUID
        })
        .then(function(){
            console.log("Profile documents successfully written!");
        })
        .catch(function(error){
            console.error("Error writing document: ", error);
        });

        
        // Feilds and documents must be added at the time of the block
        // Blocking requires a merge with the existing feilds
        // Create a new collection 'Blocks' for each user
        // temporary placeholder feild & document needed to create the collection(firebase removes empty collections) 
        db.collection("Users").doc(currentUID).collection("Blocks").doc("placeholder").set({
            placeholder: true                        
            //At time of block add/merge
            //New document: uid_blocking
            //Feilds within document: (bool)block_removed, (timestamp)date_blocked,
            //Upon block removal, overwrite all feilds of unblocked user set: (bool)block_removed, (timestamp) date_removed 
        })
        .then(function(){
            console.log("Blocks collection successfully written!");
        })
        .catch(function(error){
            console.error("Error writing document: ", error);
        });
		
		// Create new collection 'Friends' for each user
		db.collection("Users").doc(currentUID).collection("Friends").doc(currentUID).set({
			placeholder: true
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
            // Successful account creation
            swal({
                title: "Your account has been created!",
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
                window.location.href = "/index";
                return;
            });
            console.log(user);

            // Get current user ID  & email and convert them to strings
            var currentUID = user.uid;
            var sID = String(currentUID);
            var currentEmail = user.email;
            var sEmail = String(currentEmail);

            AddUserToDB(sID, sEmail);
        }
    });
}());
