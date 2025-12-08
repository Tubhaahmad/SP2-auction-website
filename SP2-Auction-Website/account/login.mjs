import { loadNavbar } from "../src/navbar.mjs";
import { saveUser } from "../src/auth.mjs";
import "../src/scss/styles.scss";



loadNavbar();

console.log("Login page loaded!!!");

//login functionality//
const form = document.getElementById("login-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();    
    
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const loginInfo = {
        email: email,
        password: password
    };

    try {
        const response = await fetch("https://v2.api.noroff.dev/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginInfo)
        });

        const data = await response.json();

        if (!response.ok) {
            alert ("Login failed. Please check your email and password.");
            return;
        }

        saveUser(data);
        alert("You are now logged in!");
        window.location.href = "/index.html";

    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred during login. Please try again later.");
    }
});