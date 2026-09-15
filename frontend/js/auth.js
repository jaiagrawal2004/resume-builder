function showMessage(message, type = "error") {

    const messageBox =
        document.getElementById("message");

    if (!messageBox) {
        return;
    }

    messageBox.textContent =
        message;

    messageBox.className =
        `message ${type}`;
}

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            if (!email || !password) {

                showMessage(
                    "Please enter email and password."
                );

                return;
            }


            const button =
                loginForm.querySelector(
                    "button[type='submit']"
                );


            try {

                if (button) {

                    button.disabled = true;

                    button.textContent =
                        "Logging in...";
                }


                showMessage(
                    "Logging in...",
                    "success"
                );


                const data =
                    await apiRequest(
                        "/api/auth/login",
                        {
                            method: "POST",

                            body: JSON.stringify({
                                email: email,
                                password: password
                            })
                        }
                    );


                console.log(
                    "Login response:",
                    data
                );

                const token =
                    data?.token ||
                    data?.accessToken ||
                    data?.jwt ||
                    data?.access_token;


                if (!token) {

                    throw new Error(
                        "JWT token was not received from server."
                    );
                }


                saveToken(token);
                
                if (data.user) {

                    saveUserData(
                        data.user
                    );

                } else {

                    saveUserData({
                        email: email
                    });
                }

                if (data.plan) {

                    localStorage.setItem(
                        "plan",
                        data.plan
                    );
                }

                showMessage(
                    "Login successful! Redirecting...",
                    "success"
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "dashboard.html";

                    },
                    700
                );


            } catch (error) {

                console.error(
                    "Login failed:",
                    error
                );


                showMessage(
                    error.message ||
                    "Login failed. Please try again."
                );


            } finally {

                if (button) {

                    button.disabled = false;

                    button.textContent =
                        "Login";
                }
            }
        }
    );
}

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;

            if (!name) {

                showMessage(
                    "Please enter your full name."
                );

                return;
            }


            if (!email) {

                showMessage(
                    "Please enter your email."
                );

                return;
            }


            if (password.length < 6) {

                showMessage(
                    "Password must contain at least 6 characters."
                );

                return;
            }


            if (password !== confirmPassword) {

                showMessage(
                    "Passwords do not match."
                );

                return;
            }


            const button =
                registerForm.querySelector(
                    "button[type='submit']"
                );


            try {

                if (button) {

                    button.disabled = true;

                    button.textContent =
                        "Creating Account...";
                }


                showMessage(
                    "Creating your account...",
                    "success"
                );


                const data =
                    await apiRequest(
                        "/api/auth/register",
                        {
                            method: "POST",

                            body: JSON.stringify({

                                name: name,

                                email: email,

                                password: password

                            })
                        }
                    );


                console.log(
                    "Register response:",
                    data
                );


                showMessage(
                    "Account created successfully! Redirecting to login...",
                    "success"
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "login.html";

                    },
                    1200
                );


            } catch (error) {

                console.error(
                    "Registration failed:",
                    error
                );


                showMessage(
                    error.message ||
                    "Registration failed. Please try again."
                );


            } finally {

                if (button) {

                    button.disabled = false;

                    button.textContent =
                        "Create Account";
                }
            }
        }
    );
}

function logout() {

    clearAuthentication();

    window.location.href =
        "login.html";
}