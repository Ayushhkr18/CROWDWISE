$(document).ready(function() {
  CrowdCommon.init();

  $("#btn-lang-toggle").on("click", function() {
    CrowdCommon.toggleLanguage();
  });

  let selectedType = localStorage.getItem("cw_visitor_type") || "regular";
  let selectedDay = localStorage.getItem("cw_visit_day") || "weekday";

  $(".visitor-card").removeClass("selected");
  $(`.visitor-card[data-type="${selectedType}"]`).addClass("selected");

  $(".day-selector-btn").removeClass("active");
  $(`.day-selector-btn[data-day="${selectedDay}"]`).addClass("active");

  $(".visitor-card").on("click", function() {
    $(".visitor-card").removeClass("selected");
    $(this).addClass("selected");
    selectedType = $(this).attr("data-type");
  });

  $(".day-selector-btn").on("click", function() {
    $(".day-selector-btn").removeClass("active");
    $(this).addClass("active");
    selectedDay = $(this).attr("data-day");
  });

  $("#btn-continue-home").on("click", function() {
    localStorage.setItem("cw_visitor_type", selectedType);
    localStorage.setItem("cw_visit_day", selectedDay);
    window.location.href = "home.html";
  });
});