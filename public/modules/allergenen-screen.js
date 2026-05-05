// KitchenRobot module: allergenen-screen.js
// Geextraheerd uit index.html op 2026-05-05T10:08:25.673Z (v9 AST-walk)
// Bevat: AllergenenScreen
// Externe refs (via window._): AllergenenOverzichtTab
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function AllergenenScreen() {
  var [gerechten, setGerechten] = useState(window._stamGerechten || []);
  var [sligro, setSligro] = useState(window._stamSligro || []);
  var [productgroepen, setProductgroepen] = useState(window._stamProductgroepen || []);
  var [laden, setLaden] = useState(false);
  useEffect(function() {
    if (window._stamGerechten && window._stamGerechten.length > 0 && window._stamSligro && window._stamSligro.length > 0) {
      setGerechten(window._stamGerechten);
      setSligro(window._stamSligro);
      setProductgroepen(window._stamProductgroepen || []);
      return;
    }
    setLaden(true);
    Promise.all([
      window._supa.from("productgroepen").select("*, productsoorten(*)").order("volgorde"),
      window._supa.from("gerechten").select("*, ingredienten(*), gerecht_productsoort_koppelingen(productsoort_id)").order("naam"),
      window._supa.from("sligro_producten").select("*, sligro_productgroep_koppelingen(productgroep_id)").order("naam")
    ]).then(function(results) {
      var pgData = (results[0].data || []).map(function(pg) {
        return Object.assign({}, pg, { soorten: (pg.productsoorten || []).map(function(ps) {
          return { id: ps.id, code: ps.code, naam: ps.naam };
        }) });
      });
      var slData = (results[2].data || []).map(function(p) {
        var kops = (p.sligro_productgroep_koppelingen || []).map(function(k) {
          return k.productgroep_id;
        });
        return Object.assign({}, p, { pgIds: kops.length ? kops : p.productgroep_id ? [p.productgroep_id] : [], hoev: p.hoeveelheid, eenh: p.eenheid, prijs: p.prijs_excl });
      });
      setProductgroepen(pgData);
      setGerechten(results[1].data || []);
      setSligro(slData);
      window._stamProductgroepen = pgData;
      window._stamGerechten = results[1].data || [];
      window._stamSligro = slData;
      setLaden(false);
    });
  }, []);
  if (laden) {
    return /* @__PURE__ */ React.createElement("div", { style: { padding: 40, textAlign: "center", color: C.muted } }, "Allergenendata laden...");
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.pT }, "🏷 Allergenen"), /* @__PURE__ */ React.createElement("div", { style: SS.pD }, "Overzicht per productsoort — gerechten en Sligro producten"), /* @__PURE__ */ React.createElement(window._AllergenenOverzichtTab, { gerechten, sligro, productgroepen }));
}

  window._AllergenenScreen = AllergenenScreen;
})();
