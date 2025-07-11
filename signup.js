import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "./firebase.js";

const auth = getAuth();


// Tab switching functionality
function switchTab(tabName) {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const tabs = document.querySelectorAll(".auth-tab");

  tabs.forEach((tab) => tab.classList.remove("active"));

  if (tabName === "login") {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    tabs[0].classList.add("active");
  } else {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    tabs[1].classList.add("active");
  }

  // Clear error messages
  document.getElementById("login-error").classList.remove("show");
  document.getElementById("signup-error").classList.remove("show");
}

// Form submission handlers
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const errorElement = document.getElementById("login-error");

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Redirect to TODO app
      window.location.href = "index.html";  // Change this to your todo page
    })
    .catch((error) => {
      showError(errorElement, error.message);
    });
}


function handleSignup(event) {
  event.preventDefault();
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm-password").value;
  const errorElement = document.getElementById("signup-error");

  if (!name || !email || !password || !confirmPassword) {
    showError(errorElement, "Please fill in all fields");
    return;
  }

  if (password !== confirmPassword) {
    showError(errorElement, "Passwords do not match");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Account created successfully!");
      switchTab("login");
    })
    .catch((error) => {
      showError(errorElement, error.message);
    });
}

function showError(element, message) {
  element.textContent = message;
  element.classList.add("show");
  setTimeout(() => {
    element.classList.remove("show");
  }, 5000);
}

function showForgotPassword() {
  const email = prompt("Please enter your email address:");
  if (email) {
    alert("Password reset instructions have been sent to your email.");
  }
}

// Add smooth animations to form inputs
document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll(".form-input input");

  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", function () {
      if (!this.value) {
        this.parentElement.classList.remove("focused");
      }
    });
  });
});


window.switchTab = switchTab;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.showForgotPassword = showForgotPassword;



