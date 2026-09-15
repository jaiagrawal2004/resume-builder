
const API_URL = "http://localhost:8080";
const RESUME_API = API_URL + "/api/resumes";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

let user = null;

try {
    const userData = localStorage.getItem("user");

    if (userData) {
        user = JSON.parse(userData);
    }
} catch (error) {
    console.error("User data error:", error);
}

function loadUserInfo() {

    const userName =
        user?.name ||
        user?.username ||
        "User";

    const userEmail =
        user?.email ||
        "No email available";

    const userEmailElement =
        document.getElementById("userEmail");

    if (userEmailElement) {
        userEmailElement.textContent = userEmail;
    }

    const profileName =
        document.getElementById("profileName");

    if (profileName) {
        profileName.textContent = userName;
    }

    const profileEmail =
        document.getElementById("profileEmail");

    if (profileEmail) {
        profileEmail.textContent = userEmail;
    }

    const profileNameInfo =
        document.getElementById("profileNameInfo");

    if (profileNameInfo) {
        profileNameInfo.textContent = userName;
    }

    const profileEmailInfo =
        document.getElementById("profileEmailInfo");

    if (profileEmailInfo) {
        profileEmailInfo.textContent = userEmail;
    }
}

function showSection(sectionName) {

    const sections =
        document.querySelectorAll(".dashboard-section");

    sections.forEach(function (section) {
        section.style.display = "none";
    });

    const selectedSection =
        document.getElementById(sectionName + "Section");

    if (selectedSection) {
        selectedSection.style.display = "block";
    }

    const navItems =
        document.querySelectorAll(".sidebar-menu a");

    navItems.forEach(function (item) {
        item.classList.remove("active");
    });

    const activeItem =
        document.querySelector(
            '[data-section="' + sectionName + '"]'
        );

    if (activeItem) {
        activeItem.classList.add("active");
    }

    window.location.hash = sectionName;
}

function showProfile() {
    showSection("profile");
    loadUserInfo();
}

function showResumes() {
    showSection("resumes");
    loadResumes();
}

async function createResume() {

    const currentToken =
        localStorage.getItem("token");

    if (!currentToken) {

        alert("Please login again.");

        window.location.href =
            "login.html";

        return;
    }

    const title =
        prompt("Enter your resume title:");

    if (title === null) {
        return;
    }

    const trimmedTitle =
        title.trim();

    if (!trimmedTitle) {

        alert("Resume title is required.");

        return;
    }

    try {

        const response =
            await fetch(
                RESUME_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":
                            "Bearer " + currentToken
                    },

                    body: JSON.stringify({
                        title: trimmedTitle
                    })
                }
            );

        if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            alert(
                "Session expired. Please login again."
            );

            window.location.href =
                "login.html";

            return;
        }

        if (!response.ok) {

            let errorMessage =
                "Failed to create resume.";

            try {

                const errorData =
                    await response.json();

                errorMessage =
                    errorData.message ||
                    errorData.error ||
                    errorMessage;

            } catch (error) {
                console.error(
                    "Error parsing response:",
                    error
                );
            }

            throw new Error(errorMessage);
        }

        const newResume =
            await response.json();

        console.log(
            "Created Resume:",
            newResume
        );

        // Backend uses @JsonProperty("_id")
        // but frontend may receive id depending on Jackson configuration.

        const resumeId =
            newResume.id ||
            newResume._id;

        if (resumeId) {

            localStorage.setItem(
                "currentResumeId",
                resumeId
            );
        }

        alert(
            "Resume created successfully!"
        );

        window.location.href =
            "index.html#builder";

    } catch (error) {

        console.error(
            "Create Resume Error:",
            error
        );

        alert(
            error.message ||
            "Unable to create resume."
        );
    }
}

async function loadResumes() {

    const container =
        document.getElementById("resumesContainer");

    const recentContainer =
        document.getElementById("recentResumes");

    const currentToken =
        localStorage.getItem("token");

    if (!currentToken) {
        return;
    }

    try {

        const response =
            await fetch(
                RESUME_API,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + currentToken
                    }
                }
            );

        if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href =
                "login.html";

            return;
        }

        if (!response.ok) {

            throw new Error(
                "Failed to load resumes. Status: " +
                response.status
            );
        }

        const resumes =
            await response.json();

        const resumeList =
            Array.isArray(resumes)
                ? resumes
                : [];

        const resumeCount =
            document.getElementById("resumeCount");

        if (resumeCount) {
            resumeCount.textContent =
                resumeList.length;
        }

        if (recentContainer) {

            recentContainer.innerHTML = "";

            if (resumeList.length === 0) {

                recentContainer.innerHTML = `
                    <div class="empty-resume">

                        <div class="empty-icon">
                            📄
                        </div>

                        <h3>
                            No resumes yet
                        </h3>

                        <p>
                            Start creating your professional resume today.
                        </p>

                        <button
                            class="create-resume-btn"
                            onclick="createResume()">
                            Create Your First Resume
                        </button>

                    </div>
                `;

            } else {

                resumeList
                    .slice(0, 3)
                    .forEach(function (resume) {

                        recentContainer.appendChild(
                            createResumeCard(
                                resume,
                                true
                            )
                        );

                    });
            }
        }

        if (container) {

            container.innerHTML = "";

            if (resumeList.length === 0) {

                container.innerHTML = `
                    <div class="empty-resume">

                        <div class="empty-icon">
                            📄
                        </div>

                        <h3>
                            No resumes yet
                        </h3>

                        <p>
                            Create your first professional resume.
                        </p>

                        <button
                            class="create-resume-btn"
                            onclick="createResume()">
                            Create Resume
                        </button>

                    </div>
                `;

            } else {

                resumeList.forEach(function (resume) {

                    container.appendChild(
                        createResumeCard(
                            resume,
                            false
                        )
                    );

                });
            }
        }

    } catch (error) {

        console.error(
            "Load Resume Error:",
            error
        );

        if (container) {

            container.innerHTML = `
                <div class="empty-resume">

                    <div class="empty-icon">
                        ⚠️
                    </div>

                    <h3>
                        Unable to load resumes
                    </h3>

                    <p>
                        Please make sure your backend is running.
                    </p>

                </div>
            `;
        }

        if (recentContainer) {

            recentContainer.innerHTML = `
                <div class="empty-resume">

                    <div class="empty-icon">
                        ⚠️
                    </div>

                    <h3>
                        Unable to load resumes
                    </h3>

                    <p>
                        Backend connection could not be established.
                    </p>

                </div>
            `;
        }
    }
}

function createResumeCard(resume, recentOnly) {

    const card =
        document.createElement("div");

    card.className =
        "resume-card";

    const title =
        document.createElement("h3");

    title.textContent =
        resume.title ||
        "Untitled Resume";

    const description =
        document.createElement("p");

    description.textContent =
        "Professional Resume";

    card.appendChild(title);
    card.appendChild(description);

    const resumeId =
        resume.id ||
        resume._id;

    if (!recentOnly) {

        const actions =
            document.createElement("div");

        actions.className =
            "resume-actions";

        // EDIT
        const editButton =
            document.createElement("button");

        editButton.className =
            "edit-btn";

        editButton.textContent =
            "✏️ Edit";

        editButton.onclick =
            function () {
                editResume(resumeId);
            };

        // DELETE
        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-btn";

        deleteButton.textContent =
            "🗑 Delete";

        deleteButton.onclick =
            function () {
                deleteResume(resumeId);
            };

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        card.appendChild(actions);

    } else {

        const editButton =
            document.createElement("button");

        editButton.className =
            "edit-btn";

        editButton.textContent =
            "✏️ Edit Resume";

        editButton.onclick =
            function () {
                editResume(resumeId);
            };

        card.appendChild(editButton);
    }

    return card;
}

function editResume(resumeId) {

    if (!resumeId) {

        alert("Resume ID not found.");

        return;
    }

    localStorage.setItem(
        "currentResumeId",
        resumeId
    );

    window.location.href =
        "index.html#builder";
}

async function deleteResume(resumeId) {

    if (!resumeId) {

        alert("Resume ID not found.");

        return;
    }

    const confirmed =
        confirm(
            "Are you sure you want to delete this resume?"
        );

    if (!confirmed) {
        return;
    }

    const currentToken =
        localStorage.getItem("token");

    try {

        const response =
            await fetch(
                RESUME_API + "/" + resumeId,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            "Bearer " + currentToken
                    }
                }
            );

        if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href =
                "login.html";

            return;
        }

        if (!response.ok) {

            throw new Error(
                "Failed to delete resume."
            );
        }

        alert(
            "Resume deleted successfully!"
        );

        await loadResumes();

    } catch (error) {

        console.error(
            "Delete Resume Error:",
            error
        );

        alert(
            error.message ||
            "Failed to delete resume."
        );
    }
}

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentResumeId");

    window.location.href =
        "login.html";
}

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadUserInfo();

        const hash =
            window.location.hash.replace("#", "");

        if (hash === "profile") {

            showProfile();

        } else if (hash === "resumes") {

            showResumes();

        } else {

            showSection("dashboard");
        }

        loadResumes();
    }
);