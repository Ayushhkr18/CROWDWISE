$(document).ready(function() {
  CrowdCommon.init();

  $("#btn-lang-toggle").on("click", function() {
    CrowdCommon.toggleLanguage();
    renderSlide(currentSlide);
  });

  const slides = [
    { titleKey: "tour_title_1", descKey: "tour_desc_1", bg: "var(--terracotta)" },
    { titleKey: "tour_title_2", descKey: "tour_desc_2", bg: "var(--deep-teal)" },
    { titleKey: "tour_title_3", descKey: "tour_desc_3", bg: "var(--burnt-orange)" },
    { titleKey: "tour_title_4", descKey: "tour_desc_4", bg: "var(--deep-blue)" }
  ];

  let currentSlide = 0;

  function renderSlide(index) {
    const lang = localStorage.getItem("cw_lang") || "en";
    const s = slides[index];
    const strings = CrowdCommon.langData ? CrowdCommon.langData[lang] : {};

    $("#tour-card").css("background-color", s.bg);
    $("#slide-indicator").text((index + 1) + " / 4");
    $("#tour-title").text(strings[s.titleKey] || "");
    $("#tour-desc").text(strings[s.descKey] || "");

    $(".tour-dot").removeClass("active").eq(index).addClass("active");

    if (index === slides.length - 1) {
      $("#btn-next-slide").text(strings.btn_get_started || "Get Started");
    } else {
      $("#btn-next-slide").text(strings.btn_next || "Next");
    }
  }

  function finishTour() {
    localStorage.setItem("cw_tour_completed", "true");
    window.location.href = "choose-festival.html";
  }

  $("#btn-next-slide").on("click", function() {
    if (currentSlide < slides.length - 1) {
      currentSlide++;
      renderSlide(currentSlide);
    } else {
      finishTour();
    }
  });

  $("#btn-skip-tour").on("click", function() {
    finishTour();
  });
});