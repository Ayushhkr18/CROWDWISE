$(document).ready(function() {
  CrowdCommon.init(function() {
    renderFestivalGrid();
  });

  $("#btn-lang-toggle").on("click", function() {
    CrowdCommon.toggleLanguage();
    renderFestivalGrid();
  });

  const festivalStyles = {
    diwali: { bg: "#B8442F", symbol: "🪔" },
    durga_puja: { bg: "#B8442F", symbol: "🌸" },
    rath_yatra: { bg: "#E0A820", symbol: "☸️" },
    holi: { bg: "#FF7A3D", symbol: "🎨" },
    eid: { bg: "#1F6F6B", symbol: "🌙" },
    christmas: { bg: "#1F6F6B", symbol: "⭐" },
    new_year: { bg: "#1E3A6B", symbol: "✨" },
    ganesh_chaturthi: { bg: "#FF7A3D", symbol: "🌺" },
    onam: { bg: "#7A8B3C", symbol: "🌼" }
  };

  function renderFestivalGrid() {
    const grid = $("#festival-grid");
    grid.empty();

    const lang = localStorage.getItem("cw_lang") || "en";
    const selectedFest = localStorage.getItem("cw_festival") || "diwali";
    const list = CrowdCommon.data ? CrowdCommon.data.festivals : [];

    list.forEach(f => {
      const style = festivalStyles[f.id] || { bg: "#B8442F", symbol: "✨" };
      const name = lang === "hi" ? f.name_hi : f.name_en;
      const isSelected = f.id === selectedFest;

      const card = $(`
        <div class="col-12 col-md-6 col-lg-4">
          <div class="festival-tile ${isSelected ? 'active-fest' : ''}" data-fest-id="${f.id}" style="background-color: ${style.bg};">
            <span class="motif-stamp" aria-hidden="true">${style.symbol}</span>
            <h2 class="h2 m-0 text-white">${name}</h2>
          </div>
        </div>
      `);

      card.find(".festival-tile").on("click", function() {
        const festId = $(this).attr("data-fest-id");
        localStorage.setItem("cw_festival", festId);
        CrowdCommon.applyActiveTheme();
        setTimeout(() => {
          window.location.href = "who-is-visiting.html";
        }, 180);
      });

      grid.append(card);
    });
  }
});