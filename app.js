/* =====================================================================
   C# Deep Dive — app logic (vanilla JS, no build step)
   Routing via location.hash, progress in localStorage.
   Two languages: lesson content comes from data.js (ru) / data.en.js (en),
   interface strings from the UI dictionary below. Level ids are shared,
   so progress survives switching language.
   ===================================================================== */
(function () {
  "use strict";

  const STORE_KEY = "csharp-deepdive-progress-v1";
  const LANG_KEY = "csharp-deepdive-lang";
  const app = document.getElementById("app");
  const xpEl = document.getElementById("xp");
  const XP_PER_LEVEL = 100;

  /* ---------- language ---------- */
  const UI = {
    ru: {
      docTitle: "C# Deep Dive — обучалка-игра",
      docDesc: "Интерактивная игра-обучалка по C#: дженерики, вариантность, enumerables, FileStream I/O, делегаты и события, EventBus и паттерны проектирования.",
      brandTag: "обучалка-игра",
      brandAria: "На главную — роадмап",
      themeTitle: "День / ночь",
      themeAria: "Переключить тему",
      langAria: "Язык сайта",
      langTo: "Switch to English",
      menu: "Меню настроек",
      reset: "Сброс",
      resetTitle: "Сбросить прогресс",
      resetConfirm: "Сбросить весь прогресс и XP?",
      lessons: "уроков",

      heroTitle: "Твой путь по C#",
      heroText: `Иди по дорожке сверху вниз. Каждый мир — это тема, а точки внутри — уроки.
             Зелёное — пройдено, жёлтое — где ты сейчас. Прогресс хранится в браузере.`,
      overall: "Общий прогресс",
      tagNow: "Сейчас",
      ctaAllDone: "🎉 Всё пройдено — к списку миров",
      ctaStart: "▶ Начать",
      ctaContinue: "▶ Продолжить",
      allWorldsBtn: "Все миры списком",

      crumbPath: "Путь",
      crumbAllWorlds: "Все миры",
      crumbWorlds: "Миры",
      worldsTitle: "Все миры",
      worldsText: "Выбери любой мир и открой его уроки.",
      worldProgress: "Прогресс мира",
      statusDone: "Пройдено",
      statusStart: "Начать",

      levelWord: "Уровень",
      blockTheory: "📖 Теория",
      blockExample: "💻 Пример",
      blockDeeper: "🔬 Глубже",
      blockLinks: "🔗 Доки и книги",
      blockTask: "🎯 Задание",
      placeholder: "Напиши ответ здесь...",
      check: "Проверить",
      reveal: "Показать ответ",
      answerLabel: "✅ Ответ",
      empty: "<b>Пусто.</b> Напиши ответ в поле выше.",
      okWrite: "<b>Верно! ✓</b> ",
      noWrite: "<b>Пока не то.</b> Проверь ключевые части ответа и попробуй ещё раз.",
      okQuiz: "<b>Верно! ✓</b> ",
      noQuiz: "<b>Не совсем.</b> ",
      navBack: "← Назад",
      navList: "☰ К списку уроков",
      navNext: "Дальше →",
      navDone: "Готово ✓",
      toastXp: "+100 XP · урок пройден"
    },
    en: {
      docTitle: "C# Deep Dive — learn by playing",
      docDesc: "An interactive C# learning game: generics, variance, enumerables, FileStream I/O, delegates and events, EventBus and design patterns.",
      brandTag: "learn by playing",
      brandAria: "Back home — the roadmap",
      themeTitle: "Day / night",
      themeAria: "Switch theme",
      langAria: "Site language",
      langTo: "Переключить на русский",
      menu: "Settings menu",
      reset: "Reset",
      resetTitle: "Reset progress",
      resetConfirm: "Reset all progress and XP?",
      lessons: "lessons",

      heroTitle: "Your path through C#",
      heroText: `Follow the track from top to bottom. Each world is a topic, and the dots inside are lessons.
             Green means done, yellow is where you are now. Progress is saved in your browser.`,
      overall: "Overall progress",
      tagNow: "You are here",
      ctaAllDone: "🎉 All done — see every world",
      ctaStart: "▶ Start",
      ctaContinue: "▶ Continue",
      allWorldsBtn: "All worlds as a list",

      crumbPath: "Path",
      crumbAllWorlds: "All worlds",
      crumbWorlds: "Worlds",
      worldsTitle: "All worlds",
      worldsText: "Pick any world and open its lessons.",
      worldProgress: "World progress",
      statusDone: "Done",
      statusStart: "Start",

      levelWord: "Level",
      blockTheory: "📖 Theory",
      blockExample: "💻 Example",
      blockDeeper: "🔬 Going deeper",
      blockLinks: "🔗 Docs and books",
      blockTask: "🎯 Task",
      placeholder: "Write your answer here...",
      check: "Check",
      reveal: "Show answer",
      answerLabel: "✅ Answer",
      empty: "<b>Empty.</b> Write your answer in the field above.",
      okWrite: "<b>Correct! ✓</b> ",
      noWrite: "<b>Not quite yet.</b> Check the key parts of your answer and try again.",
      okQuiz: "<b>Correct! ✓</b> ",
      noQuiz: "<b>Not quite.</b> ",
      navBack: "← Back",
      navList: "☰ Lesson list",
      navNext: "Next →",
      navDone: "Finish ✓",
      toastXp: "+100 XP · lesson complete"
    }
  };

  function loadLang() {
    try { return localStorage.getItem(LANG_KEY) === "en" ? "en" : "ru"; }
    catch { return "ru"; }
  }
  let lang = loadLang();
  let t = UI[lang];
  let WORLDS = [];
  function pickContent() {
    const src = lang === "en" ? window.WORLDS_EN : window.WORLDS_RU;
    WORLDS = src || window.WORLDS_RU || [];
  }
  pickContent();

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
    xpEl.innerHTML = `<b>${count * XP_PER_LEVEL} XP</b><span class="xp-count"> · ${count}/${total} ${t.lessons}</span>`;
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
    if (hash === "worlds") return renderWorlds();
    return renderHome();
  }

  /* первый непройденный урок во всём курсе (по порядку миров) */
  function firstUnfinished() {
    for (const w of WORLDS) {
      for (const l of w.levels) {
        if (!done.has(l.id)) return { world: w, level: l };
      }
    }
    return null; // всё пройдено
  }

  /* ---------- home = roadmap (дорожка прохождения) ---------- */
  function renderHome() {
    const total = allLevels().length;
    const d = done.size;
    const pct = Math.round(d / total * 100);
    const next = firstUnfinished();
    const nextId = next ? next.level.id : null;

    const steps = WORLDS.map((w, i) => {
      const p = worldProgress(w);
      const full = p.total > 0 && p.done === p.total;
      const isCurrent = next && next.world.id === w.id;
      const state = full ? "done" : (isCurrent ? "current" : "upcoming");

      const dots = w.levels.map((l, j) => {
        const isDone = done.has(l.id);
        const isNext = l.id === nextId;
        const cls = isDone ? "done" : (isNext ? "next" : "");
        const face = isDone ? "✓" : (isNext ? "▶" : (j + 1));
        return `<button class="road-dot ${cls}" data-nav="level/${l.id}"
                  title="${esc(l.title)}">${face}</button>`;
      }).join("");

      return `
      <li class="road-step ${state}">
        <button class="road-node" data-nav="world/${w.id}" aria-label="${esc(w.name)}">
          <span>${full ? "✓" : (i + 1)}</span>
        </button>
        <div class="road-card" data-nav="world/${w.id}">
          <div class="road-head">
            <span class="road-ico">${w.icon}</span>
            <h3>${w.name}</h3>
            <span class="road-meta">
              ${state === "current" ? `<span class="road-tag">${t.tagNow}</span>` : ""}
              <span class="road-count">${p.done}/${p.total}</span>
            </span>
          </div>
          <p class="road-blurb">${w.blurb}</p>
          <div class="road-levels">${dots}</div>
        </div>
      </li>`;
    }).join("");

    let cta;
    if (!next) {
      cta = `<button class="btn" data-nav="worlds">${t.ctaAllDone}</button>`;
    } else if (d === 0) {
      // no progress yet — invite the user in with a glowing "Start" button
      cta = `<button class="btn btn-primary btn-pulse" data-nav="level/${nextId}">${t.ctaStart}</button>`;
    } else {
      cta = `<button class="btn btn-pulse-go" data-nav="level/${nextId}">${t.ctaContinue}</button>`;
    }

    app.innerHTML = `
      <div class="view">
        <section class="hero">
          <h1>${t.heroTitle}</h1>
          <p>${t.heroText}</p>
          <div class="progress-overall">
            <div class="label"><span>${t.overall}</span><span>${d}/${total} · ${pct}%</span></div>
            <div class="bar"><span style="width:${pct}%"></span></div>
          </div>
          <div class="hero-actions">
            ${cta}
            <button class="btn btn-ghost" data-nav="worlds">${t.allWorldsBtn}</button>
          </div>
        </section>
        <ol class="roadmap">${steps}</ol>
      </div>`;
  }

  /* ---------- worlds (список миров плитками) ---------- */
  function renderWorlds() {
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
        <div class="crumbs"><a data-nav="">${t.crumbPath}</a> <span>›</span> <span>${t.crumbAllWorlds}</span></div>
        <section class="hero" style="margin-bottom:16px">
          <h1 style="font-size:var(--fs-24)">${t.worldsTitle}</h1>
          <p style="font-size:var(--fs-16)">${t.worldsText}</p>
          <div class="progress-overall">
            <div class="label"><span>${t.overall}</span><span>${d}/${total} · ${pct}%</span></div>
            <div class="bar"><span style="width:${pct}%"></span></div>
          </div>
        </section>
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
        <span class="status">${isDone ? t.statusDone : t.statusStart}</span>
      </button>`;
    }).join("");

    const p = worldProgress(w);
    app.innerHTML = `
      <div class="view">
        <div class="crumbs"><a data-nav="">${t.crumbPath}</a> <span>›</span> <a data-nav="worlds">${t.crumbWorlds}</a> <span>›</span> <span>${w.name}</span></div>
        <div class="hero" style="margin-bottom:16px">
          <h1 style="font-size:var(--fs-24)">${w.icon} ${w.name}</h1>
          <p style="font-size:var(--fs-16)">${w.blurb}</p>
        </div>
        <div class="progress-overall" style="margin-top:0">
          <div class="label"><span>${t.worldProgress}</span><span>${p.done}/${p.total}</span></div>
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

    const isWrite = level.task.kind === "write";
    let taskHtml;
    if (isWrite) {
      taskHtml = `
        <div class="quiz">
          <p class="q">${level.task.q}</p>
          <textarea id="answer" class="answer" rows="4"
            placeholder="${(level.task.placeholder || t.placeholder).replace(/"/g, '&quot;')}"
            spellcheck="false"></textarea>
          <div class="write-actions">
            <button class="btn btn-primary" id="checkBtn">${t.check}</button>
            <button class="btn btn-ghost" id="revealBtn">${t.reveal}</button>
          </div>
          <div class="feedback" id="feedback"></div>
          <div class="solution" id="solution"></div>
        </div>`;
    } else {
      const optionsHtml = level.task.options.map((opt, i) =>
        `<button class="opt" data-opt="${i}">
           <span class="mark">${String.fromCharCode(65 + i)}</span>
           <span>${opt}</span>
         </button>`).join("");
      taskHtml = `
        <div class="quiz">
          <p class="q">${level.task.q}</p>
          <div class="options" id="options">${optionsHtml}</div>
          <div class="feedback" id="feedback"></div>
        </div>`;
    }

    const flat = allLevels();
    const globalIdx = flat.findIndex(l => l.id === levelId);
    const prev = flat[globalIdx - 1];
    const next = flat[globalIdx + 1];

    app.innerHTML = `
      <div class="view lesson">
        <div class="crumbs">
          <a data-nav="worlds">${t.crumbWorlds}</a> <span>›</span>
          <a data-nav="world/${world.id}">${world.name}</a> <span>›</span>
          <span>${t.levelWord} ${idxInWorld + 1}</span>
        </div>

        <h2>${level.title}</h2>
        <p class="subtitle">${level.subtitle}</p>

        <div class="block">
          <div class="block-label">${t.blockTheory}</div>
          <div class="prose">${level.theory}</div>
        </div>

        <div class="block">
          <div class="block-label">${t.blockExample}</div>
          <pre class="code"><code>${highlight(level.code)}</code></pre>
        </div>

        <div class="block deep">
          <div class="block-label">${t.blockDeeper}</div>
          <div class="prose">${level.deep}</div>
        </div>

        <div class="block">
          <div class="block-label">${t.blockLinks}</div>
          <div class="links">${links}${pdfNotes}</div>
        </div>

        <div class="block">
          <div class="block-label">${t.blockTask}</div>
          ${taskHtml}
        </div>

        <div class="lesson-nav">
          ${prev ? `<button class="btn btn-ghost" data-nav="level/${prev.id}">${t.navBack}</button>` : ''}
          <button class="btn btn-ghost" data-nav="world/${world.id}">${t.navList}</button>
          ${next ? `<button class="btn btn-primary" data-nav="level/${next.id}">${t.navNext}</button>`
                 : `<button class="btn btn-primary" data-nav="">${t.navDone}</button>`}
        </div>
      </div>`;

    if (isWrite) wireWrite(level); else wireQuiz(level);
  }

  // normalize free-text answer: lowercase + drop all whitespace
  function norm(s) { return (s || "").toLowerCase().replace(/\s+/g, ""); }

  function wireWrite(level) {
    const ta = document.getElementById("answer");
    const checkBtn = document.getElementById("checkBtn");
    const revealBtn = document.getElementById("revealBtn");
    const feedback = document.getElementById("feedback");
    const solutionBox = document.getElementById("solution");
    if (!ta) return;

    checkBtn.addEventListener("click", () => {
      const user = norm(ta.value);
      if (!user) {
        feedback.className = "feedback show no";
        feedback.innerHTML = t.empty;
        return;
      }
      const need = (level.task.must || []).map(norm);
      const ok = need.every(fragment => user.includes(fragment));

      feedback.className = "feedback show " + (ok ? "ok" : "no");
      feedback.innerHTML = ok ? t.okWrite + level.task.explain : t.noWrite;

      if (ok) {
        const wasDone = done.has(level.id);
        markDone(level.id);
        updateXp();
        if (!wasDone) toast(t.toastXp);
      }
    });

    revealBtn.addEventListener("click", () => {
      solutionBox.className = "solution show";
      solutionBox.innerHTML =
        `<div class="block-label">${t.answerLabel}</div>
         <pre class="code"><code>${highlight(level.task.solution || "")}</code></pre>
         <p class="prose" style="margin-top:8px">${level.task.explain}</p>`;
    });
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
      feedback.innerHTML = (ok ? t.okQuiz : t.noQuiz) + level.task.explain;

      if (ok) {
        const wasDone = done.has(level.id);
        markDone(level.id);
        updateXp();
        if (!wasDone) toast(t.toastXp);
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
  // keyboard: Enter/Space activates a focused nav element (e.g. the logo)
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const nav = e.target.closest("[data-nav][tabindex]");
    if (nav) { e.preventDefault(); location.hash = nav.dataset.nav; }
  });

  const resetBtn = document.getElementById("resetBtn");
  resetBtn.addEventListener("click", () => {
    if (confirm(t.resetConfirm)) {
      done = new Set(); saveDone(done); updateXp(); router();
    }
  });

  /* ---------- language switch ---------- */
  const langSwitch = document.getElementById("langSwitch");
  const brand = document.getElementById("brand");
  const brandTag = document.getElementById("brandTag");
  const metaDesc = document.getElementById("metaDesc");

  // everything outside #app that carries text: title, meta, brand, buttons
  function paintChrome() {
    document.documentElement.lang = lang;
    document.title = t.docTitle;
    if (metaDesc) metaDesc.setAttribute("content", t.docDesc);
    if (brandTag) brandTag.textContent = t.brandTag;
    if (brand) brand.setAttribute("aria-label", t.brandAria);
    resetBtn.textContent = t.reset;
    resetBtn.title = t.resetTitle;
    resetBtn.setAttribute("aria-label", t.resetTitle);
    if (langSwitch) {
      langSwitch.setAttribute("aria-label", t.langAria);
      langSwitch.querySelectorAll("button").forEach(b => {
        const active = b.dataset.lang === lang;
        b.setAttribute("aria-pressed", active ? "true" : "false");
        b.title = active ? t.langAria : t.langTo;
      });
    }
    if (burgerBtn) {
      burgerBtn.title = t.menu;
      burgerBtn.setAttribute("aria-label", t.menu);
    }
    paintThemeBtn();
  }

  function setLang(next) {
    if (next === lang) return;
    lang = next;
    t = UI[lang];
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    pickContent();
    paintChrome();
    updateXp();
    router();   // re-render the current view in the new language
  }

  if (langSwitch) {
    langSwitch.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-lang]");
      if (btn) setLang(btn.dataset.lang);
    });
  }

  /* ---------- burger menu (phones only) ---------- */
  const burgerBtn = document.getElementById("burgerBtn");
  const controls = document.getElementById("controls");
  function closeMenu() {
    if (!controls) return;
    controls.classList.remove("open");
    burgerBtn.setAttribute("aria-expanded", "false");
  }
  if (burgerBtn && controls) {
    burgerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = !controls.classList.contains("open");
      controls.classList.toggle("open", open);
      burgerBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // picking anything inside closes the menu; so does a tap outside or Escape
    controls.addEventListener("click", (e) => {
      if (e.target.closest("button")) closeMenu();
    });
    document.addEventListener("click", (e) => {
      if (!controls.contains(e.target) && e.target !== burgerBtn) closeMenu();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  }

  /* ---------- day / night theme ---------- */
  const THEME_KEY = "csharp-deepdive-theme";
  const themeBtn = document.getElementById("themeBtn");
  function isDark() { return document.documentElement.getAttribute("data-theme") === "dark"; }
  function paintThemeBtn() {
    if (!themeBtn) return;
    themeBtn.textContent = isDark() ? "☀️" : "🌙";
    themeBtn.title = t.themeTitle;
    themeBtn.setAttribute("aria-label", t.themeAria);
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const goDark = !isDark();
      if (goDark) document.documentElement.setAttribute("data-theme", "dark");
      else document.documentElement.removeAttribute("data-theme");
      try { localStorage.setItem(THEME_KEY, goDark ? "dark" : "light"); } catch (e) {}
      paintThemeBtn();
    });
  }

  window.addEventListener("hashchange", router);
  paintChrome();
  updateXp();
  router();
})();
