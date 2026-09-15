const API_URL = "http://localhost:8080";

function getToken() {
    return localStorage.getItem("token");
}


function saveToken(token) {
    localStorage.setItem("token", token);
}


function removeToken() {
    localStorage.removeItem("token");
}

function getUserData() {

    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch (error) {
        console.error("User data parsing failed:", error);
        return null;
    }
}


function saveUserData(user) {

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );
}


function removeUserData() {
    localStorage.removeItem("user");
}

async function apiRequest(endpoint, options = {}) {

    const token = getToken();

    const headers = {
        ...(options.headers || {})
    };

    if (options.body && !(options.body instanceof FormData)) {

        headers["Content-Type"] =
            "application/json";
    }

    if (token) {

        headers["Authorization"] =
            `Bearer ${token}`;
    }


    try {

        const response =
            await fetch(
                `${API_URL}${endpoint}`,
                {
                    ...options,
                    headers: headers
                }
            );


        let data = null;


        try {

            data =
                await response.json();

        } catch (error) {

            data = null;
        }


        if (!response.ok) {

            if (response.status === 401) {

                console.warn(
                    "Unauthorized request"
                );
            }


            throw new Error(
                data?.message ||
                data?.error ||
                `Request failed (${response.status})`
            );
        }


        return data;


    } catch (error) {

        console.error(
            "API Request Error:",
            error
        );

        throw error;
    }
}

function clearAuthentication() {

    removeToken();
    removeUserData();

    localStorage.removeItem("plan");
}

function requireLogin() {

    const token =
        getToken();

    if (!token) {

        window.location.href =
            "login.html";

        return false;
    }

    return true;
}