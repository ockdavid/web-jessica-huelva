(function () {
  "use strict";

  /* =====================================================================
     OPERACIONES DE EJEMPLO (datos ficticios). Editar este bloque para
     cambiar o añadir operaciones; el resto se calcula solo.
     tipo: "tradicional" | "habitaciones" | "flip" | "hogar"
     ===================================================================== */
  var ITP = 0.07; // Andalucía

  var OPS = [
    { id: "isla-chica-tradicional", tipo: "tradicional", foto: "bloque-de-pisos-huelva.webp",
      titulo: "Piso reformado en Isla Chica", zona: "Isla Chica", fecha: "Cerrada en mayo de 2026",
      m2: 78, hab: 3, banos: 1, planta: "3ª con ascensor",
      compra: 98000, gastosCompra: 1900, reforma: 9500, mobiliario: 0,
      financiado: 0.7, interes: 0.029, plazo: 30, alquilerMes: 690,
      gastosAnuales: [["IBI y basuras", 260], ["Seguros", 300], ["Comunidad", 360], ["Mantenimiento", 300], ["Vacíos", 500]],
      historia: "Piso de tres habitaciones con cocina y baño por renovar. Se negoció el precio a la baja por el estado del edificio y se hizo una reforma media con cocina nueva, baño y pintura. Se alquiló en tres semanas a una familia con contrato de larga duración.",
      leccion: "Con una reforma contenida y un buen inquilino, un piso de zona media deja una rentabilidad estable y un cash flow que ya paga la hipoteca." },

    { id: "centro-habitaciones", tipo: "habitaciones", foto: "calle-concepci-n-huelva.webp",
      titulo: "Piso de 4 habitaciones en el Centro", zona: "Centro", fecha: "Cerrada en febrero de 2026",
      m2: 112, hab: 4, banos: 2, planta: "2ª con ascensor",
      compra: 165000, gastosCompra: 2400, reforma: 22000, mobiliario: 5500,
      financiado: 0.8, interes: 0.029, plazo: 30, habitaciones: [390, 370, 360, 340],
      gastosAnuales: [["IBI y basuras", 320], ["Seguros", 350], ["Comunidad", 720], ["Mantenimiento", 1000], ["Suministros", 2400], ["Limpieza", 720], ["Vacíos", 1000]],
      historia: "Piso amplio y céntrico, con cuatro dormitorios y dos baños. Se reformó para que cada habitación fuera independiente y se amuebló entero. Cerca de la universidad y del centro, se alquiló por habitaciones a estudiantes y trabajadores.",
      leccion: "Alquilar por habitaciones multiplica los ingresos, pero también los gastos y la gestión. La rentabilidad sube, y el cash flow depende de mantenerlo lleno." },

    { id: "reina-victoria-flip", tipo: "flip", foto: "casas-en-el-barrio-reina-victoria.webp",
      titulo: "Casa a reformar en Barrio Reina Victoria", zona: "Reina Victoria - Matadero", fecha: "Vendida en abril de 2026",
      m2: 96, hab: 3, banos: 2, planta: "Casa de dos plantas",
      compra: 118000, gastosCompra: 1600, reforma: 34000, mobiliario: 2800, gastosVarios: 2600,
      venta: 198000, comisionVenta: 5000, meses: 7,
      historia: "Casa antigua con mucho encanto en un barrio con identidad propia. Se compró por debajo del mercado por su estado, se rehabilitó por completo y se preparó para la venta con una pequeña puesta en escena.",
      leccion: "En una compraventa, el beneficio se decide al comprar: el precio de entrada, el presupuesto de la reforma y el plazo mandan más que el precio de venta." },

    { id: "san-antonio-tradicional", tipo: "tradicional", foto: "balc-n-concepci-n-20-huelva.webp",
      titulo: "Piso con balcón en San Antonio", zona: "San Antonio", fecha: "Cerrada en septiembre de 2025",
      m2: 64, hab: 2, banos: 1, planta: "1ª sin ascensor",
      compra: 84000, gastosCompra: 1700, reforma: 7000, mobiliario: 0,
      financiado: 0.8, interes: 0.03, plazo: 30, alquilerMes: 610,
      gastosAnuales: [["IBI y basuras", 230], ["Seguros", 290], ["Comunidad", 240], ["Mantenimiento", 300], ["Vacíos", 450]],
      historia: "Piso pequeño y bien distribuido en un edificio con fachada cuidada. Solo necesitó un lavado de cara: pintura, suelos y baño. Al ser un tamaño muy demandado, se alquiló en pocos días.",
      leccion: "Los pisos pequeños en zonas céntricas se alquilan rápido y con poca reforma. Con financiación, el dinero propio que se aporta es bajo." },

    { id: "torres-flip", tipo: "flip", foto: "hilera-de-casas-barrio-de-reina-victoria.webp",
      titulo: "Vivienda reformada en Las Torres - Guadalupe", zona: "Las Torres - Guadalupe", fecha: "Vendida en enero de 2026",
      m2: 88, hab: 3, banos: 1, planta: "Vivienda unifamiliar adosada",
      compra: 92000, gastosCompra: 1500, reforma: 28000, mobiliario: 2500, gastosVarios: 2200,
      venta: 158000, comisionVenta: 4000, meses: 6,
      historia: "Vivienda adosada con distribución anticuada. Se reformó la cocina, el baño y la zona de día, abriendo espacios. Salió al mercado con buenas fotos y se vendió en pocas semanas.",
      leccion: "Una reforma bien elegida no es la más cara, sino la que más valor aporta al comprador final por cada euro invertido." },

    { id: "isla-chica-hogar", tipo: "hogar", foto: "vivienda-inglesa-barrio-de-reina-victoria.webp",
      titulo: "Hogar familiar en Isla Chica", zona: "Isla Chica", fecha: "Cerrada en marzo de 2026",
      m2: 96, hab: 3, banos: 2, planta: "Vivienda de tres plantas",
      precioAnuncio: 185000, compra: 167000, gastosCompra: 2100, reforma: 0, mobiliario: 0, precioZonaM2: 1761,
      visitas: 14, semanas: 9,
      historia: "Una familia buscaba su primera vivienda para quedarse. Tras 14 visitas filtradas se eligió una casa con buen estado general. Se revisaron la nota simple, el acta de la comunidad y las derramas, y se negoció una rebaja del precio de salida.",
      leccion: "Para vivir, ganar tiempo y evitar sorpresas importa tanto como el precio: revisar bien la documentación antes de reservar protege la compra." }
  ];

  var CREDITOS = {
    "bloque-de-pisos-huelva.webp": { t: "Bloque de pisos, Huelva", a: "Jose A.", l: "CC BY 2.0", u: "https://commons.wikimedia.org/wiki/File:Bloque_de_pisos,_Huelva.jpg" },
    "calle-concepci-n-huelva.webp": { t: "Calle Concepción, Huelva", a: "Jose A.", l: "CC BY 2.0", u: "https://commons.wikimedia.org/wiki/File:Calle_Concepci%C3%B3n,_Huelva.jpg" },
    "casas-en-el-barrio-reina-victoria.webp": { t: "Casas en el Barrio Reina Victoria", a: "FJavier GómezL", l: "CC BY-SA 4.0", u: "https://commons.wikimedia.org/wiki/File:Casas_en_el_Barrio_Reina_Victoria.jpg" },
    "balc-n-concepci-n-20-huelva.webp": { t: "Balcón - Concepción 20, Huelva", a: "Jose A.", l: "CC BY 2.0", u: "https://commons.wikimedia.org/wiki/File:Balc%C3%B3n_-_Concepci%C3%B3n_20,_Huelva.jpg" },
    "hilera-de-casas-barrio-de-reina-victoria.webp": { t: "Hilera de casas - Barrio de Reina Victoria", a: "Jose A.", l: "CC BY 2.0", u: "https://commons.wikimedia.org/wiki/File:Hilera_de_casas_-_Barrio_de_Reina_Victoria.jpg" },
    "vivienda-inglesa-barrio-de-reina-victoria.webp": { t: "Vivienda inglesa - Barrio de Reina Victoria", a: "Jose A.", l: "CC BY 2.0", u: "https://commons.wikimedia.org/wiki/File:Vivienda_inglesa_-_Barrio_de_Reina_Victoria.jpg" }
  };

  /* ---------- Cálculo (mismas fórmulas que las calculadoras de rentabilidad) ---------- */
  var miles = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); };
  var eur = function (n) { return miles(n) + " €"; };
  var pct = function (n) { return n.toFixed(1).replace(".", ",") + " %"; };
  var sum = function (arr, i) { return arr.reduce(function (s, x) { return s + x[i]; }, 0); };

  function calc(o) {
    var itp = o.compra * ITP;
    var r = { itp: itp };
    if (o.tipo === "tradicional" || o.tipo === "habitaciones") {
      r.total = o.compra + itp + o.gastosCompra + o.reforma + o.mobiliario;
      r.hipoteca = o.compra * o.financiado;
      r.aportado = r.total - r.hipoteca;
      r.rentaMes = o.habitaciones ? o.habitaciones.reduce(function (a, b) { return a + b; }, 0) : o.alquilerMes;
      r.rentaAnual = r.rentaMes * 12;
      r.gastosAnuales = sum(o.gastosAnuales, 1);
      var i = o.interes / 12, n = o.plazo * 12;
      var cuotaMes = r.hipoteca * i / (1 - Math.pow(1 + i, -n));
      r.cuotaAnual = cuotaMes * 12;
      r.intMedios = (r.cuotaAnual * o.plazo - r.hipoteca) / o.plazo;
      r.amortMedia = r.hipoteca / o.plazo;
      r.bruta = r.rentaAnual / r.total * 100;
      r.neta = (r.rentaAnual - r.gastosAnuales - r.intMedios) / r.total * 100;
      r.cashAnual = r.rentaAnual - r.gastosAnuales - r.cuotaAnual;
      r.cashMes = r.cashAnual / 12;
      r.coc = r.cashAnual / r.aportado * 100;
      r.roce = (r.cashAnual + r.amortMedia) / r.aportado * 100;
      r.principal = r.bruta; r.principalEt = "rent. bruta";
    } else if (o.tipo === "flip") {
      r.total = o.compra + itp + o.gastosCompra + o.reforma + o.mobiliario + o.gastosVarios + o.comisionVenta;
      r.beneficio = o.venta - r.total;
      r.rentab = r.beneficio / r.total * 100;
      r.anual = (Math.pow(1 + r.beneficio / r.total, 12 / o.meses) - 1) * 100;
      r.principal = r.rentab; r.principalEt = "beneficio";
    } else {
      r.total = o.compra + itp + o.gastosCompra;
      r.ahorro = o.precioAnuncio - o.compra;
      r.ahorroPct = r.ahorro / o.precioAnuncio * 100;
      r.m2Pagado = o.compra / o.m2;
      r.vsZona = (r.m2Pagado / o.precioZonaM2 - 1) * 100;
      r.principal = r.ahorroPct; r.principalEt = "negociado";
    }
    return r;
  }
  OPS.forEach(function (o) { o.r = calc(o); });

  var TIPO_TXT = { tradicional: "Alquiler tradicional", habitaciones: "Alquiler por habitaciones", flip: "Compraventa", hogar: "Vivienda habitual" };
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Estadísticas ---------- */
  function stats() {
    var alq = OPS.filter(function (o) { return o.tipo === "tradicional" || o.tipo === "habitaciones"; });
    var flips = OPS.filter(function (o) { return o.tipo === "flip"; });
    var hogar = OPS.filter(function (o) { return o.tipo === "hogar"; });
    var avg = function (a, k) { return a.reduce(function (s, o) { return s + o.r[k]; }, 0) / a.length; };
    $("stats-ops").innerHTML =
      '<div class="celda"><div class="et">Operaciones</div><div class="n">' + OPS.length + "</div></div>" +
      '<div class="celda"><div class="et">Rentabilidad bruta media en alquiler</div><div class="n verde">' + pct(avg(alq, "bruta")) + "</div></div>" +
      '<div class="celda"><div class="et">Beneficio medio en compraventa</div><div class="n verde">' + pct(avg(flips, "rentab")) + "</div></div>" +
      '<div class="celda"><div class="et">Rebaja media negociada</div><div class="n verde">' + pct(avg(hogar, "ahorroPct")) + "</div></div>";
  }

  /* ---------- Tarjetas ---------- */
  function card(o) {
    var nums;
    if (o.tipo === "flip") nums = [["Compra", eur(o.compra)], ["Venta", eur(o.venta)]];
    else if (o.tipo === "hogar") nums = [["Precio anunciado", eur(o.precioAnuncio)], ["Pagado", eur(o.compra)]];
    else nums = [["Inversión", eur(o.r.total)], ["Alquiler", eur(o.r.rentaMes) + "/mes"]];
    var chips = ["" + o.m2 + " m²", o.hab + " hab.", o.banos + (o.banos > 1 ? " baños" : " baño")];
    return '<button type="button" class="op-card" data-id="' + o.id + '" data-tipo="' + o.tipo + '" aria-haspopup="dialog">' +
      '<div class="op-foto"><img src="assets/ops/' + o.foto + '" alt="Fachada de la vivienda: ' + o.titulo + '" loading="lazy" width="1100" height="800">' +
      '<span class="op-tipo">' + TIPO_TXT[o.tipo] + "</span>" +
      '<div class="op-rent"><b>' + (o.tipo === "hogar" ? "−" : "") + pct(o.r.principal) + "</b><small>" + o.r.principalEt + "</small></div></div>" +
      '<div class="op-body"><span class="op-zona">' + o.zona + "</span><h3>" + o.titulo + "</h3>" +
      '<div class="op-chips">' + chips.map(function (c) { return "<span>" + c + "</span>"; }).join("") + "</div>" +
      '<div class="op-nums">' + nums.map(function (n) { return "<div><small>" + n[0] + "</small><b>" + n[1] + "</b></div>"; }).join("") + "</div>" +
      '<span class="op-more">Ver detalle →</span></div></button>';
  }

  function render(filtro) {
    var lista = OPS.filter(function (o) {
      return filtro === "todas" || (filtro === "alquiler" && (o.tipo === "tradicional" || o.tipo === "habitaciones")) || o.tipo === filtro;
    });
    $("ops-grid").innerHTML = lista.map(card).join("");
  }

  /* ---------- Detalle (modal) ---------- */
  function fila(a, b, cls) { return "<tr" + (cls ? ' class="' + cls + '"' : "") + "><td>" + a + "</td><td>" + b + "</td></tr>"; }

  function detalle(o) {
    var r = o.r, t = "";
    var ficha = '<div class="ficha"><div><small>Superficie</small><b>' + o.m2 + ' m²</b></div><div><small>Habitaciones</small><b>' + o.hab +
      '</b></div><div><small>Baños</small><b>' + o.banos + '</b></div><div><small>Planta</small><b style="font-size:.95rem">' + o.planta + "</b></div></div>";
    if (o.tipo === "flip") {
      t = fila("Precio de compra", eur(o.compra)) + fila("Impuesto ITP (7 %)", eur(r.itp)) + fila("Notaría, registro y gestoría", eur(o.gastosCompra)) +
        fila("Reforma", eur(o.reforma)) + fila("Mobiliario y puesta en escena", eur(o.mobiliario)) + fila("Gastos durante la obra", eur(o.gastosVarios)) +
        fila("Comisión de venta", eur(o.comisionVenta)) + fila("Inversión total", eur(r.total), "total") +
        fila("Precio de venta", eur(o.venta)) + fila("Beneficio antes de impuestos", eur(r.beneficio), "res") +
        fila("Rentabilidad sobre la inversión", pct(r.rentab), "res") + fila("Duración", o.meses + " meses") + fila("Rentabilidad anualizada", pct(r.anual), "res");
    } else if (o.tipo === "hogar") {
      t = fila("Precio anunciado", eur(o.precioAnuncio)) + fila("Precio pagado", eur(o.compra)) + fila("Rebaja conseguida", eur(r.ahorro) + " (" + pct(r.ahorroPct) + ")", "res") +
        fila("Impuesto ITP (7 %)", eur(r.itp)) + fila("Notaría, registro y gestoría", eur(o.gastosCompra)) + fila("Coste total de la compra", eur(r.total), "total") +
        fila("Precio por m² pagado", eur(r.m2Pagado) + "/m²") + fila("Media de la zona (idealista, sep 2026)", eur(o.precioZonaM2) + "/m²") +
        fila("Frente a la media de la zona", (r.vsZona >= 0 ? "+" : "−") + pct(Math.abs(r.vsZona))) + fila("Visitas realizadas", "" + o.visitas) + fila("Tiempo de búsqueda", o.semanas + " semanas");
    } else {
      t = fila("Precio de compra", eur(o.compra)) + fila("Impuesto ITP (7 %)", eur(r.itp)) + fila("Notaría, registro y gestoría", eur(o.gastosCompra)) +
        fila("Reforma", eur(o.reforma)) + (o.mobiliario ? fila("Mobiliario", eur(o.mobiliario)) : "") + fila("Inversión total", eur(r.total), "total") +
        fila("Hipoteca (" + Math.round(o.financiado * 100) + " %, " + o.plazo + " años al " + (o.interes * 100).toFixed(1).replace(".", ",") + " %)", eur(r.hipoteca)) +
        fila("Capital aportado", eur(r.aportado), "total");
      if (o.habitaciones) {
        o.habitaciones.forEach(function (h, i) { t += fila("Habitación " + (i + 1), eur(h) + "/mes"); });
        t += fila("Ingresos mensuales", eur(r.rentaMes) + "/mes", "total");
      } else t += fila("Alquiler", eur(r.rentaMes) + "/mes", "total");
      t += fila("Gastos anuales", eur(r.gastosAnuales));
      o.gastosAnuales.forEach(function (g) { t += '<tr class="sub"><td>' + g[0] + "</td><td>" + eur(g[1]) + "</td></tr>"; });
      t += fila("Rentabilidad bruta", pct(r.bruta), "res") + fila("Rentabilidad neta", pct(r.neta), "res") +
        fila("Cash flow mensual", (r.cashMes >= 0 ? "+" : "−") + eur(Math.abs(r.cashMes)), "res") +
        fila("Cash on cash", pct(r.coc), "res") + fila("ROCE (incluye amortización)", pct(r.roce), "res");
    }
    return '<span class="op-zona">' + TIPO_TXT[o.tipo] + " · " + o.zona + " · " + o.fecha + "</span>" +
      '<h3 id="m-titulo">' + o.titulo + "</h3>" + '<p class="historia">' + o.historia + "</p>" + ficha +
      '<table class="tabla-op"><tbody>' + t + "</tbody></table>" +
      '<div class="lec"><b>Qué aprender de esta operación:</b> ' + o.leccion + "</div>" +
      '<p class="nota" style="margin-top:14px">Operación de ejemplo con cifras ilustrativas. La rentabilidad no incluye impuestos sobre el beneficio.</p>' +
      '<div style="margin-top:20px"><a class="btn btn-primary" href="https://wa.me/34682459134?text=' +
      encodeURIComponent("Hola Jessica, he visto la operación \"" + o.titulo + "\" y me gustaría hablar contigo.") + '" target="_blank" rel="noopener">Quiero algo así</a></div>';
  }

  var ultimo = null;
  function abre(id, trigger) {
    var o = OPS.filter(function (x) { return x.id === id; })[0];
    if (!o) return;
    ultimo = trigger;
    $("m-img").src = "assets/ops/" + o.foto;
    $("m-img").alt = "Fachada de la vivienda: " + o.titulo;
    var c = CREDITOS[o.foto];
    $("m-credito").innerHTML = c ? 'Foto: <a href="' + c.u + '" target="_blank" rel="noopener">' + c.t + "</a>, " + c.a + ", " + c.l : "";
    $("m-info").innerHTML = detalle(o);
    var m = $("modal");
    m.classList.add("open"); m.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    m.querySelector(".modal-close").focus();
  }
  function cierra() {
    var m = $("modal");
    m.classList.remove("open"); m.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (ultimo) ultimo.focus();
  }

  $("ops-grid").addEventListener("click", function (e) {
    var b = e.target.closest(".op-card");
    if (b) abre(b.dataset.id, b);
  });
  $("modal").addEventListener("click", function (e) { if (e.target.hasAttribute("data-close")) cierra(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && $("modal").classList.contains("open")) cierra();
    if (e.key === "Tab" && $("modal").classList.contains("open")) {
      var f = $("modal").querySelectorAll("button, a[href]");
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  $("filtros").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    Array.prototype.forEach.call($("filtros").querySelectorAll("button"), function (x) { x.classList.toggle("activo", x === b); });
    render(b.dataset.f);
  });

  $("creditos").innerHTML = Object.keys(CREDITOS).map(function (k) {
    var c = CREDITOS[k];
    return '<li><a href="' + c.u + '" target="_blank" rel="noopener">' + c.t + "</a> · " + c.a + " · " + c.l + " · Wikimedia Commons</li>";
  }).join("");

  stats();
  render("todas");
})();
