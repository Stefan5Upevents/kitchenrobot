// KitchenRobot module: algemeen-tab.js
// Geextraheerd uit index.html op 2026-05-05T12:29:36.055Z (v9 AST-walk v5)
// Bevat: AlgemeenTab
// Externe refs (via window._): btnP
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function AlgemeenTab({ g, items, setItems, productgroepen, onChange, onSave }) {
  var [naam, setNaam] = useState(g.naam || "");
  var [isGn, setIsGn] = useState(!!g.is_gn);
  var [prio, setPrio] = useState(!!g.prio);
  var [portieEenh, setPortieEenh] = useState(g.portie_eenh || "portie");
  var [heeftPres, setHeeftPres] = useState(!!g.heeft_presentatie);
  var [alBuf, setAlBuf] = useState(!!g.toon_in_opzet_alleen_buffet);
  var [afronden, setAfronden] = useState(!!g.altijd_afronden);
  var [melding, setMelding] = useState("");
  var bestaandeKoppelingen = (g.gerecht_productsoort_koppelingen || []).map(function(k) {
    return k.productsoort_id;
  });
  var [gekoppeldePsIds, setGekoppeldePsIds] = useState(bestaandeKoppelingen);
  var [kosten, setKosten] = useState(null);
  useEffect(function() {
    if (!g.ingredienten || !g.ingredienten.length) return;
    window._supa.from("sligro_producten").select("id, prijs_excl, hoeveelheid").in("id", g.ingredienten.map(function(i) {
      return i.sligro_id;
    })).then(function(r) {
      if (!r.data) return;
      var totaal = g.ingredienten.reduce(function(sum, ing) {
        var sp = r.data.find(function(p) {
          return p.id === ing.sligro_id;
        }) || {};
        var prijs = parseFloat(sp.prijs_excl) || 0;
        var verp = parseFloat(sp.hoeveelheid) || 1;
        var gebruik = parseFloat(ing.gebruik_per_portie) || 0;
        if (!prijs || !gebruik) return sum;
        return sum + gebruik / verp * prijs;
      }, 0);
      if (totaal > 0) setKosten(totaal);
    });
  }, []);
  function toggleKoppeling(psId, pgId, aan) {
    if (aan) {
      window._supa.from("gerecht_productsoort_koppelingen").insert({ gerecht_id: g.id, productsoort_id: psId }).then(function(r) {
        if (r.error && !r.error.message.includes("duplicate")) {
          setMelding("Fout: " + r.error.message);
          return;
        }
        var nieuw = gekoppeldePsIds.includes(psId) ? gekoppeldePsIds : gekoppeldePsIds.concat([psId]);
        setGekoppeldePsIds(nieuw);
        setItems(function(prev) {
          return prev.map(function(x) {
            if (x.id !== g.id) return x;
            return Object.assign({}, x, { gerecht_productsoort_koppelingen: nieuw.map(function(id) {
              return { productsoort_id: id };
            }) });
          });
        });
        if (onChange) onChange();
      });
    } else {
      window._supa.from("gerecht_productsoort_koppelingen").delete().eq("gerecht_id", g.id).eq("productsoort_id", psId).then(function() {
        var nieuw = gekoppeldePsIds.filter(function(id) {
          return id !== psId;
        });
        setGekoppeldePsIds(nieuw);
        setItems(function(prev) {
          return prev.map(function(x) {
            if (x.id !== g.id) return x;
            return Object.assign({}, x, { gerecht_productsoort_koppelingen: nieuw.map(function(id) {
              return { productsoort_id: id };
            }) });
          });
        });
        if (onChange) onChange();
      });
    }
  }
  function opslaan() {
    window._supa.from("gerechten").update({
      naam,
      is_gn: isGn,
      prio,
      portie_eenh: portieEenh,
      heeft_presentatie: heeftPres,
      toon_in_opzet_alleen_buffet: alBuf,
      altijd_afronden: afronden
    }).eq("id", g.id).then(function(r) {
      if (r.error) {
        setMelding("Fout: " + r.error.message);
        return;
      }
      setItems(function(prev) {
        return prev.map(function(x) {
          if (x.id !== g.id) return x;
          return Object.assign({}, x, {
            naam,
            is_gn: isGn,
            prio,
            portie_eenh: portieEenh,
            heeft_presentatie: heeftPres,
            toon_in_opzet_alleen_buffet: alBuf,
            altijd_afronden: afronden
          });
        });
      });
      setMelding("Opgeslagen ✓");
      setTimeout(function() {
        setMelding("");
      }, 2e3);
      if (onSave) onSave();
    });
  }
  return /* @__PURE__ */ React.createElement("div", null, kosten !== null && /* @__PURE__ */ React.createElement("div", { style: {
    background: "#F0FAF0",
    borderRadius: 14,
    padding: "8px 14px",
    marginBottom: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: C.muted } }, "Kostprijs per portie:"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: C.green } }, afronden ? "€ " + Math.ceil(kosten * 1e3) / 1e3 : "€ " + kosten.toFixed(3))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: SS.lbl }, "Naam"), /* @__PURE__ */ React.createElement("input", { style: SS.inp, value: naam, onChange: function(e) {
    setNaam(e.target.value);
    if (onChange) onChange();
  } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: SS.lbl }, "Portie-eenheid"), /* @__PURE__ */ React.createElement("select", { style: SS.inp, value: portieEenh, onChange: function(e) {
    setPortieEenh(e.target.value);
    if (onChange) onChange();
  } }, /* @__PURE__ */ React.createElement("option", { value: "portie" }, "portie"), /* @__PURE__ */ React.createElement("option", { value: "stuks" }, "stuks"), /* @__PURE__ */ React.createElement("option", { value: "gram" }, "gram"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: SS.lbl }, "GN gerecht (buffetbak)?"), /* @__PURE__ */ React.createElement("select", { style: SS.inp, value: isGn ? "ja" : "nee", onChange: function(e) {
    setIsGn(e.target.value === "ja");
    if (onChange) onChange();
  } }, /* @__PURE__ */ React.createElement("option", { value: "nee" }, "Nee — presentatie op schaal"), /* @__PURE__ */ React.createElement("option", { value: "ja" }, "Ja — GN bak"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: SS.lbl }, "Prioriteit (PRIO)"), /* @__PURE__ */ React.createElement("select", { style: SS.inp, value: prio ? "ja" : "nee", onChange: function(e) {
    setPrio(e.target.value === "ja");
    if (onChange) onChange();
  } }, /* @__PURE__ */ React.createElement("option", { value: "nee" }, "Nee"), /* @__PURE__ */ React.createElement("option", { value: "ja" }, "Ja"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: SS.lbl }, "Presentatievorm van toepassing?"), /* @__PURE__ */ React.createElement("select", { style: SS.inp, value: heeftPres ? "ja" : "nee", onChange: function(e) {
    setHeeftPres(e.target.value === "ja");
    if (onChange) onChange();
  } }, /* @__PURE__ */ React.createElement("option", { value: "nee" }, "Nee"), /* @__PURE__ */ React.createElement("option", { value: "ja" }, "Ja — stel in op tabblad Presentatievorm"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: SS.lbl }, "Opzetoverzicht weergave"), /* @__PURE__ */ React.createElement("select", { style: SS.inp, value: alBuf ? "ja" : "nee", onChange: function(e) {
    setAlBuf(e.target.value === "ja");
    if (onChange) onChange();
  } }, /* @__PURE__ */ React.createElement("option", { value: "nee" }, "Normaal — alle opzetaantallen"), /* @__PURE__ */ React.createElement("option", { value: "ja" }, "Alleen buffet + presentatievorm")))), /* @__PURE__ */ React.createElement("div", { style: {
    background: afronden ? "#E8F8FF" : C.gray,
    border: "1px solid " + (afronden ? C.aqua : "transparent"),
    borderRadius: 16,
    padding: "12px 14px",
    marginBottom: 12
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 13, color: C.night } }, "Altijd afronden naar boven"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.muted } }, "Benodigde hoeveelheid altijd naar boven afronden (Math.ceil) — geen decimalen")), /* @__PURE__ */ React.createElement("button", { style: {
    background: afronden ? C.aqua : C.white,
    color: afronden ? C.white : C.night,
    border: "2px solid " + C.aqua,
    borderRadius: 20,
    padding: "6px 18px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 12,
    transition: "all 0.15s"
  }, onClick: function() {
    setAfronden(function(v) {
      return !v;
    });
    if (onChange) onChange();
  } }, afronden ? "✓ Aan" : "Uit"))), /* @__PURE__ */ React.createElement("div", { style: { background: C.light, borderRadius: 16, padding: "12px 14px", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 13, marginBottom: 4 } }, "Productsoorten"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.muted, marginBottom: 10 } }, "Dit gerecht verschijnt in alle aangevinkte productsoorten. De instellingen en ingredi\xEBnten blijven gedeeld."), productgroepen.map(function(pg) {
    return /* @__PURE__ */ React.createElement("div", { key: pg.id, style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 12, color: C.night, marginBottom: 4 } }, pg.naam), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, (pg.soorten || []).map(function(ps) {
      var actief = gekoppeldePsIds.includes(ps.id);
      return /* @__PURE__ */ React.createElement("label", { key: ps.id, style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 10px",
        background: actief ? C.aqua : C.white,
        color: actief ? C.white : C.night,
        border: "1px solid " + (actief ? C.aqua : C.border),
        borderRadius: 20,
        cursor: "pointer",
        fontSize: 12,
        fontWeight: actief ? 700 : 400
      } }, /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "checkbox",
          checked: actief,
          onChange: function(e) {
            toggleKoppeling(ps.id, pg.id, e.target.checked);
          },
          style: { display: "none" }
        }
      ), actief ? "✓ " : "", ps.naam);
    })));
  })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: (melding || "").startsWith("Fout") ? C.hot : C.green } }, melding), /* @__PURE__ */ React.createElement("button", { style: window._btnP, onClick: opslaan }, "Opslaan")));
}

  window._AlgemeenTab = AlgemeenTab;
})();
