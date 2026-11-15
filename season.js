/* Idea 3 · seasonal guide. Event data from Punchpass, read Nov 15, 2026. Nothing is sent anywhere. */
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var PP = "https://coconutelephantyoga.punchpass.com";
  var MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var ADDR = "825 Grove Road, Suite 12, Midlothian, VA 23114";
  var EV = [
    { id: "belly", d: [2026, 10, 19, 18, 45], min: 75, day: "Thursday", t: "6:45–8:00 pm", title: "Thankful Body", sub: "A Belly Dance Workshop", who: "Sirona Luna", price: "$32", img: "img/belly-dance.jpg", cap: "Photo: the studio’s event image",
      q: ["Celebrate the beauty, strength, and wisdom of your body through the joy of belly dance.", "All levels are welcome: come as you are, move as you feel, and leave feeling more connected, confident, and grateful."], url: PP + "/classes/21199371", cta: "Get a ticket" },
    { id: "intuitive", d: [2026, 10, 21, 18, 30], min: 90, day: "Saturday", t: "6:30–8:00 pm", title: "Intuitive Circle", sub: "with the Richmond Intuitive Circle", who: "Melissa", price: "$27", img: "img/intuitive-circle.jpg", pos: "50% 18%", cap: "Photo: Melissa, from the studio’s event image",
      q: ["An uplifting, in-person experience where you’ll actively expand your intuitive abilities in a safe, welcoming, and supportive environment."], url: PP + "/classes/21199488", cta: "Get a ticket" },
    { id: "blackfriday", d: [2026, 10, 27, 10, 0], min: 60, day: "Friday", t: "10:00–11:00 am", title: "Black Friday Flow", sub: "Hatha Mixed Level, studio & online", who: "Mary Beth", price: "Regular class", quiet: true,
      q: ["Take a break from the Black Friday rush!"], url: PP + "/classes", cta: "Book on Punchpass" },
    { id: "reiki", d: [2026, 11, 4, 18, 30], min: 90, day: "Friday", t: "6:30–8:00 pm", title: "Reiki Circle", sub: "Energetic Cleansing", who: "Jennifer & Holly", price: "$15–$50", pnote: "donation",
      q: ["This month’s Reiki Circle will explore different methods of energetic cleansing, including smoke, sound, intention, visualization, and more!", "Whether you’re a seasoned practitioner or new to Reiki, come connect, learn, and explore with us!"], url: PP + "/classes/21199122", cta: "Reserve a spot" },
    { id: "holiday", d: [2026, 11, 12, 14, 0], min: 120, day: "Saturday", t: "2:00–4:00 pm", title: "Holiday Serenity", sub: "A Mind-Body Experience", who: "Mary Beth & Lorrie", price: "$12", img: "img/sound-bowls.jpg", cap: "Photo: the studio’s Sound and Vibration image",
      q: ["During our free movement practice, we will enjoy a live symphony of sound as Mary Beth plays crystal bowls, chimes, and other instruments.", "This class is suitable for all levels. No previous experience in somatic movement or dance is required."], url: PP + "/classes/21199116", cta: "Get a ticket" }
  ];
  var dt = function (e) { return new Date(e.d[0], e.d[1], e.d[2], e.d[3], e.d[4]); };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var stamp = function (d) { return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "T" + pad(d.getHours()) + pad(d.getMinutes()) + "00"; };
  function ics(e) {
    var s = dt(e), f = new Date(s.getTime() + e.min * 60000);
    var body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Example mockup//Coconut Elephant Yoga//EN", "BEGIN:VEVENT", "UID:" + e.id + "-2026@example-mockup", "DTSTAMP:20261115T120000", "DTSTART;TZID=America/New_York:" + stamp(s), "DTEND;TZID=America/New_York:" + stamp(f),
      "SUMMARY:" + e.title + (e.sub ? " · " + e.sub : "") + " (Coconut Elephant Yoga)", "LOCATION:" + ADDR.replace(/,/g, "\\,"), "DESCRIPTION:With " + e.who + ". Tickets: " + e.url, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    return "data:text/calendar;charset=utf-8," + encodeURIComponent(body);
  }
  function gcal(e) {
    var s = dt(e), f = new Date(s.getTime() + e.min * 60000);
    return "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(e.title + " · Coconut Elephant Yoga") + "&dates=" + stamp(s) + "/" + stamp(f) + "&ctz=America/New_York&location=" + encodeURIComponent(ADDR) + "&details=" + encodeURIComponent("With " + e.who + ". Tickets: " + e.url);
  }

  /* month grids */
  function month(y, m) {
    var first = new Date(y, m, 1).getDay(), n = new Date(y, m + 1, 0).getDate(), h = '<div class="mo"><p class="mo-h">' + MON[m] + '</p><div class="mo-g"><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>';
    for (var i = 0; i < first; i++) h += "<i></i>";
    for (var d = 1; d <= n; d++) {
      var e = EV.filter(function (x) { return x.d[1] === m && x.d[2] === d; })[0];
      h += e ? '<a href="#' + e.id + '" class="hit' + (e.quiet ? " q" : "") + '" title="' + esc(e.title) + '">' + d + "</a>" : "<i>" + d + "</i>";
    }
    return h + "</div></div>";
  }
  $("#months").innerHTML = month(2026, 10) + month(2026, 11) + '<ul class="legend"><li><span class="hit"></span>Workshop or circle</li><li><span class="hit q"></span>Special regular class</li></ul>';

  /* event features */
  $("#evs").innerHTML = EV.map(function (e, i) {
    var s = dt(e);
    var media = e.img ? '<figure class="ev-ph"><img src="' + e.img + '" alt="" loading="lazy"' + (e.pos ? ' class="top"' : "") + "><figcaption>" + esc(e.cap) + "</figcaption></figure>"
      : '<div class="ev-ph type' + (e.quiet ? " q" : "") + '" aria-hidden="true"><span>' + esc(e.title) + "</span></div>";
    return '<article class="ev rise' + (i % 2 ? " flip" : "") + (e.quiet ? " quiet" : "") + '" id="' + e.id + '">' + media +
      '<div class="ev-tx"><p class="ev-date"><b>' + s.getDate() + "</b><span>" + MON[s.getMonth()] + "<br>" + e.day + "</span></p>" +
      "<h2>" + esc(e.title) + (e.sub ? "<em>" + esc(e.sub) + "</em>" : "") + "</h2>" +
      '<p class="ev-meta">' + e.t + " · with " + esc(e.who) + ' · <b>' + esc(e.price) + "</b>" + (e.pnote ? " " + e.pnote : "") + "</p>" +
      e.q.map(function (q) { return "<blockquote>“" + esc(q) + "”</blockquote>"; }).join("") +
      '<div class="ev-act"><a class="btn primary sm" href="' + e.url + '" target="_blank" rel="noopener">' + e.cta + '</a><a class="btn quiet sm" href="' + ics(e) + '" download="' + e.id + '-coconut-elephant.ics">Add to calendar</a><a class="lnk" href="' + gcal(e) + '" target="_blank" rel="noopener">Google Calendar</a>' +
      (e.quiet ? "" : '<button type="button" class="lnk" data-gift="' + e.id + '">Give this as a gift</button>') + "</div></div></article>";
  }).join("");

  /* gift card */
  var GIFTS = [
    { id: "nss", n: "New Student Special", d: "3 regular classes · good for 60 days from the first class", p: "$33" },
    { id: "drop", n: "A drop-in class", d: "One class of their choosing", p: "$20" },
    { id: "five", n: "5-Class Pass", d: "Five classes to come back to", p: "$80" }
  ].concat(EV.filter(function (e) { return !e.quiet; }).map(function (e) { var s = dt(e); return { id: e.id, n: e.title + (e.sub && e.id !== "intuitive" ? ": " + e.sub : ""), d: e.day + ", " + MON[s.getMonth()] + " " + s.getDate() + " · " + e.t, p: e.price }; }));
  var cur = GIFTS[0];
  $("#gopts").innerHTML = GIFTS.map(function (g, i) { return '<button type="button" data-g="' + g.id + '" aria-pressed="' + (i ? "false" : "true") + '"><b>' + esc(g.n) + "</b><small>" + esc(g.p) + "</small></button>"; }).join("");
  function setGift(id) {
    cur = GIFTS.filter(function (g) { return g.id === id; })[0] || GIFTS[0];
    document.querySelectorAll("#gopts button").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-g") === cur.id ? "true" : "false"); });
    paint();
  }
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-g]"); if (b) setGift(b.getAttribute("data-g"));
    var g = ev.target.closest("[data-gift]"); if (g) { setGift(g.getAttribute("data-gift")); $("#gift").scrollIntoView({ behavior: "smooth" }); }
  });
  ["gTo", "gFrom", "gMsg"].forEach(function (id) { $("#" + id).addEventListener("input", paint); });
  var logo = new Image(); logo.src = "img/logo.png";
  var fonts = document.fonts && document.fonts.load ? Promise.all([document.fonts.load('500 40px "Cormorant"'), document.fonts.load('italic 400 40px "Cormorant"'), document.fonts.load('600 20px "DM Sans"')]).catch(function () {}) : Promise.resolve();
  function wrapText(x, t, cx, y, w, lh) { var words = t.split(" "), line = ""; for (var i = 0; i < words.length; i++) { var test = line ? line + " " + words[i] : words[i]; if (x.measureText(test).width > w && line) { x.fillText(line, cx, y); y += lh; line = words[i]; } else line = test; } if (line) x.fillText(line, cx, y); return y + lh; }
  function paint() {
    var to = $("#gTo").value.trim(), from = $("#gFrom").value.trim(), msg = $("#gMsg").value.trim();
    $("#cTo").textContent = to || "you"; $("#cFrom").textContent = from || "a friend";
    $("#cTitle").textContent = cur.n; $("#cDesc").textContent = cur.d; $("#cMsg").textContent = msg ? "“" + msg + "”" : "";
    fonts.then(function () {
      var c = $("#gCanvas"), x = c.getContext("2d"), W = 1080, H = 1350;
      var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#21392f"); g.addColorStop(1, "#16241e"); x.fillStyle = g; x.fillRect(0, 0, W, H);
      var r = x.createRadialGradient(W, 0, 40, W, 0, 900); r.addColorStop(0, "rgba(195,155,87,.32)"); r.addColorStop(1, "rgba(195,155,87,0)"); x.fillStyle = r; x.fillRect(0, 0, W, H);
      x.strokeStyle = "rgba(233,201,147,.55)"; x.lineWidth = 2; x.strokeRect(48, 48, W - 96, H - 96);
      if (logo.complete && logo.naturalWidth) x.drawImage(logo, W / 2 - 80, 140, 160, 160);
      x.textAlign = "center";
      x.fillStyle = "#e9c993"; x.font = '600 26px "DM Sans"'; x.fillText(("A GIFT FOR " + (to || "YOU")).toUpperCase(), W / 2, 390);
      x.fillStyle = "#f8f4ec"; x.font = '500 88px "Cormorant"'; var y = wrapText(x, cur.n, W / 2, 500, 880, 92);
      x.fillStyle = "rgba(248,244,236,.78)"; x.font = '400 30px "DM Sans"'; y = wrapText(x, cur.d, W / 2, y + 20, 860, 44);
      if (msg) { x.fillStyle = "#f0c4b4"; x.font = 'italic 400 46px "Cormorant"'; y = wrapText(x, "“" + msg + "”", W / 2, y + 70, 820, 58); }
      x.fillStyle = "#e9c993"; x.font = 'italic 400 44px "Cormorant"'; x.fillText("with love from " + (from || "a friend"), W / 2, Math.max(y + 80, 1080));
      x.fillStyle = "rgba(248,244,236,.6)"; x.font = '400 24px "DM Sans"'; x.fillText("Coconut Elephant Yoga · 825 Grove Road, Suite 12, Midlothian", W / 2, 1230);
      x.fillText("Example mockup · not a real gift certificate", W / 2, 1268);
      try { $("#gSave").href = c.toDataURL("image/png"); } catch (e) {}
    });
  }
  logo.onload = paint; paint();
  $("#gSave").addEventListener("click", function (e) { if ($("#gSave").getAttribute("href") === "#") e.preventDefault(); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: .06 });
    document.querySelectorAll("#evs .rise").forEach(function (el) { io.observe(el); });
  } else document.querySelectorAll("#evs .rise").forEach(function (el) { el.classList.add("in"); });
})();
