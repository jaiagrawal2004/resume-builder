// =====================================================
// RESUME BUILDER JAVASCRIPT
// =====================================================

const API_URL = "http://localhost:8080";
const RESUME_API = API_URL + "/api/resumes";

let educationList = [];
let experienceList = [];
let projectsList = [];
let certificationsList = [];
let skillsList = [];

let currentResumeId =
    localStorage.getItem("currentResumeId");

// =====================================================
// SCROLL TO BUILDER
// =====================================================

function scrollToBuilder() {

    const builder =
        document.getElementById("builder");

    if (builder) {

        builder.scrollIntoView({
            behavior: "smooth"
        });
    }
}

// =====================================================
// SELECT TEMPLATE
// =====================================================

function selectTemplate(template) {

    const preview =
        document.getElementById("resumePreview");

    if (!preview) {

        alert("Resume preview nahi mila!");

        return;
    }

    preview.classList.remove(
        "professional",
        "modern",
        "classic",
        "creative",
        "fresher",
        "developer"
    );

    preview.classList.add(template);

    localStorage.setItem(
        "selectedTemplate",
        template
    );

    saveResumeData();

    console.log(
        "Selected template:",
        template
    );

    scrollToBuilder();
}

// =====================================================
// HELPERS
// =====================================================

function getValue(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.value.trim()
        : "";
}

function setInput(id, value) {

    const input =
        document.getElementById(id);

    if (input) {

        input.value =
            value || "";
    }
}

function setText(
    id,
    value,
    defaultText = ""
) {

    const element =
        document.getElementById(id);

    if (!element) {
        return;
    }

    element.textContent =
        value || defaultText;
}

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {

    return escapeHTML(
        value || ""
    );
}

// =====================================================
// PERSONAL INFORMATION
// =====================================================

function updatePersonalInfo() {

    const name =
        getValue("name");

    const location =
        getValue("location");

    const email =
        getValue("email");

    const phone =
        getValue("phone");

    const linkedin =
        getValue("linkedin");

    const github =
        getValue("github");

    setText(
        "previewName",
        name,
        "Your Name"
    );

    setText(
        "previewLocation",
        location
            ? `📍 ${location}`
            : "",
        "📍 Your Location"
    );

    setText(
        "previewEmail",
        email
            ? `✉ ${email}`
            : "",
        "✉ email@example.com"
    );

    setText(
        "previewPhone",
        phone
            ? `📱 ${phone}`
            : "",
        "📱 +91 XXXXX XXXXX"
    );

    setText(
        "previewLinkedin",
        linkedin,
        "LinkedIn"
    );

    setText(
        "previewGithub",
        github,
        "GitHub"
    );
}

// =====================================================
// OBJECTIVE
// =====================================================

function updateObjectivePreview() {

    setText(
        "previewObjective",
        getValue("objective"),
        "Your career objective will appear here."
    );
}

// =====================================================
// SUMMARY
// =====================================================

function updateSummaryPreview() {

    setText(
        "previewSummary",
        getValue("summary"),
        "Your professional summary will appear here."
    );
}

// =====================================================
// ACHIEVEMENTS
// =====================================================

function updateAchievementsPreview() {

    setText(
        "previewAchievements",
        getValue("achievements"),
        "Your achievements will appear here."
    );
}

// =====================================================
// LANGUAGES
// =====================================================

function updateLanguagesPreview() {

    setText(
        "previewLanguages",
        getValue("languages"),
        "Your languages will appear here."
    );
}

// =====================================================
// EDUCATION
// =====================================================

function addEducation() {

    educationList.push({

        degree: "",

        institution: "",

        year: "",

        description: ""
    });

    renderEducation();

    updateEducationPreview();

    updateSectionVisibility();

    saveResumeData();
}

function removeEducation(index) {

    educationList.splice(
        index,
        1
    );

    renderEducation();

    updateEducationPreview();

    updateSectionVisibility();

    saveResumeData();
}

function renderEducation() {

    const container =
        document.getElementById(
            "educationContainer"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (educationList.length === 0) {

        container.innerHTML = `
            <div class="empty-message">
                Click "+ Add" to add education.
            </div>
        `;

        return;
    }

    educationList.forEach(
        function (item, index) {

            const card =
                document.createElement("div");

            card.className =
                "dynamic-card";

            card.innerHTML = `
                <button
                    type="button"
                    class="remove-btn"
                    onclick="removeEducation(${index})"
                >
                    ×
                </button>

                <div class="input-group">

                    <label>
                        Degree / Course
                    </label>

                    <input
                        type="text"
                        value="${escapeAttribute(item.degree)}"
                        placeholder="B.Tech Computer Science"
                        data-field="degree"
                    >

                </div>

                <div class="input-group">

                    <label>
                        Institution
                    </label>

                    <input
                        type="text"
                        value="${escapeAttribute(item.institution)}"
                        placeholder="University / College"
                        data-field="institution"
                    >

                </div>

                <div class="input-group">

                    <label>
                        Year
                    </label>

                    <input
                        type="text"
                        value="${escapeAttribute(item.year)}"
                        placeholder="2022 - 2026"
                        data-field="year"
                    >

                </div>

                <div class="input-group">

                    <label>
                        Description
                    </label>

                    <textarea
                        placeholder="CGPA, coursework, achievements..."
                        data-field="description"
                    >${escapeHTML(item.description)}</textarea>

                </div>
            `;

            container.appendChild(card);

            card
                .querySelectorAll(
                    "input, textarea"
                )
                .forEach(
                    function (input) {

                        input.addEventListener(
                            "input",
                            function () {

                                const field =
                                    this.dataset.field;

                                educationList[index][field] =
                                    this.value;

                                updateEducationPreview();

                                updateSectionVisibility();

                                saveResumeData();
                            }
                        );
                    }
                );
        }
    );
}

function updateEducationPreview() {

    const preview =
        document.getElementById(
            "previewEducation"
        );

    if (!preview) {
        return;
    }

    preview.innerHTML = "";

    if (educationList.length === 0) {

        preview.textContent =
            "Your education will appear here.";

        return;
    }

    educationList.forEach(
        function (item) {

            const previewItem =
                document.createElement("div");

            previewItem.className =
                "preview-item";

            const title =
                document.createElement("h3");

            title.textContent =
                item.degree ||
                "Degree / Course";

            previewItem.appendChild(
                title
            );

            const meta =
                document.createElement("div");

            meta.className =
                "preview-meta";

            meta.textContent =
                (item.institution ||
                    "Institution") +
                (
                    item.year
                        ? ` • ${item.year}`
                        : ""
                );

            previewItem.appendChild(
                meta
            );

            if (item.description) {

                const description =
                    document.createElement("p");

                description.textContent =
                    item.description;

                previewItem.appendChild(
                    description
                );
            }

            preview.appendChild(
                previewItem
            );
        }
    );
}

// =====================================================
// EXPERIENCE
// =====================================================

function addExperience() {

    experienceList.push({

        jobTitle: "",

        company: "",

        duration: "",

        description: ""
    });

    renderExperience();

    updateExperiencePreview();

    updateSectionVisibility();

    saveResumeData();
}

function removeExperience(index) {

    experienceList.splice(
        index,
        1
    );

    renderExperience();

    updateExperiencePreview();

    updateSectionVisibility();

    saveResumeData();
}

function renderExperience() {

    const container =
        document.getElementById(
            "experienceContainer"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (experienceList.length === 0) {

        container.innerHTML = `
            <div class="empty-message">
                Click "+ Add" to add work experience.
            </div>
        `;

        return;
    }

    experienceList.forEach(
        function (item, index) {

            const card =
                document.createElement("div");

            card.className =
                "dynamic-card";

            card.innerHTML = `
                <button
                    type="button"
                    class="remove-btn"
                    onclick="removeExperience(${index})"
                >
                    ×
                </button>

                <div class="input-group">

                    <label>
                        Job Title
                    </label>

                    <input
                        type="text"
                        value="${escapeAttribute(item.jobTitle)}"
                        placeholder="Software Developer"
                        data-field="jobTitle"
                    >

                </div>

                <div class="input-group">

                    <label>
                        Company
                    </label>

                    <input
                        type="text"
                        value="${escapeAttribute(item.company)}"
                        placeholder="Company Name"
                        data-field="company"
                    >

                </div>

                <div class="input-group">

                    <label>
                        Duration
                    </label>

                    <input
                        type="text"
                        value="${escapeAttribute(item.duration)}"
                        placeholder="June 2025 - August 2025"
                        data-field="duration"
                    >

                </div>

                <div class="input-group">

                    <label>
                        Description
                    </label>

                    <textarea
                        placeholder="Describe your responsibilities..."
                        data-field="description"
                    >${escapeHTML(item.description)}</textarea>

                </div>
            `;

            container.appendChild(card);

            card
                .querySelectorAll(
                    "input, textarea"
                )
                .forEach(
                    function (input) {

                        input.addEventListener(
                            "input",
                            function () {

                                const field =
                                    this.dataset.field;

                                experienceList[index][field] =
                                    this.value;

                                updateExperiencePreview();

                                updateSectionVisibility();

                                saveResumeData();
                            }
                        );
                    }
                );
        }
    );
}

function updateExperiencePreview() {

    const preview =
        document.getElementById(
            "previewExperience"
        );

    if (!preview) {
        return;
    }

    preview.innerHTML = "";

    if (experienceList.length === 0) {

        preview.textContent =
            "Your experience will appear here.";

        return;
    }

    experienceList.forEach(
        function (item) {

            const previewItem =
                document.createElement("div");

            previewItem.className =
                "preview-item";

            const title =
                document.createElement("h3");

            title.textContent =
                item.jobTitle ||
                "Job Title";

            previewItem.appendChild(
                title
            );

            const meta =
                document.createElement("div");

            meta.className =
                "preview-meta";

            meta.textContent =
                (item.company ||
                    "Company") +
                (
                    item.duration
                        ? ` • ${item.duration}`
                        : ""
                );

            previewItem.appendChild(
                meta
            );

            if (item.description) {

                const description =
                    document.createElement("p");

                description.textContent =
                    item.description;

                previewItem.appendChild(
                    description
                );
            }

            preview.appendChild(
                previewItem
            );
        }
    );
}

// =====================================================
// PROJECTS
// =====================================================

function addProject() {

    projectsList.push({

        name: "",

        technologies: "",

        link: "",

        description: ""
    });

    renderProjects();

    updateProjectsPreview();

    updateSectionVisibility();

    saveResumeData();
}

function removeProject(index) {

    projectsList.splice(
        index,
        1
    );

    renderProjects();

    updateProjectsPreview();

    updateSectionVisibility();

    saveResumeData();
}

function renderProjects() {

    const container =
        document.getElementById(
            "projectsContainer"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (projectsList.length === 0) {

        container.innerHTML = `
            <div class="empty-message">
                Click "+ Add" to add projects.
            </div>
        `;

        return;
    }

    projectsList.forEach(
        function (item, index) {

            const card =
                document.createElement("div");

            card.className =
                "dynamic-card";

            card.innerHTML = `
                <button
                    type="button"
                    class="remove-btn"
                    onclick="removeProject(${index})"
                >
                    ×
                </button>

                <div class="input-group">

                    <label>
                        Project Name
                    </label>

                    <input
                        type="text"
                        value="${escapeAttribute(item.name)}"
                        placeholder="Resume Builder"
                        data-field="name"
                    >

                </div>

                <div class="input-group">

                    <label>
                        Technologies
                    </label>

                    <input
                        type="text"
                        value="${escapeAttribute(item.technologies)}"
                        placeholder="Java, Spring Boot, HTML, CSS"
                        data-field="technologies"
                    >

                </div>

                <div class="input-group">

                    <label>
                        Project Link
                    </label>

                    <input
                        type="url"
                        value="${escapeAttribute(item.link)}"
                        placeholder="https://github.com/..."
                        data-field="link"
                    >

                </div>

                <div class="input-group">

                    <label>
                        Description
                    </label>

                    <textarea
                        placeholder="Describe your project..."
                        data-field="description"
                    >${escapeHTML(item.description)}</textarea>

                </div>
            `;

            container.appendChild(card);

            card
                .querySelectorAll(
                    "input, textarea"
                )
                .forEach(
                    function (input) {

                        input.addEventListener(
                            "input",
                            function () {

                                const field =
                                    this.dataset.field;

                                projectsList[index][field] =
                                    this.value;

                                updateProjectsPreview();

                                updateSectionVisibility();

                                saveResumeData();
                            }
                        );
                    }
                );
        }
    );
}

function updateProjectsPreview() {

    const preview =
        document.getElementById(
            "previewProjects"
        );

    if (!preview) {
        return;
    }

    preview.innerHTML = "";

    if (projectsList.length === 0) {

        preview.textContent =
            "Your projects will appear here.";

        return;
    }

    projectsList.forEach(
        function (item) {

            const previewItem =
                document.createElement("div");

            previewItem.className =
                "preview-item";

            const title =
                document.createElement("h3");

            title.textContent =
                item.name ||
                "Project Name";

            previewItem.appendChild(
                title
            );

            if (item.technologies) {

                const technologies =
                    document.createElement("div");

                technologies.className =
                    "preview-meta";

                technologies.textContent =
                    item.technologies;

                previewItem.appendChild(
                    technologies
                );
            }

            if (item.description) {

                const description =
                    document.createElement("p");

                description.textContent =
                    item.description;

                previewItem.appendChild(
                    description
                );
            }

            if (item.link) {

                const link =
                    document.createElement("a");

                link.className =
                    "preview-link";

                link.href =
                    item.link;

                link.target =
                    "_blank";

                link.rel =
                    "noopener noreferrer";

                link.textContent =
                    item.link;

                previewItem.appendChild(
                    link
                );
            }

            preview.appendChild(
                previewItem
            );
        }
    );
}

// =====================================================
// CERTIFICATIONS
// =====================================================

function addCertification() {

    certificationsList.push({

        name: "",

        organization: "",

        year: ""
    });

    renderCertifications();

    updateCertificationsPreview();

    updateSectionVisibility();

    saveResumeData();
}

function removeCertification(index) {

    certificationsList.splice(
        index,
        1
    );

    renderCertifications();

    updateCertificationsPreview();

    updateSectionVisibility();

    saveResumeData();
}

function renderCertifications() {

    const container =
        document.getElementById(
            "certificationsContainer"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (certificationsList.length === 0) {

        container.innerHTML = `
            <div class="empty-message">
                Click "+ Add" to add certifications.
            </div>
        `;

        return;
    }

    certificationsList.forEach(
        function (item, index) {

            const card =
                document.createElement("div");

            card.className =
                "dynamic-card";

            card.innerHTML = `
                <button
                    type="button"
                    class="remove-btn"
                    onclick="removeCertification(${index})"
                >
                    ×
                </button>

                <div class="input-group">

                    <label>
                        Certification
                    </label>

                    <input
                        type="text"
                        value="${escapeAttribute(item.name)}"
                        placeholder="Java Programming"
                        data-field="name"
                    >

                </div>

                <div class="input-group">

                    <label>
                        Organization
                    </label>

                    <input
                        type="text"
                        value="${escapeAttribute(item.organization)}"
                        placeholder="Coursera / Udemy / AWS"
                        data-field="organization"
                    >

                </div>

                <div class="input-group">

                    <label>
                        Year
                    </label>

                    <input
                        type="text"
                        value="${escapeAttribute(item.year)}"
                        placeholder="2026"
                        data-field="year"
                    >

                </div>
            `;

            container.appendChild(card);

            card
                .querySelectorAll(
                    "input, textarea"
                )
                .forEach(
                    function (input) {

                        input.addEventListener(
                            "input",
                            function () {

                                const field =
                                    this.dataset.field;

                                certificationsList[index][field] =
                                    this.value;

                                updateCertificationsPreview();

                                updateSectionVisibility();

                                saveResumeData();
                            }
                        );
                    }
                );
        }
    );
}

function updateCertificationsPreview() {

    const preview =
        document.getElementById(
            "previewCertifications"
        );

    if (!preview) {
        return;
    }

    preview.innerHTML = "";

    if (certificationsList.length === 0) {

        preview.textContent =
            "Your certifications will appear here.";

        return;
    }

    certificationsList.forEach(
        function (item) {

            const previewItem =
                document.createElement("div");

            previewItem.className =
                "preview-item";

            const title =
                document.createElement("h3");

            title.textContent =
                item.name ||
                "Certification";

            previewItem.appendChild(
                title
            );

            const meta =
                document.createElement("div");

            meta.className =
                "preview-meta";

            meta.textContent =
                (item.organization ||
                    "Organization") +
                (
                    item.year
                        ? ` • ${item.year}`
                        : ""
                );

            previewItem.appendChild(
                meta
            );

            preview.appendChild(
                previewItem
            );
        }
    );
}

// =====================================================
// SKILLS
// =====================================================

function addSkill() {

    const input =
        document.getElementById(
            "skillInput"
        );

    if (!input) {
        return;
    }

    const skill =
        input.value.trim();

    if (!skill) {
        return;
    }

    const exists =
        skillsList.some(
            function (item) {

                return item.toLowerCase() ===
                    skill.toLowerCase();
            }
        );

    if (exists) {

        input.value = "";

        return;
    }

    skillsList.push(skill);

    input.value = "";

    renderSkills();

    updateSkillsPreview();

    updateSectionVisibility();

    saveResumeData();

    input.focus();
}

function removeSkill(index) {

    skillsList.splice(
        index,
        1
    );

    renderSkills();

    updateSkillsPreview();

    updateSectionVisibility();

    saveResumeData();
}

function renderSkills() {

    const container =
        document.getElementById(
            "skillsContainer"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (skillsList.length === 0) {

        container.innerHTML = `
            <div class="empty-message">
                Add your skills above.
            </div>
        `;

        return;
    }

    skillsList.forEach(
        function (skill, index) {

            const tag =
                document.createElement("span");

            tag.className =
                "skill-tag";

            tag.textContent =
                skill;

            const button =
                document.createElement("button");

            button.type =
                "button";

            button.textContent =
                "×";

            button.onclick =
                function () {

                    removeSkill(index);
                };

            tag.appendChild(button);

            container.appendChild(tag);
        }
    );
}

function updateSkillsPreview() {

    const preview =
        document.getElementById(
            "previewSkills"
        );

    if (!preview) {
        return;
    }

    preview.innerHTML = "";

    if (skillsList.length === 0) {

        preview.textContent =
            "Your skills will appear here.";

        return;
    }

    skillsList.forEach(
        function (skill) {

            const skillElement =
                document.createElement("span");

            skillElement.className =
                "preview-skill";

            skillElement.textContent =
                skill;

            preview.appendChild(
                skillElement
            );
        }
    );
}

// =====================================================
// SECTION VISIBILITY
// =====================================================

function updateSectionVisibility() {

    toggleSection(
        "objectiveSection",
        getValue("objective")
    );

    toggleSection(
        "summarySection",
        getValue("summary")
    );

    toggleSection(
        "educationSection",
        educationList.length > 0
    );

    toggleSection(
        "experienceSection",
        experienceList.length > 0
    );

    toggleSection(
        "projectsSection",
        projectsList.length > 0
    );

    toggleSection(
        "certificationsSection",
        certificationsList.length > 0
    );

    toggleSection(
        "skillsSection",
        skillsList.length > 0
    );

    toggleSection(
        "achievementsSection",
        getValue("achievements")
    );

    toggleSection(
        "languagesSection",
        getValue("languages")
    );
}

function toggleSection(
    id,
    condition
) {

    const section =
        document.getElementById(id);

    if (!section) {
        return;
    }

    section.style.display =
        condition
            ? "block"
            : "none";
}

// =====================================================
// LOCAL STORAGE SAVE
// =====================================================

function saveResumeData() {

    const data = {

        personal: {

            name:
                getValue("name"),

            location:
                getValue("location"),

            email:
                getValue("email"),

            phone:
                getValue("phone"),

            linkedin:
                getValue("linkedin"),

            github:
                getValue("github")
        },

        objective:
            getValue("objective"),

        summary:
            getValue("summary"),

        achievements:
            getValue("achievements"),

        languages:
            getValue("languages"),

        education:
            educationList,

        experience:
            experienceList,

        projects:
            projectsList,

        certifications:
            certificationsList,

        skills:
            skillsList,

        template:
            localStorage.getItem(
                "selectedTemplate"
            ) || "professional"
    };

    localStorage.setItem(
        "resumeData",
        JSON.stringify(data)
    );
}

// =====================================================
// LOCAL STORAGE LOAD
// =====================================================

function loadResumeData() {

    const saved =
        localStorage.getItem(
            "resumeData"
        );

    if (!saved) {
        return;
    }

    try {

        const data =
            JSON.parse(saved);

        if (data.personal) {

            setInput(
                "name",
                data.personal.name
            );

            setInput(
                "location",
                data.personal.location
            );

            setInput(
                "email",
                data.personal.email
            );

            setInput(
                "phone",
                data.personal.phone
            );

            setInput(
                "linkedin",
                data.personal.linkedin
            );

            setInput(
                "github",
                data.personal.github
            );
        }

        setInput(
            "objective",
            data.objective
        );

        setInput(
            "summary",
            data.summary
        );

        setInput(
            "achievements",
            data.achievements
        );

        setInput(
            "languages",
            data.languages
        );

        educationList =
            Array.isArray(data.education)
                ? data.education
                : [];

        experienceList =
            Array.isArray(data.experience)
                ? data.experience
                : [];

        projectsList =
            Array.isArray(data.projects)
                ? data.projects
                : [];

        certificationsList =
            Array.isArray(data.certifications)
                ? data.certifications
                : [];

        skillsList =
            Array.isArray(data.skills)
                ? data.skills
                : [];

        if (data.template) {

            localStorage.setItem(
                "selectedTemplate",
                data.template
            );
        }

    } catch (error) {

        console.error(
            "Resume loading failed:",
            error
        );
    }
}

// =====================================================
// BACKEND DATA MAPPING
// =====================================================

function buildBackendResume() {

    return {

        id:
            currentResumeId || undefined,

        title:
            getValue("name") ||
            "My Resume",

        // NEW
        objective:
            getValue("objective"),

        // NEW
        achievements:
            getValue("achievements"),

        template: {

            theme:
                localStorage.getItem(
                    "selectedTemplate"
                ) || "professional",

            colorPalette: []
        },

        profileInfo: {

            fullName:
                getValue("name"),

            designation:
                "",

            summary:
                getValue("summary"),

            profilePreviewUrl:
                ""
        },

        contactInfo: {

            email:
                getValue("email"),

            phone:
                getValue("phone"),

            location:
                getValue("location"),

            linkedIn:
                getValue("linkedin"),

            github:
                getValue("github"),

            website:
                ""
        },

        workExperience:
            experienceList.map(
                function (item) {

                    return {

                        company:
                            item.company || "",

                        role:
                            item.jobTitle || "",

                        startDate:
                            getStartDate(
                                item.duration
                            ),

                        endDate:
                            getEndDate(
                                item.duration
                            ),

                        description:
                            item.description || ""
                    };
                }
            ),

        education:
            educationList.map(
                function (item) {

                    return {

                        degree:
                            item.degree || "",

                        institution:
                            item.institution || "",

                        startDate:
                            getStartDate(
                                item.year
                            ),

                        endDate:
                            getEndDate(
                                item.year
                            )
                    };
                }
            ),

        skills:
            skillsList.map(
                function (skill) {

                    return {

                        name:
                            skill,

                        progress:
                            0
                    };
                }
            ),

        projects:
            projectsList.map(
                function (item) {

                    return {

                        title:
                            item.name || "",

                        description:
                            item.description || "",

                        github:
                            item.link || "",

                        liveDemo:
                            ""
                    };
                }
            ),

        certifications:
            certificationsList.map(
                function (item) {

                    return {

                        title:
                            item.name || "",

                        issuer:
                            item.organization || "",

                        year:
                            item.year || ""
                    };
                }
            ),

        languages:
            getLanguagesList(),

        interests:
            []
    };
}

// =====================================================
// DATE HELPERS
// =====================================================

function getStartDate(value) {

    if (!value) {
        return "";
    }

    const parts =
        value.split(/\s*-\s*/);

    return parts[0]
        ? parts[0].trim()
        : "";
}

function getEndDate(value) {

    if (!value) {
        return "";
    }

    const parts =
        value.split(/\s*-\s*/);

    if (parts.length > 1) {

        return parts[1].trim();
    }

    return "";
}

// =====================================================
// LANGUAGES
// =====================================================

function getLanguagesList() {

    const value =
        getValue("languages");

    if (!value) {
        return [];
    }

    return value
        .split(",")
        .map(
            function (language) {

                return {

                    name:
                        language.trim(),

                    progress:
                        0
                };
            }
        )
        .filter(
            function (language) {

                return language.name;
            }
        );
}

// =====================================================
// SAVE RESUME TO BACKEND
// =====================================================

async function saveResumeToBackend() {

    const currentToken =
        localStorage.getItem("token");

    if (!currentToken) {

        alert(
            "Please login again."
        );

        window.location.href =
            "login.html";

        return;
    }

    const resumeData =
        buildBackendResume();

    try {

        let response;

        // =================================================
        // UPDATE EXISTING RESUME
        // =================================================

        if (currentResumeId) {

            response =
                await fetch(
                    RESUME_API +
                    "/" +
                    currentResumeId,
                    {

                        method:
                            "PUT",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " +
                                currentToken
                        },

                        body:
                            JSON.stringify(
                                resumeData
                            )
                    }
                );

        }

        // =================================================
        // CREATE NEW RESUME
        // =================================================

        else {

            response =
                await fetch(
                    RESUME_API,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " +
                                currentToken
                        },

                        body:
                            JSON.stringify(
                                resumeData
                            )
                    }
                );
        }

        // =================================================
        // AUTH ERROR
        // =================================================

        if (response.status === 401) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            alert(
                "Session expired. Please login again."
            );

            window.location.href =
                "login.html";

            return;
        }

        // =================================================
        // OTHER ERROR
        // =================================================

        if (!response.ok) {

            let message =
                "Failed to save resume.";

            try {

                const errorData =
                    await response.json();

                message =
                    errorData.message ||
                    errorData.error ||
                    message;

            } catch (error) {

                console.error(
                    "Error parsing backend response:",
                    error
                );
            }

            throw new Error(message);
        }

        // =================================================
        // SUCCESS
        // =================================================

        const savedResume =
            await response.json();

        console.log(
            "Saved Resume:",
            savedResume
        );

        const savedId =
            savedResume.id ||
            savedResume._id;

        if (savedId) {

            currentResumeId =
                savedId;

            localStorage.setItem(
                "currentResumeId",
                savedId
            );
        }

        saveResumeData();

        alert(
            "Resume saved successfully!"
        );

    } catch (error) {

        console.error(
            "Save Resume Error:",
            error
        );

        alert(
            error.message ||
            "Unable to save resume."
        );
    }
}

// =====================================================
// LOAD RESUME FROM BACKEND
// =====================================================

async function loadResumeFromBackend() {

    const currentToken =
        localStorage.getItem("token");

    if (
        !currentToken ||
        !currentResumeId
    ) {

        return;
    }

    try {

        const response =
            await fetch(
                RESUME_API +
                "/" +
                currentResumeId,
                {

                    method:
                        "GET",

                    headers: {

                        "Authorization":
                            "Bearer " +
                            currentToken
                    }
                }
            );

        if (response.status === 401) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "login.html";

            return;
        }

        if (!response.ok) {

            throw new Error(
                "Failed to load resume."
            );
        }

        const resume =
            await response.json();

        console.log(
            "Loaded Resume:",
            resume
        );

        populateResumeFromBackend(
            resume
        );

    } catch (error) {

        console.error(
            "Load Backend Resume Error:",
            error
        );
    }
}

// =====================================================
// POPULATE BACKEND RESUME
// =====================================================

function populateResumeFromBackend(
    resume
) {

    if (!resume) {
        return;
    }

    // =================================================
    // PERSONAL INFO
    // =================================================

    if (resume.profileInfo) {

        setInput(
            "name",
            resume.profileInfo.fullName
        );

        setInput(
            "summary",
            resume.profileInfo.summary
        );
    }

    if (resume.contactInfo) {

        setInput(
            "email",
            resume.contactInfo.email
        );

        setInput(
            "phone",
            resume.contactInfo.phone
        );

        setInput(
            "location",
            resume.contactInfo.location
        );

        setInput(
            "linkedin",
            resume.contactInfo.linkedIn
        );

        setInput(
            "github",
            resume.contactInfo.github
        );
    }

    // =================================================
    // OBJECTIVE
    // =================================================

    setInput(
        "objective",
        resume.objective
    );

    // =================================================
    // ACHIEVEMENTS
    // =================================================

    setInput(
        "achievements",
        resume.achievements
    );

    // =================================================
    // TEMPLATE
    // =================================================

    if (
        resume.template &&
        resume.template.theme
    ) {

        localStorage.setItem(
            "selectedTemplate",
            resume.template.theme
        );
    }

    // =================================================
    // EDUCATION
    // =================================================

    educationList =
        Array.isArray(
            resume.education
        )
            ? resume.education.map(
                function (item) {

                    return {

                        degree:
                            item.degree || "",

                        institution:
                            item.institution || "",

                        year:
                            combineDates(
                                item.startDate,
                                item.endDate
                            ),

                        description:
                            ""
                    };
                }
            )
            : [];

    // =================================================
    // EXPERIENCE
    // =================================================

    experienceList =
        Array.isArray(
            resume.workExperience
        )
            ? resume.workExperience.map(
                function (item) {

                    return {

                        jobTitle:
                            item.role || "",

                        company:
                            item.company || "",

                        duration:
                            combineDates(
                                item.startDate,
                                item.endDate
                            ),

                        description:
                            item.description || ""
                    };
                }
            )
            : [];

    // =================================================
    // SKILLS
    // =================================================

    skillsList =
        Array.isArray(
            resume.skills
        )
            ? resume.skills.map(
                function (item) {

                    return item.name || "";
                }
            )
            : [];

    // =================================================
    // PROJECTS
    // =================================================

    projectsList =
        Array.isArray(
            resume.projects
        )
            ? resume.projects.map(
                function (item) {

                    return {

                        name:
                            item.title || "",

                        technologies:
                            "",

                        link:
                            item.github ||
                            item.liveDemo ||
                            "",

                        description:
                            item.description || ""
                    };
                }
            )
            : [];

    // =================================================
    // CERTIFICATIONS
    // =================================================

    certificationsList =
        Array.isArray(
            resume.certifications
        )
            ? resume.certifications.map(
                function (item) {

                    return {

                        name:
                            item.title || "",

                        organization:
                            item.issuer || "",

                        year:
                            item.year || ""
                    };
                }
            )
            : [];

    // =================================================
    // LANGUAGES
    // =================================================

    if (
        Array.isArray(
            resume.languages
        )
    ) {

        setInput(
            "languages",

            resume.languages
                .map(
                    function (item) {

                        return item.name || "";
                    }
                )
                .filter(Boolean)
                .join(", ")
        );
    }

    // =================================================
    // RENDER EVERYTHING
    // =================================================

    renderEducation();

    renderExperience();

    renderProjects();

    renderCertifications();

    renderSkills();

    updatePersonalInfo();

    updateObjectivePreview();

    updateSummaryPreview();

    updateAchievementsPreview();

    updateLanguagesPreview();

    updateEducationPreview();

    updateExperiencePreview();

    updateProjectsPreview();

    updateCertificationsPreview();

    updateSkillsPreview();

    updateSectionVisibility();

    // =================================================
    // APPLY TEMPLATE
    // =================================================

    const preview =
        document.getElementById(
            "resumePreview"
        );

    const template =
        localStorage.getItem(
            "selectedTemplate"
        );

    if (
        preview &&
        template
    ) {

        preview.classList.remove(
            "professional",
            "modern",
            "classic",
            "creative",
            "fresher",
            "developer"
        );

        preview.classList.add(
            template
        );
    }

    // Save loaded data locally too
    saveResumeData();
}

// =====================================================
// COMBINE DATES
// =====================================================

function combineDates(
    startDate,
    endDate
) {

    if (
        startDate &&
        endDate
    ) {

        return (
            startDate +
            " - " +
            endDate
        );
    }

    return (
        startDate ||
        endDate ||
        ""
    );
}

// =====================================================
// UPDATE ENTIRE RESUME PREVIEW
// =====================================================

function updateResume() {

    updatePersonalInfo();

    updateObjectivePreview();

    updateSummaryPreview();

    updateAchievementsPreview();

    updateLanguagesPreview();

    updateEducationPreview();

    updateExperiencePreview();

    updateProjectsPreview();

    updateCertificationsPreview();

    updateSkillsPreview();

    updateSectionVisibility();

    saveResumeData();
}

// =====================================================
// IMPORTED RESUME HANDLER
// =====================================================

window.handleImportedResume = function (text) {

    if (!text || !text.trim()) {
        alert("Imported resume mein text nahi mila.");
        return;
    }

    console.log("Processing imported resume...");
    console.log("Imported text:", text);

    const resumeText = text
        .replace(/\r/g, "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    // =================================================
    // HELPER
    // =================================================

    function findValue(patterns) {

        for (const pattern of patterns) {

            const match = resumeText.match(pattern);

            if (match && match[1]) {
                return match[1]
                    .trim()
                    .replace(/\s+/g, " ");
            }
        }

        return "";
    }

    // =================================================
    // NAME
    // =================================================

    let name = "";

    const nameMatch = resumeText.match(
        /(?:^|\n)\s*([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+){1,3})\s*(?:\n|$)/
    );

    if (nameMatch) {
        name = nameMatch[1].trim();
    }

    // =================================================
    // EMAIL
    // =================================================

    const emailMatch = resumeText.match(
        /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
    );

    const email = emailMatch
        ? emailMatch[0]
        : "";

    // =================================================
    // PHONE
    // =================================================

    const phoneMatch = resumeText.match(
        /(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/
    );

    const phone = phoneMatch
        ? phoneMatch[0]
        : "";

    // =================================================
    // LINKEDIN
    // =================================================

    const linkedinMatch = resumeText.match(
        /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s]+/i
    );

    const linkedin = linkedinMatch
        ? linkedinMatch[0]
        : "";

    // =================================================
    // GITHUB
    // =================================================

    const githubMatch = resumeText.match(
        /(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s]+/i
    );

    const github = githubMatch
        ? githubMatch[0]
        : "";

    // =================================================
    // LOCATION
    // =================================================

    const location = findValue([
        /(?:location|address|city)\s*[:\-]\s*(.+)/i,
        /(?:location|address)\s*\n\s*(.+)/i
    ]);

    // =================================================
    // OBJECTIVE
    // =================================================

    let objective = "";

    const objectiveMatch = resumeText.match(
        /(?:career objective|objective|career goal)\s*:?\s*\n?([\s\S]*?)(?=\n\s*(?:professional summary|summary|education|experience|work experience|skills|projects|certifications|achievements|languages)\b)/i
    );

    if (objectiveMatch) {

        objective = objectiveMatch[1]
            .trim()
            .replace(/\n+/g, " ");
    }

    // =================================================
    // SUMMARY
    // =================================================

    let summary = "";

    const summaryMatch = resumeText.match(
        /(?:professional summary|summary|profile|about me)\s*:?\s*\n?([\s\S]*?)(?=\n\s*(?:career objective|objective|education|experience|work experience|skills|projects|certifications|achievements|languages)\b)/i
    );

    if (summaryMatch) {

        summary = summaryMatch[1]
            .trim()
            .replace(/\n+/g, " ");
    }

    // =================================================
    // SKILLS
    // =================================================

    let importedSkills = [];

    const skillsMatch = resumeText.match(
        /(?:technical skills|skills|key skills|skills & technologies)\s*:?\s*\n?([\s\S]*?)(?=\n\s*(?:education|experience|work experience|projects|certifications|achievements|languages|interests)\b)/i
    );

    if (skillsMatch) {

        importedSkills = skillsMatch[1]
            .split(/[,|•\n]/)
            .map(skill => skill.trim())
            .filter(
                skill =>
                    skill.length > 1 &&
                    skill.length < 50
            );
    }

    // =================================================
    // REMOVE DUPLICATE SKILLS
    // =================================================

    importedSkills = importedSkills.filter(
        (skill, index, array) =>
            array.findIndex(
                item =>
                    item.toLowerCase() ===
                    skill.toLowerCase()
            ) === index
    );

    // =================================================
    // FILL FORM
    // =================================================

    setInput("name", name);
    setInput("location", location);
    setInput("email", email);
    setInput("phone", phone);
    setInput("linkedin", linkedin);
    setInput("github", github);

    setInput("objective", objective);
    setInput("summary", summary);

    // =================================================
    // SKILLS
    // =================================================

    if (importedSkills.length > 0) {

        skillsList = importedSkills;

        renderSkills();

        updateSkillsPreview();
    }

    // =================================================
    // UPDATE PREVIEW
    // =================================================

    updatePersonalInfo();
    updateObjectivePreview();
    updateSummaryPreview();
    updateAchievementsPreview();
    updateLanguagesPreview();

    updateEducationPreview();
    updateExperiencePreview();
    updateProjectsPreview();
    updateCertificationsPreview();
    updateSkillsPreview();

    updateSectionVisibility();

    // =================================================
    // SAVE LOCAL DATA
    // =================================================

    saveResumeData();

    // =================================================
    // SCROLL TO BUILDER
    // =================================================

    const builder =
        document.getElementById("builder");

    if (builder) {

        builder.scrollIntoView({
            behavior: "smooth"
        });
    }

    console.log(
        "Imported resume processed successfully."
    );

    alert(
        "Resume data builder mein load ho gaya!"
    );
};

// =====================================================
// DOWNLOAD / PRINT
// =====================================================

function downloadResume() {

    const resume =
        document.getElementById(
            "resumePreview"
        );

    if (!resume) {

        alert(
            "Resume preview not found."
        );

        return;
    }

    saveResumeData();

    window.print();
}

// =====================================================
// ENTER KEY FOR SKILLS
// =====================================================

document.addEventListener(
    "keydown",
    function (event) {

        const input =
            document.getElementById(
                "skillInput"
            );

        if (
            input &&
            document.activeElement === input &&
            event.key === "Enter"
        ) {

            event.preventDefault();

            addSkill();
        }
    }
);

// =====================================================
// INPUT LIVE PREVIEW
// =====================================================

document.addEventListener(
    "input",
    function (event) {

        const id =
            event.target.id;

        if (
            id === "name" ||
            id === "location" ||
            id === "email" ||
            id === "phone" ||
            id === "linkedin" ||
            id === "github"
        ) {

            updatePersonalInfo();
        }

        if (id === "objective") {

            updateObjectivePreview();
        }

        if (id === "summary") {

            updateSummaryPreview();
        }

        if (id === "achievements") {

            updateAchievementsPreview();
        }

        if (id === "languages") {

            updateLanguagesPreview();
        }

        updateSectionVisibility();

        saveResumeData();
    }
);

// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        // First load local data
        loadResumeData();

        // Render dynamic sections
        renderEducation();

        renderExperience();

        renderProjects();

        renderCertifications();

        renderSkills();

        // Update preview
        updatePersonalInfo();

        updateObjectivePreview();

        updateSummaryPreview();

        updateAchievementsPreview();

        updateLanguagesPreview();

        updateEducationPreview();

        updateExperiencePreview();

        updateProjectsPreview();

        updateCertificationsPreview();

        updateSkillsPreview();

        updateSectionVisibility();

        // =================================================
        // APPLY SAVED TEMPLATE
        // =================================================

        const savedTemplate =
            localStorage.getItem(
                "selectedTemplate"
            );

        const preview =
            document.getElementById(
                "resumePreview"
            );

        if (
            preview &&
            savedTemplate
        ) {

            preview.classList.remove(
                "professional",
                "modern",
                "classic",
                "creative",
                "fresher",
                "developer"
            );

            preview.classList.add(
                savedTemplate
            );
        }

        // =================================================
        // LOAD FROM MONGODB
        // =================================================

        if (currentResumeId) {

            await loadResumeFromBackend();
        }
    }
);

// ========================================
// LIGHT / DARK THEME
// ========================================

function applyTheme(theme) {

    const button = document.getElementById("themeToggle");

    if (theme === "dark") {

        document.body.classList.add("dark-theme");

        if (button) {
            button.textContent = "☀️ Light";
        }

    } else {

        document.body.classList.remove("dark-theme");

        if (button) {
            button.textContent = "🌙 Dark";
        }
    }

    localStorage.setItem("theme", theme);
}


function toggleTheme() {

    const currentTheme =
        localStorage.getItem("theme") || "light";

    const newTheme =
        currentTheme === "dark"
            ? "light"
            : "dark";

    applyTheme(newTheme);
}


// Restore saved theme
document.addEventListener("DOMContentLoaded", function () {

    const savedTheme =
        localStorage.getItem("theme") || "light";

    applyTheme(savedTheme);

});

// =====================================================
// PREMIUM SUBSCRIPTION CHECK
// =====================================================

let isPremiumUser = false;

async function checkPremiumSubscription() {

    const token = localStorage.getItem("token");

    if (!token) {

        isPremiumUser = false;

        localStorage.setItem(
            "subscriptionPlan",
            "BASIC"
        );

        updatePremiumUI();
        updateCurrentPlanUI("FREE");

        return;
    }

    try {

        const response = await fetch(
            API_URL + "/api/auth/profile",
            {
                method: "GET",

                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!response.ok) {

            isPremiumUser = false;

            localStorage.setItem(
                "subscriptionPlan",
                "BASIC"
            );

            updatePremiumUI();
            updateCurrentPlanUI("FREE");

            return;
        }

        const user = await response.json();

        console.log(
            "Current subscription:",
            user.subscriptionPlan
        );

        isPremiumUser =
            String(user.subscriptionPlan || "")
                .toUpperCase() === "PREMIUM";


        if (isPremiumUser) {

            localStorage.setItem(
                "subscriptionPlan",
                "PREMIUM"
            );

            updateCurrentPlanUI("PREMIUM");

        } else {

            localStorage.setItem(
                "subscriptionPlan",
                "BASIC"
            );

            updateCurrentPlanUI("FREE");
        }

        updatePremiumUI();

    } catch (error) {

        console.error(
            "Premium subscription check failed:",
            error
        );

        isPremiumUser = false;

        localStorage.setItem(
            "subscriptionPlan",
            "BASIC"
        );

        updatePremiumUI();
        updateCurrentPlanUI("FREE");
    }
}

function updateCurrentPlanUI(plan) {

    const normalizedPlan =
        String(plan || "FREE").toUpperCase();

    const currentPlan =
        document.getElementById("currentPlan");

    const currentPlanDescription =
        document.getElementById(
            "currentPlanDescription"
        );

    if (!currentPlan) {
        console.warn(
            "Current plan element not found."
        );
        return;
    }

    if (normalizedPlan === "PREMIUM") {

        currentPlan.textContent = "PREMIUM";

        currentPlan.style.color = "#6366f1";

        if (currentPlanDescription) {

            currentPlanDescription.textContent =
                "🎉 You are currently using the Premium plan.";
        }

    } else {

        currentPlan.textContent = "FREE";

        currentPlan.style.color = "#6366f1";

        if (currentPlanDescription) {

            currentPlanDescription.textContent =
                "You are currently using the Free plan.";
        }
    }
}

// =====================================================
// PREMIUM UI
// =====================================================

function updatePremiumUI() {

    const premiumElements =
        document.querySelectorAll(
            "[data-premium]"
        );

    premiumElements.forEach(
        function (element) {

            if (isPremiumUser) {

                element.classList.remove(
                    "premium-locked"
                );

                element.removeAttribute(
                    "data-premium-locked"
                );

            } else {

                element.classList.add(
                    "premium-locked"
                );

                element.setAttribute(
                    "data-premium-locked",
                    "true"
                );
            }
        }
    );
}


// =====================================================
// PREMIUM ACCESS CHECK
// =====================================================

function requirePremium() {

    if (isPremiumUser) {
        return true;
    }

    alert(
        "💎 Premium Feature\n\n" +
        "This feature is available only for Premium users.\n\n" +
        "Please purchase the Premium plan for ₹199/month."
    );

    const plansSection =
        document.getElementById("plans");

    if (plansSection) {

        plansSection.scrollIntoView({
            behavior: "smooth"
        });
    }

    return false;
}


// =====================================================
// REFRESH PREMIUM STATUS
// =====================================================

window.refreshPremiumStatus =
    checkPremiumSubscription;


// =====================================================
// INITIAL PREMIUM CHECK
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        checkPremiumSubscription();

    }
);

// ========================================
// PREMIUM FEATURES
// ========================================

function openAIBuilder() {

    if (!requirePremium()) {
        return;
    }

    window.location.href = "ai-builder.html";
}


// ========================================
// ATS CHECKER
// ========================================

function openATSChecker() {

    if (!requirePremium()) {
        return;
    }

    alert(
        "📊 ATS Resume Checker\n\n" +
        "Premium ATS Checker will analyze:\n\n" +
        "✓ ATS Score\n" +
        "✓ Missing Keywords\n" +
        "✓ Skills Match\n" +
        "✓ Resume Formatting\n" +
        "✓ Improvement Suggestions\n\n" +
        "Your Premium access is active."
    );

}


// ========================================
// AI CONTENT IMPROVEMENT
// ========================================

function improveResumeWithAI() {

    if (!requirePremium()) {
        return;
    }

    alert(
        "🤖 AI Content Improvement\n\n" +
        "Premium AI feature unlocked successfully!"
    );

}

// =====================================================
// SWITCH TO FREE PLAN
// =====================================================

async function selectFreePlan() {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    try {

        const response = await fetch(
            API_URL + "/api/auth/change-plan",
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },

                body: JSON.stringify({
                    plan: "BASIC"
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to switch to Free plan."
            );
        }

        // Update frontend immediately
        isPremiumUser = false;

        localStorage.setItem(
            "subscriptionPlan",
            "BASIC"
        );

        updatePremiumUI();
        updateCurrentPlanUI("FREE");

        alert("✅ Free plan activated successfully!");

    } catch (error) {

        console.error(
            "Free plan error:",
            error
        );

        alert(
            "❌ Unable to switch to Free plan.\n\n" +
            error.message
        );
    }
}