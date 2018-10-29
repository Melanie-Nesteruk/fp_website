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

    // Get elements/user input
    const btnSignup = document.getElementById('btnSignup');
    const userSelect = document.getElementById("user_type_selection");

    const firstName = document.getElementById('txtFirstName');
    const lastName = document.getElementById('txtLastName');
    const email = document.getElementById('txtEmail');
    const password = document.getElementById('txtPassword');
    const password2 = document.getElementById('txtPassword2');
    const userType = userSelect.options[userSelect.selectedIndex].text;

    var initialLoad = true;

    // Add signup event
    if (btnSignup != null)
    {
        btnSignup.addEventListener('click', e=> {

            const auth = firebase.auth();
            initialLoad = false;

            // Logout an existing user
            if (firebase.auth().currentUser)
            {
                firebase.auth().signOut();
                alert("User already logged in. You have been logged out.");
            }

            // Verify name is given
            if (firstName.value == "" || lastName.value == "")
            {
                alert("Please enter your full name.");
                return;
            }

            // Verify passwords match
            if (password.value != password2.value)
            {
                alert("Error: The passwords do not match.");
                return;
            }

            // Register user (not successful until onAuthStateChanged is called)
            const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
            promise.catch(e => alert(e.message));
        });
    }

    function AddUserToDB()
    {
        // User input: firstName, lastName, email, userType
        // Create pre-verified database input for current input fields



        
    }

    firebase.auth().onAuthStateChanged(user => {
        if(user && !initialLoad)
        {
            // Successful account creation
            alert("Your account has been created! You are now logged in.");
            AddUserToDB();
            console.log(user);

            // Reload page to clear fields
            document.location.reload();
        }
    });

}());