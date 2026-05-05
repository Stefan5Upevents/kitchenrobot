// KitchenRobot module: sligro-bestelling-screen.js
// Geextraheerd uit index.html op 2026-05-05T10:41:22.005Z (v9 AST-walk v5)
// Bevat: SligroBestellingScreen
// Externe refs (via window._): opzetPct, totPers
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function SligroBestellingScreen() {
  var [sligroTab, setSligroTab] = useState("bestelling");
  var [stamKlaar, setStamKlaar] = useState(function(){ return (window._stamGerechten||[]).length > 0; });
  var [keuken, setKeuken] = useState("west");
  var [bevestigd, setBevestigd] = useState(false);
  var [bezig, setBezig] = useState(false);
  var [opgeslagenBestellingen, setOpgeslagenBestellingen] = useState([]);
  var [geladen, setLaden] = useState(true);
  var [gekozen, setGekozen] = useState(null);
  function verwijderBestelling(id) {
    if (!window.confirm("Bestelling verwijderen?")) return;
    window._supa.from("bestellingen").delete().eq("id", id).then(function(r) {
      if (r && r.error) {
        alert("Fout: " + r.error.message);
        return;
      }
      setOpgeslagenBestellingen(function(prev) {
        return prev.filter(function(b) {
          return b.id !== id;
        });
      });
      if (gekozen === id) setGekozen(null);
    });
  }
  var [melding, setMelding] = useState("");
  var [importBoekingen, setImportBoekingen] = useState([]);
  var [importLabel, setImportLabel] = useState("");
  var [toonBerekening, setToonBerekening] = useState(false); var [uitgeslotenB, setUitgeslotenB] = useState([]); var [uitgeslotenIngr, setUitgeslotenIngr] = useState([]);
  var [showDetail, setShowDetail] = useState(null);
  var [sortVeld, setSortVeld] = useState("naam");
  var [sortDir, setSortDir] = useState("asc");
  function toon(msg, err) {
    setMelding({ tekst: msg, fout: !!err });
    setTimeout(function() {
      setMelding("");
    }, 4e3);
  }
  useEffect(function() {
    if (!window._supa) return;
    // Laad bestellingen
    window._supa.from("bestellingen").select("*").order("aangemaakt_op", { ascending: false }).limit(30).then(function(r) {
      setOpgeslagenBestellingen(r.data || []);
      setLaden(false);
    });
    // Laad stam data als nog niet geladen (nodig voor berekening)
    var heeftStam = (window._stamGerechten || []).length > 0;
    if (heeftStam) {
      setStamKlaar(true);
    } else {
      Promise.all([
        window._supa.from("gerechten").select("*, ingredienten(*, sligro_id), gerecht_gn_formaten(*, standaard_gn_formaten(*)), gerecht_schaal_formaten(*, standaard_schaal_formaten(*))").order("naam"),
        window._supa.from("menus").select("*, menu_gerechten(*, gerechten(*))").order("naam"),
        window._supa.from("sligro_producten").select("*").order("naam"),
        window._supa.from("recras_koppelingen").select("*"),
      ]).then(function(results) {
        window._stamGerechten = results[0].data || [];
        window._stamMenus = results[1].data || [];
        window._stamSligro = (results[2].data || []).map(function(p) {
          return Object.assign({}, p, { hoev: p.hoeveelheid, eenh: p.eenheid, prijs: p.prijs_excl });
        });
        window._stamKoppelingen = results[3].data || [];
        console.log("[Sligro] stam geladen:", window._stamGerechten.length, "gerechten,", window._stamSligro.length, "sligro producten");
        setStamKlaar(true);
      });
    }
  }, []);
  function importeerExcel(e) {
    var file = e.target.files[0];
    if (!file) return;
    if (typeof XLSX === "undefined") {
      alert("XLSX niet beschikbaar");
      return;
    }
    var reader = new FileReader();
    reader.onload = function(ev) {
      try {
        var wb = XLSX.read(ev.target.result, { type: "array" });
        var ws = wb.Sheets[wb.SheetNames[0]];
        var rijen = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "", raw: false });
        if (rijen.length < 2) {
          alert("Geen data gevonden.");
          return;
        }
        var boekingenMap = {};
        rijen.slice(1).forEach(function(r) {
          var bid = String(r[0] || "").trim();
          var productNaam = String(r[1] || "").trim();
          if (!bid || !productNaam) return;
          var rawDatum = r[2] || "";
          var datum = String(rawDatum).trim();
          var aantal = parseInt(r[5]) || 0;
          var locatie = String(r[6] || "").trim();
          var ds = datum.replace("T", " ").split(" ");
          var datStr = ds[0] || "";
          var tijdStr = (ds[1] || "").substring(0, 5);
          var deadline = datStr && tijdStr ? datStr + " " + tijdStr + ":00" : datStr || datum;
          if (!boekingenMap[bid]) {
            boekingenMap[bid] = { id: bid, naam: bid, deadline, deadlineTijd: tijdStr, locatie, regels: [] };
          }
          var bestaand = boekingenMap[bid].regels.find(function(x) {
            return x.menuNaam === productNaam;
          });
          if (bestaand) {
            bestaand.aantal += aantal;
          } else {
            boekingenMap[bid].regels.push({ menuNaam: productNaam, aantal });
          }
        });
        var lijst = Object.values(boekingenMap).filter(function(b) {
          return b.regels.length > 0;
        });
        if (lijst.length === 0) {
          alert("Geen boekingen herkend. Controleer het bestand.");
          return;
        }
        var westLoc = ["Loods 2", "Loods 4", "Loods 5", "Loods 6", "Terras Loods 6", "Pup - Bar", "Ronde Tent", "Stretchtent", "Terrace", "Beachclub", "Beachclub 2", "Loods 7", "Loods 7 Patio", "Combinatie | Loods 1, 2, 3 & Terrace"];
        var lijstGefilterd = keuken ? lijst.filter(function(b) {
          var isW = westLoc.indexOf(b.locatie || "") >= 0;
          return keuken === "west" ? isW : !isW;
        }) : lijst;
        setImportBoekingen(lijstGefilterd);
        setImportLabel(file.name + " (" + lijstGefilterd.length + " boekingen" + (keuken ? " \xB7 " + keuken : "") + ")");
        toon("✓ " + lijstGefilterd.length + " boekingen geladen");
      } catch (err) {
        alert("Fout: " + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  }
  function berekenVanImport() {
    var perArtnr = {};
    boekActief.forEach(function(b) {
      var pct = window._opzetPct(window._totPers(b));
      (b.regels || []).forEach(function(r) {
        var kop = (window._stamKoppelingen || []).find(function(k) {
          return (k.recras_naam || "").trim() === (r.menuNaam || "").trim();
        });
        var m = kop ? (window._stamMenus || []).find(function(mm) {
          return mm.id === kop.menu_id;
        }) : null;
        if (!m) return;
        (m.menu_gerechten || []).forEach(function(mg) {
          var g = (window._stamGerechten || []).find(function(gg) {
            return gg.id === mg.gerecht_id;
          }) || (mg.gerechten || {});
          (g.ingredienten || []).filter(function(i) {
            return i.zichtbaar === "ja";
          }).forEach(function(ing) {
            var sp = (window._stamSligro || []).find(function(p) {
              return p.id === ing.sligro_id;
            }) || {};
            var artnr = sp.artnr || ing.sligro_id;
            if (!artnr) return;
            if (uitgeslotenIngr.indexOf(b.id+"_"+artnr) >= 0) return;
            var verp = parseFloat(sp.hoev || sp.hoeveelheid || 1);
            var eenh = sp.eenh || sp.eenheid || "";
            var prijs = parseFloat(sp.prijs_excl || sp.prijs || 0);
            var portiesEff = r.aantal * (mg.porties_per_persoon || 1) * pct;
            var verpakkingen = portiesEff * (ing.gebruik_per_portie || 0) / verp;
            if (!perArtnr[artnr]) perArtnr[artnr] = { artnr, naam: sp.naam || artnr, verp, eenh, prijs, totaalRauw: 0, berekening: [] };
            perArtnr[artnr].totaalRauw += verpakkingen;
            perArtnr[artnr].berekening.push({ boeking: b.naam, menu: m.naam, gerecht: g.naam || "", personen: r.aantal, pct: Math.round(pct * 100), portiesEff, pp: mg.porties_per_persoon || 1, gebruik: ing.gebruik_per_portie || 0, eenh, verpakkingen });
          });
        });
      });
    });
    return Object.values(perArtnr).map(function(item) {
      return Object.assign({}, item, { totaalVerpakkingen: Math.ceil(item.totaalRauw) });
    }).sort(function(a, b) {
      return (a.naam || "").localeCompare(b.naam || "", "nl");
    });
  }
  var boekActief = importBoekingen.filter(function(b){return uitgeslotenB.indexOf(b.id)<0;}); var bestellingRegels = (importBoekingen.length > 0 && stamKlaar) ? berekenVanImport() : [];
  function downloadCSV() {
    var boekData = boekActief.map(function(b) {
      return b.deadline || "";
    }).filter(Boolean).sort();
    var fmt = function(ds) {
      var p = ds.replace("T", " ").split(" ")[0].split("-");
      if (p.length === 3) {
        var d = new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]));
        return String(d.getDate()).padStart(2, "0") + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + d.getFullYear();
      }
      return ds;
    };
    var van = boekData.length > 0 ? fmt(boekData[0]) : fmt((/* @__PURE__ */ new Date()).toISOString());
    var tot = boekData.length > 0 ? fmt(boekData[boekData.length - 1]) : van;
    var naam = "sligrobestelling " + van + " " + tot;
    var hdr = "Lijstnaam (Verplicht);Sorteervolgorde (Optioneel);Artikelnummer (Verplicht);Portionering gewicht (Optioneel);Verpakkingscode (Optioneel);Voorkeurs-aantal (Optioneel);(niet gevuld);(niet gevuld);Productinformatie;Productgroepcode;Productgroepnaam;Portionering omschrijving;Verpakking omschrijving";
    var rows = bestellingRegels.map(function(r) {
      return naam + ";" + r.artnr + ";" + r.totaalVerpakkingen + ";";
    });
    var inhoud = "\uFEFF" + hdr + "\r\n" + rows.join("\r\n");
    var blob = new Blob([inhoud], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "sligrobestelling_" + (keuken || "alle") + "_" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  function slaBestellingOp() {
    if (!keuken || !bevestigd) {
      alert("Kies een keuken en bevestig.");
      return;
    }
    if (bestellingRegels.length === 0) {
      alert("Geen producten berekend.");
      return;
    }
    setBezig(true);
    var totExcl = bestellingRegels.reduce(function(s, r) {
      return s + r.totaalVerpakkingen * (r.prijs || 0);
    }, 0);
    var regels = bestellingRegels.map(function(r) {
      return { artnr: r.artnr, naam: r.naam, totaal_verpakkingen: r.totaalVerpakkingen, eenheid: r.eenh, prijs_excl: r.prijs || 0, totaal: Math.round(r.totaalVerpakkingen * (r.prijs || 0) * 100) / 100 };
    });
    window._supa.from("bestellingen").insert({
      bestel_datum: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      outlet_code: keuken,
      status: "concept",
      regels_json: regels,
      totaal_excl: Math.round(totExcl * 100) / 100,
      totaal_incl: Math.round(totExcl * 1.09 * 100) / 100,
      aangemaakt_door: "handmatig-import"
    }).then(function(r) {
      setBezig(false);
      if (r && r.error) {
        toon("Fout: " + r.error.message, true);
        return;
      }
      toon("✓ Bestelling opgeslagen");
      window._supa.from("bestellingen").select("*").order("aangemaakt_op", { ascending: false }).limit(30).then(function(res) {
        setOpgeslagenBestellingen(res.data || []);
      });
    });
  }
  var statusKl = { concept: "#FF9800", verstuurd: "#3FB8C4", bevestigd: "#27AE60", geleverd: "#9E9E9E" };
  var keukenKlr = { west: C.aqua, weesp: C.green };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: C.night, marginBottom: 4 } }, "🛒 Sligro Bestelling"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: C.muted } }, "Importeer je boekingen, zie per boeking wat nodig is, en genereer de Sligro-bestelling als CSV.")),
    !stamKlaar && /* @__PURE__ */ React.createElement("div", { style: { background: "#FFF3E0", border: "1px solid #FFB74D", borderRadius: 14, padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "#E65100" } },
    "⏳ Productdata laden... Even wachten voordat je een bestand importeert."),
  /* Tabs */
    React.createElement("div", {style:{display:"flex",gap:2,borderBottom:"2px solid #D8E8EF",marginBottom:16,flexWrap:"wrap"}},
      [["bestelling","\uD83D\uDED2 Bestelling"],["voorraad","\uD83D\uDCE6 Voorraad checker"]].map(function(t){
        var act=sligroTab===t[0];
        return React.createElement("button",{key:t[0],style:{padding:"9px 16px",fontFamily:"inherit",fontWeight:700,fontSize:12,border:"none",background:act?"rgba(232,32,43,.05)":"transparent",cursor:"pointer",color:act?"#E8202B":"#6B8A9A",borderBottom:act?"2px solid #E8202B":"2px solid transparent",marginBottom:-2},onClick:function(){setSligroTab(t[0]);}},t[1]);
      })
    ),
    sligroTab==="voorraad" && React.createElement(window._VoorraadCheckerTab, null),
    sligroTab==="bestelling" && /* @__PURE__ */ React.createElement("div", { style: { background: "linear-gradient(135deg,#234756,#003D56)", borderRadius: 18, padding: 20, marginBottom: 20, color: "#fff" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 900, fontSize: 14, color: C.aqua, marginBottom: 10 } }, "📋 Hoe kom je aan een bestelling?"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 } }, [
    ["1", "📅", "Kies periode", "Selecteer outlet en datum van-tot en klik ✨ Laad"],
    ["2", "🧮", "Berekening", "KitchenRobot berekent per gerecht hoeveel Sligro-producten nodig zijn"],
    ["3", "✓", "Controleer", "Bekijk per boeking en per artikel de volledige berekening"],
    ["4", "\u2B07", "Download", "CSV downloaden en direct bij Sligro uploaden"]
  ].map(function(s) {
    return /* @__PURE__ */ React.createElement("div", { key: s[0], style: { background: "rgba(255,255,255,.07)", borderRadius: 14, padding: "12px 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, marginBottom: 6 } }, s[1]), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 12, color: C.aqua, marginBottom: 3 } }, "Stap ", s[0], " — ", s[2]), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "rgba(255,255,255,.6)" } }, s[3]));
  }))), /* @__PURE__ */ React.createElement("div", { style: { ...SS.card, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 14, color: C.night, marginBottom: 12 } }, "Importeer boekingen voor bestelling"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 } }, /* @__PURE__ */ null), React.createElement("div", { style: { gridColumn: "1/-1", background: "linear-gradient(135deg,#F0F9FF,#E3F2FD)", border: "2px solid #1AA6B7", borderRadius: 12, padding: 16, marginBottom: 14 } }, React.createElement("div", { style: { fontWeight: 800, fontSize: 13, color: "#002D41", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 } }, "✨ Automatisch uit KitchenRobot ", React.createElement("span", { style: { fontSize: 10, color: "#1AA6B7", fontWeight: 600 } }, "(aanbevolen)")), React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" } }, React.createElement("label", { style: { fontSize: 11, fontWeight: 700, color: "#002D41" } }, "Outlet:"), React.createElement("select", { value: keuken || "west", onChange: function(e) { setKeuken(e.target.value); }, style: { padding: "8px 12px", border: "1px solid #B3D8E5", borderRadius: 8, fontSize: 12, fontFamily: "inherit", fontWeight: 600, background: "#fff", cursor: "pointer" } }, React.createElement("option", { value: "west" }, "🏭 Keuken West"), React.createElement("option", { value: "weesp" }, "🏡 Keuken Weesp")), React.createElement("label", { style: { fontSize: 11, fontWeight: 700, color: "#002D41", marginLeft: 8 } }, "Van:"), React.createElement("input", { type: "date", id: "sligro-van", defaultValue: (window._sligroVan || new Date().toISOString().split("T")[0]), style: { padding: "7px 10px", border: "1px solid #B3D8E5", borderRadius: 8, fontSize: 12, fontFamily: "inherit", fontWeight: 600, cursor: "pointer" } }), React.createElement("span", { style: { color: "#1AA6B7", fontWeight: 700 } }, "→"), React.createElement("label", { style: { fontSize: 11, fontWeight: 700, color: "#002D41" } }, "Tot:"), React.createElement("input", { type: "date", id: "sligro-tot", defaultValue: (window._sligroTot || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]), style: { padding: "7px 10px", border: "1px solid #B3D8E5", borderRadius: 8, fontSize: 12, fontFamily: "inherit", fontWeight: 600, cursor: "pointer" } }), React.createElement("button", { type: "button", onClick: function() { var outlet = keuken || "west"; var inpVan = document.getElementById("sligro-van"); var inpTot = document.getElementById("sligro-tot"); var van = inpVan ? inpVan.value : new Date().toISOString().split("T")[0]; var tot = inpTot ? inpTot.value : new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]; window._sligroVan = van; window._sligroTot = tot; var lijst = (window._recrasBoekingen || []).filter(function(b) { if (outlet !== "alle" && b.outlet_code !== outlet && !(outlet === "west" && b.outlet_code === "gemengd") && !(outlet === "weesp" && b.outlet_code === "gemengd")) return false; if (!b.deadline) return true; var d = new Date(b.deadline); var vd = new Date(van + "T00:00:00"); var td = new Date(tot + "T23:59:59"); return d >= vd && d <= td; }); if (lijst.length === 0) { alert("Geen boekingen gevonden in deze periode voor " + outlet); return; } setUitgeslotenB([]); setUitgeslotenIngr([]); setImportBoekingen(lijst.slice().sort(function(a,b){return new Date(a.deadline||"9999")-new Date(b.deadline||"9999");})); setImportLabel(lijst.length + " boekingen · " + van + " t/m " + tot + " · " + (outlet === "alle" ? "beide" : outlet)); try { var totPax = lijst.reduce(function(s, b) { return s + (b.personen || 0); }, 0); toon("✓ " + lijst.length + " boekingen geladen (" + totPax + " personen)"); } catch (e) {} }, style: { background: "#1AA6B7", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 6px rgba(26,166,183,0.3)" } }, "✨ Laad boekingen"), React.createElement("span", { style: { fontSize: 10, color: "#5A7A8A", fontStyle: "italic", marginLeft: 4 } }, (window._recrasBoekingen || []).length + " boekingen beschikbaar")), React.createElement("div", { style: { fontSize: 10, color: "#5A7A8A", marginTop: 8, lineHeight: 1.4 } }, "💡 Kies outlet, periode en klik ✨ Laad. De Sligro-berekening gebeurt automatisch en je kunt daarna de CSV downloaden.")), importLabel && /* @__PURE__ */ React.createElement("div", { style: { background: "#E8F5E9", border: "1px solid #A5D6A7", borderRadius: 100, padding: "8px 12px", fontSize: 12, color: "#2E7D32", fontWeight: 700, marginBottom: 10 } }, "✓ ", importLabel), keuken && importBoekingen.length > 0 && /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: bevestigd ? "#E8F5E9" : "#FFF8E1", borderRadius: 14, border: "1px solid " + (bevestigd ? "#A5D6A7" : "#FFD54F"), cursor: "pointer", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: bevestigd, onChange: function(e) {
    setBevestigd(e.target.checked);
  }, style: { width: 16, height: 16, cursor: "pointer" } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: C.night } }, "Bestelling voor ", /* @__PURE__ */ React.createElement("strong", null, keuken === "west" ? "Amsterdam West" : "Weesp"), " — ", bestellingRegels.length, " producten, ", importBoekingen.length, " boekingen")), importBoekingen.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { style: { ...SS.btn, fontSize: 12 }, onClick: function() {
    setToonBerekening(!toonBerekening);
  } }, toonBerekening ? "\u25B2 Verberg berekening" : "\u25BC Bekijk per boeking"), bestellingRegels.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { style: { ...SS.btnP, fontSize: 12 }, onClick: downloadCSV }, "\u2B07 Download Sligro CSV"), /* @__PURE__ */ React.createElement(
    "button",
    {
      style: { ...SS.btn, fontSize: 12, opacity: !keuken || !bevestigd ? 0.4 : 1 },
      disabled: !keuken || !bevestigd || bezig,
      onClick: slaBestellingOp
    },
    bezig ? "Bezig..." : "💾 Sla op in systeem"
  ))), melding && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, fontSize: 12, color: melding.fout ? C.hot : C.green, fontWeight: 700 } }, melding.tekst)), toonBerekening && importBoekingen.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { ...SS.card, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 14, color: C.night, marginBottom: 12 } }, "Per boeking — wat is er nodig?"), uitgeslotenB.length > 0 && React.createElement("div", { style: { textAlign: "right", marginBottom: 6 } }, React.createElement("button", { style: { background: "none", border: "1px solid #C62828", borderRadius: 8, cursor: "pointer", color: "#C62828", fontSize: 11, padding: "4px 10px" }, onClick: function(){ setUitgeslotenB([]); setUitgeslotenIngr([]); } }, "\u21BA Herstel alle verwijderde boekingen")), boekActief.map(function(b) {
    var bRegs = [];
    var pct = window._opzetPct(window._totPers(b));
    (b.regels || []).forEach(function(r) {
      var kop = (window._stamKoppelingen || []).find(function(k) {
        return (k.recras_naam || "").trim() === (r.menuNaam || "").trim();
      });
      var m = kop ? (window._stamMenus || []).find(function(mm) {
        return mm.id === kop.menu_id;
      }) : null;
      if (!m) return;
      (m.menu_gerechten || []).forEach(function(mg) {
        var g = (window._stamGerechten || []).find(function(gg) {
          return gg.id === mg.gerecht_id;
        }) || (mg.gerechten || {});
        var portiesEff = r.aantal * (mg.porties_per_persoon || 1) * pct;
        (g.ingredienten || []).filter(function(i) {
          return i.zichtbaar === "ja";
        }).forEach(function(ing) {
          var sp = (window._stamSligro || []).find(function(p) {
            return p.id === ing.sligro_id;
          }) || {};
          if (!sp.artnr && !sp.naam) return;
          var verp = parseFloat(sp.hoev || sp.hoeveelheid || 1);
          var verpakkingen = Math.ceil(portiesEff * (ing.gebruik_per_portie || 0) / verp);
          if (verpakkingen > 0 && uitgeslotenIngr.indexOf(b.id+"_"+sp.artnr) < 0) bRegs.push({ artnr: sp.artnr, naam: sp.naam || sp.artnr, menu: m.naam, gerecht: g.naam || "", verpakkingen, eenh: sp.eenh || sp.eenheid || "" });
        });
      });
    });
    if (bRegs.length === 0) return null;
    var isOpen = showDetail === b.id;
    var totPersB = window._totPers(b);
    return /* @__PURE__ */ React.createElement("div", { key: b.id, style: { borderBottom: "1px solid " + C.border, paddingBottom: 10, marginBottom: 10 } }, /* @__PURE__ */ React.createElement(
      "div",
      {
        style: { display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "6px 0" },
        onClick: function() {
          setShowDetail(isOpen ? null : b.id);
        }
      },
      /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, fontSize: 13, color: C.night } }, b.naam), b.status==="optie" && React.createElement("span", { style: { background: "#FFF3E0", border: "1px solid #FFB74D", borderRadius: 6, padding: "1px 8px", fontSize: 10, color: "#E65100", fontWeight: 800, marginLeft: 6 } }, "\u26A0\uFE0F OPTIE \u2014 overleg met sales"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: C.muted, marginLeft: 10 } }, totPersB, " personen \xB7 ", (b.deadline || "").replace("T", " ").split(" ")[0], " \xB7 ", b.locatie || ""), /* @__PURE__ */ React.createElement("span", { style: { background: C.light, borderRadius: 8, padding: "1px 6px", fontSize: 10, color: C.muted, marginLeft: 6 } }, bRegs.length, " producten"), React.createElement("button", { style: { background: "none", border: "1px solid #C62828", borderRadius: 6, cursor: "pointer", color: "#C62828", fontSize: 10, padding: "1px 7px", marginLeft: 8 }, onClick: function(e){ e.stopPropagation(); setUitgeslotenB(function(p){return p.concat([b.id]);}); }, title: "Tijdelijk verwijderen uit bestelling" }, "\u2715 weg")),
      /* @__PURE__ */ React.createElement("span", { style: { color: C.muted } }, isOpen ? "\u25B2" : "\u25BC")
    ), isOpen && /* @__PURE__ */ React.createElement("div", { style: { background: "#F7F9FC", borderRadius: 14, padding: 10, marginTop: 6 } }, bRegs.map(function(pr, i) {
      return /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", justifyContent: "space-between", padding: "4px 6px", borderBottom: "1px solid #eee", fontSize: 12 } }, /* @__PURE__ */ React.createElement("div", null, pr.artnr && /* @__PURE__ */ React.createElement("span", { style: { color: C.muted, fontSize: 10, marginRight: 6 } }, pr.artnr), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600 } }, pr.naam), /* @__PURE__ */ React.createElement("span", { style: { color: C.muted, fontSize: 10, marginLeft: 6 } }, "(", pr.menu, " \xB7 ", pr.gerecht, ")")), /* @__PURE__ */ React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 6 } }, React.createElement("span", { style: { fontWeight: 700, color: C.aqua } }, pr.verpakkingen, "\xD7 ", pr.eenh), React.createElement("button", { style: { background: "none", border: "none", cursor: "pointer", color: "#bbb", fontSize: 12, padding: "0 2px", lineHeight: 1 }, onClick: function(e){ e.stopPropagation(); setUitgeslotenIngr(function(p){return p.concat([b.id+"_"+pr.artnr]);}); }, title: "Tijdelijk weghalen" }, "\u2715")));
    })));
  })), bestellingRegels.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { ...SS.card, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 14, color: C.night } }, "Totale bestelling — ", bestellingRegels.length, " producten"), /* @__PURE__ */ React.createElement("button", { style: { ...SS.btnP, fontSize: 11, padding: "5px 12px" }, onClick: downloadCSV }, "\u2B07 Sligro CSV")), /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ React.createElement("table", { className:"kr-table", style: SS.tbl }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, ["Artnr", "Product", "Exact", "Bestellen", "Eenh", "", ""].map(function(h, i) {
    return /* @__PURE__ */ React.createElement("th", { key: i, style: SS.th }, h);
  }))), /* @__PURE__ */ React.createElement("tbody", null, bestellingRegels.map(function(r) {
    var isOpen = showDetail === "totaal_" + r.artnr;
    return /* @__PURE__ */ React.createElement(React.Fragment, { key: r.artnr }, /* @__PURE__ */ React.createElement(
      "tr",
      {
        style: { cursor: "pointer", background: isOpen ? C.light : C.white },
        onClick: function() {
          setShowDetail(isOpen ? null : "totaal_" + r.artnr);
        }
      },
      /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, color: C.muted, fontSize: 11 } }, r.artnr),
      /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 700 } }, r.naam),
      /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, color: C.muted } }, r.totaalRauw.toFixed(2)),
      /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 900, color: C.green, fontSize: 14 } }, r.totaalVerpakkingen),
      /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, color: C.muted } }, r.eenh),
      /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, color: C.muted, fontSize: 10 } }, r.verp, " ", r.eenh, "/verp"),
      /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, color: C.aqua, fontSize: 11, fontWeight: 700 } }, isOpen ? "Verberg" : "Berekening")
    ), isOpen && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: 7, style: { padding: 0, background: "#EEF4FF" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.muted, marginBottom: 6 } }, "Personen \xD7 porties/p \xD7 opzet% \xD7 gebruik/", r.verp, r.eenh, " = verpakkingen"), /* @__PURE__ */ React.createElement("table", { className:"kr-table", style: { ...SS.tbl, fontSize: 11 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, ["Boeking", "Menu", "Gerecht", "Pers", "Opzet%", "Port/p", "Eff.port", "Gebruik", "Verp."].map(function(h) {
      return /* @__PURE__ */ React.createElement("th", { key: h, style: { ...SS.th, background: "#2979b0", fontSize: 9 } }, h);
    }))), /* @__PURE__ */ React.createElement("tbody", null, r.berekening.map(function(c, ci) {
      return /* @__PURE__ */ React.createElement("tr", { key: ci, style: { background: ci % 2 === 0 ? C.white : "#EEF4FF" } }, /* @__PURE__ */ React.createElement("td", { style: SS.td }, c.boeking), /* @__PURE__ */ React.createElement("td", { style: SS.td }, c.menu), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 700 } }, c.gerecht), /* @__PURE__ */ React.createElement("td", { style: SS.td }, c.personen), /* @__PURE__ */ React.createElement("td", { style: SS.td }, c.pct, "%"), /* @__PURE__ */ React.createElement("td", { style: SS.td }, c.pp), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, color: C.aqua, fontWeight: 700 } }, c.portiesEff.toFixed(1)), /* @__PURE__ */ React.createElement("td", { style: SS.td }, c.gebruik), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 700, color: "#2979b0" } }, c.verpakkingen.toFixed(2)));
    }), /* @__PURE__ */ React.createElement("tr", { style: { background: "#D0E8FF" } }, /* @__PURE__ */ React.createElement("td", { colSpan: 8, style: { ...SS.td, fontWeight: 700, textAlign: "right" } }, "Totaal exact:"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 900 } }, r.totaalRauw.toFixed(2))), /* @__PURE__ */ React.createElement("tr", { style: { background: C.light } }, /* @__PURE__ */ React.createElement("td", { colSpan: 8, style: { ...SS.td, fontWeight: 700, textAlign: "right" } }, "Sligro bestelling (afgerond):"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 900, fontSize: 14, color: C.green } }, r.totaalVerpakkingen))))))));
  })))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10, padding: "8px 12px", background: C.light, borderRadius: 100, fontSize: 11, color: C.muted } }, "CSV kolommen: A=lijstnaam, C=artikelnummer, F=verpakkingen (afgerond naar boven) — direct te uploaden bij Sligro.")), opgeslagenBestellingen.length > 0 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 14, color: C.night, marginBottom: 10 } }, "Opgeslagen bestellingen"), opgeslagenBestellingen.map(function(b) {
    var kl = statusKl[b.status] || C.muted;
    var kkl = keukenKlr[b.outlet_code] || C.muted;
    var isOpen = gekozen === b.id;
    return /* @__PURE__ */ React.createElement("div", { key: b.id, style: { ...SS.card, marginBottom: 8, borderLeft: "4px solid " + kkl } }, /* @__PURE__ */ React.createElement(
      "div",
      {
        style: { display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" },
        onClick: function() {
          setGekozen(isOpen ? null : b.id);
        }
      },
      /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 3 } }, /* @__PURE__ */ React.createElement("span", { style: { background: kkl + "22", color: kkl, borderRadius: 8, padding: "1px 7px", fontSize: 11, fontWeight: 700 } }, b.outlet_code === "west" ? "🏙 West" : "🌿 Weesp"), /* @__PURE__ */ React.createElement("span", { style: { background: kl + "22", color: kl, borderRadius: 8, padding: "1px 7px", fontSize: 10, fontWeight: 700, textTransform: "uppercase" } }, b.status)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: C.night } }, b.bestel_datum), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.muted } }, (b.regels_json || []).length, " producten \xB7 €", (b.totaal_excl || 0).toFixed(2))),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.muted } }, isOpen ? "\u25B2" : "\u25BC"), /* @__PURE__ */ React.createElement(
        "button",
        {
          style: { background: "transparent", border: "1px solid #ffcdd2", color: C.hot, borderRadius: 5, padding: "3px 8px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" },
          onClick: function(e) {
            e.stopPropagation();
            verwijderBestelling(b.id);
          }
        },
        "\u2715"
      ))
    ), isOpen && (b.regels_json || []).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, borderTop: "1px solid " + C.border, paddingTop: 10, overflowX: "auto" } }, /* @__PURE__ */ React.createElement("table", { className:"kr-table", style: { ...SS.tbl, fontSize: 11 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, ["Artnr", "Product", "Aantal", "Eenh", "Totaal"].map(function(h) {
      return /* @__PURE__ */ React.createElement("th", { key: h, style: SS.th }, h);
    }))), /* @__PURE__ */ React.createElement("tbody", null, b.regels_json.map(function(r, i) {
      return /* @__PURE__ */ React.createElement("tr", { key: i }, /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, color: C.muted, fontSize: 10 } }, r.artnr || "—"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 600 } }, r.naam), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 700, textAlign: "right" } }, r.totaal_verpakkingen || r.aantal), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, color: C.muted } }, r.eenheid || "—"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, textAlign: "right" } }, "€", (r.totaal || 0).toFixed(2)));
    })))));
  })));
}

  window._SligroBestellingScreen = SligroBestellingScreen;
})();
