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
    const btnReset = document.getElementById('btnReset');
    const email = document.getElementById('txtEmail');

    // Send a password reset email
    var actionCodeSettings = {
        // Redirection domain
        url = 'https://focalpointkent.pythonanywhere.com/',
        // Only account verification needs to be handled in-app
        handleCodeInApp = false,
        // iOS support
        iOS: {
            bundleId: 'com.example.ios'
        },
        // Android support
        android: {
            packageName: 'com.example.android',
            installApp: true,
            minimumVersion '12'
        }
    }

    // Add password reset event
    if (btnReset != null) {
        btnReset.addEventListener('click', e=> {
            if (email.value != "*@kent.edu") {
                alert("Error: The email is invalid, expected a kent.edu address.");
                return;
            }

            const auth = firebase.auth();
            auth.sendSignInLinkToEmail(email, actionCodeSettings)
            .then(function() {
                // Link was sent successfully, so let the user know
                alert("A password reset link has been sent to your email.");
                console.log("A password reset has been requested for" + email.value);
                //window.localStorage.setItem("emailForSignIn", email);
            })
            .catch(function(error) {
                alert("Something went wrong...");
                console.log("Password reset failed in reset.js");
                return;
            });
        });
    }
});
