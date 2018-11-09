(function() {
    // Initialize Firebase
    if (!firebase.apps.length) {
        var config = {
            apiKey: "AIzaSyCEuT1gco387t16C2IAmN2bx5bt-n6ea6s",
            authDomain: "focal-point-student-alumni-net.firebaseapp.com",
            databaseURL: "https://focal-point-student-alumni-net.firebaseio.com",
            projectId: "focal-point-student-alumni-net",
            storageBucket: "focal-point-student-alumni-net.appspot.com",
            messagingSenderId: "1002904582612"
        };

        firebase.initializeApp(config);
    }
    
    var initialLoad = true;

    firebase.auth().onAuthStateChanged(function() {
        if (firebase.auth().currentUser) {
            // Show "Profile", "Directory", "Messages", and "Logout"
            setNavigation(true);
        }
        else {
            // Show "Mailing List" and "Login"
            setNavigation(false);
            if (!initialLoad) {
                window.location.href = "/login";
                swal({
                    text: "You have been signed out.",
                    icon: "success"
                });
            }
        }
        
    });
        
    function setNavigation(loggedIn) {
        var tempFragment;
        if (loggedIn) {
            var user = FirebaseAuth.getInstance().getCurrentUser().getEmail();
            var subscribe = document.getElementById("subscribeNav");
            var login = document.getElementById("loginNav");
            if (subscribe) subscribe.remove();
            if (login) login.remove();

            // Add "Profile" nav link
            var node = document.getElementById("profileNav");
            if (!node) {
                node = document.createElement("LI");
                node.classList.add("nav-item");
                node.classList.add("px-lg-4");
                node.id = "profileNav";
                
                var linkNode = document.createElement("a");
                linkNode.classList.add("nav-link");
                linkNode.classList.add("text-uppercase");
                linkNode.classList.add("text-expanded");

                linkNode.id = "profile";
                linkNode.href = "/profile?user=" + user;
                var textNode = document.createTextNode("Profile");

                linkNode.appendChild(textNode); 
                node.appendChild(linkNode);
                document.getElementById("navBarList").appendChild(node);
            }

            // Add "Directory" nav link
            var node = document.getElementById("directoryNav");
            if (!node) {
                node = document.createElement("LI");
                node.classList.add("nav-item");
                node.classList.add("px-lg-4");
                node.id = "directoryNav";
                
                var linkNode = document.createElement("a");
                linkNode.classList.add("nav-link");
                linkNode.classList.add("text-uppercase");
                linkNode.classList.add("text-expanded");
    
                linkNode.id = "directory";
                linkNode.href = "/directory";
                var textNode = document.createTextNode("Directory");
    
                linkNode.appendChild(textNode); 
                node.appendChild(linkNode);
                document.getElementById("navBarList").appendChild(node);
            }

            // Add "Messages" nav link
            node = document.getElementById("messagesNav");
            if (!node) {
                node = document.createElement("LI");
                node.classList.add("nav-item");
                node.classList.add("px-lg-4");
                node.id = "messagesNav";
                
                var linkNode = document.createElement("a");
                linkNode.classList.add("nav-link");
                linkNode.classList.add("text-uppercase");
                linkNode.classList.add("text-expanded");
                linkNode.id = "messages";
                linkNode.href = "/messages";
                var textNode = document.createTextNode("Messages");
    
                linkNode.appendChild(textNode); 
                node.appendChild(linkNode);
                document.getElementById("navBarList").appendChild(node);
            }

            // Add "Logout" nav link
            node = document.getElementById("logoutNav");
            if (!node) {
                node = document.createElement("LI");
                node.classList.add("nav-item");
                node.classList.add("px-lg-4");
                node.id = "logoutNav";
                
                var linkNode = document.createElement("a");
                linkNode.classList.add("nav-link");
                linkNode.classList.add("text-uppercase");
                linkNode.classList.add("text-expanded");
                linkNode.id = "logout";
                linkNode.href = "javascript:void(0);";
                linkNode.addEventListener('click', e=> {
                    initialLoad = false;
        
                    const promise = firebase.auth().signOut();
                    promise.catch(e => swal(e.message));
                });
                var textNode = document.createTextNode("Logout");
    
                linkNode.appendChild(textNode); 
                node.appendChild(linkNode);
                document.getElementById("navBarList").appendChild(node);
            }
        }
        else {
            var profile = document.getElementById("profileNav");
            var directory = document.getElementById("directoryNav");
            var messages = document.getElementById("messagesNav");
            var logout = document.getElementById("logoutNav");
            if (profile) profile.remove();
            if (directory) directory.remove();
            if (messages) messages.remove();
            if (logout) logout.remove();

            // Add "Mailing List" nav link
            var node = document.getElementById("subscibeNav");
            if (!node) {
                node = document.createElement("LI");
                node.classList.add("nav-item");
                node.classList.add("px-lg-4");
                node.id = "subscribeNav";
                
                var linkNode = document.createElement("a");
                linkNode.classList.add("nav-link");
                linkNode.classList.add("text-uppercase");
                linkNode.classList.add("text-expanded");
    
                linkNode.id = "subscribe";
                linkNode.href = "/subscribe";
                var textNode = document.createTextNode("Mailing List");
    
                linkNode.appendChild(textNode); 
                node.appendChild(linkNode);
                document.getElementById("navBarList").appendChild(node);
            }

            // Add "Login" nav link
            node = document.getElementById("loginNav");
            if (!node) {
                node = document.createElement("LI");
                node.classList.add("nav-item");
                node.classList.add("px-lg-4");
                node.id = "loginNav";
                
                var linkNode = document.createElement("a");
                linkNode.classList.add("nav-link");
                linkNode.classList.add("text-uppercase");
                linkNode.classList.add("text-expanded");
                linkNode.id = "login";
                linkNode.href = "/login";
                var textNode = document.createTextNode("Login");
    
                linkNode.appendChild(textNode); 
                node.appendChild(linkNode);
                document.getElementById("navBarList").appendChild(node);
            }
        }
    }

    var currentPage = document.currentScript.getAttribute('title').toLowerCase();
    var navLinks = {
        index: document.getElementById('home'),
        about: document.getElementById('about'),
        work: document.getElementById('work'),
        events: document.getElementById('events'),
        subscribe: document.getElementById('subscribe'),
        login: document.getElementById('login'),
        register: document.getElementById('register')
    };

    for (index in navLinks) {
        if (navLinks.hasOwnProperty(index)) {
            var link = navLinks[index];
            // TypeError: link is null, next line
            if (currentPage == link.id) {
                if (!link.classList.contains("active")) {
                    link.classList.add('active');
                }
            }
            else {
                if (link.classList.contains("active")) {
                    link.classList.remove('active');
                }
            }
        }
    };
}());
