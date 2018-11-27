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
    }

    // Fetch an instance of the DB
    const db = firebase.firestore(app);
    //console.log(db);

    // Disable deprecated features
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    // Get elements/user input
    const facultyDOM = document.getElementById('facultyPos');
    const majorDOM = document.getElementById('major');
    const minorDOM = document.getElementById('minor');
    const graduationDOM = document.getElementById('graduation');
    const websiteDOM = document.getElementById('website');
    const facebookDOM = document.getElementById('facebook');
    const instagramDOM = document.getElementById('instagram');
    const twitterDOM = document.getElementById('twitter');
    const bioDOM = document.getElementById('bio');
    const interestsDIVDOM = document.getElementById('interestsDIV');
    const interestListDOM = document.getElementById('interestList');
    const btnAddInterestDOM = document.getElementById('btnAddInterest');
    const btnSaveDOM = document.getElementById('btnSaveChanges');
    
    var currentUser, newInterest;
    var interests = [];

    // Add "New Interest" event
    if (btnAddInterestDOM != null) {
        btnAddInterestDOM.addEventListener('click', e=> { 
            initialLoad = false;

            if (currentUser)
            {
                newInterest = interestListDOM.options[interestListDOM.selectedIndex].text;
                AddNewInterest(newInterest, false);
            }
        });
    }

    // Add "Save Changes" event
    if (btnSaveDOM != null) {
        btnSaveDOM.addEventListener('click', e=> { 
            initialLoad = false;

            if (currentUser)
            {
                db.collection("Profiles").doc(currentUser.uid).update({
                    major: majorDOM.value,
                    minor: minorDOM.value,
                    bio: bioDOM.value,
                    faculty_position: facultyDOM.value,
                    website: websiteDOM.value,
                    facebook: facebookDOM.value,
                    instagram: instagramDOM.value,
                    twitter: twitterDOM.value,
                    graduation_year: graduationDOM.value,
                    userID: currentUser.uid,
                    // photo_interests: interests // Photo interests are saved automatically
                })
                .then(function(){
                    swal({
                        title: "Your profile changes have been saved.",
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
                        window.location.href = "/profile";
                        return;
                    });
                    console.log("Profile documents successfully updated!");
                })
                .catch(function(error){
                    console.error("Error writing document: ", error);
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

    function AddNewInterest(toAdd, safeGuard)
    {
        // Get current interests from DB
        db.collection('Profiles').doc(currentUser.uid).get()
        .then(function(querySnapshot){
            var doc = querySnapshot;
            interests = doc.get("photo_interests");

            // Already exists in interests, ignore it.
            if (interests.includes(toAdd) || interestListDOM.selectedIndex == 0 && !safeGuard)
            {
                interestListDOM.selectedIndex = 0;
                return;
            }
            // Push it
            else
            {
                
                // If list is empty and a new interest is added, remove the "None" interest
                if (interests.includes("None") && interests.length == 1 && !safeGuard)
                {
                    interests.splice(0, 1);
                    interestsDIVDOM.removeChild(document.getElementById("None"));
                }
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
        currentUser = user;
    });
}());
