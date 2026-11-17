$(document).ready(function() {
  let rating = 5;
  const answers = { q1: "yes", q2: "yes", q3: "yes" };

  CrowdCommon.init();

  $("#btn-lang-toggle").on("click", function() {
    CrowdCommon.toggleLanguage();
  });

  $(".star-rating").on("click", function() {
    rating = parseInt($(this).attr("data-val"), 10);
    $(".star-rating").each(function() {
      const val = parseInt($(this).attr("data-val"), 10);
      $(this).toggleClass("active", val <= rating);
    });
  });

  $(".pill-btn").on("click", function() {
    const q = $(this).attr("data-q");
    $(`.pill-btn[data-q="${q}"]`).removeClass("active");
    $(this).addClass("active");
    answers[q] = $(this).attr("data-val");
  });

  $("#feedback-form").on("submit", function(e) {
    e.preventDefault();

    const payload = {
      festival: localStorage.getItem("cw_festival") || "diwali",
      visitorType: localStorage.getItem("cw_visitor_type") || "regular",
      rating: rating,
      answers: answers,
      comment: $("#fb-comment").val().trim(),
      date: new Date().toISOString()
    };

    const saved = JSON.parse(localStorage.getItem("cw_feedback_log") || "[]");
    saved.push(payload);
    localStorage.setItem("cw_feedback_log", JSON.stringify(saved));

    $("#feedback-form-card").addClass("d-none");
    $("#thank-you-card").removeClass("d-none");
  });
});