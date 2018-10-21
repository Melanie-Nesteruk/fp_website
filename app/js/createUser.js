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
    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const btnSignup = document.getElementById('btnSignup');

    var initialLoad = true;

    // Add signup event
    if (btnSignup != null)
    {
        btnSignup.addEventListener('click', e=> {

            // Get email and password
            const email = txtEmail.value;
            const pass = txtPassword.value;
            const auth = firebase.auth();
            initialLoad = false;

            // Logout any existing user
            if (firebase.auth().currentUser)
            {
                firebase.auth().signOut();
                alert("You have been logged out.");
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
        }
    });

}());