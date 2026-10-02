// ===============================
// EVENTS - FETCH API, SEARCH, FILTER, SORT, PAGINATION
// ===============================

const EVENTS_URL = "../Practical-6/events.json";
const EVENTS_CACHE_KEY = "studentHubEventsCache";
const EVENTS_PER_PAGE = 6;

let allEvents = [];
let currentEventsPage = 1;

const eventsContainer = document.getElementById("eventsContainer");
const eventsStatus = document.getElementById("eventsStatus");
const eventsPagination = document.getElementById("eventsPagination");
const eventSearch = document.getElementById("eventSearch");
const eventCategoryFilter = document.getElementById("eventCategoryFilter");
const eventSort = document.getElementById("eventSort");


// ===============================
// Fetch Events (with localStorage cache fallback)
// ===============================

function loadEvents() {

    if (!eventsContainer) return;

    eventsStatus.textContent = "Loading events...";

    fetch(EVENTS_URL)
        .then(function (response) {

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            return response.json();
        })
        .then(function (data) {

            allEvents = data;

            try {
                localStorage.setItem(EVENTS_CACHE_KEY, JSON.stringify(data));
            } catch (e) {
                // localStorage full/unavailable - ignore, not critical
            }

            eventsStatus.textContent = "";

            populateCategoryFilter(allEvents);
            renderEvents();
        })
        .catch(function (error) {

            const cached = localStorage.getItem(EVENTS_CACHE_KEY);

            if (cached) {

                allEvents = JSON.parse(cached);

                eventsStatus.textContent =
                    "⚠️ Showing previously loaded events (offline).";

                populateCategoryFilter(allEvents);
                renderEvents();

            } else {

                eventsStatus.textContent =
                    "⚠️ Unable to load events right now. Please try again later.";
            }
        });
}


// ===============================
// Populate Category Filter Dropdown
// ===============================

function populateCategoryFilter(events) {

    if (!eventCategoryFilter) return;

    const categories = [];

    events.forEach(function (event) {
        if (categories.indexOf(event.category) === -1) {
            categories.push(event.category);
        }
    });

    categories.forEach(function (category) {

        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;

        eventCategoryFilter.appendChild(option);
    });
}


// ===============================
// Search + Filter + Sort
// ===============================

function getProcessedEvents() {

    const searchTerm = eventSearch ? eventSearch.value.trim().toLowerCase() : "";
    const category = eventCategoryFilter ? eventCategoryFilter.value : "all";
    const sortValue = eventSort ? eventSort.value : "date-asc";

    let result = allEvents.filter(function (event) {

        const matchesSearch =
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            event.location.toLowerCase().includes(searchTerm);

        const matchesCategory =
            category === "all" || event.category === category;

        return matchesSearch && matchesCategory;
    });

    result = result.slice().sort(function (a, b) {

        if (sortValue === "date-asc") {
            return a.date.localeCompare(b.date);
        }

        if (sortValue === "date-desc") {
            return b.date.localeCompare(a.date);
        }

        if (sortValue === "title-asc") {
            return a.title.localeCompare(b.title);
        }

        return 0;
    });

    return result;
}


// ===============================
// Render Events (with pagination)
// ===============================

function renderEvents() {

    const processed = getProcessedEvents();

    const totalPages = Math.max(
        1,
        Math.ceil(processed.length / EVENTS_PER_PAGE)
    );

    if (currentEventsPage > totalPages) {
        currentEventsPage = totalPages;
    }

    const startIndex = (currentEventsPage - 1) * EVENTS_PER_PAGE;
    const pageEvents = processed.slice(startIndex, startIndex + EVENTS_PER_PAGE);

    eventsContainer.innerHTML = "";

    if (pageEvents.length === 0) {

        eventsContainer.innerHTML =
            "<p class='no-events'>No events found.</p>";

    } else {

        pageEvents.forEach(function (event) {

            const card = document.createElement("div");
            card.className = "event-card";

            card.innerHTML =
                "<div class='date'>" +
                    "<h2>" + event.day + "</h2>" +
                    "<span>" + event.month + "</span>" +
                "</div>" +
                "<div class='details'>" +
                    "<h3>" + event.title + "</h3>" +
                    "<p><i class='fa-solid fa-location-dot'></i> " + event.location + "</p>" +
                    "<p><i class='fa-solid fa-clock'></i> " + event.time + "</p>" +
                    "<p>" + event.description + "</p>" +
                    "<a href='#'>" + event.linkText + "</a>" +
                "</div>";

            eventsContainer.appendChild(card);
        });
    }

    renderPagination(totalPages);
}


// ===============================
// Render Pagination Controls
// ===============================

function renderPagination(totalPages) {

    if (!eventsPagination) return;

    eventsPagination.innerHTML = "";

    if (totalPages <= 1) return;

    for (let page = 1; page <= totalPages; page++) {

        const pageBtn = document.createElement("button");
        pageBtn.textContent = page;

        if (page === currentEventsPage) {
            pageBtn.classList.add("active-page");
        }

        pageBtn.addEventListener("click", function () {
            currentEventsPage = page;
            renderEvents();
        });

        eventsPagination.appendChild(pageBtn);
    }
}


// ===============================
// Event Listeners
// ===============================

if (eventSearch) {
    eventSearch.addEventListener("input", function () {
        currentEventsPage = 1;
        renderEvents();
    });
}

if (eventCategoryFilter) {
    eventCategoryFilter.addEventListener("change", function () {
        currentEventsPage = 1;
        renderEvents();
    });
}

if (eventSort) {
    eventSort.addEventListener("change", function () {
        renderEvents();
    });
}


loadEvents();
