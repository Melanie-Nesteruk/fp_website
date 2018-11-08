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
    const txtEmail = document.getElementById('txtEmail');
    const btnReset = document.getElementById('btnReset');

    // Add password reset event
    if (btnReset != null) {
        btnReset.addEventListener('click', e=> {
            const email = txtEmail.value;
            // Regex to find "@kent.edu"
            if (/@kent.edu\s*$/.test(email) == false) {
                swal({
                    text: "The email is invalid, expected a kent.edu address.",
                    icon: "error"
                });
                return;
            }

            const auth = firebase.auth();
            auth.sendPasswordResetEmail(email).then(function() {
                // Send the link and inform the user
                console.log("A password reset has been requested for " + email);
                window.location.href = "/login";
                swal({
                    text: "The link to reset your password has been sent to your email.",
                    icon: "success"
                });
            }).catch(function(error) {
                swal({
                    text: "Something went wrong...",
                    icon: "error"
                });
                console.log("Password reset failed in reset.js");
                return;
            });
        });
    }
}());
