$(document).ready(function() {
  CrowdCommon.init(function() {
    renderTips();
  });

  $("#btn-lang-toggle").on("click", function() {
    CrowdCommon.toggleLanguage();
    renderTips();
  });

  function renderTips() {
    const vType = localStorage.getItem("cw_visitor_type") || "regular";
    const lang = localStorage.getItem("cw_lang") || "en";
    const strings = CrowdCommon.langData ? CrowdCommon.langData[lang] : {};

    const profileTitles = {
      regular: strings.type_regular || "Regular Visitor",
      elderly: strings.type_elderly || "Elderly Visitor",
      family: strings.type_family || "Family with Kids",
      wheelchair: strings.type_wheelchair || "Wheelchair User"
    };

    $("#visitor-profile-label").text(profileTitles[vType] || vType);

    const container = $("#tips-container");
    container.empty();

    const tipsData = (CrowdCommon.data && CrowdCommon.data.tips) ? CrowdCommon.data.tips[vType] : [];

    if (tipsData && tipsData.length > 0) {
      tipsData.forEach((item, index) => {
        const text = lang === "hi" ? item.hi : item.en;
        const card = $(`
          <div class="tip-card">
            <div class="d-flex align-items-start gap-3">
              <span class="badge bg-dark rounded-circle p-2 fs-6 mt-1">${index + 1}</span>
              <p class="fs-5 m-0 fw-semibold text-dark">${text}</p>
            </div>
          </div>
        `);
        container.append(card);
      });
    }
  }
});