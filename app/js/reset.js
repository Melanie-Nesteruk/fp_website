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
			
	    firebase.initializeApp(config);
	    console.log("initializeApp in registerUser.js");
    }

    // Fetch an instance of the DB
    var db = firebase.firestore(app);

    // Disable deprecated features
    db.settings({
        timestampsInSnapshots: true
    });

    // Get elements/user input
    const btnReset = document.getElementById('btnReset');
    const email = document.getElementById('txtEmail');

    var initialLoad = true;

    //
    // TODO: Add the real password reset features
    //

    });
});
