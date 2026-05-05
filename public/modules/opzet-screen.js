// KitchenRobot module: opzet-screen.js
// Geextraheerd uit index.html op 2026-05-05T05:22:23.865Z
// Bevat: OpzetScreen
// Externe refs (via window._): aantalBuf, berekenVerpakkingen, btnSG, calcGerecht, fDatum, opzetPct, tg, totPersPs
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function OpzetScreen() {
  var _krForceRenderO = useState(0);
  useEffect(function(){var h=function(){_krForceRenderO[1](function(x){return x+1;});};window.addEventListener("kr-filter-changed",h);window.addEventListener("recras-boekingen-geladen",h);return function(){window.removeEventListener("kr-filter-changed",h);window.removeEventListener("recras-boekingen-geladen",h);};},[]);
  var [psId, setPsId] = useState("");
  var [datumVan, setDatumVan] = useState("");
  var [datumTot, setDatumTot] = useState("");
  var [multiDagModus, setMultiDagModus] = useState(false);
  React.useEffect(function(){ window._opzetSetPsId = setPsId; return function(){ if (window._opzetSetPsId === setPsId) window._opzetSetPsId = null; }; }, [setPsId]);
  var pg = (window._stamProductgroepen || []).find(function(g) {
    return g.soorten.some(function(s) {
      return s.id === psId;
    });
  });
  var boekingen = (window._filterBoekingen ? window._filterBoekingen(window._recrasBoekingen || []) : (window._recrasBoekingen || [])).filter(function(b) {
    // Datum range filter — alleen als multiDagModus aan en van/tot ingevuld
    if (multiDagModus && datumVan && datumTot) {
      var bDatum = (b.deadline || "").replace("T"," ").split(" ")[0];
      if (bDatum < datumVan || bDatum > datumTot) return false;
    }
    var heeftNormaal = b.regels.some(function(r) {
      return !(r.menuNaam || "").toLowerCase().includes("add up");
    });
    if (!heeftNormaal) return false;
    return b.regels.some(function(r) {
      if ((r.menuNaam || "").toLowerCase().includes("add up")) return false;
      var kp = (window._stamKoppelingen || []).find(function(k) {
        return (k.recras_naam || "").trim() === (r.menuNaam || "").trim();
      });
      var m = kp ? (window._stamMenus || []).find(function(m2) {
        return m2.id === kp.menu_id;
      }) : (window._stamMenus || []).find(function(m2) {
        return m2.naam === r.menuNaam;
      });
      return m && (m.productsoort_id || m.psId) === psId;
    });
  });
  var gerechtenInMenus = /* @__PURE__ */ new Set();
  (window._stamMenus || []).forEach(function(m) {
    if ((m.productsoort_id || m.psId) !== psId) return;
    (m.menu_gerechten || []).forEach(function(mg) {
      gerechtenInMenus.add(mg.gerecht_id);
    });
  });
  var gerechten = (window._stamGerechten || []).filter(function(g) {
    return gerechtenInMenus.has(g.id);
  }).sort(function(a, b) {
    if (a.is_gn && !b.is_gn) return -1;
    if (!a.is_gn && b.is_gn) return 1;
    return a.volgorde - b.volgorde;
  });
  var kleuren = ["#3FB8C4", "#1976D2", "#43A047", "#FB8C00", "#8E24AA"];
  // AUTO-SAVE OPZETLIJST: sla tabel op als snapshot voor kiosk
  React.useEffect(function() {
    if (!psId || !boekingen.length || !window._supa) return;
    var _timer_opzet = setTimeout(function() {
      try {
        var tbl = document.getElementById("opzet-tabel-" + psId);
        if (!tbl) return;
        // Bepaal datum van eerste boeking
        var _datum = (boekingen[0].deadline || "").replace("T", " ").split(" ")[0] || "";
        if (!_datum) return;
        var psObj = (window._stamProductgroepen || []).reduce(function(f, pg2) {
          return f || (pg2.soorten || []).find(function(s) { return s.id === psId; });
        }, null);
        var psNm = pg ? ((pg.naam || "") + " › " + (psObj ? psObj.naam : psId)) : (psObj ? psObj.naam : psId);
        // Bouw volledige HTML pagina met stijlen (inline zodat iframe het goed toont)
        var _styles = [
          "body{font-family:Roboto,sans-serif;margin:0;padding:12px;background:#fff;color:#234756;font-size:12px}",
          "h2{font-size:14px;font-weight:900;margin:0 0 2px}",
          ".meta{font-size:11px;color:#555;margin-bottom:10px}",
          "table{width:100%;border-collapse:collapse}",
          "th{background:#001828;color:#fff;padding:8px 10px;text-align:left;font-size:11px}",
          "td{padding:8px 10px;border-bottom:1px solid #eee;font-size:11px}",
          "tr:nth-child(even) td{background:#f9fafb}"
        ].join("");
        var _h = "<html><head><meta charset=\"UTF-8\"><style>" + _styles + "</style></head><body>";
        _h += "<h2>Opzetoverzicht — " + psNm + "</h2>";
        _h += "<div class=\"meta\">" + (boekingen[0].deadlineDag || _datum) + "</div>";
        _h += tbl.outerHTML;
        _h += "</body></html>";
        if (_h.length < 400) return;
        window._supa.from("kiosk_opzet_snapshots").upsert({
          datum: _datum,
          ps_id: psId,
          ps_naam: psNm,
          outlet_code: window._importKeuken || "",
          html: _h,
          updated_at: new Date().toISOString()
        }, { onConflict: "datum,ps_id" }).then(function(r) {
          if (r && r.error) console.warn("[kiosk] opzet snapshot fout:", r.error);
          else console.log("[kiosk] opzet snapshot OK:", psNm, _datum);
        });
      } catch(e4) { console.warn("[kiosk] opzet auto-save:", e4); }
    }, 1000);
    return function() { clearTimeout(_timer_opzet); };
  }, [psId, boekingen.length, datumVan, datumTot]);


  return /* @__PURE__ */ React.createElement("div", null, window._FilterBar ? /* @__PURE__ */ React.createElement(window._FilterBar, { key: "krfb" }) : null, window._OpzetFilterBar ? /* @__PURE__ */ React.createElement(window._OpzetFilterBar, { key: "krofb" }) : null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: SS.pT }, "Opzetoverzicht"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("button", { style: window._btnSG, className: "no-print", onClick: function() {
    var origTitle = document.title;
    var psObj = (window._stamProductgroepen || []).reduce(function(found, pg2) {
      return found || (pg2.soorten || []).find(function(s) {
        return s.id === psId;
      });
    }, null);
    var psNm = psObj ? psObj.naam : psId || "Opzet";
    var dagStr = boekingen.length > 0 ? (function() {
      var dl = boekingen[0].deadline || "";
      var parts = dl.replace("T", " ").split(" ")[0].split("-");
      if (parts.length === 3) {
        var dt = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        var dn = ["zo", "ma", "di", "wo", "do", "vr", "za"];
        var mn = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
        return dn[dt.getDay()] + "_" + parseInt(parts[2]) + "_" + mn[parseInt(parts[1]) - 1];
      }
      return "";
    })() : "";
    document.title = psNm + (dagStr ? " \u2013 " + dagStr : "") + " \u2013 Opzetoverzicht";
    window.print();
    setTimeout(function() {
      document.title = origTitle;
    }, 1e3);
  } }, "🖨 Print / PDF"), /* @__PURE__ */ React.createElement("button", {
    style: { ...window._btnSG, background: "rgba(63,184,196,.15)", color: "#3FB8C4" },
    className: "no-print",
    onClick: function() {
      if (!psId) { alert("Selecteer eerst een productsoort."); return; }
      if (!boekingen.length) { alert("Geen boekingen gevonden voor deze productsoort."); return; }
      if (!window._supa) { alert("Geen verbinding met database."); return; }
      var tbl = document.getElementById("opzet-tabel-" + psId);
      if (!tbl) { alert("Tabel niet gevonden."); return; }
      var _datum = (boekingen[0].deadline || "").replace("T", " ").split(" ")[0] || "";
      if (!_datum) { alert("Geen datum gevonden."); return; }
      var psObj = (window._stamProductgroepen || []).reduce(function(f, pg2) {
        return f || (pg2.soorten || []).find(function(s) { return s.id === psId; });
      }, null);
      var psNm2 = pg ? ((pg.naam || "") + " \u203A " + (psObj ? psObj.naam : psId)) : (psObj ? psObj.naam : psId);
      var _styles = [
        "body{font-family:Roboto,sans-serif;margin:0;padding:12px;background:#fff;color:#234756;font-size:12px}",
        "h2{font-size:14px;font-weight:900;margin:0 0 6px}",
        "table{width:100%;border-collapse:collapse}",
        "th{background:#001828;color:#fff;padding:8px 10px;text-align:left;font-size:11px}",
        "td{padding:8px 10px;border-bottom:1px solid #eee;font-size:11px}",
        "tr:nth-child(even) td{background:#f9fafb}"
      ].join("");
      var _h = "<html><head><meta charset=\"UTF-8\"><style>" + _styles + "</style></head><body>";
      _h += "<h2>Opzetoverzicht \u2014 " + psNm2 + "</h2>";
      _h += "<div style=\"font-size:11px;color:#555;margin-bottom:10px\">" + (boekingen[0].deadlineDag || _datum) + "</div>";
      _h += tbl.outerHTML;
      _h += "</body></html>";
      window._supa.from("kiosk_opzet_snapshots").upsert({
        datum: _datum, ps_id: psId, ps_naam: psNm2,
        outlet_code: window._importKeuken || "",
        html: _h, updated_at: new Date().toISOString()
      }, { onConflict: "datum,ps_id" }).then(function(r) {
        if (r && r.error) alert("Fout: " + r.error.message);
        else alert("\u2705 Opgeslagen in kiosk!");
      });
    }
  }, "\uD83D\uDCF2 Opslaan in kiosk"))), /* @__PURE__ */ React.createElement("div", { style: (window._opzetCascadeActief ? { display:"none" } : { display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", marginBottom:10 }), className:"no-print" },
  React.createElement("button", {
    style: { background: multiDagModus ? "#E8202B" : "#fff", color: multiDagModus ? "#fff" : "#234756", border:"1.5px solid "+(multiDagModus?"#E8202B":"#D8E8EF"), borderRadius:7, padding:"6px 14px", fontFamily:"inherit", fontWeight:700, fontSize:11, cursor:"pointer" },
    onClick: function() { setMultiDagModus(!multiDagModus); }
  }, multiDagModus ? "✕ Datumbereik aan" : "📅 Datumbereik instellen"),
  multiDagModus && React.createElement("div", {style:{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}},
    React.createElement("label",{style:{fontSize:11,fontWeight:700,color:"#234756"}},"Van:"),
    React.createElement("input",{type:"date",style:{border:"1.5px solid #D8E8EF",borderRadius:7,padding:"5px 10px",fontFamily:"inherit",fontSize:11,color:"#234756"},value:datumVan,onChange:function(e){setDatumVan(e.target.value);}}),
    React.createElement("label",{style:{fontSize:11,fontWeight:700,color:"#234756"}},"Tot:"),
    React.createElement("input",{type:"date",style:{border:"1.5px solid #D8E8EF",borderRadius:7,padding:"5px 10px",fontFamily:"inherit",fontSize:11,color:"#234756"},value:datumTot,onChange:function(e){setDatumTot(e.target.value);}}),
    datumVan&&datumTot&&React.createElement("span",{style:{fontSize:11,color:"#10B981",fontWeight:700}},
      "✓ Gecombineerde opzet voor datumbereik"
    )
  )
), /* @__PURE__ */ React.createElement("div", { style: (window._opzetCascadeActief ? { display: "none" } : { display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }), className: "no-print" }, (window._stamProductgroepen || []).reduce(function(acc, g) {
    return acc.concat(g.soorten || []);
  }, []).map(function(ps_) {
    var isAct = ps_.id === psId;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: ps_.id,
        style: { background: isAct ? C.night : C.white, color: isAct ? C.white : C.night, border: "1.5px solid " + (isAct ? C.night : C.border), borderRadius: 7, padding: "5px 12px", fontFamily: "inherit", fontWeight: 700, fontSize: 11, cursor: "pointer" },
        onClick: function() {
          setPsId(ps_.id);
        }
      },
      ps_.naam
    );
  })), /* @__PURE__ */ React.createElement("div", { style: (psId ? SS.card : Object.assign({}, SS.card, { display: "none" })) }, /* @__PURE__ */ React.createElement("div", { className: "print-only", style: { marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid #234756" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 900, fontSize: 20, color: "#234756" } }, "Opzetoverzicht ", (function() {
    var psO = (window._stamProductgroepen || []).reduce(function(f, pg2) {
      return f || (pg2.soorten || []).find(function(s) {
        return s.id === psId;
      });
    }, null);
    return psO ? "- " + psO.naam : "";
  })()), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "#7A8FA6", marginTop: 2 } }, "Afgedrukt op ", (/* @__PURE__ */ new Date()).toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" }))), /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ React.createElement("table", { id: "opzet-tabel-" + psId, style: SS.tbl }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { style: { ...SS.th, minWidth: 160, background: "#001828" } }, "Gerecht"), boekingen.map(function(b, idx) {
    var kleur = kleuren[idx % kleuren.length];
    var nBuf = window._aantalBuf(window._totPersPs(b, psId));
    var pct = window._opzetPct(window._totPersPs(b, psId));
    var menusPs = b.regels.filter(function(r) {
      var kp = (window._stamKoppelingen || []).find(function(k) {
        return (k.recras_naam || "").trim() === (r.menuNaam || "").trim();
      });
      var m2 = kp ? (window._stamMenus || []).find(function(m) {
        return m.id === kp.menu_id;
      }) : (window._stamMenus || []).find(function(m) {
        return m.naam === r.menuNaam;
      });
      return m2 && (m2.productsoort_id || m2.psId) === psId;
    });
    return /* @__PURE__ */ React.createElement("th", { key: b.id, style: { ...SS.th, background: kleur, minWidth: 170, borderLeft: "2px solid rgba(255,255,255,.2)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 900, fontSize: 12, marginBottom: 2 } }, b.naam), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, opacity: 0.85 } }, "#", b.id, " \u2022 ", window._fDatum(b.deadline, true)), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 900, color: "#FFD54F", fontSize: 12 } }, b.deadlineTijd || "—"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, marginTop: 3, borderTop: "1px solid rgba(255,255,255,.2)", paddingTop: 3 } }, menusPs.map(function(r) {
      var m = (function() {
        var kp = (window._stamKoppelingen || []).find(function(k) {
          return (k.recras_naam || "").trim() === (r.menuNaam || "").trim();
        });
        return kp ? (window._stamMenus || []).find(function(m2) {
          return m2.id === kp.menu_id;
        }) : (window._stamMenus || []).find(function(m2) {
          return m2.naam === r.menuNaam;
        });
      })();
      return /* @__PURE__ */ React.createElement("div", { key: r.menuCode }, m ? m.naam : r.menuCode, ": ", r.aantal, "p");
    })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, opacity: 0.75, marginTop: 2 } }, Math.round(pct * 100), "% opzet \u2022 ", nBuf, "x buffet"));
  }), /* @__PURE__ */ React.createElement("th", { style: { ...SS.th, minWidth: 140, background: "#000d14", borderLeft: "3px solid rgba(255,255,255,.3)" } }, "TOTAAL"))), /* @__PURE__ */ React.createElement("tbody", null, gerechten.map(function(g, ri) {
    var waarden = boekingen.map(function(b) {
      return window._calcGerecht(b, g, void 0, psId);
    });
    var totaal = waarden.reduce(function(s, v) {
      return s + v;
    }, 0);
    var rowBg = ri % 2 === 0 ? C.white : "#F9FAFB";
    return /* @__PURE__ */ React.createElement("tr", { key: g.id, style: { background: rowBg } }, /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 700, background: rowBg, borderRight: "2px solid #E8EEF2" } }, g.is_gn && /* @__PURE__ */ React.createElement("span", { style: { ...window._tg(C.aqua), marginRight: 4, fontSize: 9 } }, "GN"), g.naam), waarden.map(function(v, i) {
      var b = boekingen[i];
      var nBuf = window._aantalBuf(window._totPersPs(b, psId));
      var kleur = kleuren[i % kleuren.length];
      var c = (function() {
        if (!g.is_gn || v <= 0) return null;
        var portBuf = v;
        var fmts = (g.gerecht_gn_formaten || []).filter(function(gf) {
          return (gf.porties_per_bak || 0) > 0;
        }).map(function(gf) {
          return { f: (gf.standaard_gn_formaten || {}).naam || "", p: gf.porties_per_bak || 1 };
        }).sort(function(a, b2) {
          return a.p - b2.p;
        });
        var fm = fmts.find(function(f) {
          return f.p >= portBuf;
        });
        if (!fm) fm = fmts[fmts.length - 1];
        if (!fm) return null;
        var gr = fm.f.indexOf("1/3") >= 0 ? 0 : fm.f.indexOf("1/2") >= 0 ? 1 : 2;
        return { formaat: fm.f, grootte: gr };
      })();
      var verpInfo = window._berekenVerpakkingen(g, v);
      return /* @__PURE__ */ React.createElement("td", { key: i, style: { ...SS.td, fontSize: 11, background: v === 0 ? "#F0F0F0" : rowBg, color: v === 0 ? C.muted : C.night, borderLeft: "2px solid " + kleur + "33", padding: "8px 10px" } }, v > 0 ? /* @__PURE__ */ React.createElement("div", null, g.toon_in_opzet_alleen_buffet ? (
        // Toon alleen buffet + presentatievorm
        /* @__PURE__ */ React.createElement("div", null, (function() {
          var nBuf2 = window._aantalBuf(window._totPersPs(b, psId));
          if (g.is_gn) {
            var gnf = (g.gerecht_gn_formaten || []).filter(function(gf) {
              return gf.porties_per_bak > 0;
            });
            var maxVorm = gnf.find(function(gf) {
              return gf.is_max_vorm;
            }) || gnf[gnf.length - 1];
            var gfNaam = maxVorm ? (maxVorm.standaard_gn_formaten || {}).naam || c ? c.formaat : "" : c ? c.formaat : "";
            return /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, color: C.aqua } }, nBuf2, "\xD7 ", gfNaam);
          } else {
            var schf = (g.gerecht_schaal_formaten || []).filter(function(sf) {
              return sf.porties_per_schaal > 0;
            });
            var maxSchaal = schf.find(function(sf) {
              return sf.is_max_vorm;
            }) || schf[schf.length - 1];
            var sfNaam = maxSchaal ? (maxSchaal.standaard_schaal_formaten || {}).naam || "schaal" : "schaal";
            return /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, color: C.aqua } }, nBuf2, "\xD7 ", sfNaam);
          }
        })())
      ) : g.is_gn ? (
        // GN gerecht zonder opzet instelling: toon alleen aantal
        /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700 } }, v.toFixed(0))
      ) : (
        // Niet-GN gerecht: toon portie-aantal zonder presentatievorm
        /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700 } }, v.toFixed(1))
      ), verpInfo && verpInfo.map(function(vi, vii) {
        return /* @__PURE__ */ React.createElement("div", { key: vii, style: { fontSize: 10, color: "#7B5EA7", fontWeight: 700, marginTop: 2, borderTop: vii === 0 ? "1px solid #E8EEF2" : "none", paddingTop: vii === 0 ? 2 : 0 } }, vi.exact.toFixed(1), " verp. ", vi.naam);
      })) : "-");
    }), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 900, fontSize: 11, background: ri % 2 === 0 ? "#EEF3F7" : "#E8EFF5", borderLeft: "3px solid rgba(35,71,86,.15)" } }, totaal > 0 ? /* @__PURE__ */ React.createElement("div", null, g.toonBuffet ? /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, color: C.aqua } }, totaal.toFixed(1), " ", g.portieEenh || "") : /* @__PURE__ */ React.createElement("div", null, totaal.toFixed(1), " ", g.portieEenh || ""), (function() {
      var viArr = window._berekenVerpakkingen(g, totaal);
      if (!viArr || !viArr.length) return null;
      return viArr.map(function(vi, vii) {
        return /* @__PURE__ */ React.createElement("div", { key: vii, style: { fontSize: 10, color: "#7B5EA7", fontWeight: 700, marginTop: 2 } }, vi.exact.toFixed(1), " verp. ", vi.naam);
      });
    })()) : "-"));
  }))))));
}

  window._OpzetScreen = OpzetScreen;
})();
