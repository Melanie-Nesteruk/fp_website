(function() {
    // Database config
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
        console.log("initializeApp in reset.js");
        console.log(app);
    }

    // Fetch an instance of the DB
    const db = firebase.firestore(app);
    console.log(db);
    console.log(firebase.app().name);

    // Disable deprecated features
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    // Get elements/user input
    const btnDelAcct = document.getElementById('btnDelAcct');

    // Add password reset event
    if (btnDelAcct != null) {
        btnDelAcct.addEventListener('click', e=> {
            swal({
                title: "To delete your account, enter your password.",
                buttons: {
                    cancel: {
                        text:       "Nevermind",
                        closeModal: true,
                        value:      0
                    },
                    confirm: {
                        text:       "Delete",
                        closeModal: true,
                        value:      1
                    }
                }
            })
            .then(value => {
                if (value == 0) {
                    // testing
                    swal({
                        text: "Account Deletion Cancelled",
                        icon: "error"
                    });
                    return;
                }
                else if (value == 1) {
                    // testing
                    swal({
                        text: "Account Deletion Successful",
                        icon: "success"
                    });
                    return;
                }
            });
            return;
        });
    }
}());
