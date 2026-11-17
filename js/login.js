/**
 * Login flow handler: verifies SHA-256 hashed credentials or allows guest login
 */
$(document).ready(function() {
  CrowdCommon.init();

  // Switch display language
  $("#btn-lang-toggle").on("click", function() {
    CrowdCommon.toggleLanguage();
  });

  // Password visibility toggle
  $("#btn-toggle-pass").on("click", function() {
    const input = $("#login-pass");
    const isPass = input.attr("type") === "password";
    input.attr("type", isPass ? "text" : "password");
    const lang = localStorage.getItem("cw_lang") || "en";
    $(this).text(isPass ? CrowdCommon.langData[lang].hide_pass : CrowdCommon.langData[lang].show_pass);
  });

  // Guest login action
  $("#btn-guest-login").on("click", function() {
    localStorage.setItem("cw_user", JSON.stringify({ email: "guest@crowdwise.local", name: "Guest Visitor" }));
    redirectAfterAuth();
  });

  // Standard Form Submit
  $("#login-form").on("submit", async function(e) {
    e.preventDefault();
    const email = $("#login-email").val().trim();
    const pass = $("#login-pass").val();
    const errorBox = $("#login-error");

    const users = JSON.parse(localStorage.getItem("cw_registered_users") || "[]");
    
    // Hash input password with native Web Crypto SHA-256
    const msgUint8 = new TextEncoder().encode(pass);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const passHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const matched = users.find(u => u.email === email && u.hash === passHash);

    if (matched) {
      localStorage.setItem("cw_user", JSON.stringify({ email: matched.email, name: matched.name }));
      redirectAfterAuth();
    } else {
      const currentLang = localStorage.getItem("cw_lang") || "en";
      errorBox.text(CrowdCommon.langData[currentLang].err_user_not_found).removeClass("d-none");
    }
  });

  function redirectAfterAuth() {
    const tourDone = localStorage.getItem("cw_tour_completed");
    if (!tourDone) {
      window.location.href = "tour.html";
    } else {
      window.location.href = "choose-festival.html";
    }
  }
});