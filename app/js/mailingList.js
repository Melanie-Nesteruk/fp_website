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
    const fNameDOM = document.getElementById('txtFirstName');
    const lNameDOM = document.getElementById('txtLastName');
    const emailDOM = document.getElementById('txtEmail');

    var fName, lName, email;

    // Add signup event
    if (btnSignup != null) {
        btnSignup.addEventListener('click', e=> { 

            
            // Verify name is given
            if (fNameDOM.value == "" || lNameDOM.value == "") {
                swal({
                    text: "Please enter your full name.",
                    icon: "error"
                });
                return;
            }
            
            // Verify email is given
            if (emailDOM.value == "") {
                swal({
                    text: "Please enter your email.",
                    icon: "error"
                });
                return;
            }

            fName = fNameDOM.value;
            lName = lNameDOM.value;
            email = emailDOM.value;

            AddToMailingList();
        });
    }

    function AddToMailingList(){
        console.log('Adding email to Mailing List');

        // Create new document in 'Users' collection
        db.collection("Mailing List").doc(email).set({   
            first_Name: fName,
            last_Name: lName,
            email: email,
            date_subscribed: firebase.firestore.Timestamp.now()
        })
        .then(function(){
            console.log("Mailing List documents successfully written!");
            swal({
                title: "You have been added to the mailing list!",
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
        })
        .catch(function(error){
            console.error("Error writing document: ", error);
        });
    };
}());
