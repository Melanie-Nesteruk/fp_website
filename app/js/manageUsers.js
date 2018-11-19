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
        //console.log(app);
    }

    // Fetch an instance of the DB
    const db = firebase.firestore(app);
    //console.log(db);

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
	
	// filter settings
	var fNameDOM = document.getElementById("FirstName");
	var lNameDOM = document.getElementById("LastName");
	var photoInterestsDOM = document.getElementById("photoInterests");
	var studentDOM = document.getElementById("studentChkBox");
	var alumniDOM = document.getElementById("alumniChkBox");
	var facultyDOM = document.getElementById("facultyChkBox");
	var filterBtnDOM = document.getElementById("filterBtn");
	var clearFiltersBtnDOM = document.getElementById("clearFiltersBtn");

    function SetUserType()
    {
        switch (userType)
        {
            case 1:
            userType = "Student";
            break;
            case 2:
            userType = "Alumni";
            break;
            case 3:
            userType = "Faculty";
            break;
            default:
            userType = "None";
            break;
        }
    };

	function renderUser(doc)
	{
        username = doc.get("email").split("@")[0];
        uid = doc.get("userID");
		fName = doc.get("first_Name");
		lName = doc.get("last_Name");
		email = doc.get("email");
        userType = doc.get("userType");
        isAdmin = doc.get("admin");
		isVerified = doc.get("verified");

		//typeFilters = ["", "", ""];
		fullName = fName + " " + lName;
		SetUserType();

		var ignore = false;

        if (isAdmin)
        {
            return;
        }

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
                swal({
                    title: "Are you sure you want to verify " + this.id + "?",
                    text:  "Click anywhere else to cancel.",
                    buttons: {
                        cancel: {
                            closeModal: true,
                            value:      0
                        },
                        confirm: {
                            text:       "Confirm",
                            closeModal: true,
                            value:      1
                        }
                    }
                })
                .then(value => {
                    if (value == 1) {
                        var uidToVerify = this.parentNode.id;
                        db.collection("Users").doc(uidToVerify).set({   // Need to confirm that 'currentUID' is properly converted to a string
                            verified: true,
                            verified_by: currentUser.uid
                        })
                        .then(function(){
                            swal({
                                title: this.id + " has been successfully verified!",
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
                                console.log("Users successfully verified!");
                                window.location("/manage-users");
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
        
        var cellNode5 = document.createElement("a");
		cellNode5.classList.add("divTableCell");
		cellNode5.setAttribute("style", "width: 20%; text-align: right;")
		cellNode5.href = "/profile?user=" + username;
		cellNode5.innerHTML = "Delete Account";

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
