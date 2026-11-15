/* Coconut Elephant Yoga · showcase mockup by Richmond AI Help. Static, CSP-safe, nothing is sent anywhere. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  /* Demo clock: the schedule below is as listed on Punchpass on Sun Nov 15, 2026 (window shown there: Nov 15 to Dec 4). */
  var TODAY = new Date(2026, 10, 15, 8, 0);
  var WINDOW_END = new Date(2026, 11, 4, 23, 59);
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var PP = "https://coconutelephantyoga.punchpass.com";
  var PASS = PP + "/passes/49413";

  /* ---------- reveal on scroll ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: 0.12 });
    $$(".rise").forEach(function (el) { io.observe(el); });
  } else { $$(".rise").forEach(function (el) { el.classList.add("in"); }); }

  /* ---------- weekly schedule (Punchpass, Nov 15 2026) ---------- */
  var CLASSES = {
    gentle: { name: "Gentle Sensory Yoga", dow: 0, h: 14, m: 0, teacher: "Mary Beth", dur: { studio: 75, online: 75 }, feels: { soft: 2 }, when: "wk",
      desc: "This gentle yoga class, which includes both floor-based postures and standing poses, gives the student a whole body sensory experience… Class ends with an extended guided systematic relaxation. Suitable for all levels, including beginners." },
    mindful: { name: "Mindful Flow with Sound Healing Meditation", dow: 1, h: 17, m: 0, teacher: "Sara/Martha", dur: { studio: 75, online: 60 }, feels: { steady: 1, flow: 2 }, when: "pm",
      desc: "This class aims to keep you engaged with the present moment throughout your posture practice… The class concludes with a 15-minute Healing Sound Meditation. This class is appropriate for all experience levels." },
    slowflow: { name: "Slow Flow Vinyasa", dow: 2, h: 10, m: 0, teacher: "Lily", dur: { studio: 60, online: 60 }, feels: { flow: 2, soft: 1 }, when: "am",
      desc: "Discover a gentler pace than that of a typical vinyasa class… Conclude with a methodical relaxation. This practice is perfect for beginners or those seeking a more relaxed approach." },
    yin: { name: "Yin Yoga", dow: 3, h: 17, m: 0, teacher: "Holly/Mary Beth", dur: { studio: 60, online: 60 }, feels: { soft: 2 }, when: "pm",
      desc: "Yin yoga classes offer a passive practice focused on bodily relaxation and mental tranquility… It’s a meditative, gentle, and reflective practice accessible to various ages and skill levels." },
    hatha: { name: "Hatha Mixed Level", dow: 5, h: 10, m: 0, teacher: "Mary Beth", dur: { studio: 60, online: 60 }, feels: { steady: 2 }, when: "am",
      desc: "Hatha Yoga emphasizes classic poses and alignment within the body… We offer options for all skill levels, allowing you to stay at your current level or advance further." }
  };
  /* Other weekly classes, shown in the owner's week view only */
  var OTHER = [
    { name: "Aroma & Align (studio)", dow: 3, h: 18, m: 30, teacher: "Mariah" },
    { name: "Morning Yoga", dow: 4, h: 9, m: 30, teacher: "Martha" },
    { name: "Flexibility Yoga", dow: 4, h: 17, m: 30, teacher: "Mariah" },
    { name: "Yoga for Flexibility", dow: 6, h: 9, m: 30, teacher: "Mariah" }
  ];
  var key = function (d) { return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); };
  var SKIP = { "2026-11-25": ["yin"], "2026-11-26": ["*"] };
  var NOTE = { "2026-11-15": "Live music during today’s class", "2026-11-27": "Black Friday Flow" };

  function occurrences(c, id, n) {
    var out = [], d = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
    while (d <= WINDOW_END && out.length < n) {
      if (d.getDay() === c.dow) {
        var k = key(d), sk = SKIP[k];
        var at = new Date(d.getFullYear(), d.getMonth(), d.getDate(), c.h, c.m);
        if (sk && (sk.indexOf("*") > -1 || sk.indexOf(id) > -1)) out.push({ at: at, skip: true });
        else if (at >= TODAY) out.push({ at: at, note: id === "gentle" || id === "hatha" ? NOTE[k] : null });
      }
      d.setDate(d.getDate() + 1);
    }
    return out;
  }
  var t12 = function (h, m) { return ((h + 11) % 12 + 1) + ":" + (m < 10 ? "0" : "") + m + " " + (h < 12 ? "am" : "pm"); };
  var durTxt = function (min) { return min >= 60 ? (Math.floor(min / 60) + " hr" + (min % 60 ? " " + (min % 60) + " min" : "")) : min + " min"; };

  /* ---------- finder ---------- */
  var ans = {};
  var pick = null;
  $$(".q").forEach(function (q) {
    $$("button", q).forEach(function (b) {
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () {
        $$("button", q).forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        var first = Object.keys(ans).length < 3;
        ans[q.getAttribute("data-q")] = b.getAttribute("data-v");
        if (ans.feel && ans.when && ans.where) { renderMatch(); if (first && Object.keys(ans).length === 3) setTimeout(function () { $("#match").scrollIntoView({ behavior: "smooth", block: "start" }); }, 120); }
      });
    });
  });

  function rank() {
    return Object.keys(CLASSES).map(function (id) {
      var c = CLASSES[id];
      return { id: id, s: (c.feels[ans.feel] || 0) + (c.when === ans.when ? 1.5 : 0) };
    }).sort(function (a, b) { return b.s - a.s; });
  }

  function renderMatch() {
    var r = rank(), id = r[0].id, c = CLASSES[id], where = ans.where;
    pick = { id: id, c: c, where: where };
    var m = $("#match"); m.hidden = false; m.style.animation = "none"; void m.offsetWidth; m.style.animation = "";
    $("#mName").textContent = c.name;
    $("#mMeta").innerHTML = "<b>" + DAYS[c.dow] + "s · " + t12(c.h, c.m) + "</b> · with " + esc(c.teacher.replace("/", " & ")) + " · " + durTxt(c.dur[where]) + " · " + (where === "studio" ? "in the studio" : "online on Zoom");
    $("#mDesc").textContent = "“" + c.desc + "”";
    var occ = occurrences(c, id, 3);
    pick.occ = occ.filter(function (o) { return !o.skip; });
    $("#mDates").innerHTML = occ.map(function (o, i) {
      var d = o.at, isToday = key(d) === key(TODAY);
      var lab = o.skip ? "Skipped" : (isToday ? "Today" : (i === 0 || !occ.slice(0, i).some(function (x) { return !x.skip; }) ? "Next" : "Then"));
      return '<div class="date' + (!o.skip && d === pick.occ[0].at ? " first" : "") + '"><small>' + lab + "</small><b>" + MON[d.getMonth()] + " " + d.getDate() + "</b><span>" + (o.skip ? "canceled on Punchpass" : (o.note || DAYS[d.getDay()].slice(0, 3) + " · " + t12(c.h, c.m))) + "</span></div>";
    }).join("");
    var alt = CLASSES[r[1].id];
    $("#mAlso").innerHTML = "Also a lovely first class: <b>" + esc(alt.name) + "</b>, " + DAYS[alt.dow] + "s at " + t12(alt.h, alt.m) + " with " + esc(alt.teacher.replace("/", " & ")) + ".";
    $("#prepStudio").hidden = where !== "studio";
    $("#prepOnline").hidden = where !== "online";
    drawCard();
  }

  /* ---------- canvas helpers ---------- */
  function wrap(ctx, text, x, y, maxW, lh) {
    var words = text.split(" "), line = "", lines = 0;
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, y); y += lh; line = words[i]; lines++; }
      else line = test;
    }
    ctx.fillText(line, x, y); return y + lh;
  }
  var fontsReady = (document.fonts && document.fonts.load) ? Promise.all([
    document.fonts.load('500 40px "Cormorant"'), document.fonts.load('italic 400 40px "Cormorant"'), document.fonts.load('400 20px "DM Sans"'), document.fonts.load('600 20px "DM Sans"')
  ]).catch(function () {}) : Promise.resolve();

  function drawCard() {
    (function () {
      var c = pick.c, o = pick.occ[0], online = pick.where === "online";
      $("#fcName").textContent = c.name;
      $("#fcWhen").textContent = (o ? DAYS[o.at.getDay()] + ", " + MON[o.at.getMonth()] + " " + o.at.getDate() + " · " : DAYS[c.dow] + "s · ") + t12(c.h, c.m);
      $("#fcMeta").textContent = "with " + c.teacher.replace("/", " & ") + " · " + durTxt(c.dur[pick.where]) + " · " + (online ? "online on Zoom" : "825 Grove Rd, Suite 12");
      var tips = online ? ["Register at least one hour ahead", "Dim the lights, light a candle, gather blankets", "A belt or scarf works as a strap, big books as blocks"]
        : ["Register at least two hours ahead", "Sign in; phone silent in the locked hallway", "No perfume or fragranced lotion, please"];
      tips.push("Sign your waiver on your phone before class");
      $("#fcTips").innerHTML = tips.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
    })();
    fontsReady.then(function () {
      var cv = $("#cardCanvas"), x = cv.getContext("2d"), W = 1080, H = 1350, c = pick.c, o = pick.occ[0], online = pick.where === "online";
      x.fillStyle = "#f8f4ec"; x.fillRect(0, 0, W, H);
      var g = x.createRadialGradient(W, 0, 40, W, 0, 900); g.addColorStop(0, "rgba(195,155,87,.25)"); g.addColorStop(1, "rgba(195,155,87,0)");
      x.fillStyle = "#2c4a3e"; x.fillRect(0, 0, W, 330); x.fillStyle = g; x.fillRect(0, 0, W, 330);
      x.fillStyle = "#e9c993"; x.font = '600 24px "DM Sans"'; x.fillText("MY FIRST CLASS", 80, 110);
      x.fillStyle = "#f8f4ec"; x.font = '500 50px "Cormorant"'; x.fillText("Coconut Elephant Yoga", 80, 175);
      x.font = 'italic 400 32px "Cormorant"'; x.fillStyle = "rgba(248,244,236,.75)"; x.fillText("the light in us honors the light in you", 80, 222);
      x.fillStyle = "#2c4a3e"; x.font = '500 84px "Cormorant"';
      var big = x.measureText(c.name).width <= 920;
      if (!big) x.font = '500 64px "Cormorant"';
      var y = wrap(x, c.name, 80, big ? 450 : 430, 920, big ? 84 : 66);
      x.fillStyle = "#bf6a62"; x.font = '600 26px "DM Sans"';
      x.fillText((o ? DAYS[o.at.getDay()] + ", " + MON[o.at.getMonth()] + " " + o.at.getDate() + " · " : DAYS[c.dow] + "s · ") + t12(c.h, c.m), 80, y + 10);
      x.fillStyle = "#4d5b54"; x.font = '400 26px "DM Sans"';
      x.fillText("with " + c.teacher.replace("/", " & ") + " · " + durTxt(c.dur[pick.where]) + " · " + (online ? "online on Zoom" : "825 Grove Rd, Suite 12"), 80, y + 56);
      y += 120;
      x.fillStyle = "#fff"; roundRect(x, 80, y, 920, 150, 26); x.fill();
      x.strokeStyle = "rgba(195,155,87,.8)"; x.lineWidth = 2; x.stroke();
      x.fillStyle = "#2c4a3e"; x.font = '400 96px "Cormorant"'; x.fillText("$33", 120, y + 108);
      x.font = '600 26px "DM Sans"'; x.fillText("New Student Special", 300, y + 66);
      x.fillStyle = "#4d5b54"; x.font = '400 23px "DM Sans"'; x.fillText("3 regular classes · $11 each · 60 days from your first", 300, y + 104);
      y += 210;
      var tips = online
        ? ["Register at least one hour ahead", "Dim the lights, light a candle, gather blankets", "A belt or scarf works as a strap, big books as blocks"]
        : ["Register at least two hours ahead", "Sign in; phone silent in the locked hallway", "No perfume or fragranced lotion, please"];
      tips.push("Sign your waiver on your phone before class");
      x.font = '400 27px "DM Sans"';
      tips.forEach(function (t) {
        x.strokeStyle = "#2c4a3e"; x.lineWidth = 2.4; x.beginPath(); x.arc(97, y - 9, 14, 0, Math.PI * 2); x.stroke();
        x.beginPath(); x.moveTo(90, y - 9); x.lineTo(95, y - 3); x.lineTo(104, y - 15); x.stroke();
        x.fillStyle = "#22302a"; x.fillText(t, 130, y); y += 54;
      });
      y += 16; x.strokeStyle = "rgba(34,48,42,.15)"; x.lineWidth = 1.5; x.beginPath(); x.moveTo(80, y); x.lineTo(1000, y); x.stroke();
      y += 48; x.fillStyle = "#6b7a72"; x.font = '600 18px "DM Sans"'; x.fillText("REGISTER & PASSES", 80, y); x.fillText("QUESTIONS", 580, y);
      x.fillStyle = "#22302a"; x.font = '400 22px "DM Sans"'; x.fillText("coconutelephantyoga.punchpass.com", 80, y + 36); x.fillText("coconutelephantyoga@gmail.com", 580, y + 36);
      x.fillStyle = "#2c4a3e"; x.font = 'italic 400 42px "Cormorant"'; x.textAlign = "right"; if (y + 96 <= H - 92) x.fillText("See you on the mat.", 1000, H - 92); x.textAlign = "left";
      x.fillStyle = "rgba(34,48,42,.5)"; x.font = '400 18px "DM Sans"';
      x.fillText("Example mockup by Richmond AI Help · not affiliated with Coconut Elephant Yoga", 80, H - 40);
      var url = cv.toDataURL("image/png");
      $("#cardPng").href = url;
      if (o) $("#cardIcs").href = ics([{ uid: pick.id + "-" + key(o.at), title: c.name + " · Coconut Elephant Yoga", start: o.at, min: c.dur[pick.where], loc: online ? "Online (Zoom link from the studio)" : "825 Grove Road, Suite 12, Midlothian, VA 23114", desc: "Your first class. New Student Special: $33 for three regular classes. Register on Punchpass: " + PP + "/classes" }]);
    });
  }
  function roundRect(x, a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }

  /* ---------- .ics ---------- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function fmt(d) { return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "T" + pad(d.getHours()) + pad(d.getMinutes()) + "00"; }
  function icsEsc(s) { return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n"); }
  function ics(evs) {
    var L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Richmond AI Help//Example mockup//EN", "CALSCALE:GREGORIAN",
      "BEGIN:VTIMEZONE", "TZID:America/New_York", "BEGIN:STANDARD", "DTSTART:20071104T020000", "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU", "TZOFFSETFROM:-0400", "TZOFFSETTO:-0500", "TZNAME:EST", "END:STANDARD",
      "BEGIN:DAYLIGHT", "DTSTART:20070311T020000", "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU", "TZOFFSETFROM:-0500", "TZOFFSETTO:-0400", "TZNAME:EDT", "END:DAYLIGHT", "END:VTIMEZONE"];
    evs.forEach(function (e) {
      var end = new Date(e.start.getTime() + e.min * 60000);
      L.push("BEGIN:VEVENT", "UID:" + e.uid + "@cey-mockup", "DTSTAMP:20261115T130000Z", "DTSTART;TZID=America/New_York:" + fmt(e.start), "DTEND;TZID=America/New_York:" + fmt(end),
        "SUMMARY:" + icsEsc(e.title), "LOCATION:" + icsEsc(e.loc), "DESCRIPTION:" + icsEsc(e.desc), "BEGIN:VALARM", "TRIGGER:-PT3H", "ACTION:DISPLAY", "DESCRIPTION:" + icsEsc(e.title), "END:VALARM", "END:VEVENT");
    });
    L.push("END:VCALENDAR");
    return "data:text/calendar;charset=utf-8," + encodeURIComponent(L.join("\r\n"));
  }

  /* ---------- waiver ---------- */
  var wStep = 0, level = "", hasInk = false, strokes = [];
  var steps = $$(".wv-step"), prog = $$(".ph-prog li");
  $$('[data-pill="level"] button').forEach(function (b) {
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", function () { $$('[data-pill="level"] button').forEach(function (o) { o.setAttribute("aria-pressed", "false"); }); b.setAttribute("aria-pressed", "true"); level = b.textContent; });
  });
  $("#wMinor").addEventListener("change", function () { $("#wGuardWrap").hidden = !this.checked; $("#sigH").textContent = this.checked ? "Parent or guardian, sign here" : "Sign with your finger"; });
  function showW(n) {
    wStep = n; steps.forEach(function (s, i) { s.hidden = i !== n; });
    prog.forEach(function (p, i) { p.classList.toggle("on", i <= n); });
    $$(".err").forEach(function (e) { e.hidden = true; });
    if (n === 2) sizeSig();
  }
  function fail(msg) { var e = $(".err", steps[wStep]); e.textContent = msg; e.hidden = false; }
  var val = function (id) { return $("#" + id).value.trim(); };
  function check() {
    if (wStep === 0) {
      if (val("wName").split(/\s+/).length < 2) return fail("Please add your first and last name."), false;
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val("wEmail"))) return fail("Please add an email so the studio can reach you."), false;
      if (val("wPhone").replace(/\D/g, "").length < 10) return fail("Please add a mobile number."), false;
      if (val("wEmer").length < 3) return fail("Please add an emergency contact."), false;
      if (!level) return fail("Pick the option that best describes your practice."), false;
      if ($("#wMinor").checked && val("wGuard").split(/\s+/).length < 2) return fail("A parent or guardian’s full name is needed for students under 18."), false;
    }
    if (wStep === 1 && !$("#wAgree").checked) return fail("Please check the box to agree before signing."), false;
    if (wStep === 2 && !hasInk) return fail("Add your signature with your finger or mouse."), false;
    return true;
  }
  $$("[data-wnext]").forEach(function (b) { b.addEventListener("click", function () { if (!check()) return; if (wStep === 2) submitWaiver(); else showW(wStep + 1); }); });
  $$("[data-wback]").forEach(function (b) { b.addEventListener("click", function () { showW(wStep - 1); }); });
  $("#wvRestart").addEventListener("click", function () {
    ["wName", "wEmail", "wPhone", "wEmer", "wInj", "wGuard"].forEach(function (id) { $("#" + id).value = ""; });
    $("#wMinor").checked = false; $("#wGuardWrap").hidden = true; $("#wAgree").checked = false; $("#wPhoto").checked = false; level = "";
    $$('[data-pill="level"] button').forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
    clearSig(); showW(0);
  });

  /* signature pad */
  var sig = $("#sig"), sx = sig.getContext("2d"), drawing = false, last = null;
  function sizeSig() { sx.lineCap = "round"; sx.lineJoin = "round"; sx.strokeStyle = "#1f3a2f"; }
  function pt(e) { var r = sig.getBoundingClientRect(); return { x: (e.clientX - r.left) * sig.width / r.width, y: (e.clientY - r.top) * sig.height / r.height, t: Date.now() }; }
  sig.addEventListener("pointerdown", function (e) { e.preventDefault(); sig.setPointerCapture(e.pointerId); drawing = true; last = pt(e); strokes.push([last]); $("#sigHint").style.opacity = "0"; });
  sig.addEventListener("pointermove", function (e) {
    if (!drawing) return; e.preventDefault();
    var p = pt(e), d = Math.hypot(p.x - last.x, p.y - last.y); if (d < 1.2) return;
    var v = d / Math.max(1, p.t - last.t), w = Math.max(1.6, Math.min(4.6, 4.8 - v * 1.6));
    sx.lineWidth = w; sx.beginPath(); sx.moveTo(last.x, last.y);
    var mx = (last.x + p.x) / 2, my = (last.y + p.y) / 2; sx.quadraticCurveTo(last.x, last.y, mx, my); sx.lineTo(p.x, p.y); sx.stroke();
    strokes[strokes.length - 1].push(p); last = p; if (strokes.reduce(function (a, s) { return a + s.length; }, 0) > 12) hasInk = true;
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) { sig.addEventListener(ev, function () { drawing = false; }); });
  function clearSig() { sx.clearRect(0, 0, sig.width, sig.height); hasInk = false; strokes = []; $("#sigHint").style.opacity = "1"; }
  $("#sigClear").addEventListener("click", clearSig);
  var dstr = MON[TODAY.getMonth()] + " " + TODAY.getDate() + ", " + TODAY.getFullYear();
  $("#sigDate").textContent = "Date: " + dstr;

  var signed = null;
  function submitWaiver() {
    var now = new Date(), cls = pick ? pick.c.name : "Gentle Sensory Yoga", when = pick && pick.occ[0] ? DAYS[pick.occ[0].at.getDay()].slice(0, 3) + " " + MON[pick.occ[0].at.getMonth()] + " " + pick.occ[0].at.getDate() + ", " + t12(pick.c.h, pick.c.m) : "Sun Nov 15, 2:00 pm";
    signed = { name: val("wName"), first: val("wName").split(/\s+/)[0], email: val("wEmail"), phone: val("wPhone"), emer: val("wEmer"), inj: val("wInj"), level: level, minor: $("#wMinor").checked, guard: val("wGuard"), photo: $("#wPhoto").checked, cls: cls, when: when, where: pick ? pick.where : "studio", time: now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) };
    $("#doneH").textContent = "You’re all set, " + signed.first + ".";
    $("#doneP").textContent = "Your waiver is signed and saved with the studio. Mary Beth will see it before " + cls + ".";
    $("#doneSum").innerHTML = row("Class", cls + " · " + when) + row("Signed", dstr + (signed.minor ? " by " + signed.guard + " (guardian)" : "")) + row("Experience", level) + (signed.inj ? row("Noted", signed.inj) : "");
    drawWaiverCopy();
    showW(3);
    updateAlert();
    addLiveStudent();
  }
  function row(k, v) { return "<dt>" + esc(k) + "</dt><dd>" + esc(v) + "</dd>"; }

  function drawWaiverCopy() {
    fontsReady.then(function () {
      var cv = $("#wvCanvas"), x = cv.getContext("2d"), W = 900, H = 1200, s = signed;
      x.fillStyle = "#fffdf8"; x.fillRect(0, 0, W, H);
      x.fillStyle = "#2c4a3e"; x.fillRect(0, 0, W, 14);
      x.fillStyle = "#bf6a62"; x.font = '600 18px "DM Sans"'; x.fillText("SIGNED COPY · NEW STUDENT WAIVER", 64, 84);
      x.fillStyle = "#22302a"; x.font = '500 50px "Cormorant"'; x.fillText("Coconut Elephant Yoga", 64, 140);
      var y = 200;
      [["Student", s.name], ["Email", s.email], ["Mobile", s.phone], ["Emergency contact", s.emer], ["Experience", s.level], ["Injuries noted", s.inj || "None listed"], ["First class", s.cls + " · " + s.when], ["Photo consent", s.photo ? "Yes" : "No"]].forEach(function (r) {
        x.fillStyle = "#6b7a72"; x.font = '400 19px "DM Sans"'; x.fillText(r[0], 64, y);
        x.fillStyle = "#22302a"; x.font = '600 21px "DM Sans"'; y = wrap(x, r[1], 300, y, 540, 28) + 14;
      });
      y += 10; x.fillStyle = "#f6e8cf"; roundRect(x, 64, y, 772, 150, 16); x.fill();
      x.fillStyle = "#8a5a21"; x.font = '600 16px "DM Sans"'; x.fillText("EXAMPLE WORDING, NOT THE STUDIO’S WAIVER", 88, y + 36);
      x.fillStyle = "#4d5b54"; x.font = '400 18px "DM Sans"';
      wrap(x, "I am choosing to take part in classes at Coconut Elephant Yoga, will listen to my body, tell my teacher about injuries, and follow the teacher’s guidance. [Studio’s own release language goes here.]", 88, y + 70, 724, 26);
      y += 200;
      x.drawImage(sig, 64, y, 480, 225);
      x.strokeStyle = "rgba(34,48,42,.35)"; x.lineWidth = 1.5; x.beginPath(); x.moveTo(64, y + 175); x.lineTo(560, y + 175); x.stroke();
      x.fillStyle = "#6b7a72"; x.font = '400 18px "DM Sans"';
      x.fillText((s.minor ? "Parent/guardian: " + s.guard : "Signature: " + s.name) + " · " + dstr, 64, y + 205);
      x.fillStyle = "rgba(34,48,42,.5)"; x.font = '400 16px "DM Sans"';
      x.fillText("Example mockup by Richmond AI Help · not affiliated with Coconut Elephant Yoga · nothing was sent", 64, H - 48);
      $("#wvPng").href = cv.toDataURL("image/png");
    });
  }
  function updateAlert() {
    var s = signed;
    $("#alSubj").textContent = "New waiver signed: " + s.name + " · " + s.cls + ", " + s.when;
    $("#alBody").innerHTML = "<p>" + (s.minor ? esc(s.guard) + " (parent or guardian) signed " + esc(s.first) + "’s new-student waiver at " : esc(s.first) + " signed the new-student waiver at ") + esc(s.time) + ". The signed copy is attached.</p><dl>" +
      row("Experience", s.level) + row("Injuries", s.inj || "None listed") + row("Emergency", s.emer) + row("Contact", s.email + " · " + s.phone) +
      (s.minor ? row("Under 18", "Guardian: " + s.guard) : "") + row("Photos OK", s.photo ? "Yes" : "No") + "</dl>";
    var m = $(".mail"); m.classList.remove("fresh"); void m.offsetWidth; m.classList.add("fresh");
  }

  /* ---------- events ---------- */
  var EVENTS = [
    { id: "belly", cat: "move", d: new Date(2026, 10, 19, 18, 45), min: 75, title: "Thankful Body: A Belly Dance Workshop", who: "Sirona Luna", time: "6:45–8:00 pm", price: "$32", img: "img/belly-dance.jpg", alt: "Students belly dancing in the studio", credit: "Photo: coconutelephantyoga.com", desc: "Celebrate the beauty, strength, and wisdom of your body through the joy of belly dance. All levels are welcome.", url: PP + "/classes/21199371" },
    { id: "intuitive", cat: "energy", d: new Date(2026, 10, 21, 18, 30), min: 90, title: "Intuitive Circle", who: "Melissa", time: "6:30–8:00 pm", price: "$27", img: "img/intuitive-circle.jpg", pos: "top", alt: "Melissa, who leads the Intuitive Circle", credit: "Photo: coconutelephantyoga.com", desc: "An uplifting, in-person experience where you’ll actively expand your intuitive abilities in a safe, welcoming, and supportive environment.", url: PP + "/classes/21199488" },
    { id: "blackfriday", cat: "move", d: new Date(2026, 10, 27, 10, 0), min: 60, title: "Black Friday Flow", who: "Mary Beth · Hatha Mixed Level", time: "10:00–11:00 am", price: "Regular class", img: "img/ev-mb.jpg", pos: "top", alt: "Mary Beth, who teaches the Friday Hatha class", credit: "Photo: coconutelephantyoga.com", desc: "The usual Friday Hatha Mixed Level class, in the studio and online.", url: PP + "/classes" },
    { id: "reiki", cat: "energy", d: new Date(2026, 11, 4, 18, 30), min: 90, title: "Reiki Circle: Energetic Cleansing", who: "Jennifer & Holly", time: "6:30–8:00 pm", price: "$15–$50", priceNote: "donation", img: "img/ev-holly.jpg", alt: "Holly, who co-leads the Reiki Circle", credit: "Photo: coconutelephantyoga.com", desc: "Smoke, sound, intention, visualization and more. For seasoned practitioners and people new to Reiki alike.", url: PP + "/classes/21199122" },
    { id: "holiday", cat: "still", d: new Date(2026, 11, 12, 14, 0), min: 120, title: "Holiday Serenity: A Mind-Body Experience", who: "Mary Beth & Lorrie", time: "2:00–4:00 pm", price: "$12", img: "img/sound-bowls.jpg", alt: "Mary Beth with crystal singing bowls", credit: "Photo: coconutelephantyoga.com", desc: "Gentle dancing, free movement while Mary Beth plays crystal bowls and chimes, then a guided meditation. All levels, no dance experience needed.", url: PP + "/classes/21199116" },
    { id: "embrace", past: true, cat: "still", d: new Date(2026, 10, 14, 18, 0), min: 90, title: "Embrace Autumn: Yoga Nidra & Sound Journey", who: "Holly", time: "6:00–7:30 pm", price: "$28", img: "img/yoga-nidra.jpg", alt: "Event image for Embrace Autumn", credit: "Image: coconutelephantyoga.com", desc: "As the leaves change and nature begins to release what it no longer needs, we are invited to do the same.", url: PP + "/classes/21110830" }
  ];
  var CATS = [["all", "Everything"], ["move", "Movement & dance"], ["still", "Sound & stillness"], ["energy", "Intuition & energy"]];
  var strip = $("#strip");
  strip.innerHTML = CATS.map(function (c, i) { return '<button type="button" role="tab" aria-selected="' + (i === 0) + '" data-cat="' + c[0] + '">' + c[1] + "</button>"; }).join("");
  function renderEvents(cat) {
    $("#evgrid").innerHTML = EVENTS.filter(function (e) { return cat === "all" || e.cat === cat; }).map(function (e, i) {
      var media = e.img
        ? '<img src="' + e.img + '"' + (e.pos ? ' class="pos-top"' : "") + ' alt="' + esc(e.alt) + '" loading="lazy"><span class="ev-credit">' + esc(e.credit) + "</span>"
        : '<p>' + esc(e.typeText) + "</p>";
      var icsHref = ics([{ uid: e.id, title: e.title + " · Coconut Elephant Yoga", start: e.d, min: e.min, loc: "825 Grove Road, Suite 12, Midlothian, VA 23114", desc: e.desc + " Details and tickets: " + e.url }]);
      return '<article class="ev' + (e.past ? " past" : "") + '">' +
        '<div class="ev-media' + (e.img ? "" : " type " + e.type) + '"><div class="ev-date"><small>' + MON[e.d.getMonth()].toUpperCase() + "</small><b>" + e.d.getDate() + "</b></div>" + media + "</div>" +
        '<div class="ev-body"><p class="ev-k">' + (e.past ? "Took place " + DAYS[e.d.getDay()] + ", Nov 14" : DAYS[e.d.getDay()] + " · " + e.time) + "</p><h3>" + esc(e.title) + '</h3><p class="ev-meta">with ' + esc(e.who) + "</p>" +
        '<p class="ev-desc">' + esc(e.desc) + "</p>" +
        '<div class="ev-acts"><span class="ev-price">' + esc(e.price) + (e.priceNote ? ' <small class="ev-meta">' + e.priceNote + "</small>" : "") + "</span>" +
        (e.past ? '<a class="btn quiet" href="' + e.url + '" target="_blank" rel="noopener">See the event page</a>' : '<a class="btn quiet" href="' + icsHref + '" download="' + e.id + '.ics">Add to calendar</a><a class="btn primary" href="' + e.url + '" target="_blank" rel="noopener">Details on Punchpass</a>') +
        "</div></div></article>";
    }).join("");
  }
  strip.addEventListener("click", function (ev) {
    var b = ev.target.closest("button"); if (!b) return;
    $$("button", strip).forEach(function (o) { o.setAttribute("aria-selected", String(o === b)); });
    renderEvents(b.getAttribute("data-cat"));
  });
  renderEvents("all");

  /* ---------- owner view ---------- */
  var STUDENTS = [
    { name: "Dana R.", ini: "DR", color: "a", cls: "Gentle Sensory Yoga · 2:00 pm · studio", ok: true, at: "7:42 am", notes: ["I am scared of yoga", "Lower back gets stiff"], flag: 1,
      draft: "Hi Dana, it’s Mary Beth from Coconut Elephant Yoga. I’m so glad you’re coming to Gentle Sensory Yoga at 2:00 today. It’s slow and all-levels, and there’s live music today too. Thanks for telling me about your lower back; I’ll show you options so you can rest whenever you like. When you arrive, sign in and leave your phone on silent in the locked hallway. See you soon!" },
    { name: "Priya S.", ini: "PS", color: "b", cls: "Gentle Sensory Yoga · 2:00 pm · online", ok: true, at: "9:05 am", notes: ["Beginner", "No injuries listed"],
      draft: "Hi Priya, it’s Mary Beth. Welcome! I’ll see you on Zoom for Gentle Sensory Yoga at 2:00 today. If you like, dim the lights and gather a couple of blankets and pillows; a scarf or sock makes a lovely eye pillow. If Zoom acts up, logging out and back in usually fixes it." },
    { name: "Ellie K. (16)", ini: "EK", color: "c", cls: "Gentle Sensory Yoga · 2:00 pm · studio", ok: true, at: "Sat 6:18 pm", notes: ["Guardian signed: Tom K.", "Intermediate"],
      draft: "Hi Tom, it’s Mary Beth. Thank you for signing Ellie’s waiver; we have everything we need. Teens 16 and up are welcome on their own, so Ellie is all set for Gentle Sensory Yoga today at 2:00. We’re looking forward to meeting her!" },
    { name: "Morgan L.", ini: "ML", color: "d", cls: "Gentle Sensory Yoga · 2:00 pm · studio", ok: false, notes: ["Registered on Punchpass", "Waiver not signed yet"], flag: 1,
      draft: "Hi Morgan, it’s Mary Beth. We’re excited to see you at Gentle Sensory Yoga today at 2:00! Before class, could you sign our quick new-student waiver on your phone? It takes about a minute: [waiver link]. See you on the mat." }
  ];
  function stuCard(s, isNew) {
    return '<div class="stu' + (isNew ? " new" : "") + '"><div class="stu-top"><span class="av av-' + s.color + '">' + esc(s.ini) + '</span><div><p class="stu-n">' + esc(s.name) + '</p><p class="stu-m">' + esc(s.cls) + "</p></div>" +
      '<span class="wvs ' + (s.ok ? "ok" : "no") + '">' + (s.ok ? "Waiver ✓ " + esc(s.at) : "No waiver yet") + "</span></div>" +
      '<div class="stu-notes">' + s.notes.map(function (n, i) { return '<span class="' + (s.flag && i === 1 ? "flag" : "") + '">' + esc(n) + "</span>"; }).join("") + "</div>" +
      '<p class="draft-l">' + (s.ok ? "Drafted welcome text" : "Drafted reminder text") + '</p><p class="draft">' + esc(s.draft) + '</p><button type="button" class="copy" data-copy>Copy text</button></div>';
  }
  var live = null;
  function renderStudents() { $("#stuList").innerHTML = (live ? stuCard(live, true) : "") + STUDENTS.map(function (s) { return stuCard(s); }).join(""); }
  function addLiveStudent() {
    var s = signed, parts = s.name.split(/\s+/);
    live = { name: s.name + " (you, just now)", ini: (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase(), color: "e", cls: s.cls + " · " + s.when.replace(/^.*?, /, "") + " · " + s.where, ok: true, at: s.time,
      notes: [s.level, s.inj ? "Noted: " + s.inj : "No injuries listed"].concat(s.minor ? ["Guardian: " + s.guard] : []), flag: s.inj ? 1 : 0,
      draft: "Hi " + s.first + ", it’s Mary Beth from Coconut Elephant Yoga. Thank you for signing your waiver; you’re all set for " + s.cls + " (" + s.when + "). " +
        (s.where === "online" ? "I’ll see you on Zoom. Dim the lights and gather a blanket or two if you like." : "When you arrive, sign in and leave your phone on silent in the locked hallway.") +
        (s.inj ? " Thanks for letting me know about " + s.inj.replace(/\.$/, "") + "; I’ll offer options." : "") + " So glad you’re joining us!" };
    renderStudents();
    $("#ownerOpen").classList.add("has-new");
  }
  renderStudents();
  $("#stuList").addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-copy]"); if (!b) return;
    var t = b.previousElementSibling.textContent;
    var done = function () { b.textContent = "Copied"; b.classList.add("ok"); setTimeout(function () { b.textContent = "Copy text"; b.classList.remove("ok"); }, 1600); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(t).then(done, function () { fallbackCopy(t); done(); });
    else { fallbackCopy(t); done(); }
  });
  function fallbackCopy(t) { var a = document.createElement("textarea"); a.value = t; a.setAttribute("readonly", ""); a.style.position = "fixed"; a.style.opacity = "0"; document.body.appendChild(a); a.select(); try { document.execCommand("copy"); } catch (e) {} a.remove(); }

  /* week list */
  (function () {
    var items = [], d = new Date(2026, 10, 15), end = new Date(2026, 10, 21, 23, 59);
    for (; d <= end; d.setDate(d.getDate() + 1)) {
      Object.keys(CLASSES).forEach(function (id) { var c = CLASSES[id]; if (c.dow === d.getDay()) items.push({ at: new Date(d.getFullYear(), d.getMonth(), d.getDate(), c.h, c.m), n: c.name, w: c.teacher + " · studio & online" }); });
      OTHER.forEach(function (c) { if (c.dow === d.getDay()) items.push({ at: new Date(d.getFullYear(), d.getMonth(), d.getDate(), c.h, c.m), n: c.name, w: c.teacher }); });
    }
    EVENTS.forEach(function (e) { if (!e.past && e.d <= end && e.cat !== "x" && e.id !== "blackfriday") items.push({ at: e.d, n: e.title, w: e.who + " · " + e.price, evt: true }); });
    items.sort(function (a, b) { return a.at - b.at; });
    $("#wkList").innerHTML = items.map(function (i) { return '<li class="' + (i.evt ? "evt" : "") + '"><span class="d">' + DAYS[i.at.getDay()].slice(0, 3) + " " + i.at.getDate() + "<br>" + t12(i.at.getHours(), i.at.getMinutes()) + '</span><p class="c">' + esc(i.n) + "<small>" + esc(i.w) + (i.evt ? " · event" : "") + "</small></p></li>"; }).join("");
  })();

  var owner = $("#owner"), lastFocus = null;
  function openOwner() { lastFocus = document.activeElement; owner.hidden = false; document.body.style.overflow = "hidden"; $("#ownerClose").focus(); }
  function closeOwner() { owner.hidden = true; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
  $("#ownerOpen").addEventListener("click", openOwner);
  $("#ownerClose").addEventListener("click", closeOwner);
  owner.addEventListener("click", function (e) { if (e.target === owner) closeOwner(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !owner.hidden) closeOwner(); });
  $$(".ow-tabs button").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".ow-tabs button").forEach(function (o) { o.setAttribute("aria-selected", String(o === b)); });
      $$("[data-pane]").forEach(function (p) { p.hidden = p.getAttribute("data-pane") !== b.getAttribute("data-tab"); });
      $(".ow-body").scrollTop = 0;
    });
  });
  if (location.hash === "#owner") openOwner();
})();
/* "Open studio owner view" callout button opens the same panel as the header button. */
document.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("[data-open-owner]"); if (b) { var o = document.getElementById("ownerOpen"); if (o) o.click(); } });
