// ===============================
// FAQ - FETCH API, SEARCH, FILTER
// ===============================

const FAQS_URL = "../Practical-6/faqs.json";
const FAQS_CACHE_KEY = "studentHubFaqsCache";

let allFaqs = [];

const faqContainer = document.getElementById("faqContainer");
const faqStatus = document.getElementById("faqStatus");
const faqSearch = document.getElementById("faqSearch");
const faqCategoryFilter = document.getElementById("faqCategoryFilter");


// ===============================
// Fetch FAQs (with localStorage cache fallback)
// ===============================

function loadFaqs() {

    if (!faqContainer) return;

    faqStatus.textContent = "Loading FAQs...";

    fetch(FAQS_URL)
        .then(function (response) {

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            return response.json();
        })
        .then(function (data) {

            allFaqs = data;

            try {
                localStorage.setItem(FAQS_CACHE_KEY, JSON.stringify(data));
            } catch (e) {
                // localStorage full/unavailable - ignore, not critical
            }

            faqStatus.textContent = "";

            populateFaqCategoryFilter(allFaqs);
            renderFaqs();
        })
        .catch(function (error) {

            const cached = localStorage.getItem(FAQS_CACHE_KEY);

            if (cached) {

                allFaqs = JSON.parse(cached);

                faqStatus.textContent =
                    "⚠️ Showing previously loaded FAQs (offline).";

                populateFaqCategoryFilter(allFaqs);
                renderFaqs();

            } else {

                faqStatus.textContent =
                    "⚠️ Unable to load FAQs right now. Please try again later.";
            }
        });
}


// ===============================
// Populate Category Filter Dropdown
// ===============================

function populateFaqCategoryFilter(faqs) {

    if (!faqCategoryFilter) return;

    const categories = [];

    faqs.forEach(function (faq) {
        if (categories.indexOf(faq.category) === -1) {
            categories.push(faq.category);
        }
    });

    categories.forEach(function (category) {

        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;

        faqCategoryFilter.appendChild(option);
    });
}


// ===============================
// Search + Filter
// ===============================

function getProcessedFaqs() {

    const searchTerm = faqSearch ? faqSearch.value.trim().toLowerCase() : "";
    const category = faqCategoryFilter ? faqCategoryFilter.value : "all";

    return allFaqs.filter(function (faq) {

        const matchesSearch =
            faq.question.toLowerCase().includes(searchTerm);

        const matchesCategory =
            category === "all" || faq.category === category;

        return matchesSearch && matchesCategory;
    });
}


// ===============================
// Render FAQs
// ===============================

function renderFaqs() {

    const processed = getProcessedFaqs();

    faqContainer.innerHTML = "";

    if (processed.length === 0) {

        faqContainer.innerHTML = "<p class='no-faqs'>No matching FAQs found.</p>";
        return;
    }

    processed.forEach(function (faq, index) {

        const article = document.createElement("article");

        const questionBtn = document.createElement("button");
        questionBtn.className = "faq-question";
        questionBtn.textContent = (index + 1) + ". " + faq.question;

        const answer = document.createElement("p");
        answer.className = "faq-answer";
        answer.innerHTML = faq.answer;

        questionBtn.addEventListener("click", function () {
            answer.classList.toggle("show");
        });

        article.appendChild(questionBtn);
        article.appendChild(answer);

        faqContainer.appendChild(article);
    });
}


// ===============================
// Event Listeners
// ===============================

if (faqSearch) {
    faqSearch.addEventListener("input", renderFaqs);
}

if (faqCategoryFilter) {
    faqCategoryFilter.addEventListener("change", renderFaqs);
}


loadFaqs();
