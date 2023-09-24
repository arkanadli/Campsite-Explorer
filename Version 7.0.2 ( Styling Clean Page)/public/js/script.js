
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

var lastScrollTop;
navbar = document.getElementById('navbar');
window.addEventListener('scroll',function(){
var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
if(scrollTop > lastScrollTop){
navbar.style.top='-80px';
}
else{
navbar.style.top='0';
}
lastScrollTop = scrollTop;
});