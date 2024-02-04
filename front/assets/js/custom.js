let links = document.querySelectorAll(".navbar-nav a");
let currentPath = window.location.pathname;

for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function(event) {
        event.preventDefault(); // منع السلوك الافتراضي للرابط

        for (let j = 0; j < links.length; j++) {
            links[j].classList.remove("active");
        }
        this.classList.add("active");

        setTimeout(function() {
            window.location.href = links[i].getAttribute('href');
        }, 500);
    });



    if (currentPath.includes(links[i].getAttribute('href'))) {
        links[i].classList.add('active');
    }
}
