// Visitor journey tracker, ported from the old Framer site. Sends visits, forms and bookings to Supabase (daily visitor email).
(function () {
  if (window.facktJourney || window.facktJourneyDisabled) return;

  var ENDPOINT = "https://iasgepbkdqyhjoxjfkrh.supabase.co/functions/v1/journey";
  var CAL_HOSTS = ["cal.com", "app.cal.com"];
  var SESSION_GAP = 30 * 60 * 1000; // new visit after 30 min idle
  var MAX_PAGES = 60, MAX_EVENTS = 40;

  function now() { return Date.now(); }
  function uid() {
    try { return crypto.randomUUID(); } catch (e) {}
    return now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);
  }
  function load(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function path() { return location.pathname + (location.hash && location.hash.length < 40 ? location.hash : ""); }

  // ---------- visitor + session ----------
  var vid = load("fj_vid");
  if (!vid) { vid = uid(); save("fj_vid", vid); }

  function device() {
    var w = Math.min(screen.width, screen.height), coarse = matchMedia("(pointer:coarse)").matches;
    if (coarse && w < 600) return "Mobile";
    if (coarse) return "Tablet";
    return "Desktop";
  }
  function os() {
    var u = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(u)) return "iOS";
    if (/Android/.test(u)) return "Android";
    if (/Mac OS X/.test(u)) return "macOS";
    if (/Windows/.test(u)) return "Windows";
    if (/Linux/.test(u)) return "Linux";
    return "";
  }
  function externalReferrer() {
    try {
      if (!document.referrer) return null;
      var r = new URL(document.referrer);
      return r.host === location.host ? null : r.origin + r.pathname;
    } catch (e) { return null; }
  }
  function utm() {
    var q = new URLSearchParams(location.search), out = {}, has = false;
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "ref"].forEach(function (k) {
      var v = q.get(k); if (v) { out[k] = v.slice(0, 120); has = true; }
    });
    return has ? out : null;
  }

  var s = load("fj_ses");
  if (!s || now() - s.last > SESSION_GAP) {
    s = {
      id: uid(), started: now(), last: now(),
      ref: externalReferrer(), utm: utm(), landing: path(),
      device: device(), os: os(),
      tz: (Intl.DateTimeFormat().resolvedOptions().timeZone || ""),
      lang: navigator.language || "",
      pages: [], events: []
    };
  }

  // ---------- page tracking ----------
  var cur = null, visibleSince = null;

  function startPage() {
    cur = { p: path(), t: document.title.slice(0, 120), at: now(), d: 0, s: 0 };
    s.pages.push(cur);
    if (s.pages.length > MAX_PAGES) s.pages.shift();
    visibleSince = document.visibilityState === "visible" ? now() : null;
    measureScroll();
    persist();
  }
  function settleTime() {
    if (cur && visibleSince) { cur.d += now() - visibleSince; visibleSince = now(); }
  }
  function measureScroll() {
    if (!cur) return;
    var h = document.documentElement.scrollHeight, v = window.innerHeight;
    var pct = h <= v ? 100 : Math.round(((window.scrollY + v) / h) * 100);
    if (pct > cur.s) cur.s = Math.min(100, pct);
  }
  function persist() { s.last = now(); save("fj_ses", s); }

  function send(payload, urgent) {
    var body = JSON.stringify(payload);
    // text/plain keeps it a "simple" request (no CORS preflight)
    try {
      if (urgent !== true && navigator.sendBeacon &&
          navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "text/plain" }))) return;
    } catch (e) {}
    try { fetch(ENDPOINT, { method: "POST", body: body, keepalive: true, headers: { "Content-Type": "text/plain" } }); } catch (e) {}
  }
  function flush() { settleTime(); persist(); send({ type: "session", vid: vid, session: s }); }

  function onRoute() {
    if (cur && cur.p === path()) return;
    flush();
    startPage();
  }
  ["pushState", "replaceState"].forEach(function (m) {
    var orig = history[m];
    history[m] = function () { var r = orig.apply(this, arguments); setTimeout(onRoute, 0); return r; };
  });
  window.addEventListener("popstate", function () { setTimeout(onRoute, 0); });

  var scrollTick = false;
  window.addEventListener("scroll", function () {
    if (scrollTick) return; scrollTick = true;
    setTimeout(function () { scrollTick = false; measureScroll(); }, 250);
  }, { passive: true });

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") { flush(); visibleSince = null; }
    else { visibleSince = now(); }
  });
  window.addEventListener("pagehide", flush);

  // ---------- notable actions ("Also") ----------
  function track(label) {
    if (!label) return;
    s.events.push({ l: String(label).slice(0, 140), at: now(), p: path() });
    if (s.events.length > MAX_EVENTS) s.events.shift();
    persist();
  }
  function isCal(u) { return CAL_HOSTS.some(function (h) { return u.hostname === h || u.hostname.endsWith("." + h); }); }

  document.addEventListener("click", function (e) {
    var el = e.target.closest && e.target.closest("a, [data-journey]");
    if (!el) return;
    if (el.hasAttribute("data-journey")) { track(el.getAttribute("data-journey")); return; }
    var href = el.getAttribute("href") || "";
    if (href.indexOf("mailto:") === 0) return track("Clicked the email address");
    if (href.indexOf("tel:") === 0) return track("Clicked the phone number");
    try {
      var u = new URL(el.href);
      if (isCal(u)) return track("Opened the booking page");
      if (u.host !== location.host) return track("Opened " + u.hostname.replace(/^www\./, ""));
    } catch (err) {}
  }, true);

  document.addEventListener("play", function (e) {
    var v = e.target;
    if (v && v.tagName === "VIDEO" && !v.autoplay && !v.muted) track("Played a video on " + path());
  }, true);

  // ---------- conversions ----------
  function convert(source, fields) {
    settleTime(); persist();
    send({ type: "conversion", source: source, vid: vid, session: s, fields: fields || {}, page: path() }, true);
  }

  // Any form on the site (Framer forms included)
  document.addEventListener("submit", function (e) {
    var f = e.target, fields = {};
    if (!f || !f.elements) return;
    Array.prototype.forEach.call(f.elements, function (el) {
      if (!el.name || el.type === "password" || el.type === "hidden" || el.type === "submit") return;
      if ((el.type === "checkbox" || el.type === "radio") && !el.checked) return;
      var v = String(el.value || "").trim();
      if (v) fields[el.name.slice(0, 60)] = v.slice(0, 3000);
    });
    track("Submitted a form on " + path());
    convert("form", fields);
  }, true);

  // Cal.com links: tag them with the visitor id so the booking webhook can find this journey
  function tagCalLinks() {
    var links = document.querySelectorAll("a[href*='cal.com']");
    for (var i = 0; i < links.length; i++) {
      try {
        var u = new URL(links[i].href);
        if (!isCal(u) || u.searchParams.get("metadata[fackt_vid]")) continue;
        u.searchParams.set("metadata[fackt_vid]", vid);
        links[i].href = u.toString();
      } catch (e) {}
    }
  }
  var tagTimer = null;
  new MutationObserver(function () {
    clearTimeout(tagTimer); tagTimer = setTimeout(tagCalLinks, 300);
  }).observe(document.documentElement, { childList: true, subtree: true });

  // Cal.com inline/popup embed (if used): report the booking from the browser
  var calHooked = false;
  function hookCal() {
    if (calHooked || typeof window.Cal !== "function") return;
    var api = (window.Cal.ns && window.Cal.ns.fackt) || window.Cal;
    calHooked = true;
    try {
      api("on", {
        action: "bookingSuccessful",
        callback: function (e) {
          var d = (e && e.detail && e.detail.data) || {};
          track("Booked a call");
          convert("booking", {
            event: (d.eventType && d.eventType.title) || "",
            booked_for: d.date || (d.booking && d.booking.startTime) || ""
          });
        }
      });
    } catch (e) { calHooked = false; }
  }
  var calTries = 0, calPoll = setInterval(function () { hookCal(); if (calHooked || ++calTries > 40) clearInterval(calPoll); }, 500);

  // Heartbeat: while the tab is open and visible, report every 30 s so the live view in /admin/stats stays current.
  setInterval(function () { if (document.visibilityState === "visible") flush(); }, 30000);

  // ---------- go ----------
  startPage();
  setTimeout(flush, 1500); // report the visit right away (for the live view), not only when the tab closes
  tagCalLinks();
  window.facktJourney = { track: track, convert: convert, visitorId: vid };
})();
