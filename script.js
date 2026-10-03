// Stellite Works — interactions
(() => {
  const root = document.documentElement;
  root.classList.remove("no-js");

  // Set FORM_ENDPOINT to a form service URL (e.g. Formspree) to submit in-page.
  // Left empty, the form opens the visitor's email client with the details filled in.
  const FORM_ENDPOINT = "";
  const CONTACT_EMAIL = "info@stelliteworks.com";

  /* Nav: shadow on scroll + mobile menu */
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setMenu = (open) => {
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
  };
  toggle.addEventListener("click", () => setMenu(!links.classList.contains("is-open")));
  links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
        el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 80}ms`;
        el.classList.add("is-in");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* Hiring model tabs */
  const tabs = [...document.querySelectorAll(".tab")];
  const activate = (tab) => {
    tabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", String(active));
      t.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", (e) => {
      const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!dir) return;
      const next = tabs[(i + dir + tabs.length) % tabs.length];
      activate(next);
      next.focus();
    });
  });

  /* Footprint constellation map — coordinates are a simple lon/lat projection */
  const cities = [
    ["Seattle", 47.6, -122.3], ["San Francisco", 37.8, -122.4], ["Los Angeles", 34.0, -118.2],
    ["Phoenix", 33.4, -112.0], ["Denver", 39.7, -105.0], ["Dallas", 32.8, -96.8],
    ["Houston", 29.8, -95.4], ["Minneapolis", 45.0, -93.3], ["Chicago", 41.9, -87.6],
    ["Detroit", 42.3, -83.0], ["Atlanta", 33.7, -84.4], ["Charlotte", 35.2, -80.8],
    ["New York", 40.7, -74.0], ["Boston", 42.4, -71.1], ["Miami", 25.8, -80.2],
  ];
  const links_ = [
    [0, 1], [1, 2], [2, 3], [3, 4], [0, 4], [4, 7], [4, 5], [3, 5], [5, 6], [7, 8],
    [8, 9], [5, 10], [6, 10], [8, 10], [10, 11], [9, 12], [11, 12], [12, 13], [10, 14], [11, 14],
  ];
  const project = ([, lat, lon]) => [((lon + 125) / 58) * 1000, 30 + ((50 - lat) / 25) * 520];
  const svg = document.querySelector(".map__svg");
  if (svg) {
    const ns = "http://www.w3.org/2000/svg";
    const linesG = svg.querySelector(".map__lines");
    const dotsG = svg.querySelector(".map__dots");
    const pts = cities.map(project);

    links_.forEach(([a, b]) => {
      const l = document.createElementNS(ns, "line");
      l.setAttribute("x1", pts[a][0]); l.setAttribute("y1", pts[a][1]);
      l.setAttribute("x2", pts[b][0]); l.setAttribute("y2", pts[b][1]);
      linesG.appendChild(l);
    });

    pts.forEach(([x, y], i) => {
      const halo = document.createElementNS(ns, "circle");
      halo.setAttribute("class", "map__halo");
      halo.setAttribute("cx", x); halo.setAttribute("cy", y); halo.setAttribute("r", 22);
      halo.style.animationDelay = `${(i % 5) * -0.6}s`;
      const dot = document.createElementNS(ns, "circle");
      dot.setAttribute("class", "map__dot");
      dot.setAttribute("cx", x); dot.setAttribute("cy", y); dot.setAttribute("r", 4.5);
      const label = document.createElementNS(ns, "text");
      label.setAttribute("class", "map__label");
      label.setAttribute("x", x + 10); label.setAttribute("y", y - 10);
      label.textContent = cities[i][0];
      dotsG.append(halo, dot, label);
    });

    const list = document.getElementById("cityList");
    cities.forEach(([name]) => {
      const li = document.createElement("li");
      li.textContent = name;
      list.appendChild(li);
    });
  }

  /* Contact form */
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  const companyField = form.querySelector('[data-for="client"]');

  const syncType = () => {
    const type = form.elements.type.value;
    companyField.classList.toggle("is-hidden", type !== "client");
    form.querySelector('[type="submit"]').textContent =
      type === "client" ? "Send hiring request" : "Join our talent network";
  };
  form.addEventListener("change", (e) => { if (e.target.name === "type") syncType(); });
  syncType();

  document.querySelectorAll('[data-intent="candidate"]').forEach((a) =>
    a.addEventListener("click", () => {
      form.elements.type.value = "candidate";
      syncType();
    })
  );

  const setNote = (msg, cls) => { note.textContent = msg; note.className = `form__note ${cls || ""}`; };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let valid = true;
    ["name", "email"].forEach((n) => {
      const input = form.elements[n];
      const ok = input.value.trim() && input.checkValidity();
      input.closest(".field").classList.toggle("is-invalid", !ok);
      if (!ok) valid = false;
    });
    if (!valid) { setNote("Please add your name and a valid email.", "is-err"); return; }

    const data = Object.fromEntries(new FormData(form));

    if (FORM_ENDPOINT) {
      setNote("Sending…");
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(res.statusText);
        form.reset(); syncType();
        setNote("Thanks — we'll be in touch within one business day.", "is-ok");
      } catch {
        setNote(`Something went wrong. Please email us at ${CONTACT_EMAIL}.`, "is-err");
      }
      return;
    }

    const subject = data.type === "client"
      ? `Hiring request: ${data.module || "SAP role"} (${data.engagement})`
      : `Consultant profile: ${data.module || "SAP"}`;
    const body = [
      `Name: ${data.name}`, `Email: ${data.email}`,
      data.company ? `Company: ${data.company}` : "",
      `SAP module / skill: ${data.module || "-"}`, `Engagement: ${data.engagement}`, "", data.message || "",
    ].filter((l, i) => l !== "" || i > 4).join("\n");
    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setNote("Opening your email app…", "is-ok");
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
