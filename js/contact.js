/* ============================================================
   HRVR Digital Solutions — contact.js
   Contact form handling: validation UI, submission state,
   duplicate-submission lock, timeout, and safe notifications.

   SECURITY:
   - No secrets in this file. The endpoint lives in config.js
     and must be a public-by-design URL.
   - If no endpoint is configured, the form shows a clear
     "not connected" message and the email alternative.
   - Success is only reported when the endpoint confirms an
     HTTP 2xx response. Nothing is faked or simulated.
   - Submitted data is never written to localStorage.
   ============================================================ */

(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var submitBtn = document.getElementById("cf-submit");
  var statusEl = document.getElementById("cf-status");
  var detailsField = document.getElementById("cf-details");
  var detailsCounter = document.getElementById("cf-details-counter");
  var isSubmitting = false;
  var VALIDATORS = window.HRVRValidation;

  var FIELD_IDS = {
    name: "cf-name",
    email: "cf-email",
    projectType: "cf-type",
    details: "cf-details",
  };

  /* ---------- helpers ---------- */

  function fieldErrorEl(fieldKey) {
    return document.getElementById(FIELD_IDS[fieldKey] + "-error");
  }

  function setFieldError(fieldKey, message) {
    var input = document.getElementById(FIELD_IDS[fieldKey]);
    var errorEl = fieldErrorEl(fieldKey);
    if (!input || !errorEl) return;
    if (message) {
      input.setAttribute("aria-invalid", "true");
      errorEl.textContent = message; // textContent — never innerHTML
      errorEl.hidden = false;
    } else {
      input.removeAttribute("aria-invalid");
      errorEl.textContent = "";
      errorEl.hidden = true;
    }
  }

  function clearAllErrors() {
    Object.keys(FIELD_IDS).forEach(function (key) {
      setFieldError(key, "");
    });
  }

  function setStatus(kind, message) {
    if (!statusEl) return;
    statusEl.className = "form-status form-status--" + kind;
    statusEl.textContent = message; // textContent — never innerHTML
    statusEl.hidden = false;
  }

  function hideStatus() {
    if (!statusEl) return;
    statusEl.hidden = true;
    statusEl.textContent = "";
  }

  function setSubmitting(busy) {
    isSubmitting = busy;
    if (!submitBtn) return;
    submitBtn.disabled = busy;
    submitBtn.setAttribute("aria-busy", busy ? "true" : "false");
    var label = submitBtn.querySelector(".btn__label");
    var spinner = submitBtn.querySelector(".btn__spinner");
    if (label) label.textContent = busy ? "Sending…" : "Submit Message";
    if (spinner) spinner.hidden = !busy;
  }

  function getData() {
    var data = {
      name: "",
      email: "",
      projectType: "",
      details: "",
    };
    Object.keys(FIELD_IDS).forEach(function (key) {
      var el = document.getElementById(FIELD_IDS[key]);
      data[key] = el ? String(el.value || "").trim() : "";
    });
    return data;
  }

  function resetForm() {
    form.reset();
    if (detailsCounter) detailsCounter.textContent = "0 / " + VALIDATORS.LIMITS.details.max;
  }

  /* ---------- submission ---------- */

  function submitToEndpoint(data) {
    var config = window.HRVR_CONFIG || {};
    var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timedOut = false;

    var timeoutId = window.setTimeout(function () {
      timedOut = true;
      if (controller) controller.abort();
    }, config.REQUEST_TIMEOUT_MS || 15000);

    var payload = Object.assign({}, data);
    if (config.WEB3FORMS_ACCESS_KEY) {
      payload.access_key = config.WEB3FORMS_ACCESS_KEY;
      payload.subject = "New Project Inquiry (" + data.projectType + ") — " + data.name;
      payload.from_name = "HRVR Digital Solutions Website";
    }

    var fetchPromise = window
      .fetch(config.CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined,
      })
      .then(function (response) {
        window.clearTimeout(timeoutId);
        if (response.ok) {
          return response;
        }
        // Do not surface raw server error bodies to the user.
        return Promise.reject(new Error("endpoint-rejected"));
      })
      .catch(function (err) {
        window.clearTimeout(timeoutId);
        if (timedOut) throw new Error("timeout");
        throw err;
      });

    return fetchPromise;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return; // duplicate-submission lock

    hideStatus();
    clearAllErrors();

    var data = getData();
    var errors = VALIDATORS.validateContactForm(data);
    var firstInvalid = null;

    Object.keys(errors).forEach(function (key) {
      setFieldError(key, errors[key]);
      if (errors[key] && !firstInvalid) firstInvalid = key;
    });

    if (firstInvalid) {
      var el = document.getElementById(FIELD_IDS[firstInvalid]);
      if (el) el.focus();
      setStatus("error", "Please fix the highlighted fields and try again.");
      return;
    }

    var config = window.HRVR_CONFIG || {};
    if (!config.CONTACT_ENDPOINT) {
      setStatus(
        "info",
        "The contact form is not connected yet. Please reach out directly at " +
          "hrvrdigitalsolutions@gmail.com — I usually reply within 2-4 hours."
      );
      return;
    }

    setSubmitting(true);
    submitToEndpoint(data)
      .then(function () {
        setSubmitting(false);
        setStatus("success", "Message sent successfully! I usually respond within 2-4 hours.");
        resetForm(); // reset only after confirmed success
      })
      .catch(function (err) {
        setSubmitting(false);
        if (err && (err.message === "timeout" || err.name === "AbortError")) {
          setStatus(
            "error",
            "The request timed out. Please try again, or email hrvrdigitalsolutions@gmail.com."
          );
        } else {
          setStatus(
            "error",
            "Something went wrong while sending your message. Please email hrvrdigitalsolutions@gmail.com instead."
          );
        }
      });
  }

  /* ---------- wiring ---------- */

  form.addEventListener("submit", handleSubmit);

  if (detailsField && detailsCounter) {
    detailsField.addEventListener("input", function () {
      detailsCounter.textContent =
        detailsField.value.length + " / " + VALIDATORS.LIMITS.details.max;
    });
  }

  // Live-clear a field's error as the user edits it.
  Object.keys(FIELD_IDS).forEach(function (key) {
    var el = document.getElementById(FIELD_IDS[key]);
    if (!el) return;
    el.addEventListener("input", function () {
      setFieldError(key, "");
    });
    el.addEventListener("change", function () {
      setFieldError(key, "");
    });
  });
})();