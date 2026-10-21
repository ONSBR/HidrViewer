// ── Aba Graficos ──
// Curvas cota x area x volume, queda x volume e coeficientes de evaporacao.
// Depende de hidr_viewer.js (allRecords, MESES, selectedPlantIdx, selectPlant) e
// do Chart.js embutido em vendor/chart.umd.js.

// ── Calculos (funcoes puras, sem DOM) ──

// Avalia o polinomio a0 + a1*x + ... + a4*x^4 (Horner).
function grPolyval(c, x) {
  var y = 0;
  for (var i = c.length - 1; i >= 0; i--) y = y * x + c[i];
  return y;
}
function grCoefs(rec, suffix) {
  var c = [];
  for (var i = 0; i < 5; i++) c.push(Number(rec["a" + i + suffix]) || 0);
  return c;
}
// Cota de montante (m) para o volume V (hm3): polinomio cota-volume (PCV).
function grCota(rec, V) { return grPolyval(grCoefs(rec, "_volume_cota"), V); }
// Area do espelho d'agua (km2) para a cota h (m): polinomio cota-area (PCA).
function grArea(rec, h) { return grPolyval(grCoefs(rec, "_area_cota"), h); }

function grCev(rec, mes) { return Number(rec["evap_" + MESES[mes - 1]]) || 0; }

// Queda bruta e liquida (m) para o volume V, usando o canal de fuga medio como
// nivel de jusante. Perdas: tipo 1 = % da queda bruta, tipo 2 = metros.
// Outros tipos retornam null (nao suportado).
function grQueda(rec, V) {
  var bruta = grCota(rec, V) - (Number(rec.canal_fuga_medio) || 0);
  var perdas = Number(rec.perdas) || 0;
  var liq;
  if (rec.tipo_perda === 1) liq = bruta * (1 - perdas / 100);
  else if (rec.tipo_perda === 2) liq = bruta - perdas;
  else return null;
  return { bruta: bruta, liq: liq };
}

// Usina sem volume util (Vmin = Vmax): as curvas se reduzem a um ponto.
function grSemVolumeUtil(rec) {
  return Math.abs((rec.volume_maximo || 0) - (rec.volume_minimo || 0)) < 1e-6;
}

// ── Interface ──
// So roda no navegador (o bloco de calculos acima tambem pode ser carregado no Node para teste).
if (typeof document !== "undefined") (function() {

// Cores das series (paleta categorica: azul, laranja) e elementos neutros.
var COR = { s1: "#2a78d6", s2: "#eb6834", ref: "#95a5a6", grid: "#eef1f4", text: "#52514e" };
var charts = {};       // instancias Chart.js por canvas id
var N_PONTOS = 150;    // amostras das curvas entre Vmin e Vmax

function num(v, dec) {
  if (v === undefined || v === null || !isFinite(v)) return "-";
  return Number(v).toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
function el(id) { return document.getElementById(id); }
function abaAtiva() { return el("tabGraficos").classList.contains("active"); }

function destroi(id) { if (charts[id]) { charts[id].destroy(); delete charts[id]; } }
function cria(id, config) {
  destroi(id);
  charts[id] = new Chart(el(id).getContext("2d"), config);
}

if (window.Chart) {
  Chart.defaults.font.family = "'Segoe UI', Tahoma, sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.locale = "pt-BR";
  Chart.defaults.color = COR.text;
  Chart.defaults.borderColor = COR.grid;
  Chart.defaults.animation = false;
  Chart.defaults.maintainAspectRatio = false;
}

// Eixo linear padrao com titulo.
function eixo(titulo, extra) {
  var e = { type: "linear", title: { display: true, text: titulo }, grid: { color: COR.grid } };
  for (var k in extra) e[k] = extra[k];
  return e;
}
// Serie de linha (scatter com linha, sem marcadores).
function linha(label, data, cor, extra) {
  var d = { label: label, data: data, borderColor: cor, backgroundColor: cor,
            borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, showLine: true, tension: 0 };
  for (var k in extra) d[k] = extra[k];
  return d;
}
function linhaRef(label, data, extra) {
  var d = linha(label, data, COR.ref, { borderWidth: 1, borderDash: [5, 4], pointHoverRadius: 0 });
  for (var k in extra) d[k] = extra[k];
  return d;
}
function tooltip(fmtItem) {
  return { mode: "nearest", intersect: false, callbacks: { label: fmtItem } };
}
var LEGENDA = { position: "bottom", labels: { boxWidth: 14, boxHeight: 2 } };

function kv(label, valor, unid) {
  return '<div class="dv-cell"><span class="dv-l">' + label + '</span><span class="dv-v">' +
         valor + (unid ? ' <i>' + unid + '</i>' : '') + '</span></div>';
}
function aviso(id, msg) {
  var a = el(id);
  a.textContent = msg || "";
  a.classList.toggle("hidden", !msg);
}

// Amostras de volume entre Vmin e Vmax.
function volumes(rec) {
  var out = [], v0 = rec.volume_minimo, v1 = rec.volume_maximo;
  for (var i = 0; i <= N_PONTOS; i++) out.push(v0 + (v1 - v0) * i / N_PONTOS);
  return out;
}

// ── Cota x Area x Volume ──
function renderCav(rec) {
  var info = el("grCavInfo");
  if (grSemVolumeUtil(rec)) {
    destroi("cvCav");
    var h = grCota(rec, rec.volume_maximo);
    aviso("grCavAviso", "Usina sem volume útil (Vmin = Vmax): a curva se reduz a um ponto.");
    info.innerHTML = kv("Volume", num(rec.volume_maximo, 2), "hm³") + kv("Cota", num(h, 2), "m") +
                     kv("Área", num(grArea(rec, h), 2), "km²");
    return;
  }
  aviso("grCavAviso", "");
  var vs = volumes(rec), cv = [], ca = [];
  for (var i = 0; i < vs.length; i++) {
    var hc = grCota(rec, vs[i]);
    cv.push({ x: vs[i], y: hc });
    ca.push({ x: grArea(rec, hc), y: hc });
  }
  info.innerHTML =
    kv("Vol. mín / máx", num(rec.volume_minimo, 2) + " / " + num(rec.volume_maximo, 2), "hm³") +
    kv("Cota calc. mín / máx", num(cv[0].y, 2) + " / " + num(cv[cv.length - 1].y, 2), "m") +
    kv("Cota cadastro mín / máx", num(rec.cota_minima, 2) + " / " + num(rec.cota_maxima, 2), "m") +
    kv("Área mín / máx", num(ca[0].x, 2) + " / " + num(ca[ca.length - 1].x, 2), "km²");
  var v0 = rec.volume_minimo, v1 = rec.volume_maximo;
  cria("cvCav", {
    type: "scatter",
    data: { datasets: [
      linha("Cota × Volume", cv, COR.s1, { xAxisID: "xVol" }),
      linha("Cota × Área", ca, COR.s2, { xAxisID: "xArea" }),
      linhaRef("Cota mínima (cadastro)", [{ x: v0, y: rec.cota_minima }, { x: v1, y: rec.cota_minima }], { xAxisID: "xVol" }),
      linhaRef("Cota máxima (cadastro)", [{ x: v0, y: rec.cota_maxima }, { x: v1, y: rec.cota_maxima }], { xAxisID: "xVol" })
    ] },
    options: {
      interaction: { mode: "nearest", intersect: false },
      scales: {
        xVol: eixo("Volume (hm³)", { position: "bottom", min: v0, max: v1 }),
        xArea: eixo("Área (km²)", { position: "top", reverse: true, grid: { display: false } }),
        y: eixo("Cota (m)")
      },
      plugins: {
        legend: LEGENDA,
        tooltip: tooltip(function(c) {
          var p = c.raw;
          if (c.dataset.xAxisID === "xArea") return "Área " + num(p.x, 2) + " km² · cota " + num(p.y, 3) + " m";
          if (c.datasetIndex >= 2) return c.dataset.label + ": " + num(p.y, 2) + " m";
          return "Volume " + num(p.x, 2) + " hm³ · cota " + num(p.y, 3) + " m";
        })
      }
    }
  });
}

// ── Queda x volume ──
function renderQueda(rec) {
  var info = el("grQuedaInfo");
  var perdaTxt = rec.tipo_perda === 1 ? num(rec.perdas, 2) + " %" :
                 rec.tipo_perda === 2 ? num(rec.perdas, 2) + " m" : num(rec.perdas, 2) + " (tipo " + rec.tipo_perda + ")";
  info.innerHTML = kv("Canal de fuga médio", num(rec.canal_fuga_medio, 2), "m") + kv("Perdas", perdaTxt, "");
  if (!grQueda(rec, rec.volume_minimo)) {
    destroi("cvQueda");
    aviso("grQuedaAviso", "Tipo de perda " + rec.tipo_perda + " não suportado (só 1 = % e 2 = m).");
    return;
  }
  if (grSemVolumeUtil(rec)) {
    destroi("cvQueda");
    var q = grQueda(rec, rec.volume_maximo);
    aviso("grQuedaAviso", "Usina sem volume útil (Vmin = Vmax): queda constante.");
    info.innerHTML += kv("Queda bruta", num(q.bruta, 2), "m") + kv("Queda líquida", num(q.liq, 2), "m");
    return;
  }
  aviso("grQuedaAviso", "");
  var vs = volumes(rec), bruta = [], liq = [];
  for (var i = 0; i < vs.length; i++) {
    var qi = grQueda(rec, vs[i]);
    bruta.push({ x: vs[i], y: qi.bruta });
    liq.push({ x: vs[i], y: qi.liq });
  }
  cria("cvQueda", {
    type: "scatter",
    data: { datasets: [
      linha("Queda bruta", bruta, COR.s2),
      linha("Queda líquida", liq, COR.s1)
    ] },
    options: {
      interaction: { mode: "nearest", intersect: false },
      scales: { x: eixo("Volume (hm³)", { min: rec.volume_minimo, max: rec.volume_maximo }), y: eixo("Queda (m)") },
      plugins: {
        legend: LEGENDA,
        tooltip: tooltip(function(c) {
          return c.dataset.label + ": " + num(c.raw.y, 2) + " m · V " + num(c.raw.x, 0) + " hm³";
        })
      }
    }
  });
}

// ── Coeficientes de evaporacao do cadastro ──
function renderCev(rec) {
  var vals = [];
  for (var m = 1; m <= 12; m++) vals.push(grCev(rec, m));
  cria("cvCev", {
    type: "bar",
    data: { labels: MESES, datasets: [{
      label: "Coeficiente de evaporação", data: vals,
      backgroundColor: COR.s1, borderRadius: 4, borderSkipped: false,
      maxBarThickness: 36, categoryPercentage: 0.8
    }] },
    options: {
      scales: { x: { grid: { display: false } }, y: eixo("mm/mês") },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: function(c) { return c.raw + " mm/mês"; } } }
      }
    }
  });
}

// ── Seletor de usina e ganchos ──
// Campo de texto com lista de sugestoes: aceita o numero da usina ("169"), o nome
// ("SOBRADINHO", ou parte dele) ou a opcao da lista ("169 - SOBRADINHO").
function rotuloUsina(r) { return r.codigo_usina + " - " + r.nome_usina; }

function preencheSeletor() {
  var lista = el("grUsinaLista");
  lista.innerHTML = "";
  for (var i = 0; i < allRecords.length; i++) {
    var r = allRecords[i];
    if (!r.nome_usina) continue;
    var o = document.createElement("option");
    o.value = rotuloUsina(r);
    lista.appendChild(o);
  }
  mostraUsinaAtual();
}
function mostraUsinaAtual() {
  var rec = selectedPlantIdx >= 0 ? allRecords[selectedPlantIdx] : null;
  el("grUsina").value = rec ? rotuloUsina(rec) : "";
  el("grUsina").classList.remove("gr-invalido");
  el("grUsinaErro").classList.add("hidden");
}

// Texto digitado -> indice em allRecords (ou -1). Numero no inicio = codigo da
// usina; senao procura pelo nome: exato, depois comeca com, depois contem.
function resolveUsina(texto) {
  var t = String(texto).trim();
  if (!t) return -1;
  var m = t.match(/^(\d+)(\s*-.*)?$/);
  if (m) {
    var idx = parseInt(m[1], 10) - 1;
    return (allRecords[idx] && allRecords[idx].nome_usina) ? idx : -1;
  }
  var q = t.toUpperCase(), testes = [
    function(n) { return n === q; },
    function(n) { return n.indexOf(q) === 0; },
    function(n) { return n.indexOf(q) >= 0; }
  ];
  for (var k = 0; k < testes.length; k++)
    for (var i = 0; i < allRecords.length; i++) {
      var n = String(allRecords[i].nome_usina || "").toUpperCase();
      if (n && testes[k](n)) return i;
    }
  return -1;
}

function aplicaBusca() {
  var inp = el("grUsina"), idx = resolveUsina(inp.value);
  if (idx < 0) {
    inp.classList.add("gr-invalido");
    el("grUsinaErro").classList.remove("hidden");
    return;
  }
  if (idx === selectedPlantIdx) mostraUsinaAtual();
  else selectPlant(idx);   // dispara grOnPlantChange -> atualiza o campo e redesenha
}

function render() {
  var rec = selectedPlantIdx >= 0 ? allRecords[selectedPlantIdx] : null;
  if (!rec || !abaAtiva()) return;
  el("grTitulo").textContent = rec.nome_usina + " · Código " + rec.codigo_usina;
  renderCav(rec);
  renderQueda(rec);
  renderCev(rec);
}

// Chamado por selectPlant (hidr_viewer.js) quando a usina muda.
window.grOnPlantChange = function() {
  mostraUsinaAtual();
  render();
};

var inpUsina = el("grUsina");
inpUsina.addEventListener("change", aplicaBusca);              // opcao da lista ou saida do campo
inpUsina.addEventListener("keydown", function(e) {
  if (e.key === "Enter") { e.preventDefault(); aplicaBusca(); }
  else if (e.key === "Escape") { mostraUsinaAtual(); this.blur(); }
});
inpUsina.addEventListener("focus", function() { this.select(); });   // facilita digitar outra
inpUsina.addEventListener("input", function() {
  this.classList.remove("gr-invalido");
  el("grUsinaErro").classList.add("hidden");
});

// Ao abrir a aba: atualiza a lista (usinas podem ter sido adicionadas/editadas) e redesenha.
var tabs = document.querySelectorAll(".tab-btn");
for (var t = 0; t < tabs.length; t++) {
  tabs[t].addEventListener("click", function() {
    if (this.getAttribute("data-tab") === "tabGraficos") { preencheSeletor(); render(); }
  });
}

})();
