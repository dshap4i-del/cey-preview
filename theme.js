/* "Make it yours": a small floating panel to try palettes and type. Choice is saved on this device only. */
(function () {
  "use strict";
  var d = document.documentElement, store = null;
  try { store = window.localStorage; } catch (e) {}
  var PAL = {
  original:["#2c4a3e","#bf6a62","#e9c993"],
  lotus:["#7d3f58","#b5527a","#f0c9d4"],
  ocean:["#1d5c63","#c0603f","#a8dcd5"],
  saffron:["#7a4b14","#b04e2a","#f3cf7e"],
  lavender:["#4b4577","#a8587a","#dcd3f2"]
  };
  var PN = { original: "Original", lotus: "Lotus", ocean: "Ocean", saffron: "Saffron", lavender: "Lavender" };
  var FONTS = [["classic", "Classic", '"Cormorant",Georgia,serif'], ["modern", "Modern", '"Jost",system-ui,sans-serif'], ["soft", "Soft", '"Nunito",ui-rounded,sans-serif']];
  var wrap = document.createElement("div");
  wrap.className = "miy";
  var h = '<button type="button" class="miy-btn" aria-expanded="false" aria-controls="miyPanel"><span class="miy-sw" aria-hidden="true"></span>Make it yours</button>' +
    '<div class="miy-panel" id="miyPanel" role="dialog" aria-label="Make it yours" hidden>' +
    '<div class="miy-h"><b>Make it yours</b><button type="button" class="miy-x" aria-label="Close">×</button></div>' +
    '<p class="miy-sub">Try the studio in different colors and type. Your pick follows you to every page.</p>' +
    '<p class="miy-l">Colors</p><div class="miy-pals">';
  Object.keys(PAL).forEach(function (k) { var c = PAL[k];
    h += '<button type="button" data-pal="' + k + '"><i class="sw-' + k + '"></i>' + PN[k] + "</button>"; });
  h += '</div><p class="miy-l">Type</p><div class="miy-fonts">';
  FONTS.forEach(function (f) { h += '<button type="button" data-font="' + f[0] + '"><span class="ff-' + f[0] + '">Aa</span>' + f[1] + "</button>"; });
  h += '</div><div class="miy-foot"><span>Saved on this device only</span><button type="button" class="miy-reset">Reset</button></div></div>';
  wrap.innerHTML = h;
  document.body.appendChild(wrap);
  var btn = wrap.querySelector(".miy-btn"), panel = wrap.querySelector(".miy-panel");
  function sync() {
    Array.prototype.forEach.call(wrap.querySelectorAll("[data-pal]"), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-pal") === d.getAttribute("data-palette"))); });
    Array.prototype.forEach.call(wrap.querySelectorAll(".miy-fonts [data-font]"), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-font") === d.getAttribute("data-font"))); });
  }
  function set(attr, key, val) {
    d.classList.add("miy-anim"); d.setAttribute(attr, val);
    try { store && store.setItem(key, val); } catch (e) {}
    clearTimeout(set.t); set.t = setTimeout(function () { d.classList.remove("miy-anim"); }, 450);
    sync();
  }
  function open(o) { panel.hidden = !o; btn.setAttribute("aria-expanded", String(o)); }
  btn.addEventListener("click", function (e) { e.stopPropagation(); open(panel.hidden); });
  wrap.querySelector(".miy-x").addEventListener("click", function () { open(false); });
  wrap.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.hasAttribute("data-pal")) set("data-palette", "cey-palette", b.getAttribute("data-pal"));
    else if (b.parentNode.classList.contains("miy-fonts")) set("data-font", "cey-font", b.getAttribute("data-font"));
    else if (b.classList.contains("miy-reset")) { set("data-palette", "cey-palette", "original"); set("data-font", "cey-font", "classic"); }
  });
  document.addEventListener("click", function (e) { if (!panel.hidden && !wrap.contains(e.target)) open(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") open(false); });
  sync();
  if (/[?&]miy=open/.test(location.search)) open(true);
})();
