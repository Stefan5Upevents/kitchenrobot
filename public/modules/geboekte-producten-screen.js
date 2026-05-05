// KitchenRobot module: geboekte-producten-screen.js
// Geextraheerd uit index.html op 2026-05-05T10:13:58.393Z (v9 AST-walk)
// Bevat: GeboekteProductenScreen
// Externe refs (via window._): GeboekteProductenTab
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function GeboekteProductenScreen() {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: C.night, marginBottom: 4 } }, "🛒 Geboekte producten"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: C.muted } }, "Automatisch berekende Sligro-benodigdheden op basis van ge\xEFmporteerde boekingen per keuken.")), /* @__PURE__ */ React.createElement(window._GeboekteProductenTab, { standalone: true }));
}

  window._GeboekteProductenScreen = GeboekteProductenScreen;
})();
