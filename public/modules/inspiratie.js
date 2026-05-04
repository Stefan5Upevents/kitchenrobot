// KitchenRobot module: inspiratie.js
// Geextraheerd uit index.html op 2026-05-04T21:49:02.594Z
// Bevat: InspiratieScreen
// Externe refs (via window._): C, SS, alertW, btnP, btnSG
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function InspiratieScreen() {
  var _a, _b;
  var [omschrijving, setOmschrijving] = useState("");
  var [bezig, setBezig] = useState(false);
  var [resultaat, setResultaat] = useState(null);
  var [fout, setFout] = useState("");
  var [geschiedenis, setGeschiedenis] = useState([]);
  var [sessieId, setSessieId] = useState(null);
  var [vorigeId, setVorigeId] = useState(null);
  var [sessieGeschiedenis, setSessieGeschiedenis] = useState([]);
  useEffect(function() {
    if (!window._supa) return;
    window._supa.from("inspiratie_aanvragen").select("id, omschrijving, status, resultaat_titel, aangemaakt_op, sessie_id").order("aangemaakt_op", { ascending: false }).limit(20).then(function(r) {
      setGeschiedenis(r.data || []);
    });
  }, []);
  function zoekInspiratie(tekst, vervolg) {
    var vraag = tekst || omschrijving;
    if (!vraag.trim()) return;
    setBezig(true);
    setFout("");
    if (!vervolg) {
      setSessieId(null);
      setVorigeId(null);
      setSessieGeschiedenis([]);
      setResultaat(null);
    }
    fetch("https://aezatnwsrhlwtykpixsq.supabase.co/functions/v1/inspiratie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        omschrijving: vraag.trim(),
        sessie_id: vervolg ? sessieId : null,
        vorige_aanvraag_id: vervolg ? vorigeId : null
      })
    }).then(function(r) {
      return r.json();
    }).then(function(d) {
      setBezig(false);
      if (d.error) {
        setFout(d.error);
        return;
      }
      setResultaat(d);
      setSessieId(d.sessie_id);
      setVorigeId(d.id);
      setSessieGeschiedenis(function(prev) {
        return prev.concat([{ vraag: vraag.trim(), antwoord: d }]);
      });
      if (!vervolg) setOmschrijving("");
      setGeschiedenis(function(prev) {
        return [{ id: d.id, omschrijving: vraag.trim(), status: "verwerkt", resultaat_titel: d.titel, aangemaakt_op: (/* @__PURE__ */ new Date()).toISOString(), sessie_id: d.sessie_id }].concat(prev);
      });
    }).catch(function(e) {
      setBezig(false);
      setFout(e.message);
    });
  }
  function nieuweSessie() {
    setSessieId(null);
    setVorigeId(null);
    setSessieGeschiedenis([]);
    setResultaat(null);
    setOmschrijving("");
  }
  function laadGeschiedenisItem(item) {
    if (!window._supa) return;
    window._supa.from("inspiratie_aanvragen").select("*").eq("id", item.id).single().then(function(r) {
      if (!r.data) return;
      var d = r.data;
      var resultaatParsed = {};
      try {
        if (d.resultaat_prompt) resultaatParsed = JSON.parse(d.resultaat_prompt);
      } catch (e) {
      }
      setResultaat({
        id: d.id,
        sessie_id: d.sessie_id,
        titel: d.resultaat_titel,
        beschrijving: d.resultaat_beschrijving,
        bronnen: d.resultaat_bronnen || [],
        sligro: d.resultaat_sligro || [],
        afbeeldingen: d.resultaat_afbeeldingen || [],
        ideeen: resultaatParsed.ideeen || [],
        vervolgvragen: d.vervolgvragen || []
      });
      setOmschrijving(d.omschrijving);
      setSessieId(d.sessie_id);
      setVorigeId(d.id);
      setSessieGeschiedenis([{ vraag: d.omschrijving, antwoord: { titel: d.resultaat_titel } }]);
    });
  }
  var heeftSessie = sessieId && sessieGeschiedenis.length > 0;
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: window._C.night, marginBottom: 4 } }, "\u2728 Inspiratie"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: window._C.muted } }, "Stel een gerichte vraag — je krijgt concrete idee\xEBn + Sligro producten direct uit het assortiment.")), heeftSessie && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#E8F5E9", border: "1px solid #A5D6A7", borderRadius: 14, padding: "5px 12px", fontSize: 11, color: "#2E7D32", fontWeight: 700 } }, "💬 Sessie actief \xB7 ", sessieGeschiedenis.length, " vraag", sessieGeschiedenis.length > 1 ? "en" : ""), /* @__PURE__ */ React.createElement("button", { style: { ...window._SS.btn, fontSize: 11, padding: "5px 10px" }, onClick: nieuweSessie }, "Nieuwe sessie"))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 16, padding: 16, border: "1px solid #E8EEF3", marginBottom: 14 } }, heeftSessie && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: window._C.muted, marginBottom: 8, padding: "6px 10px", background: "#F7F9FC", borderRadius: 100, border: "1px solid #E8EEF3" } }, "Vervolg op: ", /* @__PURE__ */ React.createElement("strong", null, ((_b = (_a = sessieGeschiedenis[sessieGeschiedenis.length - 1]) == null ? void 0 : _a.antwoord) == null ? void 0 : _b.titel) || "...")), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      style: { ...window._SS.inp, minHeight: 180, resize: "vertical", fontSize: 14, lineHeight: 1.7 },
      value: omschrijving,
      onChange: function(e) {
        setOmschrijving(e.target.value);
      },
      placeholder: heeftSessie ? "Stel een vervolgvraag..." : "Bijv: 'borrelplateau voor 80 personen, zomers, max €8 p.p.'",
      onKeyDown: function(e) {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
          zoekInspiratie(omschrijving, heeftSessie);
        }
      }
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10, display: "flex", gap: 8, alignItems: "center" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      style: { ...window._btnP, fontSize: 13, padding: "9px 20px" },
      onClick: function() {
        zoekInspiratie(omschrijving, heeftSessie);
      },
      disabled: bezig || !omschrijving.trim()
    },
    bezig ? "\u23F3 Zoeken..." : heeftSessie ? "💬 Vervolgvraag" : "\u2728 Zoek inspiratie"
  ), bezig && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: window._C.muted } }, "~15 sec...")), fout && /* @__PURE__ */ React.createElement("div", { style: { ...window._alertW, marginTop: 10 } }, "\u26A0 ", fout)), !resultaat && !bezig && /* @__PURE__ */ React.createElement("div", { style: { background: "#F7F9FC", borderRadius: 16, padding: 14, border: "1px solid #E8EEF3", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: window._C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 } }, "Voorbeelden — klik om in te vullen"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, [
    "Borrelplateau voor 80 personen, zomers, €6-8 p.p.",
    "Vegetarisch buffet Midden-Oosterse smaken voor 60 personen",
    "Trendy dessert snacks voor VIP cocktail reception",
    "Japanse streetfood items die Sligro levert",
    "Warme winter soepen voor outdoor event 150 personen"
  ].map(function(v) {
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: v,
        style: { ...window._btnSG, fontSize: 11, whiteSpace: "normal", textAlign: "left" },
        onClick: function() {
          setOmschrijving(v);
        }
      },
      v
    );
  }))), resultaat && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 16, padding: 18, border: "1px solid #E8EEF3", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 900, color: window._C.night, marginBottom: 6 } }, resultaat.titel), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "#445", lineHeight: 1.6 } }, resultaat.beschrijving)), (resultaat.ideeen || []).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 16, padding: 18, border: "1px solid #E8EEF3", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: window._C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 } }, "💡 Concrete idee\xEBn"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, resultaat.ideeen.map(function(idee, i) {
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 12, padding: "10px 14px", background: "#F7F9FC", borderRadius: 14, border: "1px solid #E8EEF3" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 26, height: 26, background: window._C.night, borderRadius: 100, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 12, flexShrink: 0 } }, i + 1), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 13, color: window._C.night, marginBottom: 2 } }, idee.naam), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "#556" } }, idee.omschrijving), idee.bereiding && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: window._C.muted, marginTop: 2 } }, "\u2699 ", idee.bereiding)), /* @__PURE__ */ React.createElement(
      "button",
      {
        style: { ...window._btnSG, fontSize: 10, padding: "4px 8px", flexShrink: 0, alignSelf: "center" },
        onClick: function() {
          setOmschrijving("Vertel meer over: " + idee.naam);
        }
      },
      "Verdiep \u2192"
    ));
  }))), (resultaat.sligro || []).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 16, padding: 18, border: "1px solid #E8EEF3", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: window._C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 } }, "🛒 Sligro assortiment — direct bestellen"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, resultaat.sligro.map(function(s, i) {
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "#F7F9FC", borderRadius: 14, border: "1px solid #E8EEF3" } }, s.artnr && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: window._C.muted, background: "#E8EEF3", borderRadius: 8, padding: "2px 6px", flexShrink: 0 } }, s.artnr), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: window._C.night } }, s.naam), s.toepassing && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: window._C.muted } }, s.toepassing)), /* @__PURE__ */ React.createElement(
      "a",
      {
        href: s.url,
        target: "_blank",
        rel: "noopener noreferrer",
        style: { background: "#FF6B00", color: "#fff", borderRadius: 100, padding: "6px 12px", textDecoration: "none", fontSize: 11, fontWeight: 700, flexShrink: 0, display: "flex", alignItems: "center", gap: 4 }
      },
      "Sligro \u2192"
    ));
  }))), (resultaat.vervolgvragen || []).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { background: "#F0F7F4", borderRadius: 16, padding: 14, border: "1px solid #C8E6C9", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "#2E7D32", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 } }, "💬 Verder met deze sessie"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, resultaat.vervolgvragen.map(function(v, i) {
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: i,
        style: { background: "#fff", border: "1px solid #A5D6A7", borderRadius: 14, padding: "7px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", color: "#2E7D32", textAlign: "left", fontWeight: 600 },
        onClick: function() {
          setOmschrijving(v);
          zoekInspiratie(v, true);
        }
      },
      v
    );
  }))), (resultaat.bronnen || []).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 16, padding: 14, border: "1px solid #E8EEF3" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: window._C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 } }, "Bronnen"), resultaat.bronnen.map(function(b, i) {
    var typeKl = { recept: "#2E7D32", trend: "#1565C0", restaurant: "#6A1B9A", artikel: "#E65100" }[b.type] || window._C.muted;
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid #F0F4F8" } }, /* @__PURE__ */ React.createElement("span", { style: { background: typeKl + "20", color: typeKl, borderRadius: 8, padding: "1px 6px", fontSize: 10, fontWeight: 700, flexShrink: 0 } }, b.type || "bron"), /* @__PURE__ */ React.createElement(
      "a",
      {
        href: b.url,
        target: "_blank",
        rel: "noopener noreferrer",
        style: { fontSize: 12, color: window._C.aqua, textDecoration: "underline", fontWeight: 600 }
      },
      b.titel
    ));
  })))), /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 16, padding: 14, border: "1px solid #E8EEF3", position: "sticky", top: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: window._C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 } }, "Eerdere zoekopdrachten"), geschiedenis.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: window._C.muted } }, "Nog geen zoekopdrachten."), geschiedenis.map(function(g) {
    var isActief = g.sessie_id && g.sessie_id === sessieId;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: g.id,
        style: { padding: "8px 0", borderBottom: "1px solid #F0F4F8", cursor: "pointer", opacity: isActief ? 1 : 0.8 },
        onClick: function() {
          laadGeschiedenisItem(g);
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: isActief ? 700 : 600, color: isActief ? window._C.aqua : window._C.night, marginBottom: 2 } }, isActief && "\u25B6 ", g.resultaat_titel || g.omschrijving),
      /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: window._C.muted } }, new Date(g.aangemaakt_op).toLocaleDateString("nl-NL"))
    );
  }))));
}

  window._InspiratieScreen = InspiratieScreen;
})();
