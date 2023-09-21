
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

