$(document).ready(function() {
  CrowdCommon.init(function() {
    renderCrowdData();
  });

  $("#btn-lang-toggle").on("click", function() {
    CrowdCommon.toggleLanguage();
    renderCrowdData();
  });

  $("#hour-range").on("input", function() {
    const val = parseInt($(this).val(), 10);
    updateSelectedHour(val);
  });

  function getActiveDataset() {
    const festId = localStorage.getItem("cw_festival") || "diwali";
    const dayType = localStorage.getItem("cw_visit_day") || "weekday";
    const f = (CrowdCommon.data && CrowdCommon.data.festivals)
      ? CrowdCommon.data.festivals.find(x => x.id === festId)
      : null;

    if (!f) return { hourly: [20, 25, 40, 60, 75, 80, 70, 50, 55, 70, 85, 90, 80, 60, 30], start: 6 };
    return {
      hourly: dayType === "weekend" ? f.hourlyWeekend : f.hourlyWeekday,
      start: CrowdCommon.data.startHour || 6
    };
  }

  function renderCrowdData() {
    const { hourly, start } = getActiveDataset();
    const chart = $("#crowd-chart");
    chart.empty();

    let minSum = Infinity;
    let calmStartIndex = 0;
    for (let i = 0; i < hourly.length - 1; i++) {
      const sum = hourly[i] + hourly[i + 1];
      if (sum < minSum) {
        minSum = sum;
        calmStartIndex = i;
      }
    }

    const calmHour1 = start + calmStartIndex;
    const calmHour2 = calmHour1 + 2;
    $("#calm-window-text").text(`${formatHour(calmHour1)} – ${formatHour(calmHour2)}`);

    hourly.forEach((val, idx) => {
      const hour = start + idx;
      let color = "var(--olive)";
      if (val > 70) color = "var(--signal-red)";
      else if (val > 45) color = "var(--mustard)";

      const col = $(`
        <div class="crowd-bar-col" data-hour="${hour}" tabindex="0" role="button" aria-label="${formatHour(hour)}: ${val}% crowd">
          <div class="crowd-bar" style="height: ${Math.max(val, 12)}%; background-color: ${color};"></div>
          <span class="bar-time-label">${hour > 12 ? (hour - 12) + 'P' : hour + 'A'}</span>
        </div>
      `);

      col.on("click", function() {
        const h = parseInt($(this).attr("data-hour"), 10);
        $("#hour-range").val(h);
        updateSelectedHour(h);
      });

      chart.append(col);
    });

    updateSelectedHour(parseInt($("#hour-range").val(), 10));
  }

  function updateSelectedHour(hour) {
    const { hourly, start } = getActiveDataset();
    const idx = hour - start;
    const val = hourly[idx] !== undefined ? hourly[idx] : 50;

    $(".crowd-bar-col").removeClass("active");
    $(`.crowd-bar-col[data-hour="${hour}"]`).addClass("active");

    const lang = localStorage.getItem("cw_lang") || "en";
    const strings = CrowdCommon.langData ? CrowdCommon.langData[lang] : {};

    $("#current-hour-label").text(formatHour(hour));

    const badge = $("#current-level-badge");
    const tip = $("#friendly-swap-tip");

    if (val > 70) {
      badge.css({ "background-color": "var(--signal-red)", "color": "#FFFFFF" })
           .text(strings.crowd_level_high || "High Crowd");
      tip.text(lang === "hi" ? `${formatHour(hour)} पर भारी भीड़। सुबह 7:00 बजे का प्रयास करें।` : `Peak hours at ${formatHour(hour)}. Try 7:00 AM instead.`);
    } else if (val > 45) {
      badge.css({ "background-color": "var(--mustard)", "color": "var(--near-black)" })
           .text(strings.crowd_level_mod || "Moderate Crowd");
      tip.text(lang === "hi" ? "मध्यम गति से आवागमन रहेगा।" : "Manageable pace, steady movement.");
    } else {
      badge.css({ "background-color": "var(--olive)", "color": "#FFFFFF" })
           .text(strings.crowd_level_low || "Low Crowd");
      tip.text(lang === "hi" ? "उत्कृष्ट और शांत समय।" : "Ideal calm period for entry.");
    }

    localStorage.setItem("cw_selected_hour", hour);
  }

  function formatHour(h) {
    const suffix = h >= 12 ? "PM" : "AM";
    const hr = h > 12 ? h - 12 : (h === 0 ? 12 : h);
    return `${hr}:00 ${suffix}`;
  }
});