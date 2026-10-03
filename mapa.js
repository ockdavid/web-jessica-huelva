(function () {
  "use strict";

  /* Datos: idealista, informe de precios de venta de Huelva (septiembre 2026).
     Para actualizar, solo hay que editar este bloque. null = no disponible (n.d.)
     El nombre debe coincidir con el de assets/huelva-zonas.js */
  var CITY = { name: "Huelva (ciudad)", price: 1746, m: -0.5, t: -1.3, a: 8.6, max: "2.125 €/m² (abr 2008)" };
  var ZONES = [
    { name: "Centro",                                       price: 2249, m: 1.5,  t: 1.9,   a: 12.3, max: "2.284 €/m² (feb 2010)", maxv: -1.6 },
    { name: "Isla Chica",                                   price: 1761, m: 2.5,  t: 5.8,   a: 10.3, max: "1.761 €/m² (sep 2026)", maxv: 0 },
    { name: "Las Torres - Guadalupe",                       price: 1682, m: 0.0,  t: -1.2,  a: 21.8, max: "1.727 €/m² (may 2026)", maxv: -2.6 },
    { name: "Nuevo Parque - Los Rosales - Tráfico Pesado",  price: 1596, m: -2.6, t: -10.0, a: null, max: "1.774 €/m² (jun 2026)", maxv: -10.0 },
    { name: "La Hispanidad - Verdeluz",                     price: 1495, m: -2.2, t: -4.2,  a: null, max: "1.615 €/m² (jul 2026)", maxv: -7.4 },
    { name: "La Orden",                                     price: 1384, m: 2.3,  t: 6.9,   a: 11.4, max: "1.384 €/m² (sep 2026)", maxv: 0 }
  ];

  var fmt = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); };
  var pctTxt = function (v) { return (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v).toFixed(1).replace(".", ",") + " %"; };
  var pct = function (v) {
    if (v === null) return '<span class="nd">n.d.</span>';
    return '<span class="' + (v > 0 ? "up" : v < 0 ? "down" : "nd") + '">' + pctTxt(v) + "</span>";
  };
  var range = function (key) {
    var vals = ZONES.map(function (z) { return z[key]; }).filter(function (v) { return v !== null; });
    return { min: Math.min.apply(null, vals), max: Math.max.apply(null, vals) };
  };
  function mix(t) {
    var a = [246, 223, 233], b = [163, 28, 105];
    return "rgb(" + a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }).join(",") + ")";
  }

  var detail = document.getElementById("detail");
  var bars = document.getElementById("bars");
  var mapEl = document.getElementById("map");
  if (!detail || !bars) return;

  var mode = "price";
  var selected = 0;
  var STUB = { setStyle: function () {}, setTooltipContent: function () {}, bringToFront: function () {}, getBounds: null };
  var layers = [];   // capa de Leaflet de cada zona (mismo orden que ZONES)
  var rows = [];

  function colorFor(z) {
    var key = mode === "price" ? "price" : "a";
    if (z[key] === null) return { fill: "#d9d4d6", dark: false };
    var r = range(key);
    var t = r.max === r.min ? 1 : (z[key] - r.min) / (r.max - r.min);
    return { fill: mix(t), dark: t > 0.5 };
  }

  function paint() {
    layers.forEach(function (l, i) {
      var c = colorFor(ZONES[i]);
      l.setStyle({
        fillColor: c.fill, fillOpacity: 0.82,
        color: i === selected ? "#2a1626" : "#ffffff",
        weight: i === selected ? 3 : 1.5,
        dashArray: l.feature && l.feature.properties.aprox ? "6 5" : null
      });
      var z = ZONES[i];
      var val = mode === "price" ? fmt(z.price) + " €" : (z.a === null ? "n.d." : pctTxt(z.a));
      l.setTooltipContent(shortName(z.name) + "<small>" + val + "</small>");
      if (i === selected) l.bringToFront();
    });
    var lo = document.getElementById("scale-lo");
    var hi = document.getElementById("scale-hi");
    if (lo && hi) {
      lo.textContent = mode === "price" ? "Más económica" : "Menor subida";
      hi.textContent = mode === "price" ? "Más cara" : "Mayor subida";
    }
  }

  function shortName(n) {
    return n.length > 22 ? n.split(" - ")[0] + " y otros" : n;
  }

  function select(i, fly) {
    selected = i;
    var z = ZONES[i];
    rows.forEach(function (r, n) { r.classList.toggle("is-selected", n === i); });
    var diff = (z.price / CITY.price - 1) * 100;
    var diffTxt = Math.abs(diff).toFixed(0) + " % " + (diff >= 0 ? "por encima" : "por debajo") + " de la media de la ciudad";
    detail.innerHTML =
      '<span class="tag">Zona ' + (i + 1) + " de " + ZONES.length + "</span>" +
      "<h2>" + z.name + "</h2>" +
      '<div class="big">' + fmt(z.price) + "<small>€/m²</small></div>" +
      '<p class="vs"><b>' + diffTxt + "</b> (" + fmt(CITY.price) + " €/m²)</p>" +
      '<div class="chips">' +
      '<div class="chip"><small>Mensual</small><b>' + pct(z.m) + "</b></div>" +
      '<div class="chip"><small>Trimestral</small><b>' + pct(z.t) + "</b></div>" +
      '<div class="chip"><small>Anual</small><b>' + pct(z.a) + "</b></div></div>" +
      '<p class="maxline">Máximo histórico: <b>' + z.max + "</b> · " + pct(z.maxv) + " respecto al máximo</p>" +
      (layers[i] === STUB ? '<p class="maxline pending">Esta zona aún no aparece dibujada en el mapa.</p>' :
        (layers[i] && layers[i].feature && layers[i].feature.properties.aprox ? '<p class="maxline pending">Límite aproximado: agrupación de barrios oficiales de la zona.</p>' : ""));
    if (layers.length) {
      paint();
      if (fly) {
        try { if (layers[i].getBounds) window.__huelvaMap.panTo(layers[i].getBounds().getCenter(), { animate: true }); } catch (e) { /* sin animación */ }
      }
    }
  }

  /* Ranking de barras (también selecciona la zona) */
  var maxP = Math.max.apply(null, ZONES.map(function (z) { return z.price; }));
  var avgPos = (CITY.price / maxP) * 100;
  ZONES.forEach(function (z, i) {
    var r = document.createElement("div");
    r.className = "bar-row";
    r.tabIndex = 0;
    r.setAttribute("role", "button");
    r.innerHTML = "<span>" + z.name + '</span><div class="track"><div class="fill" data-w="' + (z.price / maxP * 100) +
      '"></div><span class="avg-mark" style="left:' + avgPos + '%"></span></div><b>' + fmt(z.price) + " €</b>";
    r.addEventListener("click", function () { select(i, true); });
    r.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(i, true); }
    });
    bars.appendChild(r);
    rows.push(r);
  });

  /* Mapa de calor */
  function initMap() {
    if (!mapEl || !window.L || !window.HUELVA_ZONAS) {
      if (mapEl) mapEl.innerHTML = '<p style="padding:24px;color:#65515f">No se pudo cargar el mapa. Consulta el ranking de abajo.</p>';
      return;
    }
    var map = L.map(mapEl, { scrollWheelZoom: false, zoomSnap: 0.25, minZoom: 12, maxZoom: 16 });
    window.__huelvaMap = map;
    var esri = "https://server.arcgisonline.com/ArcGIS/rest/services/";
    L.tileLayer(esri + "Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 16, attribution: "Mapa base © Esri, HERE, Garmin, © OpenStreetMap contributors"
    }).addTo(map);
    map.createPane("etiquetas");
    map.getPane("etiquetas").style.zIndex = 450;
    map.getPane("etiquetas").style.pointerEvents = "none";
    L.tileLayer(esri + "Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 16, pane: "etiquetas"
    }).addTo(map);

    /* Barrios oficiales del Ayuntamiento: contexto en gris bajo las zonas de precio */
    if (window.HUELVA_BARRIOS) {
      var barrios = L.geoJSON(window.HUELVA_BARRIOS, {
        style: { fillColor: "#d9d4d6", fillOpacity: 0.5, color: "#ffffff", weight: 1 },
        interactive: false
      }).addTo(map);
      var labels = L.layerGroup();
      barrios.eachLayer(function (l) {
        L.marker(l.getBounds().getCenter(), {
          interactive: false, keyboard: false,
          icon: L.divIcon({ className: "barrio-label", html: "<span>" + l.feature.properties.name + "</span>", iconSize: [0, 0] })
        }).addTo(labels);
      });
      var btn = document.getElementById("toggle-barrios");
      if (btn) btn.addEventListener("click", function () {
        var on = !map.hasLayer(labels);
        if (on) labels.addTo(map); else map.removeLayer(labels);
        btn.classList.toggle("is-on", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }

    var byName = {};
    window.HUELVA_ZONAS.features.forEach(function (f) { byName[f.properties.name] = f; });
    var group = L.featureGroup();
    var all = null;
    if (barrios) {
      all = L.latLngBounds([]);
      barrios.eachLayer(function (l) { if (!/^La Ribera/.test(l.feature.properties.name)) all.extend(l.getBounds()); });
    }
    ZONES.forEach(function (z, i) {
      var f = byName[z.name];
      if (!f) { layers.push(STUB); return; }
      var layer = L.geoJSON(f, { style: { weight: 1.5 } });
      var poly = layer.getLayers()[0];
      poly.bindTooltip("", { permanent: true, direction: "center", className: "zone-label", interactive: true });
      poly.on("click", function () { select(i, false); });
      poly.on("mouseover", function () { poly.setStyle({ fillOpacity: 0.95 }); });
      poly.on("mouseout", function () { poly.setStyle({ fillOpacity: 0.82 }); });
      poly.addTo(group);
      layers.push(poly);
    });
    group.addTo(map);
    map.fitBounds(all || group.getBounds(), { padding: [16, 16] });
    paint();
    select(selected, false);
    setTimeout(function () { map.invalidateSize(); map.fitBounds(all || group.getBounds(), { padding: [16, 16] }); }, 300);
  }

  /* Conmutador Precio / Variación anual */
  Array.prototype.forEach.call(document.querySelectorAll(".mode button[data-mode]"), function (b) {
    b.addEventListener("click", function () {
      mode = b.dataset.mode;
      Array.prototype.forEach.call(document.querySelectorAll(".mode button[data-mode]"), function (x) { x.classList.toggle("is-on", x === b); });
      paint();
    });
  });

  function grow() {
    Array.prototype.forEach.call(bars.querySelectorAll(".fill"), function (f) { f.style.width = f.dataset.w + "%"; });
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { grow(); io.disconnect(); }
    }, { threshold: 0.1 });
    io.observe(bars);
    setTimeout(grow, 4000);
  } else grow();

  select(0, false);
  initMap();

  var h = document.querySelector(".header");
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
  if (h) h.classList.add("is-scrolled");
})();
