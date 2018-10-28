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

    var initialLoad = true;

    const linkLogout = document.getElementById('logout');
    linkLogout.onclick = logout;

    function logout(){
        initialLoad = false;

        const promise = firebase.auth().signOut();
        promise.catch(e => alert(e.message));
    }


    firebase.auth().onAuthStateChanged(user => {
        if (!initialLoad)
        {
            alert("You have been signed out.");
            $.post("jsLogout", function(){

            });
            window.location.href = "/login";
        }
    });

}());