(function() {

    // Initialize Firebase
    var config = {
    apiKey: "AIzaSyCEuT1gco387t16C2IAmN2bx5bt-n6ea6s",
    authDomain: "focal-point-student-alumni-net.firebaseapp.com",
    databaseURL: "https://focal-point-student-alumni-net.firebaseio.com",
    projectId: "focal-point-student-alumni-net",
    storageBucket: "focal-point-student-alumni-net.appspot.com",
    messagingSenderId: "1002904582612"
    };
    firebase.initializeApp(config);

    // Get elements
    const txtFirstName = document.getElementById('txtLastName');
    const txtLastName = document.getElementById('txtLastName');
    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const txtPassword2 = document.getElementById('txtPassword2');
    const btnSignup = document.getElementById('btnSignup');
    const userType = $("#user_type_selection :selected").text()

    var initialLoad = true;

    // Add signup event
    if (btnSignup != null)
    {
        btnSignup.addEventListener('click', e=> {

            // Get email and password
            const email = txtEmail.value;
            const pass = txtPassword.value;
            const pass2 = txtPassword2.value;
            const auth = firebase.auth();
            initialLoad = false;

            // Logout any existing user
            if (firebase.auth().currentUser)
            {
                firebase.auth().signOut();
                alert("User already logged in. You have been logged out.");
            }

            // Verify passwords match
            if (pass != pass2)
            {
                alert("Error: The passwords do not match.");
                return;
            }

            // Register user
            const promise = auth.createUserWithEmailAndPassword(email, pass);
            promise.catch(e => alert(e.message));
        });
    }


    firebase.auth().onAuthStateChanged(user => {
        if(user && !initialLoad)
        {
            alert("Your account has been created! You are now logged in.");
            console.log(user);
            document.location.reload();
        }
    });

}());