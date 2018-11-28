(function() {
    // Initialize Firebase
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
    }       
    
    // Get elements
    const txtOldPassword = document.getElementById('txtOldPassword');
    const txtPassword = document.getElementById('txtPassword');
    const txtPassword2 = document.getElementById('txtPassword2');
    const btnConfirmPwd = document.getElementById('btnConfirmPwd');

    var initialLoad = true;

    // Button listener
    if (btnConfirmPwd != null) {
        btnConfirmPwd.addEventListener('click', e=> {
            // Get email and password
            const oldPass = txtOldPassword.value;
            const newPass = txtPassword.value;
            const newPass2 = txtPassword2.value;

            initialLoad = false;

            var user = firebase.auth().currentUser;
            
            // Verify old password
            user.reauthenticateAndRetrieveDataWithCredential(oldPass).then(function() {

                // User re-authenticated, continue to change password.

                if (newPass != newPass2)
                {
                    swal({
                        title: 'The new password fields do not match!',
                        type: 'error',
                        confirmButtonText: 'Continue'
                    }).then((value) => {
                        return;
                    });
                }

                user.updatePassword(newPass).then(function() {
                    // Update successful.
                    swal({
                        title: 'Your password has been changed!',
                        type: 'success',
                        confirmButtonText: 'Continue'
                    }).then((value) => {
                        window.location.reload();
                    });
                }).catch(function(error) {
                    // An error happened.
                    Console.log("Error changing password.");
                });

            }).catch(function(error) {
                // An error happened.
                swal({
                    title: 'The old password you provided is invalid.',
                    text: 'Please correct this and try again.',
                    type: 'error',
                    confirmButtonText: 'Continue'
                });
                Console.log("Error authenticating old password.");
            });
        });
    }

    firebase.auth().onAuthStateChanged(user => {
        // Nothing right now
    });
}());
