// SPP main script: nav toggle, before/after slider, case study accordion,
// form tabs, form submit, cookie banner. Native JS only. No dependencies, no trackers.

/* Sitewide script, loaded at the end of <body> on every page. There is no
   build step: push to main and GitHub Pages serves this file as-is in about
   a minute. Every feature block below is guarded by an element lookup, so
   pages that lack a widget skip that block silently, which is why one file
   can serve the home page and all inner pages. Blocks in order: mobile nav
   toggle, scroll reveals (home only), before/after slider, case study
   accordion, contact form tabs, form submit, file upload label, cookie
   banner. Styles referenced here live in assets/css/base.css (reveals) and
   assets/css/components.css (everything else). */

(function () {
  "use strict";

  /* ---- Mobile nav toggle ----
     Markup contract: .nav-toggle ships with aria-expanded="false" and
     aria-controls="site-nav" in the HTML; components.css shows the panel
     via .site-nav[data-open="true"]. This block keeps aria-expanded,
     data-open and the aria-label ("Open menu"/"Close menu") in sync, so
     change all three together if you rework the menu. The delegated click
     listener below closes the panel after any link tap; without it,
     same-page anchor links (like /#contact) would leave the open menu
     covering the page because no reload happens. */
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

  /* ---- Scroll reveals (home only: <body data-animate>) ----
     Classes are added here, before first paint, so nothing is hidden
     when JavaScript is unavailable. CSS gates the effect behind
     prefers-reduced-motion: no-preference.
     The visual side lives in base.css ("Motion" section): .reveal is the
     hidden start state, .is-visible releases it, and the per-item stagger
     reads the --reveal-delay custom property set below (70ms per sibling).
     Only index.html puts data-animate on <body>, so inner pages load this
     file but skip the whole block; remove that attribute to switch the
     home page reveals off without touching code. To reveal a new home
     section, add a collect() call for its selector, passing true for
     stagger when the selector matches a repeated list or grid. */
  if (document.body.hasAttribute("data-animate") && "IntersectionObserver" in window) {
    var revealTargets = [];
    var collect = function (selector, stagger) {
      Array.prototype.forEach.call(document.querySelectorAll(selector), function (el, i) {
        el.classList.add("reveal");
        if (stagger) el.style.setProperty("--reveal-delay", (i * 70) + "ms");
        revealTargets.push(el);
      });
    };
    collect(".section-head");
    collect(".tech-row");
    collect(".spotlight__head");
    collect(".case-item", true);
    collect(".app-cell", true);
    collect(".contact__left");
    collect(".form-card");
    collect(".partners__logos");

    /* Fires once 10% of an element is visible and it has cleared the
       bottom edge by 60px, then unobserves it: each element animates in
       exactly once per page load and never re-hides on scroll-up. */
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -60px 0px", threshold: 0.1 });

    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---- Before/after comparison slider ----
     JS only writes the --pos custom property (0-100%) on #ba-slider and
     mirrors it into aria-valuenow on the handle. components.css does all
     the drawing from --pos (Figma 465:12): the before-image clip-path,
     the divider line and the handle position all read it, and the same
     rule sets touch-action: none so a horizontal drag never fights page
     scrolling on touch screens. Keyboard contract on the role="slider"
     handle: arrow keys move 2 percent, Shift+arrow 10, Home/End jump to
     the edges. If you change the step sizes, they only live here. */
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
        /* Capture keeps pointermove events flowing to the slider even when
           the pointer leaves its box mid-drag. */
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

  /* ---- Case study accordion (one open at a time) ----
     The active case also drives the spotlight image via data-image.
     All cases share the same placeholder photo for now; when the client
     supplies per-case photos, only the data-image attributes change.
     How to edit: point each .case-item's data-image in index.html at its
     own file under assets/img/ (WebP via scripts/convert-images.sh), this
     code needs no changes. Open state lives on the .case-item itself as
     aria-expanded; components.css keys the body reveal, head styling and
     arrow rotation off [aria-expanded="true"]. The src comparison below
     skips identical images so the shared placeholder never flickers, and
     the 180ms fade matches the opacity transition on .spotlight__image img
     in components.css, keep the two durations in sync. Alt text is rebuilt
     from the case title so swapped photos stay described for screen
     readers. */
  var caseItems = Array.prototype.slice.call(document.querySelectorAll(".case-item"));
  var spotlightImg = document.getElementById("spotlight-img");
  caseItems.forEach(function (item) {
    var head = item.querySelector(".case-item__head");
    if (!head) return;
    head.addEventListener("click", function () {
      if (item.getAttribute("aria-expanded") === "true") return;
      caseItems.forEach(function (other) {
        other.setAttribute("aria-expanded", other === item ? "true" : "false");
      });
      // Swap the spotlight image to this case's photo (skip if identical).
      var next = item.getAttribute("data-image");
      if (spotlightImg && next && spotlightImg.getAttribute("src") !== next) {
        var title = item.querySelector(".case-item__title");
        spotlightImg.style.opacity = "0";
        window.setTimeout(function () {
          spotlightImg.onload = spotlightImg.onerror = function () {
            spotlightImg.style.opacity = "1";
            spotlightImg.onload = spotlightImg.onerror = null;
          };
          spotlightImg.src = next;
          if (title) spotlightImg.alt = "Case study: " + title.textContent.trim();
        }, 180);
      }
    });
  });

  /* ---- Contact form tabs: switch between the two form bodies ----
     Each .form-toggle__btn's aria-controls holds the id of the <form> it
     owns (form-quote / form-general in index.html); keep that pairing
     intact when renaming forms. The inactive form is removed from the page
     with the hidden attribute, so its required fields can never block
     submission of the visible one and it stays out of the tab order. */
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
     For now we prevent default and swap the card to its success state.
     How to wire it: keep the preventDefault and validity check, POST
     new FormData(form) to the chosen endpoint with fetch, and set
     data-state="success" only after a 2xx response (add an error branch).
     components.css handles the rest: .form-card[data-state="success"]
     hides the form and shows the .form-card__success panel. The forms
     carry novalidate in the markup, so the checkValidity/reportValidity
     pair here is the only validation gate. */
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

  /* ---- File upload: show the chosen file name ----
     Cosmetic only: the real <input type="file"> is visually hidden by
     components.css (1px, opacity 0) and the label text mirrors whatever
     was picked. Clearing the selection restores the prompt stored in the
     data-default attribute; "Upload drawing" is just the fallback if that
     attribute is missing. Note the file itself goes nowhere yet, sending
     it depends on the pending form endpoint decision above. */
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

  /* ---- Cookie banner (essential-only) ----
     Informational only: the site sets no analytics or marketing cookies,
     so there is nothing to opt in or out of and one "accept" button is
     enough. The banner ships with the hidden attribute in the markup and
     is revealed only when the ack key is absent. Both localStorage calls
     sit in try/catch because private browsing modes can throw; the
     graceful fallback is that the banner stays dismissible per session
     and simply reappears on the next visit. If you rename STORAGE_KEY,
     every visitor sees the banner once more. */
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
