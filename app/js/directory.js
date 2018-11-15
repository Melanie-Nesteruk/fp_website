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
	
	// filter settings
	var fNameDOM = getElementById("FirstName");
	var lNameDOM = getElementById("LastName");
	var photoInterestsDOM = getElementById("photoInterests");
	var studentDOM = getElementById("studentChkBox");
	var alumniDOM = getElementById("alumniChkBox");
	var facultyDOM = getElementById("facultyChkBox");
	var filterBtnDOM = getElementById("filterBtn");
 
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
	
	    // Add signup event
		if (filterBtnDOM != null) {
			filterBtnDOM.addEventListener('click', e=> { 
				initialLoad = false;
	
				if (currentUser)
				{
					db.collection('Users').get().then((snapshot) => {
						snapshot.docs.forEach(doc => {
							renderUser(doc);
						})
						swal({
							text: "The directory has been filtered!",
							icon: "success"
						});
					});
				}
				else
				{
					swal({
						text: "Error validating user authentication. Please reload the page.",
						icon: "failure"
					});
				}
			});
		}

	function renderUser(doc)
	{
		username = doc.get("email").split("@")[0];
		fName = doc.get("first_Name");
		lName = doc.get("last_Name");
		email = doc.get("email");
		userType = doc.get("userType");
		isVerified = doc.get("verified");

		fullName = fName + " " + lName;
		SetUserType();

		// First name filter
		if (fNameDOM.value && fName != fNameDOM.value)
		{
			return;
		}

		// Last name filter
		if (lNameDOM.value && lName != lNameDOM.value)
		{
			return;
		}

		// Photo interests filter
		// if (lNameDOM.value && lName != lNameDOM.value)
		// {
		// 	return;
		// }

		// Student filter
		if (studentDOM.checked && userType != "Student")
		{
			return;
		}
		
		// Alumni filter
		if (alumniDOM.checked && userType != "Alumni")
		{
			return;
		}

		// Faculty filter
		if (facultyDOM.checked && userType != "Faculty")
		{
			return;
		}

		// Verified check
		if (!isVerified)
		{
			return;
		}

		node = document.createElement("div");
		node.classList.add("divTableRow");
		node.setAttribute("style", "pointer-events: auto;")

		var cellNode1 = document.createElement("div");
		cellNode1.classList.add("divTableCell");
		cellNode1.setAttribute("style", "font-weight: bold; width: 30%; text-align: left;")
		cellNode1.innerHTML = fullName;
		
		var cellNode2 = document.createElement("div");
		cellNode2.classList.add("divTableCell");
		cellNode2.setAttribute("style", "width: 30%; text-align: left;")
		cellNode2.innerHTML = email;
		
		var cellNode3 = document.createElement("a");
		cellNode3.classList.add("divTableCell");
		cellNode3.setAttribute("style", "width: 30%; text-align: right;")
		cellNode3.href = "/profile?user=" + username;
		cellNode3.innerHTML = "View Profile";

		node.appendChild(cellNode1);
		node.appendChild(cellNode2);
		node.appendChild(cellNode3);
		document.getElementById("userList").appendChild(node);
	}

    firebase.auth().onAuthStateChanged(user => {
        if (user)
        {
			currentUser = firebase.auth().currentUser;

            // Pulls all docs from 'Users' collection in firebase and lists them
			db.collection('Users').get().then((snapshot) => {
				snapshot.docs.forEach(doc => {
					renderUser(doc);
				})
			});
        }
        else
        {
            // User is not logged in and shouldn't be able to see any members.
        }
    });
}());
