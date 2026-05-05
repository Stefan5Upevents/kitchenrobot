// KitchenRobot module: pres-tab.js
// Geextraheerd uit index.html op 2026-05-05T12:24:49.637Z (v9 AST-walk v5)
// Bevat: PresTab
// Externe refs (via window._): alertI, btnP
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function PresTab({ g, items, setItems, onChange }) {
  var [gnFormaten, setGnFormaten] = useState([]);
  var [schaalFormaten, setSchaalFormaten] = useState([]);
  var [gerechtenGN, setGerechtenGN] = useState(g.gerecht_gn_formaten || []);
  var [gerechtenSchaal, setGerechtenSchaal] = useState(g.gerecht_schaal_formaten || []);
  var [melding, setMelding] = useState("");
  var isGn = !!g.is_gn;
  var [portiesGNState, setPortiesGNState] = useState(function() {
    var map = {};
    (g.gerecht_gn_formaten || []).forEach(function(item) {
      map[item.id] = String(item.porties_per_bak !== null && item.porties_per_bak !== void 0 ? item.porties_per_bak : 1);
    });
    return map;
  });
  var [portiesSchaalState, setPortiesSchaalState] = useState(function() {
    var map = {};
    (g.gerecht_schaal_formaten || []).forEach(function(item) {
      map[item.id] = String(item.porties_per_schaal !== null && item.porties_per_schaal !== void 0 ? item.porties_per_schaal : 1);
    });
    return map;
  });
  useEffect(function() {
    window._supa.from("standaard_gn_formaten").select("*").order("volgorde").then(function(r) {
      setGnFormaten(r.data || []);
    });
    window._supa.from("standaard_schaal_formaten").select("*").order("volgorde").then(function(r) {
      setSchaalFormaten(r.data || []);
    });
  }, []);
  function toon(t, fout) {
    setMelding(t);
    setTimeout(function() {
      setMelding("");
    }, fout ? 5e3 : 2e3);
  }
  function syncItems(nieuweGN, nieuweSchaal) {
    setItems(function(prev) {
      return prev.map(function(x) {
        if (x.id !== g.id) return x;
        var extra = {};
        if (nieuweGN !== void 0) extra.gerecht_gn_formaten = nieuweGN;
        if (nieuweSchaal !== void 0) extra.gerecht_schaal_formaten = nieuweSchaal;
        return Object.assign({}, x, extra);
      });
    });
  }
  function slaAllesOp() {
    var updatesGN = gerechtenGN.map(function(item) {
      var n = parseInt(portiesGNState[item.id]) || 1;
      return window._supa.from("gerecht_gn_formaten").update({ porties_per_bak: n }).eq("id", item.id).then(function(r) {
        if (r.error) throw new Error(r.error.message);
        return { id: item.id, n, type: "gn" };
      });
    });
    var updatesSchaal = gerechtenSchaal.map(function(item) {
      var n = parseInt(portiesSchaalState[item.id]) || 1;
      return window._supa.from("gerecht_schaal_formaten").update({ porties_per_schaal: n }).eq("id", item.id).then(function(r) {
        if (r.error) throw new Error(r.error.message);
        return { id: item.id, n, type: "schaal" };
      });
    });
    Promise.all(updatesGN.concat(updatesSchaal)).then(function(results) {
      var nieuwGN = gerechtenGN.map(function(x) {
        var r = results.find(function(r2) {
          return r2 && r2.type === "gn" && r2.id === x.id;
        });
        return r ? Object.assign({}, x, { porties_per_bak: r.n }) : x;
      });
      var nieuwSchaal = gerechtenSchaal.map(function(x) {
        var r = results.find(function(r2) {
          return r2 && r2.type === "schaal" && r2.id === x.id;
        });
        return r ? Object.assign({}, x, { porties_per_schaal: r.n }) : x;
      });
      setGerechtenGN(nieuwGN);
      setGerechtenSchaal(nieuwSchaal);
      syncItems(nieuwGN, nieuwSchaal);
      toon("Opgeslagen ✓");
      if (onChange) onChange();
    }).catch(function(e) {
      toon("Fout: " + e.message, true);
    });
  }
  function toggleGN(gfId, aan) {
    if (aan) {
      window._supa.from("gerecht_gn_formaten").insert({ gerecht_id: g.id, gn_formaat_id: gfId, porties_per_bak: 1, is_max_vorm: false, volgorde: gerechtenGN.length }).select("*, standaard_gn_formaten(*)").then(function(r) {
        if (r.error) {
          toon("Fout: " + r.error.message, true);
          return;
        }
        var nieuw = gerechtenGN.concat([r.data[0]]);
        setGerechtenGN(nieuw);
        setPortiesGNState(function(prev) {
          return Object.assign({}, prev, { [r.data[0].id]: "1" });
        });
        syncItems(nieuw, void 0);
        if (onChange) onChange();
      });
    } else {
      var item = gerechtenGN.find(function(x) {
        return x.gn_formaat_id === gfId;
      });
      if (!item) return;
      window._supa.from("gerecht_gn_formaten").delete().eq("id", item.id).then(function() {
        var nieuw = gerechtenGN.filter(function(x) {
          return x.gn_formaat_id !== gfId;
        });
        setGerechtenGN(nieuw);
        syncItems(nieuw, void 0);
        if (onChange) onChange();
      });
    }
  }
  function toggleSchaal(sfId, aan) {
    if (aan) {
      window._supa.from("gerecht_schaal_formaten").insert({ gerecht_id: g.id, schaal_formaat_id: sfId, porties_per_schaal: 1, is_max_vorm: false, volgorde: gerechtenSchaal.length }).select("*, standaard_schaal_formaten(*)").then(function(r) {
        if (r.error) {
          toon("Fout: " + r.error.message, true);
          return;
        }
        var nieuw = gerechtenSchaal.concat([r.data[0]]);
        setGerechtenSchaal(nieuw);
        setPortiesSchaalState(function(prev) {
          return Object.assign({}, prev, { [r.data[0].id]: "1" });
        });
        syncItems(void 0, nieuw);
        if (onChange) onChange();
      });
    } else {
      var item = gerechtenSchaal.find(function(x) {
        return x.schaal_formaat_id === sfId;
      });
      if (!item) return;
      window._supa.from("gerecht_schaal_formaten").delete().eq("id", item.id).then(function() {
        var nieuw = gerechtenSchaal.filter(function(x) {
          return x.schaal_formaat_id !== sfId;
        });
        setGerechtenSchaal(nieuw);
        syncItems(void 0, nieuw);
        if (onChange) onChange();
      });
    }
  }
  function setMaxVormGN(itemId) {
    var updates = gerechtenGN.map(function(x) {
      return window._supa.from("gerecht_gn_formaten").update({ is_max_vorm: x.id === itemId }).eq("id", x.id);
    });
    Promise.all(updates).then(function() {
      var nieuw = gerechtenGN.map(function(x) {
        return Object.assign({}, x, { is_max_vorm: x.id === itemId });
      });
      setGerechtenGN(nieuw);
      syncItems(nieuw, void 0);
      toon("Max vorm ingesteld ✓");
    });
  }
  function setMaxVormSchaal(itemId) {
    var updates = gerechtenSchaal.map(function(x) {
      return window._supa.from("gerecht_schaal_formaten").update({ is_max_vorm: x.id === itemId }).eq("id", x.id);
    });
    Promise.all(updates).then(function() {
      var nieuw = gerechtenSchaal.map(function(x) {
        return Object.assign({}, x, { is_max_vorm: x.id === itemId });
      });
      setGerechtenSchaal(nieuw);
      syncItems(void 0, nieuw);
      toon("Max vorm ingesteld ✓");
    });
  }
  if (!g.heeft_presentatie) {
    return /* @__PURE__ */ React.createElement("div", { style: SS.card }, /* @__PURE__ */ React.createElement("div", { style: window._alertI }, 'Zet "Presentatievorm van toepassing" op Ja via het tabblad Algemeen.'));
  }
  var gnTypeUitleg = {
    "GN_1_3_LAAG": "type 0 — 3 per dish",
    "GN_1_3_HOOG": "type 0 — 3 per dish",
    "GN_1_2_LAAG": "type 1 — 2 per dish",
    "GN_1_2_HOOG": "type 1 — 2 per dish",
    "GN_1_1_LAAG": "type 2 — 1 per dish",
    "GN_1_1_HOOG": "type 2 — 1 per dish"
  };
  var geselecteerdeGN = gerechtenGN.slice().sort(function(a, b) {
    return (a.volgorde || 0) - (b.volgorde || 0);
  });
  var geselecteerdeSchaal = gerechtenSchaal.slice().sort(function(a, b) {
    return (a.volgorde || 0) - (b.volgorde || 0);
  });
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, marginBottom: 12 } }, melding && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: melding.startsWith("Fout") ? C.hot : C.green } }, melding), (geselecteerdeGN.length > 0 || geselecteerdeSchaal.length > 0) && /* @__PURE__ */ React.createElement("button", { style: window._btnP, onClick: slaAllesOp }, "Opslaan")), isGn ? /* @__PURE__ */ React.createElement("div", { style: SS.card }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 14, marginBottom: 4 } }, "GN Bakken"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.muted, marginBottom: 4 } }, "Vink aan welke GN maten van toepassing zijn. Stel porties in. Markeer de ", /* @__PURE__ */ React.createElement("strong", null, "maximale vorm"), " voor de chafingdish berekening."), /* @__PURE__ */ React.createElement("div", { style: { ...window._alertI, fontSize: 11, marginBottom: 12 } }, "GN 1/3 = type 0 (3/dish) \u2022 GN 1/2 = type 1 (2/dish) \u2022 GN 1/1 = type 2 (1/dish)"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 } }, gnFormaten.map(function(gf) {
    var actief = gerechtenGN.some(function(x) {
      return x.gn_formaat_id === gf.id;
    });
    return /* @__PURE__ */ React.createElement("label", { key: gf.id, style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      background: actief ? C.light : C.gray,
      borderRadius: 14,
      cursor: "pointer",
      border: "1px solid " + (actief ? C.aqua : "transparent")
    } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: actief, onChange: function(e) {
      toggleGN(gf.id, e.target.checked);
    } }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: actief ? 700 : 400, fontSize: 12 } }, gf.naam), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.muted } }, gnTypeUitleg[gf.code] || "")));
  })), geselecteerdeGN.length > 0 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 12, marginBottom: 6 } }, "Porties per bak + maximale vorm:"), geselecteerdeGN.map(function(item) {
    var gf = item.standaard_gn_formaten || gnFormaten.find(function(f) {
      return f.id === item.gn_formaat_id;
    }) || {};
    var huidig = portiesGNState[item.id] !== void 0 ? portiesGNState[item.id] : String(item.porties_per_bak || 1);
    return /* @__PURE__ */ React.createElement("div", { key: item.id, style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 14px",
      background: item.is_max_vorm ? "#E8F8FF" : C.gray,
      border: "2px solid " + (item.is_max_vorm ? C.aqua : "transparent"),
      borderRadius: 14,
      marginBottom: 6
    } }, /* @__PURE__ */ React.createElement("div", { style: { minWidth: 110 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 13 } }, gf.naam), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.muted } }, gnTypeUitleg[gf.code] || "")), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, color: C.muted } }, "Porties:"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        min: "1",
        value: huidig,
        onChange: function(e) {
          var val = e.target.value;
          setPortiesGNState(function(prev) {
            return Object.assign({}, prev, { [item.id]: val });
          });
        },
        style: {
          ...SS.inp,
          width: 65,
          padding: "3px 6px",
          border: "1px solid " + (huidig === "1" ? "#FFC107" : C.border)
        }
      }
    ), /* @__PURE__ */ React.createElement("label", { style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      cursor: "pointer",
      background: item.is_max_vorm ? C.aqua : C.white,
      color: item.is_max_vorm ? C.white : C.night,
      padding: "4px 10px",
      borderRadius: 100,
      fontSize: 11,
      fontWeight: item.is_max_vorm ? 700 : 400,
      border: "1px solid " + C.aqua,
      marginLeft: "auto"
    } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "radio",
        name: "gnmax_" + g.id,
        checked: !!item.is_max_vorm,
        onChange: function() {
          setMaxVormGN(item.id);
        },
        style: { display: "none" }
      }
    ), item.is_max_vorm ? "✓ Max vorm" : "Markeer als max"));
  }))) : /* @__PURE__ */ React.createElement("div", { style: SS.card }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 14, marginBottom: 4 } }, "Schaalformaten"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.muted, marginBottom: 12 } }, "Vink aan welke schalen van toepassing zijn. Markeer de ", /* @__PURE__ */ React.createElement("strong", null, "maximale vorm"), "."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 16 } }, schaalFormaten.map(function(sf) {
    var actief = gerechtenSchaal.some(function(x) {
      return x.schaal_formaat_id === sf.id;
    });
    return /* @__PURE__ */ React.createElement("label", { key: sf.id, style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 14px",
      background: actief ? C.light : C.gray,
      borderRadius: 14,
      cursor: "pointer",
      flex: 1,
      border: "1px solid " + (actief ? C.aqua : "transparent")
    } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: actief, onChange: function(e) {
      toggleSchaal(sf.id, e.target.checked);
    } }), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: actief ? 700 : 400 } }, sf.naam));
  })), geselecteerdeSchaal.length > 0 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 12, marginBottom: 6 } }, "Porties per schaal + maximale vorm:"), geselecteerdeSchaal.map(function(item) {
    var sf = item.standaard_schaal_formaten || schaalFormaten.find(function(f) {
      return f.id === item.schaal_formaat_id;
    }) || {};
    var huidig = portiesSchaalState[item.id] !== void 0 ? portiesSchaalState[item.id] : String(item.porties_per_schaal || 1);
    return /* @__PURE__ */ React.createElement("div", { key: item.id, style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 14px",
      background: item.is_max_vorm ? "#E8F8FF" : C.gray,
      border: "2px solid " + (item.is_max_vorm ? C.aqua : "transparent"),
      borderRadius: 14,
      marginBottom: 6
    } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, fontSize: 13, minWidth: 110 } }, sf.naam), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, color: C.muted } }, "Porties:"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        min: "1",
        value: huidig,
        onChange: function(e) {
          var val = e.target.value;
          setPortiesSchaalState(function(prev) {
            return Object.assign({}, prev, { [item.id]: val });
          });
        },
        style: {
          ...SS.inp,
          width: 65,
          padding: "3px 6px",
          border: "1px solid " + (huidig === "1" ? "#FFC107" : C.border)
        }
      }
    ), /* @__PURE__ */ React.createElement("label", { style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      cursor: "pointer",
      background: item.is_max_vorm ? C.aqua : C.white,
      color: item.is_max_vorm ? C.white : C.night,
      padding: "4px 10px",
      borderRadius: 100,
      fontSize: 11,
      fontWeight: item.is_max_vorm ? 700 : 400,
      border: "1px solid " + C.aqua,
      marginLeft: "auto"
    } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "radio",
        name: "schaalmax_" + g.id,
        checked: !!item.is_max_vorm,
        onChange: function() {
          setMaxVormSchaal(item.id);
        },
        style: { display: "none" }
      }
    ), item.is_max_vorm ? "✓ Max vorm" : "Markeer als max"));
  }))));
}

  window._PresTab = PresTab;
})();
