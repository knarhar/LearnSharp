/* =====================================================================
   C# Deep Dive — app logic (vanilla JS, no build step)
   Routing via location.hash, progress in localStorage.
   ===================================================================== */
(function () {
  "use strict";

  const WORLDS = window.WORLDS || [];
  const STORE_KEY = "csharp-deepdive-progress-v1";
  const app = document.getElementById("app");
  const xpEl = document.getElementById("xp");
  const XP_PER_LEVEL = 100;

  /* ---------- progress ---------- */
  function loadDone() {
    try { return new Set(JSON.parse(localStorage.getItem(STORE_KEY)) || []); }
    catch { return new Set(); }
  }
  function saveDone(set) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify([...set])); } catch (e) {}
  }
  let done = loadDone();

  const allLevels = () => WORLDS.flatMap(w => w.levels);
  function markDone(levelId) {
    if (!done.has(levelId)) { done.add(levelId); saveDone(done); }
  }
  function updateXp() {
    const count = done.size;
    const total = allLevels().length;
    xpEl.innerHTML = `<b>${count * XP_PER_LEVEL} XP</b> · ${count}/${total} уроков`;
  }

  /* ---------- helpers ---------- */
  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  const KEYWORDS = new Set(("public private protected internal sealed abstract static " +
    "class interface struct enum namespace using return new void var this base override " +
    "virtual readonly const get set where in out params ref foreach for while if else do " +
    "switch case break continue true false null async await yield throw try catch finally " +
    "bool int long decimal string double float char object byte").split(" "));
  const TYPES = new Set(("List Box Invoice InvoiceBuilder IReport PdfReport ExcelReport " +
    "ReportFactory IButton IDialog IUiFactory WinButton WinDialog MacButton MacDialog " +
    "AppConfig Lazy IEnumerable IEnumerator IWeatherClient HttpWeatherClient IObserver " +
    "PriceFeed Dashboard ICommand OrderService IShippingStrategy IOrderState OrderContext " +
    "ExpenseRequest ApprovalHandler FileStream Stream StreamReader StreamWriter Task " +
    "Console Queue Stack HashSet Action Func IComparable Animal Cat Dog PaymentResult " +
    "PaymentRequest ThirdPartyPaySdk IPaymentGateway PaymentGatewayAdapter EvenNumbers " +
    "ICatalogNode ProductItem CategoryNode WeatherDecorator LoggingDecorator " +
    "CreateOrderCommand StandardShipping ExpressShipping NewOrderState PaidOrderState " +
    "TeamLead Manager FileMode FileAccess FileShare SdkChargeRequest SdkChargeResponse").split(" "));

  // Small C# highlighter. Works on escaped text; protects strings with placeholders.
  function highlight(raw) {
    const escaped = esc(raw);
    const lines = escaped.split("\n").map(line => {
      const cIdx = line.indexOf("//");
      let codePart = line, comment = "";
      if (cIdx !== -1) { codePart = line.slice(0, cIdx); comment = line.slice(cIdx); }

      // placeholder is one identifier-like token (letters around digits) so it survives
      // both the keyword pass (not a keyword) and the number pass (no word boundary at digits)
      const strings = [];
      let rest = codePart.replace(/"[^"]*"|'[^']*'/g, (m) => {
        strings.push(m);
        return "zzSTR" + (strings.length - 1) + "STRzz";
      });

      rest = rest.replace(/[A-Za-z_][A-Za-z0-9_]*/g, (m) => {
        if (/^zzSTR\d+STRzz$/.test(m)) return m;   // leave placeholders alone
        if (KEYWORDS.has(m)) return `<span class="tok-key">${m}</span>`;
        if (TYPES.has(m)) return `<span class="tok-type">${m}</span>`;
        return m;
      });

      rest = rest.replace(/\b\d+\.?\d*m?\b/g, (m) => `<span class="tok-num">${m}</span>`);

      rest = rest.replace(/zzSTR(\d+)STRzz/g, (_, i) =>
        `<span class="tok-str">${strings[Number(i)]}</span>`);

      const commentHtml = comment ? `<span class="tok-com">${comment}</span>` : "";
      return rest + commentHtml;
    });
    return lines.join("\n");
  }

  function worldProgress(w) {
    const d = w.levels.filter(l => done.has(l.id)).length;
    return { done: d, total: w.levels.length, pct: Math.round(d / w.levels.length * 100) };
  }

  /* ---------- routing ---------- */
  function router() {
    const hash = location.hash.slice(1);
    window.scrollTo(0, 0);
    if (hash.startsWith("level/")) return renderLesson(hash.slice(6));
    if (hash.startsWith("world/")) return renderWorld(hash.slice(6));
    return renderHome();
  }

  /* ---------- home ---------- */
  function renderHome() {
    const total = allLevels().length;
    const d = done.size;
    const pct = Math.round(d / total * 100);

    const cards = WORLDS.map((w) => {
      const p = worldProgress(w);
      const full = p.done === p.total && p.total > 0;
      return `
      <button class="world-card" data-nav="world/${w.id}">
        <span class="world-ico">${w.icon}</span>
        <span class="world-body">
          <h3>${w.name} ${full ? '<span class="check">✓</span>' : ''}</h3>
          <p>${w.blurb}</p>
          <span class="world-meta">
            <span class="mini-bar"><span style="width:${p.pct}%"></span></span>
            <span class="count">${p.done}/${p.total}</span>
          </span>
        </span>
      </button>`;
    }).join("");

    app.innerHTML = `
      <div class="view">
        <section class="hero">
          <h1>C# на глубоком уровне — как игра</h1>
          <p>Проходи миры по одному. В каждом уроке: понятная теория, живой пример кода,
             ссылки на доки и маленькое задание с проверкой. Прогресс сохраняется здесь же,
             в браузере.</p>
          <div class="progress-overall">
            <div class="label"><span>Общий прогресс</span><span>${d}/${total} · ${pct}%</span></div>
            <div class="bar"><span style="width:${pct}%"></span></div>
          </div>
        </section>
        <h2 class="section-title">Миры</h2>
        <div class="worlds">${cards}</div>
      </div>`;
  }

  /* ---------- world (level list) ---------- */
  function renderWorld(worldId) {
    const w = WORLDS.find(x => x.id === worldId);
    if (!w) { location.hash = ""; return; }

    const rows = w.levels.map((l, i) => {
      const isDone = done.has(l.id);
      return `
      <button class="level-row ${isDone ? 'done' : ''}" data-nav="level/${l.id}">
        <span class="level-num">${isDone ? '✓' : (i + 1)}</span>
        <span class="level-info">
          <h4>${l.title}</h4>
          <span>${l.subtitle}</span>
        </span>
        <span class="status">${isDone ? 'Пройдено' : 'Начать'}</span>
      </button>`;
    }).join("");

    const p = worldProgress(w);
    app.innerHTML = `
      <div class="view">
        <div class="crumbs"><a data-nav="">Миры</a> <span>›</span> <span>${w.name}</span></div>
        <div class="hero" style="margin-bottom:16px">
          <h1 style="font-size:var(--fs-24)">${w.icon} ${w.name}</h1>
          <p style="font-size:var(--fs-16)">${w.blurb}</p>
        </div>
        <div class="progress-overall" style="margin-top:0">
          <div class="label"><span>Прогресс мира</span><span>${p.done}/${p.total}</span></div>
          <div class="bar"><span style="width:${p.pct}%"></span></div>
        </div>
        <div class="levels">${rows}</div>
      </div>`;
  }

  /* ---------- lesson ---------- */
  function renderLesson(levelId) {
    let world, idxInWorld, level;
    for (const w of WORLDS) {
      const i = w.levels.findIndex(l => l.id === levelId);
      if (i !== -1) { world = w; idxInWorld = i; level = w.levels[i]; break; }
    }
    if (!level) { location.hash = ""; return; }

    const links = level.links
      .filter(lk => lk.url && lk.url !== "#")
      .map(lk => `<div class="link-row"><a href="${lk.url}" target="_blank" rel="noopener">${lk.label}</a></div>`)
      .join("");
    const pdfNotes = level.links
      .filter(lk => lk.url === "#")
      .map(lk => `<div class="link-row" style="opacity:.85">${lk.label}</div>`)
      .join("");

    const optionsHtml = level.task.options.map((opt, i) =>
      `<button class="opt" data-opt="${i}">
         <span class="mark">${String.fromCharCode(65 + i)}</span>
         <span>${opt}</span>
       </button>`).join("");

    const flat = allLevels();
    const globalIdx = flat.findIndex(l => l.id === levelId);
    const prev = flat[globalIdx - 1];
    const next = flat[globalIdx + 1];

    app.innerHTML = `
      <div class="view lesson">
        <div class="crumbs">
          <a data-nav="">Миры</a> <span>›</span>
          <a data-nav="world/${world.id}">${world.name}</a> <span>›</span>
          <span>Уровень ${idxInWorld + 1}</span>
        </div>

        <h2>${level.title}</h2>
        <p class="subtitle">${level.subtitle}</p>

        <div class="block">
          <div class="block-label">📖 Теория</div>
          <div class="prose">${level.theory}</div>
        </div>

        <div class="block">
          <div class="block-label">💻 Пример</div>
          <pre class="code"><code>${highlight(level.code)}</code></pre>
        </div>

        <div class="block deep">
          <div class="block-label">🔬 Глубже</div>
          <div class="prose">${level.deep}</div>
        </div>

        <div class="block">
          <div class="block-label">🔗 Доки и книги</div>
          <div class="links">${links}${pdfNotes}</div>
        </div>

        <div class="block">
          <div class="block-label">🎯 Задание</div>
          <div class="quiz">
            <p class="q">${level.task.q}</p>
            <div class="options" id="options">${optionsHtml}</div>
            <div class="feedback" id="feedback"></div>
          </div>
        </div>

        <div class="lesson-nav">
          ${prev ? `<button class="btn btn-ghost" data-nav="level/${prev.id}">← Назад</button>`
                 : `<button class="btn btn-ghost" data-nav="world/${world.id}">← К списку</button>`}
          ${next ? `<button class="btn btn-primary" data-nav="level/${next.id}">Дальше →</button>`
                 : `<button class="btn btn-primary" data-nav="">Готово ✓</button>`}
        </div>
      </div>`;

    wireQuiz(level);
  }

  function wireQuiz(level) {
    const optionsBox = document.getElementById("options");
    const feedback = document.getElementById("feedback");
    if (!optionsBox) return;
    let answered = false;

    optionsBox.addEventListener("click", (e) => {
      const btn = e.target.closest(".opt");
      if (!btn || answered) return;
      answered = true;
      const chosen = Number(btn.dataset.opt);
      const correct = level.task.answer;

      [...optionsBox.querySelectorAll(".opt")].forEach((o, i) => {
        o.disabled = true;
        if (i === correct) o.classList.add("correct");
        if (i === chosen && chosen !== correct) o.classList.add("wrong");
      });

      const ok = chosen === correct;
      feedback.className = "feedback show " + (ok ? "ok" : "no");
      feedback.innerHTML = (ok ? "<b>Верно! ✓</b> " : "<b>Не совсем.</b> ") + level.task.explain;

      if (ok) {
        const wasDone = done.has(level.id);
        markDone(level.id);
        updateXp();
        if (!wasDone) toast("+100 XP · урок пройден");
      }
    });
  }

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(msg) {
    let t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- global nav ---------- */
  document.addEventListener("click", (e) => {
    const nav = e.target.closest("[data-nav]");
    if (nav) { e.preventDefault(); location.hash = nav.dataset.nav; }
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    if (confirm("Сбросить весь прогресс и XP?")) {
      done = new Set(); saveDone(done); updateXp(); router();
    }
  });

  window.addEventListener("hashchange", router);
  updateXp();
  router();
})();
