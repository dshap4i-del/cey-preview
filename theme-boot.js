/* Applies the saved "Make it yours" choice before the page paints. ?palette=lotus&font=modern also works. */
(function () {
  var d = document.documentElement, P = ["original", "lotus", "ocean", "saffron", "lavender"], F = ["classic", "modern", "soft"], p = null, f = null, s = null;
  try { s = window.localStorage; p = s.getItem("cey-palette"); f = s.getItem("cey-font"); } catch (e) {}
  try { var q = new URLSearchParams(location.search), qp = q.get("palette"), qf = q.get("font");
    if (qp && P.indexOf(qp) > -1) { p = qp; try { s.setItem("cey-palette", qp); } catch (e) {} }
    if (qf && F.indexOf(qf) > -1) { f = qf; try { s.setItem("cey-font", qf); } catch (e) {} } } catch (e) {}
  d.setAttribute("data-palette", P.indexOf(p) > -1 ? p : "original");
  d.setAttribute("data-font", F.indexOf(f) > -1 ? f : "classic");
})();
