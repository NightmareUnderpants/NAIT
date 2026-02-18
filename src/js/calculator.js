"use strict";

const $ = (id) => document.getElementById(id);

const els = {
  inputType: $("inputType"),
  btnShow: $("btnShow"),
  figureImg: $("figureImg"),

  inputsDiagonals: $("inputsDiagonals"),
  inputsSideAngle: $("inputsSideAngle"),

  d1: $("d1"),
  d2: $("d2"),
  a: $("a"),
  alpha: $("alpha"),

  errD1: $("err-d1"),
  errD2: $("err-d2"),
  errA: $("err-a"),
  errAlpha: $("err-alpha"),
  errChecks: $("err-checkboxes"),

  cbHeight: $("cbHeight"),
  cbArea: $("cbArea"),
  cbInradius: $("cbInradius"),
  cbPerimeter: $("cbPerimeter"),

  btnCalc: $("btnCalc"),
  btnClear: $("btnClear"),

  results: $("results"),
};

function normNumber(str) {
  // заменяем запятую на точку, убираем пробелы
  return String(str).trim().replace(",", ".");
}

function parsePositive(inputEl, errEl, label) {
  const raw = normNumber(inputEl.value);
  if (!raw) return { ok: false, value: null, msg: `${label}: пустое поле` };

  const num = Number(raw);
  if (!Number.isFinite(num)) return { ok: false, value: null, msg: `${label}: не число` };
  if (num <= 0) return { ok: false, value: null, msg: `${label}: должно быть > 0` };

  return { ok: true, value: num, msg: "" };
}

function parseAngleDeg(inputEl, errEl) {
  const raw = normNumber(inputEl.value);
  if (!raw) return { ok: false, value: null, msg: "Угол: пустое поле" };

  const num = Number(raw);
  if (!Number.isFinite(num)) return { ok: false, value: null, msg: "Угол: не число" };
  // допустим (0, 180), исключая крайние
  if (num <= 0 || num >= 180) return { ok: false, value: null, msg: "Угол: должен быть в диапазоне (0; 180)" };

  return { ok: true, value: num, msg: "" };
}

function setError(inputEl, errEl, msg) {
  if (!msg) {
    inputEl.classList.remove("is-invalid");
    errEl.hidden = true;
    errEl.textContent = "";
    return;
  }
  inputEl.classList.add("is-invalid");
  errEl.hidden = false;
  errEl.textContent = msg;
}

function clearErrors() {
  setError(els.d1, els.errD1, "");
  setError(els.d2, els.errD2, "");
  setError(els.a, els.errA, "");
  setError(els.alpha, els.errAlpha, "");
  els.errChecks.hidden = true;
}

function setMode(mode) {
  clearErrors();
  els.results.textContent = "Здесь появятся результаты после вычисления.";

  if (mode === "diagonals") {
    els.inputsDiagonals.hidden = false;
    els.inputsSideAngle.hidden = true;
    els.figureImg.src = "/img/rhombus_diagonals.png";
    els.figureImg.alt = "Ромб: диагонали";
  } else {
    els.inputsDiagonals.hidden = true;
    els.inputsSideAngle.hidden = false;
    els.figureImg.src = "/img/rhombus_side_angle.png";
    els.figureImg.alt = "Ромб: сторона и угол";
  }
}

function selectedMetrics() {
  return {
    height: els.cbHeight.checked,
    area: els.cbArea.checked,
    inradius: els.cbInradius.checked,
    perimeter: els.cbPerimeter.checked,
  };
}

function anyMetricSelected(m) {
  return m.height || m.area || m.inradius || m.perimeter;
}

function computeByDiagonals(d1, d2) {
  const a = Math.sqrt((d1 / 2) ** 2 + (d2 / 2) ** 2);
  const S = (d1 * d2) / 2;
  const P = 4 * a;
  const h = S / a;
  const r = S / (2 * a);
  return { a, S, P, h, r };
}

function computeBySideAngle(a, alphaDeg) {
  const alphaRad = (alphaDeg * Math.PI) / 180;
  const S = a * a * Math.sin(alphaRad);
  const P = 4 * a;
  const h = a * Math.sin(alphaRad);
  const r = S / (2 * a); // = (a*sin)/2
  return { a, S, P, h, r };
}

function fmt(x) {
  // аккуратное округление
  return Number(x).toFixed(3).replace(/\.?0+$/, ""); // убираем лишние нули
}

function renderResults(mode, res, metrics) {
  const out = [];
  out.push(`<div class="mb-2"><span class="text-white-50">Режим:</span> <b>${mode === "diagonals" ? "Диагонали" : "Сторона и угол"}</b></div>`);

  if (metrics.area) out.push(`<div>Площадь S: <b>${fmt(res.S)}</b></div>`);
  if (metrics.height) out.push(`<div>Высота h: <b>${fmt(res.h)}</b></div>`);
  if (metrics.inradius) out.push(`<div>Радиус вписанной окружности r: <b>${fmt(res.r)}</b></div>`);
  if (metrics.perimeter) out.push(`<div>Периметр P: <b>${fmt(res.P)}</b></div>`);

  els.results.innerHTML = out.join("");
}

function validateAndCompute() {
  clearErrors();

  const mode = els.inputType.value;
  const metrics = selectedMetrics();

  if (!anyMetricSelected(metrics)) {
    els.errChecks.hidden = false;
    return;
  }

  if (mode === "diagonals") {
    const v1 = parsePositive(els.d1, els.errD1, "d1");
    const v2 = parsePositive(els.d2, els.errD2, "d2");

    setError(els.d1, els.errD1, v1.ok ? "" : v1.msg);
    setError(els.d2, els.errD2, v2.ok ? "" : v2.msg);

    if (!v1.ok || !v2.ok) return;

    const res = computeByDiagonals(v1.value, v2.value);
    renderResults(mode, res, metrics);
  } else {
    const va = parsePositive(els.a, els.errA, "a");
    const vang = parseAngleDeg(els.alpha, els.errAlpha);

    setError(els.a, els.errA, va.ok ? "" : va.msg);
    setError(els.alpha, els.errAlpha, vang.ok ? "" : vang.msg);

    if (!va.ok || !vang.ok) return;

    const res = computeBySideAngle(va.value, vang.value);
    renderResults(mode, res, metrics);
  }
}

function clearInputs() {
  clearErrors();
  const mode = els.inputType.value;

  if (mode === "diagonals") {
    els.d1.value = "";
    els.d2.value = "";
  } else {
    els.a.value = "";
    els.alpha.value = "";
  }

  els.results.textContent = "Здесь появятся результаты после вычисления.";
}

// --- events ---
els.btnShow.addEventListener("click", () => setMode(els.inputType.value));
els.btnCalc.addEventListener("click", validateAndCompute);
els.btnClear.addEventListener("click", clearInputs);

// realtime: убираем ошибку при вводе
[els.d1, els.d2, els.a, els.alpha].forEach((inp) => {
  inp.addEventListener("input", () => {
    inp.classList.remove("is-invalid");
    const errEl = $("err-" + inp.id);
    if (errEl) errEl.hidden = true;
  });
});

// init
setMode(els.inputType.value);
