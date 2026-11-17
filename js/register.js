/**
 * Registration logic with native browser-side SHA-256 crypto hashing
 */
$(document).ready(function() {
  CrowdCommon.init();

  $("#btn-lang-toggle").on("click", function() {
    CrowdCommon.toggleLanguage();
  });

  $("#register-form").on("submit", async function(e) {
    e.preventDefault();
    const name = $("#reg-name").val().trim();
    const email = $("#reg-email").val().trim();
    const pass = $("#reg-pass").val();
    const confirm = $("#reg-confirm-pass").val();
    const errBox = $("#reg-error");
    const currentLang = localStorage.getItem("cw_lang") || "en";

    if (pass !== confirm) {
      errBox.text(CrowdCommon.langData[currentLang].err_pass_mismatch).removeClass("d-none");
      return;
    }

    if (pass.length < 6) {
      errBox.text(CrowdCommon.langData[currentLang].err_pass_short).removeClass("d-none");
      return;
    }

    // Hash password with Web Crypto SHA-256
    const msgUint8 = new TextEncoder().encode(pass);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const passHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const users = JSON.parse(localStorage.getItem("cw_registered_users") || "[]");
    users.push({ name, email, hash: passHash });
    localStorage.setItem("cw_registered_users", JSON.stringify(users));

    // Sign in new account and start welcome onboarding tour
    localStorage.setItem("cw_user", JSON.stringify({ email, name }));
    window.location.href = "tour.html";
  });
});