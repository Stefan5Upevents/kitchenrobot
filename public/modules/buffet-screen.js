// KitchenRobot module: buffet-screen.js
// Geextraheerd uit index.html op 2026-05-05T13:13:23.958Z (v9 v8)
// Bevat: BuffetScreen
// Externe refs (via window._): AllergenenKaart, InputRauw, aantalBuf, alertI, alertW, berekenBuffetLayout, btnA, btnSG, opzetPct, supabaseProfiel, tabStyle, tg
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function BuffetScreen({ actieve, setActieve, setSc }) {
  var _krForceRenderB = useState(0);
  useEffect(function(){var h=function(){_krForceRenderB[1](function(x){return x+1;});};window.addEventListener("kr-filter-changed",h);window.addEventListener("recras-boekingen-geladen",h);return function(){window.removeEventListener("kr-filter-changed",h);window.removeEventListener("recras-boekingen-geladen",h);};},[]);
  // v2: terug-naar-vorige-scherm floating knop (dynamische tekst + scroll-herstel)
  React.useEffect(function() {
    var ret = null;
    try { ret = sessionStorage.getItem('buffet_return'); } catch(e) {}
    if (!ret) return;
    var retData = {};
    try { retData = JSON.parse(ret); } catch(e) {}
    var source = retData.source || 'chef';
    var btnTekst = source === 'boekingen' ? '← Terug naar Boekingen' : '← Terug naar Chef Portaal';
    var wrapper = document.createElement('div');
    wrapper.id = 'buffet-return-btn-wrapper';
    // v3: desktop linksonder, mobiel linksboven
    var isDesktop = window.matchMedia && window.matchMedia('(min-width: 768px)').matches;
    wrapper.style.cssText = isDesktop
      ? 'position:fixed;bottom:20px;left:20px;z-index:9999;'
      : 'position:fixed;top:70px;left:20px;z-index:9999;';
    var btn = document.createElement('button');
    btn.textContent = btnTekst;
    btn.style.cssText = 'background:#FE424D;color:#fff;border:none;border-radius:100px;padding:10px 18px;font-size:13px;font-weight:800;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-family:inherit;';
    btn.onmouseenter = function() { btn.style.background = '#D63341'; };
    btn.onmouseleave = function() { btn.style.background = '#FE424D'; };
    btn.onclick = function() {
      try {
        // Bewaar source-specifieke herstel-info
        if (retData.boekingId) {
          sessionStorage.setItem(source + '_return_boekingId', retData.boekingId);
        }
        if (retData.scrollY != null) {
          sessionStorage.setItem(source + '_return_scrollY', String(retData.scrollY));
        }
        sessionStorage.removeItem('buffet_return');
      } catch(e) {}
      if (typeof setSc === 'function') setSc(source);
    };
    wrapper.appendChild(btn);
    document.body.appendChild(wrapper);
    return function() {
      var existing = document.getElementById('buffet-return-btn-wrapper');
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    };
  }, [setSc]);

  var [overrideMarge, setOverrideMarge] = useState(null);
  var [handOpm, setHandOpm] = useState("");
  var [extraGerechten, setExtraGerechten] = useState({});
  var [overschrijven, setOverschrijven] = useState({});
  var [opgeslagenOverrides, setOpgeslagenOverrides] = useState({});
  var [bewerkModus, setBewerkModus] = useState(false);
  var [overrideNBuf, setOverrideNBuf] = useState(null);
  var [gnLayoutKey, setGnLayoutKey] = useState(0);
  var [saveStatus, setSaveStatus] = useState("");
  var [verwijderdGerechten, setVerwijderdGerechten] = useState({});
  var [toegevoegdGerechten, setToegevoeagdGerechten] = useState({});
  var [boekingenAllergenen, setBoekingenAllergenen] = useState(null);
  var [dwResultaat, setDwResultaat] = useState(null);
  var [dwLaden, setDwLaden] = useState(false);
  var [dwFout, setDwFout] = useState("");
  React.useEffect(function(){ window._buffetSetActieve = setActieve; return function(){ if (window._buffetSetActieve === setActieve) window._buffetSetActieve = null; }; }, [setActieve]);
  var formulieren = useMemo(function() {
    var lijst = [];
    var psIdSet = {};
    (window._filterBoekingen ? window._filterBoekingen(window._recrasBoekingen || []) : (window._recrasBoekingen || [])).filter(function(b){try{return window._filterUitgebreid?window._filterUitgebreid(b):true;}catch(e){return true;}}).forEach(function(b) {
      b.regels.forEach(function(r) {
        var kop = (window._stamKoppelingen || []).find(function(k) {
          return (k.recras_naam || "").trim() === (r.menuNaam || "").trim();
        });
        var m = kop ? (window._stamMenus || []).find(function(m2) {
          return m2.id === kop.menu_id;
        }) : null;
        if (!m) m = (window._stamMenus || []).find(function(m2) {
          return m2.naam === r.menuNaam;
        });
        if (!m) return;
        var psId2 = m.productsoort_id || m.psId;
        if (!psId2) return;
        var key = b.id + "_" + psId2;
        if (psIdSet[key]) return;
        psIdSet[key] = true;
        var pg2 = (window._stamProductgroepen || []).find(function(g) {
          return g.soorten && g.soorten.some(function(s) {
            return s.id === psId2;
          });
        });
        var ps2 = pg2 && pg2.soorten && pg2.soorten.find(function(s) {
          return s.id === psId2;
        });
        var psStartTijd = r.starttijdTijd || b.deadlineTijd;
        lijst.push({
          boekingId: b.id,
          boekingNaam: b.naam,
          boekingTijd: psStartTijd,
          boekingDag: b.deadlineDag,
          psId: psId2,
          psNaam: ps2 ? ps2.naam : psId2,
          pgNaam: pg2 ? pg2.naam : "",
          pgId: pg2 ? pg2.id : "", datum: b.datum || ""
        });
      });
    });
    return lijst;
  }, [(window._recrasBoekingen || []).length, (window._stamKoppelingen || []).length, (window._stamMenus || []).length, window._filterOutlet, window._filterStartdatum, window._filterEinddatum, _krForceRenderB[0]]); window.__buffet_alle_formulieren = formulieren; formulieren = (formulieren || []).filter(function(_bf){ try { return window._buffetFilterFn ? window._buffetFilterFn(_bf) : true; } catch(_e) { return true; } });
  var huidig = actieve && actieve.boekingId ? actieve : formulieren[0] || {};
  var psId = huidig.psId || "";
  var pgId = huidig.pgId || "";
  var formKey = (huidig.boekingId || "") + "_" + psId;
  useEffect(function() {
    if (!huidig.boekingId || !psId || !window._supa) return;
    window._supa.from("formulier_overrides").select("*").eq("boeking_id", huidig.boekingId).eq("productsoort_id", psId).single().then(function(r) {
      if (r.data) {
        try {
          var ovr = JSON.parse(r.data.overrides_json || "{}");
          setOpgeslagenOverrides(function(prev) {
            var n = Object.assign({}, prev);
            n[formKey] = ovr;
            return n;
          });
          if (!window._formulierOverrides) window._formulierOverrides = {};
          window._formulierOverrides[formKey] = ovr;
          if (r.data.opmerking) setHandOpm(r.data.opmerking);
        } catch (e) {
          console.warn("Override laden mislukt:", e);
        }
      }
    }).catch(function() {
    });
  }, [formKey]);
  if ((window._recrasBoekingen || []).length > 0 && formulieren.length === 0 && (window._stamMenus || []).length === 0) {
    return /* @__PURE__ */ React.createElement("div", null, window._FilterBar ? /* @__PURE__ */ React.createElement(window._FilterBar, { key: "krfb" }) : null, /* @__PURE__ */ React.createElement("div", { style: SS.card }, /* @__PURE__ */ React.createElement("div", { style: window._alertI }, "Stamgegevens laden...")));
  }
  var pg = (window._stamProductgroepen || []).find(function(g) {
    return g.id === pgId;
  });
  var ps = pg && pg.soorten && pg.soorten.find(function(s) {
    return s.id === psId;
  });
  var pgLijst = formulieren.reduce(function(acc, f) {
    if (acc.indexOf(f.pgId) < 0) acc.push(f.pgId);
    return acc;
  }, []);
  var psInPg = pg && pg.soorten ? pg.soorten.filter(function(ps_) {
    return formulieren.some(function(f) {
      return f.pgId === pgId && f.psId === ps_.id;
    });
  }) : [];
  var boekInPs = (formulieren || []).filter(function(f) {
    return f.pgId === pgId && f.psId === psId;
  });
  var boekingUitDB = (window._recrasBoekingen || []).find(function(b) {
    return b.id === huidig.boekingId;
  });
  var boeking = boekingUitDB || { id: huidig.boekingId || "", naam: huidig.boekingNaam || "", deadlineTijd: "", deadlineDag: "", regels: [], locatie: "", plaats: "" };
  var geboekteMenus = [];
  (boeking.regels || []).forEach(function(r) {
    var kop = (window._stamKoppelingen || []).find(function(k) {
      return (k.recras_naam || "").trim() === (r.menuNaam || "").trim();
    });
    var m = kop ? (window._stamMenus || []).find(function(m2) {
      return m2.id === kop.menu_id;
    }) : null;
    if (!m) m = (window._stamMenus || []).find(function(m2) {
      return m2.naam === r.menuNaam;
    });
    if (!m) return;
    var mPsId = m.productsoort_id || m.psId;
    if (mPsId !== psId) return;
    geboekteMenus.push({ menu: m, aantal: r.aantal, recrasNaam: r.menuNaam, starttijd: r.starttijd || "", starttijdTijd: r.starttijdTijd || boeking.deadlineTijd, opmerking: r.opmerking || "" });
  });
  var totaalPers = geboekteMenus.reduce(function(s, gm) {
    return s + gm.aantal;
  }, 0);
  var psDeadline = geboekteMenus.length > 0 ? geboekteMenus[0].starttijdTijd || boeking.deadlineTijd : boeking.deadlineTijd;
  var psDeadlineRaw = geboekteMenus.length > 0 ? geboekteMenus[0].starttijd || boeking.deadline : boeking.deadline;
  var opzetFactor = overrideMarge !== null ? overrideMarge / 100 : window._opzetPct(totaalPers, psId);
  var margePercent = Math.round(opzetFactor * 100);
  var nBufBase = window._aantalBuf(totaalPers);
  var nBuf = overrideNBuf !== null ? overrideNBuf : nBufBase;
  var verwijderdVoorPs = verwijderdGerechten[psId] || [];
  var alleGerechten = (window._stamGerechten || []).filter(function(g) {
    if (verwijderdVoorPs.includes(g.id)) return false;
    return g.productsoort_id === psId || (g.gerecht_productsoort_koppelingen || []).some(function(k) {
      return k.productsoort_id === psId;
    });
  }).sort(function(a, b) {
    var va = a.volgorde !== null && a.volgorde !== void 0 ? parseInt(a.volgorde) : 999;
    var vb = b.volgorde !== null && b.volgorde !== void 0 ? parseInt(b.volgorde) : 999;
    return va - vb;
  });
  function berekenPorties(g) {
    var ben = 0;
    geboekteMenus.forEach(function(gm) {
      var mg = (gm.menu.menu_gerechten || []).find(function(mg2) {
        return mg2.gerecht_id === g.id;
      });
      if (mg) ben += gm.aantal * (mg.porties_per_persoon || 1);
    });
    return ben;
  }
  var isPsBBQ = !!(pg && (pg.naam || "").toLowerCase().includes("bbq")) || !!(ps && (ps.naam || "").toLowerCase().includes("bbq"));
  var gnGerechtenVoorLayout = alleGerechten.map(function(g) {
    var portiesRauw = berekenPorties(g);
    var manualEff = (overschrijven[formKey] || {})[g.id] || (opgeslagenOverrides[formKey] || {})[g.id] || 0;
    var portiesEff = manualEff > 0 ? manualEff : portiesRauw * opzetFactor;
    if (!g.is_gn || !portiesEff || nBuf < 1) return null;
    var gnFormaten = (g.gerecht_gn_formaten || []).map(function(gf) {
      var naam = (gf.standaard_gn_formaten || {}).naam || "";
      return { f: naam, p: gf.porties_per_bak || 1, uit: false, isMax: !!gf.is_max_vorm };
    }).filter(function(gf) {
      return gf.f;
    });
    return { id: g.id, code: g.code || g.id, naam: g.naam, prio: !!g.prio, volgorde: g.volgorde || 999, ben: portiesEff, gnFormaten };
  }).filter(Boolean);
  void gnLayoutKey;
  var buffetLayout = isPsBBQ && gnGerechtenVoorLayout.length > 0 ? window._berekenBuffetLayout(gnGerechtenVoorLayout, nBuf) : null;
  function getPresentatie(g, portiesEff) {
    if (!g.heeft_presentatie) return null;
    if (g.is_gn) {
      var gnf = (g.gerecht_gn_formaten || []).filter(function(gf) {
        return gf.porties_per_bak > 0;
      }).sort(function(a, b) {
        return a.porties_per_bak - b.porties_per_bak;
      });
      var maxVorm = gnf.find(function(gf) {
        return gf.is_max_vorm;
      }) || gnf[gnf.length - 1];
      if (!maxVorm) return null;
      var gfNaam = (maxVorm.standaard_gn_formaten || {}).naam || "?";
      var bakken = maxVorm.porties_per_bak > 0 ? Math.ceil(portiesEff / maxVorm.porties_per_bak) : 0;
      var bakkenPerBuf = nBuf > 0 ? Math.ceil(bakken / nBuf) : bakken;
      return { type: "gn", naam: gfNaam, aantalBakken: bakken, bakkenPerBuf, portiesPerBak: maxVorm.porties_per_bak, perBuf: nBuf > 0 ? Math.ceil(portiesEff / maxVorm.porties_per_bak / nBuf) : 0 };
    } else {
      // Schaal escalatie: XS → Schaal midden → Schaal groot
      // Pak kleinste schaal waar portiesPerBuf <= pps. Als niets past: is_max (Schaal groot) → 1×
      var sfLijst = (g.gerecht_schaal_formaten || []).filter(function(sf) { return sf.porties_per_schaal != null; })
        .sort(function(a, b) { return (a.volgorde || 0) - (b.volgorde || 0); });
      var portiesPerBuf = nBuf > 0 ? portiesEff / nBuf : portiesEff;
      // Zoek kleinste niet-max schaal die past (portiesPerBuf <= pps)
      var gekozenSf = sfLijst.find(function(sf) {
        return !sf.is_max_vorm && (sf.porties_per_schaal || 0) > 1 && portiesPerBuf <= sf.porties_per_schaal;
      });
      // Niets past → gebruik is_max schaal (grootste)
      if (!gekozenSf) {
        var maxSf = sfLijst.slice().reverse().find(function(sf) { return sf.is_max_vorm || (sf.porties_per_schaal || 0) <= 1; })
          || sfLijst[sfLijst.length - 1];
        if (!maxSf) return null;
        var sfNaamMax = (maxSf.standaard_schaal_formaten || {}).naam || "Schaal";
        return { type: "schaal", naam: sfNaamMax, schalenPerBuf: 1, portiesPerSchaal: null };
      }
      var sfNaam = (gekozenSf.standaard_schaal_formaten || {}).naam || "Schaal";
      var aantalS = Math.ceil(portiesEff / gekozenSf.porties_per_schaal);
      var sPerBuf = nBuf > 0 ? Math.ceil(aantalS / nBuf) : aantalS;
      return { type: "schaal", naam: sfNaam, schalenPerBuf: sPerBuf, portiesPerSchaal: gekozenSf.porties_per_schaal };
    }

  }
  function getSligroVerpakkingen(g, portiesEff) {
    var items = [];
    (g.ingredienten || []).forEach(function(ing) {
      var sp = (window._stamSligro || []).find(function(p) {
        return p.id === ing.sligro_id;
      });
      if (!sp || sp.zichtbaar !== "ja") return;
      var gebruik = parseFloat(ing.gebruik_per_portie) || 0;
      var verp = parseFloat(sp.hoev || sp.hoeveelheid) || 1;
      if (!gebruik) return;
      var benodigdRauw = portiesEff * gebruik;
      var verpakkingen = benodigdRauw / verp;
      items.push({ naam: sp.naam || sp.artnr, exacte: verpakkingen, afgerond: Math.ceil(verpakkingen) });
    });
    return items;
  }
  if ((window._recrasBoekingen || []).length === 0) {
    return /* @__PURE__ */ React.createElement("div", null, window._FilterBar ? /* @__PURE__ */ React.createElement(window._FilterBar, { key: "krfb" }) : null, /* @__PURE__ */ React.createElement("div", { style: SS.pT }, "Buffetformulieren"), window._BuffetFilterBar ? /* @__PURE__ */ React.createElement(window._BuffetFilterBar, { key: "krbfb" }) : null, /* @__PURE__ */ React.createElement("div", { style: { ...SS.card, ...window._alertI } }, "Importeer een Recras boekingenexport via het hoofdscherm. Zorg dat de Recras producten zijn gekoppeld aan menus in Stamgegevens \u2192 Recras Import."));
  }
  if (formulieren.length === 0) {
    return /* @__PURE__ */ React.createElement("div", null, window._FilterBar ? /* @__PURE__ */ React.createElement(window._FilterBar, { key: "krfb" }) : null, /* @__PURE__ */ React.createElement("div", { style: SS.pT }, "Buffetformulieren"), window._BuffetFilterBar ? /* @__PURE__ */ React.createElement(window._BuffetFilterBar, { key: "krbfb" }) : null, /* @__PURE__ */ React.createElement("div", { style: { ...SS.card, ...window._alertW } }, "Boekingen zijn geladen maar geen producten zijn gekoppeld aan menus. Ga naar Stamgegevens \u2192 Recras Import en koppel de Recras producten aan de juiste menus."));
  }
  // AUTO-SAVE OPZET: sla formulier tabel op als snapshot (identiek aan website weergave)
  React.useEffect(function() {
    if (!boeking || !psId || !window._supa || !actieve) return;
    if (!alleGerechten.length) return;
    var _t3 = setTimeout(function() {
      try {
        var tbl = document.getElementById("formulier-tabel-" + formKey);
        if (!tbl) return;
        var _psnm = ps ? ps.naam : psId;
        var _menuInfo = geboekteMenus.map(function(gm) {
          return gm.aantal + "× " + (gm.menu ? gm.menu.naam : gm.recrasNaam);
        }).join(", ");
        var _css = [
          "body{font-family:Roboto,sans-serif;margin:0;padding:12px;background:#fff;color:#000}",
          "table{width:100%;border-collapse:collapse}",
          "h2{font-size:14px;font-weight:900;margin:0 0 2px}",
          ".meta{font-size:11px;color:#555;margin-bottom:4px}",
          ".menus{font-size:10px;color:#777;margin-bottom:10px}"
        ].join("");
        var _h = "<html><head><meta charset=\"UTF-8\"><style>" + _css + "</style></head><body>";
        _h += "<h2>" + boeking.naam + " — " + _psnm + "</h2>";
    "<div style=\"font-size:11px;color:#555;margin-bottom:4px\">" + boeking.deadlineDag + " &bull; " + (psDeadline || boeking.deadlineTijd || "") + " &bull; " + (boeking.locatie || "") + " &bull; " + totaalPers + "p</div>";
        _h += "<div style=\"font-size:10px;color:#777;margin-bottom:10px\">" + _menuInfo + "</div>"
        _h += tbl.outerHTML;
        _h += "</body></html>";
        if (_h.length < 500) return;
        window._supa.from("kiosk_opzet_snapshots").upsert({
          boeking_id: boeking.id,
          boeking_naam: boeking.naam,
          ps_id: psId,
          ps_naam: _psnm,
          outlet_code: boeking.outletCode || (window._importKeuken || ""),
          deadline_dag: boeking.deadlineDag || "",
          deadline_tijd: psDeadline || boeking.deadlineTijd || "",
          locatie: boeking.locatie || "",
          html: _h,
          updated_at: new Date().toISOString()
        }, { onConflict: "boeking_id,ps_id" }).then(function(r) {
          if (r && r.error) console.warn("[kiosk] opzet snapshot fout:", r.error);
          else console.log("[kiosk] opzet snapshot OK:", boeking.naam, _psnm);
        });
      } catch(e3) { console.warn("[kiosk] opzet auto-save error:", e3); }
    }, 900);
    return function() { clearTimeout(_t3); };
  }, [boeking && boeking.id, psId, JSON.stringify(opgeslagenOverrides[formKey] || {})]);


  // AUTO-SAVE: na 600ms, zelfde HTML als Print knop → kiosk_bbq_snapshots
  React.useEffect(function() {
    if (!isPsBBQ || !boeking || !psId || !window._supa) return;
    if (!alleGerechten.length) return;
    var _timer = setTimeout(function() {
      try {
        var _ovr = overschrijven[formKey] || {};
        var _svd = opgeslagenOverrides[formKey] || {};
        function _eff(g) {
          var m = _ovr[g.id] || _svd[g.id] || 0;
          return m > 0 ? m : berekenPorties(g) * opzetFactor;
        }
        function _tbl(lijst, titel) {
          if (!lijst.length) return "";
          var rows = lijst.map(function(g) {
            var e = _eff(g);
            var p2 = getPresentatie(g, e);
            var li = buffetLayout ? (buffetLayout.items || []).find(function(x) { return x.code === (g.code || g.id); }) : null;
            var ps = "";
            if (p2) {
              if (p2.type === "gn") ps = li ? li.formaat + (li.upgraded ? " \u2191" : "") : p2.naam;
              else if (p2.type === "schaal") ps = p2.schalenPerBuf + "\xD7 " + (p2.naam || "")
              else ps = (p2.vormenPerBuf || nBuf) + "\xD7 " + p2.naam + (p2.portiesPerVorm ? " (" + p2.portiesPerVorm + "p)" : "");
            }
            return "<tr><td>" + g.naam
              + (g.is_gn ? '<span style="background:#3FB8C4;color:#fff;border-radius:4px;padding:2px 6px;font-size:10px;margin-left:4px">GN</span>' : "")
              + (g.prio ? '<span style="background:#E8202B;color:#fff;border-radius:4px;padding:2px 6px;font-size:10px;margin-left:2px">PRIO</span>' : "")
              + '</td><td style="font-weight:900;font-size:16px">' + (ps || "\u2014") + "</td></tr>";
          }).join("");
          return '<h3 style="margin:20px 0 8px;font-size:15px;font-weight:900;border-bottom:2px solid #234756;padding-bottom:4px">' + titel
            + '</h3><table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr>'
            + '<th style="background:#234756;color:#fff;padding:10px 14px;text-align:left">Gerecht</th>'
            + '<th style="background:#234756;color:#fff;padding:10px 14px;text-align:left;width:180px">Presentatievorm</th>'
            + "</tr></thead><tbody>" + rows + "</tbody></table>";
        }
        var _gnL = alleGerechten.filter(function(g) { return g.is_gn && _eff(g) > 0; });
        var _niL = alleGerechten.filter(function(g) { return !g.is_gn && _eff(g) > 0; });
        var _menu = geboekteMenus.map(function(gm) { return gm.aantal + "\xD7 " + (gm.menu ? gm.menu.naam : gm.recrasNaam); }).join(", ");
        var _css = "body{font-family:Roboto,sans-serif;margin:0;padding:20px;color:#000}"
          + "h1{font-size:22px;font-weight:900;margin-bottom:4px}h2{font-size:13px;color:#666;font-weight:400;margin-bottom:8px}"
          + "td{padding:10px 14px;border-bottom:1px solid #ddd}tr:nth-child(even) td{background:#f5f8fa}"
          + "table{width:100%;border-collapse:collapse}@media print{.body *{visibility:hidden!important}.opzet-tbl,.opzet-tbl *,.print-only,.print-only *{visibility:visible!important}.opzet-tbl{position:absolute!important;top:28px!important;left:0!important;right:0!important;width:100%!important}.print-only{position:absolute!important;top:0!important;left:0!important;font-size:11pt!important}body{padding:10mm}}";
        var _h = '<html><head><meta charset="UTF-8"><style>' + _css + "</style></head><body>";
        _h += "<h1>" + boeking.naam + "</h1>";
        _h += "<h2>" + boeking.deadlineDag + " &bull; " + (psDeadline || boeking.deadlineTijd || "") + " &bull; " + (boeking.locatie || "") + " &bull; " + totaalPers + " personen &bull; " + nBuf + " buffet" + (nBuf > 1 ? "ten" : "") + "</h2>";
        _h += '<p style="font-size:12px;color:#555;margin:0 0 16px">' + _menu + "</p>";
        _h += _tbl(_gnL, "GN Bakken (Chafingdishes)");
        _h += _tbl(_niL, "Overige gerechten");
        if (buffetLayout) _h += '<p style="margin-top:16px;padding:10px 14px;background:#f0f8ff;border-radius:6px;font-size:13px;border-left:4px solid #3FB8C4"><strong>'
          + buffetLayout.dishesPerBuf + ' chafingdishes per buffet</strong> &bull; '
          + buffetLayout.counts[2] + "\xD7 GN\u00A01/1 &bull; " + buffetLayout.counts[1] + "\xD7 GN\u00A01/2 &bull; " + buffetLayout.counts[0] + "\xD7 GN\u00A01/3</p>";
        _h += "</body></html>";
        if (_h.length < 500) return; // leeg formulier, niet opslaan
        window._supa.from("kiosk_bbq_snapshots").upsert({
          boeking_id: boeking.id, boeking_naam: boeking.naam,
          ps_id: actieve ? (actieve.psId || "") : "",
          outlet_code: boeking.outletCode || (window._importKeuken || ""),
          deadline_dag: boeking.deadlineDag || "",
          deadline_tijd: psDeadline || boeking.deadlineTijd || "",
          locatie: boeking.locatie || "", html: _h,
          updated_at: new Date().toISOString()
        }, { onConflict: "boeking_id,ps_id" }).then(function(r) {
          if (r && r.error) console.warn("[kiosk] snapshot fout:", r.error);
          else console.log("[kiosk] snapshot OK:", boeking.naam, psDeadline);
        });
      } catch(e2) { console.warn("[kiosk] auto-save error:", e2); }
    }, 600);
    return function() { clearTimeout(_timer); };
  }, [boeking && boeking.id, psId, buffetLayout && buffetLayout.dishesPerBuf, JSON.stringify(opgeslagenOverrides[formKey] || {})]);


  return /* @__PURE__ */ React.createElement("div", null, window._FilterBar ? /* @__PURE__ */ React.createElement(window._FilterBar, { key: "krfb" }) : null, window._BuffetFilterBar ? /* @__PURE__ */ React.createElement(window._BuffetFilterBar, { key: "krbfb" }) : null, /* @__PURE__ */ React.createElement("style", null, `
        @media print {
          .no-print { display:none !important; }
          body { background: white !important; color: #000 !important; }
          table { border-collapse: collapse !important; }
          th { background: #1a2e3a !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          tr:nth-child(even) td { background: #f0f4f7 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          td { border-bottom: 1px solid #ccc !important; }
          .print-section-header { background: #1a2e3a !important; color: white !important; padding: 6px 12px; font-weight: 900; font-size: 14px; margin-top: 10px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `), /* @__PURE__ */ React.createElement("div", { className: "no-print", style: { marginBottom: 10 } },
  /* Dag-selector */
  (function() {
    var dagOptions = formulieren.reduce(function(acc, f) {
      var dag = f.boekingDag || "Onbekend";
      if (!acc.find(function(d){ return d.dag===dag; })) acc.push({dag: dag, datum: dag});
      return acc;
    }, []);
    var huidigDag = huidig.boekingDag || (dagOptions[0] && dagOptions[0].dag) || "";
    return null;
    return React.createElement("div", {style:{marginBottom:10}},
      React.createElement("div", {style:{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}, "Dag"),
      React.createElement("div", {style:{display:"flex",gap:6,flexWrap:"wrap"}},
        dagOptions.map(function(d) {
          var isAct = d.dag === huidigDag;
          return React.createElement("button", {
            key: d.dag,
            style: {background: isAct ? C.hot : C.white, color: isAct ? C.white : C.night,
              border: "1.5px solid "+(isAct ? C.hot : "#D8E8EF"), borderRadius:8,
              padding:"8px 16px", fontFamily:"inherit", fontWeight:700, fontSize:12, cursor:"pointer",
              boxShadow: isAct ? "0 2px 8px rgba(232,32,43,.25)" : "none"},
            onClick: function() {
              var f = formulieren.find(function(f2){ return f2.boekingDag === d.dag; });
              if (f) setActieve(f);
            }
          }, d.dag);
        })
      )
    );
  })()
),
/* @__PURE__ */ React.createElement("div", { className: "no-print", style: { display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" } }, (window._buffetCascadeActief ? [] : pgLijst).map(function(pid) {
    var pgItem = (window._stamProductgroepen || []).find(function(g) {
      return g.id === pid;
    });
    return /* @__PURE__ */ React.createElement("button", { key: pid, style: window._tabStyle(pid === pgId), onClick: function() {
      var f = formulieren.find(function(f2) {
        return f2.pgId === pid;
      });
      if (f) setActieve(f);
    } }, pgItem ? pgItem.naam : pid);
  })), /* @__PURE__ */ React.createElement("div", { className: "no-print", style: { display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" } }, (window._buffetCascadeActief ? [] : psInPg).map(function(ps_) {
    var isAct = ps_.id === psId;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: ps_.id,
        style: { background: isAct ? C.night : C.white, color: isAct ? C.white : C.night, border: "1.5px solid " + (isAct ? C.night : "#D8E8EF"), borderRadius: 100, padding: "6px 14px", fontFamily: "inherit", fontWeight: 700, fontSize: 11, cursor: "pointer" },
        onClick: function() {
          var f = formulieren.find(function(f2) {
            return f2.pgId === pgId && f2.psId === ps_.id;
          });
          if (f) setActieve(f);
        }
      },
      ps_.naam
    );
  })), /* @__PURE__ */ React.createElement("div", { className: "no-print", style: { display: "block", marginBottom: 10 } }, (function(){ try { var _perDag = {}; var _dagOrder = []; (window._buffetCascadeActief ? [] : boekInPs).forEach(function(f){ var k = f.boekingDag || "—"; if (!_perDag[k]) { _perDag[k] = []; _dagOrder.push(k); } _perDag[k].push(f); }); if (_dagOrder.length === 0) return /* @__PURE__ */ React.createElement("div", { style:{ fontSize:11, color:"#888", padding:"8px 4px" } }, "Geen boekingen in deze selectie"); return _dagOrder.map(function(_dag, _di){ return /* @__PURE__ */ React.createElement("div", { key: _di, style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#002D41", color: "#fff", padding: "3px 10px", borderRadius: 4, fontSize: 10, fontWeight: 700, marginBottom: 4, display:"inline-block", letterSpacing: 0.3 } }, "📅 " + _dag + " (" + _perDag[_dag].length + ")"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, _perDag[_dag].map(function(f){ var isAct = f.boekingId === huidig.boekingId; return /* @__PURE__ */ React.createElement("button", { key: f.boekingId, style: { background: isAct ? C.night : C.white, color: isAct ? C.white : C.night, border: "1.5px solid " + (isAct ? C.night : C.border), borderRadius: 7, padding: "6px 12px", fontFamily: "inherit", fontWeight: 700, fontSize: 11, cursor: "pointer" }, onClick: function(){ setActieve(f); } }, /* @__PURE__ */ React.createElement("div", null, f.boekingNaam || f.boekingId), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, opacity: 0.75 } }, f.boekingTijd)); }))); }); } catch(e) { console.warn("[boekInPs render]", e); return null; } })()), /* @__PURE__ */ React.createElement("div", { className: "no-print", style: { display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.muted } }, "Handmatig toevoegen:"), (pg ? pg.soorten : []).map(function(ps_) {
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: ps_.id,
        style: { ...window._btnSG, fontSize: 10 },
        onClick: function() {
          var uid = "handmatig_" + Date.now();
          var handBoeking = { id: uid, naam: "Handmatig formulier", deadline: "", deadlineTijd: "", deadlineDag: "", locatie: "", plaats: "", regels: [] };
          window._recrasBoekingen = (window._recrasBoekingen || []).concat([handBoeking]);
          var newForm = { boekingId: uid, boekingNaam: "Handmatig formulier", boekingTijd: "", boekingDag: "", psId: ps_.id, psNaam: ps_.naam, pgNaam: pg ? pg.naam : "", pgId };
          setActieve(newForm);
        }
      },
      "+ ",
      ps_.naam
    );
  })), /* @__PURE__ */ React.createElement("div", { className: "no-print", style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      style: {
        ...window._btnSG,
        fontWeight: 700,
        background: bewerkModus ? C.night : saveStatus === "saved" ? C.green : C.white,
        color: bewerkModus ? C.white : saveStatus === "saved" ? C.white : C.night
      },
      onClick: function() {
        if (bewerkModus) {
          var nieuweOvr = Object.assign({}, overschrijven[formKey] || {});
          setOpgeslagenOverrides(function(prev) {
            var n = Object.assign({}, prev);
            n[formKey] = nieuweOvr;
            return n;
          });
          if (!window._formulierOverrides) window._formulierOverrides = {};
          window._formulierOverrides[formKey] = nieuweOvr;
          setSaveStatus("saved");
          setTimeout(function() {
            setSaveStatus("");
          }, 2500);
          if (window._supa && huidig.boekingId && psId) {
            var opmTxt = handOpm || "";
            window._supa.from("formulier_overrides").upsert({
              boeking_id: huidig.boekingId,
              productsoort_id: psId,
              overrides_json: JSON.stringify(nieuweOvr),
              opmerking: opmTxt,
              updated_at: (/* @__PURE__ */ new Date()).toISOString()
            }, { onConflict: "boeking_id,productsoort_id" }).then(function(r) {
              if (r && r.error) console.warn("Opslaan formulier mislukt:", r.error);
            });
          }
        }
        setBewerkModus(!bewerkModus);
      }
    },
    bewerkModus ? "✓ Opslaan wijzigingen" : saveStatus === "saved" ? "✓ Opgeslagen" : "\u270F Aanpassen"
  ), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 11, fontWeight: 700 } }, "Opzetmarge:"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      min: "50",
      max: "150",
      step: "5",
      value: overrideMarge !== null ? overrideMarge : margePercent,
      onChange: function(e) {
        setOverrideMarge(parseInt(e.target.value) || 100);
      },
      style: { ...SS.inp, width: 65, padding: "3px 8px", fontSize: 12 }
    }
  ), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: C.muted } }, "%"), overrideMarge !== null && /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, fontSize: 10 }, onClick: function() {
    setOverrideMarge(null);
  } }, "Reset (stamdata: ", margePercent, "%)"), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 11, fontWeight: 700, marginLeft: 8 } }, "Buffetten:"), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, fontSize: 14, padding: "2px 8px" }, onClick: function() {
    setOverrideNBuf(Math.max(1, nBuf - 1));
  } }, "\u2212"), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 900, fontSize: 14, minWidth: 24, textAlign: "center", display: "inline-block" } }, nBuf), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, fontSize: 14, padding: "2px 8px" }, onClick: function() {
    setOverrideNBuf(nBuf + 1);
  } }, "+"), overrideNBuf !== null && /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, fontSize: 10 }, onClick: function() {
    setOverrideNBuf(null);
  } }, "Auto (", nBufBase, ")")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("button", { style: window._btnSG, onClick: function() {
    var origTitle = document.title;
    var psNm = ps ? ps.naam : "";
    document.title = boeking.naam + " \u2013 " + boeking.deadlineDag + " \u2013 " + psNm;
    window.print();
    setTimeout(function() {
      document.title = origTitle;
    }, 1e3);
  } }, "🖨 Print formulier"), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, fontSize: 11 }, onClick: function() {
    setOverschrijven(function(prev) {
      var n = Object.assign({}, prev);
      var fk = Object.assign({}, n[formKey] || {});
      alleGerechten.forEach(function(g) {
        if (!g.is_gn) return;
        var portRauw = berekenPorties(g);
        var portEff = fk[g.id] !== void 0 && fk[g.id] > 0 ? fk[g.id] : portRauw > 0 ? portRauw * opzetFactor : 0;
        var svdVal2 = (opgeslagenOverrides[formKey] || {})[g.id];
        if (!portEff && svdVal2) portEff = svdVal2;
        if (!portEff || portEff <= 0) return;
        var gnf = (g.gerecht_gn_formaten || []).filter(function(gf) {
          return gf.porties_per_bak > 0;
        }).sort(function(a, b) {
          return a.porties_per_bak - b.porties_per_bak;
        });
        var maxVorm = gnf.find(function(gf) {
          return gf.is_max_vorm;
        }) || gnf[gnf.length - 1];
        if (!maxVorm) return;
        var ppb = maxVorm.porties_per_bak;
        var bakkenPB = Math.ceil(portEff / ppb / nBuf);
        fk[g.id] = bakkenPB * ppb * nBuf;
      });
      n[formKey] = fk;
      return n;
    });
  } }, "GN Herbereken \u21BB"), isPsBBQ && /* @__PURE__ */ React.createElement("button", { style: { ...window._btnA, fontSize: 11 }, onClick: function() {
    var html = '<html><head><meta charset="UTF-8"><title>BBQ Opzet \u2013 ' + boeking.naam + "</title><style>";
    html += "body{font-family:Roboto,sans-serif;margin:0;padding:20px;color:#000}";
    html += "h1{font-size:22px;font-weight:900;margin-bottom:4px}";
    html += "h2{font-size:13px;color:#666;font-weight:400;margin-bottom:16px}";
    html += "table{width:100%;border-collapse:collapse;font-size:13px}";
    html += "th{background:#234756;color:#fff;padding:10px 14px;text-align:left;font-size:12px}";
    html += "td{padding:10px 14px;border-bottom:1px solid #ddd}";
    html += "tr:nth-child(even) td{background:#f5f8fa}";
    html += ".gn{background:#3FB8C4;color:#fff;border-radius:4px;padding:2px 6px;font-size:10px;margin-left:4px}";
    html += ".prio{background:#E8202B;color:#fff;border-radius:4px;padding:2px 6px;font-size:10px;margin-left:2px}";
    html += ".gray{color:#999}";
    html += ".cnt{font-size:20px;font-weight:900;color:#234756}";
    html += "@media print{.body *{visibility:hidden!important}.opzet-tbl,.opzet-tbl *,.print-only,.print-only *{visibility:visible!important}.opzet-tbl{position:absolute!important;top:28px!important;left:0!important;right:0!important;width:100%!important}.print-only{position:absolute!important;top:0!important;left:0!important;font-size:11pt!important}body{padding:10mm}@page{size:A4;margin:10mm}}";
    html += "</style></head><body>";
    html += "<h1>" + boeking.naam + "</h1>";
    var menuInfoStr = geboekteMenus.map(function(gm) {
      return gm.aantal + "\xD7 " + (gm.menu ? gm.menu.naam : gm.recrasNaam);
    }).join(", ");
    html += "<h2>" + boeking.deadlineDag + " &bull; " + (psDeadline || boeking.deadlineTijd || "") + " &bull; " + boeking.locatie + " &bull; " + totaalPers + " personen &bull; " + nBuf + " buffet" + (nBuf > 1 ? "ten" : "") + "</h2>";
    html += '<p style="margin:-8px 0 16px;font-size:12px;color:#555">' + menuInfoStr + "</p>";
    var pdfOvr = overschrijven[formKey] || {};
    var pdfSvd = opgeslagenOverrides[formKey] || {};
    function pdfPortiesEff(g) {
      var man = pdfOvr[g.id] || pdfSvd[g.id] || 0;
      return man > 0 ? man : berekenPorties(g) * opzetFactor;
    }
    var gnGerechten = alleGerechten.filter(function(g) {
      return g.is_gn && pdfPortiesEff(g) > 0;
    });
    var nijGnGerechten = alleGerechten.filter(function(g) {
      return !g.is_gn && pdfPortiesEff(g) > 0;
    });
    function renderTabel(lijst, titel) {
      if (!lijst.length) return "";
      var out = '<h3 style="margin:20px 0 8px;font-size:15px;font-weight:900;border-bottom:2px solid #234756;padding-bottom:4px">' + titel + "</h3>";
      out += '<table><thead><tr><th>Gerecht</th><th style="width:180px">Presentatievorm</th></tr></thead><tbody>';
      lijst.forEach(function(g) {
        var pEff = pdfPortiesEff(g);
        var pres2 = getPresentatie(g, pEff);
        var li = buffetLayout ? (buffetLayout.items || []).find(function(x) {
          return x.code === (g.code || g.id);
        }) : null;
        var presStr = "";
        if (pres2) {
          if (pres2.type === "gn") presStr = li ? li.formaat + (li.upgraded ? " \u2191" : "") : pres2.naam;
          else if (pres2.type === "schaal") presStr = pres2.schalenPerBuf + "\xD7 " + pres2.naam + (pres2.portiesPerSchaal ? " (" + pres2.portiesPerSchaal + "p)" : ""); else presStr = (pres2.vormenPerBuf || nBuf) + "\xD7 " + pres2.naam + (pres2.portiesPerVorm ? " (" + pres2.portiesPerVorm + "p)" : "");
        }
        var aant = g.altijd_afronden ? Math.ceil(pEff) : Math.round(pEff * 10) / 10;
        out += "<tr><td>" + g.naam + (g.is_gn ? '<span class="gn">GN</span>' : "") + (g.prio ? '<span class="prio">PRIO</span>' : "") + "</td>";
        out += '<td style="font-weight:900;font-size:16px">' + (presStr || "—") + "</td></tr>";
      });
      out += "</tbody></table>";
      return out;
    }
    html += renderTabel(gnGerechten, "GN Bakken (Chafingdishes)");
    html += renderTabel(nijGnGerechten, "Overige gerechten");
    html += '<div style="display:none"><!-- old --></div>';
    if (buffetLayout) html += '<p style="margin-top:16px;padding:10px;background:#f0f8ff;border-radius:6px;font-size:13px"><strong>Chafingdish layout:</strong> GN 1/3: ' + buffetLayout.counts[0] + " &bull; GN 1/2: " + buffetLayout.counts[1] + " &bull; GN 1/1: " + buffetLayout.counts[2] + " &bull; <strong>" + buffetLayout.dishesPerBuf + " dishes/buffet</strong></p>";
    // Voeg dieetwensen toe als die beschikbaar zijn
    if (dwResultaat && dwResultaat.regels) {
      var dwHtml = '<div style="page-break-before:always;margin-top:24px"><h2 style="font-size:16px;font-weight:900;color:#234756;border-bottom:2px solid #234756;padding-bottom:6px;margin-bottom:14px">&#128269; Dieetwensen & Allergenencheck</h2>';
      dwResultaat.regels.forEach(function(regel) {
        if (!regel.wensen_gevonden && !regel.wacht_op_wensen) return;
        dwHtml += '<div style="margin-bottom:14px;border:1px solid #ddd;border-radius:6px;overflow:hidden">';
        dwHtml += '<div style="background:#234756;color:#fff;padding:7px 12px;font-weight:700;font-size:12px">' + regel.menu_naam + '</div>';
        if (regel.wacht_op_wensen) {
          dwHtml += '<div style="padding:8px 12px;background:#FFF8E1;color:#E65100;font-size:11px;font-weight:700">&#9888; Dieetwensen volgen nog &mdash; controleer voor service!</div>';
        } else {
          // Wensen badges
          dwHtml += '<div style="padding:8px 12px;background:#F8F8F8;border-bottom:1px solid #eee;display:flex;flex-wrap:wrap;gap:4px">';
          (regel.wensen || []).forEach(function(w) {
            var bg = w.type==="allergie"?"#FFEBEE":w.type==="zwanger"?"#FCE4EC":w.type==="dieet"?"#E3F2FD":"#F3E5F5";
            var col = w.type==="allergie"?"#C62828":w.type==="zwanger"?"#880E4F":w.type==="dieet"?"#1565C0":"#6A1B9A";
            dwHtml += '<span style="background:' + bg + ';color:' + col + ';border-radius:4px;padding:2px 7px;font-size:10px;font-weight:700">' + (w.naam ? w.naam + ": " : "") + w.tekst + '</span>';
          });
          dwHtml += '</div>';
          // Gerecht analyse
          dwHtml += '<div style="padding:8px 12px">';
          (regel.gerecht_analyse || []).forEach(function(ga) {
            var worst = "geschikt";
            (ga.per_wens || []).forEach(function(pw) {
              if (pw.status==="niet_geschikt") worst="niet_geschikt";
              else if (pw.status==="controleer" && worst!=="niet_geschikt") worst="controleer";
              else if (pw.status==="onbekend" && worst==="geschikt") worst="onbekend";
            });
            if (worst === "geschikt") return; // Sla gerechten over die voor iedereen geschikt zijn
            var bgl = worst==="niet_geschikt"?"#FFEBEE":worst==="controleer"?"#FFF8E1":"#F5F5F5";
            var col = worst==="niet_geschikt"?"#C62828":worst==="controleer"?"#E65100":"#78909C";
            var sym = worst==="niet_geschikt"?"&#10007;":worst==="controleer"?"&#9888;":"?";
            dwHtml += '<div style="margin-bottom:4px;padding:4px 10px;background:' + bgl + ';border-radius:4px;border-left:3px solid ' + col + '">';
            dwHtml += '<strong style="color:' + col + ';font-size:11px">' + sym + " " + ga.gerecht_naam + '</strong>';
            (ga.per_wens || []).filter(function(pw){ return pw.status !== "geschikt"; }).forEach(function(pw) {
              dwHtml += '<div style="font-size:10px;color:' + (worst==="niet_geschikt"?"#C62828":"#E65100") + ';margin-left:12px">&bull; ' + pw.wens_tekst + ": " + pw.reden + '</div>';
            });
            dwHtml += '</div>';
          });
          dwHtml += '</div>';
        }
        dwHtml += '</div>';
      });
      dwHtml += '</div>';
      html += dwHtml;
    }
    html += "<script>window.print();window.onafterprint=function(){window.close();};<\/script>";
    html += "</body></html>";
    var bbqNaam = boeking.naam.replace(/[^a-zA-Z0-9 \-_]/g, "").trim();
    var bbqDag = (boeking.deadlineDag || "").replace(/ /g, "_");
    // window.open direct in click handler — anders geblokkeerd door browser
    var w = window.open("", "_blank", "width=900,height=700");
    if (w) {
      w.document.write(html);
      w.document.close();
      w.document.title = "BBQ_Opzet_" + bbqNaam + "_" + bbqDag;
    }
  } }, "\uD83D\uDDA8 Print BBQ"), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnA, fontSize: 11, background: "rgba(63,184,196,.15)", color: "#3FB8C4" }, onClick: function() {
    var html = '<html><head><meta charset="UTF-8"><title>BBQ Opzet \u2013 ' + boeking.naam + "</title><style>";
    html += "body{font-family:Roboto,sans-serif;margin:0;padding:20px;color:#000}";
    html += "h1{font-size:22px;font-weight:900;margin-bottom:4px}";
    html += "h2{font-size:13px;color:#666;font-weight:400;margin-bottom:16px}";
    html += "table{width:100%;border-collapse:collapse;font-size:13px}";
    html += "th{background:#234756;color:#fff;padding:10px 14px;text-align:left;font-size:12px}";
    html += "td{padding:10px 14px;border-bottom:1px solid #ddd}";
    html += "tr:nth-child(even) td{background:#f5f8fa}";
    html += ".gn{background:#3FB8C4;color:#fff;border-radius:4px;padding:2px 6px;font-size:10px;margin-left:4px}";
    html += ".prio{background:#E8202B;color:#fff;border-radius:4px;padding:2px 6px;font-size:10px;margin-left:2px}";
    html += ".gray{color:#999}";
    html += ".cnt{font-size:20px;font-weight:900;color:#234756}";
    html += "@media print{.body *{visibility:hidden!important}.opzet-tbl,.opzet-tbl *,.print-only,.print-only *{visibility:visible!important}.opzet-tbl{position:absolute!important;top:28px!important;left:0!important;right:0!important;width:100%!important}.print-only{position:absolute!important;top:0!important;left:0!important;font-size:11pt!important}body{padding:10mm}@page{size:A4;margin:10mm}}";
    html += "</style></head><body>";
    html += "<h1>" + boeking.naam + "</h1>";
    var menuInfoStr = geboekteMenus.map(function(gm) {
      return gm.aantal + "\xD7 " + (gm.menu ? gm.menu.naam : gm.recrasNaam);
    }).join(", ");
    html += "<h2>" + boeking.deadlineDag + " &bull; " + (psDeadline || boeking.deadlineTijd || "") + " &bull; " + boeking.locatie + " &bull; " + totaalPers + " personen &bull; " + nBuf + " buffet" + (nBuf > 1 ? "ten" : "") + "</h2>";
    html += '<p style="margin:-8px 0 16px;font-size:12px;color:#555">' + menuInfoStr + "</p>";
    var pdfOvr = overschrijven[formKey] || {};
    var pdfSvd = opgeslagenOverrides[formKey] || {};
    function pdfPortiesEff(g) {
      var man = pdfOvr[g.id] || pdfSvd[g.id] || 0;
      return man > 0 ? man : berekenPorties(g) * opzetFactor;
    }
    var gnGerechten = alleGerechten.filter(function(g) {
      return g.is_gn && pdfPortiesEff(g) > 0;
    });
    var nijGnGerechten = alleGerechten.filter(function(g) {
      return !g.is_gn && pdfPortiesEff(g) > 0;
    });
    function renderTabel(lijst, titel) {
      if (!lijst.length) return "";
      var out = '<h3 style="margin:20px 0 8px;font-size:15px;font-weight:900;border-bottom:2px solid #234756;padding-bottom:4px">' + titel + "</h3>";
      out += '<table><thead><tr><th>Gerecht</th><th style="width:180px">Presentatievorm</th></tr></thead><tbody>';
      lijst.forEach(function(g) {
        var pEff = pdfPortiesEff(g);
        var pres2 = getPresentatie(g, pEff);
        var li = buffetLayout ? (buffetLayout.items || []).find(function(x) {
          return x.code === (g.code || g.id);
        }) : null;
        var presStr = "";
        if (pres2) {
          if (pres2.type === "gn") presStr = li ? li.formaat + (li.upgraded ? " \u2191" : "") : pres2.naam;
          else if (pres2.type === "schaal") presStr = pres2.schalenPerBuf + "\xD7 " + pres2.naam + (pres2.portiesPerSchaal ? " (" + pres2.portiesPerSchaal + "p)" : ""); else presStr = (pres2.vormenPerBuf || nBuf) + "\xD7 " + pres2.naam + (pres2.portiesPerVorm ? " (" + pres2.portiesPerVorm + "p)" : "");
        }
        var aant = g.altijd_afronden ? Math.ceil(pEff) : Math.round(pEff * 10) / 10;
        out += "<tr><td>" + g.naam + (g.is_gn ? '<span class="gn">GN</span>' : "") + (g.prio ? '<span class="prio">PRIO</span>' : "") + "</td>";
        out += '<td style="font-weight:900;font-size:16px">' + (presStr || "—") + "</td></tr>";
      });
      out += "</tbody></table>";
      return out;
    }
    html += renderTabel(gnGerechten, "GN Bakken (Chafingdishes)");
    html += renderTabel(nijGnGerechten, "Overige gerechten");
    html += '<div style="display:none"><!-- old --></div>';
    if (buffetLayout) html += '<p style="margin-top:16px;padding:10px;background:#f0f8ff;border-radius:6px;font-size:13px"><strong>Chafingdish layout:</strong> GN 1/3: ' + buffetLayout.counts[0] + " &bull; GN 1/2: " + buffetLayout.counts[1] + " &bull; GN 1/1: " + buffetLayout.counts[2] + " &bull; <strong>" + buffetLayout.dishesPerBuf + " dishes/buffet</strong></p>";
    html += "<script>window.print();window.onafterprint=function(){window.close();};<\/script>";
    html += "</body></html>";
    var bbqNaam = boeking.naam.replace(/[^a-zA-Z0-9 \-_]/g, "").trim();
    var bbqDag = (boeking.deadlineDag || "").replace(/ /g, "_");
    // Daarna asynchroon opslaan in kiosk
    if (window._supa) {
      window._supa.from("kiosk_bbq_snapshots").upsert({
        boeking_id: boeking.id,
        boeking_naam: boeking.naam,
        ps_id: actieve ? (actieve.psId || "") : "",
        outlet_code: boeking.outletCode || (window._importKeuken || ""),
        deadline_dag: boeking.deadlineDag || "",
        deadline_tijd: psDeadline || boeking.deadlineTijd || "",
        locatie: boeking.locatie || "",
        html: html,
        updated_at: new Date().toISOString(),
        updated_door: window.sbProfiel ? (window._supabaseProfiel ? window._supabaseProfiel.naam || window._supabaseProfiel.email || "" : "") : ""
      }, { onConflict: "boeking_id,ps_id" }).then(function(r) {
        if (!r.error) alert("\u2705 Opgeslagen in kiosk!"); else alert("Fout: " + (r.error.message || r.error));
      });
    }
  } }, "\uD83D\uDCF2 Opslaan in kiosk"), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, fontSize: 12 }, onClick: function() {
    setBoekingenAllergenen(Object.assign({}, boeking, { activePsId: psId }));
  } }, "🏷 Allergenenkaart"),
/* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, fontSize: 12, background: "rgba(63,184,196,.15)", color: "#3FB8C4" }, onClick: function() {

    var sligro = window._stamSligro || [];

    // Profiel per gerecht: verzamelt EU-allergenen + volledige ingrediententekst per gerecht
    function bouwProfiel(g) {
      var bev = new Set(), mog = new Set(), bevNiet = new Set();
      var hasAllergenInfo = false, hasIngredientText = false;
      var volledigeTekst = []; // verzameling van productnaam + ingredientlijst per sligro product
      var productHits = []; // {sligro_naam, tekst} voor toelichting

      (g.ingredienten || []).forEach(function(ing) {
        var sp = sligro.find(function(p) { return p.id === ing.sligro_id; });
        if (!sp) return;

        // EU-allergenen inladen
        if (sp.allergenen_json) {
          hasAllergenInfo = true;
          var a = sp.allergenen_json;
          (a.bevat || []).forEach(function(k) { bev.add(k); });
          (a.mogelijk || []).forEach(function(k) { if (!bev.has(k)) mog.add(k); });
          (a.bevat_niet || []).forEach(function(k) { bevNiet.add(k); });
        }

        // Ingredienten tekst inladen
        var tekst = ((sp.naam || "") + " " + (sp.ingredienten_tekst || "")).toLowerCase();
        if ((sp.ingredienten_tekst || "").length > 10) hasIngredientText = true;
        volledigeTekst.push(tekst);
        productHits.push({ naam: sp.naam, tekst: sp.ingredienten_tekst || "" });
      });

      return {
        bev: bev, mog: mog, bevNiet: bevNiet,
        hasAllergenInfo: hasAllergenInfo,
        hasIngredientText: hasIngredientText,
        hasInfo: hasAllergenInfo || hasIngredientText,
        tekst: volledigeTekst.join(" | "),
        products: productHits,
        aantalIng: (g.ingredienten||[]).length
      };
    }

    // Zoek keyword in tekst — met slimme word-boundary detectie voor korte woorden zoals "ui"
    function zoekKeyword(tekst, keyword) {
      if (!tekst || !keyword) return false;
      var kw = keyword.toLowerCase().trim();
      if (!kw) return false;
      // Als keyword al komma's/spaties bevat (bv " ui,") — gewoon indexOf
      if (/[\s,()]/.test(kw)) {
        return tekst.indexOf(kw) >= 0;
      }
      // Voor normale woorden: word boundary check
      var regex = new RegExp('(^|[\\s,()\\-/.])' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([\\s,()\\-/.]|$)', 'i');
      return regex.test(tekst);
    }

    // Check één wens tegen profiel
    function check(wens, prof) {
      if (!prof.hasInfo) {
        return { status: "onbekend", reden: prof.aantalIng === 0 ? "Geen ingrediënten gekoppeld" : "Geen Sligro-data beschikbaar" };
      }

      // 1. EU-allergenen check (definitief)
      var keys = wens.allergeen_keys || [];
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (prof.bev.has(k)) return { status: "niet_geschikt", reden: "Bevat " + k + " (EU-allergeen)" };
        if (prof.mog.has(k)) {
          if (wens.sporen_ok) continue;
          return { status: "controleer", reden: "Mogelijk sporen van " + k };
        }
      }

      // 2. Zoek-keywords in ingrediëntentekst (voor ui/knoflook/varken/etc.)
      var zoek = wens.zoek_keywords || [];
      for (var z = 0; z < zoek.length; z++) {
        var kw = zoek[z];
        if (zoekKeyword(prof.tekst, kw)) {
          // Vind specifiek product waar het in staat
          var product = null;
          for (var p = 0; p < prof.products.length; p++) {
            var t = (prof.products[p].naam + " " + prof.products[p].tekst).toLowerCase();
            if (zoekKeyword(t, kw)) { product = prof.products[p]; break; }
          }
          return {
            status: "niet_geschikt",
            reden: "Bevat " + kw.trim() + (product ? " (in " + product.naam + ")" : "")
          };
        }
      }

      // 3. Als we de tekst hebben en niets gevonden → GESCHIKT (niet meer onbekend/oranje)
      if (prof.hasIngredientText) {
        return { status: "geschikt", reden: "Geen '" + (zoek.join("', '") || keys.join("', '") || "trigger-ingredient") + "' gevonden in ingredi\u00ebntenlijst" };
      }

      // 4. Handmatige check als laatste redmiddel
      if (wens.requires_manual) {
        return { status: "controleer", reden: wens.manual_note || "Handmatig controleren" };
      }

      // 5. Alleen allergenen-data, geen ingrediententekst, geen relevante allergenen
      return { status: "geschikt", reden: "Geen relevante allergenen gevonden" };
    }

    // Filter regels met opmerking
    var regelsMetOpm = (geboekteMenus || []).filter(function(gm) {
      return gm.opmerking && gm.opmerking.trim().length > 2;
    });

    if (regelsMetOpm.length === 0) {
      setDwFout("Geen opmerkingen gevonden voor dit formulier.");
      setDwResultaat(null);
      return;
    }

    // Start met lege state — tabs worden aangemaakt als wensen binnen komen
    setDwResultaat({ tabs: [], actief: 0, laadRegels: regelsMetOpm.length, klaarRegels: 0 });
    setDwFout("");

    // Per regel: parse, dan wensen uitsplitsen als aparte tabs
    regelsMetOpm.forEach(function(gm, regelIdx) {
      fetch("https://aezatnwsrhlwtykpixsq.supabase.co/functions/v1/dieetwensen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menu_naam: gm.recrasNaam, aantal: gm.aantal, opmerking: gm.opmerking })
      })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d.error) throw new Error(d.error);

        // Welke gerechten horen bij dit menu/productsoort?
        // Gebruik alleGerechten (= alle gerechten in de actieve productsoort)
        var gerechtenVoorDezeRegel = alleGerechten;

        // Per wens een aparte tab maken
        var nieuweTabs = [];

        if (d.wacht_op_wensen) {
          nieuweTabs.push({
            menu_naam: gm.recrasNaam,
            wens_tekst: "Dieetwensen volgen",
            wens_aantal: 0,
            status: "wacht_op_wensen",
            wens: null,
            analyse: [],
            origineel: gm.opmerking
          });
        } else if (d.geen_wensen) {
          nieuweTabs.push({
            menu_naam: gm.recrasNaam,
            wens_tekst: "Geen wensen",
            wens_aantal: 0,
            status: "geen_wensen",
            wens: null,
            analyse: [],
            origineel: gm.opmerking
          });
        } else if (d.wensen_gevonden && d.wensen && d.wensen.length > 0) {
          // ELKE wens → aparte tab
          d.wensen.forEach(function(w) {
            var analyse = gerechtenVoorDezeRegel.map(function(g) {
              var prof = bouwProfiel(g);
              var res = check(w, prof);
              return { gerecht_naam: g.naam, status: res.status, reden: res.reden };
            });
            nieuweTabs.push({
              menu_naam: gm.recrasNaam,
              wens_tekst: w.tekst,
              wens_volledig: w.tekst_volledig || w.tekst,
              wens_aantal: w.aantal || 1,
              wens_naam: w.naam,
              wens_type: w.type,
              status: "klaar",
              wens: w,
              analyse: analyse,
              origineel: gm.opmerking
            });
          });
        } else {
          // geen wensen gevonden (maar wel opmerking)
          nieuweTabs.push({
            menu_naam: gm.recrasNaam,
            wens_tekst: "Geen dieetwensen gevonden",
            wens_aantal: 0,
            status: "geen_dieetwens",
            wens: null,
            analyse: [],
            origineel: gm.opmerking
          });
        }

        // Voeg toe aan bestaande tabs
        setDwResultaat(function(prev) {
          if (!prev) return prev;
          return Object.assign({}, prev, {
            tabs: prev.tabs.concat(nieuweTabs),
            klaarRegels: prev.klaarRegels + 1
          });
        });
      })
      .catch(function(e) {
        setDwResultaat(function(prev) {
          if (!prev) return prev;
          var foutTab = {
            menu_naam: gm.recrasNaam,
            wens_tekst: "⚠ Fout",
            wens_aantal: 0,
            status: "fout",
            fout: e.message,
            analyse: [],
            origineel: gm.opmerking
          };
          return Object.assign({}, prev, {
            tabs: prev.tabs.concat([foutTab]),
            klaarRegels: prev.klaarRegels + 1
          });
        });
      });
    });
} }, "\uD83D\uDD0D Dieetwensen"),
/* @__PURE__ */ React.createElement("button", { style: window._btnA, onClick: function() {
    window.open("https://upevents.recras.nl/v2/customer/" + (boeking.id || "").split("-")[0], "_blank");
  } }, "Publiceer Recras \u2192"))), /* @__PURE__ */ React.createElement("div", { style: { background: C.white, padding: "16px 20px", borderRadius: 16, border: "1px solid " + C.border } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, borderBottom: "2px solid " + C.night, paddingBottom: 10 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 900, fontSize: 20, color: C.night } }, boeking.naam), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.muted } }, pg ? pg.naam : "", " \u203A ", ps ? ps.naam : "", " \u2022 #", boeking.id), boeking.locatie && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: C.muted } }, boeking.locatie, boeking.plaats ? ", " + boeking.plaats : "")), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 1 } }, "Recras deadline"), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 900, fontSize: 24, color: C.hot } }, psDeadline || boeking.deadlineTijd || "—"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.muted } }, boeking.deadlineDag || "—"))), (function() {
    var psInstAll = (window._stamTijdenInst || []).find(function(inst) {
      return inst && inst._psId === psId;
    });
    if (psInstAll && psInstAll.geenTijden) return null;
    var psInst = psInstAll && psInstAll.tijden && psInstAll.tijden.length ? psInstAll : (window._stamTijdenInst || []).find(function(inst) {
      return inst && inst.tijden && inst.tijden.length && !inst.geenTijden;
    });
    var rawDl = psDeadlineRaw || boeking.deadline;
    if (!psInst || !rawDl) return null;
    var ds = (rawDl || "").replace("T", " ").split(" ");
    var dp = (ds[0] || "").split("-");
    var tp = (ds[1] || "").split(":");
    var recrasDt = new Date(parseInt(dp[0]), parseInt(dp[1]) - 1, parseInt(dp[2]), parseInt(tp[0]) || 0, parseInt(tp[1]) || 0, 0);
    if (isNaN(recrasDt.getTime())) return null;
    var tijdItems = [];
    var huidigMin = parseInt(tp[0] || 0) * 60 + parseInt(tp[1] || 0);
    var baseMin = parseInt(tp[0] || 0) * 60 + parseInt(tp[1] || 0);
    var vorigeMin = baseMin;
    psInst.tijden.forEach(function(t) {
      var min;
      if ((t.perGroepsgrootte || t.perGroep) && (t.tredes || []).length > 0) {
        var gevondenTrede = null;
        var trSorted = (t.tredes || []).slice().sort(function(a, b) {
          return (parseInt(a.tot) || 9999) - (parseInt(b.tot) || 9999);
        });
        for (var ti = 0; ti < trSorted.length; ti++) {
          if (totaalPers <= (parseInt(trSorted[ti].tot) || 9999)) {
            gevondenTrede = trSorted[ti];
            break;
          }
        }
        min = gevondenTrede ? parseInt(gevondenTrede.min) || 0 : parseInt(t.minuten) || 0;
      } else {
        min = parseInt(t.minuten) || 0;
      }
      var tijdMin;
      if (t.basis === "vorige") {
        tijdMin = vorigeMin - min;
      } else {
        tijdMin = baseMin - min;
      }
      vorigeMin = tijdMin;
      var uur2 = Math.floor(tijdMin / 60);
      var min2 = String(tijdMin % 60).padStart(2, "0");
      tijdItems.push({ tijd: String(uur2).padStart(2, "0") + ":" + min2, naam: t.naam, kwal: t.kwalificatie || "Algemeen", minVal: tijdMin });
    });
    tijdItems.sort(function(a, b) {
      return (a.minVal || 0) - (b.minVal || 0);
    });
    var recrasTijdStr = String(parseInt(tp[0] || 0)).padStart(2, "0") + ":" + String(parseInt(tp[1] || 0)).padStart(2, "0");
    tijdItems.push({ tijd: recrasTijdStr, naam: "Recras deadline", kwal: "recras", minVal: parseInt(tp[0] || 0) * 60 + parseInt(tp[1] || 0) });
    if (!window._formulierTijden) window._formulierTijden = {};
    var ftKey = boeking.id + "_" + psId;
    var ftData = {
      boeking: boeking.naam,
      boekingId: boeking.id,
      psNaam: (pg ? pg.naam + " > " : "") + (ps ? ps.naam : psId),
      psId,
      dag: boeking.deadlineDag,
      deadline: recrasTijdStr,
      tijden: tijdItems.slice()
    };
    window._formulierTijden[ftKey] = ftData;
    if (window._supa && psId && boeking.id) {
      window._supa.from("formulier_tijden").upsert({
        boeking_id: boeking.id,
        productsoort_id: psId,
        boeking_naam: boeking.naam,
        ps_naam: ftData.psNaam,
        dag: boeking.deadlineDag,
        deadline: recrasTijdStr,
        tijden_json: JSON.stringify(tijdItems),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }, { onConflict: "boeking_id,productsoort_id" }).then(function(r) {
        if (r && r.error) console.warn("formulier_tijden opslaan:", r.error);
      });
    }
    return /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10, background: "#FFF8E1", borderRadius: 14, padding: "8px 14px", display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1 } }, "Tijden"), tijdItems.map(function(t, i) {
      var isRecras = t.kwal === "recras";
      return /* @__PURE__ */ React.createElement("div", { key: i, style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 900, fontSize: 16, color: isRecras ? C.hot : C.night } }, t.tijd), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: isRecras ? C.hot : C.muted } }, t.naam), t.kwal && !isRecras && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8, color: C.muted, opacity: 0.7 } }, t.kwal));
    }));
  })(), (function() {
    var opmLijst = [];
    var streetfoodItems = [];
    (boeking.regels || []).forEach(function(r) {
      var naam = (r.menuNaam || "").toLowerCase();
      if (naam.includes("foodtruck") && naam.includes("add up")) {
        var sfMenu = (window._stamMenus || []).find(function(m) {
          return m.naam.toLowerCase().includes("foodtruck");
        });
        if (sfMenu) streetfoodItems.push({ menu: sfMenu, aantal: r.aantal, type: "Foodtruck" });
      }
      if (naam.includes("marktkraam") && naam.includes("add up")) {
        var sfMenu = (window._stamMenus || []).find(function(m) {
          return m.naam.toLowerCase().includes("marktkraam");
        });
        if (sfMenu) streetfoodItems.push({ menu: sfMenu, aantal: r.aantal, type: "Marktkraam" });
      }
    });
    geboekteMenus.forEach(function(gm) {
      var tekst = (gm.opmerking || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      if (tekst) opmLijst.push({ product: gm.recrasNaam, tekst });
      var lowerTekst = tekst.toLowerCase();
      var sfMenus = (window._stamMenus || []).filter(function(m) {
        var mn = m.naam.toLowerCase();
        return mn.includes("foodtruck") || mn.includes("marktkraam") || mn.includes("streetfood");
      });
      sfMenus.forEach(function(sfMenu) {
        var sfNaam = sfMenu.naam.toLowerCase();
        var sfType = sfNaam.includes("foodtruck") ? "foodtruck" : sfNaam.includes("marktkraam") ? "marktkraam" : "streetfood";
        if (!lowerTekst.includes(sfType)) return;
        var numMatch = tekst.match(new RegExp("(\\d+)\\s*[x\xD7]?\\s*" + sfType, "i")) || tekst.match(new RegExp(sfType + "[^\\d]*(\\d+)", "i"));
        var sfAantal = numMatch ? parseInt(numMatch[1] || numMatch[2]) : null;
        if (!sfAantal && gm.aantal) sfAantal = gm.aantal;
        if (sfAantal && !streetfoodItems.some(function(s) {
          return s.menu.id === sfMenu.id;
        })) {
          streetfoodItems.push({ menu: sfMenu, aantal: sfAantal, type: sfType });
        }
      });
    });
    if (handOpm) opmLijst.push({ product: "Handmatig", tekst: handOpm });
    if (!opmLijst.length) return null;
    return /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10, background: "#FFF3E0", borderRadius: 14, padding: "8px 14px", borderLeft: "4px solid #FF9800" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "#E65100", marginBottom: 6 } }, "\u26A0 Opmerkingen"), opmLijst.map(function(o, i) {
      return /* @__PURE__ */ React.createElement("div", { key: i, style: { fontSize: 11, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("strong", null, o.product, ":"), " ", o.tekst);
    }), streetfoodItems.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6, padding: "6px 10px", background: "#E8F5E9", borderRadius: 100, fontSize: 11 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, color: C.green, marginBottom: 4 } }, "🚚 Streetfood gedetecteerd:"), streetfoodItems.map(function(sf, sfi) {
      return /* @__PURE__ */ React.createElement("div", { key: sfi, style: { marginBottom: 2 } }, /* @__PURE__ */ React.createElement("strong", null, sf.aantal, "\xD7"), " ", sf.type, " — menu: ", /* @__PURE__ */ React.createElement("strong", null, sf.menu.naam));
    })));
  })(), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10, background: "#F8FBFC", borderRadius: 14, padding: "8px 12px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 12 } }, "Geboekte menus — ", totaalPers, " personen totaal"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.muted } }, "Opzetmarge: ", /* @__PURE__ */ React.createElement("strong", null, margePercent, "%"), isPsBBQ && /* @__PURE__ */ React.createElement("span", null, " \u2022 ", nBuf, " buffet", nBuf !== 1 ? "ten" : ""), buffetLayout && /* @__PURE__ */ React.createElement("span", null, " \u2022 ", /* @__PURE__ */ React.createElement("strong", null, buffetLayout.dishesPerBuf), " dishes/buf"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } }, geboekteMenus.map(function(gm, i) {
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { background: C.white, borderRadius: 100, padding: "4px 10px", border: "1px solid " + C.border, fontSize: 12 } }, /* @__PURE__ */ React.createElement("strong", null, gm.aantal, "\xD7"), " ", gm.menu.naam);
  }))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: C.muted } }, "Opmerking formulier:")), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      defaultValue: handOpm,
      onChange: function(e) {
        setHandOpm(e.target.value);
      },
      "data-opmerking": formKey,
      placeholder: "Voeg hier handmatige opmerkingen toe...",
      style: { width: "100%", minHeight: 60, padding: "8px 10px", borderRadius: 100, border: "1px solid " + C.border, fontFamily: "inherit", fontSize: 12, resize: "vertical" }
    }
  )), /* @__PURE__ */ React.createElement("table", { id: "formulier-tabel-" + formKey, style: { width: "100%", borderCollapse: "collapse", fontSize: 11 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: C.night, color: C.white } }, ["Gerecht", "Rauw", "Opzet aantal", "Presentatievorm", "Sligro verpakkingen"].map(function(h) {
    return /* @__PURE__ */ React.createElement("th", { key: h, style: { ...SS.th, color: "white", background: "transparent", textAlign: h === "Gerecht" ? "left" : "center", whiteSpace: "nowrap" } }, h);
  }))), /* @__PURE__ */ React.createElement("tbody", null, alleGerechten.map(function(g) {
    var portiesRauw = berekenPorties(g);
    var formOvr = overschrijven[formKey] || {};
    var overschrijfVal = formOvr[g.id];
    var portiesEff = overschrijfVal !== void 0 && overschrijfVal !== null && overschrijfVal > 0 ? overschrijfVal : portiesRauw * opzetFactor;
    var heeftData = portiesRauw > 0;
    var savedVal = (opgeslagenOverrides[formKey] || {})[g.id];
    var effData = heeftData || overschrijfVal > 0 || savedVal > 0;
    var actieveOverride = overschrijfVal || savedVal;
    var pres = effData ? getPresentatie(g, portiesEff) : null;
    var sligro = effData ? getSligroVerpakkingen(g, portiesEff) : [];
    var bg = effData ? C.white : "#F5F5F5";
    var kleur = effData ? C.night : "#BDBDBD";
    var layoutItem = buffetLayout ? (buffetLayout.items || []).find(function(li) {
      return li.code === (g.code || g.id);
    }) : null;
    var afgerondeEff = g.altijd_afronden ? Math.ceil(portiesEff) : Math.round(portiesEff * 10) / 10;
    var toonAlleenBuffet = !!g.toon_in_opzet_alleen_buffet;
    return /* @__PURE__ */ React.createElement("tr", { key: g.id, style: { background: bg, borderBottom: "1px solid #EEE" } }, /* @__PURE__ */ React.createElement("td", { style: { padding: "5px 8px", fontWeight: effData ? 700 : 400, color: kleur } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", null, g.naam), g.is_gn && /* @__PURE__ */ React.createElement("span", { style: { ...window._tg(C.aqua), fontSize: 9 } }, "GN"), g.prio && /* @__PURE__ */ React.createElement("span", { style: { ...window._tg(C.hot), fontSize: 9 } }, "PRIO"), bewerkModus && /* @__PURE__ */ React.createElement(
      "button",
      {
        style: { ...window._btnSG, fontSize: 9, color: C.muted, padding: "1px 5px" },
        title: "Verberg rij in dit formulier",
        onClick: function() {
          setOverschrijven(function(prev) {
            var n = Object.assign({}, prev);
            var fk = Object.assign({}, n[formKey] || {});
            fk["_hide_" + g.id] = true;
            n[formKey] = fk;
            return n;
          });
        }
      },
      "\u2715"
    ))), /* @__PURE__ */ React.createElement("td", { style: { padding: "5px 8px", textAlign: "center", color: kleur } }, heeftData ? portiesRauw.toFixed(1) : actieveOverride > 0 ? (
      // Toon terugberekende rauw waarde na opslaan
      /* @__PURE__ */ React.createElement("span", { style: { color: C.muted, fontSize: 10 } }, Math.round(actieveOverride / opzetFactor))
    ) : bewerkModus ? /* @__PURE__ */ React.createElement(
      window._InputRauw,
      {
        key: "r_" + g.id + "_" + formKey,
        gId: g.id,
        formKey_: formKey,
        opzetFactor_: opzetFactor,
        actieveOverride_: actieveOverride,
        onCommit: function(v) {
          setOverschrijven(function(prev) {
            var n = Object.assign({}, prev);
            var fk = Object.assign({}, n[formKey] || {});
            if (v > 0) {
              fk[g.id] = v * opzetFactor;
            } else {
              delete fk[g.id];
            }
            n[formKey] = fk;
            return n;
          });
          setGnLayoutKey(function(k) {
            return k + 1;
          });
        }
      }
    ) : "—"), /* @__PURE__ */ React.createElement("td", { style: { padding: "5px 8px", textAlign: "center" } }, effData ? toonAlleenBuffet && pres ? /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: C.night } }, nBuf, "\xD7 ", pres.naam || "") : bewerkModus ? /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        step: "0.5",
        min: "0",
        value: afgerondeEff,
        onChange: function(e) {
          var v = parseFloat(e.target.value) || 0;
          setOverschrijven(function(prev) {
            var n = Object.assign({}, prev);
            var fk = Object.assign({}, n[formKey] || {});
            fk[g.id] = v;
            n[formKey] = fk;
            return n;
          });
        },
        style: { width: 60, padding: "2px 4px", border: "1px solid " + C.border, borderRadius: 8, fontWeight: 700, color: C.aqua, textAlign: "center", fontSize: 12 }
      }
    ) : /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: C.aqua } }, afgerondeEff) : bewerkModus ? /* @__PURE__ */ React.createElement("span", { style: { color: C.muted, fontSize: 10 } }, "zie Rauw") : "—"), /* @__PURE__ */ React.createElement("td", { style: { padding: "5px 8px", color: kleur } }, pres ? pres.type === "gn" ? layoutItem ? /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", null, layoutItem.formaat), layoutItem.upgraded ? " \u2191" : "") : /* @__PURE__ */ React.createElement("span", null, pres.naam) : pres.type === "schaal" ? /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", null, pres.schalenPerBuf), "\xD7 ", pres.naam, pres.portiesPerSchaal ? " (" + pres.portiesPerSchaal + "p)" : "") : /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", null, pres.vormenPerBuf), "\xD7 ", pres.naam, " (", pres.portiesPerVorm, "p)") : "—", bewerkModus && effData && /* @__PURE__ */ React.createElement(
      "select",
      {
        style: { ...SS.inp, fontSize: 9, padding: "1px 4px", marginTop: 3, width: "100%" },
        onChange: function(e) {
          setOverschrijven(function(prev) {
            var n = Object.assign({}, prev);
            var fk = Object.assign({}, n[formKey] || {});
            fk["pres_" + g.id] = e.target.value;
            n[formKey] = fk;
            return n;
          });
        }
      },
      /* @__PURE__ */ React.createElement("option", { value: "" }, "-- Wijzig presentatievorm --"),
      (g.gerecht_gn_formaten || []).map(function(gf) {
        var gnNm = (gf.standaard_gn_formaten || {}).naam || "GN";
        return /* @__PURE__ */ React.createElement("option", { key: gf.id, value: "gn:" + gf.id }, gnNm, " (", gf.porties_per_bak, "p)");
      }),
      (g.gerecht_schaal_formaten || []).map(function(sf) {
        var sfNm = (sf.standaard_schaal_formaten || {}).naam || "Schaal";
        return /* @__PURE__ */ React.createElement("option", { key: sf.id, value: "schaal:" + sf.id }, sfNm, " (", sf.porties_per_schaal, "p)");
      })
    )), /* @__PURE__ */ React.createElement("td", { style: { padding: "5px 8px", fontSize: 10 } }, sligro.length > 0 ? sligro.map(function(s, si) {
      return /* @__PURE__ */ React.createElement("div", { key: si }, /* @__PURE__ */ React.createElement("strong", { style: { color: C.night } }, s.afgerond), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.muted } }, " ", s.naam), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: C.muted } }, " (", s.exacte.toFixed(1), ")"));
    }) : /* @__PURE__ */ React.createElement("span", { style: { color: "#BDBDBD" } }, "—")));
  }))), isPsBBQ && buffetLayout && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10, padding: "8px 12px", background: C.light, borderRadius: 14, border: "1px solid " + C.border, fontSize: 11 } }, /* @__PURE__ */ React.createElement("strong", null, "Chafingdish layout per buffet:"), "\xA0GN 1/3: ", buffetLayout.counts[0], " \u2022 GN 1/2: ", buffetLayout.counts[1], " \u2022 GN 1/1: ", buffetLayout.counts[2], "\xA0\u2022\xA0", /* @__PURE__ */ React.createElement("strong", { style: { color: C.hot } }, "Dishes per buffet: ", buffetLayout.dishesPerBuf), "\xA0\u2022\xA0Totaal (", nBuf, " bufs): ", buffetLayout.totalDishes)), // ─── Dieetwensen panel — één tab per wens ──────────────────────────
  (dwFout || dwResultaat) && /* @__PURE__ */ React.createElement("div", {
    style: { position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(35,71,86,0.55)",
             zIndex:900, display:"flex", alignItems:"center", justifyContent:"center", padding:16 },
    onClick: function(e) { if (e.target === e.currentTarget) { setDwResultaat(null); setDwFout(""); } }
  },
  React.createElement("div", {
    style: { background:"#fff", borderRadius:14, width:"min(820px,97vw)", maxHeight:"92vh",
             display:"flex", flexDirection:"column", boxShadow:"0 12px 48px rgba(35,71,86,.35)",
             overflow:"hidden" }
  },
    // Header
    React.createElement("div", { style: { background:"#234756", padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 } },
      React.createElement("div", null,
        React.createElement("div", { style: { color:"#fff", fontWeight:700, fontSize:15 } }, "\uD83D\uDD0D Dieetwensen analyse"),
        React.createElement("div", { style: { color:"#3FB8C4", fontSize:11, marginTop:2 } }, "Elke wens apart gecheckt tegen Sligro allergenen")
      ),
      React.createElement("div", { style: { display:"flex", gap:12, alignItems:"center" } },
        dwResultaat && React.createElement("div", { style: { fontSize:11, color:"#3FB8C4", background:"rgba(63,184,196,0.15)", padding:"4px 10px", borderRadius:100, fontWeight:700 } },
          (dwResultaat.klaarRegels||0) + "/" + (dwResultaat.laadRegels||0) + " regels · " + (dwResultaat.tabs||[]).length + " wensen"
        ),
        React.createElement("button", { onClick: function(){ setDwResultaat(null); setDwFout(""); }, style: { background:"transparent", border:"none", color:"#aaa", fontSize:24, cursor:"pointer", lineHeight:1, padding:"0 4px" } }, "\u00D7")
      )
    ),

    // Foutmelding
    dwFout && React.createElement("div", { style: { background:"#FFEBEE", color:"#C62828", padding:"10px 16px", fontSize:12 } }, "\u26A0 ", dwFout),

    // Tabs — één per wens
    dwResultaat && (dwResultaat.tabs || []).length > 0 && React.createElement("div", { style: { display:"flex", overflowX:"auto", borderBottom:"2px solid #E0E8EF", flexShrink:0, background:"#FFFFFF", padding:"6px 10px" } },
      (dwResultaat.tabs || []).map(function(tab, idx) {
        var isActief = dwResultaat.actief === idx;
        var kleur = tab.status === "fout" ? "#C62828" :
                    tab.status === "wacht_op_wensen" ? "#FF9800" :
                    tab.status === "geen_wensen" || tab.status === "geen_dieetwens" ? "#78909C" :
                    tab.wens_type === "allergie" ? "#C62828" :
                    tab.wens_type === "dieet" ? "#1565C0" :
                    tab.wens_type === "zwanger" ? "#880E4F" :
                    "#3FB8C4";
        var ico = tab.status === "fout" ? "\u26A0" :
                  tab.status === "wacht_op_wensen" ? "\u23F3" :
                  tab.status === "geen_wensen" ? "\u2705" :
                  tab.wens_type === "allergie" ? "\uD83D\uDEAB" :
                  tab.wens_type === "dieet" ? "\uD83C\uDF31" :
                  tab.wens_type === "zwanger" ? "\uD83E\uDD30" :
                  "\uD83D\uDD0D";
        return React.createElement("button", {
          key: idx,
          onClick: function() { setDwResultaat(function(p){ return p ? Object.assign({},p,{actief:idx}) : p; }); },
          style: { padding:"6px 12px", margin:"2px", border:"1.5px solid " + (isActief ? kleur : "transparent"),
                   background: isActief ? "#fff" : "rgba(0,0,0,0.02)",
                   borderRadius:100, cursor:"pointer", fontSize:11, fontWeight: isActief ? 700 : 500,
                   color: isActief ? kleur : "#546E7A", whiteSpace:"nowrap", flexShrink:0,
                   display:"flex", alignItems:"center", gap:5 }
        },
          ico,
          React.createElement("span", { style:{ fontSize:10, opacity:0.7 } }, tab.menu_naam.length > 20 ? tab.menu_naam.substring(0,17)+"…" : tab.menu_naam),
          React.createElement("span", null, "·"),
          React.createElement("span", null, tab.wens_tekst)
        );
      })
    ),

    // Laad indicator als nog bezig
    dwResultaat && (dwResultaat.tabs||[]).length === 0 && dwResultaat.klaarRegels < dwResultaat.laadRegels && React.createElement("div", { style:{ padding:"40px", textAlign:"center", color:"#78909C" } },
      React.createElement("div", { style:{ fontSize:32, marginBottom:12 } }, "\u23F3"),
      React.createElement("div", null, "Claude analyseert de opmerkingen..."),
      React.createElement("div", { style:{ fontSize:10, marginTop:6 } }, dwResultaat.klaarRegels + "/" + dwResultaat.laadRegels + " regels verwerkt")
    ),

    // Tab inhoud
    dwResultaat && (dwResultaat.tabs || []).length > 0 && (function() {
      var tab = (dwResultaat.tabs||[])[dwResultaat.actief] || (dwResultaat.tabs||[])[0];
      if (!tab) return null;

      var SK = { geschikt:"#2E7D32", niet_geschikt:"#C62828", controleer:"#E65100", onbekend:"#78909C" };
      var SE = { geschikt:"\u2713", niet_geschikt:"\u2717", controleer:"\u26A0", onbekend:"?" };
      var SBG = { geschikt:"#F1F8E9", niet_geschikt:"#FFEBEE", controleer:"#FFF8E1", onbekend:"#F5F5F5" };

      return React.createElement("div", { style: { overflowY:"auto", padding:18, fontSize:12, flex:1 } },

        // Fout tab
        tab.status === "fout" && React.createElement("div", { style: { background:"#FFEBEE", color:"#C62828", padding:"14px 18px", borderRadius:10 } },
          React.createElement("div", { style: { fontWeight:700, marginBottom:6 } }, "\u26A0 Analyse mislukt"),
          React.createElement("div", { style: { fontSize:11 } }, tab.fout),
          React.createElement("div", { style: { fontSize:10, color:"#78909C", marginTop:10, fontStyle:"italic" } }, "Opmerking: \"" + (tab.origineel||"") + "\"")
        ),

        // Wacht op wensen
        tab.status === "wacht_op_wensen" && React.createElement("div", { style: { padding:"20px", background:"#FFF8E1", borderRadius:10, borderLeft:"4px solid #FF9800" } },
          React.createElement("div", { style: { fontWeight:700, color:"#E65100", fontSize:15, marginBottom:6 } }, "\u23F3 Dieetwensen volgen nog"),
          React.createElement("div", { style: { fontSize:12, color:"#78909C", marginBottom:8 } }, "Voor ", React.createElement("b",null,tab.menu_naam), " zijn de dieetwensen nog niet doorgegeven. Controleer v\xF3\xF3r service!"),
          React.createElement("div", { style: { fontSize:11, color:"#b0bec5", fontStyle:"italic" } }, "\"" + (tab.origineel||"") + "\"")
        ),

        // Geen wensen
        (tab.status === "geen_wensen" || tab.status === "geen_dieetwens") && React.createElement("div", { style: { padding:"20px", background:"#E8F5E9", borderRadius:10, textAlign:"center" } },
          React.createElement("div", { style: { fontSize:28, marginBottom:6 } }, "\u2705"),
          React.createElement("div", { style: { fontWeight:700, color:"#2E7D32", fontSize:15 } }, tab.wens_tekst),
          React.createElement("div", { style: { fontSize:12, color:"#78909C", marginTop:4 } }, "Bij ", React.createElement("b",null,tab.menu_naam)),
          tab.origineel && React.createElement("div", { style: { fontSize:10, color:"#b0bec5", marginTop:10, fontStyle:"italic" } }, "\"" + tab.origineel + "\"")
        ),

        // Klaar met wens analyse
        tab.status === "klaar" && React.createElement("div", null,
          // Wens info header
          React.createElement("div", { style: { padding:"14px 16px", background: tab.wens_type==="allergie"?"#FFEBEE":tab.wens_type==="dieet"?"#E3F2FD":tab.wens_type==="zwanger"?"#FCE4EC":"#F3E5F5", borderRadius:10, marginBottom:14 } },
            React.createElement("div", { style:{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 } },
              React.createElement("div", null,
                React.createElement("div", { style: { fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, color:"#78909C", marginBottom:4 } }, tab.menu_naam),
                React.createElement("div", { style: { fontSize:18, fontWeight:800, color: tab.wens_type==="allergie"?"#C62828":tab.wens_type==="dieet"?"#1565C0":tab.wens_type==="zwanger"?"#880E4F":"#6A1B9A" } }, tab.wens_tekst),
                tab.wens_naam && React.createElement("div", { style: { fontSize:11, color:"#546E7A", marginTop:2 } }, "Voor: ", React.createElement("b",null,tab.wens_naam))
              ),
              React.createElement("div", { style: { textAlign:"right" } },
                React.createElement("div", { style: { fontSize:24, fontWeight:900, color:"#234756", lineHeight:1 } }, tab.wens_aantal + "x"),
                React.createElement("div", { style: { fontSize:9, color:"#78909C", letterSpacing:1, marginTop:2 } }, "PERSONEN")
              )
            ),
            tab.wens && tab.wens.manual_note && React.createElement("div", { style: { fontSize:11, color:"#546E7A", marginTop:8, padding:"6px 10px", background:"rgba(255,255,255,0.6)", borderRadius:6 } }, "\u2139 ", tab.wens.manual_note)
          ),

          // Overzicht: hoeveel wel/niet/controleer
          (function() {
            var counts = { geschikt:0, niet_geschikt:0, controleer:0, onbekend:0 };
            (tab.analyse || []).forEach(function(a) { counts[a.status] = (counts[a.status]||0) + 1; });
            return React.createElement("div", { style:{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" } },
              counts.geschikt > 0 && React.createElement("div", { style:{ flex:1, minWidth:80, background:"#F1F8E9", padding:"8px 12px", borderRadius:8, textAlign:"center" } },
                React.createElement("div", {style:{fontSize:22, fontWeight:900, color:"#2E7D32"}}, counts.geschikt),
                React.createElement("div", {style:{fontSize:10, color:"#546E7A", fontWeight:600}}, "\u2713 Geschikt")
              ),
              counts.niet_geschikt > 0 && React.createElement("div", { style:{ flex:1, minWidth:80, background:"#FFEBEE", padding:"8px 12px", borderRadius:8, textAlign:"center" } },
                React.createElement("div", {style:{fontSize:22, fontWeight:900, color:"#C62828"}}, counts.niet_geschikt),
                React.createElement("div", {style:{fontSize:10, color:"#546E7A", fontWeight:600}}, "\u2717 Niet geschikt")
              ),
              counts.controleer > 0 && React.createElement("div", { style:{ flex:1, minWidth:80, background:"#FFF8E1", padding:"8px 12px", borderRadius:8, textAlign:"center" } },
                React.createElement("div", {style:{fontSize:22, fontWeight:900, color:"#E65100"}}, counts.controleer),
                React.createElement("div", {style:{fontSize:10, color:"#546E7A", fontWeight:600}}, "\u26A0 Controleer")
              ),
              counts.onbekend > 0 && React.createElement("div", { style:{ flex:1, minWidth:80, background:"#F5F5F5", padding:"8px 12px", borderRadius:8, textAlign:"center" } },
                React.createElement("div", {style:{fontSize:22, fontWeight:900, color:"#78909C"}}, counts.onbekend),
                React.createElement("div", {style:{fontSize:10, color:"#546E7A", fontWeight:600}}, "? Onbekend")
              )
            );
          })(),

          // Gerecht lijst gesorteerd: niet_geschikt eerst, dan controleer, dan onbekend, dan geschikt
          (function() {
            var volgorde = { niet_geschikt:0, controleer:1, onbekend:2, geschikt:3 };
            var gesorteerd = (tab.analyse || []).slice().sort(function(a,b) { return (volgorde[a.status]||4) - (volgorde[b.status]||4); });
            return gesorteerd.map(function(ga, gi) {
              return React.createElement("div", { key:gi, style:{ marginBottom:5, padding:"8px 12px", background:SBG[ga.status], borderRadius:8, borderLeft:"3px solid " + SK[ga.status], display:"flex", alignItems:"center", gap:10 } },
                React.createElement("div", { style:{ fontWeight:700, color:SK[ga.status], fontSize:14, minWidth:20 } }, SE[ga.status]),
                React.createElement("div", { style:{ flex:1 } },
                  React.createElement("div", {style:{ fontWeight:600, fontSize:12, color:"#234756" }}, ga.gerecht_naam),
                  React.createElement("div", {style:{ fontSize:10, color:SK[ga.status], marginTop:2 }}, ga.reden)
                )
              );
            });
          })()
        )
      );
    })()
  )
  ),
  boekingenAllergenen && /* @__PURE__ */ React.createElement(
    window._AllergenenKaart,
    {
      boeking: boekingenAllergenen,
      onClose: function() {
        setBoekingenAllergenen(null);
      }
    }
  )
);
}

  window._BuffetScreen = BuffetScreen;
})();
