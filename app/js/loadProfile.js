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

    // Get page elements to alter
    const fieldParentDOM = document.getElementById('fieldParent');
    const fullNameDOM = document.getElementById('name');
    const userTypeDOM = document.getElementById('userType');
    const facultyDIVDOM = document.getElementById('facultyDIV');
    const facultyDOM = document.getElementById('facultyPos');
    const majorDIVDOM = document.getElementById('majorDIV');
    const majorDOM = document.getElementById('major');
    const minorDIVDOM = document.getElementById('minorDIV');
    const minorDOM = document.getElementById('minor');
    const graduationDIVDOM = document.getElementById('graduationDIV');
    const graduationDOM = document.getElementById('graduation');
    const emailDOM = document.getElementById('email');
    const websiteDOM = document.getElementById('website');
    const facebookDOM = document.getElementById('facebook');
    const instagramDOM = document.getElementById('instagram');
    const twitterDOM = document.getElementById('twitter');
    const bioDOM = document.getElementById('bio');
    const btnMessage = document.getElementById('btnMessage');
    const interestsDIVDOM = document.getElementById('interestsDIV');
    var editDOM = document.getElementById('editor');

    var initialLoad = true;
    var currentUser = firebase.auth().currentUser;
    var inputUser = document.currentScript.getAttribute('inputUser');
    var editMode = document.currentScript.getAttribute('editmode');

    // Used by queries in onAuthStateChange()
    var inputUsersID = "";
    var fName = "";
    var lName = "";
    var userType = 0;
    var facultyPos = "";
    var major = "";
    var minor = "";
    var gradYear = "";
    var email = "";
    var website = "";
    var bio = "";
    var facebookName = "";
    var instagramName = "";
    var twitterName = "";
    var isVerified = false;
 
    function LoadProfile(isVerified, UID)
    {
        console.log("Inside loadProfile()");

        if (isVerified)
        {
            // Get additional fields & allow editing of fields (if current user's profile)
        }

        SetBasicFields();

        if (userType == "Faculty")
        {
            fieldParentDOM.removeChild(majorDIVDOM);
            fieldParentDOM.removeChild(minorDIVDOM);
            fieldParentDOM.removeChild(graduationDIVDOM);
        }
        else
        {
            fieldParentDOM.removeChild(facultyDIVDOM);
        }

        SetAdditionalFields(UID);
        LoadInterests(UID);
    };
    
    function SetBasicFields()
    {
        fullNameDOM.innerHTML = fName + " " + lName;

        db.collection("Users").doc(currentUser.uid).collection("Blocks").where("email_blocked", "==", String(inputUser + "@kent.edu"))
            .get()
                .then(function(querySnapshot){
                    if(querySnapshot.empty){// Should be true if there are no documents with the blocked UID (User is not blocked),
                        emailDOM.innerHTML = email;
                    }
                    else{
                        emailDOM.innerHTML = "Unblock to view content";
                    }
                })                              // Otherwise (empty) should be false (User is blocked)
                .catch(function(error){
                    console.log("Error getting document ID: ", error);
                });
        

        SetUserType(userType);
    };

    function SetUserType(type)
    {
        switch (type)
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

        userTypeDOM.innerHTML = userType;
    };

    function GetAdditionalFields(userID)
    {
        db.collection('Profiles').doc(userID).get()
        .then(function(querySnapshot){
            var doc = querySnapshot;
                facultyPos = String(doc.get("faculty_position"));
                major = String(doc.get("major"));
                minor = String(doc.get("minor"));
                gradYear = String(doc.get("graduation_year"));
                website = String(doc.get("website"));
                bio = String(doc.get("bio"));
                facebookName = String(doc.get("facebook"));
                instagramName = String(doc.get("instagram"));
                twitterName = String(doc.get("twitter"));

                LoadProfile(isVerified, userID);
        })
        .catch(function(error){
            console.log("Error getting document ID: ", error);
        });
    };

    function SetAdditionalFields(currentProfileID)
    {

        if (editMode)
        {
            if (userType == "Faculty")
            {
                facultyDOM.value = facultyPos;
            }
            else
            {
                majorDOM.value = major;
                minorDOM.value = minor;
                graduationDOM.value = gradYear;
            }

            websiteDOM.value = website;
            websiteDOM.value = website;
            bioDOM.value = bio;
            facebookDOM.value = facebookName;
            instagramDOM.value = instagramName;
            twitterDOM.value = twitterName;
        }
        else
        {
            db.collection("Users").doc(currentUser.uid).collection("Blocks").where("uid_blocked", "==", currentProfileID)
            .get()
                .then(function(querySnapshot){
                    // Should be true if there are no documents with the blocked UID (User is not blocked)
                    // Then display the whole profile
                    if(querySnapshot.empty){ 
                        if (userType == "Faculty")
                        {
                            facultyDOM.innerHTML = facultyPos;
                        }
                        else
                        {
                            majorDOM.innerHTML = major;
                            minorDOM.innerHTML = minor;
                            graduationDOM.innerHTML = gradYear;
                        }
                        websiteDOM.innerHTML = website;
                        websiteDOM.href = "http://" + website;
                        bioDOM.innerHTML = bio;
                        facebookDOM.href = "https://www.facebook.com/" + facebookName;
                        instagramDOM.href = "https://www.instagram.com/" + instagramName;
                        twitterDOM.href = "https://www.twitter.com/" + twitterName;
                    }
                    // Otherwise (empty) should be false (User is blocked)
                    // Display a limited (blocked) profile
                    else{
                        if (userType == "Faculty")
                        {
                            facultyDOM.innerHTML = "Unblock to access content";
                        }
                        else
                        {
                            majorDOM.innerHTML = "Unblock to access content";
                            minorDOM.innerHTML = "Unblock to access content";
                            graduationDOM.innerHTML = "Unblock to access content";
                        }
                        websiteDOM.innerHTML = "Unblock to access content";
                        websiteDOM.href = "Unblock to access content";
                        bioDOM.innerHTML = "Unblock to view content";
                        facebookDOM.href = "Unblock to access Facebook";
                        instagramDOM.href = "Unblock to access Instagram"
                        twitterDOM.href = "Unblock to access Twitter";
                    } 
                })                              
                .catch(function(error){
                    console.log("Error getting document ID: ", error);
                });
        }
    };
	
	function openMessengerWith(value1, value2){
        var friend_id = String(value2);
		var current_id = String(value1);
		var found=false;
		var sessionID = '';
		if (friend_id != current_id){
			db.collection("Chat-Groups").where("user_1", "==", friend_id).where("user_2", "==", current_id)
				.get().then(function(results) {
				if (results.empty) {
					sessionID='';
				} else {
					console.log("Opening messenger with: ", inputUser);
					var doc = results.docs[0];
					sessionID = String(doc.id);
					var messengerURL = 'https://focalpointkent.pythonanywhere.com/messenger?sid=' + sessionID;
					window.open(messengerURL, '_blank', 'height=500,width=400,top=100,left=100');
				}
			})
			.then(function(){
				if(sessionID == ''){
					db.collection("Chat-Groups").where("user_1", "==", current_id).where("user_2", "==", friend_id)
						.get().then(function(results) {
							if (results.empty) {
								db.collection("Chat-Groups").add({
									user_1: current_id,
									user_2: friend_id
								}).then(function(){
									db.collection("Chat-Groups").where("user_2", "==", friend_id).where("user_1", "==", current_id)
										.get()
										.then(function(querySnapshot){
											var doc = querySnapshot.docs[0];
											sessionID = String(doc.id);
											found = true;
											db.collection("Chat-Groups").doc(sessionID).collection("Messages").add({
												messages_approved: "true"
											})
											console.log("Messages collection successfully written!");
											var messengerURL = 'https://focalpointkent.pythonanywhere.com/messenger?sid=' + sessionID;
											window.open(messengerURL, '_blank', 'height=500,width=400,top=100,left=100');
										})
										.catch(function(error){
											console.log("Error getting document ID: ", error);
										});
								}).catch(function(error){
									console.error("Error writing collection: ", error);
								});
							} else {
								var doc = results.docs[0];
								sessionID = String(doc.id);
								console.log('2nd. SESSION ID: ', sessionID);
								var messengerURL = 'https://focalpointkent.pythonanywhere.com/messenger?sid=' + sessionID;
								window.open(messengerURL, '_blank', 'height=500,width=400,top=100,left=100');
							}
						})
				}
			});
		}
    };

    function LoadInterests(uID)
    {   
        // Load current photo interests
        db.collection('Profiles').doc(uID).get()
        .then(function(querySnapshot){
            var doc = querySnapshot;
            var interests = doc.get("photo_interests");
    
            // Add HTML elements
            interests.forEach(element => {
                node = document.createElement("button");
                node.classList.add("btn");
                node.classList.add("btnInterest");
                node.setAttribute("type", "submit");
                node.setAttribute("tabindex", "-1");
                node.id = element;
                node.innerHTML = element;
                node.addEventListener('click', e=> {
                    db.collection('Profiles').doc(currentUser.uid).get()
                    .then(function(querySnapshot){
                        var doc = querySnapshot;
                        interests = doc.get("photo_interests");
                        var indexToRemove = interests.indexOf(e.target.id);
                        interests.splice(indexToRemove, 1);
                        db.collection("Profiles").doc(currentUser.uid).update({
                            photo_interests: interests
                        })
                        .then(function(){
                            interestsDIVDOM.removeChild(document.getElementById(e.target.id));
                            if (interests.length == 0)
                            {
                            AddNewInterest("None", true); 
                            }
                        })
                        .catch(function(error){
                            console.error("Error removing photo interest: ", error);
                        });
                    });
                });
                interestsDIVDOM.appendChild(node);
            });
    
        })
        .catch(function(error){
            console.log("Error getting existing user photo interests: ", error);
        });
    };

    function AddNewInterest(toAdd, safeGuard)
    {
        // Get current interests from DB
        db.collection('Profiles').doc(currentUser.uid).get()
        .then(function(querySnapshot){
            var doc = querySnapshot;
            var interests = doc.get("photo_interests");

            // Already exists in interests, ignore it.
            if (interests.includes(newInterest) || interestListDOM.selectedIndex == 0 && !safeGuard)
            {
                interestListDOM.selectedIndex = 0;
                return;
            }
            // Push it
            else
            {
                interests.push(toAdd);
                db.collection("Profiles").doc(currentUser.uid).update({
                    photo_interests: interests
                })
                .then(function(){
                    node = document.createElement("button");
                    node.classList.add("btn");
                    node.classList.add("btnInterest");
                    node.setAttribute("type", "submit");
                    node.setAttribute("tabindex", "-1");
                    node.id = toAdd;
                    node.innerHTML = toAdd;
                    node.addEventListener('click', e=> {
                        db.collection('Profiles').doc(currentUser.uid).get()
                        .then(function(querySnapshot){
                            var doc = querySnapshot;
                            interests = doc.get("photo_interests");
                            var indexToRemove = interests.indexOf(e.target.id);
                            interests.splice(indexToRemove, 1);
                            db.collection("Profiles").doc(currentUser.uid).update({
                                photo_interests: interests
                            })
                            .then(function(){
                                interestsDIVDOM.removeChild(document.getElementById(e.target.id));
                                if (interests.length == 0)
                                {
                                AddNewInterest("None", true); 
                                }
                            })
                            .catch(function(error){
                                console.error("Error removing photo interest: ", error);
                            });
                        });
                    });
                    interestsDIVDOM.appendChild(node);
                    interestListDOM.selectedIndex = 0;
                })
                .catch(function(error){
                    console.error("Error adding photo interest: ", error);
                });
            }
        })
        .catch(function(error){
            console.log("Error getting existing user photo interests: ", error);
        });
    }

    firebase.auth().onAuthStateChanged(user => {
        if (user)
        {
            currentUser = user;

            // View this user's profile
            if (inputUser)
            {
                email = String(inputUser + "@kent.edu");

                db.collection("Users").where("email", "==", email)
                    .get()
                    .then(function(querySnapshot){
                        var doc = querySnapshot.docs[0];
                        inputUsersID = String(doc.id);
                        fName = String(doc.get("first_Name"));
                        lName = String(doc.get("last_Name"));
                        userType = doc.get("userType");
                        isVerified = doc.get("verified");

                        GetAdditionalFields(inputUsersID);
						
						// Add message event
						if (btnMessage != null) {
							btnMessage.addEventListener('click', e=> {
								openMessengerWith(user.uid, inputUsersID);
							});
						}
                    })
                    .catch(function(error){
                        console.log("Error getting document ID: ", error);
                    });
				
            }
        
            // View your own
            else
            {
                db.collection('Users').doc(currentUser.uid).get()
                .then(function(querySnapshot){
                    var doc = querySnapshot;
                    fName = String(doc.get("first_Name"));
                    lName = String(doc.get("last_Name"));
                    email = String(doc.get("email"));
                    userType = doc.get("userType");
                    isVerified = doc.get("verified");
                    isCurrentUser = true;
                    GetAdditionalFields(currentUser.uid);
                })
                .catch(function(error){
                    console.log("Error getting document ID: ", error);
                });
            }
        }
        else
        {
            // User is not logged in and shouldn't be able to see anyone's profile.
        }
    });
}());
