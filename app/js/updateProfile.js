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
    }

    // Fetch an instance of the DB
    const db = firebase.firestore(app);
    //console.log(db);

    // Disable deprecated features
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    // Get elements/user input
    const btnSaveDOM = document.getElementById('btnSaveChanges');

    const majorDOM = document.getElementById('major');
    const minorDOM = document.getElementById('minor');
    const graduationDOM = document.getElementById('graduation');
    const websiteDOM = document.getElementById('website');
    const facebookDOM = document.getElementById('facebook');
    const instagramDOM = document.getElementById('instagram');
    const twitterDOM = document.getElementById('twitter');
    const bioDOM = document.getElementById('bio');

    var initialLoad = true;

    // Add signup event
    if (btnSaveDOM != null) {
        btnSignupDOM.addEventListener('click', e=> { 
            initialLoad = false;

            swal({
                text: "Your profile has been saved.",
                icon: "success"
            });
        });
    }

    firebase.auth().onAuthStateChanged(user => {
        if(user && !initialLoad) {

        }
    });
}());
