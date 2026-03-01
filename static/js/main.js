document.addEventListener("DOMContentLoaded", function() {

    const form = document.getElementById("contactForm");

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const formData = new FormData(form);

        fetch("/send_mail", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("formMessage").innerHTML = data.message;
            form.reset();
        })
        .catch(error => {
            document.getElementById("formMessage").innerHTML = "Something went wrong ❌";
            console.error(error);
        });

    });

});