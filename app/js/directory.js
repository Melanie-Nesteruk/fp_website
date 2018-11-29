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
	var interestFilter;
	var tempIsVerified;
	
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
	
	// Add filter event
	if (filterBtnDOM != null) {
		filterBtnDOM.addEventListener('click', e=> { 
			initialLoad = false;

			if (currentUser && tempIsVerified)
			{
				typeFilters = ["", "", ""];

				// Student filters
				if (!studentDOM.checked)
				{
					typeFilters[0] = "Student";
				}
				
				// Alumni filter
				if (!alumniDOM.checked)
				{
					typeFilters[1] = "Alumni";
				}
		
				// Faculty filter
				if (!facultyDOM.checked)
				{
					typeFilters[2] = "Faculty";
				}

				interestFilter = null;
				if (photoInterestsDOM.selectedIndex != 0)
				{
					interestFilter = photoInterestsDOM.options[photoInterestsDOM.selectedIndex].text;
				}

				document.getElementById("userList").innerHTML = "";
				db.collection('Users').get().then((snapshot) => {
					snapshot.docs.forEach(doc => {
						renderUser(doc, doc.get("userID"));
					})
				});
			}
			else
			{
				swal({
					text: "Error validating user authentication. Please reload the page.",
					icon: "error"
				});
			}
		});
	}

	// Add clear Filters event
	if (clearFiltersBtnDOM != null) {
		clearFiltersBtnDOM.addEventListener('click', e=> { 
			initialLoad = false;
			
			// Clear fields and refresh
			fNameDOM.value = "";
			lNameDOM.value = "";
			photoInterestsDOM.selectedIndex = "0";
			studentDOM.checked = true;
			alumniDOM.checked = true;
			facultyDOM.checked = true;
			typeFilters = ["", "", ""];
			interestFilter = null;

			if (currentUser && tempIsVerified)
			{
				document.getElementById("userList").innerHTML = "";
				db.collection('Users').get().then((snapshot) => {
					snapshot.docs.forEach(doc => {
						renderUser(doc, doc.get("userID"));
					})
				});
			}
			else
			{
				swal({
					text: "Error validating user authentication. Please reload the page.",
					icon: "error"
				});
			}
		});
	}

	function renderUser(doc, uID)
	{

		// Load current photo interests
        db.collection('Profiles').doc(uID).get()
        .then(function(querySnapshot){
            var doc2 = querySnapshot;
            var photoInterests = doc2.get("photo_interests");
			if (interestFilter && !photoInterests.includes(interestFilter))
			{
				return;
			}

			username = doc.get("email").split("@")[0];
			fName = doc.get("first_Name");
			lName = doc.get("last_Name");
			email = doc.get("email");
			userType = doc.get("userType");
			isVerified = doc.get("verified");
	
			//typeFilters = ["", "", ""];
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
			
			var ignore = false;
			
			typeFilters.every(function(doNotInclude, index) {
				if (userType == doNotInclude)
				{
					ignore = true;
					return false;
				}
				else
				return true;
			});
			
			// Verified check
			if (!isVerified)
			{
				return;
			}
	
			if (ignore)
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
        })
        .catch(function(error){
            console.log("Error getting existing user photo interests: ", error);
        });
	}

    firebase.auth().onAuthStateChanged(user => {
        if (user)
        {
			currentUser = firebase.auth().currentUser;

			db.collection('Users').doc(currentUser.uid).get()
                .then(function(querySnapshot){
					var doc = querySnapshot;
					var tempIsVerified = doc.get("verified");
					if(tempIsVerified)
					{
						// Pulls all docs from 'Users' collection in firebase and lists them
						db.collection('Users').get().then((snapshot) => {
							snapshot.docs.forEach(doc => {
								renderUser(doc, doc.get("userID"));
							})
						});
					}
                    else
                    {
                        // Not verified; do not show any user data.
                    }
                })
                .catch(function(error){
                    console.log("Error getting current user's verified status: ", error);
                });
        }
        else
        {
            // User is not logged in and shouldn't be able to see any members.
        }
    });
}());
