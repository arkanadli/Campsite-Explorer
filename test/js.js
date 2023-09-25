
// Function to handle the intersection callback
function handleIntersection(entries, observer) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add(".show");
            observer.unobserve(entry.target); // Stop observing once it's visible
        }
    });
}

// Create an observer that watches for elements with the "animate-on-scroll" class
const observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.5, // Adjust this value based on when you want the animation to trigger
});

// Get all elements with the "animate-on-scroll" class
const elements = document.querySelectorAll(".animate-on-scroll");

// Add each element to the observer
elements.forEach((element) => {
    observer.observe(element);
});