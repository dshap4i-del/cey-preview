/* Studio admin preview. All names and numbers are made-up examples. Nothing is sent or stored. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var STU = [
    { n: "Jordan Example", first: "Gentle Sensory Yoga · Today 2:00 pm · Studio", lvl: "Beginner", inj: "Tender left knee", how: "Found us on Google", pass: "New Student Special" },
    { n: "Sam Sample", first: "Gentle Sensory Yoga · Today 2:00 pm · Online", lvl: "Brand new", inj: "None listed", how: "A friend", pass: "New Student Special" },
    { n: "Taylor Test", first: "Slow Flow Vinyasa · Tue 10:00 am · Studio", lvl: "Intermediate", inj: "Lower back, recovering", how: "Instagram", pass: "Drop-In" },
    { n: "Riley Placeholder", first: "Slow Flow Vinyasa · Tue 10:00 am · Studio", lvl: "Beginner", inj: "", how: "Google", pass: "New Student Special", nowaiver: true }
  ];
  var W = [
    { n: "Jordan Example", when: "Nov 14, 7:42 pm", email: "jordan@example.com", phone: "(804) 555-0101", emer: "Alex Example · (804) 555-0199", lvl: "Beginner", inj: "Tender left knee", minor: "No", photo: "Yes" },
    { n: "Sam Sample", when: "Nov 13, 9:15 am", email: "sam@example.com", phone: "(804) 555-0102", emer: "Pat Sample · (804) 555-0188", lvl: "Brand new", inj: "None listed", minor: "No", photo: "No" },
    { n: "Taylor Test", when: "Nov 12, 6:03 pm", email: "taylor@example.com", phone: "(804) 555-0103", emer: "Morgan Test · (804) 555-0177", lvl: "Intermediate", inj: "Lower back, recovering", minor: "No", photo: "Yes" },
    { n: "Casey Demo", when: "Nov 10, 8:30 pm", email: "casey.parent@example.com", phone: "(804) 555-0104", emer: "Drew Demo · (804) 555-0166", lvl: "Beginner", inj: "None listed", minor: "Yes · signed by guardian Drew Demo", photo: "No" }
  ];
  var EV = [
    { t: "Thankful Body: A Belly Dance Workshop", d: "Thu, Nov 19 · 6:45 pm · $32", img: "img/belly-dance.jpg", sold: 9, cap: 20 },
    { t: "Intuitive Circle", d: "Sat, Nov 21 · 6:30 pm · $27", img: "img/intuitive-circle.jpg", sold: 5, cap: 15 },
    { t: "Reiki Circle: Energetic Cleansing", d: "Fri, Dec 4 · 6:30 pm · $15–$50 donation", img: "img/ev-holly.jpg", sold: 0, cap: 15 },
    { t: "Holiday Serenity: A Mind-Body Experience", d: "Sat, Dec 12 · 2:00 pm · $12", img: "img/sound-bowls.jpg", sold: 0, cap: 20 }
  ];
  var ini = function (n) { return n.split(" ").map(function (p) { return p[0]; }).join(""); };
  function tab(t) {
    $$(".snav button").forEach(function (b) { b.setAttribute("aria-selected", String(b.getAttribute("data-tab") === t)); });
    $$("[data-pane]").forEach(function (p) { p.hidden = p.getAttribute("data-pane") !== t; });
    if (history.replaceState) history.replaceState(null, "", "#" + t);
    window.scrollTo(0, 0);
  }
  $$(".snav button").forEach(function (b) { b.addEventListener("click", function () { tab(b.getAttribute("data-tab")); }); });

  $("#stu").innerHTML = STU.map(function (s, i) {
    return '<div class="li"><span class="av">' + ini(s.n) + "</span><div><b>" + esc(s.n) + "</b>" + (s.nowaiver ? ' <span class="tag" style="background:rgb(var(--lotus-rgb) / .14);color:var(--lotus)">No waiver yet</span>' : "") + "<small>First class: " + esc(s.first) + "</small><small>" + esc(s.lvl) + (s.inj ? " · " + esc(s.inj) : "") + " · " + esc(s.pass) + " · " + esc(s.how) + '</small></div><button type="button" class="mini" data-welcome="' + i + '">Welcome note</button></div>';
  }).join("");
  function welcome(i) {
    var s = STU[i];
    $("#wtxt").value = "Hi " + s.n.split(" ")[0] + ",\n\nWelcome to Coconut Elephant Yoga! I'm so glad you're joining us for " + s.first.split(" · ")[0] + ". Arrive a few minutes early so we can say hello, and let me know if there's anything I should know before class.\n\nSee you on the mat,\nMary Beth";
    $("#welcome").hidden = false; $("#wok").hidden = true; $("#welcome").scrollIntoView({ behavior: "smooth", block: "center" });
  }
  $("#wcopy").addEventListener("click", function () { var t = $("#wtxt"); t.select(); try { navigator.clipboard.writeText(t.value); } catch (e) { document.execCommand("copy"); } $("#wok").hidden = false; });
  $("#wclose").addEventListener("click", function () { $("#welcome").hidden = true; });

  $("#wl").innerHTML = W.map(function (w, i) {
    return '<div class="li"><span class="av">' + ini(w.n) + "</span><div><b>" + esc(w.n) + "</b><small>Signed " + esc(w.when) + " · " + esc(w.lvl) + "</small>" + (w.inj !== "None listed" ? '<small style="color:var(--lotus);font-weight:600">Injury: ' + esc(w.inj) + "</small>" : "") + '</div><button type="button" class="mini" data-w="' + i + '">Open</button></div>';
  }).join("") + '<div class="li" style="color:var(--lotus)"><span class="dot warn"></span><div><b>Riley Placeholder</b><small>Booked Tue Slow Flow · waiver not signed yet</small></div><button type="button" class="mini" data-goto="messages" data-msg="remind">Draft reminder</button></div>';
  var sh = $("#wsheet"), si = $("#wsIn");
  function openW(i) {
    var w = W[i];
    si.innerHTML = '<button type="button" class="x" aria-label="Close">×</button><p class="when">Signed waiver · ' + esc(w.when) + ' · <span class="exdata">Example</span></p><h2 id="wsh">' + esc(w.n) + '</h2><dl class="wdl"><dt>Email</dt><dd>' + esc(w.email) + "</dd><dt>Mobile</dt><dd>" + esc(w.phone) + "</dd><dt>Emergency</dt><dd>" + esc(w.emer) + "</dd><dt>Experience</dt><dd>" + esc(w.lvl) + "</dd><dt>Injuries</dt><dd" + (w.inj !== "None listed" ? ' class="hl"' : "") + ">" + esc(w.inj) + "</dd><dt>Under 18</dt><dd>" + esc(w.minor) + "</dd><dt>Photo OK</dt><dd>" + esc(w.photo) + "</dd><dt>Agreed</dt><dd>Yes · studio waiver</dd></dl><p class=\"lab\">Signature</p><div class=\"sigbox\"><span>" + esc(w.n) + "</span></div>";
    sh.hidden = false; document.body.classList.add("lock"); $(".x", si).focus();
  }
  function closeW() { sh.hidden = true; document.body.classList.remove("lock"); }

  $("#evs").innerHTML = EV.map(function (e) {
    var p = Math.round(e.sold / e.cap * 100);
    return '<div class="card evrow"><img src="' + e.img + '" alt=""><div><h3>' + esc(e.t) + '</h3><p class="sm">' + esc(e.d) + '</p><div class="bar"><i style="width:' + p + '%"></i></div></div><p class="n">' + e.sold + "<small>of " + e.cap + " sold</small></p></div>";
  }).join("");

  var T = {
    announce: "Hi everyone,\n\nA reminder that Black Friday Flow is on Friday, Nov 27 at 10:00 am, studio and online. Take a break from the Black Friday rush!\n\nWith gratitude,\nMary Beth",
    remind: "Hi Riley,\n\nWe're looking forward to seeing you at Slow Flow Vinyasa on Tuesday! Before class, please take two minutes to sign your new student waiver on our website.\n\nSee you on the mat,\nMary Beth",
    event: "Hi everyone,\n\nThankful Body: A Belly Dance Workshop with Sirona Luna is this Thursday, Nov 19, 6:45–8:00 pm. All levels are welcome: come as you are, move as you feel. Tickets are $32.\n\nMary Beth"
  };
  function tpl(k) { $$("#tpl button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-t") === k)); }); $("#msg").value = T[k]; $("#to").value = k === "remind" ? "Riley Placeholder (example)" : "All students (example list)"; }
  tpl("announce");
  $("#tpl").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) tpl(b.getAttribute("data-t")); });

  document.addEventListener("click", function (e) {
    var g = e.target.closest("[data-goto]"); if (g) { tab(g.getAttribute("data-goto")); if (g.hasAttribute("data-msg")) tpl(g.getAttribute("data-msg")); if (g.hasAttribute("data-w")) openW(+g.getAttribute("data-w")); return; }
    var w = e.target.closest("[data-w]"); if (w) { openW(+w.getAttribute("data-w")); return; }
    var c = e.target.closest("[data-welcome]"); if (c) { welcome(+c.getAttribute("data-welcome")); return; }
    if (e.target === sh || e.target.closest("#wsheet .x")) closeW();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !sh.hidden) closeW(); });
  var h = location.hash.slice(1); if (["today", "students", "waivers", "events", "messages"].indexOf(h) > -1) tab(h);
  if (/[?&]w=\d/.test(location.search)) openW(+location.search.match(/w=(\d)/)[1]);
})();
