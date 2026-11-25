
import { supabase } from "./supabase.js";

console.log("TVA Supabase Authentication connected!");

// =============================
// SIGNUP
// =============================

const signupForm = document.getElementById("signup-form");

if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const message = document.getElementById("signup-message");
        const button = signupForm.querySelector('button[type="submit"]');

        message.textContent = "";
        button.disabled = true;
        button.textContent = "Creating account...";

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: name
                    }
                }
            });

            if (error) throw error;

            if (data.session) {
                message.textContent = "Account created successfully!";
                window.location.href = "dashboard.html";
            } else {
                message.textContent =
                    "Account created! Please check your email to verify your account.";
            }

        } catch (error) {
            message.textContent = error.message;
        } finally {
            button.disabled = false;
            button.textContent = "Create Account";
        }
    });
}


// =============================
// LOGIN
// =============================

const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const message = document.getElementById("login-message");
        const button = loginForm.querySelector('button[type="submit"]');

        message.textContent = "";
        button.disabled = true;
        button.textContent = "Logging in...";

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            message.textContent = "Login successful!";
            window.location.href = "dashboard.html";

        } catch (error) {
            message.textContent = error.message;
        } finally {
            button.disabled = false;
            button.textContent = "Login";
        }
    });
}
