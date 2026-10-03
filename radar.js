(function () {
  "use strict";

  var M = window.MERCADO_HUELVA;
  if (!M) return;

  /* ---------- Supuestos (editables) ---------- */
  var ITP = 0.07;            // Andalucía
  var GASTOS_COMPRA = 0.018; // notaría + registro + gestoría
  var INTERES = 0.03;        // hipoteca
  var PLAZO = 30;            // años
  var CONSERVADOR = 0.92;    // -8 % sobre el alquiler estimado
  var GASTOS_FIJOS = 900;    // IBI + seguro + comunidad (€/año)
  var GASTOS_VAR = 0.13;     // vacíos, impagos y mantenimiento (% del alquiler)
  var GASTOS_HAB = 3000;     // suministros y limpieza en alquiler por habitaciones (€/año)
  var UPLIFT_HAB = 1.25;     // más ingresos por habitaciones (pisos de 60 m² o más)

  var sel = { fin: 0.7, obj: "rentabilidad", ref: 12000, mod: "tradicional" };
  var calculado = false;

  var $ = function (id) { return document.getElementById(id); };
  var miles = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); };
  var eur = function (n) { return miles(n) + " €"; };
  var pct = function (n) { return n.toFixed(1).replace(".", ",") + " %"; };

  /* ---------- Cálculo ---------- */
  function rentaMensual(m2, zona) {
    var base = M.alquilerM2[zona] || M.alquilerM2["default"];
    var f = m2 <= 50 ? 1.12 : m2 <= 70 ? 1.05 : m2 <= 100 ? 1 : m2 <= 130 ? 0.92 : 0.85;
    var r = m2 * base * f * CONSERVADOR;
    if (sel.mod === "habitaciones" && m2 >= 60) r *= UPLIFT_HAB;
    return r;
  }

  function evalua(precio, m2, zona) {
    var inversion = precio * (1 + ITP + GASTOS_COMPRA) + sel.ref;
    var renta = rentaMensual(m2, zona) * 12;
    var gastos = GASTOS_FIJOS + renta * GASTOS_VAR + (sel.mod === "habitaciones" && m2 >= 60 ? GASTOS_HAB : 0);
    var hip = precio * sel.fin;
    var cuota = 0, intMedios = 0;
    if (hip > 0) {
      var i = INTERES / 12, n = PLAZO * 12;
      cuota = hip * i / (1 - Math.pow(1 + i, -n)) * 12;
      intMedios = (cuota * PLAZO - hip) / PLAZO;
    }
    return {
      inversion: inversion, rentaMes: renta / 12,
      bruta: renta / inversion * 100,
      neta: (renta - gastos - intMedios) / inversion * 100,
      cash: (renta - gastos - cuota) / 12
    };
  }

  function precioAlcanzable(capital) {
    // capital = (1 - fin)·P + (ITP + gastos)·P + reforma
    var factor = (1 - sel.fin) + ITP + GASTOS_COMPRA;
    return (capital - sel.ref) / factor;
  }

  function calcular(scroll) {
    var capital = +$("capital").value;
    var P = precioAlcanzable(capital);
    var cont = $("lista-barrios");
    var ofertas = $("lista-ofertas");
    cont.innerHTML = ""; ofertas.innerHTML = "";
    $("resultados").style.display = "block";
    calculado = true;

    if (P < 45000) {
      ["r-precio", "r-inv", "r-mejor", "r-cash"].forEach(function (id) { $(id).textContent = "—"; });
      $("bloque-ofertas").style.display = "none";
      cont.innerHTML = '<div class="sin-resultado">Con estos parámetros el capital se queda justo para comprar bien en Huelva. Hay opciones en zonas más asequibles y planes para llegar. Cuéntamelo por WhatsApp y lo vemos juntos.</div>';
      enlaceWhatsApp(capital, P, []);
      if (scroll) $("resultados").scrollIntoView({ behavior: "smooth" });
      return;
    }

    /* zonas */
    var zonas = M.zonas.map(function (z) {
      var m2 = P / z.precioM2;
      var ev = evalua(P, m2, z.nombre);
      return Object.assign({}, z, ev, { m2: m2 });
    }).filter(function (z) { return z.m2 >= 35 && z.m2 <= 130; });

    var medianaPrecio = M.zonas.map(function (z) { return z.precioM2; }).sort(function (a, b) { return a - b; })[Math.floor(M.zonas.length / 2)];
    var porY = function (x, y) { return y.bruta - x.bruta; };
    if (sel.obj === "patrimonio") zonas.sort(function (x, y) { return y.precioM2 - x.precioM2; });
    else if (sel.obj === "equilibrio") {
      // zonas de precio medio-alto primero (mejor activo) y, dentro de ellas, las más rentables
      var altas = zonas.filter(function (z) { return z.precioM2 >= medianaPrecio; }).sort(porY);
      var bajas = zonas.filter(function (z) { return z.precioM2 < medianaPrecio; }).sort(porY);
      zonas = altas.concat(bajas);
    } else zonas.sort(porY);
    var top = zonas.slice(0, 3);

    if (!top.length) {
      cont.innerHTML = '<div class="sin-resultado">Con este presupuesto no encuentro un tamaño de piso razonable en las zonas analizadas. Ajusta el capital o la reforma, o escríbeme y buscamos alternativas.</div>';
    }
    var maxY = Math.max.apply(null, top.map(function (z) { return z.bruta; }).concat([1]));
    top.forEach(function (z, i) {
      cont.insertAdjacentHTML("beforeend",
        '<div class="barrio"><div class="rank">' + (i + 1) + '</div>' +
        '<div class="info"><b>' + z.nombre + "</b><span>~" + Math.round(z.m2) + " m² · alquiler estimado " + eur(z.rentaMes) + "/mes · " + eur(z.precioM2) + "/m²</span>" +
        '<span>Neta aprox. ' + pct(z.neta) + " · " + z.fuente + "</span></div>" +
        '<div class="rent"><div class="pct">' + pct(z.bruta) + '</div><div class="lab">rent. bruta</div></div>' +
        '<div class="bar" aria-hidden="true"><i style="width:' + Math.max(8, z.bruta / maxY * 100) + '%"></i></div></div>');
    });

    /* resumen */
    var mejor = top[0];
    if (mejor) {
      var bestY = Math.max.apply(null, top.map(function (z) { return z.bruta; }));
      var ref = top.filter(function (z) { return z.bruta === bestY; })[0] || mejor;
      $("r-precio").textContent = eur(P);
      $("r-inv").textContent = eur(ref.inversion);
      $("r-mejor").textContent = pct(bestY);
      var c = ref.cash;
      $("r-cash").textContent = (c >= 0 ? "+" : "−") + eur(Math.abs(c)) + "/mes";
      $("r-cash").className = "n " + (c >= 0 ? "verde" : "neg");
    } else {
      ["r-precio", "r-inv", "r-mejor", "r-cash"].forEach(function (id) { $(id).textContent = "—"; });
      $("r-precio").textContent = eur(P);
    }

    /* ejemplos reales */
    var ex = M.anuncios.filter(function (a) { return !a.ocupada && a.precio <= P && a.precio >= P * 0.5 && a.tipo !== "Chalet adosado"; })
      .map(function (a) {
        var zona = M.zonas.filter(function (z) { return z.nombre === a.zona; })[0];
        var ev = evalua(a.precio, a.m2, a.zona);
        return Object.assign({}, a, ev, { zp: zona ? zona.precioM2 : 0 });
      });
    if (sel.obj === "patrimonio") ex.sort(function (a, b) { return b.zp - a.zp || b.bruta - a.bruta; });
    else if (sel.obj === "equilibrio") ex = ex.filter(function (a) { return a.zp >= medianaPrecio; }).sort(function (a, b) { return b.bruta - a.bruta; });
    else ex.sort(function (a, b) { return b.bruta - a.bruta; });
    ex = ex.slice(0, 4);

    $("bloque-ofertas").style.display = ex.length ? "block" : "none";
    ex.forEach(function (a) {
      var datos = [a.m2 + " m²", a.hab ? a.hab + " hab." : "Estudio"];
      if (a.asc === 1) datos.push("Con ascensor"); else if (a.asc === 0) datos.push("Sin ascensor");
      if (a.garaje) datos.push("Garaje");
      ofertas.insertAdjacentHTML("beforeend",
        '<article class="oferta"><span class="zona">' + a.zona + "</span>" +
        "<h4>" + (a.tipo === "Piso" ? "Piso" : a.tipo) + " de " + a.m2 + " m²</h4>" +
        '<div class="datos">' + datos.map(function (d) { return "<span>" + d + "</span>"; }).join("") + "</div>" +
        '<div class="linea"><div class="precio">' + eur(a.precio) + " <small>" + eur(a.precio / a.m2) + "/m²</small></div>" +
        '<div class="y">' + pct(a.bruta) + " bruta</div></div></article>");
    });

    enlaceWhatsApp(capital, P, top);
    if (scroll) $("resultados").scrollIntoView({ behavior: "smooth" });
  }

  function enlaceWhatsApp(capital, P, top) {
    var fin = sel.fin === 0 ? "al contado" : "con hipoteca del " + Math.round(sel.fin * 100) + " %";
    var obj = { rentabilidad: "máxima rentabilidad", equilibrio: "equilibrio", patrimonio: "buen activo / patrimonio" }[sel.obj];
    var txt = "Hola Jessica, he usado el radar de inversión de tu web. Tengo " + eur(capital) + " de capital, compraría " + fin + ", busco " + obj +
      " y alquilaría " + (sel.mod === "habitaciones" ? "por habitaciones" : "de forma tradicional") + ". Precio alcanzable: " + eur(Math.max(P, 0)) +
      (top.length ? ". Zonas sugeridas: " + top.map(function (z) { return z.nombre; }).join(", ") : "") + ". Me gustaría hablar contigo.";
    $("wa-perfil").href = "https://wa.me/34682459134?text=" + encodeURIComponent(txt);
  }

  /* ---------- Controles ---------- */
  function pintaCapital() { $("capital-val").textContent = eur(+$("capital").value); }
  $("capital").addEventListener("input", function () { pintaCapital(); if (calculado) calcular(false); });
  pintaCapital();

  function grupo(id, clave, parse) {
    var cont = $(id);
    cont.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      Array.prototype.forEach.call(cont.querySelectorAll("button"), function (x) { x.classList.remove("activo"); x.removeAttribute("aria-pressed"); });
      b.classList.add("activo"); b.setAttribute("aria-pressed", "true");
      sel[clave] = parse(b);
      if (calculado) calcular(false);
    });
  }
  grupo("financiacion", "fin", function (b) { return parseFloat(b.dataset.fin); });
  grupo("objetivo", "obj", function (b) { return b.dataset.obj; });
  grupo("reforma", "ref", function (b) { return parseFloat(b.dataset.ref); });
  grupo("modelo", "mod", function (b) { return b.dataset.mod; });

  $("btn-calcular").addEventListener("click", function () { calcular(true); });
})();
