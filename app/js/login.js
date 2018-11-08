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
    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const btnLogin = document.getElementById('btnLogin');
    const btnLogout = document.getElementById('btnLogout');

    var initialLoad = true;

    // Add login event
    if (btnLogin != null) {
        btnLogin.addEventListener('click', e=> {
            // Get email and password
            const email = txtEmail.value;
            const pass = txtPassword.value;
            const auth = firebase.auth();

            initialLoad = false;

            // Logout an existing user
            if (firebase.auth().currentUser) {
                user.auth().signOut();
                swal({
                    text: "You have been logged out.",
                    icon: "success"
                });
                return;
            }

            // Sign in
            const promise = auth.signInWithEmailAndPassword(email, pass);
            promise.catch(e => swal(e.message));
        });
    }

    // Add logout event
    if (btnLogout != null) {
        btnLogout.addEventListener('click', e=> {
            initialLoad = false;
            const promise = firebase.auth().signOut();
            promise.catch(e => swal(e.message));

            swal({
                text: "You have been logged out.",
                icon: "error"
            });

        });
    }

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            if (!initialLoad) {
                txtEmail.value = "";
                txtPassword.value = "";
                console.log(user);
                //window.location.href = "/index";

                swal({
                    text: "You are now signed in!",
                    icon: "success"
                });
            }
            if (btnLogout != null) {
                btnLogout.classList.remove('hide');
            }
        }
        else {
            if (btnLogout != null && !btnLogout.classList.contains("hide") && !initialLoad) {
                btnLogout.classList.add('hide');
            }
        }
    });
}());
