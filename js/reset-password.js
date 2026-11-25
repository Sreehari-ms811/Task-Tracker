
import { supabase } from "./supabase.js";

console.log("TVA Password Reset connected!");


// ==========================================
// ELEMENTS
// ==========================================

const resetForm = document.getElementById("reset-form");

const statusMessage = document.getElementById("status-message");

const resetMessage = document.getElementById("reset-message");

const submitButton = resetForm.querySelector('button[type="submit"]');

let recoverySessionReady = false;


// ==========================================
// 1. VERIFY PASSWORD RESET SESSION
// ==========================================

function showResetForm() {

    recoverySessionReady = true;

    resetForm.hidden = false;

    statusMessage.textContent =
        "Reset link verified. You can now create a new password.";

}


function showInvalidLink() {

    if (recoverySessionReady) return;

    statusMessage.textContent =
        "This password reset link is invalid or has expired. Please request a new one.";

}


// Listen for Supabase password recovery event

const { data: authListener } = supabase.auth.onAuthStateChange(
    (event, session) => {

        if (event === "PASSWORD_RECOVERY" && session) {

            showResetForm();

        }

    }
);


// Check the existing session after Supabase initializes

async function checkRecoverySession() {

    try {

        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        const url = new URL(window.location.href);

        const hasRecoveryCode = url.searchParams.has("code");

        const hashParams = new URLSearchParams(
            url.hash.substring(1)
        );

        const isRecoveryLink =
            hashParams.get("type") === "recovery" ||
            (hasRecoveryCode && !!data.session);

        if (data.session && isRecoveryLink) {

            showResetForm();

        } else {

            showInvalidLink();

        }

    } catch (error) {

        console.error("Recovery session error:", error);

        showInvalidLink();

    }

}

checkRecoverySession();


// ==========================================
// 2. SHOW / HIDE PASSWORD
// ==========================================

const toggleButtons = document.querySelectorAll(".toggle-password");

toggleButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const targetId = button.dataset.target;

        const input = document.getElementById(targetId);

        const isHidden = input.type === "password";

        input.type = isHidden ? "text" : "password";

        button.textContent = isHidden ? "Hide" : "Show";

        button.setAttribute(
            "aria-label",
            isHidden ? "Hide password" : "Show password"
        );

        button.setAttribute(
            "aria-pressed",
            String(isHidden)
        );

    });

});


// ==========================================
// 3. UPDATE PASSWORD
// ==========================================

resetForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (!recoverySessionReady) {

        resetMessage.textContent =
            "Your recovery session is not valid. Request a new reset link.";

        return;

    }

    const newPassword =
        document.getElementById("new-password").value;

    const confirmPassword =
        document.getElementById("confirm-password").value;


    // Check password length

    if (newPassword.length < 8) {

        resetMessage.textContent =
            "Password must contain at least 8 characters.";

        return;

    }


    // Check password confirmation

    if (newPassword !== confirmPassword) {

        resetMessage.textContent =
            "Passwords do not match. Please try again.";

        return;

    }


    submitButton.disabled = true;

    submitButton.textContent = "Updating Password...";

    resetMessage.textContent = "";


    try {

        const { error } = await supabase.auth.updateUser({

            password: newPassword

        });

        if (error) throw error;


        // Password successfully updated

        resetMessage.textContent =
            "Password updated successfully! You can now log in.";

        resetForm.reset();

        resetForm.hidden = true;

        recoverySessionReady = false;


        // End recovery session

        await supabase.auth.signOut();


    } catch (error) {

        resetMessage.textContent = error.message;

    } finally {

        submitButton.disabled = false;

        submitButton.textContent = "Update Password";

    }

});
