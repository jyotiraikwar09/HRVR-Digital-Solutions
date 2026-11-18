/* ============================================================
   HRVR Digital Solutions — validation.js
   Client-side form validation for usability only.
   Client validation is NOT a substitute for server-side
   validation performed by the configured form service.
   ============================================================ */

(function () {
  "use strict";

  var LIMITS = {
    name: { min: 2, max: 80 },
    email: { max: 254 },
    details: { min: 10, max: 2000 },
  };

  // Practical email format check (not a full RFC parser).
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  function validateName(value) {
    var v = (value || "").trim();
    if (!isNonEmptyString(v)) return "Please enter your full name.";
    if (v.length < LIMITS.name.min) return "Name must be at least " + LIMITS.name.min + " characters.";
    if (v.length > LIMITS.name.max) return "Name must be at most " + LIMITS.name.max + " characters.";
    return "";
  }

  function validateEmail(value) {
    var v = (value || "").trim();
    if (!isNonEmptyString(v)) return "Please enter your email address.";
    if (v.length > LIMITS.email.max) return "Email address is too long.";
    if (!EMAIL_RE.test(v)) return "Please enter a valid email address (e.g. name@example.com).";
    return "";
  }

  function validateType(value) {
    return isNonEmptyString(value) ? "" : "Please select a project type.";
  }

  function validateDetails(value) {
    var v = (value || "").trim();
    if (!isNonEmptyString(v)) return "Please describe your project.";
    if (v.length < LIMITS.details.min)
      return "Please give a little more detail (at least " + LIMITS.details.min + " characters).";
    if (v.length > LIMITS.details.max)
      return "Project details must be at most " + LIMITS.details.max + " characters.";
    return "";
  }

  /**
   * Validate the whole contact form.
   * @param {Object} data - { name, email, projectType, details }
   * @returns {Object} map of field name -> error message ("" when valid)
   */
  function validateContactForm(data) {
    return {
      name: validateName(data.name),
      email: validateEmail(data.email),
      projectType: validateType(data.projectType),
      details: validateDetails(data.details),
    };
  }

  window.HRVRValidation = Object.freeze({
    validateContactForm: validateContactForm,
    LIMITS: Object.freeze(LIMITS),
  });
})();
