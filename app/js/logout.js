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
        if (!initialLoad)
        {
            alert("You have been signed out.");
            $.post("receiver", false, function(){

            });
        }
    });

}());