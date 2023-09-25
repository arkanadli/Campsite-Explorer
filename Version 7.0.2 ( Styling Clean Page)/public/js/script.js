// make a user know some requirement in the form
const form = document.querySelectorAll('.validated-form');

Array.from(form).forEach(function (form) {
    form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('was-validated')

    }, false)
})


// make navbar dissapper when user scrolling down
var lastScrollTop;
navbar = document.getElementById('navbar');
window.addEventListener('scroll', function () {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        navbar.style.top = '-80px';
    } else {
        navbar.style.top = '0';
    }
    lastScrollTop = scrollTop;
    scrollFunction(); // scroll btn up to top
});

// make scroll to top dissapear
try {
    let mybutton = document.getElementById("btn-back-to-top");
    mybutton.addEventListener("click", backToTop);
    function scrollFunction() {
        if (
            document.body.scrollTop > 200 ||
            document.documentElement.scrollTop > 200
            ) {
                mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    }
    function backToTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
} catch (error) {
    
}






// :: make fade in animation when user in element view port
function handleIntersection(entries, observer) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target); // Stop observing once it's visible
        }
    });
}

// Create an observer that watches for elements with the "animate-on-scroll" class
const observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.5, // Adjust this value based on when you want the animation to trigger
});

// Get all elements with the "animate-on-scroll" class
const elements = document.querySelectorAll(".card");

// Add each element to the observer
elements.forEach((element) => {
    observer.observe(element);
});