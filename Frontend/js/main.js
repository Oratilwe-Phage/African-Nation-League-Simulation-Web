// main.js
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js";

// ----------------------------
// ADMIN LOGIN
// ----------------------------
export async function handleAdminLogin(usernameId, passwordId, messageId) {
  const username = document.getElementById(usernameId).value.trim();
  const password = document.getElementById(passwordId).value.trim();
  const message = document.getElementById(messageId);

  if (!username || !password) {
    Swal.fire({ icon: "error", title: "Login Failed", text: "Please enter both username and password." });
    return;
  }

  try {
    const res = await fetch("https://african-nation-league-simulation-web.onrender.com/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Store token in localStorage
      localStorage.setItem("adminToken", data.token);
      Swal.fire({ icon: "success", title: "Login Successful", text: "Redirecting to dashboard..." });
      setTimeout(() => { window.location.href = "dashboard.html"; }, 1500);
    } else {
      Swal.fire({ icon: "error", title: "Login Failed", text: data.message || "Invalid credentials." });
    }
  } catch (err) {
    console.error("Admin login error:", err);
    Swal.fire({ icon: "error", title: "Server Error", text: "Could not login. Try again later." });
  }
}

// ----------------------------
// REQUIRE AUTH FOR PAGES
// ----------------------------
export function requireAuth() {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Unauthorized",
      text: "You must be logged in as admin to access this page.",
    }).then(() => { window.location.href = "adminLogin.html"; });
  }
}

// ----------------------------
// EMAIL SUBSCRIPTION
// ----------------------------
export function handleSubscription(formId, inputId) {
  const form = document.getElementById(formId);
  const emailInput = document.getElementById(inputId);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email) {
      Swal.fire({ icon: "error", title: "Invalid Email", text: "Please enter a valid email." });
      return;
    }

    try {
      const res = await fetch("https://african-nation-league-simulation-web.onrender.com/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({ icon: "success", title: "Subscribed!", text: `Thank you for subscribing, ${email}.` });
        form.reset();
      } else {
        Swal.fire({ icon: "info", title: "Already Subscribed", text: data.message || "You're already subscribed!" });
      }
    } catch (err) {
      console.error("Subscription error:", err);
      Swal.fire({ icon: "error", title: "Server Error", text: "Could not subscribe. Try again later." });
    }
  });
}





