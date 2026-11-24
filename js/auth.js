
import { supabase } from "./supabase.js";

console.log("TVA Supabase Authentication connected!");

// Signup form
const signupForm = document.getElementById("signup-form");

if (signupForm) {

    signupForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const message = document.getElementById("signup-message");
        const button = signupForm.querySelector("button");

        button.disabled = true;
        message.textContent = "Creating your account...";

        try {

            const redirectUrl = new URL("../index.html", import.meta.url).href;

            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: name
                    },
                    emailRedirectTo: redirectUrl
                }
            });

            if (error) {
                message.textContent = error.message;
                return;
            }

            if (data.session) {
                message.textContent = "Account created successfully!";
                window.location.href = "index.html";
            } else {
                message.textContent =
                    "Account created! Please verify your email before logging in.";
            }

        } catch (error) {
            message.textContent = "Something went wrong. Please try again.";
            console.error(error);

        } finally {
            button.disabled = false;
        }

    });

}


// Login form
const loginForm = document.getElementById("login-form");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const message = document.getElementById("login-message");
        const button = loginForm.querySelector("button");

        button.disabled = true;
        message.textContent = "Logging in...";

        try {

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                message.textContent = error.message;
                return;
            }

            message.textContent = "Login successful!";

            window.location.href = "index.html";

        } catch (error) {
            message.textContent = "Something went wrong. Please try again.";
            console.error(error);

        } finally {
            button.disabled = false;
        }

    });

}
