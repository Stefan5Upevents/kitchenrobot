// KitchenRobot module: instructies-tab.js
// Geextraheerd uit index.html op 2026-05-05T12:24:49.859Z (v9 AST-walk v5)
// Bevat: InstructiesTab
// Externe refs (via window._): (geen)
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function InstructiesTab() {
  var [instructies, setInstructies] = useState([]);
  var [laden, setLaden] = useState(true);
  var [bewerk, setBewerk] = useState(null);
  var [toonFormulier, setToonFormulier] = useState(false);
  var [filterNiveau, setFilterNiveau] = useState("alle");
  var [melding, setMelding] = useState("");
  var taken = window._stamKoppelingen ? [] : [];
  var gerechten = window._stamGerechten || [];
  var menus = window._stamMenus || [];
  var leeg = { titel: "", titel_en: "", inhoud: "", inhoud_en: "", niveau: "taak", koppel_id: "", koppel_naam: "", outlet_code: "beide" };
  function toon(msg) {
    setMelding(msg);
    setTimeout(function() {
      setMelding("");
    }, 3e3);
  }
  useEffect(function() {
    laadInstructies();
  }, []);
  function laadInstructies() {
    setLaden(true);
    window._supa.from("instructie_documenten").select("*").order("niveau").order("koppel_naam").then(function(r) {
      setInstructies(r.data || []);
      setLaden(false);
    });
  }
  function getKoppelOpties(niveau) {
    if (niveau === "taak") {
      return (window._stamKoppelingen || []).length > 0 ? window._stamKoppelingen.map(function(k) {
        return { id: k.id, naam: k.recras_naam || k.naam || k.id };
      }) : [];
    }
    if (niveau === "gerecht") return (window._stamGerechten || []).map(function(g) {
      return { id: g.id, naam: g.naam };
    });
    if (niveau === "menu") return (window._stamMenus || []).map(function(m) {
      return { id: m.id, naam: m.naam };
    });
    if (niveau === "haccp") return [];
    return [];
  }
  var [haccpPunten, setHaccpPunten] = useState([]);
  var [taakTemplates, setTaakTemplates] = useState([]);
  useEffect(function() {
    window._supa.from("kiosk_haccp_punten").select("id, naam, outlet_code").order("naam").then(function(r) {
      setHaccpPunten(r.data || []);
    });
    window._supa.from("kiosk_taak_templates").select("id, naam").order("volgorde").then(function(r) {
      setTaakTemplates(r.data || []);
    });
  }, []);
  function getKoppelOptiesVolledig(niveau) {
    if (niveau === "taak") return taakTemplates.map(function(t) {
      return { id: t.id, naam: t.naam };
    });
    if (niveau === "gerecht") return (window._stamGerechten || []).map(function(g) {
      return { id: g.id, naam: g.naam };
    });
    if (niveau === "menu") return (window._stamMenus || []).map(function(m) {
      return { id: m.id, naam: m.naam };
    });
    if (niveau === "haccp") return haccpPunten.map(function(h) {
      return { id: h.id, naam: h.naam + " (" + h.outlet_code + ")" };
    });
    return [];
  }
  function slaOp() {
    if (!bewerk.titel) {
      toon("Vul een titel in");
      return;
    }
    if (!bewerk.koppel_id) {
      toon("Koppel aan een item");
      return;
    }
    if (!bewerk.inhoud) {
      toon("Vul de inhoud in (NL)");
      return;
    }
    var opties = getKoppelOptiesVolledig(bewerk.niveau);
    var gekoppeld = opties.find(function(o) {
      return o.id === bewerk.koppel_id;
    });
    var data = Object.assign({}, bewerk, {
      koppel_naam: gekoppeld ? gekoppeld.naam : "",
      bijgewerkt_op: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (data.id) {
      window._supa.from("instructie_documenten").update(data).eq("id", data.id).then(function(r) {
        if (r.error) {
          toon("Fout: " + r.error.message);
          return;
        }
        toon("✓ Opgeslagen");
        laadInstructies();
        setToonFormulier(false);
      });
    } else {
      delete data.id;
      window._supa.from("instructie_documenten").insert(data).select("*").then(function(r) {
        if (r.error) {
          toon("Fout: " + r.error.message);
          return;
        }
        toon("✓ Instructie aangemaakt");
        laadInstructies();
        setToonFormulier(false);
      });
    }
  }
  function verwijder(id) {
    if (!window.confirm("Instructie verwijderen?")) return;
    window._supa.from("instructie_documenten").delete().eq("id", id).then(function() {
      laadInstructies();
      toon("✓ Verwijderd");
    });
  }
  var gefilterd = instructies.filter(function(i) {
    return filterNiveau === "alle" || i.niveau === filterNiveau;
  });
  var niveauKleuren = { taak: C.hot, gerecht: C.aqua, menu: C.green, haccp: C.orange };
  var niveauLabels = { taak: "\u2705 Taak", gerecht: "🍽 Gerecht", menu: "📋 Menu", haccp: "🌡 HACCP" };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { ...SS.pT } }, "📄 Instructiedocumenten"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.muted, marginTop: 2 } }, "Medewerkers kunnen deze inzien op de kiosk via 📄 icoontje")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } }, melding && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: C.green, fontWeight: 700 } }, melding), /* @__PURE__ */ React.createElement("button", { style: { ...SS.btnP }, onClick: function() {
    setBewerk(Object.assign({}, leeg));
    setToonFormulier(true);
  } }, "+ Nieuwe instructie"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" } }, [["alle", "Alle"], ["taak", "\u2705 Taken"], ["gerecht", "🍽 Gerechten"], ["menu", "📋 Menus"], ["haccp", "🌡 HACCP"]].map(function(f) {
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: f[0],
        style: { ...SS.tabBtn, background: filterNiveau === f[0] ? C.night : C.light, color: filterNiveau === f[0] ? C.white : C.night, fontWeight: filterNiveau === f[0] ? 700 : 400 },
        onClick: function() {
          setFilterNiveau(f[0]);
        }
      },
      f[1],
      " ",
      f[0] !== "alle" ? "(" + instructies.filter(function(i) {
        return i.niveau === f[0];
      }).length + ")" : "(" + instructies.length + ")"
    );
  })), toonFormulier && bewerk && /* @__PURE__ */ React.createElement("div", { style: { background: C.light, border: "2px solid " + C.aqua, borderRadius: 18, padding: 20, marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 900, fontSize: 15, color: C.night, marginBottom: 14 } }, bewerk.id ? "Instructie bewerken" : "Nieuwe instructie"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { ...SS.lbl } }, "Niveau"), /* @__PURE__ */ React.createElement(
    "select",
    {
      style: { ...SS.inp },
      value: bewerk.niveau,
      onChange: function(e) {
        setBewerk(function(p) {
          return Object.assign({}, p, { niveau: e.target.value, koppel_id: "" });
        });
      }
    },
    /* @__PURE__ */ React.createElement("option", { value: "taak" }, "\u2705 Taak"),
    /* @__PURE__ */ React.createElement("option", { value: "gerecht" }, "🍽 Gerecht"),
    /* @__PURE__ */ React.createElement("option", { value: "menu" }, "📋 Menu"),
    /* @__PURE__ */ React.createElement("option", { value: "haccp" }, "🌡 HACCP punt")
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { ...SS.lbl } }, "Koppelen aan"), /* @__PURE__ */ React.createElement(
    "select",
    {
      style: { ...SS.inp },
      value: bewerk.koppel_id,
      onChange: function(e) {
        setBewerk(function(p) {
          return Object.assign({}, p, { koppel_id: e.target.value });
        });
      }
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "— Kies item —"),
    getKoppelOptiesVolledig(bewerk.niveau).map(function(o) {
      return /* @__PURE__ */ React.createElement("option", { key: o.id, value: o.id }, o.naam);
    })
  ))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { ...SS.lbl } }, "Titel (NL)"), /* @__PURE__ */ React.createElement("input", { style: { ...SS.inp }, value: bewerk.titel, placeholder: "bijv. Bereiding zalm", onChange: function(e) {
    setBewerk(function(p) {
      return Object.assign({}, p, { titel: e.target.value });
    });
  } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { ...SS.lbl } }, "Titel (EN) — optioneel"), /* @__PURE__ */ React.createElement("input", { style: { ...SS.inp }, value: bewerk.titel_en || "", placeholder: "e.g. Salmon preparation", onChange: function(e) {
    setBewerk(function(p) {
      return Object.assign({}, p, { titel_en: e.target.value });
    });
  } }))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { ...SS.lbl } }, "Instructie (NL) *"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      style: { ...SS.inp, height: 160, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 },
      value: bewerk.inhoud,
      placeholder: "Schrijf hier de instructie in het Nederlands...\n\nJe kunt kopjes gebruiken met **Kopje**\nEn stappen met - Stap 1\n- Stap 2",
      onChange: function(e) {
        setBewerk(function(p) {
          return Object.assign({}, p, { inhoud: e.target.value });
        });
      }
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { ...SS.lbl } }, "Instructie (EN) — optioneel"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      style: { ...SS.inp, height: 160, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 },
      value: bewerk.inhoud_en || "",
      placeholder: "Write the instruction in English here...",
      onChange: function(e) {
        setBewerk(function(p) {
          return Object.assign({}, p, { inhoud_en: e.target.value });
        });
      }
    }
  ))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "end" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { ...SS.lbl } }, "Van toepassing voor"), /* @__PURE__ */ React.createElement(
    "select",
    {
      style: { ...SS.inp },
      value: bewerk.outlet_code || "beide",
      onChange: function(e) {
        setBewerk(function(p) {
          return Object.assign({}, p, { outlet_code: e.target.value });
        });
      }
    },
    /* @__PURE__ */ React.createElement("option", { value: "beide" }, "Beide keukens"),
    /* @__PURE__ */ React.createElement("option", { value: "west" }, "Alleen Amsterdam West"),
    /* @__PURE__ */ React.createElement("option", { value: "weesp" }, "Alleen Weesp")
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, paddingBottom: 2 } }, /* @__PURE__ */ React.createElement("button", { style: { ...SS.btnP }, onClick: slaOp }, "Opslaan"), /* @__PURE__ */ React.createElement("button", { style: { ...SS.btn }, onClick: function() {
    setToonFormulier(false);
  } }, "Annuleer")))), laden ? /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", color: C.muted, padding: 40 } }, "Laden...") : gefilterd.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { ...SS.card, textAlign: "center", color: C.muted, padding: 40 } }, filterNiveau === "alle" ? 'Nog geen instructies aangemaakt. Klik op "+ Nieuwe instructie".' : "Geen instructies voor dit niveau.") : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, gefilterd.map(function(ins) {
    var kleur = niveauKleuren[ins.niveau] || C.muted;
    var label = niveauLabels[ins.niveau] || ins.niveau;
    return /* @__PURE__ */ React.createElement("div", { key: ins.id, style: { background: C.white, borderRadius: 16, padding: 14, border: "1px solid " + C.border, borderLeft: "4px solid " + kleur } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { background: kleur + "22", color: kleur, borderRadius: 8, padding: "1px 7px", fontSize: 10, fontWeight: 700 } }, label), ins.outlet_code && ins.outlet_code !== "beide" && /* @__PURE__ */ React.createElement("span", { style: { background: C.light, borderRadius: 8, padding: "1px 7px", fontSize: 10, color: C.muted } }, ins.outlet_code), ins.inhoud_en && /* @__PURE__ */ React.createElement("span", { style: { background: "#E3F2FD", borderRadius: 8, padding: "1px 7px", fontSize: 10, color: "#1565C0" } }, "NL + EN")), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 14, color: C.night } }, ins.titel), ins.koppel_naam && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.muted, marginTop: 1 } }, "Gekoppeld aan: ", ins.koppel_naam), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.night, marginTop: 6, maxHeight: 60, overflow: "hidden", lineHeight: 1.5 } }, ins.inhoud.substring(0, 150), ins.inhoud.length > 150 ? "..." : "")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexShrink: 0 } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        style: { ...SS.btn, padding: "5px 10px", fontSize: 11 },
        onClick: function() {
          setBewerk(Object.assign({}, ins));
          setToonFormulier(true);
        }
      },
      "\u270F\uFE0F Bewerk"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        style: { background: "rgba(232,32,43,.1)", color: C.hot, border: "1px solid rgba(232,32,43,.3)", borderRadius: 100, padding: "5px 10px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" },
        onClick: function() {
          verwijder(ins.id);
        }
      },
      "🗑"
    ))));
  })));
}

  window._InstructiesTab = InstructiesTab;
})();
