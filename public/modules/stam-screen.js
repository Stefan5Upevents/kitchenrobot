// KitchenRobot module: stam-screen.js
// Geextraheerd uit index.html op 2026-05-05T12:36:42.733Z (v9 AST-walk v5)
// Bevat: StamScreen
// Externe refs (via window._): AllergenenOverzichtTab, GERECHTEN_INIT, GerechtenTab, MENUS_INIT, MenusTab, PGTab, PRODUCTGROEPEN, RecrasTab, SLIGRO_INIT, SligroTab, btnP, btnSG, btnSP, tg
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function StamScreen({ initTab }) {
  var [tab, setTab] = useState(initTab || "pg");
  // NIEUW: luister naar initTab-verandering bij nav-klik
  useEffect(function() {
    if (initTab && initTab !== tab) {
      setTab(initTab);
      setPendingTab(null);
    }
  }, [initTab]);
  var [heeftWijzigingen, setHeeftWijzigingen] = useState(false);
  var [pendingTab, setPendingTab] = useState(null);
  var [opslaanBezig, setOpslaanBezig] = useState(false);
  var [opslaanMelding, setOpslaanMelding] = useState("");
  var [productgroepen, setProductgroepen] = useState(window._PRODUCTGROEPEN);
  var [gerechten, setGerechten] = useState(window._GERECHTEN_INIT);
  var [menus, setMenus] = useState(window._MENUS_INIT);
  var [sligro, setSligro] = useState(window._SLIGRO_INIT);
  var [laden, setLaden] = useState(true);
  useEffect(function() {
    setLaden(true);
    Promise.all([
      window._supa.from("productgroepen").select("*, productsoorten(*)").order("volgorde"),
      window._supa.from("gerechten").select("*, ingredienten(*), presentatievormen(*), gerecht_gn_formaten(*, standaard_gn_formaten(*)), gerecht_schaal_formaten(*, standaard_schaal_formaten(*)), gerecht_productsoort_koppelingen(productsoort_id)").order("naam"),
      window._supa.from("menus").select("*, menu_gerechten(*, gerechten(*))").order("code"),
      window._supa.from("sligro_producten").select("*, sligro_productgroep_koppelingen(productgroep_id)").order("naam")
    ]).then(function(results) {
      var pgData = results[0].data || [];
      if (pgData.length > 0) {
        setProductgroepen(pgData.map(function(pg) {
          return Object.assign({}, pg, { id: pg.id, soorten: (pg.productsoorten || []).map(function(ps) {
            return { id: ps.id, code: ps.code, naam: ps.naam };
          }) });
        }));
      }
      if (results[1].data && results[1].data.length > 0) setGerechten(results[1].data);
      if (results[2].data && results[2].data.length > 0) setMenus(results[2].data);
      if (results[3].data && results[3].data.length > 0) setSligro(results[3].data.map(function(p) {
        var koppelingen = (p.sligro_productgroep_koppelingen || []).map(function(k) {
          return k.productgroep_id;
        });
        return Object.assign({}, p, {
          artnr: p.artnr,
          naam: p.naam,
          merk: p.merk || "",
          pgIds: koppelingen.length ? koppelingen : p.productgroep_id ? [p.productgroep_id] : [],
          hoev: p.hoeveelheid,
          eenh: p.eenheid,
          prijs: p.prijs_excl,
          ok: p.ingesteld
        });
      }));
      setLaden(false);
      window._stamProductgroepen = (results[0].data || []).map(function(pg) { return Object.assign({}, pg, { soorten: pg.productsoorten || [] }); });
      window._stamGerechten = results[1].data || [];
      window._stamMenus = results[2].data || [];
      window._stamSligro = (results[3].data || []).map(function(p) {
        var kops = (p.sligro_productgroep_koppelingen || []).map(function(k) {
          return k.productgroep_id;
        });
        return Object.assign({}, p, { pgIds: kops.length ? kops : p.productgroep_id ? [p.productgroep_id] : [], hoev: p.hoeveelheid, eenh: p.eenheid, prijs: p.prijs_excl });
      });
      window._supa.from("recras_koppelingen").select("*").then(function(r) {
        window._stamKoppelingen = r.data || [];
      });
      window._supa.from("opzet_instellingen").select("*").then(function(r) {
        window._stamTijdenInst = (r.data || []).map(function(row) {
          try {
            return JSON.parse(row.instellingen_json || "{}");
          } catch (e) {
            return {};
          }
        });
      });
    }).catch(function(e) {
      console.warn("Supabase laden mislukt:", e);
      setLaden(false);
    });
  }, []);
  var tabs = [["pg", "Productgroepen"], ["sl", "Sligro Import"], ["gr", "Gerechten"], ["ti", "Buffet / Tijden"], ["mn", "Menus"], ["re", "Recras Import"], ["al", "🏷 Allergenen"], ["ki", "📱 Kiosk"], ["ins", "📄 Instructies"], ["dr", "📖 Draaiboek-links"]];
  function switchTab(newTab) {
    if (heeftWijzigingen) {
      setPendingTab(newTab);
    } else {
      setTab(newTab);
    }
  }
  function markeerGewijzigd() {
    setHeeftWijzigingen(true);
  }
  function markeerOpgeslagen() {
    setHeeftWijzigingen(false);
    setOpslaanMelding("Opgeslagen!");
    setTimeout(function() {
      setOpslaanMelding("");
    }, 2e3);
  }
  function bevestigWisselen() {
    setTab(pendingTab);
    setPendingTab(null);
    setHeeftWijzigingen(false);
  }
  function annuleerWisselen() {
    setPendingTab(null);
  }
  if (laden) {
    return React.createElement("div", { style: { padding: 40, textAlign: "center", color: C.muted } }, "Stamgegevens laden...");
  }
  return /* @__PURE__ */ React.createElement("div", null, pendingTab && /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(35,71,86,.65)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { background: C.white, borderRadius: 14, padding: 28, width: 420, boxShadow: "0 8px 28px rgba(0,0,0,.3)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 900, fontSize: 18, color: C.night, marginBottom: 8 } }, "Niet-opgeslagen wijzigingen"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: C.muted, margin: "0 0 20px" } }, "Je hebt wijzigingen die nog niet zijn opgeslagen. Wil je doorgaan zonder opslaan?"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("button", { style: window._btnSG, onClick: annuleerWisselen }, "Terug — ik ga opslaan"), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSP, background: C.orange }, onClick: bevestigWisselen }, "Toch doorgaan")))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: SS.pT }, "Stamgegevens"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, heeftWijzigingen && /* @__PURE__ */ React.createElement("span", { style: { ...window._tg(C.orange), fontSize: 11, padding: "4px 10px" } }, "Niet-opgeslagen wijzigingen"), opslaanMelding && /* @__PURE__ */ React.createElement("span", { style: { ...window._tg(C.green), fontSize: 11, padding: "4px 10px" } }, opslaanMelding), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnP, opacity: heeftWijzigingen ? 1 : 0.45 }, onClick: markeerOpgeslagen }, "Opslaan"))), tab === "pg" && /* @__PURE__ */ React.createElement(window._PGTab, { productgroepen, setProductgroepen, onChange: markeerGewijzigd, onSave: markeerOpgeslagen }), tab === "sl" && /* @__PURE__ */ React.createElement(window._SligroTab, { sligro, setSligro, productgroepen, onChange: markeerGewijzigd, onSave: markeerOpgeslagen }), tab === "gr" && /* @__PURE__ */ React.createElement(window._GerechtenTab, { gerechten, setGerechten, productgroepen, sligro, onChange: markeerGewijzigd, onSave: markeerOpgeslagen }), tab === "ti" && /* @__PURE__ */ React.createElement(window._TijdenTab, { productgroepen, onChange: markeerGewijzigd, onSave: markeerOpgeslagen }), tab === "mn" && /* @__PURE__ */ React.createElement(window._MenusTab, { menus, setMenus, gerechten, productgroepen, onChange: markeerGewijzigd, onSave: markeerOpgeslagen }), tab === "re" && /* @__PURE__ */ React.createElement(window._RecrasTab, { menus, onChange: markeerGewijzigd, onSave: markeerOpgeslagen }), tab === "al" && /* @__PURE__ */ React.createElement(window._AllergenenOverzichtTab, { gerechten, sligro, productgroepen }), tab === "ki" && /* @__PURE__ */ React.createElement(window._KioskBeheerTab, null), tab === "ins" && /* @__PURE__ */ React.createElement(window._InstructiesTab, null), tab === "dr" && /* @__PURE__ */ React.createElement(window._DraaiboekLinksTab, null));
}

  window._StamScreen = StamScreen;
})();
