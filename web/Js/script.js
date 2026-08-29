// ===============================
// STUDENTHUB COMMON JAVASCRIPT
// ===============================


// ===============================
// DARK / LIGHT MODE
// ===============================

const themeBtn = document.getElementById("themeBtn");

// Page load hone par saved theme check karega
const savedTheme = localStorage.getItem("studentHubTheme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    if (themeBtn) {
        themeBtn.innerHTML = "☀️ Light Mode";
    }

}


// Theme button click
if (themeBtn) {

    themeBtn.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {

            themeBtn.innerHTML = "☀️ Light Mode";

            localStorage.setItem("studentHubTheme", "dark");

        } else {

            themeBtn.innerHTML = "🌙 Dark Mode";

            localStorage.setItem("studentHubTheme", "light");

        }

    });

}


// ===============================
// FAQ COLLAPSIBLE
// ===============================

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(function (question) {

    question.addEventListener("click", function () {

        const answer = this.nextElementSibling;

        if (answer) {
            answer.classList.toggle("show");
        }

    });

});


// ===============================
// MODAL POPUP
// ===============================

const openModalBtn = document.getElementById("openModal");
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModal");


if (openModalBtn && modal) {

    openModalBtn.addEventListener("click", function () {

        modal.classList.add("show");

    });

}


if (closeModalBtn && modal) {

    closeModalBtn.addEventListener("click", function () {

        modal.classList.remove("show");

    });

}


// Modal ke bahar click karne par close
window.addEventListener("click", function (event) {

    if (event.target === modal) {

        modal.classList.remove("show");

    }

});


// ===============================
// NOTIFICATION BANNER
// ===============================

const closeNotification =
    document.getElementById("closeNotification");

const notification =
    document.getElementById("notification");


if (closeNotification && notification) {

    closeNotification.addEventListener("click", function () {

        notification.style.display = "none";

    });

}


// ===============================
// HAMBURGER MENU
// ===============================

const menuBtn = document.getElementById("menuBtn");

const navMenu = document.getElementById("navMenu");


if (menuBtn && navMenu) {

    menuBtn.addEventListener("click", function () {

        navMenu.classList.toggle("show-menu");

    });

}


// ===============================
// EVENT / CONTENT SLIDER
// ===============================

const slides = document.querySelectorAll(".slide");

const nextBtn = document.getElementById("nextBtn");

const prevBtn = document.getElementById("prevBtn");

let currentSlide = 0;


function showSlide(index) {

    if (slides.length === 0) return;

    slides.forEach(function (slide) {

        slide.style.display = "none";

    });

    slides[index].style.display = "block";

}


if (slides.length > 0) {

    showSlide(currentSlide);

}


if (nextBtn && slides.length > 0) {

    nextBtn.addEventListener("click", function () {

        currentSlide++;

        if (currentSlide >= slides.length) {

            currentSlide = 0;

        }

        showSlide(currentSlide);

    });

}


if (prevBtn && slides.length > 0) {

    prevBtn.addEventListener("click", function () {

        currentSlide--;

        if (currentSlide < 0) {

            currentSlide = slides.length - 1;

        }

        showSlide(currentSlide);

    });

}