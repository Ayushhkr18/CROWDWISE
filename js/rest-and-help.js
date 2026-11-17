$(document).ready(function() {
  let activeFilter = "all";

  CrowdCommon.init(function() {
    renderPoints();
  });

  $("#btn-lang-toggle").on("click", function() {
    CrowdCommon.toggleLanguage();
    renderPoints();
  });

  $(".filter-chip").on("click", function() {
    $(".filter-chip").removeClass("active");
    $(this).addClass("active");
    activeFilter = $(this).attr("data-filter");
    renderPoints();
  });

  function renderPoints() {
    const list = $("#points-list");
    list.empty();

    const lang = localStorage.getItem("cw_lang") || "en";
    const strings = CrowdCommon.langData ? CrowdCommon.langData[lang] : {};
    const items = (CrowdCommon.data && CrowdCommon.data.restAndHelp) ? CrowdCommon.data.restAndHelp : [];

    const icons = {
      help: "ℹ️",
      firstaid: "🩹",
      acc_toilet: "♿",
      toilet: "🚻",
      water: "💧",
      seating: "🪑"
    };

    const filtered = items.filter(item => {
      if (activeFilter === "all") return true;
      if (activeFilter === "toilet") return item.type === "toilet" || item.type === "acc_toilet";
      return item.type === activeFilter;
    });

    if (filtered.length === 0) {
      list.html(`<div class="p-4 text-center text-secondary fw-bold">No points found in this category.</div>`);
      return;
    }

    filtered.forEach(p => {
      const name = lang === "hi" ? p.name_hi : p.name_en;
      const loc = lang === "hi" ? p.location_hi : p.location_en;
      const icon = icons[p.type] || "📍";
      const isStepFree = p.accessible;

      const card = $(`
        <div class="point-entry">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <div class="d-flex align-items-center gap-2">
              <span class="fs-4" aria-hidden="true">${icon}</span>
              <h3 class="h5 m-0 fw-bold text-dark">${name}</h3>
            </div>
            <span class="badge ${isStepFree ? 'bg-success' : 'bg-secondary'} px-3 py-2">
              ${isStepFree ? (strings.tag_step_free || "Step-Free Accessible") : (strings.tag_standard || "Standard Access")}
            </span>
          </div>
          <p class="text-secondary m-0 fw-medium">📍 ${loc}</p>
        </div>
      `);

      list.append(card);
    });
  }
});