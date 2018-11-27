(function() {
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
        console.log("initializeApp in loadProfile.js");
    }

    // var admin = require("firebase-admin");

    // var serviceAccount = require("path/to/serviceAccountKey.json");

    // admin.initializeApp({
    // credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://focal-point-student-alumni-net.firebaseio.com"
    // });

    // Fetch an instance of the DB
    const db = firebase.firestore(app);

    // Disable deprecated features
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    var initialLoad = true;
    var currentUser;

    var inputUsersID = "";
    var fName = "";
    var lName = "";
	var userType = 0;
	var isVerified = false;
	var typeFilters = ["", "", ""];

	function renderUser(doc)
	{
        username = doc.get("email").split("@")[0];
        uid = doc.get("userID");
		fName = doc.get("first_Name");
		lName = doc.get("last_Name");
		email = doc.get("email");
        isAdmin = doc.get("admin");
        isVerified = doc.get("verified");
        markedForDeletion = doc.get("to_delete");

        if (isAdmin)
        {
            return;
        }
        
        fullName = fName + " " + lName;

		node = document.createElement("div");
        node.classList.add("divTableRow");
        node.id = uid;
		node.setAttribute("style", "pointer-events: auto;")

		var cellNode1 = document.createElement("div");
		cellNode1.classList.add("divTableCell");
		cellNode1.setAttribute("style", "font-weight: bold; width: 20%; text-align: left;")
		cellNode1.innerHTML = fullName;
		
		var cellNode2 = document.createElement("div");
		cellNode2.classList.add("divTableCell");
		cellNode2.setAttribute("style", "width: 20%; text-align: left;")
		cellNode2.innerHTML = email;
        
        var cellNode3 = document.createElement("a");
        cellNode3.classList.add("divTableCell");
        cellNode3.id = fullName;
        cellNode3.setAttribute("style", "width: 20%; text-align: right;")
        
        if (!isVerified)
        {
            cellNode3.href = "javascript:void(0);";
            cellNode3.innerHTML = "Verify User";
            cellNode3.onclick = function() {
                nameToVerify = this.id;
                uidToVerify = this.parentNode.id;

                swal({
                    title: "Are you sure you want to verify " + nameToVerify + "?",
                    text:  "Click anywhere else to cancel.",
                    showCancelButton: true,
                    cancelButtonText: 'Cancel',
                    confirmButtonText: 'Verify Account',
                })
                .then((value) => {
                    console.log(value);
                    if (value == 1) {
                        db.collection("Users").doc(uidToVerify).update({
                            verified: true,
                            verified_by: currentUser.uid
                        })
                        .then(function(){
                            swal({
                                title: nameToVerify + " has been successfully verified!",
                                icon: "success",
                                text:  "Click Ok to continue.",
                                closeOnClickOutside: false,
                                closeOnEsc: false,
                                buttons: {
                                    cancel: {
                                        text: "Ok",
                                        value: 1,
                                        visible: true,
                                        closeModal: true,
                                    }
                                }
                            })
                            .then(value => {
                                console.log("User successfully verified!");
                                window.location.reload();
                            });
                        })
                        .catch(function(error){
                            console.error("Error verifying user: ", error);
                        });
                    }
                });
            }
        }

		var cellNode4 = document.createElement("a");
		cellNode4.classList.add("divTableCell");
		cellNode4.setAttribute("style", "width: 20%; text-align: right;")
		cellNode4.href = "/profile?user=" + username;
        cellNode4.innerHTML = "View Profile";
        
        if (markedForDeletion)
        {
            var cellNode5 = document.createElement("div");
            cellNode5.classList.add("divTableCell");
            cellNode5.setAttribute("style", "font-weight: bold; color: red; width: 20%; text-align: right;")
            cellNode5.innerHTML = "Awaiting Deletion";
        }
        else
        {
            var cellNode5 = document.createElement("a");
            cellNode5.classList.add("divTableCell");
            cellNode5.id = fullName;
            cellNode5.setAttribute("style", "width: 20%; text-align: right;")
            cellNode5.href = "javascript:void(0);";
            cellNode5.innerHTML = "Delete Account";
            cellNode5.onclick = function () {
                nameToDelete = this.id;
                uidToDelete = this.parentNode.id;
                swal({
                    title: "Are you sure you want to delete " + nameToDelete + "?",
                    text:  "Click anywhere else to cancel.",
                    buttons: {
                        cancel: {
                            closeModal: true,
                            value:      0
                        },
                        confirm: {
                            text:       "Delete",
                            closeModal: true,
                            value:      1
                        }
                    }
                })
                .then(value => {
                    if (value) {
                        db.collection("Users").doc(uidToDelete).update({
                            to_delete: true
                        }).then(function() {
                            swal({
                                title: nameToDelete + "'s account has been marked for deletion.",
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
                                console.log("User successfully marked for deletion!");
                                window.location.reload();
                            });
                        });
                        return;
                    }
                });
            }
        }

		node.appendChild(cellNode1);
		node.appendChild(cellNode2);
        node.appendChild(cellNode3);
        node.appendChild(cellNode4);
        node.appendChild(cellNode5);
		document.getElementById("userList").appendChild(node);
	}

    firebase.auth().onAuthStateChanged(user => {
        if (user)
        {
			currentUser = firebase.auth().currentUser;

            db.collection('Users').doc(currentUser.uid).get()
                .then(function(querySnapshot){
                    var doc = querySnapshot;
                    if (doc.get("admin"))
                    {
                        // Pulls all docs from 'Users' collection in firebase and lists them
                        db.collection('Users').get().then((snapshot) => {
                            snapshot.docs.forEach(doc => {
                                renderUser(doc);
                            })
                        });
                    }
                    else
                    {
                        // Popup that says you don't have admin privileges
                        swal({
                            text: "Error validating admin privileges. Please reload the page.",
                            icon: "error"
                        });
                    }
                })
                .catch(function(error){
                    console.log("Error getting \"admin\" user field for Manage Users page: ", error);
                });
        }
        else
        {
            // User is not logged in and shouldn't be able to see any members.
            console.log("User is not logged in.");
        }
    });
}());
