(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const app = $("#app");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover)").matches;
  gsap.registerPlugin(ScrollTrigger);

  // ---------- theme ----------
  const root = document.documentElement;
  try { const t = localStorage.getItem("gic-theme"); if (t) root.dataset.theme = t; } catch {}
  $("#themeBtn").onclick = () => {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem("gic-theme", root.dataset.theme); } catch {}
  };

  // ---------- smooth scroll ----------
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const toTop = () => (lenis ? lenis.scrollTo(0, { immediate: true }) : scrollTo(0, 0));
  gsap.to(".progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

  // ---------- nav ----------
  $("#navLinks").innerHTML = `<a href="#/" data-link>Home</a>` +
    COMPETITIONS.map(c => `<a href="#/${c.slug}" data-link>${c.short}</a>`).join("");
  $("#menuBtn").onclick = () => $("#navLinks").classList.toggle("open");

  // ---------- helpers ----------
  const art = (c, eager) => `<div class="art" style="--h:${c ? c.hue : 250}">
      <div class="gen"></div><div class="grid3d"></div><div class="glyph">${c ? c.glyph : "✦"}</div>
      <img src="images/${c ? c.slug : "hero"}.jpg" alt="" ${eager ? "" : 'loading="lazy"'} onerror="this.remove()">
    </div>`;
  const split = txt => txt.split(" ").map(w => `<span class="w"><span>${w}</span></span>`).join(" ");
  const awardsHTML = () => EVENT.awards.map(a => `
    <div class="award ${a.cls} tilt"><div class="medal"></div>
      <div class="tier">${a.tier}</div><h4>${a.title}</h4>
      <ul>${a.items.map(i => `<li>${i}</li>`).join("")}</ul></div>`).join("");
  const footer = () => `<footer><div class="wrap"><span>© 2026 ${EVENT.name} · GEMS World Academy</span><span>${EVENT.dateLabel}</span></div></footer>`;

  // ---------- HOME ----------
  function home() {
    const words = "One day. Six arenas. Hundreds of young innovators building, coding, pitching and inventing the future of our world — together.".split(" ");
    return `
    <section class="hero">
      <div class="hero-img"><img src="images/hero.jpg" alt="" onerror="this.parentNode.remove()"></div>
      <div class="hero-stage">
        ${[[380, "#22e1ff"], [620, "#7c5cff"], [880, "#ffc93c"], [1180, "#ff4fd8"]].map(([s, c], i) =>
          `<div class="ring" style="--s:${s}px;--c:${c}" data-i="${i}"></div>`).join("")}
      </div>
      <div class="hero-inner wrap">
        <div class="hero-date reveal"><b>27.10.26</b> ${EVENT.dateLabel} · ${EVENT.venue}</div>
        <h1 class="h-xl split" id="heroTitle">${split("GWA Innovation")} <span class="line2 grad">${split("Championship")}</span></h1>
        <p class="lead reveal">The official guide to every competition — what to build, how it's judged, what to bring and how to win.</p>
        <div class="hero-ctas reveal">
          <a href="#competitions" class="btn btn-solid magnetic" data-scroll><span>Explore competitions <i class="arrow">→</i></span></a>
          <button class="btn magnetic" data-open-register><span>Teachers: coach or judge</span></button>
        </div>
        <div class="countdown reveal" id="countdown">
          ${["Days", "Hours", "Mins", "Secs"].map(u => `<div class="cd"><b data-u="${u}">00</b><small>${u}</small></div>`).join("")}
        </div>
      </div>
      <div class="scroll-hint">SCROLL<i></i></div>
    </section>

    <div class="marquee"><div class="marquee-track">
      ${Array(2).fill(COMPETITIONS.map(c => `<span>${c.name}</span><span>✦</span>`).join("")).join("")}
    </div></div>

    <section class="section manifesto"><div class="wrap">
      <p class="eyebrow">The competition</p><br><br>
      <p id="manifesto">${words.map(w => `<span class="wd">${w}</span>`).join(" ")}</p>
      <div class="facts">
        <div class="fact reveal"><b data-count="6">0</b><span>Competitions</span></div>
        <div class="fact reveal"><b data-count="1">0</b><span>Day · 27 October</span></div>
        <div class="fact reveal"><b data-count="100" data-suffix="%">0</b><span>Participants certified</span></div>
        <div class="fact reveal"><b data-count="6">0</b><span>Trophies to win</span></div>
      </div>
    </div></section>

    <section class="comps" id="competitions">
      <div class="wrap comps-head">
        <div><p class="eyebrow">Choose your arena</p><h2 class="h-lg split">${split("Six competition guides")}</h2></div>
        <p class="lead" style="max-width:38ch">Open any arena for its full guide: format, rules, judging rubric, kit list and winning tips.</p>
      </div>
      <div class="h-scroll"><div class="h-track">
        ${COMPETITIONS.map(c => `
          <a class="ccard" href="#/${c.slug}" data-link style="--a:${c.accent}">
            <div class="ccard-in tilt">
              ${art(c)}
              <span class="go">↗</span>
              <div class="ccard-body"><span class="no">${c.no} / 06</span><h3>${c.name}</h3><p>${c.tag}</p></div>
              <div class="glare"></div>
            </div>
          </a>`).join("")}
      </div></div>
    </section>

    <section class="section" id="schedule"><div class="wrap">
      <p class="eyebrow">Tuesday 27 October</p>
      <h2 class="h-lg split">${split("The day, minute by minute")}</h2>
      <div class="timeline"><div class="tl-line"><i></i></div>
        ${EVENT.schedule.map(([t, h, p]) => `<div class="tl-item"><time>${t}</time><div><h4>${h}</h4><p class="muted">${p}</p></div></div>`).join("")}
      </div>
    </div></section>

    <section class="section" id="awards"><div class="wrap">
      <p class="eyebrow">Recognition</p>
      <h2 class="h-lg split">${split("Everyone leaves with something")}</h2>
      <p class="lead reveal" style="margin-top:20px">In every competition the champion lifts a trophy and earns a winner's certificate, the runner-up earns a certificate — and every participant and every judge is certified.</p>
      <div class="podium">${awardsHTML()}</div>
    </div></section>

    <section class="section"><div class="wrap cols">
      <div><p class="eyebrow">Fair play</p><h2 class="h-lg split">${split("Rules for every arena")}</h2></div>
      <ol class="rule-list">${EVENT.generalRules.map(r => `<li class="reveal">${r}</li>`).join("")}</ol>
    </div></section>

    <section class="section" style="padding-top:0"><div class="wrap cols">
      <div><p class="eyebrow">Questions</p><h2 class="h-lg split">${split("Good to know")}</h2></div>
      <div>${EVENT.faq.map(([q, a]) => `<details class="acc reveal"><summary>${q}<i></i></summary><p class="ans">${a}</p></details>`).join("")}</div>
    </div></section>

    <div class="wrap"><section class="cta-band">
      <p class="eyebrow">For teachers</p>
      <h2 class="h-lg split">${split("Lead a team. Judge the future.")}</h2>
      <div class="roles">
        <button class="role-card magnetic-soft" data-open-register="Coach"><b>Register as a coach →</b><span>Enter a student team in any competition and guide them on the day.</span></button>
        <button class="role-card magnetic-soft" data-open-register="Judge"><b>Register as a judge →</b><span>Score a competition with a clear rubric. Every judge receives a certificate.</span></button>
      </div>
    </section></div>
    ${footer()}`;
  }

  // ---------- GUIDE ----------
  function guide(c) {
    const i = COMPETITIONS.indexOf(c), next = COMPETITIONS[(i + 1) % COMPETITIONS.length];
    const secs = [["overview", "Overview"], ["format", "How it works"], ["rules", "Rules"], ["judging", "Judging"], ["bring", "What to bring"], ["tips", "Winning tips"], ["awards", "Awards"]];
    return `
    <section class="g-hero" style="--a:${c.accent}">
      ${art(c, true)}
      <div class="wrap">
        <div class="no reveal">${c.no}</div>
        <p class="eyebrow" style="color:${c.accent}">Competition guide · ${EVENT.dateLabel}</p>
        <h1 class="h-xl split" style="font-size:clamp(40px,7.5vw,118px)">${split(c.name)}</h1>
        <p class="lead reveal">${c.tag}</p>
        <div class="stats">${c.stats.map(([k, v]) => `<div class="stat reveal"><small>${k}</small><b>${v}</b></div>`).join("")}</div>
      </div>
    </section>
    <div class="wrap g-layout" style="--a:${c.accent}">
      <aside class="g-toc">${secs.map(([id, t]) => `<a href="#${id}" data-scroll>${t}</a>`).join("")}</aside>
      <div>
        <section class="g-sec" id="overview"><p class="eyebrow">Overview</p><h2 class="h-md split">${split("What is it?")}</h2>
          <p class="lead reveal" style="color:var(--ink)">${c.overview}</p></section>
        <section class="g-sec" id="format"><p class="eyebrow">How it works</p><h2 class="h-md split">${split("Format on the day")}</h2>
          <div class="steps">${c.format.map(([h, p], n) => `<div class="step reveal"><div class="n">${n + 1}</div><div><h4>${h}</h4><p>${p}</p></div></div>`).join("")}</div></section>
        <section class="g-sec" id="rules"><p class="eyebrow">Rules</p><h2 class="h-md split">${split("Play it fair")}</h2>
          <ol class="rule-list">${c.rules.map(r => `<li class="reveal">${r}</li>`).join("")}</ol>
          <p class="muted reveal" style="margin-top:18px;font-size:15px">Plus the championship rules that apply to every arena — see the home page.</p></section>
        <section class="g-sec" id="judging"><p class="eyebrow">Judging rubric</p><h2 class="h-md split">${split("How you're scored")}</h2>
          <div class="rubric">${c.judging.map(([k, v]) => `<div class="bar-row"><div class="top"><span>${k}</span><b>${v}%</b></div><div class="bar"><i style="--w:${v * 2.5}%"></i></div></div>`).join("")}</div></section>
        <section class="g-sec" id="bring"><p class="eyebrow">Kit list</p><h2 class="h-md split">${split("What to bring")}</h2>
          <div class="chips">${[...c.bring, "Water bottle", "School ID"].map(b => `<span class="chip reveal">${b}</span>`).join("")}</div></section>
        <section class="g-sec" id="tips"><p class="eyebrow">From the judges</p><h2 class="h-md split">${split("Winning tips")}</h2>
          <div class="tip-grid">${c.tips.map((t, n) => `<div class="tip reveal tilt"><small>TIP ${String(n + 1).padStart(2, "0")}</small>${t}</div>`).join("")}</div></section>
        <section class="g-sec" id="awards"><p class="eyebrow">Awards</p><h2 class="h-md split">${split("What you can win")}</h2>
          <div class="g-awards">${awardsHTML()}</div>
          <div style="margin-top:30px;display:flex;gap:12px;flex-wrap:wrap">
            <button class="btn btn-solid magnetic" data-open-register="Coach" data-comp="${c.slug}"><span>Coach a team in ${c.short}</span></button>
            <button class="btn magnetic" data-open-register="Judge" data-comp="${c.slug}"><span>Judge ${c.short}</span></button>
          </div></section>
      </div>
    </div>
    <div class="wrap"><a class="next-comp" href="#/${next.slug}" data-link>${art(next)}
      <div class="wrap2"><p class="eyebrow">Next guide</p><h3 class="h-lg">${next.name} →</h3></div></a></div>
    ${footer()}`;
  }

  // ---------- animations per page ----------
  let ctx;
  function animate(isHome) {
    ctx && ctx.revert();
    ctx = gsap.context(() => {
      if (reduce) return;
      // split headlines: rise with 3D tilt
      $$(".split").forEach((el, i) => {
        const inner = $$(".w>span", el);
        const first = el.closest(".hero, .g-hero");
        gsap.from(inner, {
          yPercent: 120, rotateX: -80, opacity: 0, stagger: 0.06, duration: 1.1, ease: "expo.out",
          delay: first ? 0.35 : 0,
          scrollTrigger: first ? null : { trigger: el, start: "top 85%" },
        });
      });
      $$(".reveal").forEach(el => {
        const first = el.closest(".hero, .g-hero");
        gsap.fromTo(el, { opacity: 0, y: 40, filter: "blur(8px)" }, {
          opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out", delay: first ? 0.7 : 0,
          scrollTrigger: first ? null : { trigger: el, start: "top 90%" },
        });
      });
      if (isHome) {
        // orbit rings react to scroll
        $$(".ring").forEach((r, i) => {
          gsap.to(r, { rotateZ: (i % 2 ? -1 : 1) * 360, duration: 30 + i * 12, repeat: -1, ease: "none" });
          gsap.to(r, { rotateX: 30 + i * 8, scale: 1.4 + i * .2, opacity: 0, ease: "none",
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
        });
        gsap.to(".hero-inner", { yPercent: 30, opacity: 0, scale: .94, ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
        // marquee driven by scroll velocity
        const mt = gsap.to(".marquee-track", { xPercent: -50, duration: 30, repeat: -1, ease: "none" });
        ScrollTrigger.create({ onUpdate: s => gsap.to(mt, { timeScale: 1 + Math.min(Math.abs(s.getVelocity()) / 300, 6), duration: .2, overwrite: true,
          onComplete: () => gsap.to(mt, { timeScale: 1, duration: 1 }) }) });
        // manifesto: words light up as you scroll
        gsap.to("#manifesto .wd", { opacity: 1, stagger: 0.1, ease: "none",
          scrollTrigger: { trigger: "#manifesto", start: "top 80%", end: "bottom 45%", scrub: true } });
        // counters
        $$("[data-count]").forEach(el => {
          const o = { v: 0 };
          gsap.to(o, { v: +el.dataset.count, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%" },
            onUpdate: () => el.textContent = Math.round(o.v) + (el.dataset.suffix || "") });
        });
        // horizontal pinned competitions (desktop/tablet)
        gsap.matchMedia().add("(min-width: 641px)", () => {
          const track = $(".h-track");
          const dist = () => track.scrollWidth - innerWidth;
          gsap.to(track, { x: () => -dist(), ease: "none",
            scrollTrigger: { trigger: ".h-scroll", pin: true, scrub: 0.8, end: () => "+=" + dist(), invalidateOnRefresh: true } });
          $$(".ccard").forEach((card, i) => gsap.from(card, { y: 120 + i * 30, rotateY: -25, opacity: 0, duration: 1.2, ease: "expo.out",
            scrollTrigger: { trigger: ".h-scroll", start: "top 75%" } }));
        });
        // timeline draws itself
        gsap.to(".tl-line i", { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".timeline", start: "top 70%", end: "bottom 60%", scrub: true } });
        $$(".tl-item").forEach(el => ScrollTrigger.create({ trigger: el, start: "top 62%", onEnter: () => el.classList.add("lit"), onLeaveBack: () => el.classList.remove("lit") }));
        // podium flips up
        gsap.from(".podium .award", { rotateX: -70, y: 100, opacity: 0, transformOrigin: "50% 100%", stagger: .12, duration: 1.2, ease: "expo.out",
          scrollTrigger: { trigger: ".podium", start: "top 80%" } });
      } else {
        gsap.to(".g-hero .art", { yPercent: 25, scale: 1.12, ease: "none", scrollTrigger: { trigger: ".g-hero", start: "top top", end: "bottom top", scrub: true } });
        gsap.fromTo(".g-hero .art", { clipPath: "inset(12% 12% 12% 12% round 40px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.4, ease: "expo.out" });
        $$(".bar i").forEach(b => gsap.to(b, { scaleX: 1, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: b, start: "top 90%" } }));
        gsap.from(".g-awards .award", { rotateY: 90, opacity: 0, stagger: .1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".g-awards", start: "top 85%" } });
        // active TOC
        $$(".g-sec").forEach(s => ScrollTrigger.create({ trigger: s, start: "top 45%", end: "bottom 45%",
          onToggle: e => e.isActive && $$(".g-toc a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + s.id)) }));
      }
    }, app);
    bindInteractions();
    ScrollTrigger.refresh();
  }

  // ---------- micro-interactions ----------
  function bindInteractions() {
    if (!fine || reduce) return;
    $$(".tilt", app).forEach(el => {
      el.onpointermove = e => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.transform = `rotateY(${(x - .5) * 16}deg) rotateX(${(.5 - y) * 16}deg) translateZ(10px)`;
        el.style.setProperty("--gx", x * 100 + "%"); el.style.setProperty("--gy", y * 100 + "%");
      };
      el.onpointerleave = () => (el.style.transform = "");
    });
    $$(".magnetic, .magnetic-soft").forEach(el => {
      const k = el.classList.contains("magnetic-soft") ? .08 : .3;
      el.onpointermove = e => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * k, y: (e.clientY - r.top - r.height / 2) * k, duration: .4, ease: "power3.out" });
      };
      el.onpointerleave = () => gsap.to(el, { x: 0, y: 0, duration: .8, ease: "elastic.out(1,.4)" });
    });
  }

  // cursor
  if (fine && !reduce) {
    const cur = $(".cursor"), xTo = gsap.quickTo(cur, "x", { duration: .25 }), yTo = gsap.quickTo(cur, "y", { duration: .25 });
    addEventListener("pointermove", e => { xTo(e.clientX); yTo(e.clientY); });
    document.addEventListener("pointerover", e => cur.classList.toggle("big", !!e.target.closest("a,button,summary,label")));
  }

  // countdown
  function tick() {
    const el = $("#countdown"); if (!el) return;
    let d = Math.max(0, new Date(EVENT.date) - Date.now()) / 1000;
    const v = { Days: d / 86400, Hours: d / 3600 % 24, Mins: d / 60 % 60, Secs: d % 60 };
    $$("b", el).forEach(b => {
      const n = String(Math.floor(v[b.dataset.u])).padStart(2, "0");
      if (b.textContent !== n) { b.textContent = n; !reduce && gsap.fromTo(b.parentNode, { rotateX: -90 }, { rotateX: 0, duration: .6, ease: "back.out(2)" }); }
    });
  }
  setInterval(tick, 1000);

  // ---------- router + wipe transition ----------
  let first = true;
  async function route() {
    const slug = location.hash.replace(/^#\/?/, "");
    if (slug && !slug.startsWith("/") && $("#" + CSS.escape(slug)) && !COMPETITIONS.some(c => c.slug === slug)) return; // in-page anchor
    const comp = COMPETITIONS.find(c => c.slug === slug);
    $("#navLinks").classList.remove("open");
    $$("#navLinks a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === (comp ? "#/" + comp.slug : "#/")));
    document.title = comp ? `${comp.short} Guide · GWA Innovation` : "GWA Innovation Championship";
    const bars = $$(".wipe i");
    if (!first && !reduce) {
      if (comp) bars.forEach(b => (b.style.background = `linear-gradient(180deg,${comp.accent},#0a0c1a)`));
      await gsap.to(bars, { scaleY: 1, transformOrigin: "50% 100%", stagger: .06, duration: .5, ease: "power4.in" });
    }
    ctx && ctx.revert(); ScrollTrigger.getAll().forEach(t => t.kill());
    app.innerHTML = comp ? guide(comp) : home();
    toTop(); tick(); animate(!comp);
    if (!first && !reduce) gsap.to(bars, { scaleY: 0, transformOrigin: "50% 0%", stagger: .06, duration: .6, ease: "power4.out", delay: .05 });
    first = false;
    app.focus({ preventScroll: true });
  }
  addEventListener("hashchange", route);

  document.addEventListener("click", e => {
    const s = e.target.closest("[data-scroll]");
    if (s) {
      e.preventDefault();
      const t = $(s.getAttribute("href"));
      t && (lenis ? lenis.scrollTo(t, { offset: -90, duration: 1.4 }) : t.scrollIntoView({ behavior: "smooth" }));
    }
    const r = e.target.closest("[data-open-register]");
    if (r) openRegister(r.dataset.openRegister, r.dataset.comp);
  });

  // ---------- registration ----------
  const dlg = $("#register"), form = $("#regForm"), status = $("#regStatus");
  $("#regComp").innerHTML = `<option value="">Choose a competition…</option>` + COMPETITIONS.map(c => `<option value="${c.slug}">${c.name}</option>`).join("");
  const syncRole = () => form.classList.toggle("judge", form.role.value === "Judge");
  form.addEventListener("change", syncRole);
  function openRegister(role, comp) {
    if (role === "Coach" || role === "Judge") form.role.value = role;
    if (comp) form.competition.value = comp;
    syncRole(); status.textContent = "";
    dlg.showModal(); lenis && lenis.stop();
  }
  dlg.addEventListener("close", () => lenis && lenis.start());
  dlg.addEventListener("click", e => e.target === dlg && dlg.close());

  let db = null;
  try { if (window.firebase && typeof FIREBASE_CONFIG !== "undefined") db = firebase.initializeApp(FIREBASE_CONFIG, "gic").firestore(); } catch {}

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (data.role === "Judge") delete data.team;
    data.createdAt = new Date().toISOString();
    status.textContent = "Sending…";
    try {
      if (!db) throw new Error("offline");
      await db.collection("innovation_registrations").add(data);
      status.textContent = `✓ Registered as ${data.role.toLowerCase()} for ${COMPETITIONS.find(c => c.slug === data.competition).name}. See you on 27 October!`;
      form.reset(); syncRole();
      !reduce && gsap.fromTo(status, { scale: .8 }, { scale: 1, ease: "elastic.out(1,.4)", duration: 1 });
    } catch {
      status.textContent = "Couldn't send right now — please try again in a moment.";
    }
  });

  // ---------- ambient particle field ----------
  (() => {
    const cv = $("#field"), g = cv.getContext("2d");
    let W, H, pts = [], mx = -999, my = -999;
    const size = () => {
      W = cv.width = innerWidth * devicePixelRatio; H = cv.height = innerHeight * devicePixelRatio;
      cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px";
      const n = Math.min(90, Math.floor(innerWidth / 16));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, z: Math.random() * .8 + .2, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3 }));
    };
    size(); addEventListener("resize", size);
    addEventListener("pointermove", e => { mx = e.clientX * devicePixelRatio; my = e.clientY * devicePixelRatio; });
    const draw = () => {
      g.clearRect(0, 0, W, H);
      const light = root.dataset.theme === "light", sc = lenis ? lenis.scroll : scrollY;
      const link = (light ? "60,60,140," : "120,140,255,");
      for (const p of pts) {
        p.x += p.vx * p.z; p.y += p.vy * p.z;
        if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
        const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
        if (d < 160) { p.x += dx / d * 1.5; p.y += dy / d * 1.5; }
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], ay = (a.y - sc * a.z * .3 * devicePixelRatio) % H, yy = ay < 0 ? ay + H : ay;
        g.fillStyle = `rgba(${link}${.3 + a.z * .5})`;
        g.beginPath(); g.arc(a.x, yy, a.z * 2.2 * devicePixelRatio, 0, 7); g.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j], by0 = (b.y - sc * b.z * .3 * devicePixelRatio) % H, by = by0 < 0 ? by0 + H : by0;
          const d = Math.hypot(a.x - b.x, yy - by);
          if (d < 130 * devicePixelRatio) { g.strokeStyle = `rgba(${link}${(1 - d / (130 * devicePixelRatio)) * .18})`; g.beginPath(); g.moveTo(a.x, yy); g.lineTo(b.x, by); g.stroke(); }
        }
      }
      if (!reduce) requestAnimationFrame(draw);
    };
    draw();
  })();

  route();
})();
