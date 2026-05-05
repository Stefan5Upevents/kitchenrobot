// KitchenRobot module: tijden-screen.js
// Geextraheerd uit index.html op 2026-05-05T06:35:16.606Z
// Bevat: TijdenScreen
// Externe refs (via window._): alertI, btnSG, tabStyle, totPers
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function TijdenScreen() {
  var [appTab, setAppTab] = useState("alle");
  var dagen = (window._filterBoekingen ? window._filterBoekingen(window._recrasBoekingen || []) : (window._recrasBoekingen || [])).map(function(b) {
    return (b.deadline || "").replace("T", " ").split(" ")[0];
  }).filter(function(v, i, a) {
    return v && a.indexOf(v) === i;
  }).sort();
  var [dag, setDag] = useState("");
  var [zoekTekst, setZoekTekst] = useState("");
  var [filterLocatie, setFilterLocatie] = useState("alle");
  var [filterPS, setFilterPS] = useState("alle");
  var [filterTijdVan, setFilterTijdVan] = useState("");
  var [filterTijdTot, setFilterTijdTot] = useState("");
  React.useEffect(function(){ window._tijdenSetDag = setDag; window._tijdenSetAppTab = setAppTab; window._tijdenSetZoek = setZoekTekst; return function(){ if (window._tijdenSetDag === setDag) window._tijdenSetDag = null; if (window._tijdenSetAppTab === setAppTab) window._tijdenSetAppTab = null; if (window._tijdenSetZoek === setZoekTekst) window._tijdenSetZoek = null; }; }, [setDag, setAppTab, setZoekTekst]);
  useEffect(function() {
    if (!window._tijdenCascadeActief && dagen.length > 0 && !dag) setDag(dagen[0]);
  }, [dagen.length]);
  function berekenTijdenVoorDag(selectedDag) {
    if (!selectedDag) return [];
    var resultaat = [];
    var dagBoekingen = (window._filterBoekingen ? window._filterBoekingen(window._recrasBoekingen || []) : (window._recrasBoekingen || [])).filter(function(b) {
      return (b.deadline || "").replace("T", " ").split(" ")[0] === selectedDag;
    });
    dagBoekingen.forEach(function(b) {
      var ds = (b.deadline || "").replace("T", " ").split(" ");
      var dp = (ds[0] || "").split("-");
      var tp = (ds[1] || "").split(":");
      var recrasTijd = String(parseInt(tp[0] || 0)).padStart(2, "0") + ":" + String(parseInt(tp[1] || 0)).padStart(2, "0");
      var baseMinuten = parseInt(tp[0] || 0) * 60 + parseInt(tp[1] || 0);
      var psIds = {};
      (b.regels || []).forEach(function(r) {
        if ((r.menuNaam || "").toLowerCase().includes("add up")) return;
        var kop = (window._stamKoppelingen || []).find(function(k) {
          return (k.recras_naam || "").trim() === (r.menuNaam || "").trim();
        });
        var m = kop ? (window._stamMenus || []).find(function(m2) {
          return m2.id === kop.menu_id;
        }) : null;
        if (!m) return;
        var psId = m.productsoort_id || m.psId;
        var psKey = psId + "_" + (r.starttijdTijd || recrasTijd);
          if (psId && !psIds[psKey] && typeof psId === "string" && psId.length > 10) {
          var pg = (window._stamProductgroepen || []).find(function(g) {
            return g.soorten && g.soorten.some(function(s) {
              return s.id === psId;
            });
          });
          var ps = pg && pg.soorten && pg.soorten.find(function(s) {
            return s.id === psId;
          });
          var psTijdStr = r.starttijdTijd || recrasTijd;
          var psTP = psTijdStr.split(":");
          var psMinuten = parseInt(psTP[0] || 0) * 60 + parseInt(psTP[1] || 0);
          psIds[psKey] = {
            psId,
            psTijdKey: r.starttijdTijd || recrasTijd,
            psNaam: (pg ? pg.naam + " > " : "") + (ps ? ps.naam : psId),
            psDeadline: psTijdStr,
            psMinuten,
            menuNaam: m.naam,
            aantal: window._totPers(b),
            locatieId: r.locatie_id,
            locatieNaam: (function(){var rl=(window._recrasLocaties||[]).find(function(l){return l.id===r.locatie_id;});return rl?rl.naam:(b.locatie||b.plaats||"");})(),
            locatie: b.locatie || b.plaats || ""
          };
          // Altijd Recras deadline tonen — ongeacht tijdinstellingen
          resultaat.push({
            t: psTijdStr,
            a: "Recras deadline",
            boeking: b.naam,
            boekingId: b.id,
            psNaam: (pg ? pg.naam + " › " : "") + (ps ? ps.naam : psId),
            menuNaam: m.naam,
            app: "alle",
            isRecras: true,
            uur: psMinuten,
            dag: b.deadlineDag,
            locatie: (function(){var rl=(window._recrasLocaties||[]).find(function(l){return l.id===r.locatie_id;});return rl?rl.naam:(b.locatie||b.plaats||"");})(),
            aantal: window._totPers(b)
          });
        }
      });
      Object.values(psIds).forEach(function(psInfo) {
        var ftKey = b.id + "_" + psInfo.psId;
        var ftData = window._formulierTijden && window._formulierTijden[ftKey];
        if (ftData && ftData.tijden) {
          ftData.tijden.forEach(function(t) {
            if (t.kwal === "recras") return;
            resultaat.push({
              t: t.tijd,
              a: t.naam,
              boeking: b.naam,
              psNaam: psInfo.psNaam,
              psDeadline: psInfo.psDeadline,
              menuNaam: psInfo.menuNaam || "",
              locatie: psInfo.locatieNaam || (b.locatie||""),
              aantal: window._totPers(b),
              app: (t.kwal || "algemeen").toLowerCase(),
              isRecras: false,
              uur: t.minVal || 0,
              dag: b.deadlineDag
            });
          });
          return;
        }
        var psInstCheck = (window._stamTijdenInst || []).find(function(inst) {
          return inst && inst._psId === psInfo.psId;
        });
        if (psInstCheck && psInstCheck.geenTijden) return;
        var psInst = psInstCheck && psInstCheck.tijden && psInstCheck.tijden.length ? psInstCheck : (window._stamTijdenInst || []).find(function(inst) {
          return inst && inst.tijden && inst.tijden.length && !inst.geenTijden;
        });
        if (!psInst) return;
        var psRegel = (b.regels || []).find(function(r) {
          if ((r.menuNaam || "").toLowerCase().includes("add up")) return false;
          var kp2 = (window._stamKoppelingen || []).find(function(k) {
            return (k.recras_naam || "").trim() === (r.menuNaam || "").trim();
          });
          var m2 = kp2 ? (window._stamMenus || []).find(function(m) {
            return m.id === kp2.menu_id;
          }) : null;
          if (!m2 || (m2.productsoort_id || m2.psId) !== psInfo.psId) return false;
          // Gebruik de regel die overeenkomt met de opgeslagen psTijdKey
          var rTijd = r.starttijdTijd || recrasTijd;
          return rTijd === (psInfo.psTijdKey || recrasTijd);
        });
        var psTijd = psRegel ? (psRegel.starttijdTijd || recrasTijd) : (psInfo.psTijdKey || recrasTijd);
        var psParts = psTijd.split(":");
        var psBase = parseInt(psParts[0] || 0) * 60 + parseInt(psParts[1] || 0);
        var nPers = window._totPers(b);
        var vorigeMin = psBase;
        psInst.tijden.forEach(function(t) {
          var min;
          if ((t.perGroepsgrootte || t.perGroep) && (t.tredes || []).length > 0) {
            var trSorted3 = (t.tredes || []).slice().sort(function(a, b2) {
              return (parseInt(a.tot) || 9999) - (parseInt(b2.tot) || 9999);
            });
            var trTrede3 = null;
            for (var tti = 0; tti < trSorted3.length; tti++) {
              if (nPers <= (parseInt(trSorted3[tti].tot) || 9999)) {
                trTrede3 = trSorted3[tti];
                break;
              }
            }
            min = trTrede3 ? parseInt(trTrede3.min) || 0 : parseInt(t.minuten) || 0;
          } else {
            min = parseInt(t.minuten) || 0;
          }
          var tijdMin = t.basis === "vorige" ? vorigeMin - min : psBase - min;
          vorigeMin = tijdMin;
          var uur3 = Math.floor(tijdMin / 60);
          var min3 = String(tijdMin % 60).padStart(2, "0");
          resultaat.push({
            t: String(uur3).padStart(2, "0") + ":" + min3,
            a: t.naam,
            boeking: b.naam,
            psNaam: psInfo.psNaam,
            psDeadline: psInfo.psDeadline,
            menuNaam: psInfo.menuNaam || "",
            locatie: b.locatie || "",
            aantal: psInfo.aantal || 0,
            app: (t.kwalificatie || "algemeen").toLowerCase(),
            isRecras: false,
            uur: tijdMin,
            dag: b.deadlineDag
          });
        });
      });
    });
    resultaat.sort(function(a, b_) {
      return (a.uur || 0) - (b_.uur || 0);
    });
    return resultaat;
  }
  var tijden = berekenTijdenVoorDag(dag);
  var ak = { oven: C.hot, bbq: "#5D4037", frituur: "#E65100", deadline: "#C62828" };
  var alleLocaties = ["alle"].concat(
    tijden.map(function(x) {
      return x.locatie || "";
    }).filter(function(v, i, a) {
      return v && a.indexOf(v) === i;
    }).sort()
  );
  var allePS2 = ["alle"].concat(
    tijden.map(function(x) {
      return x.psNaam || "";
    }).filter(function(v, i, a) {
      return v && a.indexOf(v) === i;
    }).sort()
  );
  var filtered;
  if (appTab === "alle") {
    filtered = tijden;
  } else if (appTab === "deadline") {
    filtered = tijden.filter(function(x) { return x.isRecras; });
  } else {
    var comboMetType = {};
    tijden.forEach(function(x) {
      if (!x.isRecras && x.app === appTab) comboMetType[x.boeking + "_" + x.psNaam] = true;
    });
    filtered = tijden.filter(function(x) {
      if (!x.isRecras) return x.app === appTab;
      return comboMetType[x.boeking + "_" + x.psNaam] === true;
    });
  }
  if (zoekTekst) {
    var zl = zoekTekst.toLowerCase();
    filtered = filtered.filter(function(x) {
      return (x.boeking || "").toLowerCase().includes(zl) || (x.menuNaam || "").toLowerCase().includes(zl) || (x.psNaam || "").toLowerCase().includes(zl) || (x.locatie || "").toLowerCase().includes(zl) || (x.a || "").toLowerCase().includes(zl);
    });
  }
  if (filterLocatie !== "alle") {
    filtered = filtered.filter(function(x) {
      return (x.locatie || "") === filterLocatie;
    });
  }
  if (filterPS !== "alle") {
    filtered = filtered.filter(function(x) {
      return (x.psNaam || "").includes(filterPS);
    });
  }
  if (filterTijdVan) {
    var vanMin = parseInt(filterTijdVan.split(":")[0] || 0) * 60 + parseInt(filterTijdVan.split(":")[1] || 0);
    filtered = filtered.filter(function(x) {
      return (x.uur || 0) >= vanMin;
    });
  }
  if (filterTijdTot) {
    var totMin = parseInt(filterTijdTot.split(":")[0] || 0) * 60 + parseInt(filterTijdTot.split(":")[1] || 0);
    filtered = filtered.filter(function(x) {
      return (x.uur || 0) <= totMin;
    });
  }
  return /* @__PURE__ */ React.createElement("div", null, window._FilterBar ? /* @__PURE__ */ React.createElement(window._FilterBar, { key:"krfb" }) : null, window._TijdenFilterBar ? /* @__PURE__ */ React.createElement(window._TijdenFilterBar, { key:"krtfb" }) : null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: SS.pT }, "Tijdenoverzicht"), /* @__PURE__ */ React.createElement("button", { style: window._btnSG, className: "no-print", onClick: function() {
    var outletNm=window._filterOutlet==="west"?"Amsterdam West":window._filterOutlet==="weesp"?"Weesp":"Alle locaties";
    var pts=dag.split("-"),pdt=new Date(parseInt(pts[0]),parseInt(pts[1])-1,parseInt(pts[2]));
    var pdn=["zo","ma","di","wo","do","vr","za"],pmn=["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"];
    var dagNm=pdn[pdt.getDay()]+" "+parseInt(pts[2])+" "+pmn[parseInt(pts[1])-1]+" "+pts[0];
    var prows=filtered.map(function(item,ii){
      var bg=item.isRecras?"#FFF5F5":(ii%2===0?"#ffffff":"#F8FAFB");
      var bl=item.isRecras?"border-left:3px solid #E8202B;":"";
      return "<tr style='background:"+bg+";"+bl+"'>"+
        "<td><b>"+item.t+"</b></td>"+
        "<td>"+item.a+"</td>"+
        "<td>"+(item.app&&item.app!=="alle"&&!item.isRecras?item.app.toUpperCase():"")+"</td>"+
        "<td>"+(item.aantal>0?item.aantal+"p":"")+"</td>"+
        "<td>"+(item.menuNaam||"")+"</td>"+
        "<td>"+item.boeking+"</td>"+
        "<td>"+(item.locatie||"")+"</td>"+
        "<td style='color:#B0BEC5'>"+(item.isRecras?"":(item.psDeadline||""))+"</td>"+
        "</tr>";
    }).join("");
    var phtml="<!DOCTYPE html><html><head><meta charset='utf-8'><title>Tijdenoverzicht</title>"+
      "<style>body{font-family:Arial,sans-serif;font-size:9pt;color:#000;margin:10mm}"+
      "h1{font-size:13pt;margin:0 0 2px;color:#002D41;font-weight:800}"+
      "h2{font-size:10pt;margin:0 0 10px;color:#6E8591;font-weight:400}"+
      "table{width:100%;border-collapse:collapse}"+
      "th{background:#002D41;color:#fff;padding:5px 8px;text-align:left;font-size:8pt;text-transform:uppercase;letter-spacing:.5px}"+
      "td{padding:4px 8px;border-bottom:1px solid #eee;font-size:9pt;vertical-align:top}"+
      "@page{size:A4 landscape;margin:10mm}</style></head><body>"+
      "<h1>"+dagNm+" \u00b7 "+outletNm+"</h1>"+
      "<h2>Tijdenoverzicht</h2>"+
      "<table><thead><tr>"+
      "<th>Tijd</th><th>Activiteit</th><th>Type</th><th>Totaal</th><th>Menu</th><th>Boeking</th><th>Locatie</th><th>Deadline</th>"+
      "</tr></thead><tbody>"+prows+"</tbody></table>"+
      "<sc"+"ript>window.onload=function(){setTimeout(function(){window.print();},400);};<\/sc"+"ript>"+
      "</body></html>";
    var pw=window.open("","_blank","width=1100,height=750");
    if(pw){pw.document.open();pw.document.write(phtml);pw.document.close();}
  } }, "🖨 Print")), /* @__PURE__ */ React.createElement("div", { style: (window._tijdenCascadeActief ? { display: "none" } : { display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }), className: "no-print" }, dagen.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: window._alertI }, "Importeer eerst boekingen via het hoofdscherm.") : dagen.map(function(d) {
    var parts = d.split("-");
    var dt = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    var dnamen = ["zo", "ma", "di", "wo", "do", "vr", "za"];
    var mnamen = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
    var dagNr = parseInt(parts[2]);
    var maandNr = parseInt(parts[1]) - 1;
    var label = dnamen[dt.getDay()] + " " + dagNr + " " + mnamen[maandNr];
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: d,
        style: { background: dag === d ? C.night : C.white, color: dag === d ? C.white : C.night, border: "1.5px solid " + (dag === d ? C.night : C.border), borderRadius: 7, padding: "5px 12px", fontFamily: "inherit", fontWeight: 700, fontSize: 11, cursor: "pointer" },
        onClick: function() {
          setDag(d);
        }
      },
      label
    );
  })), /* @__PURE__ */ React.createElement("div", { className: "print-only", style: { fontWeight: 700, fontSize: 14, marginBottom: 8, color: C.night } }, (function() {
    if (!dag) return null;
    var parts = dag.split("-");
    var dt = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    var dn = ["zo", "ma", "di", "wo", "do", "vr", "za"];
    var mn = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
    return dn[dt.getDay()] + " " + parseInt(parts[2]) + " " + mn[parseInt(parts[1]) - 1];
  })()), /* @__PURE__ */ React.createElement("div", { style: (window._tijdenCascadeActief ? { display: "none" } : SS.tabBar), className: "no-print" }, [["alle", "Alle"], ["bbq", "BBQ"], ["oven", "Oven"], ["frituur", "Frituur"], ["deadline", "Deadline"]].map(function(item) {
    return /* @__PURE__ */ React.createElement("button", { key: item[0], style: window._tabStyle(appTab === item[0]), onClick: function() {
      setAppTab(item[0]);
    } }, item[1]);
  }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }), (function() {
    var n = Object.keys(window._formulierTijden || {}).length;
    return n > 0 ? /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.green, fontWeight: 700 } }, "✓ ", n, " formulieren geladen") : /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.muted } }, "Bezoek buffetformulieren om tijden te laden");
  })()), /* @__PURE__ */ React.createElement("div", { style: (window._tijdenCascadeActief ? { display: "none" } : { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 90px 90px", gap: 8, marginBottom: 12, alignItems: "end" }), className: "no-print" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "🔍 Zoek boeking, menu, locatie..."), /* @__PURE__ */ React.createElement("input", { style: SS.inp, value: zoekTekst, placeholder: "Zoek...", onChange: function(e) {
    setZoekTekst(e.target.value);
  } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Locatie"), /* @__PURE__ */ React.createElement("select", { style: SS.inp, value: filterLocatie, onChange: function(e) {
    setFilterLocatie(e.target.value);
  } }, alleLocaties.map(function(l) {
    return /* @__PURE__ */ React.createElement("option", { key: l, value: l }, l === "alle" ? "Alle locaties" : l);
  }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Productsoort"), /* @__PURE__ */ React.createElement("select", { style: SS.inp, value: filterPS, onChange: function(e) {
    setFilterPS(e.target.value);
  } }, allePS2.map(function(p) {
    return /* @__PURE__ */ React.createElement("option", { key: p, value: p }, p === "alle" ? "Alle productsoorten" : p.split(" \u203A ").pop() || p);
  }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Tijd van"), /* @__PURE__ */ React.createElement("input", { type: "time", style: SS.inp, value: filterTijdVan, onChange: function(e) {
    setFilterTijdVan(e.target.value);
  } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Tijd tot"), /* @__PURE__ */ React.createElement("input", { type: "time", style: SS.inp, value: filterTijdTot, onChange: function(e) {
    setFilterTijdTot(e.target.value);
  } }))), (zoekTekst || filterLocatie !== "alle" || filterPS !== "alle" || filterTijdVan || filterTijdTot) && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }, className: "no-print" }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: C.muted } }, filtered.length, " van ", tijden.length, " tijdstippen"), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, fontSize: 11, padding: "3px 8px" }, onClick: function() {
    setZoekTekst("");
    setFilterLocatie("alle");
    setFilterPS("alle");
    setFilterTijdVan("");
    setFilterTijdTot("");
  } }, "\u2715 Filters wissen")), filtered.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: (dag ? { ...SS.card, ...window._alertI } : { display: "none" }) }, dag ? "Geen tijden voor deze dag/categorie. Open buffetformulieren om tijden te genereren." : "") : /* @__PURE__ */ React.createElement("div", { style: {...SS.card, overflow: "hidden", padding: 0} }, /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }, className: "opzet-tbl" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: C.night } }, ["Tijd", "Activiteit", "Kwal.", "Totaal", "Menu", "Boeking", "Locatie", "Deadline"].map(function(h) {
    return /* @__PURE__ */ React.createElement("th", { key: h, style: { ...SS.th, color: "#002D41", background: "#EEF3F6", textAlign: "left", fontSize: 11, padding: "10px 12px", borderBottom: "2px solid #C5D8E2" } }, h);
  }))), /* @__PURE__ */ React.createElement("tbody", null, filtered.map(function(item, ii) {
    var kleur = item.isRecras ? C.hot : ak[item.app] || C.night;
    return /* @__PURE__ */ React.createElement("tr", { key: ii, style: { background: item.isRecras ? "#FFEBEE" : (function(){var tc={bbq:["#FFFFFF","#F5EDE8"],oven:["#FFFFFF","#FFF3E0"],frituur:["#FFFFFF","#FFF0D6"]};var cols=tc[item.app]||["#FFFFFF","#EEF4FA"];return cols[ii%2];})(), borderLeft: item.isRecras ? "4px solid #C62828" : item.app==="bbq" ? "3px solid #795548" : item.app==="oven" ? "3px solid #E65100" : item.app==="frituur" ? "3px solid #F57C00" : "3px solid transparent" } }, /* @__PURE__ */ React.createElement("td", { style: { padding: "9px 12px", fontWeight: 900, fontSize: 16, color: kleur, whiteSpace: "nowrap" } }, item.t), /* @__PURE__ */ React.createElement("td", { style: { padding: "9px 12px", fontWeight: 700, color: kleur } }, item.a), /* @__PURE__ */ React.createElement("td", { style: { padding: "9px 12px" } }, (item.isRecras ? React.createElement("span", { style: { background: "#C62828", color: "#fff", borderRadius: 8, padding: "2px 7px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" } }, "DEADLINE") : (item.app && item.app !== "alle" ? React.createElement("span", { style: { background: ak[item.app] || C.muted, color: "#fff", borderRadius: 8, padding: "2px 7px", fontSize: 10, fontWeight: 700, textTransform: "uppercase" } }, item.app.toUpperCase()) : null))), /* @__PURE__ */ React.createElement("td", { style: { padding: "9px 12px", fontSize: 12, fontWeight: 700, color: C.night } }, item.aantal > 0 ? item.aantal + "p" : ""), /* @__PURE__ */ React.createElement("td", { style: { padding: "9px 12px", fontSize: 11, color: C.muted } }, item.menuNaam || ""), /* @__PURE__ */ React.createElement("td", { style: { padding: "9px 12px", fontSize: 12, color: C.muted } }, item.boeking), /* @__PURE__ */ React.createElement("td", { style: { padding: "9px 12px", fontSize: 11, color: C.muted } }, item.locatie || ""), /* @__PURE__ */ React.createElement("td", { style: { padding: "9px 12px", fontSize: 12, color: "#B0BEC5", fontWeight: 600, whiteSpace: "nowrap" } }, item.isRecras ? "" : (item.psDeadline || "")));
  })))));
}

  window._TijdenScreen = TijdenScreen;
})();
