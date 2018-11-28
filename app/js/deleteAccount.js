(function() {
    // Database config
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
        //console.log(app);
    }

    // Fetch an instance of the DB
    const db = firebase.firestore(app);
    //console.log(db);
    //console.log(firebase.app().name);

    // Disable deprecated features
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    // Get elements/user input
    const btnDelAcct = document.getElementById('btnDelAcct');

    // Add password reset event
    if (btnDelAcct != null) {
        btnDelAcct.addEventListener('click', e=> {
            swal({
                title: 'Delete Account',
                text: 'This cannot be undone!',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Delete Account',
                input: 'password',
                inputPlaceholder: 'Confirm your password',
                inputAttributes: {
                    autocapitalize: 'off',
                    autocorrect: 'off'
                }
            }).then(function(inputPassword) {
                var rawPassword = inputPassword.value;
                if (rawPassword === false) return false;
                if (rawPassword === "") {
                    swal.showInputError('Please enter your password.');
                }

                var toDeleteUser = firebase.auth().currentUser;
                if (!toDeleteUser)
                {
                    swal({
                        title: 'Please sign in to delete your account.',
                        type: 'error',
                        confirmButtonText: 'Continue'
                    }).then((value) => {
                        window.location.href = "/login";
                    });
                    return;
                }

                var toDeleteUserID = toDeleteUser.uid;

                const credential = firebase.auth.EmailAuthProvider.credential(
                    toDeleteUser.email,
                    rawPassword
                );

                toDeleteUser.reauthenticateWithCredential(credential).then(() => {
                    db.collection("Profiles").doc(toDeleteUserID).delete().then(function() {
                        db.collection("Users").doc(toDeleteUserID).delete().then(function() {
                            toDeleteUser.delete().then(function() {
                                swal({
                                    title: 'Your account has been deleted.',
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: 'Continue'
                                }).then((value) => {
                                    window.location.href = "/login";
                                    return;
                                });
                            });
                        });
                    });
                });
            });
            return;
        });
    }
}());
