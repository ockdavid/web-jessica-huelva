(function () {
  "use strict";

  /* =====================================================================
     OPERACIONES REALES. Cifras tomadas de las calculadoras de rentabilidad
     de cada operación. Por privacidad no se muestran direcciones.
     Para añadir una operación: copiar una entrada de OPS y cambiar los datos;
     el resto (rentabilidades, tabla, filtros) se calcula solo.
     Fotos: poner el archivo en assets/ops/ y rellenar  foto: "nombre.webp".
     tipo "alquiler": compra, itp, notarias, reforma, gestion (comisiones de intermediarios
       y otros gastos), fin {pct, interes, plazo}, rentaMes, gastos [[concepto, €/año]].
       brutaSobreVivienda: true  -> la bruta se calcula sin "gestion".
     tipo "flip": escenarios [{nombre, venta, reforma, gastosTotales, beneficio, irpf}].
     ===================================================================== */

  var OPS = [
    { id: "mateo-habitaciones", tipo: "alquiler", modo: "habitaciones", foto: null,
      titulo: "Piso de 87.000 € reformado para alquilar por habitaciones", zona: "Huelva",
      chips: ["Por habitaciones", "Hipoteca al 90 %", "Reforma 7.000 €"],
      datos: [["Modalidad", "Por habitaciones"], ["Compra", "87.000 €"], ["Hipoteca", "90 %"]],
      compra: 87000, itp: 6090, notarias: 1580, reforma: 7000, gestion: 4235, brutaSobreVivienda: false,
      fin: { pct: 0.9, interes: 0.039, plazo: 30 }, rentaMes: 1100,
      gastos: [["IBI y basuras", 200], ["Seguros", 960], ["Comunidad", 120], ["Mantenimiento", 1320], ["Vacíos", 660]],
      historia: "Es la misma vivienda que la operación de alquiler tradicional de 87.000 €, analizada en la otra modalidad para poder compararlas. Aquí se invierte más en reforma para alquilarla habitación a habitación.",
      leccion: "Con 6.000 € más de reforma, el alquiler pasa de 750 a 1.100 € al mes y la rentabilidad bruta llega al {bruta}. Más ingresos, pero también más gastos y más gestión: conviene calcular las dos opciones antes de decidir." },

    { id: "santa-rafaela", tipo: "alquiler", modo: "habitaciones", foto: null,
      titulo: "Piso de 98.000 € para alquilar por habitaciones", zona: "Huelva",
      chips: ["Por habitaciones", "Hipoteca al 90 %", "Reforma 5.000 €"],
      datos: [["Modalidad", "Por habitaciones"], ["Compra", "98.000 €"], ["Hipoteca", "90 %"]],
      compra: 98000, itp: 6860, notarias: 1700, reforma: 5000, gestion: 6500, brutaSobreVivienda: false,
      fin: { pct: 0.9, interes: 0.027, plazo: 30 }, rentaMes: 1200,
      gastos: [["IBI y basuras", 200], ["Seguros", 1120], ["Comunidad", 804], ["Mantenimiento", 1440], ["Vacíos", 720]],
      historia: "Piso comprado por 98.000 € con una reforma de 5.000 € para alquilarlo por habitaciones. Con financiación al 90 % y un tipo de interés bajo, el capital propio que se necesita es reducido.",
      leccion: "Una hipoteca barata y un alquiler alto respecto al precio dejan una rentabilidad bruta del {bruta} y un cash flow que cubre la cuota con holgura." },

    { id: "carabelas-5", tipo: "alquiler", modo: "habitaciones", foto: null,
      titulo: "Piso de 117 m² con terraza y ascensor en zona de alta demanda", zona: "Huelva · alta demanda",
      chips: ["Por habitaciones", "117 m²", "Terraza"],
      datos: [["Superficie", "117 m²"], ["Habitaciones", "4"], ["Baños", "1"], ["Planta", "2ª con ascensor"], ["Año", "1970"]],
      compra: 117000, itp: 8190, notarias: 915, reforma: 3500, gestion: 8500, brutaSobreVivienda: true,
      fin: { pct: 0.8, interes: 0.025, plazo: 30 }, rentaMes: 1200, rentaRango: [750, 1200],
      gastos: [["IBI y basuras", 200], ["Seguro de hogar", 180], ["Comunidad", 540]],
      historia: "Piso amplio de cuatro habitaciones con terraza y ascensor, en una zona de alta demanda, alquilado por habitaciones. Necesitó una reforma y un amueblado muy contenidos.",
      leccion: "Cuando el piso es grande y está bien situado, alquilarlo por habitaciones hace crecer el alquiler total más deprisa que el precio de compra: de ahí una rentabilidad bruta del {bruta}." },

    { id: "soforas-tradicional", tipo: "alquiler", modo: "tradicional", foto: null,
      titulo: "Piso de 69.700 € para alquiler tradicional", zona: "Huelva",
      chips: ["Tradicional", "Hipoteca al 90 %", "Reforma 2.000 €"],
      datos: [["Modalidad", "Tradicional"], ["Compra", "69.700 €"], ["Hipoteca", "90 %"]],
      compra: 69700, itp: 4879, notarias: 1580, reforma: 2000, gestion: 3630, brutaSobreVivienda: false,
      fin: { pct: 0.9, interes: 0.039, plazo: 30 }, rentaMes: 750,
      gastos: [["IBI y basuras", 200], ["Seguros", 750], ["Comunidad", 120], ["Mantenimiento", 900], ["Vacíos", 450]],
      historia: "Piso de precio de entrada bajo, con una reforma ligera, pensado para alquilar de forma tradicional.",
      leccion: "Cuando se compra barato y se alquila a un precio razonable, la rentabilidad bruta se dispara ({bruta}). La rentabilidad se gana al negociar el precio de compra." },

    { id: "mateo-tradicional", tipo: "alquiler", modo: "tradicional", foto: null,
      titulo: "Piso de 87.000 € para alquiler tradicional", zona: "Huelva",
      chips: ["Tradicional", "Hipoteca al 80 %", "Reforma 1.000 €"],
      datos: [["Modalidad", "Tradicional"], ["Compra", "87.000 €"], ["Hipoteca", "80 %"]],
      compra: 87000, itp: 6090, notarias: 1580, reforma: 1000, gestion: 4235, brutaSobreVivienda: false,
      fin: { pct: 0.8, interes: 0.039, plazo: 30 }, rentaMes: 750,
      gastos: [["IBI y basuras", 200], ["Seguros", 750], ["Comunidad", 120], ["Mantenimiento", 900], ["Vacíos", 450]],
      historia: "Piso comprado por 87.000 € y puesto en alquiler tradicional con una reforma mínima. Es la misma vivienda que la operación por habitaciones, analizada de la forma más sencilla.",
      leccion: "Con una reforma mínima se consigue una rentabilidad bruta del {bruta} y un cash flow positivo incluso con una hipoteca al 3,9 %." },

    { id: "rio-duero", tipo: "alquiler", modo: "tradicional", foto: null,
      titulo: "Piso de 3 habitaciones junto a una zona comercial nueva", zona: "Huelva · zona en revalorización",
      chips: ["59 m²", "3 hab.", "1 baño"],
      datos: [["Superficie", "59 m²"], ["Habitaciones", "3"], ["Baños", "1"], ["Planta", "3ª sin ascensor"], ["Año", "1961"]],
      compra: 79000, itp: 5530, notarias: 830, reforma: 2860, gestion: 10000, brutaSobreVivienda: true,
      fin: { pct: 0.8, interes: 0.025, plazo: 30 }, rentaMes: 650, rentaRango: [600, 750],
      gastos: [["IBI y basuras", 200], ["Seguro de hogar", 180], ["Comunidad", 120]],
      historia: "Piso en el extremo de una zona de precio contenido, pegado a un polígono nuevo con comercios y a 20 minutos andando de la universidad. Llegó recién reformado y pintado, con buena comunidad y sin derramas previstas. Solo hizo falta amueblarlo y actualizar detalles. Al otro lado se construyen viviendas de alta calidad, lo que apunta a una zona en revalorización.",
      leccion: "En una zona de precio contenido, un piso que ya está en buen estado permite entrar con poca reforma y un cash flow que cubre la hipoteca desde el primer mes." },

    { id: "carabelas-27", tipo: "alquiler", modo: "tradicional", foto: null,
      titulo: "Piso de 72 m² con ascensor en zona de alta demanda", zona: "Huelva · alta demanda",
      chips: ["72 m²", "2 hab.", "Ascensor"],
      datos: [["Superficie", "72 m²"], ["Habitaciones", "2 (antes 3)"], ["Baños", "1"], ["Planta", "1ª con ascensor"], ["Año", "1975"]],
      compra: 90000, itp: 6300, notarias: 865, reforma: 2000, gestion: 8000, brutaSobreVivienda: true,
      fin: { pct: 0.8, interes: 0.025, plazo: 30 }, rentaMes: 700, rentaRango: [650, 750],
      gastos: [["IBI y basuras", 200], ["Seguro de hogar", 180], ["Comunidad", 360]],
      historia: "Piso exterior con ascensor en una zona de alta demanda. Se redistribuyó para pasar de tres a dos habitaciones, con una reforma contenida.",
      leccion: "Una zona de alta demanda y un edificio con ascensor suelen ser los mejores aliados de un alquiler estable, con una rentabilidad bruta del {bruta}." },

    { id: "venezuela-4", tipo: "alquiler", modo: "tradicional", foto: null,
      titulo: "Piso de 54 m² y 3 habitaciones en zona de alta demanda", zona: "Huelva · alta demanda",
      chips: ["54 m²", "3 hab.", "1 baño"],
      datos: [["Superficie", "54 m²"], ["Habitaciones", "3"], ["Baños", "1"], ["Planta", "1ª sin ascensor"], ["Año", "1954"]],
      compra: 105000, itp: 7350, notarias: 890, reforma: 2000, gestion: 8000, brutaSobreVivienda: true,
      fin: { pct: 0.8, interes: 0.025, plazo: 30 }, rentaMes: 750, rentaRango: [650, 800],
      gastos: [["IBI y basuras", 125], ["Seguro de hogar", 180], ["Comunidad", 240]],
      historia: "Piso pequeño de tres habitaciones en una zona de alta demanda, que con una reforma ligera queda listo para alquilar.",
      leccion: "Pagar más por una zona muy demandada baja algo la rentabilidad bruta ({bruta}), pero a cambio se gana seguridad: es el perfil de equilibrio entre rentabilidad y buen activo." },

    { id: "cervantes-flip", tipo: "flip", estado: "En curso", foto: null,
      titulo: "Vivienda de 94 m² comprada por 55.000 € para reformar y vender", zona: "Isla Cristina (Huelva)",
      chips: ["94 m²", "Compra 55.000 €", "Reforma en proyecto"],
      datos: [["Superficie", "94 m²"], ["Localidad", "Isla Cristina"], ["Estado", "En curso"], ["Valor de referencia", "87.483 €"]],
      compra: 55000, itp: 1749.65, notarias: 1017.24, desocupacion: 6500, antiokupa: 1904.21, invertidoHoy: 68962.66,
      escenarios: [
        { nombre: "Vender sin reforma", venta: 120000, reforma: 1179.5, gastosTotales: 83276.28, beneficio: 36723.72, irpf: 14313.62 },
        { nombre: "Dejarla para entrar a vivir", venta: 120000, reforma: 3133.8, gastosTotales: 88522.38, beneficio: 31477.62, irpf: 14310.17 },
        { nombre: "Reforma integral", venta: 150000, reforma: 24726.7, gastosTotales: 119756.96, beneficio: 30243.04, irpf: 20660.05 }
      ],
      historia: "Vivienda de 94 m² en Isla Cristina, comprada por 55.000 € frente a un valor de referencia de 87.483 €. Se gestionó la desocupación y se protegió la vivienda con puerta y alarma antiokupa. La reforma está en proyecto: antes de decidirla se comparan tres escenarios de venta.",
      leccion: "En un flip decide el escenario: reformar a fondo vende más caro, pero deja menos rentabilidad que vender casi como está. Mi criterio: que la rentabilidad neta después de impuestos supere el 25 %." }
  ];

  /* ---------- Formato ---------- */
  var miles = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); };
  var eur = function (n) { return miles(n) + " €"; };
  var pct = function (n) { return n.toFixed(1).replace(".", ",") + " %"; };
  var sum = function (arr, i) { return arr.reduce(function (s, x) { return s + x[i]; }, 0); };
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Cálculo (mismas fórmulas que las calculadoras de rentabilidad) ---------- */
  function calcAlquiler(o) {
    var r = {};
    r.total = o.compra + o.itp + o.notarias + o.reforma + o.gestion;
    r.baseBruta = o.brutaSobreVivienda ? r.total - o.gestion : r.total;
    r.hipoteca = o.compra * o.fin.pct;
    r.aportado = r.total - r.hipoteca;
    r.rentaAnual = o.rentaMes * 12;
    r.gastosAnuales = sum(o.gastos, 1);
    var i = o.fin.interes / 12, n = o.fin.plazo * 12;
    r.cuotaAnual = r.hipoteca * i / (1 - Math.pow(1 + i, -n)) * 12;
    r.amortMedia = r.hipoteca / o.fin.plazo;
    r.bruta = r.rentaAnual / r.baseBruta * 100;
    r.neta = (r.rentaAnual - r.gastosAnuales) / r.total * 100;
    r.cashAnual = r.rentaAnual - r.gastosAnuales - r.cuotaAnual;
    r.cashMes = r.cashAnual / 12;
    r.coc = r.cashAnual / r.aportado * 100;
    r.roce = (r.cashAnual + r.amortMedia) / r.aportado * 100;
    return r;
  }

  function calcFlip(o) {
    var esc = o.escenarios.map(function (e) {
      return Object.assign({}, e, { rentab: e.beneficio / e.gastosTotales * 100 });
    });
    var rs = esc.map(function (e) { return e.rentab; });
    var ventas = esc.map(function (e) { return e.venta; });
    return { esc: esc, min: Math.min.apply(null, rs), max: Math.max.apply(null, rs),
             ventaMin: Math.min.apply(null, ventas), ventaMax: Math.max.apply(null, ventas) };
  }

  OPS.forEach(function (o) { o.r = o.tipo === "flip" ? calcFlip(o) : calcAlquiler(o); });

  function tipoTxt(o) {
    if (o.tipo === "flip") return "Compraventa";
    return o.modo === "habitaciones" ? "Alquiler por habitaciones" : o.modo === "tradicional" ? "Alquiler tradicional" : "Alquiler";
  }
  function principal(o) {
    if (o.tipo === "flip") return { txt: Math.round(o.r.min) + "–" + Math.round(o.r.max) + " %", et: "neta tras impuestos" };
    return { txt: pct(o.r.bruta), et: "rent. bruta" };
  }

  /* ---------- Estadísticas ---------- */
  function stats() {
    var media = function (modo) {
      var b = OPS.filter(function (o) { return o.modo === modo; }).map(function (o) { return o.r.bruta; });
      return b.reduce(function (a, c) { return a + c; }, 0) / b.length;
    };
    var flip = OPS.filter(function (o) { return o.tipo === "flip"; })[0];
    $("stats-ops").innerHTML =
      '<div class="celda"><div class="et">Operaciones</div><div class="n">' + OPS.length + "</div></div>" +
      '<div class="celda"><div class="et">Bruta media, alquiler tradicional</div><div class="n verde">' + pct(media("tradicional")) + "</div></div>" +
      '<div class="celda"><div class="et">Bruta media, por habitaciones</div><div class="n verde">' + pct(media("habitaciones")) + "</div></div>" +
      (flip ? '<div class="celda"><div class="et">Compraventa: neta tras impuestos</div><div class="n verde">' + principal(flip).txt + "</div></div>" : "");
  }

  /* ---------- Fotos o marcador ---------- */
  var CASA = '<svg class="ph-ico" aria-hidden="true"><use href="#i-casa"/></svg>';
  function fotoHtml(o) {
    return o.foto
      ? '<img src="assets/ops/' + o.foto + '" alt="Vivienda: ' + o.titulo + '" loading="lazy" width="1100" height="800">'
      : '<div class="ph">' + CASA + "<span>" + o.zona + "</span></div>";
  }

  /* ---------- Tarjetas ---------- */
  function card(o) {
    var nums = o.tipo === "flip"
      ? [["Compra", eur(o.compra)], ["Venta estimada", miles(o.r.ventaMin / 1000) + "–" + miles(o.r.ventaMax / 1000) + " mil €"]]
      : [["Inversión", eur(o.r.total)], ["Alquiler", eur(o.rentaMes) + "/mes"]];
    var p = principal(o);
    return '<button type="button" class="op-card" data-id="' + o.id + '" data-tipo="' + o.tipo + '" aria-haspopup="dialog">' +
      '<div class="op-foto' + (o.foto ? "" : " sin-foto") + '">' + fotoHtml(o) +
      '<span class="op-tipo">' + tipoTxt(o) + (o.estado ? " · " + o.estado : "") + "</span>" +
      '<div class="op-rent"><b>' + p.txt + "</b><small>" + p.et + "</small></div></div>" +
      '<div class="op-body"><span class="op-zona">' + o.zona + "</span><h3>" + o.titulo + "</h3>" +
      '<div class="op-chips">' + o.chips.map(function (c) { return "<span>" + c + "</span>"; }).join("") + "</div>" +
      '<div class="op-nums">' + nums.map(function (n) { return "<div><small>" + n[0] + "</small><b>" + n[1] + "</b></div>"; }).join("") + "</div>" +
      '<span class="op-more">Ver detalle →</span></div></button>';
  }

  function render(filtro) {
    var lista = OPS.filter(function (o) { return filtro === "todas" || o.tipo === filtro; });
    $("ops-grid").innerHTML = lista.map(card).join("");
  }

  /* ---------- Detalle (modal) ---------- */
  function fila(a, b, cls) { return "<tr" + (cls ? ' class="' + cls + '"' : "") + "><td>" + a + "</td><td>" + b + "</td></tr>"; }
  function sub(a, b) { return '<tr class="sub"><td>' + a + "</td><td>" + b + "</td></tr>"; }
  function signo(n) { return (n >= 0 ? "+" : "−") + eur(Math.abs(n)); }

  function tablaAlquiler(o) {
    var r = o.r;
    var t = fila("Precio de compra", eur(o.compra)) + fila("Impuesto ITP (7 %)", eur(o.itp)) + fila("Notaría, registro, gestoría y tasación", eur(o.notarias)) +
      fila("Reforma y mobiliario", eur(o.reforma)) + fila("Comisiones de intermediarios", eur(o.gestion)) + fila("Inversión total", eur(r.total), "total") +
      fila("Hipoteca (" + Math.round(o.fin.pct * 100) + " %, " + o.fin.plazo + " años al " + (o.fin.interes * 100).toFixed(1).replace(".", ",") + " %)", eur(r.hipoteca)) +
      fila("Capital aportado", eur(r.aportado), "total") +
      fila("Alquiler estimado", eur(o.rentaMes) + "/mes", "total");
    if (o.rentaRango) t += sub("Rango estimado de alquiler", eur(o.rentaRango[0]) + " – " + eur(o.rentaRango[1]) + "/mes");
    t += fila("Gastos anuales", eur(r.gastosAnuales));
    o.gastos.forEach(function (g) { t += sub(g[0], eur(g[1])); });
    return t + fila("Rentabilidad bruta", pct(r.bruta), "res") + fila("Rentabilidad neta (antes de impuestos e intereses)", pct(r.neta), "res") +
      fila("Cash flow mensual tras la hipoteca (antes de impuestos)", signo(r.cashMes), "res") +
      fila("Cash on cash", pct(r.coc), "res") + fila("ROCE (incluye amortización)", pct(r.roce), "res");
  }

  function bloqueFlip(o) {
    var t = fila("Precio de compra", eur(o.compra)) + fila("Impuesto ITP, notaría y registro", eur(o.itp + o.notarias)) +
      fila("Desocupación de la vivienda", eur(o.desocupacion)) + fila("Seguridad antiokupa (cerrajero, alarma y furgoneta)", eur(o.antiokupa)) +
      fila("Invertido hasta hoy (incluye gestiones y suministros)", eur(o.invertidoHoy), "total");
    var esc = '<h4 class="esc-titulo">Tres escenarios de venta</h4><div class="esc">' + o.r.esc.map(function (e) {
      return '<div class="esc-card"><b>' + e.nombre + "</b>" +
        "<dl><dt>Venta estimada</dt><dd>" + eur(e.venta) + "</dd>" +
        "<dt>Reforma</dt><dd>" + eur(e.reforma) + "</dd>" +
        "<dt>Gastos totales</dt><dd>" + eur(e.gastosTotales) + "</dd>" +
        "<dt>IRPF estimado</dt><dd>" + eur(e.irpf) + "</dd>" +
        "<dt>Beneficio tras impuestos</dt><dd>" + eur(e.beneficio) + "</dd></dl>" +
        '<div class="esc-rent"><b>' + pct(e.rentab) + "</b><small>neta tras impuestos</small></div></div>";
    }).join("") + "</div>";
    return '<table class="tabla-op"><tbody>' + t + "</tbody></table>" + esc;
  }

  function detalle(o) {
    var ficha = '<div class="ficha">' + o.datos.map(function (d) { return "<div><small>" + d[0] + "</small><b>" + d[1] + "</b></div>"; }).join("") + "</div>";
    var cuerpo, nota;
    if (o.tipo === "flip") {
      cuerpo = bloqueFlip(o);
      nota = "Operación en curso: la venta y la reforma de los escenarios son estimaciones, no resultados cerrados.";
    } else {
      cuerpo = '<table class="tabla-op"><tbody>' + tablaAlquiler(o) + "</tbody></table>";
      nota = "Alquiler estimado con criterio realista. La rentabilidad no incluye impuestos sobre el beneficio.";
    }
    var lec = o.leccion.replace("{bruta}", o.tipo === "alquiler" ? pct(o.r.bruta) : "");
    return '<span class="op-zona">' + tipoTxt(o) + " · " + o.zona + (o.estado ? " · " + o.estado : "") + "</span>" +
      '<h3 id="m-titulo">' + o.titulo + "</h3>" + '<p class="historia">' + o.historia + "</p>" + ficha + cuerpo +
      '<div class="lec"><b>Qué aprender de esta operación:</b> ' + lec + "</div>" +
      '<p class="nota" style="margin-top:14px">' + nota + " Por privacidad no se indica la dirección.</p>" +
      '<div style="margin-top:20px"><a class="btn btn-primary" href="https://wa.me/34641178391?text=' +
      encodeURIComponent("Hola Jessica, he visto la operación \"" + o.titulo + "\" y me gustaría hablar contigo.") + '" target="_blank" rel="noopener">Quiero algo así</a></div>';
  }

  var ultimo = null;
  function abre(id, trigger) {
    var o = OPS.filter(function (x) { return x.id === id; })[0];
    if (!o) return;
    ultimo = trigger;
    var p = principal(o);
    $("m-foto").innerHTML = o.foto
      ? '<img src="assets/ops/' + o.foto + '" alt="Vivienda: ' + o.titulo + '">'
      : '<div class="ph grande">' + CASA + "<span>" + o.zona + '</span><div class="ph-rent"><b>' + p.txt + "</b><small>" + p.et + "</small></div></div>";
    $("m-info").innerHTML = detalle(o);
    var m = $("modal");
    m.classList.add("open"); m.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $("m-scroll").scrollTop = 0; $("m-scroll").scrollLeft = 0;
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

  /* Al salir de la web y volver (móvil), cerramos el detalle para que la página no quede bloqueada */
  document.addEventListener("visibilitychange", function () { if (document.hidden && $("modal").classList.contains("open")) cierra(); });
  window.addEventListener("pagehide", function () { if ($("modal").classList.contains("open")) cierra(); });
  window.addEventListener("pageshow", function (e) { if (e.persisted && $("modal").classList.contains("open")) cierra(); });

  $("filtros").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    Array.prototype.forEach.call($("filtros").querySelectorAll("button"), function (x) { x.classList.toggle("activo", x === b); });
    render(b.dataset.f);
  });

  stats();
  render("todas");
})();
