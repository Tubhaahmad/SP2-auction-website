import { loadNavbar } from "../src/navbar.mjs";
import "../src/scss/styles.scss";

loadNavbar();

console.log("Register page loaded!!");

const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const userInfo = {
        name: username,
        email: email,
        password: password
    };

    //user validation//
    const namePattern = /^[a-zA-Z0-9_]+$/;
    if (!namePattern.test(username)) {
        alert("Username can only contain letters, numbers, and underscores.");
        return;
    }

    if (!email.endsWith("@stud.noroff.no")) {
         alert("Please use your @stud.noroff.no student email.");
         return;
    }

    try {
        const response = await fetch("https://v2.api.noroff.dev/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userInfo)
        });
        
        const data = await response.json();

        if (!response.ok) {
            console.log("Registration failed:", data);
            const message = data.errors?.[0]?.message || "Registration failed. Please try again.";
            alert(message);
            return;
        }
        
        alert("Registration successful! You can now log in.");
        window.location.href = "/account/login.html";
    } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred during registration. Please try again later.");    
    }
});