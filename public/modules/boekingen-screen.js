// KitchenRobot module: boekingen-screen.js
// Geextraheerd uit index.html op 2026-05-05T08:08:26.550Z
// Bevat: BoekingenScreen
// Externe refs (via window._): btnSA
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function BoekingenScreen({ setSc, setActieve }) {
  var _krForceRender = useState(0);
  useEffect(function(){var h=function(){_krForceRender[1](function(x){return x+1;});};window.addEventListener("kr-filter-changed",h);window.addEventListener("recras-boekingen-geladen",h);return function(){window.removeEventListener("kr-filter-changed",h);window.removeEventListener("recras-boekingen-geladen",h);};},[]);
  var [openId, setOpenId] = useState(function() {
    // v2: herstel uitgeklapte boeking na terug-navigatie
    try {
      var stored = sessionStorage.getItem('boekingen_return_openId');
      if (stored) { sessionStorage.removeItem('boekingen_return_openId'); return stored; }
    } catch(e) {}
    return null;
  });
  // NIEUW (hotfix): wijzigingenMap lokaal ophalen (scope-fix)
  var [wijzigingenMap, setWijzigingenMap] = useState({});
  React.useEffect(function() {
    if (!window._supa) return;
    function laad() {
      window._supa.from('recras_wijzigingen').select('*').is('gezien_op', null).then(function(r) {
        if (!r.data) return;
        var m = {};
        r.data.forEach(function(w) {
          if (!m[w.boeking_id] || new Date(w.ontstaan_op) > new Date(m[w.boeking_id].ontstaan_op)) m[w.boeking_id] = w;
        });
        setWijzigingenMap(m);
      });
    }
    laad();
    var iv = setInterval(laad, 30000);
    return function() { clearInterval(iv); };
  }, []);
  // v2: scroll-positie herstellen
  var [boekingenScrollHersteld, setBoekingenScrollHersteld] = useState(false);
  React.useEffect(function() {
    if (boekingenScrollHersteld) return;
    var sy = null;
    try { sy = sessionStorage.getItem('boekingen_return_scrollY'); } catch(e) {}
    if (!sy) { setBoekingenScrollHersteld(true); return; }
    try { sessionStorage.removeItem('boekingen_return_scrollY'); } catch(e) {}
    setTimeout(function() {
      var y = parseInt(sy) || 0;
      var el = document.querySelector('.mobile-padding');
      if (el) el.scrollTop = y;
      window.scrollTo(0, y);
      setBoekingenScrollHersteld(true);
    }, 250);
  }, [boekingenScrollHersteld]);
  var [sortBoekVeld, setSortBoekVeld] = useState("dag");
  var [sortBoekDir, setSortBoekDir] = useState("asc");
  function toggleSortBoek(veld) {
    if (sortBoekVeld === veld) setSortBoekDir(sortBoekDir === "asc" ? "desc" : "asc");
    else {
      setSortBoekVeld(veld);
      setSortBoekDir("asc");
    }
  }
  function sortBoekIcon(veld) {
    return sortBoekVeld === veld ? sortBoekDir === "asc" ? " \u2191" : " \u2193" : " \u2195";
  }
  var boekingen = window._filterBoekingen(window._recrasBoekingen || []).slice().sort(function(a, b) {
    return (a.deadline || "").localeCompare(b.deadline || "");
  });
  function getMenuKoppelingInfo(regel) {
    var kop = (window._stamKoppelingen || []).find(function(k) {
      return (k.recras_naam || "").trim() === (regel.menuNaam || "").trim();
    });
    var m = kop ? (window._stamMenus || []).find(function(m2) {
      return m2.id === kop.menu_id;
    }) : null;
    var psNaam = "";
    if (m) {
      (window._stamProductgroepen || []).forEach(function(pg) {
        (pg.soorten || []).forEach(function(ps) {
          if (ps.id === m.productsoort_id || ps.id === m.psId) psNaam = pg.naam + " > " + ps.naam;
        });
      });
    }
    return { menu: m, psNaam };
  }
  var boekingen = window._filterBoekingen(window._recrasBoekingen || []).slice().sort(function(a, b) {
    var va, vb;
    if (sortBoekVeld === "dag") {
      va = a.deadline || "";
      vb = b.deadline || "";
    } else if (sortBoekVeld === "naam") {
      va = a.naam || "";
      vb = b.naam || "";
    } else if (sortBoekVeld === "locatie") {
      va = (a.locatie || "") + (a.plaats || "");
      vb = (b.locatie || "") + (b.plaats || "");
    } else {
      va = a.deadline || "";
      vb = b.deadline || "";
    }
    var res = va.localeCompare(vb, "nl");
    return sortBoekDir === "asc" ? res : -res;
  });
  return /* @__PURE__ */ React.createElement("div", null, window._FilterBar ? /* @__PURE__ */ React.createElement(window._FilterBar, { key: "krfb" }) : null, window._BbqConflictMeter ? /* @__PURE__ */ React.createElement(window._BbqConflictMeter, { key: "krbbq" }) : null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("div", { style: SS.pT }, "Boekingsoverzicht"), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: function(){ try { if(window._openBoekingFilterModal) window._openBoekingFilterModal(); } catch(e){} }, style: { background: "#002D41", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 11.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" } }, "🔍 Filter"), /* @__PURE__ */ React.createElement("button", { type:"button", onClick: function(){ if(window._toggleAlleBoek) window._toggleAlleBoek(); }, style: { background:"#1976D2", color:"#fff", border:"none", padding:"6px 12px", borderRadius:6, fontSize:11.5, fontWeight:700, cursor:"pointer", fontFamily:"inherit" } }, window._alleBoekOpen ? "⬆️ Inklappen" : "⬇️ Uitklappen"), window._BoekFilterModal ? /* @__PURE__ */ React.createElement(window._BoekFilterModal, { key:"krbf" }) : null), /* @__PURE__ */ React.createElement("div", { style: SS.pD }, boekingen.length, " boekingen \u2022 klik op kolomnaam om te sorteren"), /* @__PURE__ */ React.createElement("div", { style: SS.card }, /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ React.createElement("table", { className:"kr-table", style: SS.tbl }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { style: SS.th }), [["id", "ID"], ["naam", "Groepsnaam"], ["dag", "Dag"], ["status", "Status"], ["locatie", "Locatie / Plaats"], ["pers", "Pers."], ["prod", "Recras producten"]].map(function(h) {
    var klik = ["naam", "dag", "locatie"].includes(h[0]);
    return /* @__PURE__ */ React.createElement(
      "th",
      {
        key: h[0],
        style: { ...SS.th, cursor: klik ? "pointer" : "default" },
        onClick: klik ? function() {
          toggleSortBoek(h[0]);
        } : void 0
      },
      h[1],
      klik ? sortBoekIcon(h[0]) : ""
    );
  }))), /* @__PURE__ */ React.createElement("tbody", null, (window._splitMultidag?window._splitMultidag(boekingen):boekingen).filter(function(b){try{return window._filterUitgebreid?window._filterUitgebreid(b):true;}catch(e){return true;}}).map(function(b, _idx, _gefilterd) {
    var _prevDag = _idx > 0 && _gefilterd && _gefilterd[_idx-1] && _gefilterd[_idx-1].deadlineDag ? _gefilterd[_idx-1].deadlineDag : null;
    var _curDag = b.deadlineDag || null;
    var _showDagScheider = _idx === 0 || _curDag !== _prevDag;
    var isOpen = !!window._alleBoekOpen || openId === b.id;
    var uniekePsIds = /* @__PURE__ */ new Set();
    b.regels.forEach(function(r) {
      var kop = (window._stamKoppelingen || []).find(function(k) {
        return (k.recras_naam || "").trim() === (r.menuNaam || "").trim();
      });
      var m = kop ? (window._stamMenus || []).find(function(m2) {
        return m2.id === kop.menu_id;
      }) : null;
      if (m && m.productsoort_id) uniekePsIds.add(m.productsoort_id);
    });
    var aantalPsIds = uniekePsIds.size || 1;
    var totAantal = b.regels.filter(function(r) {
      return !(r.menuNaam || "").toLowerCase().includes("add up");
    }).reduce(function(sum, r) {
      return sum + (r.aantal || 0);
    }, 0);
    var pers = Math.round(totAantal / aantalPsIds);
    return /* @__PURE__ */ React.createElement(React.Fragment, { key: b.id }, _showDagScheider && _curDag ? /* @__PURE__ */ React.createElement("tr", { key: "dagsch-"+b.id, style: { background: "#002D41" } }, /* @__PURE__ */ React.createElement("td", { colSpan: 9, style: { padding: "8px 14px", color: "#fff", fontSize: 13, fontWeight: 800, letterSpacing: 0.5 } }, "📅 " + _curDag)) : null, /* @__PURE__ */ React.createElement(
      "tr",
      {
        style: { cursor: "pointer", background: isOpen ? C.light : C.white, borderLeft: '4px solid ' + (wijzigingenMap[b.id] ? (wijzigingenMap[b.id].type === 'geannuleerd' ? '#FE424D' : wijzigingenMap[b.id].type === 'gewijzigd' ? '#FF9800' : wijzigingenMap[b.id].type === 'nieuw' ? '#27AE60' : 'transparent') : 'transparent') },
        onClick: function() {
          setOpenId(isOpen ? null : b.id);
        }
      },
      /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, width: 28 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: C.muted } }, isOpen ? "\u25BC" : "\u25B6")),
      /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 10, color: C.muted } }, b.id),
      /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 900 } }, b.naam, (function(){ try { if(!window._boekingDagen) return null; var d = window._boekingDagen(b); if (d.length <= 1) return null; var badgeTxt = b._is_dag_split ? ("📅 dag " + b._dag_nr + "/" + b._totaal_dagen) : ("📅 " + d.length + " dagen"); return /* @__PURE__ */ React.createElement("span", { style: { marginLeft:8, fontSize:10, background:"#FFF3E0", color:"#E65100", padding:"2px 7px", borderRadius:4, fontWeight:700, whiteSpace:"nowrap" } }, badgeTxt); } catch(e) { return null; } })()),
      /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11, color: C.muted, whiteSpace: "nowrap" } }, b.deadlineDag || "—"),
      /* @__PURE__ */ React.createElement("td", { style: SS.td }, (function(){var s=(b.status||"").toString().toLowerCase();var isOp=s.indexOf("optie")>=0||s==="o";var heeftStatus=s.length>0;var isDef=heeftStatus && !isOp;var bg=isOp?"#FFE0B2":isDef?"#D4EDDA":"#eee";var col=isOp?"#E65100":isDef?"#155724":"#888";return /* @__PURE__ */ React.createElement("span",{style:{display:"inline-block",background:bg,color:col,padding:"3px 8px",borderRadius:4,fontSize:11,fontWeight:800,whiteSpace:"nowrap"}},isOp?"OPTIE":isDef?"DEF":"—");})()),
      /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11, color: C.muted } }, (function(){var I=window._bLocInfo?window._bLocInfo(b):null;if(!I||!I.naam)return "—";return /* @__PURE__ */ React.createElement("div",{style:{display:"flex",alignItems:"center",gap:6,fontSize:13,fontWeight:700}},/* @__PURE__ */ React.createElement("span",{style:{width:10,height:10,borderRadius:5,background:I.outlet==="west"?"#1976D2":I.outlet==="weesp"?"#388E3C":"#999",flexShrink:0}}),/* @__PURE__ */ React.createElement("span",{style:{color:I.outlet==="west"?"#1976D2":I.outlet==="weesp"?"#388E3C":"#333"}},I.naam));})()),
      /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 700 } }, pers),
      /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: C.muted } }, b.regels.length, " product(en)"))
    ), isOpen && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: 9, style: { padding: "8px 16px 12px 48px", background: "#F8FBFC" } }, (function() {
      var psGroepen = {};
      b.regels.forEach(function(r) {
        var info = getMenuKoppelingInfo(r);
        var psId4 = info.menu ? info.menu.productsoort_id || info.menu.psId : "ongekoppeld";
        if (!psGroepen[psId4]) psGroepen[psId4] = { psNaam: info.psNaam || (psId4 === "ongekoppeld" ? "Niet gekoppeld" : "?"), regels: [], psId: psId4, menu: info.menu, starttijdTijd: r.starttijdTijd || b.deadlineTijd, starttijdDag: b.deadlineDag };
        psGroepen[psId4].regels.push({ r, info });
        if (r.starttijdTijd) psGroepen[psId4].starttijdTijd = r.starttijdTijd;
      });
      return Object.values(psGroepen).map(function(grp) {
        var pg4 = grp.psId !== "ongekoppeld" ? (window._stamProductgroepen || []).find(function(pg) {
          return pg.soorten && pg.soorten.some(function(ps) {
            return ps.id === grp.psId;
          });
        }) : null;
        return /* @__PURE__ */ React.createElement("div", { key: grp.psId, style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 900, fontSize: 11, color: C.night } }, grp.psNaam), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: C.hot } }, grp.starttijdTijd || b.deadlineTijd || "—"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.muted } }, grp.starttijdDag || b.deadlineDag || ""), grp.psId !== "ongekoppeld" && /* @__PURE__ */ React.createElement(
          "button",
          {
            style: { ...window._btnSA, fontSize: 9, padding: "2px 7px" },
            onClick: function(e) {
              e.stopPropagation();
              // v2: onthoud context voor terug-knop
              try {
                var el2 = document.querySelector('.mobile-padding');
                var sy2 = (el2 && el2.scrollTop) || window.scrollY || 0;
                sessionStorage.setItem('buffet_return', JSON.stringify({ source: 'boekingen', boekingId: b.id, scrollY: sy2, ts: Date.now() }));
                sessionStorage.setItem('boekingen_return_openId', b.id);
              } catch(err) {}
              setActieve({ boekingId: b.id, psId: grp.psId, pgId: pg4 ? pg4.id : "", boekingNaam: b.naam, boekingTijd: b.deadlineTijd, boekingDag: b.deadlineDag });
              setSc("buffet");
            }
          },
          "Formulier \u2192"
        )), grp.regels.map(function(item, ri) {
          return /* @__PURE__ */ React.createElement("div", { key: ri, style: {
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "3px 8px",
            background: C.white,
            borderRadius: 5,
            marginBottom: 2,
            marginLeft: 12,
            borderLeft: "2px solid " + (item.info.menu ? C.green : "#F57F17")
          } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, fontSize: 11, minWidth: 28 } }, item.r.aantal, "\xD7"), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 11 } }, item.r.menuNaam), item.info.menu ? /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.green } }, "✓ ", item.info.menu.naam) : /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "#F57F17" } }, "\u26A0 Niet gekoppeld"));
        }));
      });
    })())));
  }))))));
}

  window._BoekingenScreen = BoekingenScreen;
})();
