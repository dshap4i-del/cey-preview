/* Opens "What you'd see" from the extra callout button; no data leaves the page. */
document.addEventListener("click",function(e){var b=e.target.closest("[data-open-owner]");if(b){var o=document.getElementById("ownerOpen");if(o)o.click();}});
/* On phones, start the page-level "About this idea" card closed so the page itself shows first. */
if(window.matchMedia&&matchMedia("(max-width:760px)").matches){document.querySelectorAll("details.hw.page").forEach(function(d){d.open=false;});}
