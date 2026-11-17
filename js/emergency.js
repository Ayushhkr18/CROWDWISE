$(document).ready(function() {
  CrowdCommon.init(function() {
    renderEmergencyScreen();
    renderOfficialBooths();
  });

  $("#btn-lang-toggle").on("click", function() {
    CrowdCommon.toggleLanguage();
    renderEmergencyScreen();
    renderOfficialBooths();
  });

  $("#btn-quick-save").on("click", function() {
    const name = $("#eq-name").val().trim() || "Visitor Family";
    const phone = $("#eq-phone").val().trim() || "112";

    const quickData = {
      familyName: name,
      phone1: phone,
      phone2: "112",
      meet1: "Main Entrance Help Desk",
      meet2: "Serene Garden Rest Stop",
      members: [{ name: "Self", age: "Adult" }]
    };

    localStorage.setItem("cw_family_card", JSON.stringify(quickData));
    $("#quick-create-section").addClass("d-none");
    renderEmergencyScreen();
  });

  function renderEmergencyScreen() {
    const raw = localStorage.getItem("cw_family_card");

    if (!raw) {
      $("#quick-create-section").removeClass("d-none");
      $("#em-family-name").text("Quick Pass Not Configured");
      $("#em-members-badge").text("Set up in 30 seconds above");
      return;
    }

    const data = JSON.parse(raw);
    $("#em-family-name").text(data.familyName || "Family Card");

    const memStr = data.members?.map(m => `${m.name} (${m.age})`).join(" • ") || "All Members";
    $("#em-members-badge").text(memStr);

    $("#call-primary-btn").attr("href", `tel:${data.phone1 || '112'}`);
    $("#call-primary-label").text(`Call ${data.phone1 || 'Primary'}`);

    $("#call-backup-btn").attr("href", `tel:${data.phone2 || '112'}`);
    $("#call-backup-label").text(`Call ${data.phone2 || 'Backup'}`);

    $("#em-meet1").text(data.meet1 || "Main Information Desk");
    $("#em-meet2").text(data.meet2 || "Serene Garden Rest Park");

    const qrString = `LOST COMPANION PASS\nFamily: ${data.familyName}\nMembers: ${memStr}\nPrimary Phone: ${data.phone1}\nBackup Phone: ${data.phone2}\nMeet Point: ${data.meet1}`;

    try {
      const qr = window.qrcode(6, 0);
      qr.addData(qrString);
      qr.make();
      $("#emergency-qr").html(qr.createSvgTag(4, 0));
    } catch (e) {
      console.warn("QR Error:", e);
    }
  }

  function renderOfficialBooths() {
    const list = $("#official-booths-list");
    list.empty();

    const lang = localStorage.getItem("cw_lang") || "en";
    const booths = CrowdCommon.data?.lostBooths || [];

    booths.forEach(b => {
      const name = lang === "hi" ? b.name_hi : b.name_en;
      const loc = lang === "hi" ? b.location_hi : b.location_en;

      const card = $(`
        <div class="p-3 rounded-3" style="background: var(--platinum-silver);">
          <div class="d-flex justify-content-between align-items-center">
            <h4 class="h6 m-0 fw-bold text-dark">${name}</h4>
            <a href="tel:${b.phone}" class="btn btn-sm btn-danger fw-bold">📞 ${b.phone}</a>
          </div>
          <p class="small text-secondary m-0 mt-1">📍 ${loc}</p>
        </div>
      `);
      list.append(card);
    });
  }
});