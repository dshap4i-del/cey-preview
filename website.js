/* Idea 2 · new website. Static data from Punchpass and coconutelephantyoga.com, read Nov 15, 2026. Nothing is sent anywhere. */
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var PP = "https://coconutelephantyoga.punchpass.com/classes";
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  /* Weekly schedule as listed on Punchpass, week of Nov 15, 2026 */
  var WEEK = [
    { d: "Sun", full: "Sunday", c: [{ t: "2:00 pm", n: "Gentle Sensory Yoga", who: "Mary Beth", len: "1 hr 15 min", fm: ["Studio", "Online"] }] },
    { d: "Mon", full: "Monday", c: [{ t: "5:00 pm", n: "Mindful Flow with Sound Healing Meditation", who: "Sara & Martha", len: "1 hr 15 min studio · 1 hr online", fm: ["Studio", "Online"] }] },
    { d: "Tue", full: "Tuesday", c: [{ t: "10:00 am", n: "Slow Flow Vinyasa", who: "Lily", len: "1 hr", fm: ["Studio", "Online"] }] },
    { d: "Wed", full: "Wednesday", c: [{ t: "5:00 pm", n: "Yin Yoga", who: "Holly & Mary Beth", len: "1 hr", fm: ["Studio", "Online"] }, { t: "6:30 pm", n: "Aroma & Align", who: "Mariah", len: "1 hr", fm: ["Studio"] }] },
    { d: "Thu", full: "Thursday", c: [{ t: "9:30 am", n: "Morning Yoga", who: "Martha", len: "1 hr", fm: ["Studio", "Online"] }, { t: "5:30 pm", n: "Flexibility Yoga", who: "Mariah", len: "1 hr", fm: ["Studio", "Online"] }] },
    { d: "Fri", full: "Friday", c: [{ t: "10:00 am", n: "Hatha Mixed Level", who: "Mary Beth", len: "1 hr", fm: ["Studio", "Online"] }] },
    { d: "Sat", full: "Saturday", c: [{ t: "9:30 am", n: "Yoga for Flexibility", who: "Mariah", len: "1 hr", fm: ["Studio", "Online"] }] }
  ];
  var days = $("#days"), slots = $("#slots");
  function show(i) {
    Array.prototype.forEach.call(days.children, function (b, j) { b.setAttribute("aria-selected", i === j ? "true" : "false"); });
    var w = WEEK[i];
    slots.innerHTML = '<p class="sl-day">' + w.full + "</p>" + w.c.map(function (c) {
      return '<article class="slot"><p class="sl-t">' + c.t + '</p><div class="sl-m"><h3>' + esc(c.n) + "</h3><p>with " + esc(c.who) + " · " + esc(c.len) + "</p><p class=\"fm\">" + c.fm.map(function (f) { return '<span class="' + f.toLowerCase() + '">' + f + "</span>"; }).join("") + '</p></div><a class="btn primary sm" href="' + PP + '" target="_blank" rel="noopener">Book</a></article>';
    }).join("");
  }
  WEEK.forEach(function (w, i) {
    var b = document.createElement("button");
    b.type = "button"; b.setAttribute("role", "tab");
    b.innerHTML = "<b>" + w.d + "</b><small>" + w.c.length + (w.c.length > 1 ? " classes" : " class") + "</small>";
    b.addEventListener("click", function () { show(i); });
    days.appendChild(b);
  });
  show(0);

  /* Class excerpts from the class descriptions page */
  var CL = [
    { n: "Gentle Sensory Yoga", k: "Soft & restful", q: "A whole body sensory experience… Class ends with an extended guided systematic relaxation. Suitable for all levels, including beginners." },
    { n: "Mindful Flow with Sound Healing Meditation", k: "Present & flowing", q: "Keeps you engaged with the present moment throughout your posture practice… concludes with a 15-minute Healing Sound Meditation." },
    { n: "Slow Flow Vinyasa", k: "Gently flowing", q: "A gentler pace than that of a typical vinyasa class… perfect for beginners or those seeking a more relaxed approach." },
    { n: "Yin Yoga", k: "Deep & quiet", q: "Poses, primarily performed on the floor, are held for longer durations (1-4 minutes) and paired with slow, deep breathing." },
    { n: "Hatha Mixed Level", k: "Steady & grounded", q: "Emphasizes classic poses and alignment within the body… options for all skill levels." },
    { n: "Restorative + Yoga Nidra", k: "Restore", q: "Mary Beth guides you through a restorative practice… Each class ends with a Yoga Nidra meditation." }
  ];
  $("#cgrid").innerHTML = CL.map(function (c, i) {
    return '<article class="ccard rise"><p class="ck">' + c.k + "</p><h3>" + esc(c.n) + "</h3><blockquote>“" + esc(c.q) + "”</blockquote></article>";
  }).join("") + '<article class="ccard more rise"><h3>Also on the class descriptions page</h3><p>Chair Yoga · Family Yoga · Prenatal Yoga · Lunchtime Yoga · Sunday Salutations · Vinyasa · Yoga Core · Yoga Fusion · Yoga and Meditation</p></article>';

  /* Instructors: names, credentials and a line from each bio */
  var TE = [
    { n: "Mary Beth", c: "E-RYT 500, C-IAYT, CYT · Owner", q: "My interest in yoga began when I needed to find a balance between my inner and outer world experience.", img: "img/mary-beth.jpg" },
    { n: "Martha", c: "ERYT 200 & Certified Health and Wellbeing Coach", q: "Yoga opened the doorway to experiencing myself in a deeply integrated and peaceful way." },
    { n: "Heather", c: "Reiki Master, C-IAYT, 500 RYT", q: "Reiki addresses the body’s energy in a gentle and easy way." },
    { n: "Holly", c: "RYT 200, Reiki Level 1 & 2, Sound Healing Practitioner", q: "I enjoy teaching beginners and exploring yogic philosophy, physics, frequencies, and languages." },
    { n: "Sara", c: "RYT 200", q: "I combine creative sequencing, a spirit of playfulness, and a dose of inspiration." },
    { n: "Lily", c: "RYT 200", q: "I believe that people need other people, and I strive to make my classes a welcoming space for all." },
    { n: "Mariah", c: "RYT 200", q: "Every day is only the beginning and a fresh start to make a difference in the world." },
    { n: "Melissa", c: "Certified Spiritual Consultant", q: "She founded the Richmond Intuitive Circle to provide in person meetings of like-minded people.", img: "img/intuitive-circle.jpg" },
    { n: "Lorrie", c: "Hypnotherapist NATH, Meditation Coach", q: "I am a companion on your soul’s journey of expansion." },
    { n: "Annie", c: "Shamanic Healer", q: "A time and place to be seen, heard, and nurtured." }
  ];
  $("#tgrid").innerHTML = TE.map(function (t) {
    var pic = t.img ? '<img src="' + t.img + '" alt="' + esc(t.n) + '" loading="lazy" width="96" height="96">' : '<span class="mono" aria-hidden="true">' + t.n[0] + "</span>";
    return '<article class="tcard rise">' + pic + "<div><h3>" + esc(t.n) + '</h3><p class="tc">' + esc(t.c) + "</p><p class=\"tq\">“" + esc(t.q) + "”</p></div></article>";
  }).join("");

  /* Wellness services (Our Services page) with Punchpass prices */
  var SV = [
    { n: "Therapeutic Yoga", w: "Mary Beth", d: "Yoga poses, breathing, meditation and lifestyle education to ease stress, pain and disease-related symptoms.", p: "$80 · 1 session · $225 for 3 · $350 for 5" },
    { n: "Sound and Vibration", w: "Mary Beth", d: "Sound healing as an auditory gateway into deep meditation.", p: "$90 per session" },
    { n: "Reiki", w: "Heather", d: "A Japanese technique for relaxation, stress reduction and self-healing.", p: "$90 per session" },
    { n: "Stretch Therapy", w: "Mariah", d: "Personalized stretching for all body sizes and flexibility levels.", p: "Booked through its own Punchpass page" },
    { n: "Integrative Positional Therapy", w: "Dan", d: "A hands-on, gentle therapy for chronic pain relief.", p: "$90 · 1 session · $150 for 2 · $200 for 3" },
    { n: "C-Fit Community Wellness", w: "Mary Beth", d: "Discounted classes for current and retired Chesterfield County employees in C-Fit.", p: "From $9 a class" }
  ];
  $("#svl").innerHTML = SV.map(function (s) {
    return '<div class="svi"><div><h3>' + esc(s.n) + ' <i>with ' + esc(s.w) + "</i></h3><p>" + esc(s.d) + '</p></div><p class="svp">' + esc(s.p) + "</p></div>";
  }).join("");

  /* reveal for injected cards */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: .08 });
    document.querySelectorAll(".ccard,.tcard").forEach(function (el) { io.observe(el); });
  } else document.querySelectorAll(".ccard,.tcard").forEach(function (el) { el.classList.add("in"); });
})();
