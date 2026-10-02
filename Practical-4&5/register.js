const form = document.querySelector("form");

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm");
const email = document.getElementById("email");
const mobile = document.getElementById("mobile");

// ===============================
// Password Strength
// ===============================

const strengthText = document.createElement("small");
password.parentElement.appendChild(strengthText);

password.addEventListener("input", function () {

    const value = password.value;

    if (value.length === 0) {
        strengthText.textContent = "";
        return;
    }

    if (value.length < 6) {
        strengthText.textContent = "🔴 Weak Password";
    }
    else if (
        value.length >= 6 &&
        /[A-Z]/.test(value) &&
        /[0-9]/.test(value)
    ) {
        strengthText.textContent = "🟡 Medium Password";
    }
    else if (
        value.length >= 8 &&
        /[A-Z]/.test(value) &&
        /[a-z]/.test(value) &&
        /[0-9]/.test(value) &&
        /[@#$%&]/.test(value) 
    ) {
        strengthText.textContent = "🟢 Strong Password";
    }
    else {
        strengthText.textContent = "🟡 Medium Password";
    }
});


// ===============================
// Confirm Password Live Check
// ===============================

confirmPassword.addEventListener("input", function () {

    if (confirmPassword.value === password.value) {
        confirmPassword.style.border = "2px solid green";
    }
    else {
        confirmPassword.style.border = "2px solid red";
    }

});


// ===============================
// Form Submit
// ===============================

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const emailValue = email.value.trim();
    const mobileValue = mobile.value.trim();
    const passwordValue = password.value;
    const dob = document.getElementById("dob").value;
    const course = document.getElementById("course").value;
    const genderValue = document.querySelector('input[name="gender"]:checked');


    // Name validation
    if (!/^[A-Za-z\s]{3,50}$/.test(name)) {
        alert("🙍 Enter a valid name (letters and spaces only, at least 3 characters)!");
        return;
    }


    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        alert("📧 Enter a valid email address!");
        return;
    }


    // Mobile validation
    if (!/^[0-9]{10}$/.test(mobileValue)) {
        alert("📱 Enter a valid 10-digit mobile number!");
        return;
    }


    // Gender validation
    if (!genderValue) {
        alert("⚧ Please select your gender!");
        return;
    }


    // Password validation
    if (passwordValue.length < 6) {
        alert("🔐 Password must contain at least 6 characters!");
        return;
    }


    // Password match
    if (passwordValue !== confirmPassword.value) {
        alert("❌ Passwords do not match!");
        return;
    }


    // Course validation
    if (course === "Select Course") {
        alert("🎓 Please select your course!");
        return;
    }


    // ===============================
    // Duplicate Email Check
    // ===============================

    const students =
        JSON.parse(localStorage.getItem("students")) || [];

    const alreadyExists =
        students.some(student => student.email === emailValue);

    if (alreadyExists) {
        alert("⚠️ This email is already registered!");
        return;
    }


    // ===============================
    // Create Student Object
    // ===============================

    const student = {
        name: name,
        email: emailValue,
        mobile: mobileValue,
        password: passwordValue,
        dob: dob,
        course: course,
        registeredAt: new Date().toLocaleString()
    };


    // Save student
    students.push(student);

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );


    // Success
    alert(
        "🎉 Registration Successful!\n\n" +
        "Welcome to StudentHub, " + name + "!"
        
    );

    // Clear form
    form.reset();

    confirmPassword.style.border = "";

    window.location.href = "dashboard.html";

});