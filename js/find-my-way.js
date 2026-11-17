$(document).ready(function() {
  let activeRouteId = "comfort";

  CrowdCommon.init(function() {
    autoSelectRouteByProfile();
    renderMapZones();
    renderMapPoints();
    selectRoute(activeRouteId);
  });

  $("#btn-lang-toggle").on("click", function() {
    CrowdCommon.toggleLanguage();
    renderMapZones();
    renderMapPoints();
    selectRoute(activeRouteId);
  });

  function autoSelectRouteByProfile() {
    const vType = localStorage.getItem("cw_visitor_type") || "regular";
    if (vType === "wheelchair") {
      activeRouteId = "accessible";
    } else if (vType === "elderly") {
      activeRouteId = "comfort";
    } else {
      activeRouteId = "shortest";
    }
  }

  $(".route-chip-btn").on("click", function() {
    activeRouteId = $(this).attr("data-route");
    selectRoute(activeRouteId);
  });

  $("#btn-focus-family").on("click", function() {
    activeRouteId = "comfort";
    selectRoute(activeRouteId);
    
    const familyCircle = $("#marker-p_family_meet");
    if (familyCircle.length) {
      familyCircle.attr("r", 16);
      setTimeout(() => familyCircle.attr("r", 8), 500);
    }
  });

  function getZoneCrowdColor(factor) {
    const festId = localStorage.getItem("cw_festival") || "diwali";
    const dayType = localStorage.getItem("cw_visit_day") || "weekday";
    const hour = parseInt(localStorage.getItem("cw_selected_hour") || "7", 10);
    
    const f = CrowdCommon.data?.festivals?.find(x => x.id === festId);
    const hourly = dayType === "weekend" ? f?.hourlyWeekend : f?.hourlyWeekday;
    const baseHourVal = hourly ? hourly[Math.max(0, hour - 6)] : 35;

    const netCrowd = baseHourVal * factor;

    if (netCrowd > 70) return "#F8D7DA";
    if (netCrowd > 45) return "#FFF3CD";
    return "#D1E7DD";
  }

  function renderMapZones() {
    const svgZones = $("#svg-zones");
    svgZones.empty();

    if (!CrowdCommon.data?.zones) return;

    CrowdCommon.data.zones.forEach(z => {
      const fill = getZoneCrowdColor(z.crowdFactor);
      const g = $(document.createElementNS("http://www.w3.org/2000/svg", "g"));

      const rect = $(document.createElementNS("http://www.w3.org/2000/svg", "rect"))
        .attr({
          x: z.x,
          y: z.y,
          width: z.width,
          height: z.height,
          rx: 14,
          ry: 14,
          fill: fill,
          stroke: "rgba(20, 18, 17, 0.15)",
          "stroke-width": 2,
          class: "zone-rect"
        });

      const label = $(document.createElementNS("http://www.w3.org/2000/svg", "text"))
        .attr({
          x: z.x + 12,
          y: z.y + 24,
          fill: "#141211",
          "font-size": "11px",
          "font-weight": "800",
          "font-family": "Inter, sans-serif"
        })
        .text(z.name);

      g.append(rect).append(label);
      svgZones.append(g);
    });
  }

  function renderMapPoints() {
    const svgPoints = $("#svg-points");
    svgPoints.empty();

    if (!CrowdCommon.data?.points) return;

    CrowdCommon.data.points.forEach(p => {
      const g = $(document.createElementNS("http://www.w3.org/2000/svg", "g"));
      let badgeText = "•";

      if (p.id.includes("ramp")) badgeText = "♿";
      else if (p.id.includes("lift")) badgeText = "🛗";
      else if (p.type === "acc_toilet") badgeText = "🚻";
      else if (p.type === "help") badgeText = "ℹ️";
      else if (p.id.includes("family")) badgeText = "🌳";

      const circle = $(document.createElementNS("http://www.w3.org/2000/svg", "circle"))
        .attr({
          id: `marker-${p.id}`,
          cx: p.x,
          cy: p.y,
          r: 8,
          fill: p.id.includes("family") ? "#E0262F" : "#141211",
          stroke: "#FFFFFF",
          "stroke-width": 2
        });

      const text = $(document.createElementNS("http://www.w3.org/2000/svg", "text"))
        .attr({
          x: p.x + 10,
          y: p.y + 4,
          fill: "#141211",
          "font-size": "10px",
          "font-weight": "700",
          "font-family": "Inter, sans-serif"
        })
        .text(`${badgeText} ${p.name}`);

      g.append(circle).append(text);
      svgPoints.append(g);
    });
  }

  function selectRoute(routeId) {
    $(".route-chip-btn").removeClass("active");
    $(`.route-chip-btn[data-route="${routeId}"]`).addClass("active");

    const route = CrowdCommon.data?.routes?.find(r => r.id === routeId);
    if (!route) return;

    const pointMap = {};
    CrowdCommon.data.points.forEach(pt => { pointMap[pt.id] = pt; });

    let dString = "";
    route.pointIds.forEach((pid, i) => {
      const pt = pointMap[pid];
      if (pt) {
        dString += (i === 0 ? "M " : " L ") + pt.x + " " + pt.y;
      }
    });

    $("#svg-active-route").attr("d", dString);

    const lang = localStorage.getItem("cw_lang") || "en";
    const strings = CrowdCommon.langData ? CrowdCommon.langData[lang] : {};
    const vType = localStorage.getItem("cw_visitor_type") || "regular";
    const speed = (CrowdCommon.data?.walkingSpeeds && CrowdCommon.data.walkingSpeeds[vType])
      ? CrowdCommon.data.walkingSpeeds[vType]
      : 70;

    const walkMinutes = Math.max(2, Math.round(route.distanceMeters / speed));

    $("#metric-walk-time").text(`${walkMinutes} min`);
    $("#metric-crowd").text(route.crowdTag);
    $("#metric-step-free").text(route.stepFree ? (strings.yes || "Yes") : (strings.no || "No"))
      .toggleClass("text-success", route.stepFree)
      .toggleClass("text-danger", !route.stepFree);
    $("#metric-rest-stops").text(route.restStops);
  }
});