// KitchenRobot module: tijden-tab.js
// Geextraheerd uit index.html op 2026-05-05T12:24:49.393Z (v9 AST-walk v5)
// Bevat: TijdenTab
// Externe refs (via window._): alertI, btnP, btnSA, btnSG
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function TijdenTab({ productgroepen, onChange, onSave }) {
  var allePsIds = productgroepen.reduce(function(acc, g) {
    return acc.concat(g.soorten || []);
  }, []);
  var [actief, setActief] = useState(allePsIds.length > 0 ? allePsIds[0].id : "");
  var [instellingen, setInstellingen] = useState({});
  var [geladen, setGeladen] = useState(false);
  var [melding, setMelding] = useState("");
  useEffect(function() {
    if (allePsIds.length > 0 && !actief) setActief(allePsIds[0].id);
  }, [productgroepen]);
  useEffect(function() {
    window._supa.from("opzet_instellingen").select("*").then(function(r) {
      var map = {};
      (r.data || []).forEach(function(row) {
        try {
          map[row.productsoort_id] = JSON.parse(row.instellingen_json);
        } catch (e) {
        }
      });
      setInstellingen(map);
      setGeladen(true);
    });
  }, []);
  function toon(t, fout) {
    setMelding(t);
    setTimeout(function() {
      setMelding("");
    }, fout ? 5e3 : 2e3);
  }
  var pg = productgroepen.find(function(g) {
    return (g.soorten || []).some(function(s) {
      return s.id === actief;
    });
  });
  var ps = allePsIds.find(function(s) {
    return s.id === actief;
  });
  var inst = instellingen[actief] || {
    marges: [{ tot: "10", pct: "100" }, { tot: "25", pct: "95" }, { tot: "50", pct: "90" }, { tot: "100", pct: "85" }],
    bufs: [{ tot: "100", aantal: "1" }, { tot: "200", aantal: "2" }, { tot: "300", aantal: "3" }],
    tijden: [],
    minVoorRecras: 30
  };
  function updateInst(wijziging) {
    var nieuw = Object.assign({}, instellingen, { [actief]: Object.assign({}, inst, wijziging) });
    setInstellingen(nieuw);
    if (onChange) onChange();
  }
  function slaOp() {
    var data = { productsoort_id: actief, instellingen_json: JSON.stringify(inst) };
    window._supa.from("opzet_instellingen").upsert(data, { onConflict: "productsoort_id" }).then(function(r) {
      if (r.error) {
        toon("Fout: " + r.error.message, true);
        return;
      }
      toon("Instellingen opgeslagen ✓");
      if (onSave) onSave();
    });
  }
  function updateMarge(i, veld, waarde) {
    var nieuwMarges = inst.marges.map(function(m, j) {
      return j === i ? Object.assign({}, m, { [veld]: waarde }) : m;
    });
    updateInst({ marges: nieuwMarges });
  }
  function updateBuf(i, veld, waarde) {
    var nieuwBufs = inst.bufs.map(function(b, j) {
      return j === i ? Object.assign({}, b, { [veld]: waarde }) : b;
    });
    updateInst({ bufs: nieuwBufs });
  }
  function updateTijd(id, veld, waarde) {
    var nieuwTijden = inst.tijden.map(function(t) {
      return t.id === id ? Object.assign({}, t, { [veld]: waarde }) : t;
    });
    updateInst({ tijden: nieuwTijden });
  }
  function voegTijdToe() {
    var naam = prompt("Naam van de tijdinstelling:");
    if (!naam) return;
    var nieuweId = Date.now();
    var nieuwTijden = inst.tijden.concat([{ id: nieuweId, naam, minuten: "60", perGroep: false, kwalificatie: "Algemeen", basis: "vorige" }]);
    updateInst({ tijden: nieuwTijden });
  }
  function verwijderTijd(id) {
    updateInst({ tijden: inst.tijden.filter(function(t) {
      return t.id !== id;
    }) });
  }
  if (!geladen) return React.createElement("div", { style: { padding: 20, color: C.muted } }, "Laden...");
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 5, marginBottom: 12, flexWrap: "wrap" } }, allePsIds.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { color: C.muted } }, "Voeg eerst productgroepen toe.") : allePsIds.map(function(ps_) {
    return /* @__PURE__ */ React.createElement("button", { key: ps_.id, style: {
      background: actief === ps_.id ? C.night : C.white,
      color: actief === ps_.id ? C.white : C.night,
      border: "1.5px solid " + (actief === ps_.id ? C.night : C.border),
      borderRadius: 100,
      padding: "4px 11px",
      fontFamily: "inherit",
      fontWeight: 700,
      fontSize: 11,
      cursor: "pointer"
    }, onClick: function() {
      setActief(ps_.id);
    } }, ps_.naam);
  })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 900, fontSize: 12 } }, pg ? pg.naam : "", " — ", ps ? ps.naam : ""), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } }, melding && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: melding.startsWith("Fout") ? C.hot : C.green } }, melding), /* @__PURE__ */ React.createElement("button", { style: window._btnP, onClick: slaOp }, "Opslaan"))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: SS.card }, /* @__PURE__ */ React.createElement("div", { style: SS.cT }, "Opzetmarges"), /* @__PURE__ */ React.createElement("table", { className:"kr-table", style: SS.tbl }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, ["Tot pers.", "Pct %", ""].map(function(h) {
    return /* @__PURE__ */ React.createElement("th", { key: h, style: SS.th }, h);
  }))), /* @__PURE__ */ React.createElement("tbody", null, inst.marges.map(function(m, i) {
    return /* @__PURE__ */ React.createElement("tr", { key: i }, /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement(
      "input",
      {
        value: m.tot,
        style: { ...SS.inp, width: 55, padding: "3px 7px" },
        onChange: function(e) {
          updateMarge(i, "tot", e.target.value);
        }
      }
    )), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement(
      "input",
      {
        value: m.pct,
        style: { ...SS.inp, width: 55, padding: "3px 7px" },
        onChange: function(e) {
          updateMarge(i, "pct", e.target.value);
        }
      }
    )), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, color: C.hot }, onClick: function() {
      updateInst({ marges: inst.marges.filter(function(_, j) {
        return j !== i;
      }) });
    } }, "\u2715")));
  }))), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSA, marginTop: 6, fontSize: 10 }, onClick: function() {
    updateInst({ marges: inst.marges.concat([{ tot: "", pct: "" }]) });
  } }, "+ Rij")), /* @__PURE__ */ React.createElement("div", { style: SS.card }, /* @__PURE__ */ React.createElement("div", { style: SS.cT }, "Buffet per groepsgrootte"), /* @__PURE__ */ React.createElement("table", { className:"kr-table", style: SS.tbl }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, ["Tot pers.", "Aantal bufs", ""].map(function(h) {
    return /* @__PURE__ */ React.createElement("th", { key: h, style: SS.th }, h);
  }))), /* @__PURE__ */ React.createElement("tbody", null, inst.bufs.map(function(b, i) {
    return /* @__PURE__ */ React.createElement("tr", { key: i }, /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement(
      "input",
      {
        value: b.tot,
        style: { ...SS.inp, width: 55, padding: "3px 7px" },
        onChange: function(e) {
          updateBuf(i, "tot", e.target.value);
        }
      }
    )), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement(
      "input",
      {
        value: b.aantal,
        style: { ...SS.inp, width: 55, padding: "3px 7px" },
        onChange: function(e) {
          updateBuf(i, "aantal", e.target.value);
        }
      }
    )), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, color: C.hot }, onClick: function() {
      updateInst({ bufs: inst.bufs.filter(function(_, j) {
        return j !== i;
      }) });
    } }, "\u2715")));
  }))), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSA, marginTop: 6, fontSize: 10 }, onClick: function() {
    updateInst({ bufs: inst.bufs.concat([{ tot: "", aantal: "" }]) });
  } }, "+ Rij"))), /* @__PURE__ */ React.createElement("div", { style: SS.card }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: SS.cT }, "Tijdinstellingen"), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSA, fontSize: 10 }, onClick: voegTijdToe }, "+ Tijdstip")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12, padding: "8px 14px", background: inst.geenTijden ? "#FFF3E0" : C.light, borderRadius: 14, border: "1px solid " + (inst.geenTijden ? "#FF9800" : C.border) } }, /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flex: 1 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked: !!inst.geenTijden,
      onChange: function(e) {
        updateInst({ geenTijden: e.target.checked });
      }
    }
  ), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, fontSize: 12 } }, "Geen tijdinstellingen voor deze productsoort")), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: C.muted } }, inst.geenTijden ? "Alleen Recras deadline wordt gebruikt." : "Tijden worden berekend vanuit onderstaande instellingen.")), /* @__PURE__ */ React.createElement("div", { style: { ...window._alertI, fontSize: 11, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("strong", null, "Tijdlogica:"), ' De eerste tijdstelling is X minuten v\xF3\xF3r de Recras starttijd. Elke volgende tijdstelling is X minuten v\xF3\xF3r de vorige. Bijv: Recras start = 17:00 \u2192 BBQ aansteken (75 min eerder) = 15:45 \u2192 Producten ophalen (45 min eerder dan BBQ) = 15:00. Bij "Verschilt per groepsgrootte" vul je een tabel in met ', /* @__PURE__ */ React.createElement("em", null, "tot x personen \u2192 y minuten"), "."), inst.tijden.map(function(t) {
    return /* @__PURE__ */ React.createElement("div", { key: t.id, style: { background: C.gray, borderRadius: 14, marginBottom: 6, padding: "8px 12px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        value: t.naam,
        style: { ...SS.inp, flex: 1, minWidth: 120, padding: "3px 8px", fontSize: 12 },
        onChange: function(e) {
          updateTijd(t.id, "naam", e.target.value);
        }
      }
    ), /* @__PURE__ */ React.createElement(
      "select",
      {
        value: t.kwalificatie || "Algemeen",
        style: { ...SS.inp, width: 90, padding: "2px 6px", fontSize: 11 },
        onChange: function(e) {
          updateTijd(t.id, "kwalificatie", e.target.value);
        }
      },
      /* @__PURE__ */ React.createElement("option", { value: "Algemeen" }, "Algemeen"),
      /* @__PURE__ */ React.createElement("option", { value: "BBQ" }, "BBQ"),
      /* @__PURE__ */ React.createElement("option", { value: "Oven" }, "Oven"),
      /* @__PURE__ */ React.createElement("option", { value: "Frituur" }, "Frituur")
    ), /* @__PURE__ */ React.createElement(
      "select",
      {
        value: t.basis || "vorige",
        style: { ...SS.inp, width: 110, padding: "2px 6px", fontSize: 11 },
        onChange: function(e) {
          updateTijd(t.id, "basis", e.target.value);
        }
      },
      /* @__PURE__ */ React.createElement("option", { value: "recras" }, "v.a. Recras tijd"),
      /* @__PURE__ */ React.createElement("option", { value: "vorige" }, "v.a. vorige stap")
    ), !t.perGroep && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 11, color: C.muted, whiteSpace: "nowrap" } }, "min:"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        value: t.minuten,
        style: { ...SS.inp, width: 60, padding: "3px 6px" },
        onChange: function(e) {
          updateTijd(t.id, "minuten", e.target.value);
        }
      }
    )), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 5, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        checked: !!t.perGroep,
        onChange: function(e) {
          updateTijd(t.id, "perGroep", e.target.checked);
        }
      }
    ), "Per groepsgrootte"), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, color: C.hot }, onClick: function() {
      verwijderTijd(t.id);
    } }, "\u2715")), t.perGroep && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, paddingLeft: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.muted, marginBottom: 4 } }, "Per groepsgrootte (min. voor vorige/Recras):"), (t.tredes || []).map(function(tr, ti) {
      return /* @__PURE__ */ React.createElement("div", { key: ti, style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: C.muted } }, "Tot"), /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "number",
          value: tr.tot,
          style: { ...SS.inp, width: 60, padding: "2px 6px", fontSize: 11 },
          onChange: function(e) {
            var nieuwTredes = (t.tredes || []).map(function(x, xi) {
              return xi === ti ? Object.assign({}, x, { tot: e.target.value }) : x;
            });
            updateTijd(t.id, "tredes", nieuwTredes);
          }
        }
      ), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: C.muted } }, "pers."), /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "number",
          value: tr.min,
          style: { ...SS.inp, width: 60, padding: "2px 6px", fontSize: 11 },
          onChange: function(e) {
            var nieuwTredes = (t.tredes || []).map(function(x, xi) {
              return xi === ti ? Object.assign({}, x, { min: e.target.value }) : x;
            });
            updateTijd(t.id, "tredes", nieuwTredes);
          }
        }
      ), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: C.muted } }, "min."), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, color: C.hot, fontSize: 10 }, onClick: function() {
        var nieuwTredes = (t.tredes || []).filter(function(_, xi) {
          return xi !== ti;
        });
        updateTijd(t.id, "tredes", nieuwTredes);
      } }, "\u2715"));
    }), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSA, fontSize: 10, marginTop: 4 }, onClick: function() {
      var nieuwTredes = (t.tredes || []).concat([{ tot: "", min: "" }]);
      updateTijd(t.id, "tredes", nieuwTredes);
    } }, "+ Groepsgrootte trede")));
  })));
}

  window._TijdenTab = TijdenTab;
})();
