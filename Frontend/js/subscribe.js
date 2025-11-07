// js/subscribe.js
document.addEventListener("DOMContentLoaded", () => {
  const subscribeForm = document.getElementById("subscribeForm");

  subscribeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("subscriberEmail").value;

    try {
      const res = await fetch("http://localhost:5000/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({ icon: "success", title: "Subscribed!", text: data.message });
        subscribeForm.reset();
      } else {
        Swal.fire({ icon: "error", title: "Subscription Failed", text: data.message });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Server Error", text: "Could not subscribe. Try again later." });
    }
  });
});
