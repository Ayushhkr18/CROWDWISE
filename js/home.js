$(document).ready(function() {
  CrowdCommon.init(function() {
    renderGreeting();
  });

  $("#btn-lang-toggle").on("click", function() {
    CrowdCommon.toggleLanguage();
    renderGreeting();
  });

  $("#btn-logout").on("click", function() {
    localStorage.removeItem("cw_user");
  });

  function renderGreeting() {
    const festId = localStorage.getItem("cw_festival") || "diwali";
    const lang = localStorage.getItem("cw_lang") || "en";
    
    if (!CrowdCommon.data || !CrowdCommon.data.festivals) return;
    const item = CrowdCommon.data.festivals.find(f => f.id === festId);

    if (item) {
      const name = lang === "hi" ? item.name_hi : item.name_en;
      const greeting = lang === "hi" ? item.greeting_hi : item.greeting_en;

      $("#greeting-title").text(name);
      $("#greeting-sub").text(greeting);
    }
  }
});