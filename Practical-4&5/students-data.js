// ===============================
// STUDENT LIST - FETCH API, SEARCH, FILTER, SORT, PAGINATION
// ===============================

const STUDENTS_URL = "../Practical-6/students.json";
const STUDENTS_CACHE_KEY = "studentHubStudentsCache";
const STUDENTS_PER_PAGE = 5;

let allStudents = [];
let currentStudentsPage = 1;

const studentListBody = document.getElementById("studentListBody");
const studentListStatus = document.getElementById("studentListStatus");
const studentListPagination = document.getElementById("studentListPagination");
const studentSearch = document.getElementById("studentSearch");
const studentCourseFilter = document.getElementById("studentCourseFilter");
const studentSort = document.getElementById("studentSort");


// ===============================
// Fetch Students (with localStorage cache fallback)
// ===============================

function loadStudents() {

    if (!studentListBody) return;

    studentListStatus.textContent = "Loading students...";

    fetch(STUDENTS_URL)
        .then(function (response) {

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            return response.json();
        })
        .then(function (data) {

            allStudents = data;

            try {
                localStorage.setItem(STUDENTS_CACHE_KEY, JSON.stringify(data));
            } catch (e) {
                // localStorage full/unavailable - ignore, not critical
            }

            studentListStatus.textContent = "";

            populateCourseFilter(allStudents);
            renderStudents();
        })
        .catch(function (error) {

            const cached = localStorage.getItem(STUDENTS_CACHE_KEY);

            if (cached) {

                allStudents = JSON.parse(cached);

                studentListStatus.textContent =
                    "⚠️ Showing previously loaded student data (offline).";

                populateCourseFilter(allStudents);
                renderStudents();

            } else {

                studentListStatus.textContent =
                    "⚠️ Unable to load student list right now. Please try again later.";
            }
        });
}


// ===============================
// Populate Course Filter Dropdown
// ===============================

function populateCourseFilter(students) {

    if (!studentCourseFilter) return;

    const courses = [];

    students.forEach(function (student) {
        if (courses.indexOf(student.course) === -1) {
            courses.push(student.course);
        }
    });

    courses.forEach(function (course) {

        const option = document.createElement("option");
        option.value = course;
        option.textContent = course;

        studentCourseFilter.appendChild(option);
    });
}


// ===============================
// Search + Filter + Sort
// ===============================

function getProcessedStudents() {

    const searchTerm = studentSearch ? studentSearch.value.trim().toLowerCase() : "";
    const course = studentCourseFilter ? studentCourseFilter.value : "all";
    const sortValue = studentSort ? studentSort.value : "name-asc";

    let result = allStudents.filter(function (student) {

        const matchesSearch =
            student.name.toLowerCase().includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm);

        const matchesCourse =
            course === "all" || student.course === course;

        return matchesSearch && matchesCourse;
    });

    result = result.slice().sort(function (a, b) {

        if (sortValue === "name-desc") {
            return b.name.localeCompare(a.name);
        }

        return a.name.localeCompare(b.name);
    });

    return result;
}


// ===============================
// Render Students (with pagination)
// ===============================

function renderStudents() {

    const processed = getProcessedStudents();

    const totalPages = Math.max(
        1,
        Math.ceil(processed.length / STUDENTS_PER_PAGE)
    );

    if (currentStudentsPage > totalPages) {
        currentStudentsPage = totalPages;
    }

    const startIndex = (currentStudentsPage - 1) * STUDENTS_PER_PAGE;
    const pageStudents = processed.slice(startIndex, startIndex + STUDENTS_PER_PAGE);

    studentListBody.innerHTML = "";

    if (pageStudents.length === 0) {

        studentListBody.innerHTML =
            "<tr><td colspan='5'>No students found.</td></tr>";

    } else {

        pageStudents.forEach(function (student) {

            const row = document.createElement("tr");

            row.innerHTML =
                "<td>" + student.name + "</td>" +
                "<td>" + student.email + "</td>" +
                "<td>" + student.course + "</td>" +
                "<td>" + student.year + "</td>" +
                "<td>" + student.status + "</td>";

            studentListBody.appendChild(row);
        });
    }

    renderStudentsPagination(totalPages);
}


// ===============================
// Render Pagination Controls
// ===============================

function renderStudentsPagination(totalPages) {

    if (!studentListPagination) return;

    studentListPagination.innerHTML = "";

    if (totalPages <= 1) return;

    for (let page = 1; page <= totalPages; page++) {

        const pageBtn = document.createElement("button");
        pageBtn.textContent = page;

        if (page === currentStudentsPage) {
            pageBtn.classList.add("active-page");
        }

        pageBtn.addEventListener("click", function () {
            currentStudentsPage = page;
            renderStudents();
        });

        studentListPagination.appendChild(pageBtn);
    }
}


// ===============================
// Event Listeners
// ===============================

if (studentSearch) {
    studentSearch.addEventListener("input", function () {
        currentStudentsPage = 1;
        renderStudents();
    });
}

if (studentCourseFilter) {
    studentCourseFilter.addEventListener("change", function () {
        currentStudentsPage = 1;
        renderStudents();
    });
}

if (studentSort) {
    studentSort.addEventListener("change", function () {
        renderStudents();
    });
}


loadStudents();
