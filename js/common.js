/**
 * CrowdWise Common Utilities:
 * - Multi-language switching (English & Hindi) without page refresh
 * - Festival dynamic theme orchestrator
 * - Fallback offline JSON data bridge for local double-click execution
 */
const CrowdCommon = {
  data: null,
  langData: null,

  // Fetch JSON with automatic embedded script fallback
  init: function(callback) {
    const currentLang = localStorage.getItem("cw_lang") || "en";
    document.documentElement.lang = currentLang;

    // Load crowd & venue data
    $.getJSON("data/crowd.json")
      .done(function(data) {
        CrowdCommon.data = data;
        CrowdCommon.loadLang(currentLang, callback);
      })
      .fail(function() {
        // Fallback for file:// direct double-clicks
        const raw = $("#embedded-crowd-data").text();
        if (raw) CrowdCommon.data = JSON.parse(raw);
        CrowdCommon.loadLang(currentLang, callback);
      });
  },

  loadLang: function(lang, callback) {
    $.getJSON("data/lang.json")
      .done(function(strings) {
        CrowdCommon.langData = strings;
        CrowdCommon.applyLang(lang);
        CrowdCommon.applyActiveTheme();
        if (callback) callback();
      })
      .fail(function() {
        const raw = $("#embedded-lang-data").text();
        if (raw) CrowdCommon.langData = JSON.parse(raw);
        CrowdCommon.applyLang(lang);
        CrowdCommon.applyActiveTheme();
        if (callback) callback();
      });
  },

  // Apply strings to DOM elements marked with data-i18n
  applyLang: function(lang) {
    localStorage.setItem("cw_lang", lang);
    document.documentElement.lang = lang;
    if (!CrowdCommon.langData || !CrowdCommon.langData[lang]) return;

    $("[data-i18n]").each(function() {
      const key = $(this).attr("data-i18n");
      const val = CrowdCommon.langData[lang][key];
      if (val) {
        if ($(this).is("input[placeholder]")) {
          $(this).attr("placeholder", val);
        } else {
          $(this).text(val);
        }
      }
    });

    $("#btn-lang-toggle").text(lang === "en" ? "हिन्दी" : "English");
  },

  toggleLanguage: function() {
    const current = localStorage.getItem("cw_lang") || "en";
    const next = current === "en" ? "hi" : "en";
    CrowdCommon.applyLang(next);
  },

  // Apply chosen festival color-block theme dynamically
  applyActiveTheme: function() {
    const festivalId = localStorage.getItem("cw_festival") || "diwali";
    const themes = {
      diwali: { bg: "#F6EFD9", card: "#B8442F", accent: "#E0A820", text: "#FFFFFF" },
      durga_puja: { bg: "#FFFFFF", card: "#B8442F", accent: "#E0A820", text: "#FFFFFF" },
      rath_yatra: { bg: "#F6EFD9", card: "#E0A820", accent: "#B8442F", text: "#141211" },
      holi: { bg: "#E6E0F0", card: "#FF7A3D", accent: "#7A8B3C", text: "#FFFFFF" },
      eid: { bg: "#E8ECD6", card: "#1F6F6B", accent: "#E0A820", text: "#FFFFFF" },
      christmas: { bg: "#F6EFD9", card: "#1F6F6B", accent: "#E0262F", text: "#FFFFFF" },
      new_year: { bg: "#1E3A6B", card: "#141211", accent: "#E0A820", text: "#FFFFFF" },
      ganesh_chaturthi: { bg: "#F6EFD9", card: "#FF7A3D", accent: "#7A8B3C", text: "#FFFFFF" },
      onam: { bg: "#E8ECD6", card: "#7A8B3C", accent: "#E0A820", text: "#FFFFFF" }
    };
    const t = themes[festivalId] || themes.diwali;
    document.documentElement.style.setProperty("--theme-bg", t.bg);
    document.documentElement.style.setProperty("--theme-card", t.card);
    document.documentElement.style.setProperty("--theme-accent", t.accent);
    document.documentElement.style.setProperty("--theme-text", t.text);
  }
};