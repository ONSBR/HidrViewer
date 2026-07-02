var REC_R4 = 792;
var REC_R8 = 832;
var N_COEFS = 5;
var MAX_REC = 600;   // teto de seguranca para extensao do arquivo (codigo = posicao do registro)

// ── Campos ANTES dos polinômios (bytes 0..63) ──
var PRE_FIELDS = [
  { name: "codigo_usina",      label: "Código",               type: "index" },
  { name: "nome_usina",        label: "Nome da Usina",        type: "string", size: 12 },
  { name: "posto",             label: "Posto",                type: "int32",  size: 4 },
  { name: "posto_bdh",         label: "Posto BDH",            type: "string", size: 8 },
  { name: "submercado",        label: "Submercado",           type: "int32",  size: 4 },
  { name: "empresa",           label: "Empresa",              type: "int32",  size: 4 },
  { name: "jusante",           label: "Jusante",              type: "int32",  size: 4 },
  { name: "desvio",            label: "Desvio",               type: "int32",size: 4 },
  { name: "volume_minimo",     label: "Volume Mínimo",        type: "float32",size: 4, unit: "hm3", dec: 2 },
  { name: "volume_maximo",     label: "Volume Máximo",        type: "float32",size: 4, unit: "hm3", dec: 2 },
  { name: "volume_vertedouro", label: "Volume Vertedouro",    type: "float32",size: 4, unit: "hm3", dec: 2 },
  { name: "volume_desvio",     label: "Volume Desvio",        type: "float32",size: 4, unit: "hm3", dec: 2 },
  { name: "cota_minima",       label: "Cota Mínima",          type: "float32",size: 4, unit: "m", dec: 2 },
  { name: "cota_maxima",       label: "Cota Máxima",          type: "float32",size: 4, unit: "m", dec: 2 }
];

// ── Polinômios CV e AC ──
function polFields(isR8) {
  var t = isR8 ? "float64" : "float32";
  var s = isR8 ? 8 : 4;
  var fields = [];
  for (var i = 0; i < N_COEFS; i++)
    fields.push({ name: "a" + i + "_volume_cota", label: "PCV(" + i + ")", type: t, size: s, real8: isR8, sci: true });
  for (var i = 0; i < N_COEFS; i++)
    fields.push({ name: "a" + i + "_area_cota", label: "PAC(" + i + ")", type: t, size: s, real8: isR8, sci: true });
  return fields;
}

// ── Campos DEPOIS dos polinômios ──
var POST_FIELDS = [
  { name: "evap_JAN", label: "Evaporação JAN", type: "int32", size: 4, unit: "mm/mes" },
  { name: "evap_FEV", label: "Evaporação FEV", type: "int32", size: 4, unit: "mm/mes" },
  { name: "evap_MAR", label: "Evaporação MAR", type: "int32", size: 4, unit: "mm/mes" },
  { name: "evap_ABR", label: "Evaporação ABR", type: "int32", size: 4, unit: "mm/mes" },
  { name: "evap_MAI", label: "Evaporação MAI", type: "int32", size: 4, unit: "mm/mes" },
  { name: "evap_JUN", label: "Evaporação JUN", type: "int32", size: 4, unit: "mm/mes" },
  { name: "evap_JUL", label: "Evaporação JUL", type: "int32", size: 4, unit: "mm/mes" },
  { name: "evap_AGO", label: "Evaporação AGO", type: "int32", size: 4, unit: "mm/mes" },
  { name: "evap_SET", label: "Evaporação SET", type: "int32", size: 4, unit: "mm/mes" },
  { name: "evap_OUT", label: "Evaporação OUT", type: "int32", size: 4, unit: "mm/mes" },
  { name: "evap_NOV", label: "Evaporação NOV", type: "int32", size: 4, unit: "mm/mes" },
  { name: "evap_DEZ", label: "Evaporação DEZ", type: "int32", size: 4, unit: "mm/mes" },
  { name: "num_conj_maquinas", label: "Núm. Conjuntos Máquinas",  type: "int32", size: 4 },
  { name: "maq_conj_1", label: "Máquinas Conjunto 1", type: "int32", size: 4 },
  { name: "maq_conj_2", label: "Máquinas Conjunto 2", type: "int32", size: 4 },
  { name: "maq_conj_3", label: "Máquinas Conjunto 3", type: "int32", size: 4 },
  { name: "maq_conj_4", label: "Máquinas Conjunto 4", type: "int32", size: 4 },
  { name: "maq_conj_5", label: "Máquinas Conjunto 5", type: "int32", size: 4 },
  { name: "pot_conj_1", label: "PotEf1", type: "float32", size: 4, unit: "MW", dec: 1 },
  { name: "pot_conj_2", label: "PotEf2", type: "float32", size: 4, unit: "MW", dec: 1 },
  { name: "pot_conj_3", label: "PotEf3", type: "float32", size: 4, unit: "MW", dec: 1 },
  { name: "pot_conj_4", label: "PotEf4", type: "float32", size: 4, unit: "MW", dec: 1 },
  { name: "pot_conj_5", label: "PotEf5", type: "float32", size: 4, unit: "MW", dec: 1 },
  { name: "_bloco_300", label: "", type: "skip", size: 300 },
  { name: "queda_nom_1", label: "HEf1", type: "float32", size: 4, unit: "m", dec: 2 },
  { name: "queda_nom_2", label: "HEf2", type: "float32", size: 4, unit: "m", dec: 2 },
  { name: "queda_nom_3", label: "HEf3", type: "float32", size: 4, unit: "m", dec: 2 },
  { name: "queda_nom_4", label: "HEf4", type: "float32", size: 4, unit: "m", dec: 2 },
  { name: "queda_nom_5", label: "HEf5", type: "float32", size: 4, unit: "m", dec: 2 },
  { name: "vazao_nom_1", label: "QEf1", type: "int32", size: 4, unit: "m3/s", dec: 0 },
  { name: "vazao_nom_2", label: "QEf2", type: "int32", size: 4, unit: "m3/s", dec: 0 },
  { name: "vazao_nom_3", label: "QEf3", type: "int32", size: 4, unit: "m3/s", dec: 0 },
  { name: "vazao_nom_4", label: "QEf4", type: "int32", size: 4, unit: "m3/s", dec: 0 },
  { name: "vazao_nom_5", label: "QEf5", type: "int32", size: 4, unit: "m3/s", dec: 0 },
  { name: "produtibilidade", label: "Produtibilidade Específica", type: "float32", size: 4, unit: "MW/m3/s/m", dec: 6 },
  { name: "perdas", label: "Perdas", type: "float32", size: 4, dec: 2 },
  { name: "num_pol_jusante", label: "Núm. Polinômios Jusante", type: "int32", size: 4 }
];

for (var p = 1; p <= 6; p++) {
  for (var c = 0; c < 5; c++) {
    POST_FIELDS.push({ name: "a" + c + "_jus_" + p, label: "Pol. Jusante " + p + " a" + c, type: "float32", size: 4, sci: true });
  }
}
for (var i = 1; i <= 6; i++) {
  POST_FIELDS.push({ name: "ref_jus_" + i, label: "Referência Jusante " + i, type: "float32", size: 4, dec: 2 });
}

POST_FIELDS.push(
  { name: "canal_fuga_medio",     label: "Canal de Fuga Médio",             type: "float32", size: 4, unit: "m", dec: 2 },
  { name: "infl_vert_canal_fuga", label: "Influência Vertimento Canal Fuga",type: "int32",   size: 4 },
  { name: "fator_carga_max",      label: "Fator de Carga Máximo",           type: "float32", size: 4, unit: "%", dec: 2 },
  { name: "fator_carga_min",      label: "Fator de Carga Mínimo",           type: "float32", size: 4, unit: "%", dec: 2 },
  { name: "vazao_min_hist",       label: "Vazão Mínima Histórica",           type: "int32",   size: 4, unit: "m3/s" },
  { name: "num_unid_base",        label: "Núm. Unidades Base",              type: "int32",   size: 4 },
  { name: "tipo_turbina",         label: "Tipo de Turbina",                 type: "int32",   size: 4 },
  { name: "repr_conjunto",        label: "Representação Conjunto",           type: "int32",   size: 4 },
  { name: "teif",                 label: "TEIF",                            type: "float32", size: 4, unit: "%", dec: 3 },
  { name: "ip",                   label: "IP",                              type: "float32", size: 4, unit: "%", dec: 3 },
  { name: "tipo_perda",           label: "Tipo de Perda",                   type: "int32",   size: 4 },
  { name: "data",                 label: "Data",                            type: "string",  size: 8 },
  { name: "observacao",           label: "Observação",                      type: "string",  size: 43 },
  { name: "volume_referencia",    label: "Volume de Referência",            type: "float32", size: 4, unit: "hm3", dec: 2 },
  { name: "tipo_regulacao",       label: "Tipo de Regulação",               type: "string",  size: 1 }
);

// ── Expande o bloco de 300 bytes (offset 196-495, figura campo300) ──
// Sao 3 polinomios "altura de queda x ...", cada um uma matriz 5x5 de coef.
// float32 (5 segmentos x 5 coeficientes a0..a4 = 25 x 4 = 100 bytes; 3 x 100 = 300).
// No modelo atual vem zerados, mas os campos sao float32 LIDOS do hidr.dat:
// exibem o que estiver la (zero hoje, qualquer valor se houver). Substituem o
// antigo "_bloco_300" do tipo skip.
(function expandeBloco300() {
  var grupos = [
    { sigla: "QHT", desc: "Pol. Queda x Engolimento Max. (turbina)" },
    { sigla: "QHG", desc: "Pol. Queda x Engolimento Max. (gerador)" },
    { sigla: "PH",  desc: "Pol. Queda x Potencia Max." }
  ];
  var campos = [];
  for (var g = 0; g < grupos.length; g++)
    for (var seg = 1; seg <= 5; seg++)
      for (var c = 0; c <= 4; c++)
        campos.push({
          name:  grupos[g].sigla + "A" + c + "_" + seg,
          label: grupos[g].sigla + "A" + c + "(" + seg + ")",
          type: "float32", size: 4, sci: true   // mesmo formato dos pol. de jusante
        });
  var idx = POST_FIELDS.findIndex(function(f) { return f.name === "_bloco_300"; });
  POST_FIELDS.splice.apply(POST_FIELDS, [idx, 1].concat(campos));  // troca skip(300) pelos 75 campos
})();

// ── Detecta formato ──
// Um nome de usina ocupa os bytes 0..11 do registro (mesmo offset em R4 e R8;
// so o PASSO entre registros muda: 792 vs 832). Considera "nome plausivel" se for
// ASCII imprimivel, com ao menos uma letra. Lido com o passo errado, os nomes
// desalinham e viram lixo do 2o registro em diante.
function looksLikeName(buffer, off) {
  if (off + 12 > buffer.byteLength) return false;
  var bytes = new Uint8Array(buffer, off, 12);
  var hasLetter = false, len = 0;
  for (var i = 0; i < 12; i++) {
    var c = bytes[i];
    if (c === 0) break;                 // nome termina em NUL (ou e slot em branco)
    if (c < 32 || c > 126) return false; // byte nao imprimivel -> nao e nome
    if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122)) hasLetter = true;
    len++;
  }
  return len >= 2 && hasLetter;
}

// Quantos registros tem nome plausivel para um dado passo (recSize).
function scoreFormat(buffer, recSize) {
  var n = Math.floor(buffer.byteLength / recSize);
  var score = 0;
  for (var r = 0; r < n; r++) if (looksLikeName(buffer, r * recSize)) score++;
  return score;
}

// Retorna "real8", "real4" ou null. Quando o tamanho casa com AMBOS os formatos
// (colisao: lcm(792,832)=82368), desempata pelo alinhamento dos nomes.
function detectFormat(byteLength, buffer) {
  var r8 = byteLength % REC_R8 === 0;
  var r4 = byteLength % REC_R4 === 0;
  if (r8 && !r4) return "real8";
  if (r4 && !r8) return "real4";
  if (r4 && r8) {
    if (!buffer) return "real8";         // sem conteudo p/ desempatar: mantem o legado
    var s4 = scoreFormat(buffer, REC_R4);
    var s8 = scoreFormat(buffer, REC_R8);
    return s4 > s8 ? "real4" : "real8";  // empate -> R8 (comportamento antigo)
  }
  return null;
}

function buildFields(isR8) {
  return [].concat(PRE_FIELDS, polFields(isR8), POST_FIELDS);
}

// ── Ordem de EXIBICAO (tabela + CSV), compativel com o CadUsH .xlsx ──
// IMPORTANTE: isto NAO altera a ordem binaria do hidr.dat. parseRecords/writeRecord
// continuam na ordem de bytes do registro; aqui so reordenamos o que e mostrado/exportado.
// O Importar CSV casa por NOME de coluna, entao aceita esta (ou qualquer) ordem.
var DISPLAY_ORDER = [
  "codigo_usina", "nome_usina", "submercado", "empresa", "posto", "posto_bdh", "jusante", "desvio",
  "volume_maximo", "volume_minimo", "cota_maxima", "cota_minima", "volume_vertedouro", "volume_desvio",
  "a0_volume_cota", "a1_volume_cota", "a2_volume_cota", "a3_volume_cota", "a4_volume_cota",
  "a0_area_cota", "a1_area_cota", "a2_area_cota", "a3_area_cota", "a4_area_cota",
  "evap_JAN", "evap_FEV", "evap_MAR", "evap_ABR", "evap_MAI", "evap_JUN",
  "evap_JUL", "evap_AGO", "evap_SET", "evap_OUT", "evap_NOV", "evap_DEZ",
  "produtibilidade", "canal_fuga_medio", "teif", "ip", "tipo_turbina",
  "num_conj_maquinas", "num_pol_jusante", "fator_carga_max", "fator_carga_min",
  "tipo_perda", "perdas", "vazao_min_hist", "num_unid_base",
  "infl_vert_canal_fuga", "repr_conjunto",
  // Maquinas intercaladas por conjunto: #Maq, PotEf, QEf(=vazao), HEf(=queda)
  "maq_conj_1", "pot_conj_1", "vazao_nom_1", "queda_nom_1",
  "maq_conj_2", "pot_conj_2", "vazao_nom_2", "queda_nom_2",
  "maq_conj_3", "pot_conj_3", "vazao_nom_3", "queda_nom_3",
  "maq_conj_4", "pot_conj_4", "vazao_nom_4", "queda_nom_4",
  "maq_conj_5", "pot_conj_5", "vazao_nom_5", "queda_nom_5",
  // Jusante por polinomio: PJA0..4 e PJRM (xlsx tem 5; o jus_6 do HTML vai ao final)
  "a0_jus_1", "a1_jus_1", "a2_jus_1", "a3_jus_1", "a4_jus_1", "ref_jus_1",
  "a0_jus_2", "a1_jus_2", "a2_jus_2", "a3_jus_2", "a4_jus_2", "ref_jus_2",
  "a0_jus_3", "a1_jus_3", "a2_jus_3", "a3_jus_3", "a4_jus_3", "ref_jus_3",
  "a0_jus_4", "a1_jus_4", "a2_jus_4", "a3_jus_4", "a4_jus_4", "ref_jus_4",
  "a0_jus_5", "a1_jus_5", "a2_jus_5", "a3_jus_5", "a4_jus_5", "ref_jus_5",
  "a0_jus_6", "a1_jus_6", "a2_jus_6", "a3_jus_6", "a4_jus_6", "ref_jus_6",
  "data", "observacao", "volume_referencia", "tipo_regulacao"
];

// Insere os 75 campos do bloco300 (QHT/QHG/PH) na ordem de exibicao logo ANTES
// dos polinomios de jusante — assim os de jusante (e suas referencias) ficam
// depois de QHTA/QHGA/PHA, e Data/Observacao/Vol.Ref/Tipo Regulacao seguem como
// ultimas colunas.
(function ordenaBloco300() {
  var nomes = [], siglas = ["QHT", "QHG", "PH"];
  for (var g = 0; g < siglas.length; g++)
    for (var seg = 1; seg <= 5; seg++)
      for (var c = 0; c <= 4; c++)
        nomes.push(siglas[g] + "A" + c + "_" + seg);
  var at = DISPLAY_ORDER.indexOf("a0_jus_1");      // antes do 1o polinomio de jusante
  if (at < 0) at = DISPLAY_ORDER.indexOf("data");
  if (at < 0) at = DISPLAY_ORDER.length;
  DISPLAY_ORDER.splice.apply(DISPLAY_ORDER, [at, 0].concat(nomes));
})();

// Colunas ocultas na exibicao/CSV (continuam no binario, lidas/gravadas normalmente).
// O 6o polinomio de jusante nao entra no CSV (o padrao usa 5 polinomios: PJ(1..5)).
var OCULTAR_COLUNAS = {
  a0_jus_6: 1, a1_jus_6: 1, a2_jus_6: 1, a3_jus_6: 1, a4_jus_6: 1, ref_jus_6: 1
};

// Campos na ORDEM DE EXIBICAO. Campos nao listados em DISPLAY_ORDER sao anexados
// ao final na ordem binaria (seguranca, p/ nunca sumir uma coluna).
function displayFields(fields) {
  fields = fields || currentFields;
  var byName = {};
  for (var i = 0; i < fields.length; i++)
    if (fields[i].type !== "skip" && !OCULTAR_COLUNAS[fields[i].name]) byName[fields[i].name] = fields[i];
  var out = [];
  for (var k = 0; k < DISPLAY_ORDER.length; k++) {
    var f = byName[DISPLAY_ORDER[k]];
    if (f) { out.push(f); delete byName[DISPLAY_ORDER[k]]; }
  }
  for (var j = 0; j < fields.length; j++)
    if (fields[j].type !== "skip" && byName[fields[j].name]) {
      out.push(fields[j]); delete byName[fields[j].name];
    }
  return out;
}

// ── Parsing ──
function parseRecords(buffer, isR8) {
  var view = new DataView(buffer);
  var recSize = isR8 ? REC_R8 : REC_R4;
  var nRec = Math.floor(buffer.byteLength / recSize);
  var fields = buildFields(isR8);
  var records = [];

  for (var r = 0; r < nRec; r++) {
    var off = r * recSize;
    var row = {};
    for (var fi = 0; fi < fields.length; fi++) {
      var f = fields[fi];
      if (f.type === "index") { row[f.name] = r + 1; continue; }
      if (f.type === "skip")  { off += f.size; continue; }
      if (f.type === "string") {
        var bytes = new Uint8Array(buffer, off, f.size);
        var s = "";
        for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
        row[f.name] = s.replace(/\0+$/g, "").trim();
        off += f.size;
      } else if (f.type === "int32") {
        row[f.name] = view.getInt32(off, true);
        off += 4;
      } else if (f.type === "float32") {
        row[f.name] = view.getFloat32(off, true);
        off += 4;
      } else if (f.type === "float64") {
        row[f.name] = view.getFloat64(off, true);
        off += 8;
      }
    }
    records.push(row);
  }
  return records;
}

// Expoente sempre com "E" maiusculo, na exibicao E no CSV. O hidr.dat e binario
// (writeRecord grava bytes float, nao texto), entao isto nao o afeta; o roundtrip
// segue OK pois csvCellOf usa este mesmo fmt e o parseFloat aceita "E".
function expCase(s, forCSV) { return s.replace("e", "E"); }

// ── Formatacao ──
function fmt(val, field, forCSV) {
  if (field.type === "string" || field.type === "index") return val;
  if (field.dec !== undefined) return val.toFixed(field.dec).replace(".", ",");
  if (field.type === "int32") return val;
  if (field.sci) {
    // float64: CSV usa 17 sig. dig. (toExponential(16)) para roundtrip lossless
    // texto -> parseFloat -> float64 (regra IEEE 754). Visualizador usa 15 sig. dig.
    // (toExponential(14)) por legibilidade. Na exibicao o "e" vira "E" maiusculo.
    if (field.type === "float64") return expCase(val.toExponential(forCSV ? 16 : 14).replace(".", ","), forCSV);
    return expCase(val.toExponential(6).replace(".", ","), forCSV);
  }
  if (val === 0) return "0";
  var abs = Math.abs(val);
  if (abs >= 0.01 && abs < 1e8) return val.toPrecision(10).replace(".", ",");
  return expCase(val.toExponential(10).replace(".", ","), forCSV);
}

// Rotulos de submercado (EXIBICAO + CSV). No hidr.dat (binario) continua o numero:
// o csvNum() na importacao le o numero a frente ("1 - Sudeste" -> 1).
var SUBMERCADO = { 1: "1 - Sudeste", 2: "2 - Sul", 3: "3 - Nordeste", 4: "4 - Norte" };
function submLabel(val) { return SUBMERCADO[val] || null; }

// Empresa: codigo -> "codigo - NOME" (coluna Empresa_orig do CadUsH; snapshot do xlsx).
var EMPRESA = {
  2:"2 - Sul",15:"15 - EMAE",16:"16 - CESP",17:"17 - LIGHT",18:"18 - CEMIG",
  19:"19 - FURNAS",22:"22 - CEEE",23:"23 - COPEL",24:"24 - ENGIE BRASIL",33:"33 - CHESF",
  37:"37 - ELETRONORTE",40:"40 - ITAIPU BINACIONAL",55:"55 - RIO PARANAPANEMA",56:"56 - AES BRASIL",
  61:"61 - CERAN",65:"65 - CBA",70:"70 - TANGARA",75:"75 - CEC",76:"76 - CESC",77:"77 - PORTO ESTRELA",
  86:"86 - INVESTCO",93:"93 - VOTORANTIM CIMENTOS",94:"94 - CORUMBA CONCESSOES",95:"95 - ENEL",
  110:"110 - SAO ROQUE",132:"132 - RIO VERDE",134:"134 - CESAP",138:"138 - SEFAC",
  158:"158 - ALIANÇA ENERGIA",159:"159 - FOZ DO CHAPECO",189:"189 - ELETROSUL",204:"204 - ELETROGOES",
  205:"205 - ENERGEST",218:"218 - STO ANTONIO ENERGIA",224:"224 - NEOENERGIA",227:"227 - FOZ R CLARO",
  228:"228 - IJUI",236:"236 - JIRAU ENERGIA",238:"238 - RIO CANOAS",239:"239 - ALUPAR",240:"240 - AMAPA",
  278:"278 - CACHOEIRA ENERGIA",280:"280 - TIJOA",281:"281 - RIO PARANA",282:"282 - TIJOA/PARANA",
  285:"285 - SAO SIMAO",286:"286 - SAO MANOEL",287:"287 - ENEL GREEN POWER",289:"289 - KINROSS",
  294:"294 - STATKRAFT",297:"297 - JURUENA",306:"306 - CES",322:"322 - ELERA",
  326:"326 - ATIAIA RENOVAVEIS",328:"328 - JAURU ENERGETICA",330:"330 - ENGIE BRASIL",331:"331 - BAESA",
  332:"332 - ENERCAM",333:"333 - DFESA",334:"334 - NORTE ENERGIA",335:"335 - ESPORA ENERGETICA",
  336:"336 - GUILMAN AMORIM",338:"338 - LDQSPE",339:"339 - ELETROBRAS"
};
function empLabel(val) {
  var s = EMPRESA[val];
  if (!s) return null;
  // Nome da empresa em Title Case: 1a letra de CADA palavra maiuscula, resto
  // minusculo (prefixo "cod - " preservado). O round-trip nao e afetado: csvNum
  // le o numero a frente.
  var i = s.indexOf(" - ");
  if (i < 0) return s;
  var nome = s.slice(i + 3).toLowerCase().replace(/\S+/g, function(w) {
    return w.charAt(0).toUpperCase() + w.slice(1);
  });
  return s.slice(0, i + 3) + nome;
}

// Influencia do vertimento no canal de fuga: 1 = Yes, 0 = No (exibicao COM numero).
// O round-trip ja vem do prefixo numerico (csvNum le o numero a frente).
var INFL_CANAL = { 0: "0 - No", 1: "1 - Yes" };
function inflLabel(val) { return INFL_CANAL[val] || null; }

// Tipo de regulacao (campo string de 1 caractere). No binario continua so a letra:
// na importacao/edicao o writeStringField trunca para 1 char ("D - Diaria" -> "D").
var REGULACAO = { D: "D - Diaria", M: "M - Mensal", S: "S - Semanal" };
function regLabel(val) { return REGULACAO[String(val).trim().toUpperCase()] || null; }

// Tipo de perda hidraulica: 1 = perda em % da queda; 2 = perda constante em metros.
// No binario continua o numero (csvNum le o numero a frente: "1 - %" -> 1).
var TIPO_PERDA = { 1: "1 - %", 2: "2 - m" };
function perdaLabel(val) { return TIPO_PERDA[val] || null; }

// Representacao do conjunto de maquinas. Rotulo SO na exibicao (detalhe/tabela);
// no CSV este campo continua numerico.
var REPR_CONJUNTO = { 2: "2 - Simpl" };
function reprLabel(val) { return REPR_CONJUNTO[val] || null; }

// Converte texto -> numero. Tolera tambem "Yes"/"No" puro (caso seja digitado sem
// o prefixo). Fora desses casos, cai no csvNum() padrao (numero, virgula decimal).
function parseFieldNum(raw, fieldName) {
  if (fieldName === "infl_vert_canal_fuga") {
    var k = String(raw).trim().toLowerCase();
    if (k === "yes") return 1;
    if (k === "no")  return 0;
  }
  return csvNum(raw);
}

// Converte float -> inteiro com ARREDONDAMENTO PADRAO (ABNT NBR 5891 / banker's):
// para o mais proximo e, no empate exato ",5", para o vizinho PAR. Mesmo criterio
// do round() do Python (que gerou o hidr_real8). Ex.: 6,7 -> 7; 6,2 -> 6; 6,5 -> 6;
// 7,5 -> 8; -2,5 -> -2. Antes usava "| 0", que TRUNCAVA em direcao ao zero
// (6,7 -> 6). O Math.round do JS nao serve: joga todo ",5" para cima.
function roundInt(v) {
  var baixo = Math.floor(v);
  var frac = v - baixo;
  if (frac < 0.5) return baixo;
  if (frac > 0.5) return baixo + 1;
  return (baixo % 2 === 0) ? baixo : baixo + 1;   // empate ",5" -> vizinho par
}

// Rotulo de referencia a outra usina (ex.: Desvio aponta p/ o codigo de uma usina).
// "175 - P.AFONSO 4"; codigo 0 -> "0 - NÃO HÁ". No binario continua so o codigo:
// o csvNum() na importacao le o numero a frente ("175 - ..." -> 175).
function usinaRefLabel(code) {
  if (!code) return "0 - NÃO HÁ";
  var rec = allRecords[code - 1];
  return code + " - " + ((rec && rec.nome_usina) ? rec.nome_usina : "");
}

// Formata para a TELA (tabela/detalhe), aplicando rotulos amigaveis.
function fmtDisplay(val, field) {
  // Perdas nao leva unidade: a unidade (%/m) ja e indicada pelo campo tipo_perda.
  if (field.name === "submercado" && submLabel(val)) return submLabel(val);
  if (field.name === "empresa" && empLabel(val)) return empLabel(val);
  if (field.name === "jusante") return usinaRefLabel(val);
  if (field.name === "desvio") return usinaRefLabel(val);
  if (field.name === "tipo_turbina" && turbLabel(val)) return turbLabel(val);
  if (field.name === "infl_vert_canal_fuga" && inflLabel(val)) return inflLabel(val);
  if (field.name === "tipo_regulacao" && regLabel(val)) return regLabel(val);
  if (field.name === "tipo_perda" && perdaLabel(val)) return perdaLabel(val);
  if (field.name === "repr_conjunto" && reprLabel(val)) return reprLabel(val);
  return fmt(val, field);
}

// ── CSV ──
// Titulos das colunas do CSV (campo interno -> cabecalho). Fonte unica, usada na
// exportacao (csvHeaderFor) e na importacao (csvFieldFor, via mapa reverso).
var CSV_HEADERS = (function() {
  var H = {
    codigo_usina: "CodUsina", nome_usina: "Usina", submercado: "Sistema",
    empresa: "Empresa", posto: "Posto", posto_bdh: "Posto BDH",
    jusante: "Jusante", desvio: "Desvio",
    volume_maximo: "Vol.Máx.(hm3)", volume_minimo: "Vol.min.(hm3)",
    cota_maxima: "Cota Máx.(m)", cota_minima: "Cota min.(m)",
    volume_vertedouro: "Vol.Vert.(hm3)", volume_desvio: "Vol.Desv.(hm3)",
    produtibilidade: "Prod.Esp.(MW/m3/s/m)", canal_fuga_medio: "Canal Fuga Médio(m)",
    teif: "TEIF(%)", ip: "IP(%)", tipo_turbina: "Tipo Turbina",
    num_conj_maquinas: "Num.Conj.Máq.", num_pol_jusante: "Num.Pols.Jus.",
    fator_carga_max: "Fat.Carga Máx.(%)", fator_carga_min: "Fat.Carga mín.(%)",
    tipo_perda: "Tipo Perdas(1=%/2=M/3=K)", perdas: "Valor Perdas",
    vazao_min_hist: "Vazão Mín.Hist.(m3/s)", num_unid_base: "Num.Unid.Base",
    infl_vert_canal_fuga: "Infl.Vert.Canal de Fuga",
    repr_conjunto: "Rep.Conj(0=aprox/1=det/2=simp)",
    data: "Data", observacao: "Obs", volume_referencia: "Vol.Ref.", tipo_regulacao: "Reg"
  };
  var i;
  for (i = 0; i < 5; i++) { H["a" + i + "_volume_cota"] = "PCV(" + i + ")"; H["a" + i + "_area_cota"] = "PAC(" + i + ")"; }
  var MES = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];
  for (i = 0; i < 12; i++) H["evap_" + MES[i]] = "Evap.Men.(" + (i + 1) + ")";
  for (i = 1; i <= 5; i++) {
    H["maq_conj_" + i] = "#Maq(" + i + ")"; H["pot_conj_" + i] = "PotEf(" + i + ")";
    H["vazao_nom_" + i] = "QEf(" + i + ")"; H["queda_nom_" + i] = "HEf(" + i + ")";
  }
  var sig = ["QHT","QHG","PH"];
  for (var g = 0; g < sig.length; g++)
    for (var seg = 1; seg <= 5; seg++)
      for (var c = 0; c <= 4; c++)
        H[sig[g] + "A" + c + "_" + seg] = sig[g] + "A" + c + "(" + seg + ")";
  for (var p = 1; p <= 6; p++) {              // jus 1..6 mapeados (jus_6 fica oculto na exibicao)
    for (i = 0; i <= 4; i++) H["a" + i + "_jus_" + p] = "PJA" + i + "(" + p + ")";
    H["ref_jus_" + p] = "PJRM(" + p + ")";
  }
  return H;
})();

function csvHeaderFor(name) { return CSV_HEADERS[name] || name; }

// Normaliza um cabecalho para casar na importacao: minusculas, sem espacos nas
// bordas e SEM acentos. Assim "Vol.Máx.(hm3)" e "Vol.Max.(hm3)" casam igual — o
// import reconhece o cabecalho com ou sem acento.
function normHeader(s) {
  return String(s).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Reverso (import): cabecalho do CSV (normalizado) -> nome interno do campo.
var CSV_FIELD_BY_HEADER = (function() {
  var R = {};
  for (var k in CSV_HEADERS) if (CSV_HEADERS.hasOwnProperty(k)) R[normHeader(CSV_HEADERS[k])] = k;
  return R;
})();
function csvFieldFor(header) {
  var h = String(header).trim(), m;
  var byMap = CSV_FIELD_BY_HEADER[normHeader(h)];
  if (byMap) return byMap;
  // Compatibilidade com cabecalhos antigos:
  if (m = h.match(/^PotEf\s*(\d)/i)) return "pot_conj_" + m[1];
  if (m = h.match(/^QEf\s*(\d)/i))   return "vazao_nom_" + m[1];
  if (m = h.match(/^HEf\s*(\d)/i))   return "queda_nom_" + m[1];
  if (m = h.match(/^PCV\s*\(?\s*(\d)/i))   return "a" + m[1] + "_volume_cota";
  if (m = h.match(/^PAC\s*\(?\s*(\d)/i))   return "a" + m[1] + "_area_cota";
  if (m = h.match(/Cota x Volume a(\d)/i)) return "a" + m[1] + "_volume_cota";
  if (m = h.match(/rea x Cota a(\d)/i))    return "a" + m[1] + "_area_cota";
  if (m = h.match(/^PJA\s*(\d)\s*\(?\s*(\d)/i)) return "a" + m[1] + "_jus_" + m[2];
  if (m = h.match(/^PJRM\s*\(?\s*(\d)/i))       return "ref_jus_" + m[1];
  return h;
}

function toCSV(records, fields) {
  var visible = displayFields(fields);   // ordem de exibicao (compativel com o xlsx)
  var cols = visible.map(function(f) { return f.name; });
  var header = cols.map(csvHeaderFor).join(";");
  var rows = records.map(function(row) {
    return cols.map(function(c) {
      var f = visible.find(function(x) { return x.name === c; });
      // posto_bdh sai vazio na coluna do CSV (csvCellOf espelha "" -> nao reescreve
      // a celula na importacao, preservando os bytes originais "0       ").
      if (f.name === "posto_bdh") return '""';
      // tipo_regulacao no CSV vai so a letra (ex.: "M"); cai no caso string abaixo.
      // A exibicao no app continua "M - Mensal" (via regLabel em fmtDisplay).
      if (f.type === "string") return '"' + row[c] + '"';
      if (f.name === "submercado" && submLabel(row[c])) return submLabel(row[c]);
      if (f.name === "empresa" && empLabel(row[c])) return empLabel(row[c]);
      if (f.name === "jusante") return usinaRefLabel(row[c]);
      if (f.name === "desvio") return usinaRefLabel(row[c]);
      if (f.name === "tipo_turbina" && turbLabel(row[c])) return turbLabel(row[c]);
      // tipo_perda no CSV vai so o numero (cai no caso numerico abaixo).
      if (f.name === "infl_vert_canal_fuga" && inflLabel(row[c])) return row[c] === 1 ? "Yes" : "No";
      return String(fmt(row[c], f, true)).replace(".", ",");
    }).join(";");
  });
  return header + "\n" + rows.join("\n");
}

// Mensagem nao-bloqueante (toast) que aparece e some sozinha.
function showToast(msg) {
  var t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(function() { t.classList.add("toast-show"); });
  setTimeout(function() {
    t.classList.remove("toast-show");
    setTimeout(function() { if (t.parentNode) t.parentNode.removeChild(t); }, 300);
  }, 2800);
}

function downloadCSV(records, fields) {
  var csv = toCSV(records, fields);
  var blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url; a.download = "hidr_cadastro.csv"; a.click();
  URL.revokeObjectURL(url);
  showToast("CSV exportado: hidr_cadastro.csv (" + records.length + " usinas).");
}

// \u2500\u2500 Leitura/aplicacao de CSV \u2500\u2500
function parseCSVLine(line) {
  var out = []; var cur = ""; var inQ = false;
  for (var i = 0; i < line.length; i++) {
    var ch = line[i];
    if (inQ) {
      if (ch === '"') { if (line[i+1] === '"') { cur += '"'; i++; } else inQ = false; }
      else cur += ch;
    } else {
      if (ch === '"') inQ = true;
      else if (ch === ";") { out.push(cur); cur = ""; }
      else cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function parseCSV(text) {
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1); // BOM
  var lines = text.split(/\r?\n/).filter(function(l) { return l.length > 0; });
  if (lines.length < 2) return { headers: [], rows: [] };
  // Traduz os cabecalhos de maquina do CSV (PotEf1 -> pot_conj_1 etc.) para o nome
  // interno; demais colunas passam inalteradas.
  var headers = parseCSVLine(lines[0]).map(function(h) { return csvFieldFor(h.trim()); });
  var rows = [];
  for (var i = 1; i < lines.length; i++) {
    var cells = parseCSVLine(lines[i]);
    var obj = {};
    for (var j = 0; j < headers.length; j++) obj[headers[j]] = cells[j];
    rows.push(obj);
  }
  return { headers: headers, rows: rows };
}

function csvNum(s) {
  if (s === undefined || s === null) return null;
  s = String(s).trim();
  if (s === "") return null;
  s = s.replace(",", ".");
  var v = parseFloat(s);
  return isNaN(v) ? null : v;
}

function writeStringField(buffer, off, size, str) {
  var arr = new Uint8Array(buffer, off, size);
  str = String(str || "");
  for (var i = 0; i < size; i++) {
    arr[i] = i < str.length ? (str.charCodeAt(i) & 0xff) : 0x20;
  }
}

// Reproduz a celula que o exportador geraria para um campo
function csvCellOf(rec, f) {
  // posto_bdh exportado vazio: espelha "" para nao marcar a celula como alterada
  // na importacao (preserva os bytes originais "0       ").
  if (f.name === "posto_bdh") return "";
  // tipo_regulacao espelha o CSV (so a letra) — cai no caso string abaixo.
  if (f.type === "string") return rec[f.name] || "";
  if (f.type === "index")  return String(rec[f.name]);
  if (f.name === "submercado" && submLabel(rec[f.name])) return submLabel(rec[f.name]);
  if (f.name === "empresa" && empLabel(rec[f.name])) return empLabel(rec[f.name]);
  if (f.name === "jusante") return usinaRefLabel(rec[f.name]);
  if (f.name === "desvio") return usinaRefLabel(rec[f.name]);
  if (f.name === "tipo_turbina" && turbLabel(rec[f.name])) return turbLabel(rec[f.name]);
  // tipo_perda espelha o CSV (so o numero) — cai no caso numerico abaixo.
  if (f.name === "infl_vert_canal_fuga" && inflLabel(rec[f.name])) return rec[f.name] === 1 ? "Yes" : "No";
  return String(fmt(rec[f.name], f, true)).replace(",", ".");
}

function writeRecord(buffer, isR8, recIndex, valuesByName, currentRec) {
  var recSize = isR8 ? REC_R8 : REC_R4;
  var fields = buildFields(isR8);
  var view = new DataView(buffer);
  var off = recIndex * recSize;
  for (var i = 0; i < fields.length; i++) {
    var f = fields[i];
    if (f.type === "index") continue;
    if (f.type === "skip")  { off += f.size; continue; }
    var raw = valuesByName[f.name];
    if (raw === undefined) {
      // coluna ausente no CSV → preserva
      if (f.type === "string") off += f.size;
      else if (f.type === "float64") off += 8;
      else off += 4;
      continue;
    }
    // Data: o CSV pode vir com "/" (ex.: 13/05/26); o hidr.dat usa "-" (13-05-26),
    // igual a edicao manual (commitFromCell). Normaliza antes de comparar/gravar.
    if (f.name === "data" && raw != null) raw = String(raw).replace(/\//g, "-");
    var expected = csvCellOf(currentRec, f);
    // raw vem do CSV com virgula decimal; expected ja foi normalizado para ponto
    // por csvCellOf. Igualar os dois lados aqui evita reescrever celulas que
    // nao foram editadas — preservando os bytes originais do buffer e evitando
    // perda de 1 ULP na ida-e-volta texto -> float.
    var rawNorm = String(raw).trim().replace(",", ".");
    if (f.type === "string") {
      if (String(raw) !== expected) writeStringField(buffer, off, f.size, raw);
      off += f.size;
    } else if (f.type === "int32") {
      if (rawNorm === expected) { off += 4; continue; }
      var vi = parseFieldNum(raw, f.name);
      if (vi !== null) view.setInt32(off, roundInt(vi), true);
      off += 4;
    } else if (f.type === "float32") {
      if (rawNorm === expected) { off += 4; continue; }
      var vf = csvNum(raw);
      if (vf !== null) view.setFloat32(off, vf, true);
      off += 4;
    } else if (f.type === "float64") {
      // Coefs CV/CA: SEMPRE grava o valor do CSV como float64 nativo (real8 genuino),
      // sem a otimizacao "pula se nao mudou" — assim nunca se preserva o float32
      // alargado pela conversao R4->R8 (que carregaria a cauda binaria). Para usinas
      // ausentes no CSV (raw === undefined) o bloco acima preserva o valor convertido.
      var vd = csvNum(raw);
      if (vd !== null) view.setFloat64(off, vd, true);
      off += 8;
    }
  }
}

// Ajusta a barra de fluxos (Opcao A) conforme o formato carregado:
//  - sem arquivo: barra escondida;
//  - REAL*8: so o bloco "Trabalhar em REAL*8";
//  - REAL*4: bloco "Trabalhar em REAL*4" + bloco "Converter p/ REAL*8".
// O bloco "Converter" so aparece em R4 (rebaixar R8->R4 perderia a cauda binaria).
function updateFlowUI() {
  var bar = document.getElementById("flowBar");
  if (!bar) return;
  // Barra de acoes so na aba Tabela: na aba Usina some (exceto "Novo arquivo",
  // que fica no topo) para nao sugerir que aquela aba e editavel.
  var tabelaAtiva = document.getElementById("tabTabela").classList.contains("active");
  if (!originalBuffer || !tabelaAtiva) { bar.classList.add("hidden"); return; }
  bar.classList.remove("hidden");
  var r8 = isOrigR8;
  var title = document.getElementById("flowWorkTitle");
  if (title) title.textContent = "Trabalhar em " + (r8 ? "REAL*8" : "REAL*4");
  var imp = document.getElementById("btnImportKeep");
  if (imp) {
    imp.disabled = false;
    imp.title = r8
      ? "Importa o CSV gravando em REAL*8 (float64 nativo)"
      : "Importa o CSV gravando em REAL*4 (float32), mantendo o formato";
  }
  var exp = document.getElementById("btnR8");
  if (exp) {
    exp.disabled = false;
    exp.textContent = "Exportar hidr.dat (" + (r8 ? "REAL*8" : "REAL*4") + ")";
  }
  var conv = document.getElementById("flowConvert");
  if (conv) conv.classList.toggle("hidden", r8);   // converter so faz sentido em R4
}

// targetR8 = true  -> importacao REAL*8 GENUINA: promove R4->R8 e grava os coefs
//                     CV/CA como float64 nativo (parseFloat -> setFloat64), sem cauda.
// targetR8 = false -> importacao REAL*4: NAO promove; grava no buffer R4 como float32.
function applyCSV(text, targetR8) {
  if (!originalBuffer) {
    alert("Carregue primeiro um arquivo hidr.dat para aplicar valores do CSV.");
    return;
  }
  var parsed = parseCSV(text);
  if (!parsed.headers.length) {
    alert("CSV vazio ou ilegivel.");
    return;
  }
  if (parsed.headers.indexOf("codigo_usina") < 0) {
    alert("CSV nao contem a coluna 'codigo_usina'. Use o mesmo formato do CSV exportado.");
    return;
  }

  if (targetR8) {
    // Se origem e REAL*4, promove o buffer para REAL*8 antes de aplicar.
    // Os coefs CV/CA do CSV passam a ser gravados como float64 nativos
    // (parseFloat -> setFloat64), eliminando a "cauda binaria" do float32.
    if (!isOrigR8) {
      originalBuffer = convertToR8(originalBuffer);
      isOrigR8 = true;
      currentFields = buildFields(true);
    }
  } else {
    // Importacao REAL*4: o buffer continua R4 e os valores sao gravados como
    // float32. Nao rebaixamos um R8 para R4 — isso perderia a cauda binaria.
    if (isOrigR8) {
      alert("O arquivo carregado e REAL*8. Para importar em REAL*4, carregue um hidr.dat REAL*4.\n\nUse \"Importar CSV (R8)\" para este arquivo.");
      return;
    }
  }

  var useR8 = isOrigR8;                       // formato efetivo do buffer
  var recSize = useR8 ? REC_R8 : REC_R4;

  var byCode = {};
  var maxCode = 0;
  for (var i = 0; i < parsed.rows.length; i++) {
    var row = parsed.rows[i];
    var code = parseInt(row.codigo_usina);
    if (!isNaN(code)) { byCode[code] = row; if (code > maxCode) maxCode = code; }
  }

  // Código = posicao do registro: se o CSV referencia codigos alem do nº de
  // registros atual, estende o arquivo ate o proximo tamanho padrao (320 -> 600),
  // limitado a MAX_REC. Sem isso, esses codigos seriam descartados em silencio.
  var created = (maxCode > Math.floor(originalBuffer.byteLength / recSize))
    ? growBufferTo(tamanhoPadraoPara(maxCode), useR8) : 0;

  var nRec = Math.floor(originalBuffer.byteLength / recSize);

  // Códigos do CSV que ficaram acima do que o arquivo comporta (alem de MAX_REC)
  var dropped = 0;
  for (var c in byCode) if (byCode.hasOwnProperty(c) && parseInt(c) > nRec) dropped++;

  // Snapshot dos registros atuais para detectar quais celulas o usuario realmente alterou
  var currentRecords = parseRecords(originalBuffer, useR8);
  var applied = 0;
  for (var r = 0; r < nRec; r++) {
    var row2 = byCode[r + 1];
    if (!row2) continue;
    writeRecord(originalBuffer, useR8, r, row2, currentRecords[r]);
    applied++;
  }

  csvApplied = true;

  // Re-parse e atualiza visualizacao
  allRecords = parseRecords(originalBuffer, useR8);
  visibleRecords = allRecords.filter(function(r) {
    return r.nome_usina && r.nome_usina.length > 0;
  });

  // Atualiza header (formato pode ter virado R8 numa importacao R8 de origem R4)
  atualizaContadores();
  document.getElementById("infoTamReg").textContent = recSize + " bytes";
  var infoFmt = document.getElementById("infoFormato");
  infoFmt.textContent = useR8 ? "REAL*8" : "REAL*4";
  infoFmt.className = "header-info-value " + (useR8 ? "fmt-r8" : "fmt-r4");

  // Re-renderiza tabela: cabecalhos podem ter passado de R4 para R8
  buildTable(visibleRecords);
  applyFilters();
  buildPlantCards(allRecords);
  if (selectedPlantIdx >= 0 && allRecords[selectedPlantIdx]) {
    renderDetail(allRecords[selectedPlantIdx]);
  }

  // Libera edicao; a barra de fluxos cuida do export e da visibilidade dos blocos
  var btnEditC = document.getElementById("btnEdit");
  btnEditC.disabled = false;
  btnEditC.title = "";
  updateFlowUI();      // uma importacao R8 de origem R4 pode ter virado o buffer R8

  // Consistencia dos valores importados: mesmas regras da edicao manual. Popula
  // errosConsistencia (que bloqueia a exportacao) e marca as celulas no render.
  var nErros = revalidaTodos();

  var msg = "CSV aplicado (" + (useR8 ? "REAL*8" : "REAL*4") + "): " + applied + " registro(s) atualizado(s).";
  if (created > 0) msg += "\n" + created + " registro(s) novo(s) criado(s) (arquivo agora com " + nRec + " registros).";
  if (dropped > 0) msg += "\nATENCAO: " + dropped + " usina(s) do CSV com codigo acima de " + MAX_REC + " foram ignoradas (teto de " + MAX_REC + " registros).";
  if (nErros > 0) {
    var linhas = linhasDeErro();
    msg += "\n\nATENCAO: " + linhas.length + " inconsistencia(s) detectada(s) nos dados importados " +
      "(a exportacao do hidr.dat fica bloqueada ate corrigir; entre em \"Editar dados\" " +
      "para ver as celulas destacadas em vermelho):\n\n" +
      linhas.slice(0, 12).join("\n") +
      (linhas.length > 12 ? "\n…" : "");
  }
  alert(msg);
}

// ── Estado global ──
var allRecords = [];      // todos os registros do hidr.dat
var visibleRecords = [];  // somente com nome_usina preenchido (para tabela/CSV/visualizacao)
var currentFields = [];
var originalBuffer = null;
var isOrigR8 = false;
var csvApplied = false;   // true apos um import de CSV; libera download de REAL*8
var editMode = false;     // modo edicao da tabela
var dirtyCells = {};      // celulas alteradas nesta sessao: chave "recIndex:campo"

// ── Conversao REAL*4 → REAL*8 ──
var OFF_CV = 64;
var OFF_CA = 84;
var OFF_POS_CA = 104;

function convertToR8(buf) {
  var nRec = Math.floor(buf.byteLength / REC_R4);
  var newBuf = new ArrayBuffer(nRec * REC_R8);
  var src = new DataView(buf);
  var dst = new DataView(newBuf);
  var srcArr = new Uint8Array(buf);
  var dstArr = new Uint8Array(newBuf);

  for (var r = 0; r < nRec; r++) {
    var srcBase = r * REC_R4;
    var dstBase = r * REC_R8;
    var dstOff = dstBase;

    // 1) Bytes 0..63 — copiar
    dstArr.set(srcArr.subarray(srcBase, srcBase + OFF_CV), dstOff);
    dstOff += OFF_CV;

    // 2) CV: 5 x float32 → float64
    for (var i = 0; i < N_COEFS; i++) {
      var val = src.getFloat32(srcBase + OFF_CV + i * 4, true);
      dst.setFloat64(dstOff, val, true);
      dstOff += 8;
    }

    // 3) CA: 5 x float32 → float64
    for (var j = 0; j < N_COEFS; j++) {
      var val2 = src.getFloat32(srcBase + OFF_CA + j * 4, true);
      dst.setFloat64(dstOff, val2, true);
      dstOff += 8;
    }

    // 4) Restante (byte 104 ate 791) — copiar
    dstArr.set(srcArr.subarray(srcBase + OFF_POS_CA, srcBase + REC_R4), dstOff);
  }
  return newBuf;
}

// ── Extensao do arquivo (codigo = posicao do registro) ──
// Tamanhos validos do hidr.dat: 320 ou 600 registros. Ao precisar de um registro
// alem do que o arquivo comporta, o arquivo cresce para o proximo tamanho padrao
// (passar de 320 leva direto a 600), garantindo que TODOS os registros ate la
// existam — preenchidos com o mesmo padrao dos slots em branco ja ocultos.
var TAMANHOS_PADRAO = [320, 600];
function tamanhoPadraoPara(n) {
  for (var i = 0; i < TAMANHOS_PADRAO.length; i++)
    if (n <= TAMANHOS_PADRAO[i]) return TAMANHOS_PADRAO[i];
  return MAX_REC;
}

// Modelo de registro em branco. NAO e um buffer 0x00: o slot vazio do hidr.dat tem
// os campos de texto preenchidos com espaco (nome, posto_bdh="0", data, observacao,
// tipo_regulacao) e os numericos zerados. Para reproduzir exatamente, clona um
// registro vazio (nome em branco) ja existente no arquivo.
function blankRecordTemplate(recSize) {
  var src = new Uint8Array(originalBuffer);
  var nRec = Math.floor(originalBuffer.byteLength / recSize);
  for (var r = 0; r < nRec; r++) {
    var off = r * recSize, vazio = true;
    for (var i = 0; i < 12; i++) {                 // nome_usina (bytes 0..11)
      var c = src[off + i];
      if (c !== 0 && c !== 0x20) { vazio = false; break; }
    }
    if (vazio) return src.slice(off, off + recSize);
  }
  // Fallback (arquivo sem nenhum slot vazio para clonar): monta o padrao a partir
  // do schema — campos string com espaco (0x20), demais bytes zerados.
  var t = new Uint8Array(recSize);
  var fields = buildFields(recSize === REC_R8), o = 0;
  for (var fi = 0; fi < fields.length; fi++) {
    var f = fields[fi];
    if (f.type === "index") continue;
    if (f.type === "string") for (var k = 0; k < f.size; k++) t[o + k] = 0x20;
    o += f.size;
  }
  return t;
}

// Cresce originalBuffer ate targetRec registros, preenchendo os novos slots com o
// MESMO padrao dos registros em branco existentes. Respeita o teto MAX_REC.
// Retorna quantos registros foram efetivamente criados.
function growBufferTo(targetRec, isR8) {
  if (!originalBuffer) return 0;
  var recSize = isR8 ? REC_R8 : REC_R4;
  var curRec = Math.floor(originalBuffer.byteLength / recSize);
  if (targetRec > MAX_REC) targetRec = MAX_REC;
  if (targetRec <= curRec) return 0;
  var template = blankRecordTemplate(recSize);     // le originalBuffer (ainda o antigo)
  var newBuf = new ArrayBuffer(targetRec * recSize);
  var dst = new Uint8Array(newBuf);
  dst.set(new Uint8Array(originalBuffer));          // mantem os registros existentes
  for (var r = curRec; r < targetRec; r++) dst.set(template, r * recSize);
  originalBuffer = newBuf;
  return targetRec - curRec;
}

function downloadHidr() {
  if (!originalBuffer) return;
  // Inconsistencias de nivel "erro" (ex.: vmin > vmax) BLOQUEIAM a exportacao:
  // o usuario precisa ajustar antes. Avisos (laranja) nao entram aqui e nao bloqueiam.
  var pend = Object.keys(errosConsistencia);
  if (pend.length) {
    var linhas = linhasDeErro();
    alert("Existem " + linhas.length + " inconsistencia(s) a corrigir antes de exportar:\n\n" +
      linhas.slice(0, 12).join("\n") +
      (linhas.length > 12 ? "\n…" : ""));
    return;
  }
  // Baixa o buffer no formato atual: R8 (arquivo R8 de origem ou R4 promovido via
  // "Importar CSV (R8)") ou R4 genuino (arquivo R4 de origem, editado ou nao). Em
  // nenhum caso um R4 e "promovido a forca" para R8 aqui — isso carregaria a cauda
  // binaria do float32 dos coefs CV/CA (precisao falsa). A promocao honesta so
  // ocorre em applyCSV(.., true), gravando os coefs como float64 nativos.
  var recSize = isOrigR8 ? REC_R8 : REC_R4;
  var nRec = Math.floor(originalBuffer.byteLength / recSize);
  var blob = new Blob([originalBuffer], { type: "application/octet-stream" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "hidr.dat";
  a.click();
  URL.revokeObjectURL(url);
  dirtyCells = {};
  if (editMode) toggleEdit();          // sai do modo edicao e colapsa as vazias
  else { collapseBlanks(); applyFilters(); }
  showToast("hidr.dat exportado em " + (isOrigR8 ? "REAL*8" : "REAL*4") + " (" + nRec + " registros).");
}

// ── Renderizacao ──
function buildTable(records) {
  var display = displayFields();   // ordem de exibicao (compativel com o xlsx)
  var thead = document.getElementById("thead");
  thead.innerHTML = "";
  var tr = document.createElement("tr");
  for (var i = 0; i < display.length; i++) {
    var f = display[i];
    var th = document.createElement("th");
    th.textContent = f.label || f.name;
    if (f.unit) {
      var span = document.createElement("span");
      span.className = "th-unit";
      span.textContent = f.unit;
      th.appendChild(span);
    }
    if (f.real8) th.classList.add("col-real8");
    th.title = f.real8 ? "REAL*8 (double precision)" : f.type;
    tr.appendChild(th);
  }
  thead.appendChild(tr);
  renderRows(records);
}

function renderRows(records) {
  var display = displayFields();   // ordem de exibicao (compativel com o xlsx)
  var tbody = document.getElementById("tbody");
  // A tabela vai ser reconstruida: descarta a selecao retangular (tds antigos somem).
  selCells = []; selAnchor = null;
  tbody.innerHTML = "";
  for (var r = 0; r < records.length; r++) {
    var row = records[r];
    var recIndex = row.codigo_usina - 1;   // codigo = posicao do registro no arquivo (+1)
    var tr = document.createElement("tr");
    for (var i = 0; i < display.length; i++) {
      var f = display[i];
      var td = document.createElement("td");
      td.textContent = fmtDisplay(row[f.name], f);
      if (f.real8) td.classList.add("col-real8");
      // Modo edicao: toda coluna e editavel, exceto o codigo (posicional)
      if (editMode && f.type !== "index") {
        td.contentEditable = "true";
        td.classList.add("editable");
        td.setAttribute("data-rec", recIndex);
        td.setAttribute("data-field", f.name);
        if (dirtyCells[recIndex + ":" + f.name]) td.classList.add("cell-dirty");
        // Reaplica a marcacao de consistencia (vermelho = erro / laranja = aviso)
        // a cada (re)render, lendo direto de validaCelula. Sem isto, o destaque
        // sumiria ao re-renderizar a tabela (ex.: apos importar CSV ou reentrar
        // no modo edicao), mesmo com a inconsistencia ainda presente.
        var resCons = validaCelula(recIndex, f.name);
        if (resCons) {
          td.classList.add(resCons.nivel === "erro" ? "cell-invalid" : "cell-warn");
          td.title = (resCons.nivel === "erro" ? "✖ " : "⚠ ") + resCons.msg;
        }
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

function applyFilters() {
  var nome = document.getElementById("filtroNome").value.toLowerCase();
  var sub = document.getElementById("filtroSub").value;
  var cod = document.getElementById("filtroCod").value;
  // No modo edicao a base passa a ser TODOS os registros (inclui slots em branco,
  // p/ poder preenche-los); fora dele, so as usinas com nome.
  var filtered = editMode ? allRecords : visibleRecords;
  if (nome) filtered = filtered.filter(function(r) {
    return r.nome_usina.toLowerCase().indexOf(nome) >= 0;
  });
  if (sub) filtered = filtered.filter(function(r) {
    return String(r.submercado) === sub;
  });
  if (cod) {
    var codNum = parseInt(cod);
    if (!isNaN(codNum)) {
      filtered = filtered.filter(function(r) {
        return r.codigo_usina === codNum;
      });
    }
  }
  renderRows(filtered);
}

// ── Modo edicao ──
function fieldByName(name) {
  for (var i = 0; i < currentFields.length; i++)
    if (currentFields[i].name === name) return currentFields[i];
  return null;
}

// Escreve UMA celula no buffer respeitando o formato atual (R4/R8) e le de volta
// o valor realmente armazenado para allRecords (e, por referencia, visibleRecords).
// Retorna false se o texto for invalido para o tipo do campo (nada e gravado).
function writeCell(recIndex, fieldName, rawText) {
  var isR8 = isOrigR8;
  var recSize = isR8 ? REC_R8 : REC_R4;
  var fields = buildFields(isR8);
  var view = new DataView(originalBuffer);
  var off = recIndex * recSize;
  for (var i = 0; i < fields.length; i++) {
    var f = fields[i];
    if (f.type === "index") continue;
    if (f.type === "skip") { off += f.size; continue; }
    if (f.name === fieldName) {
      if (f.type === "string") {
        writeStringField(originalBuffer, off, f.size, rawText);
        var bytes = new Uint8Array(originalBuffer, off, f.size);
        var s = "";
        for (var b = 0; b < bytes.length; b++) s += String.fromCharCode(bytes[b]);
        allRecords[recIndex][fieldName] = s.replace(/\0+$/g, "").trim();
        return true;
      }
      var v = parseFieldNum(rawText, fieldName);
      if (v === null) return false;   // texto invalido -> nao grava
      if (f.type === "int32")        { view.setInt32(off, roundInt(v), true);  allRecords[recIndex][fieldName] = view.getInt32(off, true); }
      else if (f.type === "float32") { view.setFloat32(off, v, true);    allRecords[recIndex][fieldName] = view.getFloat32(off, true); }
      else if (f.type === "float64") { view.setFloat64(off, v, true);    allRecords[recIndex][fieldName] = view.getFloat64(off, true); }
      return true;
    }
    if (f.type === "string") off += f.size;
    else if (f.type === "float64") off += 8;
    else off += 4;
  }
  return false;
}

function commitFromCell(td) {
  var recIndex = parseInt(td.getAttribute("data-rec"));
  var fieldName = td.getAttribute("data-field");
  var f = fieldByName(fieldName);
  if (!f) return;
  var orig = td.getAttribute("data-orig") || "";
  var newText = td.textContent;
  // Data: aceita "/" como separador, mas grava sempre com "-" (25/06/01 -> 25-06-01).
  if (fieldName === "data") newText = newText.replace(/\//g, "-");
  // Nao mudou -> preserva os bytes originais (evita perda de 1 ULP em float)
  if (newText.trim() === orig.trim()) { td.textContent = orig; return; }
  if (!writeCell(recIndex, fieldName, newText.trim())) {
    // invalido (tipo) -> reverte + flash vermelho
    td.textContent = orig;
    td.classList.add("cell-error");
    setTimeout(function() { td.classList.remove("cell-error"); }, 1000);
    return;
  }
  td.textContent = fmtDisplay(allRecords[recIndex][fieldName], f);
  dirtyCells[recIndex + ":" + fieldName] = true;
  td.classList.add("cell-dirty");
  // Consistencia: revalida o campo editado + os relacionados (ex.: vmin/vmax/vref).
  var grupo = GRUPOS_RELAC[fieldName] || [fieldName];
  // O nome ATIVA/DESATIVA a linha como usina (validaCelula ignora slot sem nome):
  // ao preencher o nome, os campos da linha passam a valer e devem ser remarcados;
  // ao apaga-lo, as marcacoes da linha devem sumir. Revalida a linha inteira.
  if (fieldName === "nome_usina") grupo = CAMPOS_VALIDADOS;
  var resEditado = null;
  for (var gi = 0; gi < grupo.length; gi++) {
    var res = marcaCelula(recIndex, grupo[gi]);
    if (grupo[gi] === fieldName) resEditado = res;
  }
  if (resEditado) showToast((resEditado.nivel === "erro" ? "✖ " : "⚠ ") + resEditado.msg);
}

// Campos cuja validacao depende uns dos outros: ao editar um, revalida o grupo todo
// (assim o aviso/erro some da celula "irma" quando a relacao volta a ser valida).
var GRUPOS_RELAC = {
  volume_minimo:      ["volume_minimo", "volume_maximo"],
  volume_maximo:      ["volume_minimo", "volume_maximo"],
  cota_minima:        ["cota_minima", "cota_maxima"],
  cota_maxima:        ["cota_minima", "cota_maxima"],
  fator_carga_min:    ["fator_carga_min", "fator_carga_max"],
  fator_carga_max:    ["fator_carga_min", "fator_carga_max"]
};

// Erros de consistencia pendentes (chave "recIndex:campo" -> mensagem). So os de
// nivel "erro" entram aqui; sao o que BLOQUEIA a exportacao do hidr.dat.
var errosConsistencia = {};

// Campos que possuem regra de consistencia em validaCelula. Mantido em sincronia
// com o switch de validaCelula (apenas estes podem gerar erro/aviso).
var CAMPOS_VALIDADOS = [
  "submercado", "tipo_turbina", "tipo_regulacao", "tipo_perda",
  "infl_vert_canal_fuga", "num_conj_maquinas", "num_pol_jusante",
  "volume_minimo", "volume_maximo", "cota_minima", "cota_maxima",
  "fator_carga_min", "fator_carga_max",
  "teif", "ip", "jusante", "desvio"
];

// Monta as linhas de erro para exibir ao usuario. Como a mensagem ja identifica o
// registro e o problema (sem o nome do campo), um par relacionado (ex.: volmin>volmax,
// que marca as duas celulas) gera o mesmo texto -> mostramos UMA vez so.
function linhasDeErro() {
  var vistos = {}, linhas = [], chaves = Object.keys(errosConsistencia);
  for (var i = 0; i < chaves.length; i++) {
    var linha = errosConsistencia[chaves[i]];
    if (vistos[linha]) continue;
    vistos[linha] = true;
    linhas.push("• " + linha);
  }
  return linhas;
}

// Revalida TODOS os registros (usado apos importar CSV) com as MESMAS regras da
// edicao manual: reconstroi errosConsistencia do zero, para que valores invalidos
// vindos do CSV passem a BLOQUEAR a exportacao igual aos editados a mao. A marcacao
// visual das celulas e reaplicada pelo proprio renderRows. Retorna o nº de erros.
function revalidaTodos() {
  errosConsistencia = {};
  for (var r = 0; r < allRecords.length; r++) {
    for (var i = 0; i < CAMPOS_VALIDADOS.length; i++) {
      var res = validaCelula(r, CAMPOS_VALIDADOS[i]);
      if (res && res.nivel === "erro") {
        errosConsistencia[r + ":" + CAMPOS_VALIDADOS[i]] =
          "Registro " + (r + 1) + ": " + res.msg;
      }
    }
  }
  return Object.keys(errosConsistencia).length;
}

// Avalia uma celula, atualiza sua aparencia (erro vermelho / aviso laranja / limpo)
// e o registro de erros pendentes. Retorna {nivel, msg} ou null.
function marcaCelula(recIndex, fieldName) {
  var res = validaCelula(recIndex, fieldName);
  var key = recIndex + ":" + fieldName;
  if (res && res.nivel === "erro") errosConsistencia[key] = "Registro " + (recIndex + 1) + ": " + res.msg;
  else delete errosConsistencia[key];
  var td = document.querySelector('#tbody td[data-rec="' + recIndex + '"][data-field="' + fieldName + '"]');
  if (td) {
    td.classList.remove("cell-warn", "cell-invalid");
    if (res) {
      td.classList.add(res.nivel === "erro" ? "cell-invalid" : "cell-warn");
      td.title = (res.nivel === "erro" ? "✖ " : "⚠ ") + res.msg;
    } else td.title = "";
  }
  return res;
}

// Validacoes de consistencia. Retorna {nivel:"erro"|"aviso", msg} ou null.
// "erro" = impossibilidade logica/dominio -> bloqueia exportacao (obriga ajustar).
// "aviso" = plausibilidade -> nao bloqueia. Le allRecords[recIndex] (ja atualizado).
function validaCelula(recIndex, fieldName) {
  var r = allRecords[recIndex];
  if (!r) return null;
  // Slot em branco (linha sem informacao): nao valida. Os campos vem zerados
  // (submercado=0, etc.) e marcariam erro falso. So passa a valer quando a linha
  // ganha um nome de usina — ai deixa de ser um slot vazio.
  if (!r.nome_usina || r.nome_usina.length === 0) return null;
  var v = r[fieldName], nRec = allRecords.length;
  function erro(m)  { return { nivel: "erro",  msg: m }; }
  function aviso(m) { return { nivel: "aviso", msg: m }; }
  switch (fieldName) {
    case "submercado":
      // default 0 = ainda nao preenchido -> nao marca (a pessoa preenche quando quiser);
      // so vira erro se digitar um valor explicitamente fora de 1..4.
      if (v === 0) break;
      if ([1,2,3,4].indexOf(v) < 0) return erro("Submercado deve ser 1, 2, 3 ou 4.");
      break;
    case "tipo_turbina":
      if ([0,1,2,3].indexOf(v) < 0) return erro("Tipo de turbina deve ser 0, 1, 2 ou 3.");
      break;
    case "tipo_regulacao":
      // em branco = ainda nao preenchido -> nao marca; valida so com letra digitada.
      if (String(v).trim() === "") break;
      if (["D","M","S"].indexOf(String(v).trim().toUpperCase()) < 0) return erro("Regulação deve ser D, M ou S.");
      break;
    case "tipo_perda":
      // default 0 = ainda nao preenchido -> nao marca; valida so com 1 ou 2 digitado.
      if (v === 0) break;
      if ([1,2].indexOf(v) < 0) return erro("Tipo de perda deve ser 1 ou 2.");
      break;
    case "infl_vert_canal_fuga":
      if ([0,1].indexOf(v) < 0) return erro("Influência no canal de fuga deve ser 0 (No) ou 1 (Yes).");
      break;
    case "num_conj_maquinas":
      if (v < 0 || v > 5) return erro("Número de conjuntos de máquinas deve estar entre 0 e 5.");
      break;
    case "num_pol_jusante":
      if (v < 0 || v > 6) return erro("Número de polinômios de jusante deve estar entre 0 e 6.");
      break;
    case "volume_minimo": case "volume_maximo":
      if (r.volume_minimo > r.volume_maximo) return erro("Volume mínimo não pode ser maior que o máximo.");
      break;
    case "cota_minima": case "cota_maxima":
      if (r.cota_minima > r.cota_maxima) return erro("Cota mínima não pode ser maior que a máxima.");
      break;
    case "fator_carga_min": case "fator_carga_max":
      if (r.fator_carga_min > r.fator_carga_max) return erro("Fator de carga mínimo não pode ser maior que o máximo.");
      if (v < 0 || v > 100) return aviso("Fator de carga fora de [0, 100]%.");
      break;
    case "teif": case "ip":
      if (v < 0 || v > 100) return erro("Valor percentual deve estar entre 0 e 100.");
      break;
    case "jusante": case "desvio":
      if (v !== 0) {
        if (v < 0 || v > nRec) return erro("Aponta para uma usina inexistente (código " + v + ").");
        if (v === r.codigo_usina) return erro("A usina não pode referenciar a si mesma.");
      }
      break;
  }
  return null;
}

// Remove aspas externas e desfaz o escape "" -> " (formato do CSV exportado),
// para colar tanto de planilha (tab, sem aspas) quanto do proprio CSV.
function unquoteCell(s) {
  s = String(s).trim();
  if (s.length >= 2 && s.charAt(0) === '"' && s.charAt(s.length - 1) === '"') {
    s = s.slice(1, -1).replace(/""/g, '"');
  }
  return s;
}

// Aplica UM valor colado a UMA celula, reaproveitando o caminho da edicao manual
// (commitFromCell -> writeCell): valida o tipo, trata virgula decimal, preserva
// bytes se nao mudou e marca a celula como alterada.
function pasteIntoCell(td, value) {
  if (!td || td.tagName !== "TD" || !td.classList.contains("editable")) return;
  td.setAttribute("data-orig", td.textContent);
  td.textContent = unquoteCell(value);
  commitFromCell(td);
}

// Limpa UMA celula: string -> vazio; numerico -> 0 (igual aos slots em branco).
// Reaproveita commitFromCell -> writeCell. Escrever "" num campo numerico nao zera
// (csvNum("") = null e o writeCell preserva os bytes), por isso usamos "0".
function clearCell(td) {
  if (!td || td.tagName !== "TD" || !td.classList.contains("editable")) return;
  var f = fieldByName(td.getAttribute("data-field"));
  if (!f) return;
  td.setAttribute("data-orig", td.textContent);
  td.textContent = (f.type === "string") ? "" : "0";
  commitFromCell(td);
}

// ── Selecao retangular de celulas (para limpar um trecho de uma vez) ──
var selAnchor = null;   // td ancora do retangulo
var selCells = [];      // tds atualmente selecionados
var rangeDragging = false;

function clearCellSelection() {
  for (var i = 0; i < selCells.length; i++) selCells[i].classList.remove("cell-selected");
  selCells = [];
}
function tdRowCol(td) {
  var tb = document.getElementById("tbody");
  return {
    row: Array.prototype.indexOf.call(tb.children, td.parentElement),
    col: Array.prototype.indexOf.call(td.parentElement.children, td)
  };
}
// Marca o retangulo entre a (ancora) e b (celula atual), so nas celulas editaveis.
function selectRect(a, b) {
  clearCellSelection();
  if (!a || !b) return;
  var tb = document.getElementById("tbody");
  var pa = tdRowCol(a), pb = tdRowCol(b);
  var r0 = Math.min(pa.row, pb.row), r1 = Math.max(pa.row, pb.row);
  var c0 = Math.min(pa.col, pb.col), c1 = Math.max(pa.col, pb.col);
  for (var r = r0; r <= r1; r++) {
    var tr = tb.children[r]; if (!tr) continue;
    for (var c = c0; c <= c1; c++) {
      var td = tr.children[c];
      if (td && td.classList.contains("editable")) { td.classList.add("cell-selected"); selCells.push(td); }
    }
  }
}

(function bindEditEvents() {
  var tb = document.getElementById("tbody");
  tb.addEventListener("focusin", function(e) {
    var td = e.target;
    if (!editMode || td.tagName !== "TD" || !td.classList.contains("editable")) return;
    td.setAttribute("data-orig", td.textContent);
    td.classList.add("editing");
  });
  tb.addEventListener("focusout", function(e) {
    var td = e.target;
    if (td.tagName !== "TD" || !td.classList.contains("editing")) return;
    td.classList.remove("editing");
    commitFromCell(td);
  });
  tb.addEventListener("keydown", function(e) {
    var td = e.target;
    if (!editMode) return;
    // Apagar um TRECHO selecionado: Delete/Backspace limpa todas as celulas do
    // retangulo de uma vez (string -> vazio, numerico -> 0). So age quando ha
    // selecao multipla; numa unica celula focada segue a edicao normal.
    if ((e.key === "Delete" || e.key === "Backspace") && selCells.length > 1) {
      e.preventDefault();
      var alvo = selCells.slice();   // clearCell nao mexe na selecao; copia por seguranca
      for (var i = 0; i < alvo.length; i++) clearCell(alvo[i]);
      return;
    }
    if (td.tagName !== "TD" || !td.classList.contains("editable")) return;
    if (e.key === "Enter") { e.preventDefault(); td.blur(); }
    else if (e.key === "Escape") { e.preventDefault(); clearCellSelection(); td.textContent = td.getAttribute("data-orig") || ""; td.blur(); }
  });
  // Selecao retangular: clique define a ancora; arrastar (ou Shift+clique) ate outra
  // celula marca o retangulo. Um clique simples nao seleciona nada (deixa editar/digitar).
  tb.addEventListener("mousedown", function(e) {
    var td = e.target;
    if (!editMode || td.tagName !== "TD" || !td.classList.contains("editable")) { clearCellSelection(); return; }
    if (e.shiftKey && selAnchor) {
      e.preventDefault();
      selectRect(selAnchor, td);
      var sel = window.getSelection(); if (sel) sel.removeAllRanges();
    } else {
      selAnchor = td;
      clearCellSelection();
      rangeDragging = true;   // so vira selecao de fato se o mouse entrar em outra celula
    }
  });
  tb.addEventListener("mouseover", function(e) {
    if (!rangeDragging || !selAnchor) return;
    var td = e.target;
    if (td.tagName !== "TD" || !td.classList.contains("editable")) return;
    if (td === selAnchor && selCells.length === 0) return;   // ainda na mesma celula: deixa digitar
    var table = document.querySelector("#tabTabela table");
    if (table) table.classList.add("range-selecting");
    selectRect(selAnchor, td);
    var sel = window.getSelection(); if (sel) sel.removeAllRanges();
  });
  document.addEventListener("mouseup", function() {
    rangeDragging = false;
    var table = document.querySelector("#tabTabela table");
    if (table) table.classList.remove("range-selecting");
  });
  // Colar linha inteira ou trecho: distribui os valores a partir da celula focada,
  // para a direita (colunas) e para baixo (linhas). Aceita TAB (planilha) ou ";" (CSV
  // exportado). Um valor unico cai no comportamento padrao (cola so naquela celula).
  tb.addEventListener("paste", function(e) {
    var td = e.target;
    if (!editMode || td.tagName !== "TD" || !td.classList.contains("editable")) return;
    var cd = e.clipboardData || window.clipboardData;
    if (!cd) return;
    var text = cd.getData("text");
    if (text == null) return;
    text = text.replace(/\r/g, "");
    // Sem separador de coluna/linha -> deixa o paste nativo preencher so esta celula
    if (text.indexOf("\t") < 0 && text.indexOf("\n") < 0 && text.indexOf(";") < 0) return;
    e.preventDefault();
    var delim = text.indexOf("\t") >= 0 ? "\t" : ";";
    var rowsText = text.split("\n");
    while (rowsText.length && rowsText[rowsText.length - 1] === "") rowsText.pop();
    var startTr = td.parentElement;
    var startCol = Array.prototype.indexOf.call(startTr.children, td);
    var tr = startTr;
    for (var ri = 0; ri < rowsText.length && tr; ri++) {
      var cells = rowsText[ri].split(delim);
      for (var ci = 0; ci < cells.length; ci++) {
        var target = tr.children[startCol + ci];
        if (!target) break;
        pasteIntoCell(target, cells[ci]);
      }
      tr = tr.nextElementSibling;
    }
  });
})();

// Atualiza os contadores do cabecalho: "Registros" = total (inclui os slots
// ocultos/vazios, 320 ou 600); "Usinas cadastradas" = quantos registros tem usina
// (nome preenchido). Independem do filtro de busca.
function atualizaContadores() {
  if (!allRecords) return;
  var cadastradas = 0;
  for (var i = 0; i < allRecords.length; i++)
    if (allRecords[i].nome_usina && allRecords[i].nome_usina.length > 0) cadastradas++;
  document.getElementById("infoRegistros").textContent = allRecords.length + " registros";
  document.getElementById("infoCadastradas").textContent = cadastradas + " usinas";
}

// Colapsa: slots vazios somem; preenchidos (ex.: codigo 3) permanecem.
function collapseBlanks() {
  visibleRecords = allRecords.filter(function(r) {
    return r.nome_usina && r.nome_usina.length > 0;
  });
  atualizaContadores();
  buildPlantCards(allRecords);
}

function toggleEdit() {
  if (!originalBuffer) return;   // edicao em R4 (float32) e R8 (float64); writeCell trata os dois
  // Ao tentar CONCLUIR a edicao: nao deixa sair enquanto houver erros pendentes
  // (celulas vermelhas) — obriga a pessoa a ajustar antes.
  if (editMode) {
    var pend = Object.keys(errosConsistencia);
    if (pend.length) {
      var linhas = linhasDeErro();
      alert("Corrija as " + linhas.length + " inconsistencia(s) destacadas em vermelho antes de concluir a edicao:\n\n" +
        linhas.slice(0, 12).join("\n") +
        (linhas.length > 12 ? "\n…" : ""));
      return;
    }
  }
  editMode = !editMode;
  var btn = document.getElementById("btnEdit");
  var table = document.querySelector("#tabTabela table");
  var addWrap = document.getElementById("addUsinaWrap");
  if (editMode) {
    btn.textContent = "Concluir edicao";
    btn.classList.remove("btn-secondary"); btn.classList.add("btn-primary");
    if (table) table.classList.add("edit-mode");
    if (addWrap) addWrap.classList.remove("hidden");
  } else {
    btn.textContent = "Editar dados";
    btn.classList.remove("btn-primary"); btn.classList.add("btn-secondary");
    if (table) table.classList.remove("edit-mode");
    if (addWrap) addWrap.classList.add("hidden");
    collapseBlanks();
  }
  applyFilters();
}

// (b) Adiciona/abre o slot de uma usina pelo numero (codigo = posicao do registro).
// Cresce o arquivo se necessario (ate MAX_REC), garante o modo edicao e filtra a
// linha alvo para preenchimento.
function addUsina() {
  if (!originalBuffer) return;
  var inp = document.getElementById("addUsinaNum");
  var n = parseInt(inp.value, 10);
  if (isNaN(n) || n < 1) { alert("Informe um numero de usina valido (1 a " + MAX_REC + ")."); return; }
  if (n > MAX_REC) { alert("Numero acima do teto de " + MAX_REC + " registros."); return; }

  var recSize = isOrigR8 ? REC_R8 : REC_R4;
  var curRec = Math.floor(originalBuffer.byteLength / recSize);
  var created = 0;
  if (n > curRec) {
    created = growBufferTo(tamanhoPadraoPara(n), isOrigR8);
    allRecords = parseRecords(originalBuffer, isOrigR8);
    visibleRecords = allRecords.filter(function(r) { return r.nome_usina && r.nome_usina.length > 0; });
    document.getElementById("infoTamReg").textContent = recSize + " bytes";
    atualizaContadores();          // total de registros mudou (ex.: 320 -> 600)
    buildPlantCards(allRecords);
  }

  if (!editMode) toggleEdit();   // entra em edicao (base passa a incluir slots vazios)

  // Filtra para a usina alvo e mostra a linha (vazia, se recem-criada)
  document.getElementById("filtroNome").value = "";
  document.getElementById("filtroSub").value = "";
  document.getElementById("filtroCod").value = String(n);
  applyFilters();
  inp.value = "";

  // Foca a primeira celula editavel da linha alvo
  var tb = document.getElementById("tbody");
  var firstRow = tb.querySelector("tr");
  if (firstRow) {
    var cell = firstRow.querySelector("td.editable");
    if (cell) cell.focus();
  }

  if (created > 0) alert(created + " registro(s) em branco criado(s) — arquivo agora com " +
    Math.floor(originalBuffer.byteLength / recSize) + " registros. Linha " + n + " pronta para preenchimento.");
}

// ── Eventos ──
var dropZone = document.getElementById("dropZone");
var fileInput = document.getElementById("fileInput");

dropZone.addEventListener("click", function() { fileInput.click(); });
dropZone.addEventListener("dragover", function(e) {
  e.preventDefault(); dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", function() {
  dropZone.classList.remove("dragover");
});
dropZone.addEventListener("drop", function(e) {
  e.preventDefault(); dropZone.classList.remove("dragover");
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener("change", function() {
  if (fileInput.files.length) loadFile(fileInput.files[0]);
});

document.getElementById("btnCSV").addEventListener("click", function() {
  downloadCSV(visibleRecords, currentFields);
});
// Bloco "Trabalhar em..." → importa mantendo o formato atual do arquivo
// (R8 -> float64 nativo; R4 -> float32).
document.getElementById("btnImportKeep").addEventListener("click", function() {
  document.getElementById("fileInputKeep").click();
});
document.getElementById("fileInputKeep").addEventListener("change", function(e) {
  var f = e.target.files[0];
  if (!f) return;
  var rd = new FileReader();
  rd.onload = function(ev) {
    applyCSV(ev.target.result, isOrigR8);   // mantem o formato corrente
    e.target.value = "";
  };
  rd.readAsText(f, "utf-8");
});
// Bloco "Converter p/ REAL*8" → importa e promove R4 -> R8 (float64 nativo).
document.getElementById("btnConvert").addEventListener("click", function() {
  document.getElementById("fileInputConvert").click();
});
document.getElementById("fileInputConvert").addEventListener("change", function(e) {
  var f = e.target.files[0];
  if (!f) return;
  var rd = new FileReader();
  rd.onload = function(ev) {
    applyCSV(ev.target.result, true);   // converte para REAL*8
    e.target.value = "";
  };
  rd.readAsText(f, "utf-8");
});
document.getElementById("btnR8").addEventListener("click", downloadHidr);
document.getElementById("btnEdit").addEventListener("click", toggleEdit);
document.getElementById("btnReset").addEventListener("click", function() {
  document.getElementById("controls").classList.add("hidden");
  document.getElementById("headerInfo").classList.add("hidden");
  dropZone.classList.remove("hidden");
  fileInput.value = "";
  allRecords = [];
  visibleRecords = [];
  currentFields = [];
  originalBuffer = null;
  isOrigR8 = false;
  csvApplied = false;
  document.getElementById("btnImportKeep").disabled = true;
  // Reseta modo edicao
  editMode = false;
  dirtyCells = {};
  var btnEditR = document.getElementById("btnEdit");
  btnEditR.disabled = true; btnEditR.textContent = "Editar dados";
  btnEditR.title = "Carregue um hidr.dat para editar";
  btnEditR.classList.remove("btn-primary"); btnEditR.classList.add("btn-secondary");
  var tblR = document.querySelector("#tabTabela table");
  if (tblR) tblR.classList.remove("edit-mode");
  var addWrapR = document.getElementById("addUsinaWrap");
  if (addWrapR) addWrapR.classList.add("hidden");
  updateFlowUI();   // sem buffer -> barra de fluxos some
});
document.getElementById("btnAddUsina").addEventListener("click", addUsina);
document.getElementById("addUsinaNum").addEventListener("keydown", function(e) {
  if (e.key === "Enter") { e.preventDefault(); addUsina(); }
});
document.getElementById("filtroNome").addEventListener("input", applyFilters);
document.getElementById("filtroSub").addEventListener("change", applyFilters);
document.getElementById("filtroCod").addEventListener("input", applyFilters);

// ── Carregamento ──
function loadFile(file) {
  var reader = new FileReader();
  reader.onload = function(e) {
    var buf = e.target.result;
    var formato = detectFormat(buf.byteLength, buf);

    if (!formato) {
      alert(
        "Tamanho do arquivo (" + buf.byteLength + " bytes) nao corresponde a nenhum formato conhecido.\n" +
        "Esperado: multiplo de " + REC_R4 + " (REAL*4) ou " + REC_R8 + " (REAL*8)."
      );
      return;
    }

    var isR8 = formato === "real8";
    var recSize = isR8 ? REC_R8 : REC_R4;
    var nRec = Math.floor(buf.byteLength / recSize);

    originalBuffer = buf;
    isOrigR8 = isR8;

    currentFields = buildFields(isR8);
    allRecords = parseRecords(buf, isR8);
    visibleRecords = allRecords.filter(function(r) {
      return r.nome_usina && r.nome_usina.length > 0;
    });

    atualizaContadores();
    document.getElementById("infoTamReg").textContent = recSize + " bytes";
    var infoFmt = document.getElementById("infoFormato");
    infoFmt.textContent = isR8 ? "REAL*8" : "REAL*4";
    infoFmt.className = "header-info-value " + (isR8 ? "fmt-r8" : "fmt-r4");
    document.getElementById("headerInfo").classList.remove("hidden");

    // Popula lista de codigos
    var listaCod = document.getElementById("listaCod");
    listaCod.innerHTML = "";
    for (var ic = 0; ic < visibleRecords.length; ic++) {
      var rec = visibleRecords[ic];
      var optC = document.createElement("option");
      optC.value = rec.codigo_usina + " - " + rec.nome_usina;
      listaCod.appendChild(optC);
    }

    // Popula filtro de submercados
    var subsSet = {};
    for (var is2 = 0; is2 < visibleRecords.length; is2++) subsSet[visibleRecords[is2].submercado] = true;
    var subs = Object.keys(subsSet).map(Number).sort(function(a,b) { return a - b; });
    var selSub = document.getElementById("filtroSub");
    selSub.innerHTML = '<option value="">Todos</option>';
    for (var js = 0; js < subs.length; js++) {
      if (subs[js] === 0) continue;
      var optS = document.createElement("option");
      optS.value = subs[js];
      optS.textContent = submLabel(subs[js]) || ("Submercado " + subs[js]);
      selSub.appendChild(optS);
    }

    document.getElementById("filtroNome").value = "";
    document.getElementById("filtroCod").value = "";
    editMode = false; dirtyCells = {};   // garante render nao-editavel ao (re)carregar
    buildTable(visibleRecords);
    buildPlantCards(allRecords);
    document.getElementById("plantSearch").value = "";
    // Ja mostra a primeira usina (ex.: Camargos) em vez do estado vazio
    var firstIdx = -1;
    for (var fi2 = 0; fi2 < allRecords.length; fi2++) {
      if (allRecords[fi2].nome_usina && allRecords[fi2].nome_usina.length > 0) { firstIdx = fi2; break; }
    }
    if (firstIdx >= 0) selectPlant(firstIdx);
    else document.getElementById("plantDetail").innerHTML = '<div class="detail-empty">Selecione uma usina para ver os detalhes</div>';

    // Edicao liberada para R4 (float32) e R8 (float64)
    csvApplied = false;
    var btnEditL = document.getElementById("btnEdit");
    btnEditL.disabled = false;
    btnEditL.title = "";
    btnEditL.textContent = "Editar dados";
    btnEditL.classList.remove("btn-primary"); btnEditL.classList.add("btn-secondary");
    var tblL = document.querySelector("#tabTabela table");
    if (tblL) tblL.classList.remove("edit-mode");
    updateFlowUI();      // mostra a barra de fluxos e os blocos do formato carregado

    dropZone.classList.add("hidden");
    document.getElementById("controls").classList.remove("hidden");
  };
  reader.readAsArrayBuffer(file);
}

// ── Tab switching ──
var tabBtns = document.querySelectorAll(".tab-btn");
for (var t = 0; t < tabBtns.length; t++) {
  tabBtns[t].addEventListener("click", function() {
    for (var i = 0; i < tabBtns.length; i++) tabBtns[i].classList.remove("active");
    this.classList.add("active");
    var tabs = document.querySelectorAll(".tab-content");
    for (var j = 0; j < tabs.length; j++) tabs[j].classList.remove("active");
    document.getElementById(this.getAttribute("data-tab")).classList.add("active");
    updateFlowUI();   // barra de fluxos so na aba Tabela (Usina nao e editavel)
  });
}

// ── Plant cards ──
var selectedPlantIdx = -1;

function buildPlantCards(records) {
  var container = document.getElementById("plantCards");
  container.innerHTML = "";
  for (var i = 0; i < records.length; i++) {
    var r = records[i];
    if (!r.nome_usina) continue;
    var card = document.createElement("div");
    card.className = "plant-card";
    card.setAttribute("data-idx", i);
    card.innerHTML =
      '<div class="card-code">Código ' + r.codigo_usina + '</div>' +
      '<div class="card-name">' + r.nome_usina + '</div>' +
      '<div class="card-sub">' + (submLabel(r.submercado) || ("Submercado " + r.submercado)) + '</div>';
    card.addEventListener("click", function() {
      var idx = parseInt(this.getAttribute("data-idx"));
      selectPlant(idx);
    });
    container.appendChild(card);
  }
}

function selectPlant(idx) {
  selectedPlantIdx = idx;
  var cards = document.querySelectorAll(".plant-card");
  for (var i = 0; i < cards.length; i++) cards[i].classList.remove("selected");
  var sel = document.querySelector('.plant-card[data-idx="' + idx + '"]');
  if (sel) sel.classList.add("selected");
  renderDetail(allRecords[idx]);
}

document.getElementById("plantSearch").addEventListener("input", function() {
  var q = this.value.toLowerCase();
  var cards = document.querySelectorAll(".plant-card");
  for (var i = 0; i < cards.length; i++) {
    var name = cards[i].querySelector(".card-name").textContent.toLowerCase();
    var code = cards[i].querySelector(".card-code").textContent;
    cards[i].style.display = (name.indexOf(q) >= 0 || code.indexOf(q) >= 0) ? "" : "none";
  }
});

// ── Detail rendering ──
var MESES = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];
var TURBINA_TIPO = {0: "0 - NÃO HÁ", 1: "1 - Francis", 2: "2 - Kaplan/Propeller", 3: "3 - Pelton"};
function turbLabel(val) { return TURBINA_TIPO[val] || null; }

function renderDetail(rec) {
  var panel = document.getElementById("plantDetail");
  var isR8 = currentFields.some(function(f) { return f.real8; });

  var h = '<div class="detail-body detail-compact">';

  // ── Topo: titulo a esquerda; Data e Observacao primeiro, a direita ──
  h += '<div class="dv-top">';
  h += '<div class="dv-top-title">' + (rec.nome_usina || "-") +
       '<span class="dv-sub">Código ' + rec.codigo_usina + ' &middot; ' +
       (submLabel(rec.submercado) || ("Submercado " + rec.submercado)) + '</span></div>';
  h += '<div class="dv-top-right">';
  h += dvCell("Data", rec.data || "-", "");
  h += '<div class="dv-cell dv-obs" title="' + dvAttr(rec.observacao || "-") + '">' +
       '<span class="dv-l">Observação</span>' +
       '<span class="dv-v">' + (rec.observacao || "-") + '</span></div>';
  h += '</div></div>';

  // ── Identificacao ──
  h += '<div class="dv-section"><div class="dv-title">Identificação</div>';
  h += '<div class="dv-grid dv-grid-id">';
  h += dvCell("Código", rec.codigo_usina, "");
  h += dvCell("Nome", rec.nome_usina || "-", "");
  h += dvCell("Posto", rec.posto, "");
  h += dvCell("Jusante", usinaRefLabel(rec.jusante), "");
  h += dvCell("Desvio", usinaRefLabel(rec.desvio), "");
  h += dvCell("Submercado", submLabel(rec.submercado) || rec.submercado, "");
  h += dvCell("Empresa", empLabel(rec.empresa) || rec.empresa, "");
  h += '</div></div>';

  // ── Dados de operacao ──
  h += '<div class="dv-section"><div class="dv-title">Dados de Operação</div>';
  h += '<div class="dv-grid dv-grid-3">';
  h += dvCell("Regulação", regLabel(rec.tipo_regulacao) || rec.tipo_regulacao || "-", "");
  h += dvCell("Vazão Mínima Histórica", (rec.vazao_min_hist !== undefined ? rec.vazao_min_hist : "-"), "m3/s");
  h += dvCellHL("Volume de Referência", dnum(rec.volume_referencia, 2), "hm3");
  h += '</div>';
  h += '<div class="dv-grid dv-grid-3">';
  h += dvCellHL("Volume Máximo", dnum(rec.volume_maximo, 2), "hm3");
  h += dvCell("Cota Máxima", dnum(rec.cota_maxima, 2), "m");
  h += dvCell("Volume Vertedouro", dnum(rec.volume_vertedouro, 2), "hm3");
  h += '</div>';
  h += '<div class="dv-grid dv-grid-3">';
  h += dvCellHL("Volume Mínimo", dnum(rec.volume_minimo, 2), "hm3");
  h += dvCell("Cota Mínima", dnum(rec.cota_minima, 2), "m");
  h += dvCell("Volume Desvio", dnum(rec.volume_desvio, 2), "hm3");
  h += '</div>';
  h += '<div class="dv-pol-h" style="margin-top:2px;">Evaporação (mm/mês)</div>';
  h += '<div class="dv-evap">';
  for (var e = 0; e < 12; e++) {
    var ev = rec["evap_" + MESES[e]];
    if (ev === undefined) ev = 0;
    h += '<div class="dv-evap-c"><div class="dv-evap-m">' + MESES[e] + '</div>' +
         '<div class="dv-evap-v">' + ev + '</div></div>';
  }
  h += '</div></div>';

  // ── Polinomios: volume-cota, cota-area e jusante ──
  h += '<div class="dv-section"><div class="dv-title">Polinômios</div>';
  h += '<div class="dv-pol-h">Cota x Volume' + (isR8 ? ' &middot; REAL*8' : '') + '</div>';
  h += dvCoefRow(rec, "_volume_cota", isR8);
  h += '<div class="dv-pol-h" style="margin-top:6px;">&Aacute;rea x Cota' + (isR8 ? ' &middot; REAL*8' : '') + '</div>';
  h += dvCoefRow(rec, "_area_cota", isR8);
  h += '<div class="dv-pol-h" style="margin-top:6px;">Jusante (' + rec.num_pol_jusante + ' polinômio(s))</div>';
  for (var p = 1; p <= 6; p++) {
    var has = false;
    for (var cc = 0; cc < 5; cc++) { if (rec["a" + cc + "_jus_" + p] !== 0) has = true; }
    if (!has && p > rec.num_pol_jusante) continue;
    h += '<div class="dv-jus-row"><span class="dv-jus-tag">J' + p +
         ' (ref ' + dnum(rec["ref_jus_" + p], 2) + ')</span><div class="dv-coefs">';
    for (var c = 0; c < 5; c++) {
      var vj = rec["a" + c + "_jus_" + p];
      h += '<div class="dv-coef"><div class="dv-coef-i">a' + c + '</div>' +
           '<div class="dv-coef-v">' + (vj ? vj.toExponential(6).replace("e", "E") : "0") + '</div></div>';
    }
    h += '</div></div>';
  }
  h += '</div>';

  // ── Outros dados ──
  h += '<div class="dv-section"><div class="dv-title">Outros Dados</div>';
  h += '<div class="dv-other">';
  // Tabela de conjuntos de maquinas (a esquerda)
  h += '<table class="dv-maq"><thead><tr><th>Cj</th><th>Máq</th><th>PotEf (MW)</th>' +
       '<th>QEf (m3/s)</th><th>HEf (m)</th></tr></thead><tbody>';
  for (var m = 1; m <= 5; m++) {
    var nMaq = rec["maq_conj_" + m];
    if (nMaq === 0 && m > rec.num_conj_maquinas) continue;
    h += '<tr><td style="font-weight:600;">' + m + '</td><td>' + nMaq + '</td>' +
         '<td style="font-weight:600;color:#1a7a4a;">' + dnum(rec["pot_conj_" + m], 1) + '</td>' +
         '<td>' + (rec["vazao_nom_" + m] || 0) + '</td>' +
         '<td>' + dnum(rec["queda_nom_" + m], 2) + '</td></tr>';
  }
  h += '</tbody></table>';
  // Coluna do meio: Num. Unidades Base (entre a tabela e os demais dados)
  h += '<div>' + dvCell("Núm. Unidades Base", rec.num_unid_base, "") + '</div>';
  // Demais campos (a direita), 3 colunas. A grade preenche linha-a-linha, entao a
  // ordem abaixo intercala col1/col2/col3 para formar as colunas pedidas.
  h += '<div class="dv-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:0;">';
  h += dvCell("Produtibilidade", dnum(rec.produtibilidade, 6), "MW/m3/s/m");
  h += dvCell("Tipo Turbina", (TURBINA_TIPO[rec.tipo_turbina] || rec.tipo_turbina), "");
  h += dvCell("Fator Carga Máx", dnum(rec.fator_carga_max, 2), "%");
  h += dvCell("Canal Fuga Médio", dnum(rec.canal_fuga_medio, 2), "m");
  h += dvCell("Conjuntos de Máq.", rec.num_conj_maquinas, "");
  h += dvCell("Fator Carga Mín", dnum(rec.fator_carga_min, 2), "%");
  h += dvCell("TEIF", dnum(rec.teif, 3), "%");
  h += dvCell("Tipo Perda", perdaLabel(rec.tipo_perda) || rec.tipo_perda, "");
  h += dvCell("Infl. Vert. Canal Fuga", (inflLabel(rec.infl_vert_canal_fuga) || rec.infl_vert_canal_fuga), "");
  h += dvCell("IP", dnum(rec.ip, 3), "%");
  h += dvCell("Perdas", dnum(rec.perdas, 2), "");
  h += dvCell("Representação Conjunto", reprLabel(rec.repr_conjunto) || rec.repr_conjunto, "");
  h += '</div>';
  h += '</div></div>';

  h += '</div>'; // detail-body
  panel.innerHTML = h;
}

// ── Helpers do detalhe compacto ──
function dnum(v, dec) {
  if (v === undefined || v === null || isNaN(v)) return "-";
  return Number(v).toFixed(dec).replace(".", ",");
}
function dvAttr(s) { return String(s).replace(/"/g, "&quot;"); }
function dvCell(label, value, unit) {
  return '<div class="dv-cell" title="' + dvAttr(value) + '">' +
    '<span class="dv-l">' + label + '</span>' +
    '<span class="dv-v">' + value + (unit ? ' <i>' + unit + '</i>' : '') + '</span></div>';
}
function dvCellHL(label, value, unit) {
  return '<div class="dv-cell hl" title="' + dvAttr(value) + '">' +
    '<span class="dv-l">' + label + '</span>' +
    '<span class="dv-v">' + value + (unit ? ' <i>' + unit + '</i>' : '') + '</span></div>';
}
function dvCoefRow(rec, suffix, isR8) {
  var s = '<div class="dv-coefs">';
  for (var c = 0; c < 5; c++) {
    var v = rec["a" + c + suffix];
    s += '<div class="dv-coef' + (isR8 ? ' r8' : '') + '"><div class="dv-coef-i">a' + c + '</div>' +
         '<div class="dv-coef-v">' + (v !== undefined ? v.toExponential(isR8 ? 14 : 6).replace("e", "E") : "-") + '</div></div>';
  }
  return s + '</div>';
}

function field(label, value, unit) {
  return '<div class="detail-field">' +
    '<div class="field-label">' + label + '</div>' +
    '<div class="field-value">' + value +
    (unit ? ' <span class="field-unit">' + unit + '</span>' : '') +
    '</div></div>';
}
function fieldHL(label, value, unit) {
  return '<div class="detail-field detail-field-highlight">' +
    '<div class="field-label">' + label + '</div>' +
    '<div class="field-value">' + value +
    (unit ? ' <span class="field-unit">' + unit + '</span>' : '') +
    '</div></div>';
}
function fieldWide(label, value, unit) {
  return '<div class="detail-field" style="grid-column:1/-1;">' +
    '<div class="field-label">' + label + '</div>' +
    '<div class="field-value">' + value +
    (unit ? ' <span class="field-unit">' + unit + '</span>' : '') +
    '</div></div>';
}
