(function() {

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
            if (currentPage == link.id)
            {
                if (!link.classList.contains("active"))
                {
                    link.classList.add('active');
                }
            }
            else
            {
                if (link.classList.contains("active"))
                {
                    link.classList.remove('active');
                }
            }
        }
    };

}());