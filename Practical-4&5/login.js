const form = document.querySelector("form");
const email = document.getElementById("email");
const password = document.getElementById("password");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const emailValue = email.value;
    const passwordValue = password.value;

    const students =JSON.parse(localStorage.getItem("students")) || [];

    const student = students.find(function(s) {
        return s.email === emailValue && s.password === passwordValue;
    });

    if (student) {
        alert("Login Successfully");
        window.location.href = "dashboard.html";
    }
    else {
        alert("Invalid Login! Enter Valid Email Or Password");
    }

});