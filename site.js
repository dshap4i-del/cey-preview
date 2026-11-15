/* Coconut Elephant Yoga example site. Nothing is sent or stored anywhere. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* menu */
  var mb = $(".menu-btn"), nav = $("#hnav");
  if (mb) mb.addEventListener("click", function () { var o = !nav.classList.contains("open"); nav.classList.toggle("open", o); mb.setAttribute("aria-expanded", String(o)); });

  /* reveal */
  function reveal() {
    var els = $$(".rise:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }); }, { threshold: .06 });
    els.forEach(function (el) { io.observe(el); });
  }
  reveal();
  if (/[?&]static=1/.test(location.search)) $$(".rise").forEach(function (el) { el.classList.add("in"); });

  /* ---------- schedule ---------- */
  var S = window.SCHED;
  if (S && $("#list")) {
    var f = { day: "all", x: "all" };
    var names = function (c) { return c.who.map(function (w) { return w.n; }).join(" & "); };
    var faces = function (c) { return c.who.length > 1 ? '<span class="ph duo">' + c.who.map(function (w) { return '<img src="' + w.img + '" alt="">'; }).join("") + "</span>" : '<span class="ph"><img src="' + c.who[0].img + '" alt=""></span>'; };
    var chips = function (c) { return (c.studio ? '<span class="chip">In studio</span>' : "") + (c.online ? '<span class="chip">Online</span>' : "") + (c.beg ? '<span class="chip on">Beginner friendly</span>' : ""); };
    var key = function (c) { return c.id + "-" + c.day.toLowerCase(); };
    function match(c) {
      if (f.day !== "all" && c.day !== f.day) return false;
      if (f.x === "beg") return c.beg;
      if (f.x === "studio") return !!c.studio;
      if (f.x === "online") return !!c.online;
      if (f.x !== "all") return c.feel === f.x;
      return true;
    }
    function render() {
      var h = "", last = "";
      S.filter(match).forEach(function (c) {
        if (c.day !== last) { h += '<p class="dayh">' + c.full + "<small>" + c.date + "</small></p>"; last = c.day; }
        h += '<button type="button" class="crow" data-k="' + key(c) + '"><span class="t">' + c.t + "<small>" + esc(c.len.split(" · ")[0]) + "</small></span>" + faces(c) + "<span><h3>" + esc(c.n) + '</h3><p class="m">with ' + esc(names(c)) + " · " + esc(c.short) + '</p><span class="chips">' + chips(c) + '</span></span><span class="go">Details</span></button>';
      });
      $("#list").innerHTML = h || '<p class="empty">No classes match. Try another day or style.</p>';
    }
    $$("#filters .frow").forEach(function (row) {
      row.addEventListener("click", function (ev) {
        var b = ev.target.closest("button"); if (!b) return;
        f[row.getAttribute("data-f")] = b.getAttribute("data-v");
        $$("button", row).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        render();
      });
    });
    render();

    /* sheet */
    var sheet = $("#sheet"), inner = $("#sheetIn"), lastFocus = null;
    function open(k) {
      var c = S.filter(function (x) { return key(x) === k; })[0]; if (!c) return;
      lastFocus = document.activeElement;
      var bring = c.studio ? "<li>Book at least 2 hours ahead. You can cancel up to 2 hours before class.</li><li>When you arrive, sign in. Phones on silent in the locked hallway.</li><li>Please skip perfume and scented lotion.</li>" : "";
      var home = c.online ? "<li>Joining online? Book at least 1 hour ahead and gather blankets, pillows and a strap (a belt or scarf works).</li>" : "";
      inner.innerHTML = '<button type="button" class="x" aria-label="Close">×</button><p class="when">' + c.full + ", " + c.date + " · " + c.t + " · " + esc(c.len) + '</p><h2 id="shH">' + esc(c.n) + '</h2><span class="chips">' + chips(c) + '<span class="chip gold">' + esc(c.lvl) + "</span></span>" +
        '<div class="desc">' + c.desc.map(function (p) { return "<p style=\"margin-bottom:10px\">" + esc(p) + "</p>"; }).join("") + "</div>" +
        "<h4>Your teacher" + (c.who.length > 1 ? "s" : "") + "</h4>" + c.who.map(function (w) { return '<div class="tmini"><img src="' + w.img + '" alt=""><div><b>' + esc(w.n) + "</b><p>" + esc(w.bio) + "</p></div></div>"; }).join("") +
        "<h4>Good to know</h4><ul>" + bring + home + "<li>New to the studio? Sign your <a href=\"waiver.html\">waiver</a> before class.</li></ul>" +
        '<div class="acts">' + (c.studio ? '<a class="btn primary" href="' + c.studio + '" target="_blank" rel="noopener">Book in studio</a>' : "") + (c.online ? '<a class="btn ' + (c.studio ? "quiet" : "primary") + '" href="' + c.online + '" target="_blank" rel="noopener">Book online</a>' : "") + "</div>" +
        '<p class="note" style="text-align:center">Booking opens on Punchpass. First time? <a href="passes.html#new">3 classes for $33</a></p>';
      sheet.hidden = false; document.body.classList.add("lock");
      $(".x", inner).focus();
      if (history.replaceState) history.replaceState(null, "", "#" + k);
    }
    function close() { sheet.hidden = true; document.body.classList.remove("lock"); if (history.replaceState) history.replaceState(null, "", location.pathname + location.search); if (lastFocus) lastFocus.focus(); }
    document.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-k]"); if (b) { open(b.getAttribute("data-k")); return; }
      if (ev.target === sheet || ev.target.closest(".sheet .x")) close();
    });
    document.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && !sheet.hidden) close(); });
    if (location.hash.length > 1 && location.hash !== "#finder") open(location.hash.slice(1));
    window.cey = { open: open };

    /* finder */
    var ans = {};
    $$(".finder .fq").forEach(function (q) {
      q.addEventListener("click", function (ev) {
        var b = ev.target.closest("button"); if (!b) return;
        ans[q.getAttribute("data-q")] = b.getAttribute("data-v");
        $$("button", q).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        suggest();
      });
    });
    function slot(c) { return (c.day === "Sat" || c.day === "Sun") ? "wk" : (c.h < 12 ? "am" : "pm"); }
    function suggest() {
      if (!ans.feel || !ans.when || !ans.where) return;
      var best = null, bs = -1;
      S.forEach(function (c) {
        var s = 0;
        if (c.feel === ans.feel) s += 3;
        if (slot(c) === ans.when) s += 2;
        if (ans.where === "studio" ? c.studio : c.online) s += 2; else s -= 5;
        if (c.beg) s += 1;
        if (s > bs) { bs = s; best = c; }
      });
      var c = best, r = $("#fres");
      r.innerHTML = '<img src="' + c.who[0].img + '" alt=""><div><p class="eyebrow" style="margin-bottom:6px">We think you’ll love</p><h3>' + esc(c.n) + '</h3><p class="m">' + c.full + " " + c.t + " · with " + esc(names(c)) + " · " + esc(c.short) + '</p></div><div class="acts"><button type="button" class="btn primary sm" data-k="' + key(c) + '">See class details</button><a class="btn quiet sm" href="passes.html#new">3 classes for $33</a></div>';
      r.hidden = false;
    }
  }

  /* ---------- events: add to calendar ---------- */
  if (window.EVENTS) {
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var stamp = function (d) { return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "T" + pad(d.getHours()) + pad(d.getMinutes()) + "00"; };
    $$("[data-ics]").forEach(function (a) {
      var e = window.EVENTS.filter(function (x) { return x.id === a.getAttribute("data-ics"); })[0];
      var s = new Date(e.d[0], e.d[1] - 1, e.d[2], e.d[3], e.d[4]), f = new Date(s.getTime() + e.min * 60000);
      var body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Coconut Elephant Yoga example//EN", "BEGIN:VEVENT", "UID:" + e.id + "-2026@cey-example", "DTSTAMP:20261115T120000", "DTSTART;TZID=America/New_York:" + stamp(s), "DTEND;TZID=America/New_York:" + stamp(f), "SUMMARY:" + e.title + " · " + e.sub + " (Coconut Elephant Yoga)", "LOCATION:825 Grove Road\\, Suite 12\\, Midlothian\\, VA 23114", "DESCRIPTION:With " + e.who + ". Tickets: " + e.url, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
      a.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(body);
      a.setAttribute("download", e.id + "-coconut-elephant-yoga.ics");
    });
  }

  /* ---------- waiver ---------- */
  var form = $("#wvf");
  if (form) {
    var cv = $("#sig"), ctx = cv.getContext("2d"), drawing = false, inked = false, dpr = Math.max(1, window.devicePixelRatio || 1);
    function size() { var r = cv.getBoundingClientRect(); var img = inked ? cv.toDataURL() : null; cv.width = r.width * dpr; cv.height = r.height * dpr; ctx.scale(dpr, dpr); ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#1d2a24"; if (img) { var i = new Image(); i.onload = function () { ctx.drawImage(i, 0, 0, r.width, r.height); }; i.src = img; } }
    size(); window.addEventListener("resize", size);
    var pt = function (e) { var r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    cv.addEventListener("pointerdown", function (e) { drawing = true; cv.setPointerCapture(e.pointerId); var p = pt(e); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] + .1, p[1] + .1); ctx.stroke(); inked = true; $("#sigHint").hidden = true; });
    cv.addEventListener("pointermove", function (e) { if (!drawing) return; var p = pt(e); ctx.lineTo(p[0], p[1]); ctx.stroke(); });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (t) { cv.addEventListener(t, function () { drawing = false; }); });
    $("#sigClear").addEventListener("click", function () { ctx.clearRect(0, 0, cv.width, cv.height); inked = false; $("#sigHint").hidden = false; });
    var today = new Date(); $("#sigDate").textContent = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    $("#wMinor").addEventListener("change", function () { $("#wGuardWrap").hidden = !this.checked; $("#sigLab").textContent = this.checked ? "Parent or guardian, type your full name" : "Type your full name"; });
    window.ceyDemoSign = function () { var r = cv.getBoundingClientRect(); ctx.beginPath(); ctx.moveTo(20, r.height * .62); for (var x = 20; x < r.width * .6; x += 6) ctx.lineTo(x, r.height * .55 + Math.sin(x / 11) * 16 + Math.cos(x / 29) * 8); ctx.stroke(); inked = true; $("#sigHint").hidden = true; };
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var bad = [];
      $$(".fld[data-req]", form).forEach(function (l) { var i = $("input", l); var hid = l.hidden; var ok = hid || (i.value.trim() && (i.type !== "email" || /.+@.+\..+/.test(i.value))); l.classList.toggle("bad", !ok); if (!ok) bad.push(i); });
      var msg = "";
      if (bad.length) msg = "Please fill in the highlighted fields.";
      else if (!$("#wAgree").checked) msg = "Please agree to the waiver.";
      else if (!inked) msg = "Please add your signature.";
      var err = $("#wErr"); err.hidden = !msg; err.textContent = msg;
      if (msg) { (bad[0] || err).focus && (bad[0] || err).scrollIntoView({ block: "center", behavior: "smooth" }); return; }
      var lv = $("input[name=lvl]:checked", form);
      var nm = $("#wName").value.trim();
      var rows = [["Name", nm], ["Email", $("#wEmail").value.trim()], ["Mobile", $("#wPhone").value.trim()], ["Emergency contact", $("#wEmer").value.trim()], ["Experience", lv ? lv.value : "Not given"], ["Injuries", $("#wInj").value.trim() || "None listed"]];
      if ($("#wMinor").checked) rows.push(["Guardian", $("#wGuard").value.trim()]);
      rows.push(["Signed", $("#wTyped").value.trim() + ", " + $("#sigDate").textContent]);
      $("#doneSum").innerHTML = rows.map(function (r) { return "<dt>" + r[0] + "</dt><dd>" + esc(r[1]) + "</dd>"; }).join("") + '<dt>Signature</dt><dd><img src="' + cv.toDataURL() + '" alt="Your signature"></dd>';
      $("#doneP").textContent = "Thank you, " + nm.split(" ")[0] + ". See you on the mat.";
      form.hidden = true; $("#wDone").hidden = false; $("#wDone").focus(); $("#wform").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    $("#wAgain").addEventListener("click", function () { form.reset(); $("#sigClear").click(); $("#wGuardWrap").hidden = true; $("#wDone").hidden = true; form.hidden = false; });
  }
})();
