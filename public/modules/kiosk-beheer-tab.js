// KitchenRobot module: kiosk-beheer-tab.js
// Geextraheerd uit index.html op 2026-05-05T10:36:44.404Z (v9 AST-walk v5)
// Bevat: KioskBeheerTab
// Externe refs (via window._): alertW, btnP, btnSG, tabStyle
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function KioskBeheerTab() {
  var [subtab, setSubtab] = useState("taken");
  var [taken, setTaken] = useState([]);
  var [medewerkers, setMedewerkers] = useState([]);
  var [apparaten, setApparaten] = useState([]);
  var [haccp, setHaccp] = useState([]);
  var [outlets, setOutlets] = useState([]);
  var [sensoren, setSensoren] = useState([]);
  var [laden, setLaden] = useState(true);
  var [melding, setMelding] = useState("");
  var [bewerkItem, setBewerkItem] = useState(null);
  var [nieuwPin, setNieuwPin] = useState("");
  var [nieuwNaam, setNieuwNaam] = useState("");
  var [nieuwOutlet, setNieuwOutlet] = useState("");
  var [nieuwRol, setNieuwRol] = useState("medewerker");
  function toon(t, fout) {
    setMelding(t);
    setTimeout(function() {
      setMelding("");
    }, fout ? 5e3 : 2500);
  }
  useEffect(function() {
    if (!window._supa) return;
    Promise.all([
      window._supa.from("kiosk_taak_templates").select("*").order("volgorde"),
      window._supa.from("kiosk_medewerkers").select("*, kiosk_outlets(naam,code)").order("naam"),
      window._supa.from("kiosk_apparaten").select("*, kiosk_outlets(naam,code)").order("naam"),
      window._supa.from("kiosk_haccp_punten").select("*").order("outlet_code,volgorde"),
      window._supa.from("kiosk_outlets").select("*").order("naam"),
      window._supa.from("kiosk_sensoren").select("*").eq("outlet_code","weesp").order("naam")
    ]).then(function(results) {
      setTaken(results[0].data || []);
      setMedewerkers(results[1].data || []);
      setApparaten(results[2].data || []);
      setHaccp(results[3].data || []);
      setOutlets(results[4].data || []);
      setSensoren(results[5].data || []);
      setLaden(false);
    });
  }, []);
  var subTabs = [["taken", "📋 Taken"], ["medewerkers", "👤 Medewerkers"], ["apparaten", "📱 Apparaten"], ["haccp", "🌡 HACCP"], ["waste", "🗑 Waste"], ["sensoren", "📡 Sensoren"]];
  var catKleuren = { "Inkopen & ontvangen": "#1565C0", "Temperatuurbeheer": "#E65100", "Bereiden": "#2E7D32", "Opslag": "#6A1B9A", "Schoonmaak (periodiek)": "#00695C", "Schoonmaak": "#00695C", "Presenteren & serveren": "#AD1457", "Overig": "#546E7A" };
  var freqKleur = { "dagelijks": "#E8202B", "wekelijks": "#3FB8C4", "maandelijks": "#FF9800", "jaarlijks": "#9E9E9E" };
  async function voegMedewerkerToe() {
    if (!nieuwNaam.trim() || !nieuwPin.trim() || !nieuwOutlet) {
      toon("Vul naam, PIN en keuken in", true);
      return;
    }
    if (nieuwPin.length !== 4 || !/^\d+$/.test(nieuwPin)) {
      toon("PIN moet exact 4 cijfers zijn", true);
      return;
    }
    var sess = (await window._supa.auth.getSession()).data.session;
    var resp = await fetch(window._supa.functionsUrl + "/kiosk-medewerker-beheer", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + (sess && sess.access_token), "apikey": window._supa.supabaseKey },
      body: JSON.stringify({ actie: "medewerker_aanmaken", naam: nieuwNaam.trim(), outlet_id: nieuwOutlet, rol: nieuwRol, pincode: nieuwPin })
    });
    var rJson = await resp.json();
    Promise.resolve({ data: rJson.ok ? [{ id: rJson.id, naam: rJson.naam }] : null, error: rJson.error ? { message: rJson.error } : null }).then(function(r) {
      if (r.error) {
        toon("Fout: " + r.error.message, true);
        return;
      }
      setMedewerkers(function(prev) {
        return prev.concat(r.data);
      });
      setNieuwNaam("");
      setNieuwPin("");
      setNieuwOutlet("");
      setNieuwRol("medewerker");
      toon("Medewerker toegevoegd ✓");
    });
  }
  async function voegApparaatToe() {
    if (!nieuwNaam.trim() || !nieuwOutlet) {
      toon("Vul naam en keuken in", true);
      return;
    }
    window._supa.from("kiosk_apparaten").insert({
      naam: nieuwNaam.trim(),
      outlet_id: nieuwOutlet
    }).select("*, kiosk_outlets(naam,code)").then(function(r) {
      if (r.error) {
        toon("Fout: " + r.error.message, true);
        return;
      }
      setApparaten(function(prev) {
        return prev.concat(r.data);
      });
      setNieuwNaam("");
      setNieuwOutlet("");
      toon("Apparaat geregistreerd ✓");
    });
  }
  function toggleTaakActief(taak) {
    window._supa.from("kiosk_taak_templates").update({ actief: !taak.actief }).eq("id", taak.id).then(function(r) {
      if (r.error) {
        toon("Fout", true);
        return;
      }
      setTaken(function(prev) {
        return prev.map(function(t) {
          return t.id === taak.id ? Object.assign({}, t, { actief: !t.actief }) : t;
        });
      });
    });
  }
  var [taakBewerk, setTaakBewerk] = useState(null);
  var taakLeeg = { naam: "", beschrijving: "", categorie: "Temperatuurbeheer", type: "checklist", frequentie: "wekelijks", outlet_codes: ["west", "weesp"], min_temp: "", max_temp: "", verplicht: true };
  function slaaTaakOp() {
    if (!taakBewerk || !taakBewerk.naam) {
      toon("Vul een naam in", true);
      return;
    }
    var data = {
      naam: taakBewerk.naam,
      beschrijving: taakBewerk.beschrijving || "",
      categorie: taakBewerk.categorie,
      type: taakBewerk.type,
      frequentie: taakBewerk.frequentie,
      outlet_codes: taakBewerk.outlet_codes || ["west", "weesp"],
      min_temp: taakBewerk.min_temp || null,
      max_temp: taakBewerk.max_temp || null,
      verplicht: taakBewerk.verplicht !== false,
      pdf_url: taakBewerk.pdf_url || null
    };
    if (taakBewerk.id) {
      window._supa.from("kiosk_taak_templates").update(data).eq("id", taakBewerk.id).then(function(r) {
        if (r.error) {
          toon("Fout: " + r.error.message, true);
          return;
        }
        setTaken(function(prev) {
          return prev.map(function(t) {
            return t.id === taakBewerk.id ? Object.assign({}, t, data) : t;
          });
        });
        setTaakBewerk(null);
        toon("Opgeslagen ✓");
      });
    } else {
      window._supa.from("kiosk_taak_templates").insert(data).select("*").then(function(r) {
        if (r.error) {
          toon("Fout: " + r.error.message, true);
          return;
        }
        setTaken(function(prev) {
          return prev.concat(r.data);
        });
        setTaakBewerk(null);
        toon("Taak toegevoegd ✓");
      });
    }
  }
  function verwijderTaak(taak) {
    if (!window.confirm("Taak '" + taak.naam + "' verwijderen?")) return;
    window._supa.from("kiosk_taak_templates").delete().eq("id", taak.id).then(function(r) {
      if (r.error) {
        toon("Fout", true);
        return;
      }
      setTaken(function(prev) {
        return prev.filter(function(t) {
          return t.id !== taak.id;
        });
      });
      toon("Verwijderd ✓");
    });
  }
  var [haccpBewerk, setHaccpBewerk] = useState(null);
  var haccpLeeg = { naam: "", outlet_code: "west", type: "koeling", min_temp: "", max_temp: "" };
  function slaaHaccpOp() {
    if (!haccpBewerk || !haccpBewerk.naam) {
      toon("Vul een naam in", true);
      return;
    }
    var data = { naam: haccpBewerk.naam, outlet_code: haccpBewerk.outlet_code, type: haccpBewerk.type, min_temp: haccpBewerk.min_temp || null, max_temp: haccpBewerk.max_temp || null };
    if (haccpBewerk.id) {
      window._supa.from("kiosk_haccp_punten").update(data).eq("id", haccpBewerk.id).then(function(r) {
        if (r.error) {
          toon("Fout", true);
          return;
        }
        setHaccp(function(prev) {
          return prev.map(function(h) {
            return h.id === haccpBewerk.id ? Object.assign({}, h, data) : h;
          });
        });
        setHaccpBewerk(null);
        toon("Opgeslagen ✓");
      });
    } else {
      window._supa.from("kiosk_haccp_punten").insert(data).select("*").then(function(r) {
        if (r.error) {
          toon("Fout", true);
          return;
        }
        setHaccp(function(prev) {
          return prev.concat(r.data);
        });
        setHaccpBewerk(null);
        toon("Punt toegevoegd ✓");
      });
    }
  }
  function verwijderHaccp(punt) {
    if (!window.confirm("Punt '" + punt.naam + "' verwijderen?")) return;
    window._supa.from("kiosk_haccp_punten").delete().eq("id", punt.id).then(function(r) {
      if (r.error) {
        toon("Fout", true);
        return;
      }
      setHaccp(function(prev) {
        return prev.filter(function(h) {
          return h.id !== punt.id;
        });
      });
      toon("Verwijderd ✓");
    });
  }
  if (laden) return /* @__PURE__ */ React.createElement("div", { style: { padding: 40, textAlign: "center", color: C.muted } }, "Kiosk data laden...");
  return /* @__PURE__ */ React.createElement("div", null, melding && /* @__PURE__ */ React.createElement("div", { style: {
    marginBottom: 12,
    padding: "8px 14px",
    borderRadius: 14,
    fontSize: 12,
    fontWeight: 700,
    background: melding.startsWith("Fout") ? "#FFEBEE" : "#E8F5E9",
    color: melding.startsWith("Fout") ? C.hot : C.green
  } }, melding), /* @__PURE__ */ React.createElement("div", { style: { ...SS.card, marginBottom: 0, borderRadius: "10px 10px 0 0", background: C.night, padding: "16px 20px" } }, /* @__PURE__ */ React.createElement("div", { style: { color: C.white, fontWeight: 900, fontSize: 16 } }, "📱 Kiosk Beheer"), /* @__PURE__ */ React.createElement("div", { style: { color: C.aqua, fontSize: 11, marginTop: 2 } }, outlets.map(function(o) {
    return o.naam;
  }).join(" \xB7 "), " \u2022", " ", taken.filter(function(t) {
    return t.actief;
  }).length, " actieve taken \u2022", " ", medewerkers.filter(function(m) {
    return m.actief;
  }).length, " medewerkers \u2022", " ", apparaten.filter(function(a) {
    return a.actief;
  }).length, " tablets")), /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: "0 0 10px 10px", marginBottom: 14, boxShadow: "0 1px 4px rgba(35,71,86,.07)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", borderBottom: "2px solid #E8EEF2" } }, subTabs.map(function(item) {
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: item[0],
        style: { ...window._tabStyle(subtab === item[0]), fontSize: 12 },
        onClick: function() {
          setSubtab(item[0]);
        }
      },
      item[1]
    );
  })), /* @__PURE__ */ React.createElement("div", { style: { padding: 20 } }, subtab === "taken" && /* @__PURE__ */ React.createElement("div", null, taakBewerk && /* @__PURE__ */ React.createElement(
    "div",
    {
      style: { position: "fixed", inset: 0, background: "rgba(35,71,86,0.6)", zIndex: 1e3, display: "flex", alignItems: "center", justifyContent: "center" },
      onClick: function(e) {
        if (e.target === e.currentTarget) setTaakBewerk(null);
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 14, width: "min(560px,95vw)", maxHeight: "88vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(35,71,86,.3)" } }, /* @__PURE__ */ React.createElement("div", { style: { background: C.night, padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { color: C.white, fontWeight: 900, fontSize: 14 } }, taakBewerk.id ? "Taak bewerken" : "Nieuwe taak"), /* @__PURE__ */ React.createElement("button", { onClick: function() {
      setTaakBewerk(null);
    }, style: { background: "transparent", border: "none", color: C.white, fontSize: 20, cursor: "pointer" } }, "\u2715")), /* @__PURE__ */ React.createElement("div", { style: { overflowY: "auto", padding: 20 } }, [["naam", "Naam"], ["beschrijving", "Beschrijving"]].map(function(f) {
      return /* @__PURE__ */ React.createElement("div", { key: f[0], style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, f[1]), /* @__PURE__ */ React.createElement("input", { style: SS.inp, value: taakBewerk[f[0]] || "", onChange: function(e) {
        setTaakBewerk(function(p) {
          return Object.assign({}, p, { [f[0]]: e.target.value });
        });
      } }));
    }), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Categorie"), /* @__PURE__ */ React.createElement("select", { style: SS.inp, value: taakBewerk.categorie || "", onChange: function(e) {
      setTaakBewerk(function(p) {
        return Object.assign({}, p, { categorie: e.target.value });
      });
    } }, ["Inkopen & ontvangen", "Temperatuurbeheer", "Bereiden", "Opslag", "Schoonmaak", "Schoonmaak (periodiek)", "Presenteren & serveren", "Overig"].map(function(c) {
      return /* @__PURE__ */ React.createElement("option", { key: c }, c);
    }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Type"), /* @__PURE__ */ React.createElement("select", { style: SS.inp, value: taakBewerk.type || "", onChange: function(e) {
      setTaakBewerk(function(p) {
        return Object.assign({}, p, { type: e.target.value });
      });
    } }, ["checklist", "temperatuur", "meerdere_temps", "getal", "foto", "tekst"].map(function(t) {
      return /* @__PURE__ */ React.createElement("option", { key: t }, t);
    }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Frequentie"), /* @__PURE__ */ React.createElement("select", { style: SS.inp, value: taakBewerk.frequentie || "", onChange: function(e) {
      setTaakBewerk(function(p) {
        return Object.assign({}, p, { frequentie: e.target.value });
      });
    } }, ["dagelijks", "wekelijks", "maandelijks", "jaarlijks"].map(function(f) {
      return /* @__PURE__ */ React.createElement("option", { key: f }, f);
    }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Min temp (\xB0C)"), /* @__PURE__ */ React.createElement("input", { style: SS.inp, type: "number", value: taakBewerk.min_temp || "", onChange: function(e) {
      setTaakBewerk(function(p) {
        return Object.assign({}, p, { min_temp: e.target.value });
      });
    }, placeholder: "bijv. 2" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Max temp (\xB0C)"), /* @__PURE__ */ React.createElement("input", { style: SS.inp, type: "number", value: taakBewerk.max_temp || "", onChange: function(e) {
      setTaakBewerk(function(p) {
        return Object.assign({}, p, { max_temp: e.target.value });
      });
    }, placeholder: "bijv. 7" }))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Keukens"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10 } }, ["west", "weesp"].map(function(c) {
      var aan = (taakBewerk.outlet_codes || []).includes(c);
      return /* @__PURE__ */ React.createElement("label", { key: c, style: { display: "flex", alignItems: "center", gap: 5, cursor: "pointer" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: aan, onChange: function(e) {
        setTaakBewerk(function(p) {
          var codes = (p.outlet_codes || []).slice();
          if (e.target.checked) {
            if (!codes.includes(c)) codes.push(c);
          } else {
            codes = codes.filter(function(x) {
              return x !== c;
            });
          }
          return Object.assign({}, p, { outlet_codes: codes });
        });
      } }), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700 } }, c === "west" ? "Amsterdam West" : "Weesp"));
    }))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "📄 PDF instructiedocument (URL)"), /* @__PURE__ */ React.createElement("input", { style: SS.inp, placeholder: "https://... of leeg laten", value: taakBewerk.pdf_url || "", onChange: function(e) { setTaakBewerk(function(p) { return Object.assign({}, p, { pdf_url: e.target.value || null }); }); } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.muted, marginTop: 3 } }, "Upload PDF eerst naar Supabase Storage (kiosk-pdfs bucket) en plak hier de publieke URL")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginTop: 16 } }, /* @__PURE__ */ React.createElement("button", { style: window._btnP, onClick: slaaTaakOp }, "Opslaan"), /* @__PURE__ */ React.createElement("button", { style: window._btnSG, onClick: function() {
      setTaakBewerk(null);
    } }, "Annuleren"))))
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: SS.cT }, "Taak Templates (", taken.length, ")"), /* @__PURE__ */ React.createElement("button", { style: window._btnP, onClick: function() {
    setTaakBewerk(Object.assign({}, taakLeeg));
  } }, "+ Nieuwe taak")), /* @__PURE__ */ React.createElement("table", { className:"kr-table", style: { ...SS.tbl, fontSize: 12 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, ["Taaknaam", "Categorie", "Type", "Frequentie", "Outlets", "Actief", ""].map(function(h) {
    return /* @__PURE__ */ React.createElement("th", { key: h, style: SS.th }, h);
  }))), /* @__PURE__ */ React.createElement("tbody", null, taken.map(function(t) {
    var catKl = { "Inkopen & ontvangen": "#1565C0", "Temperatuurbeheer": "#E65100", "Bereiden": "#2E7D32", "Opslag": "#6A1B9A", "Schoonmaak (periodiek)": "#00695C", "Schoonmaak": "#00695C", "Presenteren & serveren": "#AD1457", "Overig": "#546E7A" }[t.categorie] || "#546E7A";
    var freqKl = { "dagelijks": "#E8202B", "wekelijks": "#3FB8C4", "maandelijks": "#FF9800", "jaarlijks": "#9E9E9E" }[t.frequentie] || C.muted;
    return /* @__PURE__ */ React.createElement("tr", { key: t.id, style: { background: t.actief ? C.white : "#F5F5F5", opacity: t.actief ? 1 : 0.6 } }, /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 700 } }, t.naam), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("span", { style: { background: catKl + "22", color: catKl, border: "1px solid " + catKl + "44", borderRadius: 8, padding: "1px 6px", fontSize: 10, fontWeight: 700 } }, t.categorie)), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11, color: C.muted } }, t.type), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("span", { style: { background: freqKl + "22", color: freqKl, border: "1px solid " + freqKl + "44", borderRadius: 8, padding: "1px 6px", fontSize: 10, fontWeight: 700 } }, t.frequentie)), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11 } }, (t.outlet_codes || []).map(function(c) {
      return /* @__PURE__ */ React.createElement("span", { key: c, style: { background: C.light, borderRadius: 8, padding: "1px 5px", marginRight: 3, fontSize: 10 } }, c);
    })), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, fontSize: 10, background: t.actief ? "#E8F5E9" : "#F5F5F5", color: t.actief ? C.green : C.muted }, onClick: function() {
      toggleTaakActief(t);
    } }, t.actief ? "✓ Actief" : "Inactief")), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4 } }, /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, fontSize: 10 }, onClick: function() {
      setTaakBewerk(Object.assign({}, t));
    }, title: "Bewerken" }, "\u270F"), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, fontSize: 10, color: C.hot }, onClick: function() {
      verwijderTaak(t);
    }, title: "Verwijderen" }, "🗑"))));
  })))), subtab === "medewerkers" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.cT }, "Medewerkers (", medewerkers.length, ")"), /* @__PURE__ */ React.createElement("div", { style: { ...window._alertW, marginBottom: 14, marginTop: 8 } }, "\u26A0 PINs worden veilig opgeslagen. PIN reset stuurt een tijdelijk token — deel dit persoonlijk mee."), /* @__PURE__ */ React.createElement("div", { style: { background: C.light, borderRadius: 14, padding: 14, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 12, marginBottom: 10 } }, "Nieuwe medewerker toevoegen"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 8, alignItems: "end" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Naam"), /* @__PURE__ */ React.createElement("input", { style: SS.inp, value: nieuwNaam, onChange: function(e) {
    setNieuwNaam(e.target.value);
  }, placeholder: "Voornaam" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "PIN (4 cijfers)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      style: SS.inp,
      type: "password",
      inputMode: "numeric",
      maxLength: 6,
      value: nieuwPin,
      onChange: function(e) {
        setNieuwPin(e.target.value.replace(/\D/g, ""));
      },
      placeholder: "bijv. 1234"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Keuken"), /* @__PURE__ */ React.createElement("select", { style: SS.inp, value: nieuwOutlet, onChange: function(e) {
    setNieuwOutlet(e.target.value);
  } }, /* @__PURE__ */ React.createElement("option", { value: "" }, "— Kies keuken —"), outlets.map(function(o) {
    return /* @__PURE__ */ React.createElement("option", { key: o.id, value: o.id }, o.naam);
  }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Rol"), /* @__PURE__ */ React.createElement("select", { style: SS.inp, value: nieuwRol, onChange: function(e) {
    setNieuwRol(e.target.value);
  } }, /* @__PURE__ */ React.createElement("option", { value: "medewerker" }, "Medewerker"), /* @__PURE__ */ React.createElement("option", { value: "leidinggevende" }, "Leidinggevende"), /* @__PURE__ */ React.createElement("option", { value: "admin" }, "Admin"))), /* @__PURE__ */ React.createElement("button", { style: window._btnP, onClick: voegMedewerkerToe }, "+ Toevoegen"))), /* @__PURE__ */ React.createElement("table", { className:"kr-table", style: { ...SS.tbl, fontSize: 12 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, ["Naam", "Keuken", "Rol", "Status", "Acties"].map(function(h) {
    return /* @__PURE__ */ React.createElement("th", { key: h, style: SS.th }, h);
  }))), /* @__PURE__ */ React.createElement("tbody", null, medewerkers.map(function(m) {
    var rolKl = { admin: C.hot, leidinggevende: C.aqua, medewerker: C.green }[m.rol] || C.muted;
    return /* @__PURE__ */ React.createElement("tr", { key: m.id, style: { opacity: m.actief ? 1 : 0.5 } }, /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 700 } }, m.naam), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11 } }, m.kiosk_outlets ? m.kiosk_outlets.naam : "—"), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("span", { style: { background: rolKl + "22", color: rolKl, border: "1px solid " + rolKl + "44", borderRadius: 8, padding: "1px 6px", fontSize: 10, fontWeight: 700 } }, m.rol)), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: m.actief ? C.green : C.muted } }, m.actief ? "✓ Actief" : "Inactief")), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4 } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        style: { ...window._btnSG, fontSize: 10 },
        title: "PIN resetten",
        onClick: async function() {
          var nieuwePinRaw = window.prompt("Nieuwe PIN voor " + m.naam + " (4 cijfers):");
          if (!nieuwePinRaw) return;
          nieuwePinRaw = nieuwePinRaw.replace(/\D/g, "");
          if (nieuwePinRaw.length < 4 || nieuwePinRaw.length > 6) {
            alert("PIN moet exact 4 cijfers zijn");
            return;
          }
          var sessR = await window._supa.auth.getSession();
          var respR = await fetch(window._supa.functionsUrl + "/kiosk-medewerker-beheer", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + (sessR.data.session && sessR.data.session.access_token), "apikey": window._supa.supabaseKey },
            body: JSON.stringify({ actie: "medewerker_pin_resetten", medewerker_id: m.id, pincode: nieuwePinRaw })
          });
          var rPinJson = await respR.json();
          Promise.resolve({ error: rPinJson.error ? { message: rPinJson.error } : null }).then(function(r) {
            if (r.error) {
              toon("Fout: " + r.error.message, true);
            } else {
              toon("✓ PIN gewijzigd voor " + m.naam);
            }
          });
        }
      },
      "🔑 PIN"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        style: { ...window._btnSG, fontSize: 10 },
        title: "PIN naar 0000",
        onClick: async function() {
          if (!confirm("PIN van " + m.naam + " terugzetten naar 0000?")) return;
          var sessZ = await window._supa.auth.getSession();
          var respZ = await fetch(window._supa.functionsUrl + "/kiosk-medewerker-beheer", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + (sessZ.data.session && sessZ.data.session.access_token), "apikey": window._supa.supabaseKey },
            body: JSON.stringify({ actie: "medewerker_pin_naar_0000", medewerker_id: m.id })
          });
          var rZJson = await respZ.json();
          if (rZJson.error) { toon("Fout: " + rZJson.error, true); }
          else { toon("✓ PIN van " + m.naam + " is nu 0000"); }
        }
      },
      "↺ 0000"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        style: { ...window._btnSG, fontSize: 10, color: m.actief ? C.hot : C.green },
        onClick: function() {
          window._supa.from("kiosk_medewerkers").update({ actief: !m.actief }).eq("id", m.id).then(function(r) {
            if (!r.error) setMedewerkers(function(prev) {
              return prev.map(function(x) {
                return x.id === m.id ? Object.assign({}, x, { actief: !m.actief }) : x;
              });
            });
          });
        }
      },
      m.actief ? "🚫 Stop" : "✓ Activeer"
    ))));
  })))), subtab === "apparaten" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.cT }, "Tablets / Apparaten (", apparaten.length, ")"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.muted, marginBottom: 14 } }, "Elk apparaat krijgt een uniek token. Open kitchenrobot.vercel.app/kiosk op de tablet en voer het token in om de tablet te koppelen."), /* @__PURE__ */ React.createElement("div", { style: { background: C.light, borderRadius: 14, padding: 14, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 12, marginBottom: 10 } }, "Nieuwe tablet registreren"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, alignItems: "end" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, 'Naam (bijv. "Tablet West 1")'), /* @__PURE__ */ React.createElement("input", { style: SS.inp, value: nieuwNaam, onChange: function(e) {
    setNieuwNaam(e.target.value);
  }, placeholder: "Tablet West 1" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Keuken"), /* @__PURE__ */ React.createElement("select", { style: SS.inp, value: nieuwOutlet, onChange: function(e) {
    setNieuwOutlet(e.target.value);
  } }, /* @__PURE__ */ React.createElement("option", { value: "" }, "— Kies keuken —"), outlets.map(function(o) {
    return /* @__PURE__ */ React.createElement("option", { key: o.id, value: o.id }, o.naam);
  }))), /* @__PURE__ */ React.createElement("button", { style: window._btnP, onClick: voegApparaatToe }, "+ Registreren"))), /* @__PURE__ */ React.createElement("table", { className:"kr-table", style: { ...SS.tbl, fontSize: 12 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, ["Naam", "Keuken", "Token (voor koppeling)", "Laatste online", "Status"].map(function(h) {
    return /* @__PURE__ */ React.createElement("th", { key: h, style: SS.th }, h);
  }))), /* @__PURE__ */ React.createElement("tbody", null, apparaten.map(function(a) {
    return /* @__PURE__ */ React.createElement("tr", { key: a.id, style: { opacity: a.actief ? 1 : 0.5 } }, /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 700 } }, a.naam), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11 } }, a.kiosk_outlets ? a.kiosk_outlets.naam : "—"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontFamily: "monospace", fontSize: 10, color: C.muted } }, (a.apparaat_token || "").slice(0, 18), "...", /* @__PURE__ */ React.createElement(
      "button",
      {
        style: { ...window._btnSG, marginLeft: 6, fontSize: 9 },
        onClick: function() {
          navigator.clipboard && navigator.clipboard.writeText(a.apparaat_token);
          toon("Token gekopieerd ✓");
        }
      },
      "Kopieer"
    )), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11, color: C.muted } }, a.laatste_online ? new Date(a.laatste_online).toLocaleString("nl-NL") : "Nog nooit"), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: a.actief ? C.green : C.muted } }, a.actief ? "✓ Actief" : "Inactief")));
  })))), subtab === "haccp" && /* @__PURE__ */ React.createElement("div", null, haccpBewerk && /* @__PURE__ */ React.createElement(
    "div",
    {
      style: { position: "fixed", inset: 0, background: "rgba(35,71,86,0.6)", zIndex: 1e3, display: "flex", alignItems: "center", justifyContent: "center" },
      onClick: function(e) {
        if (e.target === e.currentTarget) setHaccpBewerk(null);
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 14, width: "min(480px,95vw)", boxShadow: "0 8px 40px rgba(35,71,86,.3)" } }, /* @__PURE__ */ React.createElement("div", { style: { background: C.night, padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "14px 14px 0 0" } }, /* @__PURE__ */ React.createElement("div", { style: { color: C.white, fontWeight: 900, fontSize: 14 } }, haccpBewerk.id ? "Punt bewerken" : "Nieuw HACCP punt"), /* @__PURE__ */ React.createElement("button", { onClick: function() {
      setHaccpBewerk(null);
    }, style: { background: "transparent", border: "none", color: C.white, fontSize: 20, cursor: "pointer" } }, "\u2715")), /* @__PURE__ */ React.createElement("div", { style: { padding: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Naam"), /* @__PURE__ */ React.createElement("input", { style: SS.inp, value: haccpBewerk.naam || "", onChange: function(e) {
      setHaccpBewerk(function(p) {
        return Object.assign({}, p, { naam: e.target.value });
      });
    }, placeholder: "bijv. Koelkast 6" })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Keuken"), /* @__PURE__ */ React.createElement("select", { style: SS.inp, value: haccpBewerk.outlet_code || "west", onChange: function(e) {
      setHaccpBewerk(function(p) {
        return Object.assign({}, p, { outlet_code: e.target.value });
      });
    } }, /* @__PURE__ */ React.createElement("option", { value: "west" }, "Amsterdam West"), /* @__PURE__ */ React.createElement("option", { value: "weesp" }, "Weesp"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Type"), /* @__PURE__ */ React.createElement("select", { style: SS.inp, value: haccpBewerk.type || "koeling", onChange: function(e) {
      setHaccpBewerk(function(p) {
        return Object.assign({}, p, { type: e.target.value });
      });
    } }, ["koeling", "vriezer", "frituur", "bereiding", "serveren", "ontvangst", "vaatwasser", "overig"].map(function(t) {
      return /* @__PURE__ */ React.createElement("option", { key: t }, t);
    }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Min temp (\xB0C)"), /* @__PURE__ */ React.createElement("input", { style: SS.inp, type: "number", value: haccpBewerk.min_temp || "", onChange: function(e) {
      setHaccpBewerk(function(p) {
        return Object.assign({}, p, { min_temp: e.target.value });
      });
    }, placeholder: "bijv. 2" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Max temp (\xB0C)"), /* @__PURE__ */ React.createElement("input", { style: SS.inp, type: "number", value: haccpBewerk.max_temp || "", onChange: function(e) {
      setHaccpBewerk(function(p) {
        return Object.assign({}, p, { max_temp: e.target.value });
      });
    }, placeholder: "bijv. 7" }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10 } }, /* @__PURE__ */ React.createElement("button", { style: window._btnP, onClick: slaaHaccpOp }, "Opslaan"), /* @__PURE__ */ React.createElement("button", { style: window._btnSG, onClick: function() {
      setHaccpBewerk(null);
    } }, "Annuleren"))))
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: SS.cT }, "HACCP Controlepunten"), /* @__PURE__ */ React.createElement("button", { style: window._btnP, onClick: function() {
    setHaccpBewerk(Object.assign({}, haccpLeeg));
  } }, "+ Nieuw punt")), ["west", "weesp"].map(function(outletCode) {
    var outletNaam = outletCode === "west" ? "Keuken Amsterdam West" : "Keuken Weesp";
    var punten = haccp.filter(function(p) {
      return p.outlet_code === outletCode;
    });
    return /* @__PURE__ */ React.createElement("div", { key: outletCode, style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 900, fontSize: 13, color: C.night, marginBottom: 8, borderBottom: "2px solid " + C.aqua, paddingBottom: 4 } }, outletNaam, " (", punten.length, " punten)"), /* @__PURE__ */ React.createElement("table", { className:"kr-table", style: { ...SS.tbl, fontSize: 12 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, ["Naam", "Type", "Min \xB0C", "Max \xB0C", "Sensor", ""].map(function(h) {
      return /* @__PURE__ */ React.createElement("th", { key: h, style: SS.th }, h);
    }))), /* @__PURE__ */ React.createElement("tbody", null, punten.map(function(p) {
      var typeKl = { koeling: C.aqua, vriezer: "#5C6BC0", frituur: C.hot, bereiding: C.green }[p.type] || C.muted;
      return /* @__PURE__ */ React.createElement("tr", { key: p.id }, /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 700 } }, p.naam), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("span", { style: { background: typeKl + "22", color: typeKl, border: "1px solid " + typeKl + "44", borderRadius: 8, padding: "1px 6px", fontSize: 10, fontWeight: 700 } }, p.type)), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 700, color: C.aqua } }, p.min_temp !== null ? p.min_temp + "\xB0C" : "—"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 700, color: C.hot } }, p.max_temp !== null ? p.max_temp + "\xB0C" : "—"), /* @__PURE__ */ React.createElement("td", { style: SS.td }, p.sensor_mac ? /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.green } }, "🔵 Gekoppeld") : /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.muted } }, "Handmatig")), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4 } }, /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, fontSize: 10 }, onClick: function() {
        setHaccpBewerk(Object.assign({}, p));
      }, title: "Bewerken" }, "\u270F"), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, fontSize: 10, color: C.hot }, onClick: function() {
        verwijderHaccp(p);
      }, title: "Verwijderen" }, "🗑"))));
    }))));
  })), subtab === "sensoren" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: SS.cT }, "Sensoren Weesp (" + sensoren.length + ")"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.muted } }, "Vul MAC-adressen in na ontvangst · Activeer per sensor")), /* @__PURE__ */ React.createElement("div", { style: { background: "#E3F2FD", borderRadius: 14, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#1565C0" } }, "📱 MAC-adres vind je in de SwitchBot app: Apparaat → Instellingen → Apparaatinformatie. Formaat: AA:BB:CC:DD:EE:FF"), /* @__PURE__ */ React.createElement("table", { className:"kr-table", style: { ...SS.tbl, fontSize: 12 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, ["Naam", "Type", "Min", "Max", "MAC-adres", "Status"].map(function(h) { return /* @__PURE__ */ React.createElement("th", { key: h, style: SS.th }, h); }))), /* @__PURE__ */ React.createElement("tbody", null, sensoren.map(function(s) { var typeKl = { koeling: C.aqua, vriezer: "#5C6BC0", frituur: C.hot }[s.type] || C.muted; return /* @__PURE__ */ React.createElement("tr", { key: s.id, style: { background: s.actief ? "#E8F5E9" : C.white } }, /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 700 } }, s.naam), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("span", { style: { background: typeKl + "22", color: typeKl, border: "1px solid " + typeKl + "44", borderRadius: 8, padding: "1px 6px", fontSize: 10, fontWeight: 700 } }, s.type || "switchbot")), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, color: C.aqua, fontWeight: 700 } }, s.min_norm !== null ? s.min_norm + "°C" : "—"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, color: C.hot, fontWeight: 700 } }, s.max_norm !== null ? s.max_norm + "°C" : "—"), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("input", { style: { ...SS.inp, fontFamily: "monospace", fontSize: 11, width: "100%", maxWidth: 160 }, placeholder: "AA:BB:CC:DD:EE:FF", value: s.mac_adres || "", onChange: function(e) { setSensoren(function(prev) { return prev.map(function(x) { return x.id === s.id ? Object.assign({}, x, { mac_adres: e.target.value }) : x; }); }); }, onBlur: function(e) { var mac = e.target.value.trim().toUpperCase(); if (!mac) return; window._supa.from("kiosk_sensoren").update({ mac_adres: mac }).eq("id", s.id).then(function(r) { if (!r.error) toon("MAC opgeslagen ✓"); else toon("Fout: " + r.error.message, true); }); } })), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, fontSize: 10, background: s.actief ? "#E8F5E9" : "#F5F5F5", color: s.actief ? C.green : C.muted }, onClick: function() { if (!s.mac_adres && !s.actief) { toon("Vul eerst een MAC-adres in", true); return; } window._supa.from("kiosk_sensoren").update({ actief: !s.actief }).eq("id", s.id).then(function(r) { if (!r.error) setSensoren(function(prev) { return prev.map(function(x) { return x.id === s.id ? Object.assign({}, x, { actief: !x.actief }) : x; }); }); }); } }, s.actief ? "✓ Actief" : "Activeer"))); })))), subtab === "waste" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.cT }, "Waste Module"), /* @__PURE__ */ React.createElement("div", { style: { ...window._alertW, margin: "12px 0" } }, "📱 Waste wordt geregistreerd via de kiosk of via WhatsApp foto's naar de waste bot. Hier stel je de redenen en drempelwaarden in."), /* @__PURE__ */ React.createElement("div", { style: { background: C.light, borderRadius: 14, padding: 14, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 12, marginBottom: 8 } }, "16 afvalredenen (uit Horeko)"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, [
    { naam: "Over datum", kleur: "#E8202B" },
    { naam: "Overgeproduceerd", kleur: "#FF9800" },
    { naam: "Smaak niet goed", kleur: "#FF9800" },
    { naam: "Aangebrand", kleur: "#FF5722" },
    { naam: "Gevallen", kleur: "#9E9E9E" },
    { naam: "Open verpakking", kleur: "#FF9800" },
    { naam: "Schimmel", kleur: "#E8202B" },
    { naam: "Aangevreten", kleur: "#E8202B" },
    { naam: "Personeelsmaaltijden", kleur: "#4CAF50" },
    { naam: "Retour klant", kleur: "#2196F3" },
    { naam: "Stroom(uitval)", kleur: "#9C27B0" },
    { naam: "Corona", kleur: "#9E9E9E" },
    { naam: "Proeven/testen", kleur: "#00BCD4" },
    { naam: "Beschadigd", kleur: "#FF5722" },
    { naam: "Verkeerd bereid", kleur: "#FF9800" },
    { naam: "Overig", kleur: "#9E9E9E" }
  ].map(function(r) {
    return /* @__PURE__ */ React.createElement("span", { key: r.naam, style: { background: r.kleur + "22", color: r.kleur, border: "1px solid " + r.kleur + "44", borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700 } }, r.naam);
  }))), /* @__PURE__ */ React.createElement("div", { style: { background: "#E3F2FD", borderRadius: 14, padding: 14, border: "1px solid #1565C0" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 12, color: "#1565C0", marginBottom: 6 } }, "📸 WhatsApp Waste Bot"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.night } }, "Medewerkers sturen een foto via WhatsApp \u2192 Claude Vision herkent het product \u2192 vraagt bevestiging \u2192 slaat op in de database. Wordt gebouwd in Fase 4."))))));
}

  window._KioskBeheerTab = KioskBeheerTab;
})();
