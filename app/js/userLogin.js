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
    const btnLogin = document.getElementById('btnLogin');
    const btnLogout = document.getElementById('btnLogout');

    var initialLoad = true;

    // Add login event
    if (btnLogin != null)
    {
        btnLogin.addEventListener('click', e=> {
            // Get email and password
            const email = txtEmail.value;
            const pass = txtPassword.value;
            const auth = firebase.auth();

            initialLoad = false;

            // Sign in
            const promise = auth.signInWithEmailAndPassword(email, pass);
            promise.catch(e => alert(e.message));
        });
    }

    // Add logout event
    if (btnLogout != null)
    {
        btnLogout.addEventListener('click', e=> {
            initialLoad = false;

            const promise = firebase.auth().signOut();
            promise.catch(e => alert(e.message));
        });
    }


    firebase.auth().onAuthStateChanged(user => {
        if(user)
        {
            if (!initialLoad)
            {
                alert("You are now signed in!");
                txtEmail.value = "";
                txtPassword.value = "";
                console.log(user);
            }
            if (btnLogout != null)
            {
                btnLogout.classList.remove('hide');
            }
        }
        else
        {
            if (btnLogout != null && !btnLogout.classList.contains("hide"))
            {
                alert("You have been signed out.");
                btnLogout.classList.add('hide');
            }
        }
    });

}());