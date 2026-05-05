// KitchenRobot module: home-screen.js
// Geextraheerd uit index.html op 2026-05-05T08:43:18.535Z
// Bevat: HomeScreen
// Externe refs (via window._): aantalBuf, alertS, berekenBuffetLayout, berekenSligroBestelling, btnA, btnP, btnSG, genereerCSV, genereerOpzetEmailHTML, opzetPct, totPers
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function HomeScreen({ setSc }) {
  var vandaag = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  var [imp, setImp] = useState(function() {
    try {
      var opgeslagen = localStorage.getItem("kr_import_datum");
      if (opgeslagen === vandaag) return true;
      localStorage.removeItem("kr_import_datum");
      return false;
    } catch (e) {
      return false;
    }
  });
  var [showCSV, setShowCSV] = useState(false);
  var [bestellingKey, setBestellingKey] = useState(0);
  var [geladen, setGeladen] = useState(window._recrasBoekingen || []);
  var [showDetail, setShowDetail] = useState(null);
  var [sortBestVeld, setSortBestVeld] = useState("naam");
  var [sortBestDir, setSortBestDir] = useState("asc");
  var [importKeuken, setImportKeuken] = useState(function() {
    try {
      return localStorage.getItem("kr_import_keuken") || "";
    } catch (e) {
      return "";
    }
  });
  function toggleSortBest(veld) {
    if (sortBestVeld === veld) setSortBestDir(sortBestDir === "asc" ? "desc" : "asc");
    else {
      setSortBestVeld(veld);
      setSortBestDir("asc");
    }
  }
  function sortBestIcon(veld) {
    return sortBestVeld === veld ? sortBestDir === "asc" ? " \u2191" : " \u2193" : " \u2195";
  }
  var [sortBoekVeld, setSortBoekVeld] = useState("datum");
  var [sortBoekDir, setSortBoekDir] = useState("asc");
  function sortBoekIcon(veld) {
    return sortBoekVeld === veld ? sortBoekDir === "asc" ? " \u2191" : " \u2193" : " \u2195";
  }
  var boekingen = window._filterBoekingen(window._recrasBoekingen || []).slice().sort(function(a, b) {
    var va = "", vb = "";
    if (sortBoekVeld === "id") {
      va = a.id || "";
      vb = b.id || "";
    } else if (sortBoekVeld === "datum") {
      va = a.deadline || "";
      vb = b.deadline || "";
    } else if (sortBoekVeld === "tijd") {
      va = a.deadlineTijd || "";
      vb = b.deadlineTijd || "";
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
  var [emailStatus, setEmailStatus] = useState(null);
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
  function markeerGezien(boekingId) {
    if (!window._supa) return;
    window._supa.from('recras_wijzigingen').update({ gezien_op: new Date().toISOString() }).eq('boeking_id', boekingId).is('gezien_op', null).then(function() {
      setWijzigingenMap(function(prev) { var n = Object.assign({}, prev); delete n[boekingId]; return n; });
    });
  }
  var [bbqConflicten, setBbqConflicten] = useState(null);
  const [ovenTips, setOvenTips] = useState([]);
  const [frituurTips, setFrituurTips] = useState([]);
  var [takenConflicten, setTakenConflicten] = useState(null);
    var [dagpakketStatus, setDagpakketStatus] = useState(null);
  var [dagpakketPubliceren, setDagpakketPubliceren] = useState(false);
  var [dagpakketStatusInfo, setDagpakketStatusInfo] = useState({});
  function laadDagpakketStatus() {
    if (!window._supa) return;
    var vandaag2 = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    window._supa.from("kiosk_dagpakketten").select("outlet_code, status, activiteiten_count, eerste_activiteit_op").eq("datum", vandaag2).then(function(r) {
      if (!r.data) return;
      var info = {};
      r.data.forEach(function(p) {
        info[p.outlet_code] = p;
      });
      setDagpakketStatusInfo(info);
      var statussen = r.data.map(function(p) {
        return p.status;
      });
      if (statussen.includes("actief")) setDagpakketStatus("actief");
      else if (statussen.includes("gepubliceerd")) setDagpakketStatus("gepubliceerd");
      else if (statussen.includes("afgesloten")) setDagpakketStatus("afgesloten");
    });
  }
  function publiceerDagpakket(doelStatus) {
    var vandaag2 = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    var alleBoekingen = window._recrasBoekingen || [];
    var stamMenus = window._stamMenus || [];
    var stamGerechten = window._stamGerechten || [];
    var stamKoppelingen = window._stamKoppelingen || [];
    var westLocaties = ["Loods 2", "Loods 4", "Loods 5", "Loods 6", "Terras Loods 6", "Pup - Bar", "Ronde Tent", "Stretchtent", "Terrace", "Beachclub", "Beachclub 2", "Loods 7", "Loods 7 Patio", "Combinatie | Loods 1, 2, 3 & Terrace", "Beach CLUP", "Beach Clup", "Beachclub1", "Beach Clup 2", "Beachclub2"];
    var gekozenKeuken = window._importKeuken || importKeuken || null;
    if (!gekozenKeuken) {
      alert("\u26A0 Kies eerst een keuken bij de import (West of Weesp) voordat je publiceert.");
      return;
    }
    var actiefGekozen = dagpakketStatusInfo[gekozenKeuken] && dagpakketStatusInfo[gekozenKeuken].status === "actief";
    if (doelStatus === "gepubliceerd" && actiefGekozen) {
      var keukenNaam = gekozenKeuken === "west" ? "Amsterdam West" : "Weesp";
      if (!window.confirm("\u26A0 De keuken " + keukenNaam + " werkt momenteel met dit dagpakket.\n\nAls je opnieuw publiceert worden de opzetlijsten bijgewerkt maar de voortgang blijft bewaard.\n\nWil je doorgaan?")) return;
    }
    setDagpakketPubliceren(true);
    var outletBoekingen = alleBoekingen;
    var opzetLijst = [];
    var kleuren4opzet = ["#3FB8C4", "#2979b0", "#5e35b1", "#00838f", "#2e7d32"];
    var psMap = {};
    (window._stamProductgroepen || []).forEach(function(pg) {
      (pg.soorten || []).forEach(function(ps) {
        var psNaam = pg.naam + " \u203A " + ps.naam;
        var psBoekingen = outletBoekingen.filter(function(b) {
          return (b.regels || []).some(function(r) {
            if ((r.menuNaam || "").toLowerCase().includes("add up")) return false;
            var kp = stamKoppelingen.find(function(k) {
              return (k.recras_naam || "").trim() === (r.menuNaam || "").trim();
            });
            var m = kp ? stamMenus.find(function(mm) {
              return mm.id === kp.menu_id;
            }) : null;
            return m && (m.productsoort_id || m.psId) === ps.id;
          });
        });
        if (psBoekingen.length === 0) return;
        var gerechtenInMenus = /* @__PURE__ */ new Set();
        var gerechtenData = {};
        stamMenus.forEach(function(m) {
          if ((m.productsoort_id || m.psId) !== ps.id) return;
          (m.menu_gerechten || []).forEach(function(mg) {
            gerechtenInMenus.add(mg.gerecht_id);
          });
        });
        var gerechtenLijst = stamGerechten.filter(function(g) {
          return gerechtenInMenus.has(g.id);
        }).sort(function(a, b) {
          if (a.is_gn && !b.is_gn) return -1;
          if (!a.is_gn && b.is_gn) return 1;
          return (a.volgorde || 0) - (b.volgorde || 0);
        }).map(function(g) {
          var gnFormaten = (g.gerecht_gn_formaten || []).map(function(gf) {
            var stdGn = gf.standaard_gn_formaten || {};
            return { naam: stdGn.naam || gf.formaat || "", porties_per_bak: gf.porties_per_bak || 0, is_max_vorm: gf.is_max_vorm || false };
          }).filter(function(gf) {
            return gf.porties_per_bak > 0;
          });
          return { id: g.id, naam: g.naam, is_gn: !!g.is_gn, prio: !!g.prio, volgorde: g.volgorde || 0, gnFormaten, toon_buffet: !!g.toon_in_opzet_alleen_buffet };
        });
        var boekKolommen = psBoekingen.map(function(b, bi) {
          var pers = window._totPers(b);
          var pct = window._opzetPct(pers);
          var nBuf = window._aantalBuf(pers);
          var menusPs = (b.regels || []).filter(function(r) {
            if ((r.menuNaam || "").toLowerCase().includes("add up")) return false;
            var kp = stamKoppelingen.find(function(k) {
              return (k.recras_naam || "").trim() === (r.menuNaam || "").trim();
            });
            var m = kp ? stamMenus.find(function(mm) {
              return mm.id === kp.menu_id;
            }) : null;
            return m && (m.productsoort_id || m.psId) === ps.id;
          }).map(function(r) {
            var kp = stamKoppelingen.find(function(k) {
              return (k.recras_naam || "").trim() === (r.menuNaam || "").trim();
            });
            var m = kp ? stamMenus.find(function(mm) {
              return mm.id === kp.menu_id;
            }) : null;
            return { naam: m ? m.naam : r.menuNaam, personen: r.aantal };
          });
          var waarden = {};
          gerechtenLijst.forEach(function(g) {
            var ben = 0;
            (b.regels || []).forEach(function(r) {
              if ((r.menuNaam || "").toLowerCase().includes("add up")) return;
              var kp = stamKoppelingen.find(function(k) {
                return (k.recras_naam || "").trim() === (r.menuNaam || "").trim();
              });
              var m = kp ? stamMenus.find(function(mm) {
                return mm.id === kp.menu_id;
              }) : null;
              if (!m || (m.productsoort_id || m.psId) !== ps.id) return;
              var mg = (m.menu_gerechten || []).find(function(mg2) {
                return mg2.gerecht_id === g.id;
              });
              if (mg) ben += r.aantal * (mg.porties_per_persoon || 1) * pct;
            });
            if (ben > 0) {
              var gnFormaat = null;
              if (g.is_gn && g.gnFormaten.length > 0) {
                var fmts = g.gnFormaten.filter(function(gf) {
                  return gf.porties_per_bak > 0;
                }).slice().sort(function(a, b2) {
                  return a.porties_per_bak - b2.porties_per_bak;
                });
                var fm = fmts.find(function(f) {
                  return f.porties_per_bak >= ben;
                }) || fmts[fmts.length - 1];
                if (fm) gnFormaat = { naam: fm.naam, aantalBakken: Math.ceil(ben / fm.porties_per_bak) };
              }
              waarden[g.id] = { portiesEff: Math.round(ben * 10) / 10, gnFormaat };
            }
          });
          return {
            id: b.id,
            naam: b.naam,
            datum: b.deadline ? b.deadline.replace("T", " ").split(" ")[0] : "",
            deadlineTijd: b.deadlineTijd || "—",
            locatie: b.locatie || "",
            totaalPers: pers,
            opzetPct: Math.round(pct * 100),
            nBuf,
            menus: menusPs,
            kleur: kleuren4opzet[bi % kleuren4opzet.length],
            waarden
          };
        });
        opzetLijst.push({
          psId: ps.id,
          psNaam,
          gerechten: gerechtenLijst,
          boekingen: boekKolommen
        });
      });
    });
    var buffetLijst = outletBoekingen.filter(function(b) {
      return (b.regels || []).some(function(r) {
        return (r.menuNaam || "").toLowerCase().includes("bbq");
      });
    }).map(function(b) {
      var bbqGerechten = [];
      var totaalPers = 0;
      var nBuf = 1;
      var geboekteMenus = [];
      var bbqDeadlineTijd = null;
      (b.regels || []).filter(function(r) {
        return (r.menuNaam || "").toLowerCase().includes("bbq");
      }).forEach(function(r) {
        totaalPers += r.aantal || 0;
        var kp = stamKoppelingen.find(function(k) {
          return (k.recras_naam || "").trim() === (r.menuNaam || "").trim();
        });
        var m = kp ? stamMenus.find(function(mm) {
          return mm.id === kp.menu_id;
        }) : null;
        if (!m) return;
        geboekteMenus.push(r.aantal + "\xD7 " + (m.naam || r.menuNaam));
        nBuf = window._aantalBuf(r.aantal);
        if (!bbqDeadlineTijd && r.starttijdTijd) bbqDeadlineTijd = r.starttijdTijd;
        (m.menu_gerechten || []).forEach(function(mg) {
          var g = stamGerechten.find(function(x) {
            return x.id === mg.gerecht_id;
          });
          if (!g) return;
          var gnFormaten = (g.gerecht_gn_formaten || []).map(function(gf) {
            var stdGn = gf.standaard_gn_formaten || {};
            return { naam: stdGn.naam || gf.formaat || "", porties_per_bak: gf.porties_per_bak || 0, is_max_vorm: gf.is_max_vorm || false };
          }).filter(function(gf) {
            return gf.porties_per_bak > 0;
          });
          var portiesEff = Math.ceil(r.aantal * (mg.porties_per_persoon || 1) * window._opzetPct(r.aantal));
          var gnMaxVorm = gnFormaten.find(function(gf) {
            return gf.is_max_vorm;
          }) || gnFormaten[0];
          var aantalBakken = gnMaxVorm && gnMaxVorm.porties_per_bak > 0 ? Math.ceil(portiesEff / gnMaxVorm.porties_per_bak) : null;
          // Bereken presentatievorm voor niet-GN gerechten
          var presStr;
          if (gnMaxVorm && aantalBakken) {
            presStr = aantalBakken + "\xD7 " + gnMaxVorm.naam;
          } else if (portiesEff > 0) {
            // Schaalvorm berekening (zelfde als BuffetScreen)
            var _sfArr = (g.gerecht_schaal_formaten || []).filter(function(_sf) { return _sf.porties_per_schaal != null; }).sort(function(_a,_b){ return (_a.volgorde||0)-(_b.volgorde||0); });
            var _pPerBuf = nBuf > 0 ? portiesEff / nBuf : portiesEff;
            var _gekozenSf = null;
            for (var _si=0; _si<_sfArr.length; _si++) { var _sf2=_sfArr[_si]; if (!_sf2.is_max_vorm && _sf2.porties_per_schaal > 1 && _pPerBuf <= _sf2.porties_per_schaal) { _gekozenSf=_sf2; break; } }
            if (!_gekozenSf) _gekozenSf = _sfArr[_sfArr.length-1];
            if (_gekozenSf) {
              var _sfNaam = (_gekozenSf.standaard_schaal_formaten||{}).naam || "schaal";
              if (_gekozenSf.is_max_vorm || _gekozenSf.porties_per_schaal <= 1) {
                presStr = "1\xD7 " + _sfNaam;
              } else {
                var _totaalS = Math.ceil(portiesEff / _gekozenSf.porties_per_schaal);
                var _sPerBuf = nBuf > 0 ? Math.ceil(_totaalS / nBuf) : _totaalS;
                presStr = _sPerBuf + "\xD7 " + _sfNaam + " (" + _gekozenSf.porties_per_schaal + "p)";
              }
            } else {
              presStr = portiesEff + "\xD7";
            }
          } else {
            presStr = "—";
          }
          bbqGerechten.push({ naam: g.naam, is_gn: !!g.is_gn, prio: !!g.prio, volgorde: g.volgorde || 999, portiesEff, personen: r.aantal, gnFormaten, gnNaam: gnMaxVorm ? gnMaxVorm.naam : null, aantalBakken, presStr, _sfRaw: g.gerecht_schaal_formaten || [] });
        });
      });
      // Aggregeer gerechten per naam (samenvoegen van meerdere menus)
      var aggMap = {};
      bbqGerechten.forEach(function(g) {
        var key = g.naam;
        if (!aggMap[key]) {
          aggMap[key] = Object.assign({}, g, { portiesEff: 0, aantalBakken: 0 });
        }
        aggMap[key].portiesEff += g.portiesEff || 0;
        aggMap[key].aantalBakken = (aggMap[key].aantalBakken || 0) + (g.aantalBakken || 0);
      });
      var aggGerechten = Object.values(aggMap);

      // Herbereken presStr na aggregatie — gebruik berekenBuffetLayout voor GN
      // Bouw layout voor alle GN gerechten samen
      var _gnVoorLayout = aggGerechten.filter(function(g) {
        return g.is_gn && g.portiesEff > 0 && (g.gnFormaten || []).length > 0;
      }).map(function(g) {
        return { code: g.naam, naam: g.naam, ben: g.portiesEff, prio: !!g.prio, volgorde: g.volgorde || 999,
          gnFormaten: (g.gnFormaten || []).map(function(gf) {
            return { f: gf.naam, p: gf.porties_per_bak || 1, isMax: !!gf.is_max_vorm };
          })
        };
      });
      var _bbqLayout = _gnVoorLayout.length > 0 ? window._berekenBuffetLayout(_gnVoorLayout, nBuf) : null;
      aggGerechten.forEach(function(g) {
        if (g.is_gn) {
          // GN: gebruik berekenBuffetLayout formaat (zelfde als website)
          var _li = _bbqLayout ? (_bbqLayout.items || []).find(function(x) { return x.code === g.naam; }) : null;
          g.presStr = _li ? _li.formaat + (_li.upgraded ? " \u2191" : "") : (g.gnNaam || "—");
        } else if (g.portiesEff > 0) {
          // Niet-GN: zoek passende schaalvorm, toon alleen naam (geen getal/haakjes)
          var _sfArr = (g._sfRaw || []).filter(function(_sf) { return _sf.porties_per_schaal != null; }).sort(function(_a,_b){ return (_a.volgorde||0)-(_b.volgorde||0); });
          var _pPerBuf = nBuf > 0 ? g.portiesEff / nBuf : g.portiesEff;
          var _gk = null;
          for (var _i=0; _i<_sfArr.length; _i++) { var _s=_sfArr[_i]; if (!_s.is_max_vorm && _s.porties_per_schaal > 1 && _pPerBuf <= _s.porties_per_schaal) { _gk=_s; break; } }
          if (!_gk) _gk = _sfArr[_sfArr.length-1];
          g.presStr = _gk ? ((_gk.standaard_schaal_formaten||{}).naam || "schaal") : g.portiesEff + "×";
        } else {
          g.presStr = "—";
        }
      });

      aggGerechten.sort(function(a, b) { return (a.volgorde || 999) - (b.volgorde || 999); });
      var gnGerechten = aggGerechten.filter(function(g) {
        return g.is_gn && g.portiesEff > 0;
      });
      var andereGerechten = aggGerechten.filter(function(g) {
        return !g.is_gn && g.portiesEff > 0;
      });
      function renderTabelHTML(lijst, titel) {
        if (!lijst.length) return "";
        var rows = lijst.map(function(g) {
          return "<tr><td>" + g.naam + (g.is_gn ? '<span style="background:#3FB8C4;color:#fff;border-radius:4px;padding:2px 6px;font-size:10px;margin-left:4px">GN</span>' : "") + (g.prio ? '<span style="background:#E8202B;color:#fff;border-radius:4px;padding:2px 6px;font-size:10px;margin-left:2px">PRIO</span>' : "") + '</td><td style="font-weight:900;font-size:16px">' + g.presStr + "</td></tr>";
        }).join("");
        return '<h3 style="margin:20px 0 8px;font-size:15px;font-weight:900;border-bottom:2px solid #234756;padding-bottom:4px">' + titel + '</h3><table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr><th style="background:#234756;color:#fff;padding:10px 14px;text-align:left;font-size:12px">Gerecht</th><th style="background:#234756;color:#fff;padding:10px 14px;text-align:left;font-size:12px;width:180px">Presentatievorm</th></tr></thead><tbody>' + rows + "</tbody></table>";
      }
      var bbqHtml = '<html><head><meta charset="UTF-8"><style>body{font-family:Roboto,Arial,sans-serif;margin:0;padding:20px;color:#000}h1{font-size:22px;font-weight:900;margin-bottom:4px}h2{font-size:13px;color:#666;font-weight:400;margin-bottom:8px}p{font-size:12px;color:#555;margin:0 0 16px}table{width:100%;border-collapse:collapse}td{padding:10px 14px;border-bottom:1px solid #ddd}tr:nth-child(even) td{background:#f5f8fa}</style></head><body><h1>' + b.naam + "</h1><h2>" + (b.deadlineDag || "") + " \u2022 " + (bbqDeadlineTijd || b.deadlineTijd || "—") + " \u2022 " + (b.locatie || "") + " \u2022 " + totaalPers + " personen \u2022 " + nBuf + " buffet" + (nBuf > 1 ? "ten" : "") + "</h2><p>" + geboekteMenus.join(", ") + "</p>" + renderTabelHTML(gnGerechten, "GN Bakken (Chafingdishes)") + renderTabelHTML(andereGerechten, "Overige gerechten") + (function() {
        // Chafingdish layout
        var gnVoorLayout = gnGerechten.map(function(g) {
          return { code: g.naam, naam: g.naam, ben: g.portiesEff, prio: !!g.prio, volgorde: g.volgorde || 999,
            gnFormaten: (g.gnFormaten || []).map(function(gf) {
              return { f: gf.naam, p: gf.porties_per_bak || 1, isMax: !!gf.is_max_vorm };
            })
          };
        });
        if (!gnVoorLayout.length) return "";
        try {
          var lay = window._berekenBuffetLayout(gnVoorLayout, nBuf);
          if (!lay) return "";
          return '<p style="margin-top:16px;padding:10px 14px;background:#f0f8ff;border-radius:6px;font-size:13px;border-left:4px solid #3FB8C4">'
            + '<strong>' + lay.dishesPerBuf + ' chafingdishes per buffet</strong> &bull; '
            + lay.counts[2] + '\u00D7 GN 1/1 &bull; '
            + lay.counts[1] + '\u00D7 GN 1/2 &bull; '
            + lay.counts[0] + '\u00D7 GN 1/3</p>';
        } catch(e) { return ""; }
      }()) + "</body></html>";
      // Bereken dishesPerBuf voor kiosk weergave
      var _gnVL2 = aggGerechten.filter(function(g) { return g.is_gn && g.portiesEff > 0 && (g.gnFormaten||[]).length > 0; })
        .map(function(g) { return { code: g.naam, naam: g.naam, ben: g.portiesEff, prio: !!g.prio, volgorde: g.volgorde||999, gnFormaten: (g.gnFormaten||[]).map(function(gf) { return { f: gf.naam, p: gf.porties_per_bak||1, isMax: !!gf.is_max_vorm }; }) }; });
      var _lay2 = _gnVL2.length > 0 ? window._berekenBuffetLayout(_gnVL2, nBuf) : null;
      var dishesPerBuf = _lay2 ? _lay2.dishesPerBuf : 0;
      return { id: b.id, naam: b.naam, locatie: b.locatie, tijdLabel: bbqDeadlineTijd || b.deadlineTijd, deadlineDag: b.deadlineDag, totaalPers, nBuf, dishesPerBuf, geboekteMenus, gerechten: bbqGerechten, bbqHtml };
    });
    var opzetHtmlPerPs = {};
    (function() {
      var psMap2 = {};
      opzetLijst.forEach(function(o) {
        var ps = o.psNaam || "Overig";
        if (!psMap2[ps]) psMap2[ps] = {};
        if (!psMap2[ps][o.boekingId]) psMap2[ps][o.boekingId] = { boeking: o, gerechten: {} };
        (o.gerechten || []).forEach(function(g) {
          psMap2[ps][o.boekingId].gerechten[g.naam] = g;
        });
      });
      Object.keys(psMap2).forEach(function(ps) {
        var boekMap = psMap2[ps];
        var bIds = Object.keys(boekMap);
        var alleGerechtenNamen = [];
        bIds.forEach(function(bid) {
          Object.keys(boekMap[bid].gerechten).forEach(function(gn) {
            if (alleGerechtenNamen.indexOf(gn) < 0) alleGerechtenNamen.push(gn);
          });
        });
        var kleuren = ["#3FB8C4", "#2979b0", "#5e35b1", "#00838f", "#2e7d32"];
        var headerCols = bIds.map(function(bid, i) {
          var o = boekMap[bid].boeking;
          var kl = kleuren[i % kleuren.length];
          return '<th style="background:' + kl + ';color:#fff;padding:10px 12px;min-width:160px;font-size:11px;border-left:2px solid rgba(255,255,255,.2)"><div style="font-weight:900;font-size:12px;margin-bottom:2px">' + o.boekingNaam + '</div><div style="font-size:10px;font-weight:900;color:#FFD54F">' + (o.deadlineTijd || "—") + '</div><div style="font-size:9px;opacity:.8">' + o.personen + "p \u2022 " + (o.locatie || "") + "</div></th>";
        }).join("");
        var bodyRows = alleGerechtenNamen.map(function(gn, ri) {
          var bg = ri % 2 === 0 ? "#fff" : "#f9fafb";
          var cols = bIds.map(function(bid, ci) {
            var g = boekMap[bid].gerechten[gn];
            var kl = kleuren[ci % kleuren.length];
            if (!g) return '<td style="background:#f0f0f0;color:#aaa;padding:8px 10px;border-left:2px solid ' + kl + '33">—</td>';
            var ab = g.aantalBakken;
            var gnNaam = g.gnNaam || "";
            var cel = g.is_gn ? ab && gnNaam ? "<strong>" + ab + "\xD7 " + gnNaam + "</strong>" : "<strong>" + g.portiesEff + "</strong>" : "<strong>" + g.portiesEff + "</strong>";
            return '<td style="background:' + bg + ";padding:8px 10px;font-size:11px;border-left:2px solid " + kl + '33">' + cel + "</td>";
          }).join("");
          var isGn = bIds.some(function(bid) {
            return boekMap[bid].gerechten[gn] && boekMap[bid].gerechten[gn].is_gn;
          });
          return '<tr><td style="background:' + bg + ';padding:8px 10px;font-weight:700;border-right:2px solid #e8eef2;white-space:nowrap">' + (isGn ? '<span style="background:#3FB8C4;color:#fff;border-radius:3px;padding:1px 5px;font-size:9px;margin-right:4px">GN</span>' : "") + gn + "</td>" + cols + "</tr>";
        }).join("");
        opzetHtmlPerPs[ps] = '<table style="border-collapse:collapse;width:100%;font-size:12px"><thead><tr><th style="background:#001828;color:#fff;padding:10px 12px;min-width:160px;text-align:left">Gerecht</th>' + headerCols + "</tr></thead><tbody>" + bodyRows + "</tbody></table>";
      });
    })();
    var bestaand = dagpakketStatusInfo[gekozenKeuken];
    var versie = bestaand ? (bestaand.publicatie_versie || 1) + 1 : 1;
    window._supa.from("kiosk_dagpakketten").upsert({
      outlet_code: gekozenKeuken,
      datum: vandaag2,
      status: doelStatus,
      boekingen_json: outletBoekingen,
      opzet_json: opzetLijst,
      tijden_json: outletBoekingen.map(function(b) {
        return { boeking_id: b.id, naam: b.naam, tijd: b.deadlineTijd, dag: b.deadlineDag, locatie: b.locatie };
      }),
      buffet_json: buffetLijst,
      opzet_html_per_ps: opzetHtmlPerPs,
      gepubliceerd_op: (/* @__PURE__ */ new Date()).toISOString(),
      gepubliceerd_door: "backoffice",
      publicatie_versie: versie
    }, { onConflict: "outlet_code,datum" }).then(function() {
      setDagpakketPubliceren(false);
      laadDagpakketStatus();
      var keukenNaam2 = gekozenKeuken === "west" ? "Amsterdam West" : "Weesp";
      if (doelStatus === "gepubliceerd") alert("✓ Gepubliceerd naar kiosk " + keukenNaam2 + "!");
      else alert("✓ Concept opgeslagen voor " + keukenNaam2);
    }).catch(function(e) {
      setDagpakketPubliceren(false);
      alert("\u26A0 Fout: " + e.message);
    });
  }
  function genereerGeboekteProducten(boekingen2, outletCode) {
    if (!window._supa || !boekingen2 || boekingen2.length === 0) return;
    var stamSligro = window._stamSligro || [];
    var stamGerechten = window._stamGerechten || [];
    var stamMenus = window._stamMenus || [];
    var stamKoppelingen = window._stamKoppelingen || [];
    if (!stamSligro.length || !stamGerechten.length) return;
    var productenMap = {};
    boekingen2.forEach(function(boeking) {
      (boeking.regels || []).forEach(function(regel) {
        if ((regel.menuNaam || "").toLowerCase().includes("add up")) return;
        var kp = stamKoppelingen.find(function(k) {
          return (k.recras_naam || "").trim() === (regel.menuNaam || "").trim();
        });
        if (!kp) return;
        var menu = stamMenus.find(function(m) {
          return m.id === kp.menu_id;
        });
        if (!menu) return;
        (menu.menu_gerechten || []).forEach(function(mg) {
          var gerecht = stamGerechten.find(function(g) {
            return g.id === (mg.gerecht_id || mg.gerechten && mg.gerechten.id);
          });
          if (!gerecht) return;
          var portiesEff = (regel.aantal || 0) * (mg.porties_per_persoon || 1);
          (gerecht.ingredienten || []).forEach(function(ing) {
            if (ing.zichtbaar === "nee" || ing.zichtbaar === "nooit") return;
            if (!ing.sligro_id) return;
            var sp = stamSligro.find(function(p) {
              return p.id === ing.sligro_id;
            });
            if (!sp) return;
            var hoev = parseFloat(sp.hoeveelheid || sp.hoev || 1) || 1;
            var prijs = parseFloat(sp.prijs_excl || sp.prijs || 0);
            var gebruik = parseFloat(ing.gebruik_per_portie) || 0;
            var benodigdVerpakkingen = Math.ceil(portiesEff * gebruik / hoev);
            var key = sp.artnr || sp.id;
            if (!productenMap[key]) {
              productenMap[key] = {
                artnr: sp.artnr,
                naam: sp.naam,
                eenheid: sp.eenheid,
                prijs_excl: prijs,
                verpakking: hoev,
                aantal: 0,
                totaal: 0
              };
            }
            productenMap[key].aantal += benodigdVerpakkingen;
          });
        });
      });
    });
    var regels = Object.values(productenMap).filter(function(r) {
      return r.aantal > 0;
    }).map(function(r) {
      return Object.assign({}, r, { totaal: Math.round(r.aantal * r.prijs_excl * 100) / 100 });
    });
    if (regels.length === 0) return;
    var datums = boekingen2.map(function(b) {
      return (b.deadline || "").replace("T", " ").split(" ")[0];
    }).filter(Boolean).sort();
    var van = datums[0] || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    var tot = datums[datums.length - 1] || van;
    var totaalExcl = regels.reduce(function(s, r) {
      return s + r.totaal;
    }, 0);
    window._supa.from("geboekte_producten").insert({
      outlet_code: outletCode,
      periode_van: van,
      periode_tot: tot,
      bron: "auto",
      regels_json: regels,
      totaal_excl: Math.round(totaalExcl * 100) / 100,
      opmerking: "Automatisch gegenereerd na import " + (/* @__PURE__ */ new Date()).toLocaleString("nl-NL")
    }).then(function(r) {
      if (r && r.error) console.warn("Geboekte producten opslaan:", r.error);
      else console.log("Geboekte producten gegenereerd:", regels.length, "producten voor", outletCode);
    });
  }
  function checkBBQConflicten(boekingen2) {
    if (!boekingen2 || boekingen2.length === 0) { setBbqConflicten(null); return; }
    var locatieMap = {};
    [
      ["Archery Tag WP","weesp",2,[]],["Basisweg 2, Weesp","weesp",2,[]],["Birdie","weesp",2,[]],
      ["Boardroom","weesp",2,[]],["Bogey","weesp",2,[]],["Boogschieten WP","weesp",2,[]],
      ["Bubbel voetbal WP","weesp",2,[]],["CLUPhuis","weesp",2,[]],["Driving range","weesp",2,[]],
      ["Eagle","weesp",2,[]],["Golfbaan","weesp",2,[]],["Jeu de Boules WP","weesp",2,[]],
      ["Robinson Crusoe WP","weesp",2,[]],["Terrace WP","weesp",2,[]],["The Barn","weesp",2,[]],
      ["UP Fairway","weesp",2,[]],["UPstairs","weesp",2,[]],
      ["Combinatie | Loods 1, 2, 3 & Terrace","voorterrein",1,[]],
      ["Loods 2","voorterrein",1,[]],["Loods 4","voorterrein",1,[]],["Loods 5","voorterrein",1,[]],
      ["Loods 6","voorterrein",1,[]],["Pup - Bar","voorterrein",1,[]],["Ronde Tent","voorterrein",1,[]],
      ["Stretchtent","voorterrein",1,[]],["Terrace","voorterrein",1,[]],["Terras Loods 6","voorterrein",1,[]],
      ["Beachclub","middenterrein",2,["Beach CLUP","Beach Clup","Beachclub1"]],
      ["Beachclub 2","middenterrein",2,["Beach Clup 2","Beachclub2"]],
      ["Loods 7","achterterrein",1,[]],["Loods 7 Patio","achterterrein",1,[]]
    ].forEach(function(r) {
      var obj = { zone: r[1], maxSetups: r[2], canonical: r[0] };
      locatieMap[r[0]] = obj;
      (r[3] || []).forEach(function(a) { locatieMap[a] = obj; });
    });
    var bbqMenuIds = {};
    (window._stamMenus || []).forEach(function(m) {
      var n = (m.naam || "").toLowerCase();
      if (n.includes("bbq") || n.includes("grill") || n.includes("festival food market")) bbqMenuIds[m.id] = true;
    });
    var koppelingen = window._stamKoppelingen || [];
    function getBbqTijdEnPax(b) {
      var bbqTijd = null, pax = 0;
      (b.regels || []).forEach(function(r) {
        var k = koppelingen.find(function(k2) { return k2.recras_naam === r.menuNaam; });
        if (!k || !bbqMenuIds[k.menu_id]) return;
        pax += (r.aantal || 0);
        var t = r.starttijd ? new Date(r.starttijd).getTime() : new Date(b.deadline).getTime();
        if (bbqTijd === null || t < bbqTijd) bbqTijd = t;
      });
      return { bbqTijd: bbqTijd || new Date(b.deadline).getTime(), pax: pax };
    }
    function vereistMin(pax) {
      if (pax > 200) return { min: 60, voorkeur: 60 };
      if (pax > 100) return { min: 40, voorkeur: 40 };
      if (pax > 75)  return { min: 25, voorkeur: 25 };
      if (pax > 50)  return { min: 20, voorkeur: 20 };
      if (pax > 30)  return { min: 20, voorkeur: 20 };
      if (pax > 15)  return { min: 15, voorkeur: 15 };
      return         { min: 10, voorkeur: 10 };
    }
    function uitlegMin(pax) {
      if (pax > 200) return ">200p = min. 60 min";
      if (pax > 100) return ">100p = min. 40 min";
      if (pax > 75)  return ">75p = min. 25 min";
      if (pax > 50)  return ">50p = min. 20 min";
      if (pax > 30)  return ">30p = min. 20 min";
      if (pax > 15)  return ">15p = min. 15 min";
      return "\u226415p = min. 10 min";
    }
    function rond5(ms) {
      var d = new Date(ms); var m = Math.ceil(d.getMinutes() / 5) * 5;
      if (m >= 60) { d.setHours(d.getHours() + 1); d.setMinutes(0); } else { d.setMinutes(m); }
      d.setSeconds(0); d.setMilliseconds(0); return d.getTime();
    }
    var onbekend = {}, zoneGroepen = {};
    boekingen2.forEach(function(b) {
      var tp = getBbqTijdEnPax(b);
      if (tp.pax === 0) return;
      var locConf = locatieMap[b.locatie || ""];
      if (!locConf) {
        if (b.locatie) { onbekend[b.locatie] = onbekend[b.locatie] || []; onbekend[b.locatie].push(b.naam); }
        return;
      }
      var dag = new Date(tp.bbqTijd).toISOString().split("T")[0];
      var key = locConf.zone + "|" + dag;
      if (!zoneGroepen[key]) zoneGroepen[key] = { zone: locConf.zone, dag: dag, maxSetups: locConf.maxSetups, bk: [] };
      zoneGroepen[key].bk.push(Object.assign({}, b, {
        _bbqTijd: tp.bbqTijd, _pax: tp.pax,
        _canonical: locConf.canonical, _status: (b.status || "").toLowerCase()
      }));
    });
    var gevonden = [];
    Object.keys(zoneGroepen).forEach(function(key) {
      var groep = zoneGroepen[key];
      if (groep.bk.length < 2) return;
      var sorted = groep.bk.slice().sort(function(a, b) { return a._bbqTijd - b._bbqTijd; });
      var maxSetups = groep.maxSetups;
      var geadv = {};
      sorted.forEach(function(bk) { geadv[bk.id] = bk._bbqTijd; });
      var conflictenOpDag = [];
      for (var i = 0; i < sorted.length; i++) {
        for (var j = i + 1; j < Math.min(sorted.length, i + maxSetups + 2); j++) {
          var a = sorted[i], b = sorted[j];
          var tA = geadv[a.id], tB = geadv[b.id];
          var verschilMin = Math.round((tB - tA) / 6e4);
          if (verschilMin < 0) continue;
          var reg = vereistMin(b._pax);
          if (verschilMin >= reg.min) continue;
          var maxPax = Math.max(a._pax, b._pax);
          // Selecteer welke boeking te verplaatsen:
          // 1. Voorkeur: OPTIE boven DEF (minder klantimpact)
          // 2. Daarna: kleinste groep
          var aIsOptie = a._status.includes("optie");
          var bIsOptie = b._status.includes("optie");
          var tv, vast;
          if (aIsOptie && !bIsOptie) { tv = a; vast = b; }
          else if (bIsOptie && !aIsOptie) { tv = b; vast = a; }
          else { tv = (b._pax <= a._pax) ? b : a; vast = (tv === b) ? a : b; }
          var tvPax = tv._pax;
          var ankertijd = vast._bbqTijd;
          // Vrije slots: zowel eerder (negatieve delta) als later (positieve delta) tov de vaste boeking
          var kandidaten = [];
          [-180,-150,-120,-90,-75,-60,-50,-45,-40,-35,-30,30,35,40,45,50,60,75,90,120,150,180].forEach(function(delta) {
            var k = ankertijd + delta * 6e4;
            var kuur = new Date(k).getHours();
            if (kuur < 11 || kuur > 22) return;
            var vrij = true;
            for (var si = 0; si < sorted.length; si++) {
              if (sorted[si].id === tv.id) continue;
              // Richting bepaalt wie de 2de is: de 2de boeking heeft de minimumtijd nodig
              var tweedePax = k < sorted[si]._bbqTijd ? sorted[si]._pax : tvPax;
              var reg2 = vereistMin(tweedePax);
              if (Math.abs(k - sorted[si]._bbqTijd) / 6e4 < reg2.min) { vrij = false; break; }
            }
            if (vrij) kandidaten.push(rond5(k));
          });
          var orig = tv._bbqTijd;
          var uniek = [];
          kandidaten.forEach(function(v) { if (uniek.indexOf(v) < 0) uniek.push(v); });
          // Sorteer op minste verschuiving (dichtst bij originele tijd)
          uniek.sort(function(x, y) { return Math.abs(x - orig) - Math.abs(y - orig); });
          // Geadv: verplaats de gekozen boeking (eerder of later, afhankelijk van beste slot)
          if (tv === b) {
            geadv[b.id] = tA + reg.min * 6e4;
          } else {
            geadv[a.id] = tB - reg.min * 6e4;
          }
          conflictenOpDag.push({
            zone: groep.zone, dag: groep.dag, a: a, b: b,
            verschilMin: verschilMin, vereistMin: reg.min, voorkeur: reg.voorkeur, maxPax: maxPax,
            uitleg: uitlegMin(b._pax) + " (voor " + b._pax + "p)",
            nieuweDeadline: new Date(geadv[b.id]).toISOString(),
            type: maxPax > 200 ? "200+ personen" : "Te weinig tijd",
            teVerplaatsen: tv, vrijeSlots: uniek.slice(0, 3)
          });
        }
      }
      if (conflictenOpDag.length > 0) {
        var geadvFin = {};
        sorted.forEach(function(bk) { geadvFin[bk.id] = bk._bbqTijd; });
        for (var pi = 0; pi < sorted.length; pi++) {
          for (var pj = pi + 1; pj < Math.min(sorted.length, pi + maxSetups + 2); pj++) {
            var pa = sorted[pi], pb = sorted[pj];
            var ptA = geadvFin[pa.id], ptB = geadvFin[pb.id];
            var pVerschil = Math.round((ptB - ptA) / 6e4);
            if (pVerschil < 0) continue;
            var pReg = vereistMin(pb._pax);
            if (pVerschil < pReg.min) {
              var paOptie = pa._status.includes("optie");
              var pbOptie = pb._status.includes("optie");
              // Verplaats OPTIE voorkeur, anders kleinste groep
              if (paOptie && !pbOptie) {
                geadvFin[pa.id] = ptB - pReg.min * 6e4; // A eerder
              } else {
                geadvFin[pb.id] = ptA + pReg.min * 6e4; // B later
              }
            }
          }
        }
        var dagPlanning = sorted.map(function(bk) {
          var nieuwT = geadvFin[bk.id] !== bk._bbqTijd ? geadvFin[bk.id] : null;
          return { naam: bk.naam, pax: bk._pax, locatie: bk._canonical,
            status: bk._status, id: bk.id, origTijd: bk._bbqTijd, nieuweTijd: nieuwT,
            sortTijd: nieuwT || bk._bbqTijd };
        }).sort(function(x, y) { return x.sortTijd - y.sortTijd; });
        conflictenOpDag.forEach(function(c) { c.dagPlanning = dagPlanning; });
        // Middenterrein tip: check voor voorterrein-conflicten of middenterrein vrij is
        if (groep.zone === "voorterrein") {
          conflictenOpDag.forEach(function(c) {
            var dag = groep.dag;
            var bbqTijd = c.a._bbqTijd; // starttijd van het conflict
            var mKeys = ["middenterrein|" + dag];
            var tips = [];
            mKeys.forEach(function(mk) {
              var mg = zoneGroepen[mk];
              if (!mg) return;
              // Tel hoeveel setups op middenterrein bezet zijn op dit tijdstip
              var bezet = mg.bk.filter(function(bk) {
                return Math.abs(bk._bbqTijd - bbqTijd) / 6e4 < vereistMin(bk._pax).min;
              });
              var vrij = mg.maxSetups - bezet.length;
              if (vrij > 0) {
                var locaties = mg.bk.map(function(bk){ return bk._canonical; });
                var uniekeLoc = locaties.filter(function(l,i){ return locaties.indexOf(l)===i; });
                tips.push({ vrij: vrij, locaties: uniekeLoc });
              }
            });
            if (tips.length > 0) c.middenterreinTip = tips[0];
          });
        }
        gevonden = gevonden.concat(conflictenOpDag);
      }
    });
    if (Object.keys(onbekend).length > 0) gevonden.unshift({ type: "onbekende_locatie", onbekend: onbekend });
    setBbqConflicten(gevonden);
    // Email wordt wekelijks automatisch verstuurd via de bbq-analyse cron (elke vrijdag)
    // Gebruik de handmatige "Stuur naar Stefan" knop in de popup voor on-demand
  }

  function stuurBBQConflictEmail(conflicten, label, autoMode) {
    if (!conflicten || conflicten.length === 0) { if (!autoMode) alert("Geen conflicten om te versturen."); return; }
    if (!window._supa) { if (!autoMode) alert("Niet ingelogd."); return; }

    // Gebruik de gedeelde HTML-builder (identiek aan popup)
    var emailHtml = window._bouwBbqHtml ? window._bouwBbqHtml(conflicten) : "<p>Geen HTML beschikbaar</p>";
    // Email-mode: verwijder hoogte-beperkingen zodat volledige content getoond wordt
    emailHtml = emailHtml
      .replace(/max-height:[^;]+;/g, '')
      .replace(/overflow:hidden/g, '')
      .replace(/overflow-y:auto;/g, '')
      .replace(/display:flex;flex-direction:column;/g, '');

    var conflictItems = conflicten.filter(function(c){ return c.type !== "onbekende_locatie"; });
    var nConflicten = conflictItems.length;
    var weekLabel = (function() {
      var d = new Date();
      var jan1 = new Date(d.getFullYear(), 0, 1);
      var week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
      return "Week " + week + " " + d.getFullYear();
    }());
    var onderwerp = "BBQ Conflicten " + weekLabel + " — " + nConflicten + " conflict" + (nConflicten !== 1 ? "en" : "");
    var weekKey = "bbq-week-" + (function(){ var d=new Date(); var jan1=new Date(d.getFullYear(),0,1); return Math.ceil(((d-jan1)/86400000+jan1.getDay()+1)/7)+"-"+d.getFullYear(); }());

    function verstuur() {
      window._supa.auth.getSession().then(function(sessRes) {
        var token = sessRes.data && sessRes.data.session ? sessRes.data.session.access_token : "";
        fetch("https://aezatnwsrhlwtykpixsq.supabase.co/functions/v1/stuur-opzetmail", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
          body: JSON.stringify({ actie: "verstuur", dag: weekKey, hash: weekKey, html: emailHtml, onderwerp: onderwerp })
        }).then(function(r){ return r.json(); })
          .then(function(d){
            if (!autoMode) alert(d.succes ? "✓ BBQ conflicten verstuurd naar stefan@upevents.nl" : "⚠ Versturen mislukt: " + (d.fout || "onbekend"));
          })
          .catch(function(e){ if (!autoMode) alert("⚠ Versturen mislukt: " + e.message); });
      });
    }

    if (autoMode) {
      // Wekelijkse check: alleen sturen als deze week nog niet gestuurd
      window._supa.auth.getSession().then(function(sessRes) {
        var token = sessRes.data && sessRes.data.session ? sessRes.data.session.access_token : "";
        fetch("https://aezatnwsrhlwtykpixsq.supabase.co/functions/v1/stuur-opzetmail", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
          body: JSON.stringify({ actie: "check", dag: weekKey, hash: weekKey })
        }).then(function(r){ return r.json(); })
          .then(function(d){
            if (d.reeds_verstuurd && d.zelfde_data) {
              console.log("BBQ conflicten email al verstuurd deze week, overgeslagen.");
            } else {
              verstuur();
            }
          })
          .catch(function(){ verstuur(); }); // bij fout toch versturen
      });
    } else {
      // Handmatig: altijd sturen
      verstuur();
    }
  }

  function checkEnStuurEmail(boekingen2) {
    if (!boekingen2 || boekingen2.length === 0 || !window._supa) return;
    var morgen = /* @__PURE__ */ new Date();
    morgen.setDate(morgen.getDate() + 1);
    var morgenStr = morgen.toISOString().split("T")[0];
    var dagNamen = ["zo", "ma", "di", "wo", "do", "vr", "za"];
    var maandNamen = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
    var morgenLabel = dagNamen[morgen.getDay()] + " " + morgen.getDate() + " " + maandNamen[morgen.getMonth()];
    var morgenBoekingen = boekingen2.filter(function(b) {
      return (b.deadline || "").startsWith(morgenStr);
    });
    if (morgenBoekingen.length === 0) return;
    var hashData = morgenBoekingen.map(function(b) {
      return b.id + "|" + b.naam + "|" + b.deadlineTijd + "|" + (b.regels || []).map(function(r) {
        return r.menuNaam + ":" + r.aantal;
      }).join(",");
    }).join(";");
    var hash = btoa(hashData).substring(0, 32);
    setEmailStatus("checking");
    window._supa.auth.getSession().then(function(sessRes) {
      var token = sessRes.data && sessRes.data.session ? sessRes.data.session.access_token : "";
      fetch("https://aezatnwsrhlwtykpixsq.supabase.co/functions/v1/stuur-opzetmail", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ actie: "check", dag: morgenStr, hash })
      }).then(function(r) {
        return r.json();
      }).then(function(checkRes) {
        if (checkRes.reeds_verstuurd && checkRes.zelfde_data) {
          setEmailStatus("al_verstuurd");
          return;
        }
        var emailHtml = window._genereerOpzetEmailHTML(morgenBoekingen, morgenLabel);
        var onderwerp = "KitchenRobot — Opzetoverzicht " + morgenLabel + " (" + morgenBoekingen.length + " boeking" + (morgenBoekingen.length !== 1 ? "en" : "") + ")";
        fetch("https://aezatnwsrhlwtykpixsq.supabase.co/functions/v1/stuur-opzetmail", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
          body: JSON.stringify({ actie: "verstuur", dag: morgenStr, hash, html: emailHtml, onderwerp })
        }).then(function(r) {
          return r.json();
        }).then(function(stuurRes) {
          setEmailStatus(stuurRes.succes ? "verstuurd" : stuurRes.fout && stuurRes.fout.includes("RESEND_API_KEY") ? "geen_key" : "fout");
        }).catch(function() {
          setEmailStatus("fout");
        });
      }).catch(function() {
        setEmailStatus("fout");
      });
    });
  }
  var csv = useMemo(function() {
    return window._genereerCSV();
  }, [bestellingKey, geladen.length]);
  var bestellingRaw = useMemo(function() {
    return window._berekenSligroBestelling();
  }, [bestellingKey, geladen.length]);
  var bestelling = bestellingRaw.slice().sort(function(a, b) {
    var va, vb;
    if (sortBestVeld === "artnr") {
      va = a.artnr || "";
      vb = b.artnr || "";
    } else if (sortBestVeld === "naam") {
      va = a.naam || "";
      vb = b.naam || "";
    } else if (sortBestVeld === "aantal") {
      return sortBestDir === "asc" ? a.totaalVerpakkingen - b.totaalVerpakkingen : b.totaalVerpakkingen - a.totaalVerpakkingen;
    } else {
      va = a.naam || "";
      vb = b.naam || "";
    }
    var res = va.localeCompare(vb, "nl");
    return sortBestDir === "asc" ? res : -res;
  });
  var csvLines = bestelling.length;
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: C.night, marginBottom: 4 } }, geladen.length > 0 ? "Import & Publiceer" : "Welkom terug"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: C.muted } }, geladen.length > 0 ? geladen.length + " boekingen geladen \xB7 klik op Publiceer om naar de kiosks te sturen" : "Importeer de Recras boekingenexport om te starten.")), geladen.length > 0 && (function() {
    var totPers2 = (window._recrasBoekingen || []).reduce(function(s, b) {
      return s + (b.regels || []).filter(function(r) {
        return !(r.menuNaam || "").toLowerCase().includes("add up");
      }).reduce(function(ss, r) {
        return ss + (r.aantal || 0);
      }, 0);
    }, 0);
    var bbqBoekingen = (window._recrasBoekingen || []).filter(function(b) {
      return (b.regels || []).some(function(r) {
        return (r.menuNaam || "").toLowerCase().includes("bbq");
      });
    }).length;
    var ongekoppeld = (window._recrasBoekingen || []).reduce(function(s, b) {
      return s + (b.regels || []).filter(function(r) {
        if ((r.menuNaam || "").toLowerCase().includes("add up")) return false;
        return !(window._stamKoppelingen || []).find(function(k) {
          return (k.recras_naam || "").trim() === (r.menuNaam || "").trim();
        });
      }).length;
    }, 0);
    return /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 } }, [
      { label: "Boekingen", waarde: geladen.length, sub: "geladen", kleur: C.aqua },
      { label: "Personen totaal", waarde: totPers2, sub: "pax", kleur: C.night },
      { label: "BBQ boekingen", waarde: bbqBoekingen, sub: "met BBQ menu", kleur: "#E65100" },
      { label: "Ongekoppeld", waarde: ongekoppeld, sub: "regels", kleur: ongekoppeld > 0 ? C.hot : C.green }
    ].map(function(s) {
      return /* @__PURE__ */ React.createElement("div", { key: s.label, style: { background: "#fff", borderRadius: 16, padding: "14px 18px", border: "1px solid #E8EEF3", boxShadow: "0 1px 3px rgba(35,71,86,.04)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 } }, s.label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, fontWeight: 900, color: s.kleur, lineHeight: 1 } }, s.waarde), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.muted, marginTop: 4 } }, s.sub));
    }));
  })(),  bbqConflicten !== null && bbqConflicten.length > 0 && /* @__PURE__ */ React.createElement("div", { style: {
    marginBottom: 12,
    padding: "10px 14px",
    borderRadius: 14,
    fontSize: 12,
    fontWeight: 700,
    background: "#FFEBEE",
    border: "2px solid " + C.hot,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8
  } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.hot } }, "🚫 ", bbqConflicten.length, " BBQ planning conflict", bbqConflicten.length !== 1 ? "en" : "", " gevonden — boekingen zitten te dicht op elkaar"), /* @__PURE__ */ React.createElement(
    "button",
    {
      style: { ...window._btnP, fontSize: 11, padding: "5px 12px" },
      onClick: function() {
        window._toonBbqPopup && window._toonBbqPopup(bbqConflicten, stuurBBQConflictEmail);
      }
    },
    "Bekijk analyse"
  )),  ovenTips.length>0&&React.createElement("div",{style:{marginBottom:12,padding:"10px 14px",borderRadius:8,fontSize:12,background:"#FFF8E1",border:"1px solid #FFD54F",display:"flex",gap:8}},React.createElement("span",{style:{color:"#B8860B",fontWeight:700}},"Tip: ",ovenTips.length," oven-boeking"+(ovenTips.length>1?"en":"")+" met 50+ personen op hetzelfde tijdstip — check ovenruimte. (",ovenTips.map(function(t){return t.a.naam+" & "+t.b.naam+" ("+t.diffMin+" min)";}).join(", "),")")), frituurTips.length>0&&React.createElement("div",{style:{marginBottom:12,padding:"10px 14px",borderRadius:8,fontSize:12,background:"#FFF3E0",border:"1px solid #FFB74D",display:"flex",gap:8}},React.createElement("span",{style:{color:"#E65100",fontWeight:700}},"Tip: ",frituurTips.length," frituur-boeking"+(frituurTips.length>1?"en":"")+" met 50+ personen tegelijk — overweeg extra frituurcapaciteit. (",frituurTips.map(function(t){return t.a.naam+" & "+t.b.naam+" ("+t.diffMin+" min)";}).join(", "),")")), geladen.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14, background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(35,71,86,.07)", border: "1px solid #E8EEF3" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 900, fontSize: 14, color: C.night, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 } }, "📱 Dagpakket voor kiosks", dagpakketStatus === "actief" && /* @__PURE__ */ React.createElement("span", { style: { background: "#E8F5E9", color: C.green, borderRadius: 100, padding: "2px 8px", fontSize: 11, fontWeight: 700 } }, "\u25CF Actief — keuken werkt ermee"), dagpakketStatus === "gepubliceerd" && /* @__PURE__ */ React.createElement("span", { style: { background: "#E3F2FD", color: "#1565C0", borderRadius: 100, padding: "2px 8px", fontSize: 11, fontWeight: 700 } }, "\u25CF Gepubliceerd"), dagpakketStatus === "afgesloten" && /* @__PURE__ */ React.createElement("span", { style: { background: "#F3E5F5", color: "#6A1B9A", borderRadius: 100, padding: "2px 8px", fontSize: 11, fontWeight: 700 } }, "Afgesloten")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 } }, ["west", "weesp"].map(function(code_) {
    var info = dagpakketStatusInfo[code_] || {};
    var stKleur = { actief: C.green, gepubliceerd: "#1565C0", afgesloten: "#9E9E9E", concept: C.muted }[info.status] || C.muted;
    return /* @__PURE__ */ React.createElement("div", { key: code_, style: { background: "#F7F9FC", borderRadius: 14, padding: "10px 12px", border: "1px solid #E8EEF3" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 12, color: C.night } }, code_ === "west" ? "🏙 Amsterdam West" : "🏘 Weesp"), info.status ? /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: stKleur, fontWeight: 700, marginTop: 4 } }, info.status === "actief" ? "\u25CF Actief — " + (info.activiteiten_count || 0) + " aftekeningen" : info.status === "gepubliceerd" ? "\u25CF Gepubliceerd" : info.status === "afgesloten" ? "Afgesloten" : info.status) : /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.muted, marginTop: 4 } }, "Nog niet gepubliceerd"));
  })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("a", { href: "#kiosk", target: "_blank", style: { fontSize: 11, color: C.aqua, textDecoration: "none", border: "1px solid " + C.aqua, borderRadius: 100, padding: "5px 10px", fontWeight: 700 } }, "👁 Kiosk preview")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG }, onClick: function() {
    publiceerDagpakket("concept");
  } }, "Opslaan als concept"), /* @__PURE__ */ React.createElement(
    "button",
    {
      style: { ...window._btnP, opacity: dagpakketPubliceren ? 0.6 : 1, background: dagpakketStatus === "actief" ? C.hot : C.aqua },
      disabled: dagpakketPubliceren,
      onClick: function() {
        publiceerDagpakket("gepubliceerd");
      }
    },
    dagpakketPubliceren ? "\u23F3 Publiceren..." : dagpakketStatus === "actief" ? "\u26A0 Forceer update (keuken werkt ermee)" : "📱 Publiceer naar kiosks"
  )))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: SS.card }, /* @__PURE__ */ React.createElement("div", { style: SS.cS }, "Stap 1 — dagelijkse import"), /* @__PURE__ */ React.createElement("div", { style: SS.cT }, "Recras boekingenexport"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: C.muted, margin: "0 0 12px" } }, "Importeer het .xlsx bestand vanuit Recras. Privacygevoelige kolommen L/M/N/O worden direct verwijderd."), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: C.night, marginBottom: 6 } }, "Welke keuken importeer je?"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, [["west", "🏙 Amsterdam West"], ["weesp", "🌿 Weesp"]].map(function(opt) {
    var actief = importKeuken === opt[0];
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: opt[0],
        style: {
          flex: 1,
          padding: "10px 0",
          borderRadius: 14,
          border: "2px solid " + (actief ? C.aqua : C.border),
          background: actief ? "rgba(63,184,196,.1)" : "#fff",
          fontWeight: actief ? 900 : 400,
          color: actief ? C.aqua : C.night,
          fontSize: 13,
          cursor: "pointer",
          fontFamily: "inherit"
        },
        onClick: function() {
          setImportKeuken(opt[0]);
          try {
            localStorage.setItem("kr_import_keuken", opt[0]);
          } catch (e) {
          }
        }
      },
      opt[1]
    );
  })), !importKeuken && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.hot, marginTop: 5, fontWeight: 700 } }, "\u26A0 Kies eerst een keuken om te importeren"), importKeuken && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.green, marginTop: 5 } }, "✓ Importeert voor: ", /* @__PURE__ */ React.createElement("strong", null, importKeuken === "west" ? "Amsterdam West" : "Weesp"), " — alleen boekingen van die locatie worden getoond")), !imp ? /* @__PURE__ */ React.createElement("label", { style: { display: "block", border: "2px dashed " + (importKeuken ? C.aqua : "#ccc"), borderRadius: 16, padding: "22px 16px", textAlign: "center", background: importKeuken ? "rgba(218,237,243,.35)" : "#f9f9f9", cursor: importKeuken ? "pointer" : "not-allowed", marginBottom: 10, opacity: importKeuken ? 1 : 0.6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, marginBottom: 6 } }, "📂"), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 12, color: C.night, marginBottom: 3 } }, "Klik om .xlsx bestand te kiezen"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: C.muted } }, "Recras boekingenexport (.xlsx)"), /* @__PURE__ */ React.createElement("input", { type: "file", accept: ".xlsx,.xls", disabled: !importKeuken, style: { display: "none" }, onChange: function(e) {
    if (!importKeuken) {
      alert("Kies eerst een keuken.");
      return;
    }
    var file = e.target.files[0];
    if (!file) return;
    if (typeof XLSX === "undefined") {
      alert("SheetJS wordt geladen, probeer opnieuw.");
      return;
    }
    var reader = new FileReader();
    reader.onload = function(ev) {
      try {
        var wb = XLSX.read(ev.target.result, { type: "array" });
        var ws = wb.Sheets[wb.SheetNames[0]];
        var rijen = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "", raw: false });
        if (rijen.length < 2) {
          alert("Geen data gevonden in het bestand.");
          return;
        }
        var boekingenMap = {};
        var boekingenMap = {};
        rijen.slice(1).forEach(function(r) {
          var bid = String(r[0] || "").trim();
          var productNaam = String(r[1] || "").trim();
          var bijzonderheden = String(r[3] || "").trim();
          var opmerking = String(r[16] || "").trim();
          var rawDatum = r[2] || "";
          var datum = String(rawDatum).trim();
          if (rawDatum instanceof Date) {
            var rd = rawDatum;
            datum = rd.getFullYear() + "-" + String(rd.getMonth() + 1).padStart(2, "0") + "-" + String(rd.getDate()).padStart(2, "0") + " " + String(rd.getHours()).padStart(2, "0") + ":" + String(rd.getMinutes()).padStart(2, "0") + ":00";
          }
          var aantal = parseInt(r[5]) || 0;
          var locatie = String(r[6] || "").trim();
          var plaats = String(r[9] || "").trim();
          var groepsnaam = String(r[11] || "").trim();
          var boekingsnaam = String(r[18] || "").trim();
          var statusRij = String(r[17] || "").trim().toLowerCase();
          if (!bid || !productNaam) return;
          var deadlineTijd = "";
          var deadlineDag = "";
          var deadlineDatum = "";
          if (datum) {
            var ds = datum.replace("T", " ").split(" ");
            var ds = datum.replace("T", " ").split(" ");
            var datStr = ds[0] || "";
            var tijdStr = (ds[1] || "").substring(0, 5);
            var datParts = datStr.indexOf("/") >= 0 ? datStr.split("/") : datStr.split("-");
            var jaar, maand, dag;
            if (datParts.length === 3) {
              if (parseInt(datParts[0]) > 31) {
                jaar = parseInt(datParts[0]);
                maand = parseInt(datParts[1]) - 1;
                dag = parseInt(datParts[2]);
              } else {
                dag = parseInt(datParts[0]);
                maand = parseInt(datParts[1]) - 1;
                jaar = parseInt(datParts[2].split(" ")[0]);
                if (!tijdStr && datParts[2].indexOf(" ") > 0) {
                  tijdStr = datParts[2].split(" ")[1].substring(0, 5);
                }
              }
              var tijdParts = tijdStr.split(":");
              var uur = parseInt(tijdParts[0]) || 0, min = parseInt(tijdParts[1]) || 0;
              var d = new Date(jaar, maand, dag, uur, min, 0);
              datum = String(jaar) + "-" + String(maand + 1).padStart(2, "0") + "-" + String(dag).padStart(2, "0") + " " + String(uur).padStart(2, "0") + ":" + String(min).padStart(2, "0") + ":00";
              if (!isNaN(d.getTime())) {
                deadlineTijd = tijdStr || uur + ":" + String(min).padStart(2, "0");
                deadlineDatum = String(dag).padStart(2, "0") + "-" + String(maand + 1).padStart(2, "0") + "-" + String(jaar).slice(-2);
                var dagNamen = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
                var maandNamen = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
                var dagNamen2 = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
                var maandNamen2 = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
                deadlineDag = dagNamen2[d.getDay()] + " " + String(dag).padStart(2, "0") + " " + maandNamen2[maand];
              }
            }
          }
          if (!boekingenMap[bid]) {
            boekingenMap[bid] = {
              id: bid,
              naam: boekingsnaam || groepsnaam || bid,
              deadline: datum,
              deadlineDatum,
              deadlineTijd,
              deadlineDag,
              locatie,
              plaats,
              status: statusRij || "bevestigd",
              regels: [],
              aantalLen: 0,
              aantalSum: 0
            };
          }
          boekingenMap[bid].regels.push({
            menuNaam: productNaam,
            starttijd: datum,
            starttijdTijd: deadlineTijd,
            opmerking: opmerking || bijzonderheden,
            menuCode: productNaam,
            aantal
          });
          boekingenMap[bid].aantalSum += aantal;
          boekingenMap[bid].aantalLen += 1;
        });
        Object.values(boekingenMap).forEach(function(b) {
          b.gemiddeldePersonen = b.aantalLen > 0 ? Math.round(b.aantalSum / b.aantalLen) : 0;
        });
        var lijst = Object.values(boekingenMap);
        if (lijst.length === 0) {
          alert("Geen boekingen herkend. Controleer het bestand.");
          return;
        }
        var westLocaties = ["Loods 2", "Loods 4", "Loods 5", "Loods 6", "Terras Loods 6", "Pup - Bar", "Ronde Tent", "Stretchtent", "Terrace", "Beachclub", "Beachclub 2", "Loods 7", "Loods 7 Patio", "Combinatie | Loods 1, 2, 3 & Terrace", "Beach CLUP", "Beach Clup", "Beachclub1", "Beach Clup 2", "Beachclub2"];
        var gekeuzenKeuken = importKeuken || "west";
        // Weesp-locaties: alles wat in locatieMap staat als zone=weesp
        var weespLocaties = ["Archery Tag WP","Basisweg 2, Weesp","Birdie","Boardroom","Bogey","Boogschieten WP","Bubbel voetbal WP","CLUPhuis","Driving range","Eagle","Golfbaan","Jeu de Boules WP","Robinson Crusoe WP","Terrace WP","The Barn","UP Fairway","UPstairs"];
        var lijstGefilterd = lijst.filter(function(b) {
          var loc = b.locatie || "";
          var isWest = westLocaties.indexOf(loc) >= 0;
          var isWeesp = weespLocaties.indexOf(loc) >= 0;
          // Onbekende locatie (niet west, niet weesp): meesturen voor West
          // zodat hij als "onbekende locatie" in de conflictcheck verschijnt
          var isOnbekend = loc !== "" && !isWest && !isWeesp;
          return gekeuzenKeuken === "west" ? (isWest || isOnbekend) : isWeesp;
        });
        lijstGefilterd.forEach(function(b) {
          b.outlet_code = gekeuzenKeuken;
        });
        if (lijstGefilterd.length === 0) {
          alert("Geen boekingen voor " + (gekeuzenKeuken === "west" ? "Amsterdam West" : "Weesp") + " gevonden in dit bestand. Heb je de juiste keuken geselecteerd?");
          return;
        }
        window._recrasBoekingen = lijstGefilterd;
        window._importKeuken = gekeuzenKeuken;
        setGeladen(lijstGefilterd);
        setBestellingKey(function(k) {
          return k + 1;
        });
        setImp(true);
        checkEnStuurEmail(lijstGefilterd);
        checkBBQConflicten(lijstGefilterd);
    (function checkOVF(bks){if(!bks||!bks.length){setOvenTips([]);setFrituurTips([]);return;}var kp=window._stamKoppelingen||[];var sm=window._stamMenus||[];var spg=window._stamProductgroepen||[];function psN(mid){var m=sm.find(function(x){return x.id===mid;});if(!m)return"";for(var i=0;i<spg.length;i++){var ps=(spg[i].soorten||[]).find(function(s){return s.id===(m.productsoort_id||m.psId);});if(ps)return spg[i].naam+" "+ps.naam;}return"";}function hasSoort(b,kw){return(b.regels||[]).some(function(r){var k=kp.find(function(k){return(k.recras_naam||"").trim()===(r.menuNaam||"").trim();});return k&&psN(k.menu_id).toLowerCase().includes(kw);});}function pax(b,kw){return(b.regels||[]).reduce(function(s,r){var k=kp.find(function(k){return(k.recras_naam||"").trim()===(r.menuNaam||"").trim();});return k&&psN(k.menu_id).toLowerCase().includes(kw)?s+(r.aantal||0):s;},0);}function det(kw){var bs=bks.filter(function(b){return hasSoort(b,kw)&&pax(b,kw)>50;});var tips=[];bs.forEach(function(a,i){bs.forEach(function(b,j){if(j<=i)return;var tA=new Date(a.deadline).getTime(),tB=new Date(b.deadline).getTime(),diff=Math.abs(tB-tA)/6e4;if(diff<=30)tips.push({a:a,b:b,paxA:pax(a,kw),paxB:pax(b,kw),diffMin:Math.round(diff)});});});return tips;}setOvenTips(det("oven"));setFrituurTips(det("frituur"));})(lijstGefilterd);
        if (window._supa && lijstGefilterd.length > 0) {
          var dbBoekingen = lijstGefilterd.map(function(b) {
            return {
              id: b.id,
              naam: b.naam,
              deadline: b.deadline,
              deadline_dag: b.deadlineDag || "",
              deadline_tijd: b.deadlineTijd || "",
              locatie: b.locatie || "",
              plaats: b.plaats || "",
              regels: b.regels || [],
              updated_at: (/* @__PURE__ */ new Date()).toISOString(),
              outlet_code: gekeuzenKeuken,
              import_datum: vandaag
            };
          });
          window._supa.from("recras_boekingen").upsert(dbBoekingen, { onConflict: "id" }).then(function(r) {
            if (r && r.error) console.warn("Boekingen opslaan:", r.error);
          });
          setTimeout(function() {
            genereerGeboekteProducten(lijstGefilterd, gekeuzenKeuken);
          }, 500);
        }
        try {
          localStorage.setItem("kr_import_datum", vandaag);
        } catch (ex) {
        }
      } catch (err) {
        alert("Fout bij inlezen: " + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  } })) : /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: Object.assign({}, window._alertS, { margin: 0, flex: 1 }) }, "✓ ", geladen.length, " boekingen geladen voor vandaag"), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, marginLeft: 8, color: "#c0392b" }, onClick: function() {
    try {
      localStorage.removeItem("kr_import_datum");
    } catch (e) {
    }
    window._recrasBoekingen = [];
    setImp(false);
    setShowCSV(false);
    setGeladen([]);
    setBestellingKey(function(k) {
      return k + 1;
    });
    window._recrasBoekingen = [];
    setGeladen([]);
  } }, "Verwijder import")), /* @__PURE__ */ React.createElement("button", { style: window._btnA, onClick: function() {
    setSc("boekingen");
  } }, "Bekijk boekingen \u2192"), geladen.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, overflowX: "auto" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 12, marginBottom: 6 } }, "Alle ge\xEFmporteerde regels (", (window._recrasBoekingen || []).reduce(function(s, b) {
    return s + b.regels.length;
  }, 0), " regels in ", geladen.length, " boekingen):"), /* @__PURE__ */ React.createElement("table", { className:"kr-table", style: { ...SS.tbl, fontSize: 11 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: C.night } }, [["id", "Boeking ID"], ["datum", "Datum"], ["tijd", "Tijd"], ["naam", "Groepsnaam"], ["locatie", "Locatie"], ["product", "Recras product"], ["aantal", "Aantal"], ["menu", "Gekoppeld menu"]].map(function(h) {
    var klik = ["id", "datum", "tijd", "naam", "locatie"].includes(h[0]);
    return /* @__PURE__ */ React.createElement(
      "th",
      {
        key: h[0],
        style: { ...SS.th, color: "white", background: "transparent", whiteSpace: "nowrap", cursor: klik ? "pointer" : "default" },
        onClick: klik ? function() {
          if (sortBoekVeld === h[0]) {
            setSortBoekDir(sortBoekDir === "asc" ? "desc" : "asc");
          } else {
            setSortBoekVeld(h[0]);
            setSortBoekDir("asc");
          }
        } : void 0
      },
      h[1],
      klik ? sortBoekIcon(h[0]) : ""
    );
  }))), /* @__PURE__ */ React.createElement("tbody", null, boekingen.map(function(b) {
    return b.regels.map(function(r, ri) {
      var kop = (window._stamKoppelingen || []).find(function(k) {
        return (k.recras_naam || "").trim() === (r.menuNaam || "").trim();
      });
      var m = kop ? (window._stamMenus || []).find(function(m2) {
        return m2.id === kop.menu_id;
      }) : null;
      if (!m) m = (window._stamMenus || []).find(function(m2) {
        return m2.naam === r.menuNaam;
      });
      return /* @__PURE__ */ React.createElement("tr", { key: b.id + "_" + ri, style: { background: ri === 0 ? "#EFF9FB" : C.white, borderLeft: "3px solid " + C.aqua, borderTop: ri === 0 ? "2px solid " + C.aqua : "none" } }, /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 10, color: C.muted } }, ri === 0 ? b.id : ""), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, whiteSpace: "nowrap" } }, ri === 0 ? b.deadlineDatum || "—" : ""), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 700, color: C.hot, whiteSpace: "nowrap" } }, (r.starttijdTijd && r.starttijdTijd !== b.deadlineTijd) ? r.starttijdTijd : ri === 0 ? b.deadlineTijd || "—" : ""), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: ri === 0 ? 700 : 400 } }, ri === 0 ? b.naam : ""), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 10, color: C.muted } }, ri === 0 ? b.locatie : ""), /* @__PURE__ */ React.createElement("td", { style: SS.td }, r.menuNaam), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 700, textAlign: "center" } }, r.aantal), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td } }, m ? /* @__PURE__ */ React.createElement("span", { style: { color: C.green, fontWeight: 700 } }, "✓ ", m.naam) : /* @__PURE__ */ React.createElement("span", { style: { color: "#F57F17" } }, "\u26A0 Niet gekoppeld")));
    });
  }))))))));
}

  window._HomeScreen = HomeScreen;
})();
