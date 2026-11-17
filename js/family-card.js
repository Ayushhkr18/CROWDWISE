$(document).ready(function() {
  let selectedColor = "#E0262F";

  CrowdCommon.init(function() {
    loadSavedCard();
    updateLivePreview();
  });

  $("#btn-lang-toggle").on("click", function() {
    CrowdCommon.toggleLanguage();
    updateLivePreview();
  });

  $(".color-swatch").on("click", function() {
    $(".color-swatch").removeClass("active");
    $(this).addClass("active");
    selectedColor = $(this).attr("data-color");
    $("#badge-color-strip").css("background-color", selectedColor);
  });

  function addMemberRow(name = "", age = "Adult") {
    const row = $(`
      <div class="d-flex gap-2 member-row">
        <input type="text" class="form-control member-name" placeholder="Name" value="${name}" required>
        <select class="form-select member-age" style="width: 120px;">
          <option value="Adult" ${age === 'Adult' ? 'selected' : ''}>Adult</option>
          <option value="Child" ${age === 'Child' ? 'selected' : ''}>Child</option>
          <option value="Elder" ${age === 'Elder' ? 'selected' : ''}>Elder</option>
        </select>
        <button type="button" class="btn btn-outline-danger remove-member-btn">✕</button>
      </div>
    `);
    row.find(".remove-member-btn").on("click", function() {
      if ($(".member-row").length > 1) {
        row.remove();
        updateLivePreview();
      }
    });
    row.find("input, select").on("input change", updateLivePreview);
    $("#members-list").append(row);
  }

  $("#btn-add-member").on("click", function() {
    addMemberRow();
  });

  $("#fc-name, #fc-phone1, #fc-phone2, #fc-meet1, #fc-meet2").on("input", updateLivePreview);

  function loadSavedCard() {
    const raw = localStorage.getItem("cw_family_card");
    if (raw) {
      const data = JSON.parse(raw);
      $("#fc-name").val(data.familyName || "");
      $("#fc-phone1").val(data.phone1 || "");
      $("#fc-phone2").val(data.phone2 || "");
      $("#fc-meet1").val(data.meet1 || "");
      $("#fc-meet2").val(data.meet2 || "");
      selectedColor = data.color || "#E0262F";
      $(`.color-swatch[data-color="${selectedColor}"]`).click();

      $("#members-list").empty();
      if (data.members && data.members.length > 0) {
        data.members.forEach(m => addMemberRow(m.name, m.age));
      } else {
        addMemberRow("Anita", "Adult");
        addMemberRow("Rohan", "Child");
      }
    } else {
      addMemberRow("Anita", "Adult");
      addMemberRow("Rohan", "Child");
    }
  }

  function updateLivePreview() {
    const familyName = $("#fc-name").val() || "Sharma Family";
    const phone1 = $("#fc-phone1").val() || "9876543210";
    const phone2 = $("#fc-phone2").val() || "9123456780";
    const meet1 = $("#fc-meet1").val() || "Family Banyan Tree";
    const meet2 = $("#fc-meet2").val() || "Booth 1 Main Entrance";

    const members = [];
    $(".member-row").each(function() {
      const n = $(this).find(".member-name").val().trim();
      const a = $(this).find(".member-age").val();
      if (n) members.push(`${n} (${a})`);
    });

    $("#pv-title").text(familyName);
    $("#pv-members").text(members.join(" • ") || "None specified");
    $("#pv-phones").text(`${phone1} / ${phone2}`);
    $("#pv-meet1").text(meet1);
    $("#pv-meet2").text(meet2);

    const qrString = `CROWDWISE EMERGENCY PASS\nFamily: ${familyName}\nMembers: ${members.join(", ")}\nPhones: ${phone1}, ${phone2}\nMeeting Points: ${meet1} | ${meet2}\nOfficial Booths: Booth #1 Main Plaza, Booth #2 East Pavilion`;

    try {
      const qr = window.qrcode(6, 0);
      qr.addData(qrString);
      qr.make();
      $("#preview-qr-container").html(qr.createSvgTag(3, 0));
    } catch (e) {
      console.warn("QR size limit reached; reducing payload", e);
    }
  }

  $("#family-card-form").on("submit", function(e) {
    e.preventDefault();
    const members = [];
    $(".member-row").each(function() {
      const name = $(this).find(".member-name").val().trim();
      const age = $(this).find(".member-age").val();
      if (name) members.push({ name, age });
    });

    const cardData = {
      familyName: $("#fc-name").val().trim(),
      phone1: $("#fc-phone1").val().trim(),
      phone2: $("#fc-phone2").val().trim(),
      meet1: $("#fc-meet1").val().trim(),
      meet2: $("#fc-meet2").val().trim(),
      color: selectedColor,
      members: members
    };

    localStorage.setItem("cw_family_card", JSON.stringify(cardData));
    alert("Family safety card saved locally to this device.");
  });

  $("#btn-print").on("click", function() { window.print(); });

  $("#btn-share").on("click", function() {
    if (navigator.share) {
      navigator.share({
        title: "CrowdWise Family Safety Card",
        text: `Emergency Family Card for ${$("#fc-name").val()}. Rendezvous point: ${$("#fc-meet1").val()}`
      }).catch(() => {});
    } else {
      alert("Sharing is supported on mobile browsers. You can print or screenshot this badge.");
    }
  });
});