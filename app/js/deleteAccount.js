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
                title: "Delete Account",
                text: "This cannot be undone!",
                showCancelButton: true,
                closeOnConfirm: false,
                inputPlaceholder: "Confirm your password"
            },
            function(inputValue) {
                if (inputValue === false)
                    return false
                if (inputValue === "") {
                    swal.showInputError("Please type in your password");
                    return false
                }

                var toDeleteUser = firebase.auth().currentUser;
                var toDeleteUserID = toDeleteUser.uid;
                db.collection("Profiles").doc(toDeleteUserID).delete().then(function(){
                    db.collection("Users").doc(toDeleteUserID).delete().then(function(){
                        toDeleteUser.delete().then(function() {
                            swal({
                                title: "Your account has been deleted.",
                                icon: "success",
                                buttons: {
                                    confirm: {
                                        text: "Continue",
                                        closeModal: true,
                                        value:      1
                                    }
                                }
                            })
                            .then(value => {
                                window.location.href = "/login";
                                return;
                            });
                        });
                    });
                });
                return;
            }
        });
    });
            
    // Add password reset event
 //   if (btnDelAcct != null) {
 //       btnDelAcct.addEventListener('click', e=> {
 //           swal({
 //               title: "Are you sure?",
 //               text:  "Click anywhere else to cancel.",
 //               buttons: {
 //                   cancel: {
 //                       closeModal: true,
 //                       value:      0
 //                   },
 //                   confirm: {
 //                       text:       "Delete",
 //                       closeModal: true,
 //                       value:      1
 //                   }
 //               }
 //           })
 //           .then(value => {
 //               if (value == 1) {
 //               }
 //           });
 //           return;
 //       });
 //   }
}());
