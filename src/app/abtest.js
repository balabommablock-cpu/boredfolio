"use client";
var React = require("react");
var useState = React.useState;
var useEffect = React.useEffect;
var useRef = React.useRef;

// ── Agdam Bagdam A/B Testing Integration ──
// Follows boredfolio code standards: var only, function keyword only, no JSX

var AB_CONFIG = {
  apiKey: "abacus_ecc6b5d8288319fea52a62fe5b7cd226",
  baseUrl: "https://abacus-eight-kappa.vercel.app",
  projectId: "26ea19c6-8db7-446b-b3b4-bcc8d8a3124b"
};

// ── Visitor ID ──
// Persistent anonymous visitor ID stored in localStorage
function getVisitorId() {
  var key = "ab_visitor_id";
  var stored = null;
  try { stored = localStorage.getItem(key); } catch (e) { /* SSR or blocked */ }
  if (stored) return stored;
  var id = "v_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 10);
  try { localStorage.setItem(key, id); } catch (e) { /* noop */ }
  return id;
}

// ── Assignment cache ──
// Cache variant assignments in localStorage so we don't re-fetch on every page load
function getCachedAssignment(experimentKey) {
  try {
    var raw = localStorage.getItem("ab_assign_" + experimentKey);
    if (!raw) return null;
    var parsed = JSON.parse(raw);
    // Cache for 1 hour
    if (Date.now() - parsed.ts > 3600000) return null;
    return parsed.data;
  } catch (e) { return null; }
}

function setCachedAssignment(experimentKey, data) {
  try {
    localStorage.setItem("ab_assign_" + experimentKey, JSON.stringify({ data: data, ts: Date.now() }));
  } catch (e) { /* noop */ }
}

// ── API helpers ──

function abFetch(path, body, callback) {
  var url = AB_CONFIG.baseUrl + path;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("x-api-key", AB_CONFIG.apiKey);
  xhr.setRequestHeader("x-project-id", AB_CONFIG.projectId);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var data = JSON.parse(xhr.responseText);
          if (callback) callback(null, data);
        } catch (e) {
          if (callback) callback(e, null);
        }
      } else {
        if (callback) callback(new Error("AB API " + xhr.status), null);
      }
    }
  };
  xhr.send(JSON.stringify(body));
}

// ── Public API ──

// Get variant assignment for a single experiment
// callback(err, { variant: "control"|"treatment_1"|..., experimentKey: "...", ... })
function getVariant(experimentKey, callback) {
  var cached = getCachedAssignment(experimentKey);
  if (cached) {
    if (callback) callback(null, cached);
    return;
  }
  var visitorId = getVisitorId();
  abFetch("/api/assign", {
    userId: visitorId,
    experimentKey: experimentKey
  }, function (err, data) {
    if (!err && data) {
      setCachedAssignment(experimentKey, data);
    }
    if (callback) callback(err, data);
  });
}

// Track a conversion event
// value defaults to 1 (e.g. a click = 1 conversion)
function trackEvent(metricKey, value, properties) {
  var visitorId = getVisitorId();
  var payload = {
    userId: visitorId,
    metricKey: metricKey,
    value: typeof value === "number" ? value : 1,
    properties: properties || {}
  };
  // Fire-and-forget using sendBeacon if available, fallback to XHR
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    var blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    // sendBeacon doesn't support custom headers, so fall back to XHR
  }
  abFetch("/api/events", payload, function () { /* fire and forget */ });
}

// ── React Hook ──
// Returns { variant: string|null, loading: boolean }
// Usage:
//   var ab = useABTest("homepage_hero");
//   if (ab.loading) return e("div", null, "...");
//   if (ab.variant === "treatment_1") { ... }

function useABTest(experimentKey) {
  var _s = useState(null), variant = _s[0], setVariant = _s[1];
  var _l = useState(true), loading = _l[0], setLoading = _l[1];
  var called = useRef(false);

  useEffect(function () {
    if (!experimentKey || called.current) return;
    called.current = true;

    getVariant(experimentKey, function (err, data) {
      if (!err && data && data.variant) {
        setVariant(data.variant);
      } else {
        // Default to control on error so site works normally
        setVariant("control");
      }
      setLoading(false);
    });
  }, [experimentKey]);

  return { variant: variant, loading: loading };
}

// ── Exports ──
module.exports = {
  AB_CONFIG: AB_CONFIG,
  getVisitorId: getVisitorId,
  getVariant: getVariant,
  trackEvent: trackEvent,
  useABTest: useABTest
};

// ──────────────────────────────────────────────────
// USAGE EXAMPLE (do NOT uncomment — just a reference)
// ──────────────────────────────────────────────────
//
// In any boredfolio component:
//
//   var abtest = require("./abtest");
//   var useABTest = abtest.useABTest;
//   var trackEvent = abtest.trackEvent;
//
//   function HeroSection() {
//     var ab = useABTest("homepage_hero");
//     var e = React.createElement;
//
//     if (ab.loading) return e("div", null, "");
//
//     // Render different variants
//     if (ab.variant === "treatment_1") {
//       return e("div", { style: { background: "#000" } },
//         e("h1", null, "Variant B headline"),
//         e("button", {
//           onClick: function() { trackEvent("hero_cta_click"); }
//         }, "Get Started")
//       );
//     }
//
//     // Default: control
//     return e("div", null,
//       e("h1", null, "Original headline"),
//       e("button", {
//         onClick: function() { trackEvent("hero_cta_click"); }
//       }, "Get Started")
//     );
//   }
//
