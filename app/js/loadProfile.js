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
    const fullNameDOM = document.getElementById('name');
    const userTypeDOM = document.getElementById('userType');
    const majorDOM = document.getElementById('major');
    const minorDOM = document.getElementById('minor');
    const graduationDOM = document.getElementById('graduation');
    const emailDOM = document.getElementById('email');
    const websiteDOM = document.getElementById('website');
    const facebookDOM = document.getElementById('facebook');
    const instagramDOM = document.getElementById('instagram');
    const twitterDOM = document.getElementById('twitter');
    const bioDOM = document.getElementById('bio');

    var initialLoad = true;
    var currentUser = firebase.auth().currentUser;
    var inputUser = document.currentScript.getAttribute('inputUser');

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
    var facebook = "";
    var instagram = "";
    var twitter = "";
    var isVerified = false;
    
    var calledUser = false;
    var calledProfile = false;
    
    function CheckState()
    {
        if (calledUser && calledProfile)
        {
            LoadProfile(isVerified);
        }
    }

    function LoadProfile(isVerified)
    {
        console.log("Inside loadProfile()");

        if (isVerified)
        {
            // Get additional fields & allow editing of fields (if current user's profile)
        }

        SetBasicFields();
        SetAdditionalFields();
    };
    
    function SetBasicFields()
    {
        fullNameDOM.innerHTML = fName + " " + lName;
        emailDOM.innerHTML = email;
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
                facebook = String(doc.get("facebook"));
                instagram = String(doc.get("instagram"));
                twitter = String(doc.get("twitter"));
        })
        .catch(function(error){
            console.log("Error getting document ID: ", error);
        });
    };

    function SetAdditionalFields()
    {
        majorDOM.innerHTML = major;
        minorDOM.innerHTML = minor;
        graduationDOM.innerHTML = gradYear;
        websiteDOM.innerHTML = website;
        websiteDOM.html = website;
        bioDOM.innerHTML = bio;
        facebookDOM.href = facebook;
        instagramDOM.href = instagram;
        twitterDOM.href = twitter;
    };

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
                        calledUser = true;

                        CheckState();
                    })
                    .catch(function(error){
                        console.log("Error getting document ID: ", error);
                    });

                    db.collection('Profiles').doc(inputUsersID).get()
                    .then(function(querySnapshot){
                        var doc = querySnapshot;
                        facultyPos = String(doc.get("faculty_position"));
                        major = String(doc.get("major"));
                        minor = String(doc.get("minor"));
                        gradYear = String(doc.get("graduation_year"));
                        website = String(doc.get("website"));
                        bio = String(doc.get("bio"));
                        facebook = String(doc.get("facebook"));
                        instagram = String(doc.get("instagram"));
                        twitter = String(doc.get("twitter"));
                        calledProfile = true;
    
                        CheckState();
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
                    calledUser = true;
                })
                .catch(function(error){
                    console.log("Error getting document ID: ", error);
                });

                db.collection('Profiles').doc(currentUser.uid).get()
                .then(function(querySnapshot){
                    var doc = querySnapshot;
                    facultyPos = String(doc.get("faculty_position"));
                    major = String(doc.get("major"));
                    minor = String(doc.get("minor"));
                    gradYear = String(doc.get("graduation_year"));
                    website = String(doc.get("website"));
                    bio = String(doc.get("bio"));
                    facebook = String(doc.get("facebook"));
                    instagram = String(doc.get("instagram"));
                    twitter = String(doc.get("twitter"));
                    calledProfile = true;

                    CheckState();
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
