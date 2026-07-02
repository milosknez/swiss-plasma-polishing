// SPP main script: nav toggle, before/after slider, case study accordion,
// form tabs, form submit, cookie banner. Native JS only. No dependencies, no trackers.

(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.getElementById("site-nav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var open = siteNav.getAttribute("data-open") === "true";
      siteNav.setAttribute("data-open", String(!open));
      navToggle.setAttribute("aria-expanded", String(!open));
      navToggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    });
    // Close the menu after following an in-page link.
    siteNav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && siteNav.getAttribute("data-open") === "true") {
        siteNav.setAttribute("data-open", "false");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      }
    });
  }

  /* ---- Before/after comparison slider ---- */
  var baSlider = document.getElementById("ba-slider");
  if (baSlider) {
    var baHandle = baSlider.querySelector(".ba-slider__handle");
    var baPos = 50;

    var baSet = function (pct) {
      baPos = Math.max(0, Math.min(100, pct));
      baSlider.style.setProperty("--pos", baPos + "%");
      baHandle.setAttribute("aria-valuenow", String(Math.round(baPos)));
    };
    var baFromX = function (clientX) {
      var r = baSlider.getBoundingClientRect();
      baSet(((clientX - r.left) / r.width) * 100);
    };

    var baDragging = false;
    baSlider.addEventListener("pointerdown", function (e) {
      baDragging = true;
      try {
        baSlider.setPointerCapture(e.pointerId);
      } catch (err) {
        /* synthetic or already-released pointers cannot be captured; dragging still works */
      }
      baFromX(e.clientX);
    });
    baSlider.addEventListener("pointermove", function (e) {
      if (baDragging) baFromX(e.clientX);
    });
    baSlider.addEventListener("pointerup", function () { baDragging = false; });
    baSlider.addEventListener("pointercancel", function () { baDragging = false; });

    // Keyboard support on the handle (role="slider").
    baHandle.addEventListener("keydown", function (e) {
      var step = e.shiftKey ? 10 : 2;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        baSet(baPos - step);
        e.preventDefault();
      } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        baSet(baPos + step);
        e.preventDefault();
      } else if (e.key === "Home") {
        baSet(0);
        e.preventDefault();
      } else if (e.key === "End") {
        baSet(100);
        e.preventDefault();
      }
    });
  }

  /* ---- Case study accordion (one open at a time) ---- */
  var caseItems = Array.prototype.slice.call(document.querySelectorAll(".case-item"));
  caseItems.forEach(function (item) {
    var head = item.querySelector(".case-item__head");
    if (!head) return;
    head.addEventListener("click", function () {
      if (item.getAttribute("aria-expanded") === "true") return;
      caseItems.forEach(function (other) {
        other.setAttribute("aria-expanded", other === item ? "true" : "false");
      });
    });
  });

  /* ---- Contact form tabs: switch between the two form bodies ---- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".form-toggle__btn"));
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute("aria-selected", String(selected));
        var body = document.getElementById(t.getAttribute("aria-controls"));
        if (body) body.hidden = !selected;
      });
    });
  });

  /* ---- Contact form submit (handles both tab forms) ----
     TODO: wire to Formspree or Web3Forms once the client confirms the endpoint.
     For now we prevent default and swap the card to its success state. */
  var forms = Array.prototype.slice.call(document.querySelectorAll(".form-body"));
  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var card = form.closest(".form-card");
      if (card) card.setAttribute("data-state", "success");
    });
  });

  /* ---- File upload: show the chosen file name ---- */
  var uploadInputs = Array.prototype.slice.call(document.querySelectorAll(".upload-field__input"));
  uploadInputs.forEach(function (input) {
    input.addEventListener("change", function () {
      var label = input.parentElement.querySelector(".upload-field__text");
      if (!label) return;
      if (input.files && input.files.length) {
        label.textContent = input.files[0].name;
      } else {
        label.textContent = label.getAttribute("data-default") || "Upload drawing";
      }
    });
  });

  /* ---- Cookie banner (essential-only) ---- */
  var banner = document.getElementById("cookie-banner");
  var STORAGE_KEY = "spp-cookie-ack";
  if (banner) {
    var acknowledged = false;
    try {
      acknowledged = localStorage.getItem(STORAGE_KEY) === "1";
    } catch (err) {
      acknowledged = false;
    }
    if (!acknowledged) {
      banner.hidden = false;
    }
    var acceptBtn = banner.querySelector('[data-cookie="accept"]');
    if (acceptBtn) {
      acceptBtn.addEventListener("click", function () {
        banner.hidden = true;
        try {
          localStorage.setItem(STORAGE_KEY, "1");
        } catch (err) {
          /* storage unavailable, fall back to hiding for this session only */
        }
      });
    }
  }
})();
