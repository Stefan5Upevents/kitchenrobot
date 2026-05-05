// kr-bundle.js — auto-generated 2026-05-05T19:28:54.858Z
// Branch: main
// Modules (29): adviezen-screen.js, algemeen-tab.js, allergenen-screen.js, api-koppelingen-screen.js, berichten-chef-screen.js, boekingen-screen.js, buffet-screen.js, chef-screen.js, draaiboek-links-tab.js, fin-instellingen-screen.js, financieel-screen.js, geboekte-producten-screen.js, haccp-instellingen-screen.js, haccp-screen.js, home-screen.js, inspiratie.js, instructies-tab.js, kiosk-beheer-tab.js, live-dashboard-blok.js, nvwa-inspectie-screen.js, opzet-logboek-screen.js, opzet-screen.js, pres-tab.js, sensoren-screen.js, sligro-bestelling-screen.js, stam-screen.js, tijden-screen.js, tijden-tab.js, voorraad-checker-tab.js
// Optie A van overdracht v9.6 — 1 bundle, geen defer, geen race-conditie

// ===== adviezen-screen.js (16104 bytes) =====
// KitchenRobot module: adviezen-screen.js
// Geextraheerd uit index.html op 2026-05-05T06:46:47.945Z
// Bevat: AdviezenScreen
// Externe refs (via window._): (geen)
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function AdviezenScreen() {
  var C = window._C || { night:'#234756', aqua:'#3FB8C4', hot:'#E8202B', green:'#2E7D32', muted:'#78909C', white:'#fff', orange:'#FF9800' };
  var SS = window._SS || { pT: { fontSize:22, fontWeight:900, color:'#234756', marginBottom:4 }, pD: { fontSize:12, color:'#78909C', marginBottom:16 } };
  var [adviezen, setAdviezen] = React.useState([]);
  var [laden, setLaden] = React.useState(true);
  var [filter, setFilter] = React.useState('in_review');
  var [typeFilter, setTypeFilter] = React.useState('alle');
  var [detail, setDetail] = React.useState(null);
  var [actieBezig, setActieBezig] = React.useState(false);
  var [notitie, setNotitie] = React.useState('');
  var [mijnNaam, setMijnNaam] = React.useState('');

  function laad() {
    setLaden(true);
    var q = window._supa.from('adviezen').select('*').order('aangemaakt_op', { ascending: false });
    if (filter !== 'alle') q = q.eq('status', filter);
    if (typeFilter !== 'alle') q = q.eq('type', typeFilter);
    q.then(function(res) {
      setAdviezen(res.data || []);
      setLaden(false);
    });
  }
  React.useEffect(laad, [filter, typeFilter]);
  React.useEffect(function(){
    // Haal naam uit profiel (gebruikers_profielen)
    if (window._user && window._user.id) {
      window._supa.from('gebruikers_profielen').select('naam').eq('id', window._user.id).single().then(function(res){
        if (res.data && res.data.naam) setMijnNaam(res.data.naam);
        else setMijnNaam(window._user.email || 'Onbekend');
      });
    }
  }, []);

  function goedkeuren(advies) {
    if (actieBezig) return;
    var naam = mijnNaam || prompt('Jouw naam:');
    if (!naam) return;
    setActieBezig(true);
    window._supa.from('adviezen').update({
      status: 'goedgekeurd',
      goedgekeurd_op: new Date().toISOString(),
      goedgekeurd_door_naam: naam,
      goedgekeurd_notitie: notitie || null
    }).eq('id', advies.id).then(function(res) {
      setActieBezig(false);
      setDetail(null);
      setNotitie('');
      laad();
    });
  }
  function afwijzen(advies) {
    if (actieBezig) return;
    if (!notitie.trim()) { alert('Vul een reden in voor afwijzing'); return; }
    var naam = mijnNaam || prompt('Jouw naam:');
    if (!naam) return;
    setActieBezig(true);
    window._supa.from('adviezen').update({
      status: 'afgewezen',
      afgewezen_op: new Date().toISOString(),
      afgewezen_door_naam: naam,
      afgewezen_reden: notitie
    }).eq('id', advies.id).then(function(res) {
      setActieBezig(false);
      setDetail(null);
      setNotitie('');
      laad();
    });
  }
  function markeerUitgevoerd(advies) {
    setActieBezig(true);
    window._supa.from('adviezen').update({
      status: 'uitgevoerd',
      uitgevoerd_op: new Date().toISOString(),
      uitgevoerd_resultaat: notitie || 'Handmatig uitgevoerd'
    }).eq('id', advies.id).then(function(){
      setActieBezig(false);
      setDetail(null);
      setNotitie('');
      laad();
    });
  }
  function heropenen(advies) {
    setActieBezig(true);
    window._supa.from('adviezen').update({
      status: 'in_review',
      goedgekeurd_op: null, goedgekeurd_door_naam: null, goedgekeurd_notitie: null,
      afgewezen_op: null, afgewezen_door_naam: null, afgewezen_reden: null
    }).eq('id', advies.id).then(function(){
      setActieBezig(false);
      setDetail(null);
      laad();
    });
  }

  function typeLabel(t) {
    var m = { 'sligro_bestelling':'🛒 Bestelling', 'menu_wijziging':'🍽️ Menu-wijziging', 'inspiratie':'✨ Inspiratie', 'overig':'📌 Overig' };
    return m[t] || t;
  }
  function statusBadge(s) {
    var cfg = {
      'in_review': { bg: '#FFF3E0', color: '#E65100', label: '⏳ In review' },
      'goedgekeurd': { bg: '#E8F5E9', color: '#2E7D32', label: '✓ Goedgekeurd' },
      'afgewezen': { bg: '#FFEBEE', color: '#C62828', label: '✗ Afgewezen' },
      'uitgevoerd': { bg: '#E3F2FD', color: '#1565C0', label: '🚀 Uitgevoerd' },
      'ingetrokken': { bg: '#F5F5F5', color: '#757575', label: '↩ Ingetrokken' }
    };
    var c = cfg[s] || cfg['in_review'];
    return React.createElement('span', { style:{background:c.bg,color:c.color,borderRadius:100,padding:'3px 10px',fontSize:11,fontWeight:700} }, c.label);
  }
  function prioBadge(p) {
    var cfg = {
      'laag': { bg: '#F5F5F5', color: '#757575' },
      'normaal': null,
      'hoog': { bg: '#FFF3E0', color: '#E65100' },
      'urgent': { bg: '#FFEBEE', color: '#C62828' }
    };
    var c = cfg[p]; if (!c) return null;
    return React.createElement('span', { style:{background:c.bg,color:c.color,borderRadius:100,padding:'2px 8px',fontSize:10,fontWeight:700,marginLeft:6,textTransform:'uppercase',letterSpacing:.5} }, p);
  }
  function fmtDatum(d) {
    if (!d) return '';
    var dt = new Date(d);
    return String(dt.getDate()).padStart(2,'0') + '/' + String(dt.getMonth()+1).padStart(2,'0') + ' ' + String(dt.getHours()).padStart(2,'0') + ':' + String(dt.getMinutes()).padStart(2,'0');
  }

  var tellers = adviezen.reduce(function(acc, a){ acc[a.status] = (acc[a.status]||0)+1; return acc; }, {});

  function filterBtn(val, lbl, count) {
    var aan = filter === val;
    return React.createElement('button', {
      onClick: function(){ setFilter(val); },
      style: { padding:'7px 14px', borderRadius:100, border:'none', background: aan ? C.night : '#fff', color: aan ? '#fff' : C.night, cursor:'pointer', fontSize:12, fontWeight:700, fontFamily:'inherit', marginRight:6 }
    }, lbl + (count !== undefined ? ' (' + count + ')' : ''));
  }
  function typeBtn(val, lbl) {
    var aan = typeFilter === val;
    return React.createElement('button', {
      onClick: function(){ setTypeFilter(val); },
      style: { padding:'5px 10px', borderRadius:100, border:'1px solid ' + (aan ? C.aqua : '#D8E8EF'), background: aan ? C.aqua : '#fff', color: aan ? '#fff' : C.night, cursor:'pointer', fontSize:11, fontWeight:600, fontFamily:'inherit', marginRight:4 }
    }, lbl);
  }

  return React.createElement('div', null,
    window._FilterBar ? React.createElement(window._FilterBar, { key: 'krfb' }) : null,
    React.createElement('div', { style: SS.pT }, '📥 Adviezen-inbox'),
    React.createElement('div', { style: SS.pD }, 'Laatste controle voor bestellingen & menu-wijzigingen worden doorgezet'),
    React.createElement('div', { style:{marginBottom:12} },
      filterBtn('in_review', '⏳ In review', tellers.in_review),
      filterBtn('goedgekeurd', '✓ Goedgekeurd'),
      filterBtn('afgewezen', '✗ Afgewezen'),
      filterBtn('uitgevoerd', '🚀 Uitgevoerd'),
      filterBtn('alle', 'Alle')
    ),
    React.createElement('div', { style:{marginBottom:14,display:'flex',alignItems:'center',flexWrap:'wrap'} },
      React.createElement('span', { style:{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:1,textTransform:'uppercase',marginRight:8} }, 'Type:'),
      typeBtn('alle', 'Alle'), typeBtn('sligro_bestelling', '🛒 Bestellingen'), typeBtn('menu_wijziging', '🍽️ Menu'), typeBtn('inspiratie', '✨ Inspiratie'), typeBtn('overig', '📌 Overig')
    ),
    laden ? React.createElement('div', { style:{padding:30,textAlign:'center',color:C.muted} }, '⏳ Adviezen laden...') :
    adviezen.length === 0 ? React.createElement('div', { style:{background:C.white,borderRadius:10,padding:40,textAlign:'center',color:C.muted,fontStyle:'italic'} }, 'Geen adviezen met deze filters') :
    React.createElement('div', null,
      adviezen.map(function(a) {
        var overDeadline = a.deadline && new Date(a.deadline) < new Date() && a.status === 'in_review';
        return React.createElement('div', {
          key: a.id,
          onClick: function(){ setDetail(a); setNotitie(''); },
          style: { background:C.white, borderRadius:10, padding:'14px 18px', marginBottom:8, cursor:'pointer', border: overDeadline ? '2px solid ' + C.hot : '1px solid #E8EEF2', transition:'transform .1s' }
        },
          React.createElement('div', { style:{display:'flex',alignItems:'center',gap:8,marginBottom:6,flexWrap:'wrap'} },
            React.createElement('span', { style:{fontSize:11,color:C.aqua,fontWeight:700} }, typeLabel(a.type)),
            prioBadge(a.prioriteit),
            statusBadge(a.status),
            a.outlet_code && React.createElement('span', { style:{fontSize:10,color:C.muted,marginLeft:'auto'} }, a.outlet_code === 'west' ? '🔵 West' : a.outlet_code === 'weesp' ? '🟢 Weesp' : '🏢 ' + a.outlet_code)
          ),
          React.createElement('div', { style:{fontSize:15,fontWeight:700,color:C.night,marginBottom:4} }, a.titel),
          a.samenvatting && React.createElement('div', { style:{fontSize:12,color:C.muted,lineHeight:1.4} }, a.samenvatting),
          React.createElement('div', { style:{fontSize:10,color:C.muted,marginTop:8,display:'flex',gap:10,flexWrap:'wrap'} },
            React.createElement('span', null, 'aangemaakt ' + fmtDatum(a.aangemaakt_op) + (a.aangemaakt_door ? ' door ' + a.aangemaakt_door : '')),
            a.goedgekeurd_op && React.createElement('span', { style:{color:C.green,fontWeight:700} }, '✓ ' + a.goedgekeurd_door_naam + ' ' + fmtDatum(a.goedgekeurd_op)),
            a.afgewezen_op && React.createElement('span', { style:{color:C.hot,fontWeight:700} }, '✗ ' + a.afgewezen_door_naam + ' ' + fmtDatum(a.afgewezen_op)),
            overDeadline && React.createElement('span', { style:{color:C.hot,fontWeight:700} }, '⚠ Deadline verstreken')
          )
        );
      })
    ),
    // Detail modal
    detail && React.createElement('div', {
      style:{position:'fixed',inset:0,background:'rgba(35,71,86,.85)',zIndex:9998,display:'flex',alignItems:'center',justifyContent:'center',padding:20},
      onClick: function(){ setDetail(null); setNotitie(''); }
    },
      React.createElement('div', {
        onClick: function(e){ e.stopPropagation(); },
        style:{background:C.white,borderRadius:14,maxWidth:720,width:'100%',maxHeight:'90vh',overflow:'auto',padding:0,display:'flex',flexDirection:'column'}
      },
        React.createElement('div', { style:{background:C.night,color:C.white,padding:'16px 20px',borderRadius:'14px 14px 0 0',display:'flex',alignItems:'center',gap:10} },
          React.createElement('div', { style:{flex:1} },
            React.createElement('div', { style:{fontSize:11,opacity:.8} }, typeLabel(detail.type)),
            React.createElement('div', { style:{fontSize:17,fontWeight:900,marginTop:2} }, detail.titel)
          ),
          React.createElement('button', {
            onClick: function(){ setDetail(null); setNotitie(''); },
            style:{background:'rgba(255,255,255,.15)',color:C.white,border:'none',borderRadius:100,width:32,height:32,fontSize:18,cursor:'pointer',fontWeight:700,fontFamily:'inherit'}
          }, '×')
        ),
        React.createElement('div', { style:{padding:20} },
          React.createElement('div', { style:{marginBottom:14,display:'flex',gap:6,flexWrap:'wrap'} }, statusBadge(detail.status), prioBadge(detail.prioriteit)),
          detail.samenvatting && React.createElement('div', { style:{fontSize:13,color:C.night,lineHeight:1.5,marginBottom:14} }, detail.samenvatting),
          detail.details_json && Object.keys(detail.details_json || {}).length > 0 && React.createElement('details', { style:{marginBottom:14,background:'#F8FAFC',borderRadius:8,padding:10} },
            React.createElement('summary', { style:{cursor:'pointer',fontSize:11,fontWeight:700,color:C.muted,letterSpacing:.5,textTransform:'uppercase'} }, 'Details (JSON)'),
            React.createElement('pre', { style:{fontSize:11,color:C.night,marginTop:8,whiteSpace:'pre-wrap',wordBreak:'break-all'} }, JSON.stringify(detail.details_json, null, 2))
          ),
          (detail.goedgekeurd_op || detail.afgewezen_op) && React.createElement('div', { style:{background:'#F0F4F7',borderRadius:8,padding:10,marginBottom:14,fontSize:12} },
            detail.goedgekeurd_op && React.createElement('div', null, React.createElement('strong', { style:{color:C.green} }, '✓ Goedgekeurd'), ' door ', detail.goedgekeurd_door_naam, ' op ', fmtDatum(detail.goedgekeurd_op), detail.goedgekeurd_notitie && React.createElement('div', { style:{marginTop:4,fontStyle:'italic'} }, '“' + detail.goedgekeurd_notitie + '”')),
            detail.afgewezen_op && React.createElement('div', null, React.createElement('strong', { style:{color:C.hot} }, '✗ Afgewezen'), ' door ', detail.afgewezen_door_naam, ' op ', fmtDatum(detail.afgewezen_op), detail.afgewezen_reden && React.createElement('div', { style:{marginTop:4,fontStyle:'italic'} }, '“' + detail.afgewezen_reden + '”'))
          ),
          detail.uitgevoerd_op && React.createElement('div', { style:{background:'#E3F2FD',borderRadius:8,padding:10,marginBottom:14,fontSize:12,color:'#1565C0'} }, React.createElement('strong', null, '🚀 Uitgevoerd '), fmtDatum(detail.uitgevoerd_op), detail.uitgevoerd_resultaat && ' · ' + detail.uitgevoerd_resultaat),
          detail.status === 'in_review' && React.createElement('div', { style:{marginTop:10} },
            React.createElement('label', { style:{fontSize:11,fontWeight:700,color:C.muted,textTransform:'uppercase',letterSpacing:.5,display:'block',marginBottom:4} }, 'Notitie (optioneel bij goedkeuren, verplicht bij afwijzen)'),
            React.createElement('textarea', {
              value: notitie,
              onChange: function(e){ setNotitie(e.target.value); },
              placeholder: 'Bijv. "Akkoord" of reden voor afwijzing',
              style:{width:'100%',padding:10,border:'1px solid #D8E8EF',borderRadius:8,fontSize:13,minHeight:60,fontFamily:'inherit',boxSizing:'border-box',resize:'vertical'}
            })
          ),
          React.createElement('div', { style:{display:'flex',gap:8,marginTop:16,flexWrap:'wrap'} },
            detail.status === 'in_review' && React.createElement('button', {
              onClick: function(){ goedkeuren(detail); },
              disabled: actieBezig,
              style:{background:C.green,color:C.white,border:'none',borderRadius:8,padding:'11px 20px',fontWeight:800,fontSize:14,cursor:'pointer',fontFamily:'inherit',flex:1,minWidth:150,opacity: actieBezig ? .5 : 1}
            }, '✓ Goedkeuren'),
            detail.status === 'in_review' && React.createElement('button', {
              onClick: function(){ afwijzen(detail); },
              disabled: actieBezig,
              style:{background:C.hot,color:C.white,border:'none',borderRadius:8,padding:'11px 20px',fontWeight:800,fontSize:14,cursor:'pointer',fontFamily:'inherit',flex:1,minWidth:150,opacity: actieBezig ? .5 : 1}
            }, '✗ Afwijzen'),
            detail.status === 'goedgekeurd' && React.createElement('button', {
              onClick: function(){ markeerUitgevoerd(detail); },
              disabled: actieBezig,
              style:{background:'#1565C0',color:C.white,border:'none',borderRadius:8,padding:'11px 20px',fontWeight:800,fontSize:14,cursor:'pointer',fontFamily:'inherit',flex:1,minWidth:150}
            }, '🚀 Markeer als uitgevoerd'),
            (detail.status === 'goedgekeurd' || detail.status === 'afgewezen') && React.createElement('button', {
              onClick: function(){ heropenen(detail); },
              disabled: actieBezig,
              style:{background:'#fff',color:C.muted,border:'1px solid #D8E8EF',borderRadius:8,padding:'11px 16px',fontWeight:700,fontSize:13,cursor:'pointer',fontFamily:'inherit'}
            }, '↺ Heropen')
          ),
          mijnNaam && React.createElement('div', { style:{fontSize:10,color:C.muted,marginTop:10,textAlign:'right',fontStyle:'italic'} }, 'Ingelogd als ' + mijnNaam)
        )
      )
    )
  );
}

  window._AdviezenScreen = AdviezenScreen;
})();


// ===== algemeen-tab.js (11350 bytes) =====
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


// ===== allergenen-screen.js (2927 bytes) =====
// KitchenRobot module: allergenen-screen.js
// Geextraheerd uit index.html op 2026-05-05T10:08:25.673Z (v9 AST-walk)
// Bevat: AllergenenScreen
// Externe refs (via window._): AllergenenOverzichtTab
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function AllergenenScreen() {
  var [gerechten, setGerechten] = useState(window._stamGerechten || []);
  var [sligro, setSligro] = useState(window._stamSligro || []);
  var [productgroepen, setProductgroepen] = useState(window._stamProductgroepen || []);
  var [laden, setLaden] = useState(false);
  useEffect(function() {
    if (window._stamGerechten && window._stamGerechten.length > 0 && window._stamSligro && window._stamSligro.length > 0) {
      setGerechten(window._stamGerechten);
      setSligro(window._stamSligro);
      setProductgroepen(window._stamProductgroepen || []);
      return;
    }
    setLaden(true);
    Promise.all([
      window._supa.from("productgroepen").select("*, productsoorten(*)").order("volgorde"),
      window._supa.from("gerechten").select("*, ingredienten(*), gerecht_productsoort_koppelingen(productsoort_id)").order("naam"),
      window._supa.from("sligro_producten").select("*, sligro_productgroep_koppelingen(productgroep_id)").order("naam")
    ]).then(function(results) {
      var pgData = (results[0].data || []).map(function(pg) {
        return Object.assign({}, pg, { soorten: (pg.productsoorten || []).map(function(ps) {
          return { id: ps.id, code: ps.code, naam: ps.naam };
        }) });
      });
      var slData = (results[2].data || []).map(function(p) {
        var kops = (p.sligro_productgroep_koppelingen || []).map(function(k) {
          return k.productgroep_id;
        });
        return Object.assign({}, p, { pgIds: kops.length ? kops : p.productgroep_id ? [p.productgroep_id] : [], hoev: p.hoeveelheid, eenh: p.eenheid, prijs: p.prijs_excl });
      });
      setProductgroepen(pgData);
      setGerechten(results[1].data || []);
      setSligro(slData);
      window._stamProductgroepen = pgData;
      window._stamGerechten = results[1].data || [];
      window._stamSligro = slData;
      setLaden(false);
    });
  }, []);
  if (laden) {
    return /* @__PURE__ */ React.createElement("div", { style: { padding: 40, textAlign: "center", color: C.muted } }, "Allergenendata laden...");
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.pT }, "🏷 Allergenen"), /* @__PURE__ */ React.createElement("div", { style: SS.pD }, "Overzicht per productsoort — gerechten en Sligro producten"), /* @__PURE__ */ React.createElement(window._AllergenenOverzichtTab, { gerechten, sligro, productgroepen }));
}

  window._AllergenenScreen = AllergenenScreen;
})();


// ===== api-koppelingen-screen.js (19716 bytes) =====
// KitchenRobot module: api-koppelingen-screen.js
// Geextraheerd uit index.html op 2026-05-05T10:13:58.578Z (v9 AST-walk)
// Bevat: ApiKoppelingenScreen
// Externe refs (via window._): (geen)
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function ApiKoppelingenScreen() {
  var C = window._C || { night:'#234756', aqua:'#3FB8C4', hot:'#E8202B', green:'#2E7D32', muted:'#78909C', white:'#fff', orange:'#FF9800' };
  var SS = window._SS || { pT: { fontSize:22, fontWeight:900, color:'#234756', marginBottom:4 }, pD: { fontSize:12, color:'#78909C', marginBottom:16 } };
  var FN_URL = 'https://aezatnwsrhlwtykpixsq.supabase.co/functions/v1/api-koppelingen';
  // Helper: bouw fetch options met auth-headers (vereist door v2)
  async function authHeaders() {
    var s = await window._supa.auth.getSession();
    var jwt = s && s.data && s.data.session && s.data.session.access_token;
    return {
      'Authorization': 'Bearer ' + jwt,
      'apikey': window._supa.supabaseKey,
      'Content-Type': 'application/json'
    };
  }
  function fetchAuth(url, opts) {
    return authHeaders().then(function(h) {
      var o = opts || {};
      o.headers = Object.assign({}, h, o.headers || {});
      return fetch(url, o);
    });
  }

  // Voorgedefinieerde koppelingen met hun velden-schema
  var VOORGEDEFINIEERD = [
    { naam: 'recras', titel: 'Recras Boekingen',
      beschrijving: 'Boekingen, menus en arrangementen read-only uit Recras. Alleen boekingsnamen/bedrijfsnamen, geen contactinfo (AVG).',
      url_default: 'https://upevents.recras.nl', url_label: 'Recras URL',
      velden: [ { naam:'token', label:'API Token', type:'password',
        hint:'Genereer via: Menu → Nieuw Personeel "KitchenRobot" → tab Gebruiker → rol "Info voor planning kosten" → Nieuwe API-sleutel.' } ] },
    { naam: 'switchbot', titel: 'SwitchBot Sensoren',
      beschrijving: 'Koel- en vriesapparatuur temperatuursensoren via SwitchBot Cloud API.',
      url_default: 'https://api.switch-bot.com', url_label: 'API URL (standaard: SwitchBot Cloud)',
      velden: [
        { naam:'token', label:'Token', type:'password', hint:'SwitchBot app: Profile → Preference → tik 10x op App Version → Developer Options → Get Token.' },
        { naam:'secret', label:'Secret', type:'password', hint:'Zelfde Developer Options scherm, onder de token.' }
      ] },
    { naam: 'sligro', titel: 'Sligro B2B',
      beschrijving: 'Productprijzen en voorraad uit Sligro B2B portaal. Nog niet actief (wacht op Sligro API-toegang).',
      url_default: 'https://api.sligro.nl', url_label: 'API URL',
      velden: [ { naam:'api_key', label:'API Key', type:'password', hint:'Van Sligro account manager.' } ] }
  ];

  var [koppelingen, setKoppelingen] = React.useState([]);
  var [log, setLog] = React.useState([]);
  var [laden, setLaden] = React.useState(true);
  var [melding, setMelding] = React.useState(null);
  var [modal, setModal] = React.useState(null); // { voorgedefinieerd, bestaand }
  var [modalWaarden, setModalWaarden] = React.useState({});
  var [modalBezig, setModalBezig] = React.useState(false);
  var [testBezig, setTestBezig] = React.useState({});
  var [testResult, setTestResult] = React.useState({});
  var [logFilter, setLogFilter] = React.useState('');

  function toon(t, ok) {
    setMelding({ tekst: t, ok: ok !== false });
    setTimeout(function(){ setMelding(null); }, 4000);
  }

  function laad() {
    setLaden(true);
    Promise.all([
      fetchAuth(FN_URL + '?actie=lijst').then(function(r){ return r.json(); }),
      fetchAuth(FN_URL + '?actie=log').then(function(r){ return r.json(); })
    ]).then(function(res) {
      setKoppelingen((res[0] && res[0].koppelingen) || []);
      setLog((res[1] && res[1].log) || []);
      setLaden(false);
    }).catch(function(e) { setLaden(false); toon('Laden mislukt: ' + e.message, false); });
  }
  React.useEffect(laad, []);

  function openModal(voorged, bestaand) {
    var init = {};
    (voorged.velden || []).forEach(function(v){ init[v.naam] = ''; });
    setModalWaarden(init);
    setModal({ voorgedefinieerd: voorged, bestaand: bestaand || null, url: (bestaand && bestaand.url) || voorged.url_default });
  }

  function slaOp() {
    if (!modal) return;
    var v = modal.voorgedefinieerd;
    var ontbrekend = (v.velden||[]).filter(function(f){ return !modalWaarden[f.naam] || !modalWaarden[f.naam].trim(); });
    if (ontbrekend.length > 0) { toon('Alle velden invullen: ' + ontbrekend.map(function(x){ return x.label; }).join(', '), false); return; }
    setModalBezig(true);
    var payload = {
      koppeling_naam: v.naam, titel: v.titel, beschrijving: v.beschrijving,
      url: modal.url || v.url_default,
      credentials: modalWaarden,
      velden_schema: v.velden
    };
    fetchAuth(FN_URL + '?actie=opslaan', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      .then(function(r){ return r.json(); })
      .then(function(d) {
        setModalBezig(false);
        if (d.ok) { toon('✓ ' + v.titel + ' opgeslagen (versleuteld)'); setModal(null); laad(); }
        else toon('Fout: ' + (d.error || 'onbekend'), false);
      }).catch(function(e){ setModalBezig(false); toon('Fout: ' + e.message, false); });
  }

  function testKoppeling(naam) {
    setTestBezig(function(p){ var n={}; Object.keys(p).forEach(function(k){n[k]=p[k];}); n[naam]=true; return n; });
    setTestResult(function(p){ var n={}; Object.keys(p).forEach(function(k){n[k]=p[k];}); n[naam]=null; return n; });
    fetchAuth(FN_URL + '?actie=test', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ koppeling_naam: naam }) })
      .then(function(r){ return r.json(); })
      .then(function(d) {
        setTestBezig(function(p){ var n={}; Object.keys(p).forEach(function(k){n[k]=p[k];}); n[naam]=false; return n; });
        setTestResult(function(p){ var n={}; Object.keys(p).forEach(function(k){n[k]=p[k];}); n[naam]=d; return n; });
        laad();
      }).catch(function(e){
        setTestBezig(function(p){ var n={}; Object.keys(p).forEach(function(k){n[k]=p[k];}); n[naam]=false; return n; });
        setTestResult(function(p){ var n={}; Object.keys(p).forEach(function(k){n[k]=p[k];}); n[naam]={ ok:false, fout:e.message }; return n; });
      });
  }

  function zetActief(naam, actief) {
    fetchAuth(FN_URL + '?actie=zet_actief', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ koppeling_naam: naam, actief: actief }) })
      .then(function(r){ return r.json(); }).then(function(d){ if (d.ok) { toon(actief ? '▶ Geactiveerd' : '⏸ Gepauzeerd'); laad(); } else toon('Fout: ' + (d.error || ''), false); });
  }

  function verwijderKopp(naam) {
    if (!confirm('Weet je zeker dat je koppeling "' + naam + '" wilt verwijderen?\nDe API-key wordt uit de versleutelde opslag verwijderd. Dit kan niet ongedaan.')) return;
    fetchAuth(FN_URL + '?actie=verwijder', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ koppeling_naam: naam }) })
      .then(function(r){ return r.json(); }).then(function(d){ if (d.ok) { toon('🗑 Verwijderd'); laad(); } else toon('Fout: ' + (d.error || ''), false); });
  }

  function tijdKort(ts) {
    if (!ts) return '—';
    var d = new Date(ts);
    var nu = new Date();
    var verschil = Math.floor((nu - d) / 1000);
    if (verschil < 60) return verschil + 's geleden';
    if (verschil < 3600) return Math.floor(verschil/60) + 'm geleden';
    if (verschil < 86400) return Math.floor(verschil/3600) + 'u geleden';
    return d.toLocaleDateString('nl-NL', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
  }

  // Combineer voorgedefinieerd met actuele DB-status
  var items = VOORGEDEFINIEERD.map(function(v) {
    var bestaand = koppelingen.find(function(k){ return k.koppeling_naam === v.naam; });
    return { voorgedefinieerd: v, bestaand: bestaand };
  });

  var btnP = { background:C.aqua, color:C.white, border:'none', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:700, cursor:'pointer' };
  var btnSG = { background:'#F5F5F5', color:C.night, border:'1px solid #DDD', borderRadius:8, padding:'6px 12px', fontSize:11, fontWeight:700, cursor:'pointer' };
  var btnDanger = Object.assign({}, btnSG, { color:C.hot, border:'1px solid ' + C.hot + '44' });
  var card = { background:C.white, borderRadius:14, padding:18, marginBottom:14, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' };

  return React.createElement('div', null,
    React.createElement('div', { style: SS.pT }, '🔐 API-koppelingen'),
    React.createElement('div', { style: SS.pD }, 'Beheer van versleutelde API-sleutels voor externe systemen. Sleutels zijn versleuteld opgeslagen (Supabase Vault) en niet leesbaar vanuit deze UI — alleen vervangbaar.'),

    melding && React.createElement('div', { style: { padding:'10px 14px', borderRadius:10, marginBottom:14, background: melding.ok ? '#E8F5E9' : '#FFEBEE', color: melding.ok ? C.green : C.hot, fontWeight:700, fontSize:12 } }, melding.tekst),

    // Security-uitleg
    React.createElement('div', { style: { background:'#E3F2FD', border:'1px solid #90CAF9', borderRadius:12, padding:'12px 16px', marginBottom:18, fontSize:12, color:'#0D47A1', lineHeight:1.5 } },
      React.createElement('div', { style: { fontWeight:800, marginBottom:4 } }, '🛡️ Dubbele beveiliging'),
      React.createElement('div', null, 'Sleutels worden versleuteld opgeslagen met Supabase Vault (pgsodium AES-GCM). De versleutelingssleutel staat buiten de database. Alleen server-side edge functions kunnen ontsleutelen — de browser en deze UI zien nooit de ruwe waarde.')
    ),

    // Lijst
    laden ? React.createElement('div', { style: { padding:40, textAlign:'center', color:C.muted } }, 'Laden...')
    : items.map(function(it) {
      var v = it.voorgedefinieerd, b = it.bestaand;
      var actief = b && b.actief;
      var testSt = b && b.laatste_test_status || 'nooit';
      var tr = testResult[v.naam];
      return React.createElement('div', { key: v.naam, style: card },
        // Header
        React.createElement('div', { style: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, marginBottom:8 } },
          React.createElement('div', { style: { flex:1 } },
            React.createElement('div', { style: { display:'flex', alignItems:'center', gap:8, marginBottom:2 } },
              React.createElement('div', { style: { fontSize:16, fontWeight:900, color:C.night } }, v.titel),
              b && React.createElement('span', { style: { background: actief ? '#E8F5E9' : '#FFF3E0', color: actief ? C.green : C.orange, fontSize:10, fontWeight:800, padding:'2px 8px', borderRadius:6, border:'1px solid ' + (actief ? C.green : C.orange) + '44' } }, actief ? '▶ Actief' : '⏸ Gepauzeerd'),
              b && testSt !== 'nooit' && React.createElement('span', { style: { background: testSt === 'ok' ? '#E8F5E9' : '#FFEBEE', color: testSt === 'ok' ? C.green : C.hot, fontSize:10, fontWeight:800, padding:'2px 8px', borderRadius:6 } }, 'Laatste test: ' + (testSt === 'ok' ? '✓' : '✗') + ' ' + tijdKort(b.laatste_test_op))
            ),
            React.createElement('div', { style: { fontSize:12, color:C.muted, marginBottom:4 } }, v.beschrijving),
            b && b.url && React.createElement('div', { style: { fontSize:11, color:C.aqua, fontFamily:'monospace' } }, b.url)
          ),
          !b
            ? React.createElement('button', { style: btnP, onClick: function(){ openModal(v); } }, '+ Instellen')
            : React.createElement('div', { style: { display:'flex', gap:6, flexWrap:'wrap' } },
                React.createElement('button', { style: btnSG, onClick: function(){ testKoppeling(v.naam); }, disabled: !!testBezig[v.naam] },
                  testBezig[v.naam] ? '⏳ Test...' : '🔌 Test'),
                React.createElement('button', { style: btnSG, onClick: function(){ zetActief(v.naam, !actief); } }, actief ? '⏸ Pauzeer' : '▶ Activeer'),
                React.createElement('button', { style: btnSG, onClick: function(){ openModal(v, b); } }, '✏️ Wijzig'),
                React.createElement('button', { style: btnDanger, onClick: function(){ verwijderKopp(v.naam); } }, '🗑')
              )
        ),
        // Test-resultaat
        tr && React.createElement('div', { style: { marginTop:10, padding:'10px 12px', borderRadius:8, background: tr.ok ? '#E8F5E9' : '#FFEBEE', fontSize:12, color: tr.ok ? C.green : C.hot } },
          tr.ok ? ('✓ Verbinding werkt. ' + JSON.stringify(tr.info)) : ('✗ ' + (tr.fout || JSON.stringify(tr.info || {})))),
        // Fout-detail
        b && b.laatste_test_fout && React.createElement('div', { style: { marginTop:6, fontSize:11, color:C.hot, background:'#FFF3F3', padding:'6px 10px', borderRadius:6 } }, 'Laatste fout: ' + b.laatste_test_fout),
        // Status details onderaan
        b && React.createElement('div', { style: { display:'flex', gap:14, marginTop:10, paddingTop:10, borderTop:'1px solid #EEE', fontSize:11, color:C.muted } },
          React.createElement('div', null, 'Laatste sync: ', React.createElement('b', { style: { color: C.night } }, tijdKort(b.laatste_sync_op))),
          React.createElement('div', null, 'Ingesteld: ', React.createElement('b', { style: { color: C.night } }, tijdKort(b.ingesteld_op))),
          React.createElement('div', null, 'Bijgewerkt: ', React.createElement('b', { style: { color: C.night } }, tijdKort(b.bijgewerkt_op)))
        )
      );
    }),

    // Log viewer
    React.createElement('div', { style: Object.assign({}, card, { marginTop:24 }) },
      React.createElement('div', { style: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 } },
        React.createElement('div', { style: { fontSize:14, fontWeight:800, color:C.night } }, '📋 Audit log (laatste 50)'),
        React.createElement('div', { style: { display:'flex', gap:8, alignItems:'center' } },
          React.createElement('select', { value: logFilter, onChange: function(e){ setLogFilter(e.target.value); }, style: { padding:'4px 8px', borderRadius:6, border:'1px solid #DDD', fontSize:11 } },
            React.createElement('option', { value:'' }, 'Alle koppelingen'),
            VOORGEDEFINIEERD.map(function(v){ return React.createElement('option', { key: v.naam, value: v.naam }, v.titel); })
          ),
          React.createElement('button', { style: btnSG, onClick: laad }, '↻ Herlaad')
        )
      ),
      React.createElement('div', { style: { maxHeight: 400, overflowY: 'auto' } },
        React.createElement('table', { className:'kr-table', style: { width:'100%', borderCollapse:'collapse', fontSize:11 } },
          React.createElement('thead', null,
            React.createElement('tr', null,
              ['Tijdstip','Koppeling','Actie','Status','Details'].map(function(h){ return React.createElement('th', { key: h, style: { background:C.night, color:C.white, padding:'8px 10px', textAlign:'left', fontWeight:700, position:'sticky', top:0 } }, h); })
            )
          ),
          React.createElement('tbody', null,
            log.filter(function(l){ return !logFilter || l.koppeling_naam === logFilter; }).map(function(l){
              return React.createElement('tr', { key: l.id, style: { borderBottom:'1px solid #EEE' } },
                React.createElement('td', { style: { padding:'6px 10px', fontFamily:'monospace' } }, tijdKort(l.aangemaakt_op)),
                React.createElement('td', { style: { padding:'6px 10px', fontWeight:700 } }, l.koppeling_naam),
                React.createElement('td', { style: { padding:'6px 10px' } }, l.actie),
                React.createElement('td', { style: { padding:'6px 10px', color: l.succes ? C.green : C.hot, fontWeight:700 } }, l.succes ? '✓' : '✗'),
                React.createElement('td', { style: { padding:'6px 10px', color:C.muted, fontSize:10, maxWidth:400, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' } }, l.details ? JSON.stringify(l.details) : '—')
              );
            }),
            log.length === 0 && React.createElement('tr', null, React.createElement('td', { colSpan:5, style: { padding:20, textAlign:'center', color:C.muted } }, 'Geen log-entries'))
          )
        )
      )
    ),

    // Modal
    modal && React.createElement('div', { style: { position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }, onClick: function(){ if (!modalBezig) setModal(null); } },
      React.createElement('div', { style: { background:C.white, borderRadius:14, padding:24, width:'90%', maxWidth:560, boxShadow:'0 12px 48px rgba(0,0,0,.3)' }, onClick: function(e){ e.stopPropagation(); } },
        React.createElement('div', { style: { fontSize:18, fontWeight:900, color:C.night, marginBottom:4 } }, (modal.bestaand ? '✏️ Wijzig ' : '+ Instellen ') + modal.voorgedefinieerd.titel),
        React.createElement('div', { style: { fontSize:12, color:C.muted, marginBottom:18 } }, modal.voorgedefinieerd.beschrijving),

        modal.bestaand && React.createElement('div', { style: { background:'#FFF3E0', border:'1px solid #FFB74D', borderRadius:8, padding:'8px 12px', fontSize:12, color:'#E65100', marginBottom:12 } },
          '⚠️ Je overschrijft de bestaande sleutel. De oude is daarna definitief weg.'),

        // URL veld
        React.createElement('div', { style: { marginBottom: 14 } },
          React.createElement('label', { style: { fontSize:11, fontWeight:700, color:C.night, display:'block', marginBottom:4 } }, modal.voorgedefinieerd.url_label),
          React.createElement('input', { type:'text', value: modal.url || '', onChange: function(e){ setModal(Object.assign({}, modal, { url: e.target.value })); },
            style: { width:'100%', padding:'8px 12px', border:'1px solid #DDD', borderRadius:8, fontSize:13, fontFamily:'monospace', boxSizing:'border-box' } })
        ),

        // Credential velden
        modal.voorgedefinieerd.velden.map(function(f) {
          return React.createElement('div', { key: f.naam, style: { marginBottom: 14 } },
            React.createElement('label', { style: { fontSize:11, fontWeight:700, color:C.night, display:'block', marginBottom:4 } }, f.label),
            React.createElement('input', {
              type: f.type || 'text',
              autoComplete: 'off',
              value: modalWaarden[f.naam] || '',
              onChange: function(e){ var nw = {}; Object.keys(modalWaarden).forEach(function(k){ nw[k] = modalWaarden[k]; }); nw[f.naam] = e.target.value; setModalWaarden(nw); },
              style: { width:'100%', padding:'8px 12px', border:'1px solid #DDD', borderRadius:8, fontSize:13, fontFamily:'monospace', boxSizing:'border-box' }
            }),
            f.hint && React.createElement('div', { style: { fontSize:10, color:C.muted, marginTop:4, lineHeight:1.4 } }, f.hint)
          );
        }),

        React.createElement('div', { style: { display:'flex', gap:8, justifyContent:'flex-end', marginTop:8 } },
          React.createElement('button', { style: btnSG, onClick: function(){ setModal(null); }, disabled: modalBezig }, 'Annuleer'),
          React.createElement('button', { style: Object.assign({}, btnP, { opacity: modalBezig ? 0.6 : 1 }), onClick: slaOp, disabled: modalBezig },
            modalBezig ? '⏳ Versleutelen...' : '🔒 Versleuteld opslaan')
        )
      )
    )
  );
}

  window._ApiKoppelingenScreen = ApiKoppelingenScreen;
})();


// ===== berichten-chef-screen.js (21158 bytes) =====
// KitchenRobot module: berichten-chef-screen.js
// Geextraheerd uit index.html op 2026-05-05T10:12:14.709Z (self-exposed patroon)
// Bevat: BerichtenChefScreen
(function() {
  'use strict';
  window._BerichtenChefScreen = function BerichtenChefScreen() {
    var R = React.createElement;
    var useState = React.useState, useEffect = React.useEffect;
    var SUPA = 'https://aezatnwsrhlwtykpixsq.supabase.co';
    var ANON = 'sb_publishable_qkQzUEM5fvJPSsfScEzNCg_Eug8-d4t';
    var FN = SUPA + '/functions/v1/kiosk-bericht-beheer';
  
    var s1 = useState([]); var berichten = s1[0]; var setBerichten = s1[1];
    var s2 = useState(true); var laden = s2[0]; var setLaden = s2[1];
    var s3 = useState(null); var fout = s3[0]; var setFout = s3[1];
    var s4 = useState('alle'); var filter = s4[0]; var setFilter = s4[1];
  
    var today = new Date().toISOString().slice(0, 10);
    var s5 = useState(null); var editId = s5[0]; var setEditId = s5[1];
    var s6 = useState(''); var titel = s6[0]; var setTitel = s6[1];
    var s7 = useState(''); var tekst = s7[0]; var setTekst = s7[1];
    var s8 = useState('beide'); var outlet = s8[0]; var setOutlet = s8[1];
    var s9 = useState(today); var datumVan = s9[0]; var setDatumVan = s9[1];
    var s10 = useState(today); var datumTot = s10[0]; var setDatumTot = s10[1];
    var s11 = useState('\uD83D\uDCCC'); var emoji = s11[0]; var setEmoji = s11[1];
    var s12 = useState('blauw'); var kleur = s12[0]; var setKleur = s12[1];
    var s13 = useState('normaal'); var prioriteit = s13[0]; var setPrioriteit = s13[1];
    var s14 = useState('Stefan'); var door = s14[0]; var setDoor = s14[1];
    var s15 = useState(false); var bezig = s15[0]; var setBezig = s15[1];
    var s16 = useState([]); var fotos = s16[0]; var setFotos = s16[1];
    var s17 = useState(false); var fotoUploadBezig = s17[0]; var setFotoUploadBezig = s17[1];
    var BUCKET = 'kiosk-bericht-fotos';
    var BUCKET_PREFIX = SUPA + '/storage/v1/object/public/' + BUCKET + '/';
  
    function uploadFotos(fileList) {
      if (!fileList || fileList.length === 0) return;
      if (!window._supa) { alert('Supabase client niet beschikbaar'); return; }
      setFotoUploadBezig(true);
      var files = Array.from(fileList);
      var uploads = files.map(function(file) {
        var ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g,'');
        var path = 'bericht/' + (crypto.randomUUID ? crypto.randomUUID() : (Date.now() + '-' + Math.random().toString(36).slice(2))) + '.' + ext;
        return window._supa.storage.from(BUCKET).upload(path, file, {
          contentType: file.type || 'image/jpeg', upsert: false
        }).then(function(res) {
          if (res && res.error) throw res.error;
          var pub = window._supa.storage.from(BUCKET).getPublicUrl(path);
          return pub && pub.data && pub.data.publicUrl;
        });
      });
      Promise.all(uploads).then(function(urls) {
        var schoon = urls.filter(function(u){ return !!u; });
        setFotos(function(prev){ return (prev || []).concat(schoon).slice(0, 20); });
        setFotoUploadBezig(false);
      }).catch(function(e) {
        alert('Upload fout: ' + (e && e.message ? e.message : e));
        setFotoUploadBezig(false);
      });
    }
  
    function verwijderFoto(url) {
      setFotos(function(prev){ return (prev || []).filter(function(u){ return u !== url; }); });
      // Storage-cleanup gebeurt server-side bij wijzigen/definitief_verwijderen.
    }
  
    function callApi(payload) {
      return fetch(FN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': ANON, 'Authorization': 'Bearer ' + ANON },
        body: JSON.stringify(payload)
      }).then(function (r) { return r.json(); });
    }
  
    function laad() {
      setLaden(true);
      callApi({ actie: 'lijst', outlet_code: filter }).then(function (res) {
        if (res && res.ok) { setBerichten(res.berichten || []); setFout(null); }
        else setFout((res && res.error) || 'fout');
        setLaden(false);
      }).catch(function (e) { setFout(String(e)); setLaden(false); });
    }
    useEffect(laad, [filter]);
  
    function reset() {
      setEditId(null); setTitel(''); setTekst(''); setOutlet('beide');
      setDatumVan(today); setDatumTot(today);
      setEmoji('\uD83D\uDCCC'); setKleur('blauw'); setPrioriteit('normaal');
      setFotos([]);
    }
  
    function bewerken(b) {
      setEditId(b.id); setTitel(b.titel); setTekst(b.tekst);
      setOutlet(b.outlet_code); setDatumVan(b.datum_van); setDatumTot(b.datum_tot);
      setEmoji(b.emoji || '\uD83D\uDCCC'); setKleur(b.kleur || 'blauw');
      setPrioriteit(b.prioriteit || 'normaal');
      if (b.aangemaakt_door) setDoor(b.aangemaakt_door);
      setFotos(Array.isArray(b.foto_urls) ? b.foto_urls : []);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  
    function opslaan() {
      if (!titel.trim()) { alert('Titel verplicht'); return; }
      if (!tekst.trim()) { alert('Tekst verplicht'); return; }
      if (datumTot < datumVan) { alert('Datum tot kan niet voor datum van zijn'); return; }
      setBezig(true);
      var payload = {
        titel: titel, tekst: tekst, outlet_code: outlet, datum_van: datumVan, datum_tot: datumTot,
        emoji: emoji, kleur: kleur, prioriteit: prioriteit, aangemaakt_door: door,
        foto_urls: fotos
      };
      if (editId) { payload.actie = 'wijzigen'; payload.id = editId; }
      else { payload.actie = 'aanmaken'; }
      callApi(payload).then(function (res) {
        setBezig(false);
        if (res && res.ok) { reset(); laad(); }
        else alert((res && res.error) || 'fout');
      }).catch(function (e) { setBezig(false); alert('Netwerk: ' + e); });
    }
  
    function archiveer(b) {
      if (!confirm('Bericht "' + b.titel + '" deactiveren? (Wordt niet meer getoond in de kiosk)')) return;
      callApi({ actie: 'verwijderen', id: b.id }).then(function (res) {
        if (res && res.ok) laad(); else alert((res && res.error) || 'fout');
      });
    }
  
    function reactiveer(b) {
      callApi({ actie: 'wijzigen', id: b.id, actief: true }).then(function (res) {
        if (res && res.ok) laad();
      });
    }
  
    function defDelete(b) {
      if (!confirm('Bericht "' + b.titel + '" DEFINITIEF verwijderen? Dit kan niet ongedaan gemaakt worden.')) return;
      callApi({ actie: 'definitief_verwijderen', id: b.id }).then(function (res) {
        if (res && res.ok) laad(); else alert((res && res.error) || 'fout');
      });
    }
  
    var KLEUREN = [
      { k: 'blauw', bg: 'linear-gradient(135deg,#1E40AF,#3B82F6)' },
      { k: 'groen', bg: 'linear-gradient(135deg,#15803D,#22C55E)' },
      { k: 'oranje', bg: 'linear-gradient(135deg,#C2410C,#F97316)' },
      { k: 'rood', bg: 'linear-gradient(135deg,#B91C1C,#EF4444)' },
      { k: 'paars', bg: 'linear-gradient(135deg,#6D28D9,#A855F7)' }
    ];
    var EMOJIS = ['\uD83D\uDCCC', '\uD83C\uDF89', '\u26A0\uFE0F', '\u2728', '\uD83D\uDD25', '\u2705', '\uD83D\uDCC5', '\uD83C\uDF7D\uFE0F', '\uD83D\uDD14', '\u2B50', '\u26C5', '\uD83D\uDC4B'];
  
    var INPC = { padding: '9px 12px', border: '1.5px solid #D8E8EF', borderRadius: 6, fontSize: 13, fontFamily: 'inherit', color: '#234756', background: '#fff' };
    var LBLC = { fontSize: 11, fontWeight: 700, color: '#234756', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px', display: 'block' };
  
    var huidige = KLEUREN.find(function (x) { return x.k === kleur; }) || KLEUREN[0];
  
    return R('div', { style: { padding: '8px 0' } },
      R('div', { style: { marginBottom: 18 } },
        R('h1', { style: { fontSize: 24, fontWeight: 700, color: '#002D41', margin: 0, letterSpacing: '-0.3px' } }, '\uD83D\uDCE8 Kiosk berichten'),
        R('div', { style: { fontSize: 13, color: '#7A8FA6', marginTop: 4 } }, 'Plan berichten in voor de keuken \u2014 verschijnen op de kiosk-tablet op de gekozen dagen.')
      ),
      // Form
      R('div', { style: { background: '#fff', borderRadius: 10, padding: 22, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,45,65,.06)' } },
        R('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 } },
          R('h2', { style: { fontSize: 18, fontWeight: 700, color: '#002D41', margin: 0 } }, editId ? '\u270F\uFE0F Bericht bewerken' : '\u2795 Nieuw bericht aanmaken'),
          editId && R('button', { onClick: reset, style: { background: 'transparent', border: '1px solid #D8E8EF', padding: '7px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: '#6E8591', fontFamily: 'inherit' } }, '\u00D7 Annuleren')
        ),
        R('div', { style: { padding: 14, marginBottom: 18, borderRadius: 10, background: huidige.bg, color: '#fff', display: 'flex', alignItems: 'center', gap: 14 } },
          R('div', { style: { fontSize: 28 } }, emoji),
          R('div', { style: { flex: 1, minWidth: 0 } },
            R('div', { style: { fontWeight: 800, fontSize: 14, marginBottom: 3 } }, titel || '(titel...)'),
            R('div', { style: { fontSize: 12, opacity: .92, whiteSpace: 'pre-wrap' } }, tekst || '(tekst...)')
          )
        ),
        R('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 } },
          R('div', null, R('label', { style: LBLC }, 'Titel'), R('input', { type: 'text', value: titel, onChange: function (e) { setTitel(e.target.value); }, style: Object.assign({}, INPC, { width: '100%' }), placeholder: 'Bijv. Personeelsuitje vrijdag' })),
          R('div', null, R('label', { style: LBLC }, 'Aangemaakt door'), R('input', { type: 'text', value: door, onChange: function (e) { setDoor(e.target.value); }, style: Object.assign({}, INPC, { width: '100%' }) }))
        ),
        R('div', { style: { marginBottom: 14 } }, R('label', { style: LBLC }, 'Tekst'), R('textarea', { value: tekst, onChange: function (e) { setTekst(e.target.value); }, rows: 4, style: Object.assign({}, INPC, { width: '100%', resize: 'vertical', lineHeight: 1.5 }), placeholder: 'Wat moet de keuken weten?' })),
        R('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 } },
          R('div', null, R('label', { style: LBLC }, 'Outlet'),
            R('select', { value: outlet, onChange: function (e) { setOutlet(e.target.value); }, style: Object.assign({}, INPC, { width: '100%' }) },
              R('option', { value: 'beide' }, 'Beide outlets'),
              R('option', { value: 'weesp' }, 'Alleen Weesp'),
              R('option', { value: 'west' }, 'Alleen West')
            )
          ),
          R('div', null, R('label', { style: LBLC }, 'Datum van'), R('input', { type: 'date', value: datumVan, onChange: function (e) { setDatumVan(e.target.value); }, style: Object.assign({}, INPC, { width: '100%' }) })),
          R('div', null, R('label', { style: LBLC }, 'Datum tot (incl)'), R('input', { type: 'date', value: datumTot, onChange: function (e) { setDatumTot(e.target.value); }, style: Object.assign({}, INPC, { width: '100%' }) }))
        ),
        R('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 } },
          R('div', null, R('label', { style: LBLC }, 'Kleur'),
            R('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
              KLEUREN.map(function (k) {
                return R('button', { key: k.k, onClick: function () { setKleur(k.k); }, style: { padding: '10px 14px', background: k.bg, color: '#fff', border: kleur === k.k ? '3px solid #002D41' : '2px solid transparent', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 700, textTransform: 'capitalize', fontFamily: 'inherit', minWidth: 60 } }, k.k);
              })
            )
          ),
          R('div', null, R('label', { style: LBLC }, 'Prioriteit'),
            R('select', { value: prioriteit, onChange: function (e) { setPrioriteit(e.target.value); }, style: Object.assign({}, INPC, { width: '100%' }) },
              R('option', { value: 'laag' }, 'Laag'),
              R('option', { value: 'normaal' }, 'Normaal'),
              R('option', { value: 'hoog' }, 'Hoog (boven andere)')
            )
          )
        ),
        R('div', { style: { marginBottom: 18 } }, R('label', { style: LBLC }, 'Emoji / icoon'),
          R('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } },
            EMOJIS.map(function (e) {
              return R('button', { key: e, onClick: function () { setEmoji(e); }, style: { width: 42, height: 42, border: emoji === e ? '2.5px solid #1976D2' : '1.5px solid #D8E8EF', background: emoji === e ? '#E3F2FD' : '#fff', borderRadius: 6, cursor: 'pointer', fontSize: 18, fontFamily: 'inherit' } }, e);
            })
          )
        ),
        R('div', { style: { marginBottom: 18 } },
          R('label', { style: LBLC }, 'Foto’s (optioneel) — max 20 stuks, 10MB per foto'),
          R('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' } },
            (fotos || []).map(function(url, idx) {
              return R('div', { key: url + ':' + idx,
                style: { position: 'relative', width: 86, height: 86, borderRadius: 6, overflow: 'hidden', border: '1.5px solid #D8E8EF', background: '#F5F8FA' } },
                R('img', { src: url, alt: 'foto', style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }),
                R('button', { onClick: function(){ verwijderFoto(url); }, type: 'button',
                  style: { position: 'absolute', top: 2, right: 2, width: 20, height: 20, padding: 0, border: 'none', borderRadius: '50%', background: 'rgba(198,40,40,.92)', color: '#fff', fontSize: 12, fontWeight: 800, cursor: 'pointer', lineHeight: 1, fontFamily: 'inherit' },
                  title: 'Verwijderen' }, '✕')
              );
            }),
            R('label', {
              style: { width: 86, height: 86, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '2px dashed #B6CDD8', background: fotoUploadBezig ? '#F5F8FA' : '#FFFFFF', cursor: fotoUploadBezig ? 'wait' : 'pointer', color: '#5A7383', fontSize: 11, fontWeight: 600, fontFamily: 'inherit', textAlign: 'center', gap: 2 },
              title: 'Klik om foto’s te kiezen — meerdere tegelijk mogelijk' },
              R('span', { style: { fontSize: 22, lineHeight: 1 } }, fotoUploadBezig ? '…' : '+'),
              R('span', null, fotoUploadBezig ? 'Uploaden…' : 'Foto’s'),
              R('input', { type: 'file', accept: 'image/*', multiple: true, disabled: fotoUploadBezig,
                onChange: function(e) {
                  uploadFotos(e.target.files);
                  try { e.target.value = ''; } catch(err){}
                },
                style: { display: 'none' } })
            )
          ),
          (fotos && fotos.length > 0) ? R('div', { style: { fontSize: 11, color: '#7A8FA6', marginTop: 6 } },
            fotos.length + (fotos.length === 1 ? ' foto toegevoegd' : ' foto’s toegevoegd')) : null
        ),
        R('button', { onClick: opslaan, disabled: bezig, style: { width: '100%', background: bezig ? '#D8E8EF' : '#1976D2', color: '#fff', border: 'none', padding: 14, borderRadius: 6, fontWeight: 800, fontSize: 14, cursor: bezig ? 'wait' : 'pointer', fontFamily: 'inherit' } }, bezig ? 'Bezig...' : (editId ? '\u2713 Wijzigingen opslaan' : '\u2795 Bericht aanmaken'))
      ),
      // List
      R('div', { style: { background: '#fff', borderRadius: 10, padding: 22, boxShadow: '0 1px 3px rgba(0,45,65,.06)' } },
        R('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 10, flexWrap: 'wrap' } },
          R('h2', { style: { fontSize: 18, fontWeight: 700, color: '#002D41', margin: 0 } }, '\uD83D\uDCCB Alle berichten (' + berichten.length + ')'),
          R('select', { value: filter, onChange: function (e) { setFilter(e.target.value); }, style: Object.assign({}, INPC, { width: 200 }) },
            R('option', { value: 'alle' }, 'Alle outlets'),
            R('option', { value: 'weesp' }, 'Weesp + beide'),
            R('option', { value: 'west' }, 'West + beide')
          )
        ),
        laden && R('div', { style: { padding: 30, textAlign: 'center', color: '#7A8FA6' } }, 'Laden...'),
        fout && R('div', { style: { padding: 14, background: '#FFEBEE', color: '#C62828', borderRadius: 6 } }, 'Fout: ' + fout),
        !laden && !fout && berichten.length === 0 && R('div', { style: { padding: 30, textAlign: 'center', color: '#7A8FA6' } }, 'Nog geen berichten. Maak hierboven je eerste aan.'),
        !laden && !fout && berichten.map(function (b) {
          var bKleur = KLEUREN.find(function (x) { return x.k === b.kleur; }) || KLEUREN[0];
          var nu = today;
          var actief = b.actief && b.datum_van <= nu && b.datum_tot >= nu;
          var toekomstig = b.actief && b.datum_van > nu;
          var verlopen = b.datum_tot < nu;
          var status = !b.actief ? '\uD83D\uDDD1\uFE0F gearchiveerd' : (verlopen ? '\u23F3 verlopen' : (toekomstig ? '\uD83D\uDD2E gepland' : '\u2705 actief'));
          var statusKleur = !b.actief ? '#9CA3AF' : (verlopen ? '#9CA3AF' : (toekomstig ? '#D97706' : '#16A34A'));
          return R('div', { key: b.id, style: { padding: 14, marginBottom: 10, borderRadius: 8, border: '1px solid #E1E8EB', background: actief ? '#fff' : '#FAFBFC', display: 'flex', gap: 14, alignItems: 'flex-start' } },
            R('div', { style: { padding: '10px 12px', borderRadius: 8, background: bKleur.bg, color: '#fff', fontSize: 24, minWidth: 48, textAlign: 'center', flexShrink: 0 } }, b.emoji || '\uD83D\uDCCC'),
            R('div', { style: { flex: 1, minWidth: 0 } },
              R('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' } },
                R('div', { style: { fontWeight: 700, fontSize: 14, color: '#002D41' } }, b.titel),
                R('span', { style: { fontSize: 10, color: statusKleur, fontWeight: 700, letterSpacing: '.3px' } }, status),
                b.prioriteit === 'hoog' && R('span', { style: { fontSize: 9, color: '#fff', background: '#DC2626', padding: '2px 6px', borderRadius: 3, fontWeight: 700 } }, 'HOOG'),
                R('span', { style: { fontSize: 11, color: '#7A8FA6', fontWeight: 600 } }, b.outlet_code === 'beide' ? 'Beide' : (b.outlet_code === 'weesp' ? 'Weesp' : 'West'))
              ),
              R('div', { style: { fontSize: 12, color: '#475569', whiteSpace: 'pre-wrap', marginBottom: 6 } }, b.tekst),
              R('div', { style: { fontSize: 11, color: '#7A8FA6' } },
                new Date(b.datum_van).toLocaleDateString('nl-NL', { day: '2-digit', month: 'short' }) + ' t/m ' + new Date(b.datum_tot).toLocaleDateString('nl-NL', { day: '2-digit', month: 'short' }) + (b.aangemaakt_door ? ' \u00B7 door ' + b.aangemaakt_door : '')
              ),
              (Array.isArray(b.foto_urls) && b.foto_urls.length > 0) ? R('div',
                { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 } },
                b.foto_urls.map(function(url, idx) {
                  return R('a', { key: url + ':' + idx, href: url, target: '_blank', rel: 'noopener',
                    style: { display: 'block', width: 56, height: 56, borderRadius: 5, overflow: 'hidden',
                             border: '1px solid #D8E8EF', textDecoration: 'none' },
                    title: 'Open foto in nieuw tabblad' },
                    R('img', { src: url, alt: 'foto', style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } })
                  );
                })
              ) : null
            ),
            R('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 } },
              R('button', { onClick: function () { bewerken(b); }, style: { padding: '6px 12px', background: '#1976D2', color: '#fff', border: 'none', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' } }, '\u270F\uFE0F Bewerken'),
              b.actief
                ? R('button', { onClick: function () { archiveer(b); }, style: { padding: '6px 12px', background: '#fff', color: '#7A8FA6', border: '1px solid #D8E8EF', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' } }, '\uD83D\uDDD1\uFE0F Archiveer')
                : R('button', { onClick: function () { reactiveer(b); }, style: { padding: '6px 12px', background: '#fff', color: '#16A34A', border: '1px solid #16A34A', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' } }, '\u21B6 Reactiveer'),
              R('button', { onClick: function () { defDelete(b); }, style: { padding: '6px 12px', background: '#fff', color: '#C62828', border: '1px solid #FCA5A5', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' } }, '\uD83D\uDDD1\uFE0F Verwijder')
            )
          );
        })
      )
    );
  };
  
  
})();


// ===== boekingen-screen.js (15114 bytes) =====
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


// ===== buffet-screen.js (91579 bytes) =====
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


// ===== chef-screen.js (52937 bytes) =====
// KitchenRobot module: chef-screen.js
// Geextraheerd uit index.html op 2026-05-05T12:18:33.244Z (v9 AST-walk v5)
// Bevat: ChefScreen
// Externe refs (via window._): BuffetScreen
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function ChefScreen({ setSc, setActieve }) {
  var supa = window._supa;
  var C = window._C || { night:'#234756', aqua:'#3FB8C4', hot:'#E8202B', green:'#2E7D32', muted:'#78909C', white:'#fff', orange:'#FF9800', red:'#FE424D' };
  var [tab, setTab] = React.useState('vandaag');
  var [laden, setLaden] = React.useState(true);
  var [boekingen, setBoekingen] = React.useState([]);
  var [profiel, setProfiel] = React.useState(null);
  var [goedkeuringen, setGoedkeuringen] = React.useState({});
  var [wijzigingen, setWijzigingen] = React.useState({});
  var [bbqSnapshots, setBbqSnapshots] = React.useState({});
  var [opzetSnapshots, setOpzetSnapshots] = React.useState({});
  // NIEUW: Draaiboek-links (Notion URLs per context)
  var [draaiboekLinks, setDraaiboekLinks] = React.useState([]);
  React.useEffect(function() {
    if (!supa) return;
    supa.from('draaiboek_links').select('*').then(function(r) {
      if (r && r.data) { setDraaiboekLinks(r.data); window._draaiboekLinks = r.data; }
    });
  }, []);
  function getDraaiboekUrl(contextType, idOrKey, outletCode) {
    if (!idOrKey) return null;
    var hits = draaiboekLinks.filter(function(l) {
      if (l.context_type !== contextType) return false;
      return l.context_id === idOrKey || l.context_key === idOrKey;
    });
    if (hits.length === 0) return null;
    if (outletCode) {
      var specifiek = hits.find(function(l){ return l.outlet_code === outletCode; });
      if (specifiek) return specifiek.notion_url;
    }
    var algemeen = hits.find(function(l){ return !l.outlet_code; });
    return algemeen ? algemeen.notion_url : hits[0].notion_url;
  }
  // NIEUW: toewijzingen + medewerkers
  var [toewijzingen, setToewijzingen] = React.useState({}); // { boeking_id: { medewerker_id, medewerker_naam } }
  var [medewerkers, setMedewerkers] = React.useState([]);
  React.useEffect(function() {
    if (!supa) return;
    supa.from('boeking_toewijzingen').select('*').then(function(r) {
      if (r && r.data) {
        var map = {};
        r.data.forEach(function(t){ map[t.boeking_id] = t; });
        setToewijzingen(map);
      }
    });
    supa.from('kiosk_medewerkers').select('id, naam, rol, actief, outlet_id').eq('actief', true).order('naam').then(function(r) {
      if (r && r.data) setMedewerkers(r.data);
    });
  }, []);
  function wijzToe(boekingId, boekingNaam, medewerkerId, medewerkerNaam, outletCode) {
    if (!supa) return;
    if (!medewerkerId) {
      // Leegmaken
      supa.from('boeking_toewijzingen').delete().eq('boeking_id', boekingId).then(function(){
        setToewijzingen(function(prev){ var n = Object.assign({}, prev); delete n[boekingId]; return n; });
      });
      return;
    }
    var eigenNaam = (profiel && profiel.naam) || (profiel && profiel.email) || 'chef';
    var row = {
      boeking_id: boekingId, boeking_naam: boekingNaam, outlet_code: outletCode || 'west',
      medewerker_id: medewerkerId, medewerker_naam: medewerkerNaam, aangemaakt_door_naam: eigenNaam
    };
    supa.from('boeking_toewijzingen').upsert(row, { onConflict: 'boeking_id,outlet_code' }).then(function(r){
      if (r && !r.error) {
        setToewijzingen(function(prev){ var n = Object.assign({}, prev); n[boekingId] = row; return n; });
      }
    });
  }
  // NIEUW: verborgen boekingen (localStorage-persist)
  var [verborgenIds, setVerborgenIds] = React.useState(function() {
    try { return JSON.parse(localStorage.getItem('chef_verborgen_boekingen') || '[]'); } catch(e) { return []; }
  });
  var [toonVerborgen, setToonVerborgen] = React.useState(false);
  function verbergBoeking(id) {
    var nieuw = verborgenIds.indexOf(id) >= 0 ? verborgenIds : verborgenIds.concat([id]);
    setVerborgenIds(nieuw);
    try { localStorage.setItem('chef_verborgen_boekingen', JSON.stringify(nieuw)); } catch(e){}
  }
  function herstelBoeking(id) {
    var nieuw = verborgenIds.filter(function(x){ return x !== id; });
    setVerborgenIds(nieuw);
    try { localStorage.setItem('chef_verborgen_boekingen', JSON.stringify(nieuw)); } catch(e){}
  }
  var [openBoekingId, setOpenBoekingId] = React.useState(function() {
    try {
      var stored = sessionStorage.getItem('chef_return_boekingId');
      if (stored) { sessionStorage.removeItem('chef_return_boekingId'); return stored; }
    } catch(e) {}
    return null;
  });
  // v2: scroll-positie herstellen na terug-navigatie (wacht tot boekingen geladen)
  var [chefScrollHersteld, setChefScrollHersteld] = React.useState(false);
  React.useEffect(function() {
    if (chefScrollHersteld) return;
    if (!boekingen || boekingen.length === 0) return;
    var sy = null;
    try { sy = sessionStorage.getItem('chef_return_scrollY'); } catch(e) {}
    if (!sy) { setChefScrollHersteld(true); return; }
    try { sessionStorage.removeItem('chef_return_scrollY'); } catch(e) {}
    setTimeout(function() {
      var y = parseInt(sy) || 0;
      var el = document.querySelector('.mobile-padding');
      if (el) el.scrollTop = y;
      window.scrollTo(0, y);
      setChefScrollHersteld(true);
    }, 250);
  }, [boekingen, chefScrollHersteld]);
  var [toast, setToast] = React.useState(null);
  var [openFormulier, setOpenFormulier] = React.useState(null);
  var [actieveOutlet, setActieveOutlet] = React.useState(null);
  var [autoGenereer, setAutoGenereer] = React.useState(null);
  var [autoGenereerStamKlaar, setAutoGenereerStamKlaar] = React.useState(false);

  // Check of alle stamdata geladen is (nodig voor BuffetScreen)
  React.useEffect(function() {
    function check() {
      var klaar = !!(window._recrasBoekingen && window._stamMenus && window._stamGerechten && window._stamKoppelingen && window._stamProductgroepen);
      setAutoGenereerStamKlaar(klaar);
      return klaar;
    }
    if (check()) return;
    var iv = setInterval(function() { if (check()) clearInterval(iv); }, 1000);
    return function() { clearInterval(iv); };
  }, []);

  // Effect: bij elke boekingen/snapshots update, pak volgende ontbrekende als er nog geen auto-generate bezig is
  React.useEffect(function() {
    if (!autoGenereerStamKlaar) return;
    if (!boekingen.length) return;
    if (autoGenereer) return; // al bezig
    // Zoek eerste boeking+PS zonder opzet-snapshot
    for (var i = 0; i < boekingen.length; i++) {
      var b = boekingen[i];
      var pss = productsoortenVanBoeking(b);
      for (var j = 0; j < pss.length; j++) {
        var ps = pss[j];
        var key = b.id + '::' + ps.id;
        if (!opzetSnapshots[key]) {
          setAutoGenereer({ boekingId: b.id, psId: ps.id, pgId: '', boekingNaam: b.naam, boekingTijd: b.deadline_tijd || '', boekingDag: b.deadline_dag || '' });
          return;
        }
      }
    }
  }, [boekingen, opzetSnapshots, autoGenereerStamKlaar, autoGenereer]);

  // Effect: na 3 sec van auto-generate, reload snapshots en ga verder
  React.useEffect(function() {
    if (!autoGenereer || !supa) return;
    var t = setTimeout(function() {
      supa.from('kiosk_opzet_snapshots').select('boeking_id, ps_id, ps_naam, html, updated_at').then(function(r) {
        var m = {};
        (r.data || []).forEach(function(s) {
          var k = s.boeking_id + '::' + (s.ps_id || '');
          if (!m[k] || new Date(s.updated_at) > new Date(m[k].updated_at)) m[k] = s;
        });
        setOpzetSnapshots(m);
      });
      supa.from('kiosk_bbq_snapshots').select('boeking_id, ps_id, html, updated_at').then(function(r) {
        var m = {};
        (r.data || []).forEach(function(s) {
          var k = s.boeking_id + '::' + (s.ps_id || '');
          if (!m[k] || new Date(s.updated_at) > new Date(m[k].updated_at)) m[k] = s;
        });
        setBbqSnapshots(m);
      });
      setAutoGenereer(null);
    }, 2500);
    return function() { clearTimeout(t); };
  }, [autoGenereer]);

  function toonToast(tekst) {
    setToast(tekst);
    setTimeout(function() { setToast(null); }, 2500);
  }

  React.useEffect(function() {
    if (!supa) return;
    supa.auth.getUser().then(function(r) {
      if (!r.data.user) return;
      supa.from('gebruikers_profielen').select('*').eq('id', r.data.user.id).single().then(function(p) {
        if (p.data) setProfiel(p.data);
      });
    });
  }, []);

  React.useEffect(function() {
    if (!supa) return;
    var vandaag = new Date();
    var over14 = new Date(vandaag.getTime() + 14 * 24 * 60 * 60 * 1000);
    var vanStr = vandaag.toISOString().split('T')[0];
    var totStr = over14.toISOString().split('T')[0];

    function laadAlles() {
      var query = supa.from('recras_boekingen')
        .select('*')
        .gte('deadline', vanStr)
        .lte('deadline', totStr + 'T23:59:59')
        .order('deadline');
      var gebruiktOutlet = (profiel && profiel.outlet_code && profiel.outlet_code !== 'beide') ? profiel.outlet_code : actieveOutlet;
      if (gebruiktOutlet) {
        query = query.eq('outlet_code', gebruiktOutlet);
      }
      query.then(function(r) {
        if (r.error) { setLaden(false); return; }
        var _tx = (r.data || []).map(function(_b){
          var _rr = (_b.regels || []).map(function(_r){
            var _tt = ""; if (_r.begin && typeof _r.begin === "string" && _r.begin.indexOf("T") >= 0) _tt = _r.begin.split("T")[1].substring(0,5);
            return Object.assign({}, _r, { menuNaam: _r.menuNaam || _r.product_naam || _r.beschrijving || "", starttijdTijd: _r.starttijdTijd || _tt });
          });
          return Object.assign({}, _b, { regels: _rr });
        });
        setBoekingen(_tx);
        setLaden(false);
      });

      supa.from('chef_goedkeuringen').select('*').is('ingetrokken_op', null).then(function(r) {
        var m = {};
        (r.data || []).forEach(function(g) { m[g.boeking_id + '::' + (g.productsoort_id || '')] = g; });
        setGoedkeuringen(m);
      });

      supa.from('recras_wijzigingen').select('*').is('gezien_op', null).then(function(r) {
        var m = {};
        (r.data || []).forEach(function(w) {
          if (!m[w.boeking_id] || new Date(w.ontstaan_op) > new Date(m[w.boeking_id].ontstaan_op)) m[w.boeking_id] = w;
        });
        setWijzigingen(m);
      });

      supa.from('kiosk_bbq_snapshots').select('boeking_id, ps_id, html, updated_at').then(function(r) {
        var m = {};
        (r.data || []).forEach(function(s) {
          var key = s.boeking_id + '::' + (s.ps_id || '');
          if (!m[key] || new Date(s.updated_at) > new Date(m[key].updated_at)) m[key] = s;
        });
        setBbqSnapshots(m);
      });

      supa.from('kiosk_opzet_snapshots').select('boeking_id, ps_id, ps_naam, html, updated_at').then(function(r) {
        var m = {};
        (r.data || []).forEach(function(s) {
          var key = s.boeking_id + '::' + (s.ps_id || '');
          if (!m[key] || new Date(s.updated_at) > new Date(m[key].updated_at)) m[key] = s;
        });
        setOpzetSnapshots(m);
      });
    }
    laadAlles();
    var iv = setInterval(laadAlles, 30000);
    return function() { clearInterval(iv); };
  }, [profiel, actieveOutlet]);

  function productsoortenVanBoeking(b) {
    var stamKp = window._stamKoppelingen || [];
    var stamMenus = window._stamMenus || [];
    var stamPg = window._stamProductgroepen || [];
    var stamPs = window._stamProductsoorten || [];
    var psMap = {};
    (b.regels || []).forEach(function(r) {
      if ((r.menuNaam || '').toLowerCase().includes('add up')) return;
      var zoekNaam = ((r.menuNaam || r.product_naam) || '').trim();
      if (!zoekNaam) return;
      // 1. Zoek via recras_naam in koppelingen
      var kp = stamKp.find(function(k) { return (k.recras_naam || '').trim() === zoekNaam; });
      var m = kp ? stamMenus.find(function(mm) { return mm.id === kp.menu_id; }) : null;
      // 2. Fallback: zoek direct op menu.naam
      if (!m) m = stamMenus.find(function(mm) { return (mm.naam || '').trim() === zoekNaam; });
      if (!m) return;
      var psId = m.productsoort_id || m.psId;
      if (!psId) return;
      if (!psMap[psId]) {
        // Zoek productsoort-naam + productgroep-naam
        var psNaam = '?'; var pgNaam = '';
        var ps = stamPs.find(function(p) { return p.id === psId; });
        if (ps) {
          psNaam = ps.naam;
          var pg = stamPg.find(function(g) { return g.id === ps.productgroep_id; });
          if (pg) pgNaam = pg.naam;
        } else {
          // fallback: oude nested structuur pg.soorten
          stamPg.forEach(function(pg) {
            (pg.soorten || []).forEach(function(sv) { if (sv.id === psId) { psNaam = sv.naam; pgNaam = pg.naam; } });
          });
        }
        var naamL = (psNaam || '').toLowerCase();
        var isBBQ = naamL.includes('bbq') || naamL.includes('buffet');
        psMap[psId] = { id: psId, naam: psNaam, pgNaam: pgNaam, isBBQ: isBBQ, pax: 0, starttijd: r.starttijdTijd || b.deadline_tijd || '' };
      }
      psMap[psId].pax += (r.aantal || 0);
      if (r.starttijdTijd) psMap[psId].starttijd = r.starttijdTijd;
    });
    return Object.values(psMap);
  }

  function menusVoorPsVanBoeking(b, psId) {
    var stamKp = window._stamKoppelingen || [];
    var stamMenus = window._stamMenus || [];
    var resultaat = [];
    (b.regels || []).forEach(function(r) {
      if ((r.menuNaam || '').toLowerCase().includes('add up')) return;
      var kp = stamKp.find(function(k) { return (k.recras_naam || '').trim() === (r.menuNaam || '').trim(); });
      if (!kp) return;
      var m = stamMenus.find(function(mm) { return mm.id === kp.menu_id; });
      if (!m) return;
      var mPsId = m.productsoort_id || m.psId;
      if (mPsId !== psId) return;
      resultaat.push({ naam: m.naam || r.menuNaam, aantal: r.aantal || 0 });
    });
    return resultaat;
  }

  function parseOpzetLijst(html) {
    if (!html) return [];
    try {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      var tabel = doc.querySelector('table[id^="formulier-tabel-"]');
      if (!tabel) return [];
      var rows = tabel.querySelectorAll('tbody tr');
      var result = [];
      rows.forEach(function(tr) {
        var tds = tr.querySelectorAll('td');
        if (tds.length < 4) return;
        var gerecht = (tds[0].textContent || '').trim();
        var rauw = (tds[1].textContent || '').trim();
        var opzet = (tds[2].textContent || '').trim();
        var presentatie = (tds[3].textContent || '').trim();
        if (!gerecht) return;
        // Check of dit gerecht PRIO heeft (rode badge in originele tabel)
        var hasPrio = !!tr.querySelector('[class*="prio"], [style*="254, 66, 77"], [style*="#FE424D"]');
        var isGN = !!tr.querySelector('[class*="gn-badge"]');
        result.push({ gerecht: gerecht, rauw: rauw, opzet: opzet, presentatie: presentatie, prio: hasPrio, isGN: isGN });
      });
      return result;
    } catch(e) {
      return [];
    }
  }

  function urenTotDeadline(b) {
    if (!b.deadline) return 9999;
    var nu = new Date().getTime();
    var dl = new Date(b.deadline).getTime();
    return (dl - nu) / 3600000;
  }

  function keurGoed(boekingId, ps, boekingNaam) {
    if (!supa) return;
    var naam = profiel ? profiel.naam : 'chef';
    var rec = { boeking_id: boekingId, productsoort_id: ps.id, productsoort_naam: ps.naam, type: ps.isBBQ ? 'bbq' : 'algemeen', outlet_code: profiel ? profiel.outlet_code : null, goedgekeurd_door: naam };
    supa.from('chef_goedkeuringen').insert(rec).then(function(r) {
      if (r.error) { toonToast('Fout: ' + r.error.message); return; }
      var key = boekingId + '::' + ps.id;
      setGoedkeuringen(function(prev) { var n = Object.assign({}, prev); n[key] = { boeking_id: boekingId, productsoort_id: ps.id, goedgekeurd_op: new Date().toISOString(), goedgekeurd_door: naam }; return n; });
      toonToast('✓ Chef akkoord: ' + ps.naam);
    });
  }

  function trekGoedkeuringIn(boekingId, psId) {
    if (!supa) return;
    if (!confirm('Goedkeuring intrekken?')) return;
    supa.from('chef_goedkeuringen').update({ ingetrokken_op: new Date().toISOString() }).eq('boeking_id', boekingId).eq('productsoort_id', psId).is('ingetrokken_op', null).then(function() {
      var key = boekingId + '::' + psId;
      setGoedkeuringen(function(prev) { var n = Object.assign({}, prev); delete n[key]; return n; });
      toonToast('Goedkeuring ingetrokken');
    });
  }

  function keurBoekingGoed(b) {
    var pss = productsoortenVanBoeking(b);
    if (pss.length === 0) { toonToast('Geen productsoorten'); return; }
    if (!confirm('Weet je zeker dat je de hele boeking "' + b.naam + '" wilt goedkeuren? (' + pss.length + ' productsoorten)')) return;
    var nieuweRecs = pss.filter(function(ps) { return !goedkeuringen[b.id + '::' + ps.id]; }).map(function(ps) {
      return { boeking_id: b.id, productsoort_id: ps.id, productsoort_naam: ps.naam, type: ps.isBBQ ? 'bbq' : 'algemeen', outlet_code: profiel ? profiel.outlet_code : null, goedgekeurd_door: profiel ? profiel.naam : 'chef' };
    });
    if (nieuweRecs.length === 0) { toonToast('Al alles goedgekeurd'); return; }
    supa.from('chef_goedkeuringen').insert(nieuweRecs).then(function(r) {
      if (r.error) { toonToast('Fout: ' + r.error.message); return; }
      setGoedkeuringen(function(prev) { var n = Object.assign({}, prev); nieuweRecs.forEach(function(rec) { n[rec.boeking_id + '::' + rec.productsoort_id] = rec; }); return n; });
      toonToast('✓ ' + nieuweRecs.length + ' goedkeuringen gegeven');
    });
  }

  function keurDagGoed(isoDag, bks) {
    var totaal = 0;
    bks.forEach(function(b) { totaal += productsoortenVanBoeking(b).length; });
    if (!confirm('Weet je zeker dat je ALLE productsoorten van ' + bks.length + ' boekingen op ' + isoDag + ' wilt goedkeuren? (' + totaal + ' goedkeuringen)')) return;
    var nieuweRecs = [];
    bks.forEach(function(b) {
      productsoortenVanBoeking(b).forEach(function(ps) {
        if (!goedkeuringen[b.id + '::' + ps.id]) {
          nieuweRecs.push({ boeking_id: b.id, productsoort_id: ps.id, productsoort_naam: ps.naam, type: ps.isBBQ ? 'bbq' : 'algemeen', outlet_code: profiel ? profiel.outlet_code : null, goedgekeurd_door: profiel ? profiel.naam : 'chef' });
        }
      });
    });
    if (nieuweRecs.length === 0) { toonToast('Al alles goedgekeurd'); return; }
    supa.from('chef_goedkeuringen').insert(nieuweRecs).then(function(r) {
      if (r.error) { toonToast('Fout: ' + r.error.message); return; }
      setGoedkeuringen(function(prev) { var n = Object.assign({}, prev); nieuweRecs.forEach(function(rec) { n[rec.boeking_id + '::' + rec.productsoort_id] = rec; }); return n; });
      toonToast('✓ ' + nieuweRecs.length + ' goedkeuringen gegeven');
    });
  }

  function keurAlleBBQGoed(bks) {
    var bbqRecs = [];
    bks.forEach(function(b) {
      productsoortenVanBoeking(b).forEach(function(ps) {
        if (ps.isBBQ && !goedkeuringen[b.id + '::' + ps.id]) {
          bbqRecs.push({ boeking_id: b.id, productsoort_id: ps.id, productsoort_naam: ps.naam, type: 'bbq', outlet_code: profiel ? profiel.outlet_code : null, goedgekeurd_door: profiel ? profiel.naam : 'chef' });
        }
      });
    });
    if (bbqRecs.length === 0) { toonToast('Geen open BBQ goedkeuringen'); return; }
    if (!confirm('Weet je zeker dat je alle ' + bbqRecs.length + ' BBQ/buffet goedkeuringen wilt geven?')) return;
    supa.from('chef_goedkeuringen').insert(bbqRecs).then(function(r) {
      if (r.error) { toonToast('Fout: ' + r.error.message); return; }
      setGoedkeuringen(function(prev) { var n = Object.assign({}, prev); bbqRecs.forEach(function(rec) { n[rec.boeking_id + '::' + rec.productsoort_id] = rec; }); return n; });
      toonToast('✓ ' + bbqRecs.length + ' BBQ goedkeuringen');
    });
  }

  function gaNaarBuffetformulier(b, ps) {
    // v2: generieke return met source + scroll-positie
    try {
      var el1 = document.querySelector('.mobile-padding');
      var sy1 = (el1 && el1.scrollTop) || window.scrollY || 0;
      sessionStorage.setItem('buffet_return', JSON.stringify({ source: 'chef', boekingId: b.id, scrollY: sy1, ts: Date.now() }));
    } catch(e) {}
    if (typeof setActieve === 'function') {
      // Zoek pgId op basis van psId - eerst in _stamProductsoorten (flat), dan in _stamProductgroepen (nested)
      var _pgId = '';
      try {
        var _ps = (window._stamProductsoorten || []).find(function(p){ return p.id === ps.id; });
        if (_ps && _ps.productgroep_id) _pgId = _ps.productgroep_id;
        if (!_pgId) {
          (window._stamProductgroepen || []).forEach(function(g){
            if (_pgId) return;
            if (g.soorten && g.soorten.some(function(s){ return s.id === ps.id; })) _pgId = g.id;
          });
        }
      } catch(_e) {}
      setActieve({ boekingId: b.id, psId: ps.id, pgId: _pgId, boekingNaam: b.naam, boekingTijd: b.deadline_tijd || '', boekingDag: b.deadline_dag || '' });
      setSc('buffet');
    } else {
      alert('Navigatie niet beschikbaar');
    }
  }

  function markeerWijzigingGezien(boekingId) {
    if (!supa) return;
    supa.from('recras_wijzigingen').update({ gezien_op: new Date().toISOString() }).eq('boeking_id', boekingId).is('gezien_op', null).then(function() {
      setWijzigingen(function(prev) { var n = Object.assign({}, prev); delete n[boekingId]; return n; });
    });
  }
  function trekGoedkeuringenIn(boekingId) {
    if (!supa) return;
    supa.from("chef_goedkeuringen").update({ ingetrokken_op: new Date().toISOString() }).eq("boeking_id", boekingId).is("ingetrokken_op", null).then(function(r){
      if (!r.error) { setGoedkeuringen(function(prev){ var n = {}; Object.keys(prev).forEach(function(k){ if (!k.startsWith(boekingId + "::")) n[k] = prev[k]; }); return n; }); toonToast("\u21bb Goedkeuringen ingetrokken"); }
    });
  }

  var dagMap = {};
  boekingen.forEach(function(b) {
    var dag = (b.deadline || '').split('T')[0].split(' ')[0];
    if (!dag) return;
    if (!dagMap[dag]) dagMap[dag] = [];
    dagMap[dag].push(b);
  });
  var dagen = Object.keys(dagMap).sort().map(function(d) { return { dag: d, boekingen: dagMap[d] }; });

  var vandaagIso = new Date().toISOString().split('T')[0];
  var vandaagBks = boekingen.filter(function(b) { return (b.deadline || '').split('T')[0].split(' ')[0] === vandaagIso; });
  var urgentBks = boekingen.filter(function(b) {
    var uren = urenTotDeadline(b);
    if (uren < 0 || uren > 48) return false;
    var pss = productsoortenVanBoeking(b);
    return pss.some(function(ps) { return !goedkeuringen[b.id + '::' + ps.id]; });
  });
  var bksMetWijziging = boekingen.filter(function(b) { return wijzigingen[b.id]; });

  var dnN = ['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'];
  var mnN = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
  function fmtDag(iso) {
    var d = new Date(iso + 'T00:00:00');
    var isVandaag = iso === vandaagIso;
    var isMorgen = iso === new Date(Date.now() + 86400000).toISOString().split('T')[0];
    var label = dnN[d.getDay()] + ' ' + d.getDate() + ' ' + mnN[d.getMonth()];
    if (isVandaag) label += ' — vandaag';
    if (isMorgen) label += ' — morgen';
    return label;
  }

  function renderProductsoortBlok(b, ps) {
    var g = goedkeuringen[b.id + '::' + ps.id];
    var opzetSnap = opzetSnapshots[b.id + '::' + ps.id];
    var bbqSnap = bbqSnapshots[b.id + '::' + ps.id] || bbqSnapshots[b.id + '::'];
    var iconPS = ps.isBBQ ? '🔥 ' : '';

    return React.createElement('div', {
      key: ps.id,
      style: { padding:'10px 14px', borderBottom:'1px solid #EEE', background: g ? '#F1F8E9' : 'transparent' }
    },
      // PS header
      React.createElement('div', { style:{display:'flex',alignItems:'center',gap:8,marginBottom:8,flexWrap:'wrap'} },
        React.createElement('div', { style:{flex:1,minWidth:120} },
          React.createElement('div', { style:{fontWeight:800,fontSize:13,color:C.night} }, iconPS + ps.naam),
          React.createElement('div', { style:{fontSize:11,color:C.muted,marginTop:1} }, ps.pax + ' personen · ~' + Math.ceil((ps.pax||0)/30) + ' buffet' + (Math.ceil((ps.pax||0)/30)!==1 ? 'ten' : '') + (ps.starttijd ? ' · ' + ps.starttijd : ''))
        ),
        React.createElement('button', {
          onClick: function(ev) { ev.stopPropagation(); gaNaarBuffetformulier(b, ps); },
          title: 'Aanpassen in buffetformulier',
          style:{background:'transparent',color:C.aqua,border:'1px solid ' + C.aqua,borderRadius:100,padding:'5px 12px',fontSize:11,fontWeight:700,cursor:'pointer'}
        }, '✏️ Aanpassen'),
        g ? React.createElement('button', {
          onClick: function(ev) { ev.stopPropagation(); trekGoedkeuringIn(b.id, ps.id); },
          title: 'Goedgekeurd door ' + (g.goedgekeurd_door || '?') + ' op ' + new Date(g.goedgekeurd_op).toLocaleString('nl-NL'),
          style:{background:C.green,color:'#fff',border:'none',borderRadius:100,padding:'5px 14px',fontSize:11,fontWeight:800,cursor:'pointer'}
        }, '✓ AKKOORD') : React.createElement('button', {
          onClick: function(ev) { ev.stopPropagation(); keurGoed(b.id, ps, b.naam); },
          style:{background:C.green,color:'#fff',border:'none',borderRadius:100,padding:'5px 16px',fontSize:12,fontWeight:800,cursor:'pointer'}
        }, '✓ Goedkeuren')
      ),
      // Menu-verdeling voor deze productsoort (nieuw)
      (function() {
        var mvb = menusVoorPsVanBoeking(b, ps.id);
        if (!mvb || mvb.length === 0) return null;
        return React.createElement('div', {
          style: { background: '#FFF8E1', border: '1px solid #FFE082', borderRadius: 6, padding: '6px 10px', marginTop: 6, marginBottom: 2, fontSize: 11 }
        },
          React.createElement('span', { style: { fontWeight: 700, color: C.night, marginRight: 8 } }, '📋 Menu:'),
          mvb.map(function(m, i) {
            var dbUrlM = m.id ? getDraaiboekUrl('menu', m.id, null) : null;
            return React.createElement('span', { key: i, style: { marginRight: 12, fontWeight: 600, color: C.night, display:'inline-flex', alignItems:'center', gap:4 } },
              m.aantal + '× ' + m.naam,
              dbUrlM && React.createElement('a', {
                href: dbUrlM, target: '_blank', rel: 'noopener',
                onClick: function(ev){ ev.stopPropagation(); },
                title: 'Draaiboek voor ' + m.naam,
                style:{fontSize:10,color:C.aqua,textDecoration:'none',padding:'1px 6px',border:'1px solid ' + C.aqua,borderRadius:100,fontWeight:700}
              }, '📖')
            );
          }),
          (function(){
            var dbUrlPs = getDraaiboekUrl('tijd_stap', ps.id + '::opzet', null) || getDraaiboekUrl('taak', ps.id, null);
            return dbUrlPs ? React.createElement('a', {
              href: dbUrlPs, target: '_blank', rel: 'noopener',
              onClick: function(ev){ ev.stopPropagation(); },
              title: 'Draaiboek voor ' + ps.naam,
              style:{fontSize:10,color:C.aqua,textDecoration:'none',padding:'2px 8px',border:'1px solid ' + C.aqua,borderRadius:100,fontWeight:700,marginLeft:6}
            }, '📖 ' + ps.naam) : null;
          })()
        );
      })(),
      // Opzet 1-op-1 uit snapshot (geen eigen parse/render)
      (function() {
        var heeftOpzet = opzetSnap && opzetSnap.html && opzetSnap.html.length > 200;
        return React.createElement('div', { style:{marginTop:6} },
          React.createElement('div', { style:{fontSize:10,fontWeight:700,color:C.muted,marginBottom:4,letterSpacing:0.5} }, '📊 OPZET'),
          !heeftOpzet ? React.createElement('div', { style:{padding:'10px 12px',fontSize:11,color:C.muted,fontStyle:'italic',background:'#F5F5F5',borderRadius:6,border:'1px dashed #CCC'} },
            autoGenereer ? '⚡ Wordt gegenereerd...' : 'Nog geen opzet beschikbaar — open in Buffetformulieren om te genereren'
          ) : React.createElement('div', null,
            React.createElement('iframe', {
              srcDoc: opzetSnap.html,
              style:{width:'100%',minHeight:360,maxHeight:600,border:'1px solid #D8E8EF',borderRadius:6,background:'#fff'}
            }),
            React.createElement('button', {
              onClick: function(ev) { ev.stopPropagation(); setOpenFormulier({ naam: b.naam + ' — ' + ps.naam + ' (opzet)', html: opzetSnap.html }); },
              style:{marginTop:4,background:'transparent',color:C.night,border:'none',fontSize:10,fontWeight:700,cursor:'pointer',textDecoration:'underline'}
            }, 'Open in volledig scherm')
          )
        );
      })(),
      // BBQ formulier — ingeklapt, grote knop opent modal
      ps.isBBQ && React.createElement('div', { style:{marginTop:10} },
        React.createElement('div', { style:{fontSize:10,fontWeight:700,color:C.muted,marginBottom:4,letterSpacing:0.5} }, '📋 BBQ / BUFFET FORMULIER'),
        (bbqSnap && bbqSnap.html && bbqSnap.html.length > 200) ? React.createElement('button', {
          onClick: function(ev) { ev.stopPropagation(); setOpenFormulier({ naam: b.naam + ' — ' + ps.naam, html: bbqSnap.html }); },
          style:{width:'100%',padding:'14px 16px',background:'#EEF7F9',color:C.night,border:'1.5px solid '+C.aqua,borderRadius:8,fontSize:13,fontWeight:800,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontFamily:'inherit'}
        }, '📋 Open BBQ-formulier') : React.createElement('div', { style:{padding:'10px 12px',fontSize:11,color:C.muted,fontStyle:'italic',background:'#F5F5F5',borderRadius:6,border:'1px dashed #CCC'} },
          'Nog geen BBQ-formulier gegenereerd. Klik ✏️ Aanpassen om in Buffetformulieren te openen.'
        )
      )
    );
  }

  function renderBoeking(b) {
    var pss = productsoortenVanBoeking(b);
    var wijz = wijzigingen[b.id];
    var uren = urenTotDeadline(b);
    var isOpen = openBoekingId === b.id;
    var randKleur = '#D8E8EF';
    if (wijz) {
      if (wijz.type === 'geannuleerd') randKleur = '#FE424D';
      else if (wijz.type === 'gewijzigd') randKleur = '#FF9800';
      else if (wijz.type === 'nieuw') randKleur = '#27AE60';
    }
    // NIEUW: locatie/productbezoeken (geen productsoorten) = auto-goedgekeurd
    var geenProductsoorten = pss.length === 0;
    var alleGoed = geenProductsoorten || pss.every(function(ps) { return goedkeuringen[b.id + '::' + ps.id]; });
    var nGoed = pss.filter(function(ps) { return goedkeuringen[b.id + '::' + ps.id]; }).length;
    var isUrgent = !geenProductsoorten && uren >= 0 && uren <= 24 && !alleGoed;
    // NIEUW: verborgen boekingen filteren (tenzij 'toon verborgen' aan)
    var isVerborgen = verborgenIds.indexOf(b.id) >= 0;
    if (isVerborgen && !toonVerborgen) return null;
    // NIEUW: menu-samenvatting (51× BBQ Populair · 4× Vegan)
    var stamKpHdr = window._stamKoppelingen || [];
    var menuRegelsHdr = (b.regels || []).filter(function(r) {
      if ((r.menuNaam || '').toLowerCase().indexOf('add up') >= 0) return false;
      var kp = stamKpHdr.find(function(k) { return (k.recras_naam || '').trim() === (r.menuNaam || '').trim(); });
      return !!kp;
    });
    var menuSamenvatting = menuRegelsHdr.map(function(r){ return r.aantal + '× ' + r.menuNaam; }).join(' · ');
    // NIEUW: opmerkingen-teller voor header-badge
    var opmerkingenHdr = (b.regels || []).filter(function(r){ return r.opmerking && String(r.opmerking).trim().length > 0; });
    var nOpmerkingenHdr = opmerkingenHdr.length;
    if (isUrgent) randKleur = '#FE424D';

    return React.createElement('div', {
      key: b.id,
      style: { background: alleGoed ? '#F1F8E9' : '#fff', border: isUrgent ? '2px solid #FE424D' : '1px solid #D8E8EF', borderLeft: '4px solid ' + randKleur, borderRadius: 8, marginBottom: 10, overflow: 'hidden' }
    },
      // Klikbare header
      React.createElement('div', {
        onClick: function() { setOpenBoekingId(isOpen ? null : b.id); },
        style: { padding:'10px 14px',display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',cursor:'pointer', opacity: isVerborgen ? 0.55 : 1 }
      },
        React.createElement('span', { style:{color:C.muted,fontSize:12,width:14} }, isOpen ? '▼' : '▶'),
        React.createElement('div', { style:{flex:1,minWidth:0} },
          React.createElement('div', { style:{fontWeight:800,fontSize:14,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:C.night} }, b.naam),
          React.createElement('div', { style:{fontSize:11,color:C.muted,marginTop:3} },
            fmtDag((b.deadline || '').split('T')[0].split(' ')[0]) + ' · ' + (b.deadline_tijd || '—') + ' · ' + (b.locatie || '—') + (geenProductsoorten ? ' · locatie/product' : ' · ' + pss.length + ' productsoort' + (pss.length !== 1 ? 'en' : '') + (pss.length > 0 ? ' (' + nGoed + '/' + pss.length + ' ✓)' : ''))
          ),
          menuSamenvatting && React.createElement('div', { style:{fontSize:12,color:C.night,marginTop:4,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'} }, menuSamenvatting),
          nOpmerkingenHdr > 0 && (function() {
            var teksten = opmerkingenHdr.slice(0, 2).map(function(r){
              var t = String(r.opmerking || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
              return t.length > 55 ? t.slice(0, 55) + '…' : t;
            });
            var extra = nOpmerkingenHdr > 2 ? ' (+' + (nOpmerkingenHdr - 2) + ' meer)' : '';
            return React.createElement('div', { style:{fontSize:12,marginTop:8,background:'#FFF8E1',color:'#E65100',padding:'8px 12px',borderRadius:8,fontWeight:600,border:'1px solid #FFB300',lineHeight:1.45} },
              React.createElement('span', { style:{fontWeight:800,marginRight:6} }, '📝'),
              teksten.join('  ·  '),
              extra && React.createElement('span', { style:{fontWeight:800,marginLeft:4} }, extra)
            );
          })()
        ),
        // NIEUW: toewijzing-dropdown
        React.createElement('div', { onClick: function(ev){ ev.stopPropagation(); }, style: { display:'flex', alignItems:'center', gap:4 } },
          (function(){
            var huidig = toewijzingen[b.id];
            return React.createElement('select', {
              value: huidig ? huidig.medewerker_id : '',
              onChange: function(ev) {
                var mid = ev.target.value;
                if (!mid) { wijzToe(b.id, b.naam, null); return; }
                var m = medewerkers.find(function(x){ return x.id === mid; });
                if (m) {
                  // outlet_code ophalen via kiosk_outlets (west/weesp) — vallen terug op 'west' als onbekend
                  var outlet = window._stamOutlets ? (window._stamOutlets.find(function(o){return o.id === m.outlet_id;}) || {}).code : null;
                  wijzToe(b.id, b.naam, mid, m.naam, outlet || 'west');
                }
              },
              style: {
                background: huidig ? '#E3F2FD' : 'transparent',
                color: huidig ? '#1565C0' : C.muted,
                border: '1px solid ' + (huidig ? '#90CAF9' : '#D8E8EF'),
                borderRadius: 100, padding: '3px 8px', fontSize: 11, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit', maxWidth: 140
              },
              title: huidig ? 'Toegewezen aan ' + huidig.medewerker_naam : 'Wijs deze boeking toe'
            },
              React.createElement('option', { value: '' }, '👤 Toewijzen'),
              medewerkers.map(function(m){
                return React.createElement('option', { key: m.id, value: m.id }, m.naam);
              })
            );
          })()
        ),
        (geenProductsoorten || isVerborgen) && React.createElement('button', {
          onClick: function(ev) { ev.stopPropagation(); if (isVerborgen) { herstelBoeking(b.id); } else { verbergBoeking(b.id); } },
          title: isVerborgen ? 'Weer tonen' : 'Verbergen uit lijst',
          style:{background:'transparent',color:C.muted,border:'1px solid ' + C.muted,borderRadius:100,padding:'3px 9px',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}
        }, isVerborgen ? '↻ tonen' : '× verberg'),
        wijz && React.createElement('span', {
          onClick: function(ev) { ev.stopPropagation(); if (wijz.type === 'geannuleerd') { if (confirm('Geannuleerde boeking wegklikken?')) markeerWijzigingGezien(b.id); } else if (wijz.type === 'gewijzigd') { var _txt = (wijz.detail && wijz.detail.tekst) || 'Deze boeking is gewijzigd in Recras.'; var _k = confirm(_txt + '\n\n[OK] Goedkeuringen intrekken + opnieuw bevestigen\n[Annuleer] Alleen als gezien markeren'); if (_k) { trekGoedkeuringenIn(b.id); markeerWijzigingGezien(b.id); } else { markeerWijzigingGezien(b.id); } } else if (wijz.type === 'nieuw') { markeerWijzigingGezien(b.id); } },
          title: (wijz.detail && wijz.detail.tekst) || wijz.type,
          style:{fontSize:9,fontWeight:800,letterSpacing:0.5,padding:'3px 7px',borderRadius:10,color:'#fff', background: wijz.type === 'geannuleerd' ? '#FE424D' : wijz.type === 'gewijzigd' ? '#FF9800' : '#27AE60', cursor: wijz.type === 'geannuleerd' ? 'pointer' : 'help'}
        }, wijz.type === 'geannuleerd' ? 'GEANNULEERD' : wijz.type === 'gewijzigd' ? 'GEWIJZIGD' : 'NIEUW'),
        !alleGoed && pss.length > 1 && React.createElement('button', {
          onClick: function(ev) { ev.stopPropagation(); keurBoekingGoed(b); },
          style:{background:C.green,color:'#fff',border:'none',borderRadius:100,padding:'4px 10px',fontSize:11,fontWeight:700,cursor:'pointer'}
        }, '✓ Hele boeking')
      ),
      // Uitklap: productsoorten met inline iframes
      isOpen && (pss.length === 0 ? React.createElement('div', { style:{padding:'10px 14px',fontSize:11,color:C.muted,fontStyle:'italic',borderTop:'1px solid #EEE'} }, 'Geen gekoppelde productsoorten') : React.createElement('div', { style:{borderTop:'1px solid #EEE'} },
        // NIEUW: opmerkingen van de klant (geel blok, eerste item in uitklap)
        (function() {
          var opmerkingen = (b.regels || []).filter(function(r){ return r.opmerking && String(r.opmerking).trim().length > 0; });
          if (opmerkingen.length === 0) return null;
          return React.createElement('div', { style:{padding:'12px 16px',background:'#FFF8E1',borderBottom:'2px solid #FFB300'} },
            React.createElement('div', { style:{fontSize:10,fontWeight:800,color:'#E65100',marginBottom:8,letterSpacing:1,textTransform:'uppercase'} }, '📝 Opmerkingen van de klant'),
            opmerkingen.map(function(r, i) {
              return React.createElement('div', { key: i, style:{fontSize:13,color:C.night,marginBottom:6,lineHeight:1.45,paddingLeft:4} },
                React.createElement('span', { style:{color:'#E65100',fontWeight:800,marginRight:6} }, '▸'),
                r.opmerking,
                React.createElement('span', { style:{color:C.muted,fontSize:11,marginLeft:8,fontStyle:'italic'} }, '(' + r.menuNaam + (r.aantal ? ' · ' + r.aantal + '×' : '') + ')')
              );
            })
          );
        })(),
        (function() {
          var stamKp = window._stamKoppelingen || [];
          var menuRegels = (b.regels || []).filter(function(r) {
            if ((r.menuNaam || '').toLowerCase().indexOf('add up') >= 0) return false;
            var kp = stamKp.find(function(k) { return (k.recras_naam || '').trim() === (r.menuNaam || '').trim(); });
            return !!kp;
          });
          if (menuRegels.length === 0) return null;
          return React.createElement('div', { style:{padding:'8px 14px',background:'#EEF6F9',borderBottom:'1px solid #E0EBF0'} },
            React.createElement('div', { style:{fontSize:9,fontWeight:700,color:C.muted,marginBottom:3,letterSpacing:0.5} }, '📌 GEBOEKTE MENU\u0027S'),
            React.createElement('div', { style:{display:'flex',flexWrap:'wrap',gap:'4px 12px'} },
              menuRegels.map(function(r, i) {
                var kpM = stamKp.find(function(k) { return (k.recras_naam || '').trim() === (r.menuNaam || '').trim(); });
                var menuId = kpM ? kpM.menu_id : null;
                var dbUrl = menuId ? getDraaiboekUrl('menu', menuId, null) : null;
                return React.createElement('span', { key: i, style:{fontSize:11,color:C.night,display:'inline-flex',alignItems:'center',gap:4} },
                  React.createElement('strong', { style:{color:C.aqua,fontWeight:800} }, r.aantal + '×'),
                  ' ' + r.menuNaam + (r.starttijdTijd ? ' (' + r.starttijdTijd + ')' : ''),
                  dbUrl && React.createElement('a', {
                    href: dbUrl, target: '_blank', rel: 'noopener',
                    onClick: function(ev){ ev.stopPropagation(); },
                    title: 'Draaiboek voor ' + r.menuNaam,
                    style:{fontSize:10,color:C.aqua,textDecoration:'none',padding:'1px 6px',border:'1px solid ' + C.aqua,borderRadius:100,marginLeft:4,fontWeight:700}
                  }, '📖')
                );
              })
            )
          );
        })(),
        pss.map(function(ps) { return renderProductsoortBlok(b, ps); })
      ))
    );
  }

  if (laden) return React.createElement('div', { style:{padding:40,textAlign:'center',color:C.muted} }, 'Laden...');

  var _olc = (profiel && profiel.outlet_code && profiel.outlet_code !== 'beide') ? profiel.outlet_code : actieveOutlet;
  var outletLabel = _olc === 'weesp' ? 'Weesp' : _olc === 'west' ? 'Amsterdam West' : 'Beide keukens';

  return React.createElement('div', { style:{maxWidth:860,margin:'0 auto',padding:'0 12px 40px',position:'relative'} },
    React.createElement('div', { style:{background:C.night,color:'#fff',borderRadius:10,padding:'14px 20px',marginBottom:14,display:'flex',justifyContent:'space-between',alignItems:'center'} },
      React.createElement('div', null,
        React.createElement('div', { style:{fontSize:17,fontWeight:800} }, '👨‍🍳 Chef Review'),
        React.createElement('div', { style:{fontSize:11,color:C.aqua,marginTop:2} }, outletLabel)
      ),
      React.createElement('div', { style:{display:'flex',gap:10,alignItems:'center'} },
        profiel && profiel.outlet_code === 'beide' && React.createElement('select', {
          value: actieveOutlet || '',
          onChange: function(e) { setActieveOutlet(e.target.value || null); },
          style:{background:'#1a3640',color:'#fff',border:'1px solid #456',borderRadius:6,padding:'4px 8px',fontSize:11,cursor:'pointer'}
        },
          React.createElement('option', { value: '' }, 'Beide keukens'),
          React.createElement('option', { value: 'west' }, 'Amsterdam West'),
          React.createElement('option', { value: 'weesp' }, 'Weesp')
        ),
        (function() {
          var url = getDraaiboekUrl('scherm', 'chef_portaal', actieveOutlet);
          return url ? React.createElement('a', {
            href: url, target: '_blank', rel: 'noopener',
            title: 'Open draaiboek voor chef portaal',
            style:{background:'rgba(255,255,255,.12)',color:'#fff',border:'1px solid rgba(255,255,255,.28)',borderRadius:100,padding:'5px 11px',fontSize:11,fontWeight:700,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:4}
          }, '📖 Draaiboek') : null;
        })(),
        profiel && React.createElement('div', { style:{fontSize:11,color:'#aaa'} }, profiel.naam)
      )
    ),
    React.createElement('div', { style:{display:'flex',gap:4,marginBottom:14,background:'#EEF2F6',borderRadius:100,padding:4} },
      React.createElement('button', {
        onClick: function() { setTab('vandaag'); },
        style:{flex:1,background: tab === 'vandaag' ? C.white : 'transparent', color: tab === 'vandaag' ? C.night : C.muted, border:'none',borderRadius:100,padding:'8px 14px',fontSize:12,fontWeight:800,cursor:'pointer',boxShadow: tab === 'vandaag' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}
      }, 'Vandaag'),
      React.createElement('button', {
        onClick: function() { setTab('komend'); },
        style:{flex:1,background: tab === 'komend' ? C.white : 'transparent', color: tab === 'komend' ? C.night : C.muted, border:'none',borderRadius:100,padding:'8px 14px',fontSize:12,fontWeight:800,cursor:'pointer',boxShadow: tab === 'komend' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}
      }, 'Komende dagen')
    ),
    // NIEUW: mini-banner voor verborgen boekingen
    verborgenIds.length > 0 && React.createElement('div', {
      onClick: function() { setToonVerborgen(!toonVerborgen); },
      style:{cursor:'pointer',background: toonVerborgen ? '#FFF3E0' : '#F0F4F7', border:'1px dashed ' + (toonVerborgen ? '#FF9800' : C.muted), borderRadius:8, padding:'6px 12px', marginBottom:12, fontSize:11, color: toonVerborgen ? '#E65100' : C.muted, display:'flex', alignItems:'center', justifyContent:'space-between' }
    },
      React.createElement('span', null, (toonVerborgen ? '👁 ' : '') + verborgenIds.length + ' verborgen boeking' + (verborgenIds.length !== 1 ? 'en' : '')),
      React.createElement('span', { style:{fontWeight:700} }, toonVerborgen ? 'verberg weer' : 'toon')
    ),
    tab === 'vandaag' ? React.createElement(React.Fragment, null,
      urgentBks.length > 0 && React.createElement('div', { style:{marginBottom:18} },
        React.createElement('div', { style:{display:'flex',alignItems:'center',gap:8,marginBottom:6} },
          React.createElement('span', { style:{background:'#FE424D',color:'#fff',borderRadius:100,padding:'3px 10px',fontSize:10,fontWeight:800,letterSpacing:0.5} }, '⚠ URGENT < 24u'),
          React.createElement('span', { style:{fontSize:11,color:C.muted} }, urgentBks.length + ' nog goed te keuren')
        ),
        urgentBks.map(function(b) { return renderBoeking(b); })
      ),
      bksMetWijziging.length > 0 && React.createElement('div', { style:{marginBottom:18} },
        React.createElement('div', { style:{fontSize:12,fontWeight:800,color:C.night,marginBottom:6} }, 'Wijzigingen sinds import (' + bksMetWijziging.length + ')'),
        bksMetWijziging.map(function(b) { return renderBoeking(b); })
      ),
      React.createElement('div', null,
        React.createElement('div', { style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6} },
          React.createElement('div', { style:{fontSize:12,fontWeight:800,color:C.night} }, 'Vandaag in de keuken (' + vandaagBks.length + ')'),
          vandaagBks.length > 0 && React.createElement('div', { style:{display:'flex',gap:6} },
            React.createElement('button', {
              onClick: function() { keurAlleBBQGoed(vandaagBks); },
              style:{background:C.hot,color:'#fff',border:'none',borderRadius:100,padding:'4px 10px',fontSize:10,fontWeight:700,cursor:'pointer'}
            }, '✓ Alle BBQ'),
            React.createElement('button', {
              onClick: function() { keurDagGoed(vandaagIso, vandaagBks); },
              style:{background:C.green,color:'#fff',border:'none',borderRadius:100,padding:'4px 10px',fontSize:10,fontWeight:700,cursor:'pointer'}
            }, '✓ Hele dag')
          )
        ),
        vandaagBks.length === 0 ? React.createElement('div', { style:{background:'#E8F5E9',borderRadius:8,padding:16,textAlign:'center',color:C.green,fontSize:12} }, 'Geen boekingen vandaag') : vandaagBks.map(function(b) { return renderBoeking(b); })
      )
    ) : React.createElement(React.Fragment, null,
      dagen.length === 0 && React.createElement('div', { style:{background:'#E8F5E9',borderRadius:8,padding:20,textAlign:'center',color:C.green,fontSize:13} }, 'Geen boekingen komende 14 dagen'),
      dagen.map(function(g) {
        if (g.dag === vandaagIso) return null;
        return React.createElement('div', { key: g.dag, style:{marginBottom:18} },
          React.createElement('div', { style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6} },
            React.createElement('div', { style:{background:C.night,color:'#fff',borderRadius:100,padding:'4px 12px',fontSize:12,fontWeight:700} }, fmtDag(g.dag)),
            React.createElement('div', { style:{display:'flex',gap:6} },
              React.createElement('button', {
                onClick: function() { keurAlleBBQGoed(g.boekingen); },
                style:{background:C.hot,color:'#fff',border:'none',borderRadius:100,padding:'3px 9px',fontSize:10,fontWeight:700,cursor:'pointer'}
              }, '✓ BBQ'),
              React.createElement('button', {
                onClick: function() { keurDagGoed(g.dag, g.boekingen); },
                style:{background:C.green,color:'#fff',border:'none',borderRadius:100,padding:'3px 9px',fontSize:10,fontWeight:700,cursor:'pointer'}
              }, '✓ Hele dag')
            )
          ),
          g.boekingen.map(function(b) { return renderBoeking(b); })
        );
      })
    ),
    toast && React.createElement('div', {
      style:{position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',background:C.night,color:'#fff',padding:'10px 18px',borderRadius:100,fontSize:13,fontWeight:700,boxShadow:'0 4px 12px rgba(0,0,0,0.2)',zIndex:10000}
    }, toast),
    openFormulier && React.createElement('div', {
      style:{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.7)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:20},
      onClick: function() { setOpenFormulier(null); }
    },
      React.createElement('div', {
        onClick: function(e) { e.stopPropagation(); },
        style:{background:'#fff',borderRadius:12,maxWidth:'900px',width:'100%',maxHeight:'90vh',overflow:'hidden',display:'flex',flexDirection:'column'}
      },
        React.createElement('div', { style:{padding:'14px 20px',background:C.night,color:'#fff',display:'flex',justifyContent:'space-between',alignItems:'center'} },
          React.createElement('div', { style:{fontWeight:800,fontSize:14,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',paddingRight:10} }, '📋 ' + openFormulier.naam),
          React.createElement('button', {
            onClick: function() { try { window._chefPrintHtml(openFormulier.html, openFormulier.naam); } catch(e){ alert('Print fout: '+(e.message||e)); } },
            style:{background:'rgba(255,255,255,0.15)',color:'#fff',border:'1px solid rgba(255,255,255,0.3)',borderRadius:8,padding:'5px 12px',cursor:'pointer',fontSize:11,fontWeight:700,marginRight:6,fontFamily:'inherit'}
          }, '🖨 Print'),
          React.createElement('button', {
            onClick: function(ev) {
              try {
                var modalEl = ev.target.closest('div[style*="maxWidth"]') || ev.target.parentElement.parentElement.parentElement;
                var iframe = modalEl ? modalEl.querySelector('iframe') : document.querySelector('iframe[srcdoc]');
                window._chefScreenshotModal(iframe, 'opzet-' + (openFormulier.naam || ''));
              } catch(e){ alert('Screenshot fout: '+(e.message||e)); }
            },
            style:{background:'rgba(255,255,255,0.15)',color:'#fff',border:'1px solid rgba(255,255,255,0.3)',borderRadius:8,padding:'5px 12px',cursor:'pointer',fontSize:11,fontWeight:700,marginRight:6,fontFamily:'inherit'}
          }, '📸 Screenshot'),
          React.createElement('button', {
            onClick: function() { setOpenFormulier(null); },
            style:{background:'transparent',color:'#fff',border:'1px solid rgba(255,255,255,0.3)',borderRadius:8,padding:'5px 12px',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:'inherit'}
          }, '✕ Sluiten')
        ),
        React.createElement('iframe', {
          srcDoc: openFormulier.html,
          style:{flex:1,border:0,width:'100%',minHeight:'60vh'}
        })
      )
    ),
    // Hidden BuffetScreen voor auto-generate van ontbrekende snapshots
    autoGenereer && React.createElement('div', {
      style: { position:'fixed', left:-99999, top:-99999, width:1, height:1, overflow:'hidden', pointerEvents:'none', visibility:'hidden' },
      'aria-hidden': true
    },
      React.createElement(window._BuffetScreen, { actieve: autoGenereer, setActieve: function() {} })
    ),
    // Status-indicator onderaan als auto-generate bezig is
    autoGenereer && React.createElement('div', {
      style: { position:'fixed', bottom:24, right:24, background:C.aqua, color:'#fff', padding:'8px 14px', borderRadius:100, fontSize:11, fontWeight:700, boxShadow:'0 2px 8px rgba(0,0,0,0.15)', zIndex:9998 }
    }, '⚡ Bezig met genereren · ' + (autoGenereer.boekingNaam || '...'))
  );
}

  window._ChefScreen = ChefScreen;
})();


// ===== draaiboek-links-tab.js (10623 bytes) =====
// KitchenRobot module: draaiboek-links-tab.js
// Geextraheerd uit index.html op 2026-05-05T12:32:40.433Z (v9 AST-walk v5)
// Bevat: DraaiboekLinksTab
// Externe refs (via window._): tg
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function DraaiboekLinksTab() {
  var [items, setItems] = useState([]);
  var [links, setLinks] = useState({});
  var [laden, setLaden] = useState(true);
  var [filterType, setFilterType] = useState('alle');
  var [zoek, setZoek] = useState('');
  var [dirtyKeys, setDirtyKeys] = useState({});
  var [opslaanKey, setOpslaanKey] = useState('');
  var [opslaanMelding, setOpslaanMelding] = useState('');

  var SCHERMEN = [
    { key: 'chef_portaal', naam: 'Chef Portaal' },
    { key: 'kiosk_vandaag', naam: 'Kiosk - Vandaag scherm' },
    { key: 'kiosk_opzet', naam: 'Kiosk - Opzet scherm' },
    { key: 'kiosk_buffetformulier', naam: 'Kiosk - Buffetformulier' },
    { key: 'kiosk_haccp', naam: 'Kiosk - HACCP metingen' },
    { key: 'kiosk_waste', naam: 'Kiosk - Waste registratie' }
  ];

  function laadAlles() {
    setLaden(true);
    var supa = window._supa;
    if (!supa) { setLaden(false); return; }
    Promise.all([
      supa.from('gerechten').select('id,naam').order('naam'),
      supa.from('menus').select('id,naam').order('naam'),
      supa.from('kiosk_taak_templates').select('id,naam,frequentie,categorie').eq('actief', true).order('naam'),
      supa.from('productsoorten').select('id,naam').order('naam'),
      supa.from('opzet_instellingen').select('productsoort_id,instellingen_json').eq('geldt_voor_alles', true),
      supa.from('kiosk_apparaten').select('id,naam,type,outlet_code').order('naam'),
      supa.from('draaiboek_links').select('*')
    ]).then(function(res) {
      var gerechten = (res[0].data || []).map(function(g) { return { type:'gerecht', id: g.id, key: null, naam: g.naam, outlet: null }; });
      var menus = (res[1].data || []).map(function(m) { return { type:'menu', id: m.id, key: null, naam: m.naam, outlet: null }; });
      var taken = (res[2].data || []).map(function(t) { return { type:'taak', id: t.id, key: null, naam: t.naam + ' (' + (t.frequentie||'') + ')', outlet: null }; });
      var productsoorten = res[3].data || [];
      var opzetInst = res[4].data || [];
      var tijdStappen = [];
      opzetInst.forEach(function(row) {
        var ps = productsoorten.find(function(p){ return p.id === row.productsoort_id; });
        if (!ps) return;
        var cfg = row.instellingen_json;
        if (typeof cfg === 'string') { try { cfg = JSON.parse(cfg); } catch(e) { cfg = null; } }
        var tijden = (cfg && cfg.tijden) || [];
        tijden.forEach(function(t) {
          tijdStappen.push({
            type: 'tijd_stap',
            id: ps.id,
            key: String(t.id || t.naam),
            naam: ps.naam + ' - ' + (t.naam || '(naamloos)'),
            outlet: null
          });
        });
      });
      var apparaten = (res[5].data || []).map(function(a) { return { type:'apparaat', id: a.id, key: a.type || null, naam: a.naam + (a.outlet_code ? ' (' + a.outlet_code + ')' : ''), outlet: a.outlet_code || null }; });
      var schermen = SCHERMEN.map(function(s) { return { type:'scherm', id: null, key: s.key, naam: s.naam, outlet: null }; });
      var allItems = [].concat(gerechten, menus, taken, tijdStappen, schermen, apparaten);
      // Bouw lookup-map voor links: key = type::id::key::outlet
      var linkMap = {};
      (res[6].data || []).forEach(function(l) {
        var k = l.context_type + '::' + (l.context_id || '') + '::' + (l.context_key || '') + '::' + (l.outlet_code || '');
        linkMap[k] = l;
      });
      setItems(allItems);
      setLinks(linkMap);
      setLaden(false);
    }).catch(function(err) {
      console.error('Laden draaiboek-links fout:', err);
      setLaden(false);
    });
  }

  useEffect(function() { laadAlles(); }, []);

  function itemKey(it) {
    return it.type + '::' + (it.id || '') + '::' + (it.key || '') + '::' + (it.outlet || '');
  }

  function urlVoor(it) {
    var k = itemKey(it);
    var l = links[k];
    return l ? l.notion_url : '';
  }

  function updateUrl(it, nieuweUrl) {
    var k = itemKey(it);
    var l = links[k] || { context_type: it.type, context_id: it.id, context_key: it.key, context_naam: it.naam, outlet_code: it.outlet };
    var nieuwObj = Object.assign({}, l, { notion_url: nieuweUrl });
    var nieuweMap = Object.assign({}, links);
    nieuweMap[k] = nieuwObj;
    setLinks(nieuweMap);
    var d = Object.assign({}, dirtyKeys); d[k] = true; setDirtyKeys(d);
  }

  function opslaan(it) {
    var k = itemKey(it);
    var l = links[k];
    if (!l) return;
    setOpslaanKey(k);
    var supa = window._supa;
    var payload = {
      context_type: it.type,
      context_id: it.id,
      context_key: it.key,
      context_naam: it.naam,
      notion_url: (l.notion_url || '').trim(),
      outlet_code: it.outlet
    };
    // Als leeg: verwijder
    if (!payload.notion_url) {
      if (l.id) {
        supa.from('draaiboek_links').delete().eq('id', l.id).then(function(r) {
          setOpslaanKey('');
          if (r.error) { alert('Fout bij verwijderen: ' + r.error.message); return; }
          var nieuweMap = Object.assign({}, links); delete nieuweMap[k]; setLinks(nieuweMap);
          var d = Object.assign({}, dirtyKeys); delete d[k]; setDirtyKeys(d);
          setOpslaanMelding('Link verwijderd'); setTimeout(function(){ setOpslaanMelding(''); }, 2000);
        });
      } else {
        setOpslaanKey('');
        var d0 = Object.assign({}, dirtyKeys); delete d0[k]; setDirtyKeys(d0);
      }
      return;
    }
    // Upsert op basis van unieke combi
    var op;
    if (l.id) {
      op = supa.from('draaiboek_links').update(payload).eq('id', l.id).select('*').single();
    } else {
      op = supa.from('draaiboek_links').insert(payload).select('*').single();
    }
    op.then(function(r) {
      setOpslaanKey('');
      if (r.error) { alert('Fout bij opslaan: ' + r.error.message); return; }
      var nieuweMap = Object.assign({}, links); nieuweMap[k] = r.data; setLinks(nieuweMap);
      var d = Object.assign({}, dirtyKeys); delete d[k]; setDirtyKeys(d);
      setOpslaanMelding('Opgeslagen'); setTimeout(function(){ setOpslaanMelding(''); }, 2000);
    });
  }

  var typeLabels = { alle:'Alle', gerecht:'Gerechten', menu:'Menus', taak:'Taken', tijd_stap:'Tijden-stappen', scherm:'Schermen', apparaat:'Apparaten' };
  var filtertypes = ['alle','gerecht','menu','taak','tijd_stap','scherm','apparaat'];
  var filtered = items.filter(function(it) {
    if (filterType !== 'alle' && it.type !== filterType) return false;
    if (zoek) {
      var z = zoek.toLowerCase();
      if ((it.naam || '').toLowerCase().indexOf(z) < 0) return false;
    }
    return true;
  });
  var aantalGevuld = Object.keys(links).length;

  if (laden) return React.createElement('div', { style:{ padding:40, textAlign:'center', color:C.muted } }, 'Draaiboek-links laden...');

  return React.createElement('div', null,
    React.createElement('div', { style:{ background:C.light, borderRadius:10, padding:'12px 16px', marginBottom:14, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 } },
      React.createElement('div', null,
        React.createElement('div', { style:{ fontSize:14, fontWeight:800, color:C.night } }, '📖 Draaiboek-links beheer'),
        React.createElement('div', { style:{ fontSize:11, color:C.muted, marginTop:2 } }, items.length + ' items totaal · ' + aantalGevuld + ' links gevuld')
      ),
      opslaanMelding && React.createElement('span', { style:{ ...window._tg(C.green), fontSize:11, padding:'4px 10px' } }, opslaanMelding)
    ),
    React.createElement('div', { style:{ display:'flex', gap:6, marginBottom:10, flexWrap:'wrap' } },
      filtertypes.map(function(ft) {
        var act = filterType === ft;
        var n = ft === 'alle' ? items.length : items.filter(function(i){ return i.type === ft; }).length;
        return React.createElement('button', { key:ft, onClick:function(){ setFilterType(ft); }, style:{ background: act ? C.night : C.white, color: act ? C.white : C.night, border:'1px solid ' + (act ? C.night : C.border), borderRadius:100, padding:'6px 12px', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit' } }, typeLabels[ft] + ' (' + n + ')');
      })
    ),
    React.createElement('input', { value:zoek, onChange:function(e){ setZoek(e.target.value); }, placeholder:'Zoek op naam...', style:{ width:'100%', padding:'8px 12px', borderRadius:8, border:'1px solid ' + C.border, fontFamily:'inherit', fontSize:13, marginBottom:14 } }),
    filtered.length === 0 ? React.createElement('div', { style:{ padding:30, textAlign:'center', color:C.muted, fontSize:12 } }, 'Geen items gevonden') :
    React.createElement('div', { style:{ background:C.white, borderRadius:10, overflow:'hidden', border:'1px solid ' + C.border } },
      filtered.map(function(it, idx) {
        var k = itemKey(it);
        var url = urlVoor(it);
        var isDirty = !!dirtyKeys[k];
        var isBezig = opslaanKey === k;
        return React.createElement('div', { key:k, style:{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', borderBottom: idx < filtered.length-1 ? '1px solid ' + C.border : 'none', background: idx % 2 === 0 ? C.white : '#FAFBFC' } },
          React.createElement('div', { style:{ minWidth:110, fontSize:10, fontWeight:700, color:C.muted, textTransform:'uppercase' } }, typeLabels[it.type] || it.type),
          React.createElement('div', { style:{ flex:1, fontSize:13, fontWeight:600, color:C.night } }, it.naam),
          React.createElement('input', { value:url, onChange:function(e){ updateUrl(it, e.target.value); }, placeholder:'https://notion.so/...', style:{ flex:2, padding:'6px 10px', borderRadius:6, border:'1px solid ' + (isDirty ? C.orange : C.border), fontFamily:'inherit', fontSize:12 } }),
          React.createElement('button', { disabled: !isDirty || isBezig, onClick:function(){ opslaan(it); }, style:{ background: isDirty ? C.green : C.light, color: isDirty ? C.white : C.muted, border:'none', borderRadius:100, padding:'6px 14px', fontSize:11, fontWeight:700, cursor: isDirty ? 'pointer' : 'default', fontFamily:'inherit' } }, isBezig ? '...' : (isDirty ? 'Opslaan' : (url ? '✓' : '')))
        );
      })
    )
  );
}

  window._DraaiboekLinksTab = DraaiboekLinksTab;
})();


// ===== fin-instellingen-screen.js (12306 bytes) =====
// KitchenRobot module: fin-instellingen-screen.js
// Geextraheerd uit index.html op 2026-05-05T10:27:14.923Z (v9 AST-walk)
// Bevat: FinInstellingenScreen
// Externe refs (via window._): (geen)
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function FinInstellingenScreen() {
  var C = window._C || { night:'#234756', aqua:'#3FB8C4', hot:'#E8202B', green:'#2E7D32', muted:'#78909C', white:'#fff', orange:'#FF9800' };
  var SS = window._SS || { pT: { fontSize:22, fontWeight:900, color:'#234756', marginBottom:4 }, pD: { fontSize:12, color:'#78909C', marginBottom:16 } };
  var [kickback, setKickback] = React.useState(null);
  var [richtmarges, setRichtmarges] = React.useState([]);
  var [laden, setLaden] = React.useState(true);
  var [bezigIds, setBezigIds] = React.useState({});
  var [nieuweSoort, setNieuweSoort] = React.useState('');
  var [nieuweMarge, setNieuweMarge] = React.useState(60);
  var [bericht, setBericht] = React.useState(null);

  function laad() {
    setLaden(true);
    Promise.all([
      window._supa.from('fin_instellingen').select('*').eq('id', 1).single(),
      window._supa.from('fin_richtmarge').select('*').order('productsoort_naam', { ascending: true })
    ]).then(function(results) {
      if (results[0].data) setKickback(parseFloat(results[0].data.kickback_pct));
      if (results[1].data) setRichtmarges(results[1].data.map(function(r){
        return Object.assign({}, r, { _edit_marge: parseFloat(r.bruto_marge_pct), _edit_opm: r.opmerking || '' });
      }));
      setLaden(false);
    });
  }
  React.useEffect(laad, []);

  function toon(tekst, ok) {
    setBericht({ tekst: tekst, ok: ok !== false });
    setTimeout(function(){ setBericht(null); }, 2500);
  }

  function saveKickback() {
    if (kickback === null || isNaN(kickback)) return;
    var v = Math.max(0, Math.min(100, parseFloat(kickback)));
    window._supa.from('fin_instellingen').update({ kickback_pct: v, bijgewerkt_op: new Date().toISOString() }).eq('id', 1).then(function(res) {
      if (res.error) toon('Fout: ' + res.error.message, false);
      else toon('✓ Kickback opgeslagen: ' + v.toFixed(2) + '%');
    });
  }

  function saveRij(rij) {
    var v = parseFloat(rij._edit_marge);
    if (isNaN(v) || v < 0 || v > 100) { toon('Marge moet tussen 0 en 100 zijn', false); return; }
    var nieuwBezig = Object.assign({}, bezigIds); nieuwBezig[rij.productsoort_naam] = true; setBezigIds(nieuwBezig);
    window._supa.from('fin_richtmarge').update({
      bruto_marge_pct: v,
      opmerking: rij._edit_opm || null,
      bijgewerkt_op: new Date().toISOString()
    }).eq('productsoort_naam', rij.productsoort_naam).then(function(res) {
      var b = Object.assign({}, bezigIds); delete b[rij.productsoort_naam]; setBezigIds(b);
      if (res.error) toon('Fout: ' + res.error.message, false);
      else {
        setRichtmarges(richtmarges.map(function(r){
          if (r.productsoort_naam === rij.productsoort_naam) return Object.assign({}, r, { bruto_marge_pct: v, opmerking: rij._edit_opm });
          return r;
        }));
        toon('✓ ' + rij.productsoort_naam + ' opgeslagen');
      }
    });
  }

  function verwijderRij(rij) {
    if (!confirm('Productsoort "' + rij.productsoort_naam + '" verwijderen uit richtmarges?')) return;
    window._supa.from('fin_richtmarge').delete().eq('productsoort_naam', rij.productsoort_naam).then(function(res) {
      if (res.error) toon('Fout: ' + res.error.message, false);
      else { toon('✓ Verwijderd'); laad(); }
    });
  }

  function addNieuwe() {
    if (!nieuweSoort.trim()) { toon('Vul productsoort-naam in', false); return; }
    var v = parseFloat(nieuweMarge);
    if (isNaN(v)) v = 60;
    window._supa.from('fin_richtmarge').insert({
      productsoort_naam: nieuweSoort.trim(),
      bruto_marge_pct: v,
      opmerking: 'Handmatig toegevoegd'
    }).then(function(res) {
      if (res.error) toon('Fout: ' + res.error.message, false);
      else { setNieuweSoort(''); setNieuweMarge(60); toon('✓ Toegevoegd'); laad(); }
    });
  }

  function wijzigMarge(idx, v) {
    var nieuw = richtmarges.slice();
    nieuw[idx] = Object.assign({}, nieuw[idx], { _edit_marge: v });
    setRichtmarges(nieuw);
  }
  function wijzigOpm(idx, v) {
    var nieuw = richtmarges.slice();
    nieuw[idx] = Object.assign({}, nieuw[idx], { _edit_opm: v });
    setRichtmarges(nieuw);
  }

  if (laden) return React.createElement('div', { style:{padding:30,textAlign:'center',color:C.muted} }, '⏳ Instellingen laden...');

  return React.createElement('div', null,
    React.createElement('div', { style: SS.pT }, '💸 Financiële instellingen'),
    React.createElement('div', { style: SS.pD }, 'Kickback-percentage en richtmarge per productsoort voor het Financieel dashboard'),
    bericht && React.createElement('div', { style:{background: bericht.ok ? '#E8F5E9' : '#FFEBEE', color: bericht.ok ? C.green : C.hot, padding:'10px 14px', borderRadius:8, marginBottom:14, fontSize:13, fontWeight:700} }, bericht.tekst),
    React.createElement('div', { style:{background:C.white,borderRadius:12,padding:'18px 22px',marginBottom:16} },
      React.createElement('div', { style:{fontSize:11,color:C.night,fontWeight:800,letterSpacing:1,textTransform:'uppercase',marginBottom:4} }, '💳 Kickback'),
      React.createElement('div', { style:{fontSize:12,color:C.muted,marginBottom:14} }, 'Percentage van de inkoopprijs dat je retour ontvangt van leveranciers (bijv. Sligro). Wordt toegepast op alle richtmarge-berekeningen in het dashboard.'),
      React.createElement('div', { style:{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'} },
        React.createElement('label', { style:{fontSize:13,color:C.night,fontWeight:700} }, 'Kickback-%:'),
        React.createElement('input', {
          type: 'number', step: '0.25', min: 0, max: 100,
          value: kickback !== null ? kickback : '',
          onChange: function(e){ setKickback(e.target.value === '' ? '' : parseFloat(e.target.value)); },
          style:{width:100,padding:'9px 12px',border:'1px solid #D8E8EF',borderRadius:8,fontSize:14,textAlign:'right',fontFamily:'inherit'}
        }),
        React.createElement('span', { style:{color:C.muted,fontSize:14} }, '%'),
        React.createElement('button', {
          onClick: saveKickback,
          style:{background:C.green,color:'#fff',border:'none',borderRadius:8,padding:'10px 18px',fontWeight:800,fontSize:13,cursor:'pointer',fontFamily:'inherit'}
        }, '✓ Opslaan')
      )
    ),
    React.createElement('div', { style:{background:C.white,borderRadius:12,padding:'18px 22px'} },
      React.createElement('div', { style:{fontSize:11,color:C.night,fontWeight:800,letterSpacing:1,textTransform:'uppercase',marginBottom:4} }, '📊 Richtmarge per productsoort'),
      React.createElement('div', { style:{fontSize:12,color:C.muted,marginBottom:14} }, 'Tot echte kostprijzen in menu_engineering kloppen, gebruikt het dashboard deze richtmarges om theoretische marge te berekenen. BBQ ≈ 55%, Lunch ≈ 65%, IJs ≈ 70% zijn typische cateringwaardes. Oranje kader = niet opgeslagen wijziging.'),
      React.createElement('table', { className:'kr-table', style:{width:'100%',borderCollapse:'collapse',fontSize:13} },
        React.createElement('thead', null,
          React.createElement('tr', { style:{borderBottom:'2px solid #E8EEF2'} },
            React.createElement('th', { style:{textAlign:'left',padding:'8px 6px',color:C.muted,fontSize:10,fontWeight:800,letterSpacing:1,textTransform:'uppercase'} }, 'Productsoort'),
            React.createElement('th', { style:{textAlign:'right',padding:'8px 6px',color:C.muted,fontSize:10,fontWeight:800,letterSpacing:1,textTransform:'uppercase',width:120} }, 'Bruto marge %'),
            React.createElement('th', { style:{textAlign:'left',padding:'8px 6px',color:C.muted,fontSize:10,fontWeight:800,letterSpacing:1,textTransform:'uppercase'} }, 'Opmerking'),
            React.createElement('th', { style:{textAlign:'right',padding:'8px 6px',width:160} })
          )
        ),
        React.createElement('tbody', null,
          richtmarges.map(function(rij, idx) {
            var gewijzigd = parseFloat(rij._edit_marge) !== parseFloat(rij.bruto_marge_pct) || (rij._edit_opm || '') !== (rij.opmerking || '');
            return React.createElement('tr', { key: rij.productsoort_naam, style:{borderBottom:'1px solid #F0F4F7'} },
              React.createElement('td', { style:{padding:'10px 6px',fontWeight:700,color:C.night} }, rij.productsoort_naam),
              React.createElement('td', { style:{padding:'10px 6px',textAlign:'right'} },
                React.createElement('input', {
                  type: 'number', step: '0.5', min: 0, max: 100,
                  value: rij._edit_marge,
                  onChange: function(e){ wijzigMarge(idx, e.target.value); },
                  style:{width:80,padding:'6px 8px',border:'1px solid ' + (gewijzigd ? C.orange : '#D8E8EF'),borderRadius:6,fontSize:13,textAlign:'right',fontFamily:'inherit'}
                }),
                React.createElement('span', { style:{color:C.muted,fontSize:12,marginLeft:4} }, '%')
              ),
              React.createElement('td', { style:{padding:'10px 6px'} },
                React.createElement('input', {
                  type: 'text',
                  value: rij._edit_opm,
                  onChange: function(e){ wijzigOpm(idx, e.target.value); },
                  placeholder: 'Optionele notitie',
                  style:{width:'100%',padding:'6px 8px',border:'1px solid #D8E8EF',borderRadius:6,fontSize:12,fontFamily:'inherit',color:C.muted}
                })
              ),
              React.createElement('td', { style:{padding:'10px 6px',textAlign:'right'} },
                gewijzigd && React.createElement('button', {
                  onClick: function(){ saveRij(rij); },
                  disabled: !!bezigIds[rij.productsoort_naam],
                  style:{background:C.green,color:'#fff',border:'none',borderRadius:6,padding:'5px 10px',fontWeight:700,fontSize:11,cursor:'pointer',fontFamily:'inherit',marginRight:4}
                }, '✓'),
                React.createElement('button', {
                  onClick: function(){ verwijderRij(rij); },
                  style:{background:'transparent',color:C.hot,border:'1px solid ' + C.hot,borderRadius:6,padding:'5px 9px',fontWeight:700,fontSize:11,cursor:'pointer',fontFamily:'inherit'}
                }, '✗')
              )
            );
          })
        )
      ),
      React.createElement('div', { style:{marginTop:14,paddingTop:14,borderTop:'1px dashed #E8EEF2',display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'} },
        React.createElement('span', { style:{fontSize:11,color:C.muted,fontWeight:700,textTransform:'uppercase',letterSpacing:.5,marginRight:6} }, '+ Nieuwe:'),
        React.createElement('input', {
          type: 'text', value: nieuweSoort,
          onChange: function(e){ setNieuweSoort(e.target.value); },
          placeholder: 'Productsoort-naam',
          style:{flex:1,minWidth:150,padding:'7px 10px',border:'1px solid #D8E8EF',borderRadius:6,fontSize:12,fontFamily:'inherit'}
        }),
        React.createElement('input', {
          type: 'number', step: '0.5', min: 0, max: 100,
          value: nieuweMarge,
          onChange: function(e){ setNieuweMarge(e.target.value); },
          style:{width:80,padding:'7px 10px',border:'1px solid #D8E8EF',borderRadius:6,fontSize:12,textAlign:'right',fontFamily:'inherit'}
        }),
        React.createElement('span', { style:{color:C.muted,fontSize:12} }, '%'),
        React.createElement('button', {
          onClick: addNieuwe,
          style:{background:C.aqua,color:'#fff',border:'none',borderRadius:6,padding:'7px 14px',fontWeight:700,fontSize:12,cursor:'pointer',fontFamily:'inherit'}
        }, 'Toevoegen')
      )
    ),
    React.createElement('div', { style:{fontSize:11,color:C.muted,marginTop:14,fontStyle:'italic'} }, 'Wijzigingen zijn direct zichtbaar in het Financieel dashboard (ververst elke 30 seconden).')
  );
}

  window._FinInstellingenScreen = FinInstellingenScreen;
})();


// ===== financieel-screen.js (57263 bytes) =====
// KitchenRobot module: financieel-screen.js
// Geextraheerd uit index.html op 2026-05-05T08:51:44.597Z
// Bevat: FinancieelScreen
// Externe refs (via window._): (geen)
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function FinancieelScreen({ setSc }) {
  var supa = window._supa;
  var C = window._C || { night:'#234756', aqua:'#3FB8C4', hot:'#E8202B', green:'#2E7D32', muted:'#78909C', white:'#fff' };

  // State
  var [periode, setPeriode] = React.useState('week');       // 'week' | 'maand'
  var [outlet, setOutlet] = React.useState('beide');         // 'west' | 'weesp' | 'beide'
  var [jaar, setJaar] = React.useState(new Date().getFullYear());
  var [laden, setLaden] = React.useState(true);
  var [importBezig, setImportBezig] = React.useState(false);
  var [importBericht, setImportBericht] = React.useState(null);
  var [regels, setRegels] = React.useState([]);
  var [imports, setImports] = React.useState([]);
  var [tab, setTab] = React.useState('overzicht'); // 'overzicht' | 'menus' | 'productsoort' | 'boekingen'
  var [vcmpData, setVcmpData] = React.useState([]);
  var [jaartotalen, setJaartotalen] = React.useState([]);
  var [pgJaar, setPgJaar] = React.useState([]);
  var [optieData, setOptieData] = React.useState([]);
  var [fdData, setFdData] = React.useState([]);

  // Data laden
  React.useEffect(function() {
    if (!supa) return;
    setLaden(true);
    // Laad regels voor geselecteerd jaar
    var query = supa.from('fin_regels').select('*').eq('jaar', jaar);
    if (outlet !== 'beide') query = query.eq('outlet_code', outlet);
    var vcmpQ = supa.from('v_fin_maand_totalen').select('jaar,maand,omzet,outlet_code');
    if (outlet !== 'beide') vcmpQ = vcmpQ.eq('outlet_code', outlet);
    Promise.all([
      query,
      supa.from('fin_imports').select('*').order('aangemaakt_op', { ascending: false }).limit(10),
      vcmpQ,
      supa.from('fin_jaartotalen').select('*').order('jaar'),
      supa.from('fin_pg_jaar').select('*').order('jaar'),
      supa.from('fin_optie').select('*').order('jaar'),
      supa.from('v_fin_maand_fd').select('jaar,maand,outlet_code,categorie,omzet')
    ]).then(function(results) {
      setRegels(results[0].data || []);
      setImports(results[1].data || []);
      var allR = results[2].data || [];
      var vmap = {};
      allR.forEach(function(r) {
        var m = r.maand;
        if (!vmap[m]) vmap[m] = { maand: m };
        if (!vmap[m][r.jaar]) vmap[m][r.jaar] = 0;
        vmap[m][r.jaar] += parseFloat(r.omzet || 0);
      });
      setVcmpData(Object.values(vmap).sort(function(a,b){return a.maand-b.maand;}));
      setJaartotalen(results[3].data || []);
      setPgJaar(results[4].data || []);
      setOptieData(results[5].data || []);
      var fdRaw = results[6].data || [];
      var fdmap = {};
      fdRaw.forEach(function(r) {
        var key = r.maand;
        if (!fdmap[key]) fdmap[key] = { maand: r.maand };
        var cat = r.categorie || 'Overig';
        var yr = r.jaar;
        if (!fdmap[key][cat]) fdmap[key][cat] = {};
        if (!fdmap[key][cat][yr]) fdmap[key][cat][yr] = 0;
        fdmap[key][cat][yr] += parseFloat(r.omzet || 0);
      });
      setFdData(Object.values(fdmap).sort(function(a,b){return a.maand-b.maand;}));
      setLaden(false);
    });
  }, [jaar, outlet]);

  // Import handler
  function handleImport(e) {
    var file = e.target.files[0];
    if (!file) return;
    setImportBezig(true);
    setImportBericht(null);
    var form = new FormData();
    form.append('bestand', file);
    fetch('https://aezatnwsrhlwtykpixsq.supabase.co/functions/v1/fin-import', {
      method: 'POST', body: form
    }).then(function(r) { return r.json(); }).then(function(d) {
      setImportBezig(false);
      if (d.ok) {
        setImportBericht({ ok: true, tekst: d.bericht + ' · ' + d.regels_zonder_prijs + ' regels zonder prijs · periode: ' + d.periode });
        // Herlaad data
        supa.from('fin_regels').select('*').eq('jaar', jaar).then(function(r) { setRegels(r.data || []); });
        supa.from('fin_imports').select('*').order('aangemaakt_op', { ascending: false }).limit(10).then(function(r) { setImports(r.data || []); });
      } else {
        setImportBericht({ ok: false, tekst: d.error || 'Onbekende fout' });
      }
    }).catch(function(err) {
      setImportBezig(false);
      setImportBericht({ ok: false, tekst: err.message });
    });
    e.target.value = '';
  }

  // ── Berekeningen ─────────────────────────────────────────────────────────
  function groepeer(key) {
    var map = {};
    regels.forEach(function(r) {
      var k = r[key];
      if (!k) k = 'Onbekend';
      if (!map[k]) map[k] = { label: k, omzet: 0, personen: 0, boekingen: new Set(), regels: 0 };
      map[k].omzet    += parseFloat(r.omzet || 0);
      map[k].personen += r.aantal_personen || 0;
      map[k].boekingen.add(r.boeking_id);
      map[k].regels++;
    });
    return Object.values(map).map(function(v) {
      return { ...v, boekingen: v.boekingen.size };
    }).sort(function(a,b) { return b.omzet - a.omzet; });
  }

  function periodeGroepeer() {
    var map = {};
    regels.forEach(function(r) {
      var k = periode === 'week'
        ? r.jaar + '-W' + String(r.week).padStart(2,'0')
        : r.jaar + '-' + String(r.maand).padStart(2,'0');
      if (!map[k]) map[k] = { label: k, week: r.week, maand: r.maand, jaar: r.jaar, west: 0, weesp: 0, totaal: 0, personen: 0 };
      var omzet = parseFloat(r.omzet || 0);
      map[k].totaal   += omzet;
      map[k].personen += r.aantal_personen || 0;
      if (r.outlet_code === 'west')  map[k].west  += omzet;
      if (r.outlet_code === 'weesp') map[k].weesp += omzet;
    });
    return Object.values(map).sort(function(a,b) {
      return (a.jaar*100 + (periode==='week'?a.week:a.maand)) - (b.jaar*100 + (periode==='week'?b.week:b.maand));
    });
  }

  // Vorig jaar vergelijking (zelfde week)
  function getVorigJaar(week) {
    // Zoek in regels met jaar-1
    var vorigJaarRegels = regels.filter(function(r) {
      return r.jaar === jaar - 1 && r.week === week;
    });
    return vorigJaarRegels.reduce(function(s,r) { return s + parseFloat(r.omzet||0); }, 0);
  }

  var totaalOmzet   = regels.reduce(function(s,r) { return s + parseFloat(r.omzet||0); }, 0);
  var totaalPersonen= regels.reduce(function(s,r) { return s + (r.aantal_personen||0); }, 0);
  var totaalBoekingen = new Set(regels.map(function(r){ return r.boeking_id; })).size;
  var westOmzet     = regels.filter(function(r){ return r.outlet_code==='west'; }).reduce(function(s,r){ return s+parseFloat(r.omzet||0); },0);
  var weespOmzet    = regels.filter(function(r){ return r.outlet_code==='weesp'; }).reduce(function(s,r){ return s+parseFloat(r.omzet||0); },0);
  var omzetPerPersoon = totaalPersonen > 0 ? totaalOmzet / totaalPersonen : 0;

  var periodeData     = periodeGroepeer();
  var menuData        = groepeer('menu_naam');
  var productsoortData= groepeer('productsoort_naam');

  function euro(v) { return '\u20ac' + Math.round(v).toLocaleString('nl-NL'); }
  function pct(a,b) { return b > 0 ? Math.round(a/b*100) + '%' : '-'; }

  // Staafjeschart (simpel met divs)
  function MiniBar(props) {
    var max = props.max || 1;
    var pctW = Math.round((props.value / max) * 100);
    var kleur = props.kleur || C.aqua;
    return React.createElement('div', { style:{height:8,background:'#E8EDF2',borderRadius:8,overflow:'hidden',marginTop:2} },
      React.createElement('div', { style:{height:'100%',width:pctW+'%',background:kleur,borderRadius:8,transition:'width 0.3s'} })
    );
  }

  // KPI kaart
  function KPI(props) {
    return React.createElement('div', { style:{background:C.white,borderRadius:10,padding:'14px 18px',flex:1,minWidth:120} },
      React.createElement('div', { style:{fontSize:11,color:C.muted,fontWeight:700,letterSpacing:1,marginBottom:6} }, props.label),
      React.createElement('div', { style:{fontSize:24,fontWeight:900,color:props.kleur||C.night} }, props.waarde),
      props.sub && React.createElement('div', { style:{fontSize:11,color:C.muted,marginTop:2} }, props.sub)
    );
  }

  // Tabbalk
  function TabBtn(props) {
    var actief = tab === props.id;
    return React.createElement('button', {
      onClick: function() { setTab(props.id); },
      style:{
        padding:'8px 16px', border:'none', borderRadius:100, cursor:'pointer', fontSize:12, fontWeight:700,
        background: actief ? C.night : 'transparent',
        color: actief ? '#fff' : C.muted,
      }
    }, props.label);
  }

  return React.createElement('div', { style:{maxWidth:1000,margin:'0 auto',padding:'0 12px 40px'} },
    window._FilterBar ? React.createElement(window._FilterBar, { key: 'krfb' }) : null,
    window._ForecastRangeBlok ? React.createElement(window._ForecastRangeBlok, { key: 'krfr', outletFilter: outlet }) : null,
    React.createElement(window._LiveDashboardBlok, { outletFilter: outlet }),

    // Header
    React.createElement('div', { style:{background:C.night,borderRadius:10,padding:'16px 20px',marginBottom:16,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10} },
      React.createElement('div', null,
        React.createElement('div', { style:{color:C.hot,fontWeight:900,fontSize:18} }, '\ud83d\udcb6 Financieel'),
        React.createElement('div', { style:{color:C.aqua,fontSize:11,letterSpacing:2,marginTop:2} }, 'OMZET · MARGE · ANALYSE · LIVE')
      ),
      React.createElement('div', { style:{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'} },
        // Jaar selector
        React.createElement('select', {
          value: jaar,
          onChange: function(e) { setJaar(parseInt(e.target.value)); },
          style:{background:'rgba(255,255,255,0.1)',color:'#fff',border:'1px solid rgba(255,255,255,0.2)',borderRadius:100,padding:'6px 10px',fontSize:13,cursor:'pointer'}
        }, [2026,2027].map(function(y) {
          return React.createElement('option', { key:y, value:y, style:{background:C.night} }, y);
        })),
        // Outlet selector
        React.createElement('select', {
          value: outlet,
          onChange: function(e) { setOutlet(e.target.value); },
          style:{background:'rgba(255,255,255,0.1)',color:'#fff',border:'1px solid rgba(255,255,255,0.2)',borderRadius:100,padding:'6px 10px',fontSize:13,cursor:'pointer'}
        },
          React.createElement('option', { value:'beide', style:{background:C.night} }, 'West + Weesp'),
          React.createElement('option', { value:'west', style:{background:C.night} }, 'Amsterdam West'),
          React.createElement('option', { value:'weesp', style:{background:C.night} }, 'Weesp')
        ),
        // Import knop
        React.createElement('label', {
          style:{background:importBezig?'#555':C.aqua,color:'#fff',borderRadius:100,padding:'6px 14px',fontSize:12,fontWeight:700,cursor:importBezig?'default':'pointer',display:'inline-block'}
        },
          importBezig ? '\u23f3 Bezig...' : '\u2b06 Import Excel',
          React.createElement('input', { type:'file', accept:'.xlsx,.xls', style:{display:'none'}, onChange:handleImport, disabled:importBezig })
        )
      )
    ),

    // Import bericht
    importBericht && React.createElement('div', {
      style:{
        background: importBericht.ok ? '#E8F5E9' : '#FFEBEE',
        border: '1px solid ' + (importBericht.ok ? '#A5D6A7' : '#FFCDD2'),
        borderRadius:8, padding:'10px 16px', marginBottom:12, fontSize:12,
        color: importBericht.ok ? C.green : C.hot, fontWeight:700
      }
    }, importBericht.ok ? '\u2713 ' : '\u26a0 ', importBericht.tekst),

    // Laden
    laden && React.createElement('div', { style:{padding:40,textAlign:'center',color:C.muted} }, 'Laden...'),

    !laden && regels.length === 0 && React.createElement('div', {
      style:{background:'#FFFFFF',borderRadius:10,padding:40,textAlign:'center'}
    },
      React.createElement('div', { style:{fontSize:32,marginBottom:12} }, '\ud83d\udcca'),
      React.createElement('div', { style:{fontWeight:700,color:C.night,marginBottom:6} }, 'Nog geen data voor ' + jaar),
      React.createElement('div', { style:{fontSize:12,color:C.muted} }, 'Importeer een Recras Excel via de knop rechtsboven')
    ),

    !laden && regels.length > 0 && React.createElement(React.Fragment, null,

      // KPI rij
      React.createElement('div', { style:{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'} },
        React.createElement(KPI, { label:'TOTAAL OMZET', waarde:euro(totaalOmzet), sub:totaalBoekingen + ' boekingen' }),
        React.createElement(KPI, { label:'AMSTERDAM WEST', waarde:euro(westOmzet), sub:pct(westOmzet,totaalOmzet) + ' van totaal', kleur:'#3FB8C4' }),
        React.createElement(KPI, { label:'WEESP', waarde:euro(weespOmzet), sub:pct(weespOmzet,totaalOmzet) + ' van totaal', kleur:'#E8202B' }),
        React.createElement(KPI, { label:'OMZET / PERSOON', waarde:euro(omzetPerPersoon), sub:totaalPersonen.toLocaleString('nl-NL') + ' personen' })
      ),

      // Periode toggle + tabs
      React.createElement('div', { style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12,flexWrap:'wrap',gap:8} },
        React.createElement('div', { style:{background:'#F0F4F6',borderRadius:8,padding:4,display:'flex',gap:2} },
          React.createElement(TabBtn, { id:'overzicht', label:'\ud83d\udcc8 Trend' }),
          React.createElement(TabBtn, { id:'menus', label:'\ud83c\udf7d Menu\u2019s' }),
          React.createElement(TabBtn, { id:'productsoort', label:'\ud83d\udccb Categorie\u00ebn' }),
          React.createElement(TabBtn, { id:'vergelijk', label:'\ud83c\udfdb\ufe0f West vs Weesp' }),
          React.createElement(TabBtn, { id:'jaarvcmp', label:'\ud83d\udcc5 Jaarvergelijking' }),
          React.createElement(TabBtn, { id:'prognose', label:'\ud83d\udcc8 Prognose & Aandeel' })
        ),
        tab === 'overzicht' && React.createElement('div', { style:{display:'flex',gap:6} },
          ['week','maand'].map(function(p) {
            return React.createElement('button', {
              key:p,
              onClick: function() { setPeriode(p); },
              style:{
                padding:'6px 12px',border:'none',borderRadius:100,cursor:'pointer',fontSize:11,fontWeight:700,
                background: periode===p ? C.night : '#F0F4F6',
                color: periode===p ? '#fff' : C.muted,
              }
            }, p === 'week' ? 'Per week' : 'Per maand');
          })
        )
      ),

      // ─── TAB: TREND ──────────────────────────────────────────────────────
      tab === 'overzicht' && React.createElement('div', { style:{background:C.white,borderRadius:10,padding:20} },
        React.createElement('div', { style:{fontWeight:700,fontSize:14,marginBottom:16,color:C.night} }, 'Omzet per ' + (periode==='week'?'week':'maand') + ' \u2014 ' + jaar),
        periodeData.length === 0
          ? React.createElement('div', { style:{color:C.muted,textAlign:'center',padding:20} }, 'Geen data')
          : React.createElement('div', { style:{overflowX:'auto'} },
              React.createElement('table', { className:'kr-table', style:{width:'100%',borderCollapse:'collapse',fontSize:12} },
                React.createElement('thead', null,
                  React.createElement('tr', { style:{background:'#F0F4F6'} },
                    React.createElement('th', { style:{padding:'8px 12px',textAlign:'left',fontWeight:700,color:C.muted} }, periode==='week'?'Week':'Maand'),
                    React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700,color:C.muted} }, 'Omzet'),
                    outlet==='beide' && React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700,color:'#3FB8C4'} }, 'West'),
                    outlet==='beide' && React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700,color:'#E8202B'} }, 'Weesp'),
                    React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700,color:C.muted} }, 'Personen'),
                    React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700,color:C.muted} }, 'vs ' + (jaar-1)),
                    React.createElement('th', { style:{padding:'8px 12px',minWidth:120} }, 'Staafje')
                  )
                ),
                React.createElement('tbody', null,
                  periodeData.map(function(p, i) {
                    var vj = getVorigJaar(p.week);
                    var delta = vj > 0 ? Math.round((p.totaal - vj) / vj * 100) : null;
                    var maxOmzet = Math.max.apply(null, periodeData.map(function(x){ return x.totaal; }));
                    return React.createElement('tr', { key:p.label, style:{borderBottom:'1px solid #F0F4F6', background:i%2===0?'#FAFCFE':'#fff'} },
                      React.createElement('td', { style:{padding:'8px 12px',fontWeight:700,color:C.night} }, p.label),
                      React.createElement('td', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700} }, euro(p.totaal)),
                      outlet==='beide' && React.createElement('td', { style:{padding:'8px 12px',textAlign:'right',color:'#3FB8C4'} }, euro(p.west)),
                      outlet==='beide' && React.createElement('td', { style:{padding:'8px 12px',textAlign:'right',color:'#E8202B'} }, euro(p.weesp)),
                      React.createElement('td', { style:{padding:'8px 12px',textAlign:'right',color:C.muted} }, p.personen.toLocaleString('nl-NL')),
                      React.createElement('td', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700,color:delta===null?C.muted:delta>=0?C.green:C.hot} },
                        delta === null ? '-' : (delta >= 0 ? '+' : '') + delta + '%'
                      ),
                      React.createElement('td', { style:{padding:'8px 12px'} },
                        React.createElement(MiniBar, { value:p.totaal, max:maxOmzet, kleur:C.aqua })
                      )
                    );
                  })
                )
              )
            )
      ),

      // ─── TAB: MENU'S ─────────────────────────────────────────────────────
      tab === 'menus' && React.createElement('div', { style:{background:C.white,borderRadius:10,padding:20} },
        React.createElement('div', { style:{fontWeight:700,fontSize:14,marginBottom:16,color:C.night} }, 'Omzet per menu \u2014 ' + jaar),
        menuData.length === 0
          ? React.createElement('div', { style:{color:C.muted,textAlign:'center',padding:20} }, 'Geen data')
          : React.createElement('table', { className:'kr-table', style:{width:'100%',borderCollapse:'collapse',fontSize:12} },
              React.createElement('thead', null,
                React.createElement('tr', { style:{background:'#F0F4F6'} },
                  React.createElement('th', { style:{padding:'8px 12px',textAlign:'left',fontWeight:700,color:C.muted} }, 'Menu'),
                  React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700} }, 'Omzet'),
                  React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700} }, 'Personen'),
                  React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700} }, 'Boekingen'),
                  React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700} }, '% v/d omzet'),
                  React.createElement('th', { style:{padding:'8px 12px',minWidth:120} }, 'Aandeel')
                )
              ),
              React.createElement('tbody', null,
                menuData.slice(0,30).map(function(m, i) {
                  return React.createElement('tr', { key:m.label, style:{borderBottom:'1px solid #F0F4F6',background:i%2===0?'#FAFCFE':'#fff'} },
                    React.createElement('td', { style:{padding:'8px 12px',fontWeight:700,color:C.night} }, m.label || 'Onbekend'),
                    React.createElement('td', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700} }, euro(m.omzet)),
                    React.createElement('td', { style:{padding:'8px 12px',textAlign:'right',color:C.muted} }, m.personen.toLocaleString('nl-NL')),
                    React.createElement('td', { style:{padding:'8px 12px',textAlign:'right',color:C.muted} }, m.boekingen),
                    React.createElement('td', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700} }, pct(m.omzet, totaalOmzet)),
                    React.createElement('td', { style:{padding:'8px 12px'} },
                      React.createElement(MiniBar, { value:m.omzet, max:menuData[0]?.omzet||1, kleur:C.aqua })
                    )
                  );
                })
              )
            )
      ),

      // ─── TAB: CATEGORIEËN ────────────────────────────────────────────────
      tab === 'productsoort' && React.createElement('div', { style:{background:C.white,borderRadius:10,padding:20} },
        React.createElement('div', { style:{fontWeight:700,fontSize:14,marginBottom:16,color:C.night} }, 'Omzet per categorie \u2014 ' + jaar),
        productsoortData.length === 0
          ? React.createElement('div', { style:{color:C.muted,textAlign:'center',padding:20} }, 'Geen data')
          : React.createElement('div', null,
              // Grote kaarten per categorie
              React.createElement('div', { style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:10,marginBottom:20} },
                productsoortData.map(function(ps) {
                  var kleuren = ['#3FB8C4','#E8202B','#FF9800','#2E7D32','#9C27B0','#00BCD4','#FF5722','#607D8B'];
                  var kleur = kleuren[productsoortData.indexOf(ps) % kleuren.length];
                  return React.createElement('div', { key:ps.label, style:{background:'#FFFFFF',borderRadius:10,padding:14,borderTop:'3px solid '+kleur} },
                    React.createElement('div', { style:{fontSize:11,color:C.muted,fontWeight:700,marginBottom:6} }, (ps.label||'Onbekend').toUpperCase()),
                    React.createElement('div', { style:{fontSize:20,fontWeight:900,color:C.night} }, euro(ps.omzet)),
                    React.createElement('div', { style:{fontSize:11,color:C.muted,marginTop:4} }, pct(ps.omzet, totaalOmzet) + ' \u2022 ' + ps.personen.toLocaleString('nl-NL') + ' p'),
                    React.createElement(MiniBar, { value:ps.omzet, max:productsoortData[0]?.omzet||1, kleur })
                  );
                })
              ),
              // Detail tabel
              React.createElement('table', { className:'kr-table', style:{width:'100%',borderCollapse:'collapse',fontSize:12} },
                React.createElement('thead', null,
                  React.createElement('tr', { style:{background:'#F0F4F6'} },
                    React.createElement('th', { style:{padding:'8px 12px',textAlign:'left',fontWeight:700,color:C.muted} }, 'Categorie'),
                    React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700} }, 'Omzet'),
                    React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700} }, 'Personen'),
                    React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700} }, 'Boekingen'),
                    React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700} }, 'Per persoon'),
                    React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700} }, '% totaal')
                  )
                ),
                React.createElement('tbody', null,
                  productsoortData.map(function(ps, i) {
                    return React.createElement('tr', { key:ps.label, style:{borderBottom:'1px solid #F0F4F6',background:i%2===0?'#FAFCFE':'#fff'} },
                      React.createElement('td', { style:{padding:'8px 12px',fontWeight:700,color:C.night} }, ps.label || 'Onbekend'),
                      React.createElement('td', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700} }, euro(ps.omzet)),
                      React.createElement('td', { style:{padding:'8px 12px',textAlign:'right',color:C.muted} }, ps.personen.toLocaleString('nl-NL')),
                      React.createElement('td', { style:{padding:'8px 12px',textAlign:'right',color:C.muted} }, ps.boekingen),
                      React.createElement('td', { style:{padding:'8px 12px',textAlign:'right',color:C.muted} }, euro(ps.personen>0?ps.omzet/ps.personen:0)),
                      React.createElement('td', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700} }, pct(ps.omzet, totaalOmzet))
                    );
                  })
                )
              )
            )
      ),

      // ─── TAB: WEST VS WEESP ──────────────────────────────────────────────
      tab === 'vergelijk' && React.createElement('div', { style:{background:C.white,borderRadius:10,padding:20} },
        React.createElement('div', { style:{fontWeight:700,fontSize:14,marginBottom:16,color:C.night} }, 'West vs Weesp \u2014 ' + jaar),

        // KPI vergelijk
        React.createElement('div', { style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20} },
          React.createElement('div', { style:{background:'#E8F4F9',borderRadius:10,padding:16,borderTop:'4px solid #3FB8C4'} },
            React.createElement('div', { style:{fontWeight:900,color:'#3FB8C4',fontSize:14,marginBottom:8} }, 'Amsterdam West'),
            React.createElement('div', { style:{fontSize:24,fontWeight:900,color:C.night} }, euro(westOmzet)),
            React.createElement('div', { style:{fontSize:12,color:C.muted,marginTop:4} },
              pct(westOmzet,totaalOmzet) + ' van totaal \u2022 ' +
              regels.filter(function(r){return r.outlet_code==='west';}).reduce(function(s,r){return s+(r.aantal_personen||0);},0).toLocaleString('nl-NL') + ' personen'
            )
          ),
          React.createElement('div', { style:{background:'#FFF3F3',borderRadius:10,padding:16,borderTop:'4px solid #E8202B'} },
            React.createElement('div', { style:{fontWeight:900,color:'#E8202B',fontSize:14,marginBottom:8} }, 'Weesp'),
            React.createElement('div', { style:{fontSize:24,fontWeight:900,color:C.night} }, euro(weespOmzet)),
            React.createElement('div', { style:{fontSize:12,color:C.muted,marginTop:4} },
              pct(weespOmzet,totaalOmzet) + ' van totaal \u2022 ' +
              regels.filter(function(r){return r.outlet_code==='weesp';}).reduce(function(s,r){return s+(r.aantal_personen||0);},0).toLocaleString('nl-NL') + ' personen'
            )
          )
        ),

        // Per week vergelijk
        React.createElement('div', { style:{fontWeight:700,fontSize:12,color:C.muted,letterSpacing:1,marginBottom:8} }, 'OMZET PER WEEK — WEST VS WEESP'),
        React.createElement('div', { style:{overflowX:'auto'} },
          React.createElement('table', { className:'kr-table', style:{width:'100%',borderCollapse:'collapse',fontSize:12} },
            React.createElement('thead', null,
              React.createElement('tr', { style:{background:'#F0F4F6'} },
                React.createElement('th', { style:{padding:'8px 12px',textAlign:'left',fontWeight:700,color:C.muted} }, 'Week'),
                React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700,color:'#3FB8C4'} }, 'West'),
                React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700,color:'#E8202B'} }, 'Weesp'),
                React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700} }, 'Totaal'),
                React.createElement('th', { style:{padding:'8px 12px',minWidth:160} }, 'Verdeling')
              )
            ),
            React.createElement('tbody', null,
              periodeGroepeer().map(function(p, i) {
                var totW = p.totaal || 1;
                var westPct = Math.round(p.west/totW*100);
                return React.createElement('tr', { key:p.label, style:{borderBottom:'1px solid #F0F4F6',background:i%2===0?'#FAFCFE':'#fff'} },
                  React.createElement('td', { style:{padding:'8px 12px',fontWeight:700} }, p.label),
                  React.createElement('td', { style:{padding:'8px 12px',textAlign:'right',color:'#3FB8C4',fontWeight:700} }, euro(p.west)),
                  React.createElement('td', { style:{padding:'8px 12px',textAlign:'right',color:'#E8202B',fontWeight:700} }, euro(p.weesp)),
                  React.createElement('td', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700} }, euro(p.totaal)),
                  React.createElement('td', { style:{padding:'8px 12px'} },
                    React.createElement('div', { style:{height:8,background:'#FEE',borderRadius:8,overflow:'hidden'} },
                      React.createElement('div', { style:{height:'100%',width:westPct+'%',background:'#3FB8C4',borderRadius:'4px 0 0 4px'} })
                    ),
                    React.createElement('div', { style:{fontSize:10,color:C.muted,marginTop:2} }, 'W: '+westPct+'% · Weesp: '+(100-westPct)+'%')
                  )
                );
              })
            )
          )
        )
      ),

      // ─── TAB: JAARVERGELIJKING ───────────────────────────────────────────
      tab === 'jaarvcmp' && React.createElement('div', { style:{background:C.white,borderRadius:10,padding:20} },
        React.createElement('div', { style:{fontWeight:700,fontSize:14,marginBottom:4,color:C.night} }, '\ud83d\udcc5 Jaarvergelijking omzet per productgroep'),
        React.createElement('div', { style:{fontSize:11,color:C.muted,marginBottom:16} }, 'Bron: Boekingswaarde excl. BTW per jaar (Recras export)'),

        // ── Jaaromzet kaartjes ───────────────────────────────────────────────
        React.createElement('div', { style:{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap'} },
          [2023,2024,2025,2026].map(function(jj) {
            var jt = jaartotalen.find(function(t){return t.jaar===jj;});
            var colors = {2023:'#78909C',2024:'#1565C0',2025:'#2E7D32',2026:'#E8202B'};
            return React.createElement('div', { key:jj, style:{background:'#FFFFFF',borderRadius:8,padding:'12px 16px',flex:1,minWidth:130,borderTop:'3px solid '+(colors[jj]||C.muted)} },
              React.createElement('div', { style:{fontSize:10,fontWeight:700,color:C.muted,letterSpacing:1} }, jj + ' TOTAAL'),
              React.createElement('div', { style:{fontSize:18,fontWeight:900,color:colors[jj]||C.muted,marginTop:4} }, (function(){
                if (jj === 2026 && Array.isArray(regels)) {
                  var vandaag2 = new Date().toISOString().slice(0,10);
                  var ytd = 0;
                  regels.forEach(function(r){ if (r.jaar===2026 && r.datum && r.datum <= vandaag2) ytd += parseFloat(r.omzet)||0; });
                  return '\u20ac'+Math.round(ytd/1000)+'K';
                }
                return jt ? '\u20ac'+Math.round(parseFloat(jt.omzet_excl_btw)/1000)+'K' : '-';
              })()),
              React.createElement('div', { style:{fontSize:10,color:C.muted,marginTop:2} }, jj===2026?'YTD \u00b7 tot vandaag':'volledig jaar'),
              jj===2026 && (function(){
                if (!Array.isArray(regels)) return null;
                var vandaag3 = new Date().toISOString().slice(0,10);
                var toek = 0;
                regels.forEach(function(r){ if (r.jaar===2026 && r.datum && r.datum > vandaag3) toek += parseFloat(r.omzet)||0; });
                return toek > 0 ? React.createElement('div', { style:{fontSize:10,color:'#666',marginTop:4,paddingTop:4,borderTop:'1px dashed #E0E0E0'} }, 'Nog te realiseren: \u20ac'+Math.round(toek/1000)+'K') : null;
              })()
            );
          })
        ),

        // ── Eten & Drinken highlight kaartjes ────────────────────────────────
        React.createElement('div', { style:{fontWeight:700,fontSize:12,color:C.muted,letterSpacing:1,marginBottom:10} }, 'ETEN & DRINKEN — ALLE JAREN'),
        React.createElement('div', { style:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:20} },
          [
            {pg:'Eten', label:'\ud83c\udf7d Eten (West)', color:'#E65100'},
            {pg:'Eten wp', label:'\ud83c\udf7d Eten (Weesp)', color:'#FF8F00'},
            {pg:'Drinken', label:'\ud83c\udf7a Drinken (West)', color:'#1565C0'},
            {pg:'Drinken wp', label:'\ud83c\udf7a Drinken (Weesp)', color:'#1E88E5'},
          ].map(function(cat) {
            return React.createElement('div', { key:cat.pg, style:{background:'#FAFAFA',borderRadius:8,padding:12,borderLeft:'4px solid '+cat.color} },
              React.createElement('div', { style:{fontSize:11,fontWeight:700,color:cat.color,marginBottom:6} }, cat.label),
              React.createElement('div', { style:{display:'flex',flexDirection:'column',gap:3} },
                [2023,2024,2025,2026].map(function(jj) {
                  var row = pgJaar.find(function(r){return r.jaar===jj && r.productgroep===cat.pg;});
                  var v = row ? parseFloat(row.omzet_excl_btw) : 0;
                  var colors = {2023:'#78909C',2024:'#1565C0',2025:'#2E7D32',2026:'#E8202B'};
                  return React.createElement('div', { key:jj, style:{display:'flex',justifyContent:'space-between',fontSize:11} },
                    React.createElement('span', { style:{color:C.muted,fontWeight:600} }, jj+(jj===2026?' *':'')),
                    React.createElement('span', { style:{fontWeight:700,color:colors[jj]} }, v>0?'\u20ac'+Math.round(v/1000)+'K':'-')
                  );
                })
              )
            );
          })
        ),

        // ── Alle productgroepen tabel ─────────────────────────────────────────
        React.createElement('div', { style:{fontWeight:700,fontSize:12,color:C.muted,letterSpacing:1,marginBottom:10} }, 'ALLE PRODUCTGROEPEN'),
        React.createElement('div', { style:{overflowX:'auto'} },
          React.createElement('table', { className:'kr-table', style:{width:'100%',borderCollapse:'collapse',fontSize:12} },
            React.createElement('thead', null,
              React.createElement('tr', { style:{background:'#F0F4F6'} },
                React.createElement('th', { style:{padding:'8px 12px',textAlign:'left',fontWeight:700,color:C.muted} }, 'Productgroep'),
                React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700,color:'#78909C'} }, '2023'),
                React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700,color:'#1565C0'} }, '2024'),
                React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700,color:'#2E7D32'} }, '2025'),
                React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700,color:'#E8202B'} }, '2026 *'),
                React.createElement('th', { style:{padding:'8px 12px',textAlign:'right',fontWeight:700,color:C.muted} }, '\u0394 25\u219226')
              )
            ),
            React.createElement('tbody', null,
              (function() {
                var pgs = ['Eten','Eten wp','Drinken','Drinken wp','Locaties','Buitensport','Fun and Gaming','Challenges','Creatief','Golf gerelateerd','UPventure camp','Vervoer','Arrangementen'];
                var highlightPgs = ['Eten','Eten wp','Drinken','Drinken wp'];
                return pgs.map(function(pg) {
                  var getV = function(jj) {
                    var r = pgJaar.find(function(x){return x.jaar===jj&&x.productgroep===pg;});
                    return r ? parseFloat(r.omzet_excl_btw) : 0;
                  };
                  var v23=getV(2023), v24=getV(2024), v25=getV(2025), v26=getV(2026);
                  if(v23===0&&v24===0&&v25===0&&v26===0) return null;
                  var diff = v25>0 ? Math.round((v26-v25)/v25*100) : null;
                  var isHL = highlightPgs.indexOf(pg) > -1;
                  return React.createElement('tr', { key:pg, style:{borderBottom:'1px solid #F0F4F6',background:isHL?'#FFFBF5':''} },
                    React.createElement('td', { style:{padding:'7px 12px',fontWeight:isHL?700:500,color:isHL?'#E65100':C.night} }, pg),
                    React.createElement('td', { style:{padding:'7px 12px',textAlign:'right',color:'#78909C'} }, v23>0?'\u20ac'+Math.round(v23).toLocaleString('nl-NL'):'-'),
                    React.createElement('td', { style:{padding:'7px 12px',textAlign:'right',color:'#1565C0'} }, v24>0?'\u20ac'+Math.round(v24).toLocaleString('nl-NL'):'-'),
                    React.createElement('td', { style:{padding:'7px 12px',textAlign:'right',color:'#2E7D32'} }, v25>0?'\u20ac'+Math.round(v25).toLocaleString('nl-NL'):'-'),
                    React.createElement('td', { style:{padding:'7px 12px',textAlign:'right',color:'#E8202B',fontWeight:700} }, v26>0?'\u20ac'+Math.round(v26).toLocaleString('nl-NL'):'-'),
                    React.createElement('td', { style:{padding:'7px 12px',textAlign:'right',fontWeight:700,fontSize:11,color:diff===null?C.muted:diff>=0?C.green:C.hot} },
                      diff===null?'-':((diff>=0?'+':'')+diff+'%')
                    )
                  );
                }).filter(Boolean);
              })()
            )
          )
        ),
        React.createElement('div', { style:{fontSize:10,color:C.muted,marginTop:8} }, '* 2026 = YTD (tot heden)')
      ),


      // ─── TAB: PROGNOSE & AANDEEL ─────────────────────────────────────────
      tab === 'prognose' && (function() {
        var maandNu = 4;
        var MN = ['Jan','Feb','Mrt','Apr','Mei','Jun','Jul','Aug','Sep','Okt','Nov','Dec'];
        var JK = {2024:'#78909C', 2025:'#1565C0', 2026:'#E8202B'};
        function euro(v) { return '\u20ac' + Math.round(v).toLocaleString('nl-NL'); }
        function euroK(v) { return '\u20ac' + Math.round(v/1000) + 'K'; }
        function getM(jj,mn) { var r=vcmpData.find(function(m){return m.maand===mn;}); return r?(r[jj]||0):0; }
        function getFD(cat,jj,mn) { var r=fdData.find(function(m){return m.maand===mn;}); return r&&r[cat]?(r[cat][jj]||0):0; }
        function getPG(jj,pg) { var r=pgJaar.find(function(x){return x.jaar===jj&&x.productgroep===pg;}); return r?parseFloat(r.omzet_excl_btw):0; }
        function getJT(jj) { var r=jaartotalen.find(function(t){return t.jaar===jj;}); return r?parseFloat(r.omzet_excl_btw):0; }

        var ytd26=[1,2,3,4].reduce(function(s,mn){return s+getM(2026,mn);},0);
        var tok26=[5,6,7,8,9,10,11,12].reduce(function(s,mn){return s+getM(2026,mn);},0);
        var def26=ytd26+tok26;
        var optieExtra=optieData.filter(function(o){return o.jaar===2026;}).reduce(function(s,o){return s+parseFloat(o.omzet_optie||0);},0);
        var defOptie26=def26+optieExtra;
        var eten26=[1,2,3,4,5,6,7,8,9,10,11,12].reduce(function(s,mn){return s+getFD('Eten',2026,mn);},0);
        var drnk26=[1,2,3,4,5,6,7,8,9,10,11,12].reduce(function(s,mn){return s+getFD('Drinken',2026,mn);},0);
        var ytd25=[1,2,3,4].reduce(function(s,mn){return s+getM(2025,mn);},0);
        var tot25=[1,2,3,4,5,6,7,8,9,10,11,12].reduce(function(s,mn){return s+getM(2025,mn);},0);
        var gf=ytd25>0?Math.min(2.0,Math.max(0.5,ytd26/ytd25)):1.0;
        var scen=[
          {key:'cons',label:'Conservatief',factor:Math.max(gf*0.90,0.80),color:'#F44336',bg:'#FFEBEE'},
          {key:'base',label:'Basis',factor:gf,color:'#FF9800',bg:'#FFF8E1'},
          {key:'opt',label:'Optimistisch',factor:gf*1.10,color:'#4CAF50',bg:'#E8F5E9'},
        ];

        return React.createElement('div',null,

          // 1. Eten & Drinken aandeel tabel
          React.createElement('div',{style:{background:'#fff',borderRadius:10,padding:20,marginBottom:16}},
            React.createElement('div',{style:{fontWeight:700,fontSize:14,marginBottom:4,color:'#234756'}},'\ud83c\udf7d\ufe0f Eten & Drinken — aandeel van totale UP omzet'),
            React.createElement('div',{style:{fontSize:11,color:'#78909C',marginBottom:16}},'Bron: Recras boekingswaarde per jaar · 2026 = YTD'),
            React.createElement('div',{style:{overflowX:'auto'}},
              React.createElement('table',{className:'kr-table',style:{width:'100%',borderCollapse:'collapse',fontSize:12}},
                React.createElement('thead',null,
                  React.createElement('tr',{style:{background:'#F0F4F6'}},
                    React.createElement('th',{style:{padding:'8px 12px',textAlign:'left',fontWeight:700,color:'#78909C'}},'Categorie'),
                    [2024,2025,2026].map(function(jj){return React.createElement('th',{key:jj,style:{padding:'8px 12px',textAlign:'right',fontWeight:700,color:JK[jj]}},jj+(jj===2026?' YTD':''));}),
                    React.createElement('th',{style:{padding:'8px 12px',textAlign:'right',fontWeight:700,color:'#78909C'}},'\u0394 25\u219226')
                  )
                ),
                React.createElement('tbody',null,
                  [
                    {pg:'Eten',pgwp:'Eten wp',label:'\ud83c\udf7d Eten (West+Weesp)',color:'#BF360C'},
                    {pg:'Drinken',pgwp:'Drinken wp',label:'\ud83c\udf7a Drinken (West+Weesp)',color:'#0D47A1'},
                  ].map(function(cat){
                    return React.createElement('tr',{key:cat.pg,style:{borderBottom:'1px solid #F0F4F6'}},
                      React.createElement('td',{style:{padding:'8px 12px',fontWeight:700,color:cat.color}},cat.label),
                      [2024,2025,2026].map(function(jj){
                        var v=getPG(jj,cat.pg)+getPG(jj,cat.pgwp);
                        var tot=getJT(jj);
                        var pct=tot>0?(v/tot*100).toFixed(1):'0';
                        return React.createElement('td',{key:jj,style:{padding:'8px 12px',textAlign:'right'}},
                          React.createElement('div',{style:{fontWeight:700,color:JK[jj]}},euro(v)),
                          React.createElement('div',{style:{fontSize:10,color:'#78909C'}},pct+'% van '+euroK(tot))
                        );
                      }),
                      (function(){var v25=getPG(2025,cat.pg)+getPG(2025,cat.pgwp),v26=getPG(2026,cat.pg)+getPG(2026,cat.pgwp),d=v25>0?Math.round((v26-v25)/v25*100):null;return React.createElement('td',{style:{padding:'8px 12px',textAlign:'right',fontWeight:700,color:d===null?'#78909C':d>=0?'#2E7D32':'#F44336'}},d===null?'-':(d>=0?'+':'')+d+'%');})()
                    );
                  }).concat([React.createElement('tr',{key:'tot',style:{background:'#FFFFFF',borderTop:'2px solid #D0D9E0'}},
                    React.createElement('td',{style:{padding:'8px 12px',fontWeight:900}},'Eten + Drinken totaal'),
                    [2024,2025,2026].map(function(jj){var v=['Eten','Eten wp','Drinken','Drinken wp'].reduce(function(s,p){return s+getPG(jj,p);},0),tot=getJT(jj),pct=tot>0?(v/tot*100).toFixed(1):'0';return React.createElement('td',{key:jj,style:{padding:'8px 12px',textAlign:'right'}},React.createElement('div',{style:{fontWeight:900,color:JK[jj]}},euroK(v)),React.createElement('div',{style:{fontSize:10,color:'#78909C'}},pct+'% van '+euroK(tot)));}),
                    (function(){var v25=['Eten','Eten wp','Drinken','Drinken wp'].reduce(function(s,p){return s+getPG(2025,p);},0),v26=['Eten','Eten wp','Drinken','Drinken wp'].reduce(function(s,p){return s+getPG(2026,p);},0),d=v25>0?Math.round((v26-v25)/v25*100):null;return React.createElement('td',{style:{padding:'8px 12px',textAlign:'right',fontWeight:900,color:d===null?'#78909C':d>=0?'#2E7D32':'#F44336'}},d===null?'-':(d>=0?'+':'')+d+'%');})()
                  )])
                )
              )
            )
          ),

          // 2. DEF vs DEF+OPTIE
          React.createElement('div',{style:{background:'#fff',borderRadius:10,padding:20,marginBottom:16}},
            React.createElement('div',{style:{fontWeight:700,fontSize:14,marginBottom:4,color:'#234756'}},'\ud83d\udcca 2026 Keuken — DEF vs DEF+OPTIE'),
            React.createElement('div',{style:{fontSize:11,color:'#78909C',marginBottom:16}},'Keuken = BBQ+Lunch (Eten) + Borrel (Drinken) · Groeifactor YTD: '+Math.round(gf*100)+'%'),
            React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}},
              React.createElement('div',{style:{background:'#E3F2FD',borderRadius:10,padding:16,borderLeft:'5px solid #1565C0'}},
                React.createElement('div',{style:{fontSize:10,fontWeight:700,color:'#1565C0',marginBottom:4,letterSpacing:1}},'\u2713 2026 DEFINITIEF'),
                React.createElement('div',{style:{fontSize:26,fontWeight:900,color:'#1565C0'}},euro(def26)),
                React.createElement('div',{style:{fontSize:10,color:'#78909C',marginTop:6}},
                  '\u25cf Actueel: '+euroK(ytd26)+'  \u25cb Toekomst: '+euroK(tok26))
              ),
              React.createElement('div',{style:{background:'#FFF3E0',borderRadius:10,padding:16,borderLeft:'5px solid #FF6F00'}},
                React.createElement('div',{style:{fontSize:10,fontWeight:700,color:'#FF6F00',marginBottom:8,letterSpacing:1}},'\ud83c\udf7d ETEN  vs  \ud83c\udf7a DRINKEN'),
                React.createElement('div',{style:{display:'flex',gap:12}},
                  React.createElement('div',null,
                    React.createElement('div',{style:{fontSize:11,fontWeight:700,color:'#BF360C'}},'Eten'),
                    React.createElement('div',{style:{fontSize:18,fontWeight:900,color:'#BF360C'}},euroK(eten26)),
                    React.createElement('div',{style:{fontSize:10,color:'#78909C'}},eten26+drnk26>0?Math.round(eten26/(eten26+drnk26)*100)+'%':'-')
                  ),
                  React.createElement('div',null,
                    React.createElement('div',{style:{fontSize:11,fontWeight:700,color:'#0D47A1'}},'Drinken'),
                    React.createElement('div',{style:{fontSize:18,fontWeight:900,color:'#0D47A1'}},euroK(drnk26)),
                    React.createElement('div',{style:{fontSize:10,color:'#78909C'}},eten26+drnk26>0?Math.round(drnk26/(eten26+drnk26)*100)+'%':'-')
                  )
                )
              ),
              React.createElement('div',{style:{background:'#E8F5E9',borderRadius:10,padding:16,borderLeft:'5px solid #2E7D32'}},
                React.createElement('div',{style:{fontSize:10,fontWeight:700,color:'#2E7D32',marginBottom:4,letterSpacing:1}},'\u25cf DEF + OPTIE'),
                React.createElement('div',{style:{fontSize:26,fontWeight:900,color:'#2E7D32'}},euro(defOptie26)),
                React.createElement('div',{style:{fontSize:10,color:'#78909C',marginTop:6}},'Pipeline: '+euro(optieExtra))
              )
            )
          ),

          // 3. Prognose Eten
          React.createElement('div',{style:{background:'#fff',borderRadius:10,padding:20,marginBottom:16}},
            React.createElement('div',{style:{fontWeight:700,fontSize:14,marginBottom:4,color:'#BF360C'}},'\ud83c\udf7d Omzetprognose 2026 — Eten (BBQ + Lunch)'),
            React.createElement('div',{style:{fontSize:11,color:'#78909C',marginBottom:12}},'Donkerrood=actueel · Licht=geboekt toekomst · Bars=conservatief/basis/optimistisch'),
            (function(){
              var getE=function(jj,mn){return getFD('Eten',jj,mn);};
              var ytdE=[1,2,3,4].reduce(function(s,mn){return s+getE(2026,mn);},0);
              var futE=[5,6,7,8,9,10,11,12].reduce(function(s,mn){return s+getE(2026,mn);},0);
              var tot25E=[1,2,3,4,5,6,7,8,9,10,11,12].reduce(function(s,mn){return s+getE(2025,mn);},0);
              var allV=[1,2,3,4,5,6,7,8,9,10,11,12].map(function(mn){return Math.max(getE(2026,mn),getE(2025,mn)*scen[2].factor);});
              var maxV=Math.max.apply(null,allV)||1;
              var h=function(v){return v>0?Math.max(3,Math.round(v/maxV*90)):0;};
              return React.createElement('div',null,
                React.createElement('div',{style:{display:'flex',gap:3,alignItems:'flex-end',height:100,overflowX:'auto',marginBottom:12}},
                  [1,2,3,4,5,6,7,8,9,10,11,12].map(function(mn){
                    var act=mn<=maandNu?getE(2026,mn):0,bk=mn>maandNu?getE(2026,mn):0,v25=getE(2025,mn);
                    return React.createElement('div',{key:mn,style:{display:'flex',flexDirection:'column',alignItems:'center',flex:1,minWidth:28}},
                      React.createElement('div',{style:{display:'flex',gap:1,alignItems:'flex-end',height:94}},
                        act>0&&React.createElement('div',{title:'Actueel '+MN[mn-1]+': '+euro(act),style:{width:10,height:h(act),background:'#BF360C',borderRadius:'1px 1px 0 0'}}),
                        bk>0&&React.createElement('div',{title:'Geboekt: '+euro(bk),style:{width:10,height:h(bk),background:'#FFAB91',borderRadius:'1px 1px 0 0'}}),
                        mn>maandNu&&React.createElement('div',{style:{display:'flex',gap:1,alignItems:'flex-end'}},
                          scen.map(function(s){var sv=Math.max(bk,v25*s.factor);return React.createElement('div',{key:s.key,title:s.label+': '+euro(sv),style:{width:4,height:h(sv),background:s.color,borderRadius:'1px 1px 0 0',opacity:0.8}});})
                        )
                      ),
                      React.createElement('div',{style:{fontSize:8,color:'#78909C',marginTop:2}},MN[mn-1])
                    );
                  })
                ),
                React.createElement('table',{className:'kr-table',style:{width:'100%',borderCollapse:'collapse',fontSize:11}},
                  React.createElement('thead',null,React.createElement('tr',{style:{background:'#FFEBEE'}},
                    ['Scenario','YTD','Geboekt','Prognose rest','Jaarprognose','vs 2025'].map(function(h,i){return React.createElement('th',{key:i,style:{padding:'6px 10px',textAlign:i>0?'right':'left',color:i===0?'#BF360C':'#78909C',fontWeight:700}},h);})
                  )),
                  React.createElement('tbody',null,scen.map(function(s){
                    var rest=[5,6,7,8,9,10,11,12].reduce(function(acc,mn){return acc+Math.max(0,getE(2025,mn)*s.factor-getE(2026,mn));},0);
                    var jp=ytdE+futE+rest,vs=tot25E>0?Math.round((jp/tot25E-1)*100):0;
                    return React.createElement('tr',{key:s.key,style:{borderBottom:'1px solid #F0F4F6',background:s.bg}},
                      React.createElement('td',{style:{padding:'6px 10px',fontWeight:700,color:s.color}},s.label),
                      React.createElement('td',{style:{padding:'6px 10px',textAlign:'right',color:'#BF360C',fontWeight:700}},euroK(ytdE)),
                      React.createElement('td',{style:{padding:'6px 10px',textAlign:'right',color:'#FFAB91',fontWeight:700}},euroK(futE)),
                      React.createElement('td',{style:{padding:'6px 10px',textAlign:'right',color:s.color,fontWeight:700}},euroK(rest)),
                      React.createElement('td',{style:{padding:'6px 10px',textAlign:'right',fontSize:13,fontWeight:900,color:s.color}},euro(jp)),
                      React.createElement('td',{style:{padding:'6px 10px',textAlign:'right',fontWeight:700,color:vs>=0?'#2E7D32':'#F44336'}},(vs>=0?'+':'')+vs+'%')
                    );
                  }))
                )
              );
            })()
          ),

          // 4. Prognose Drinken
          React.createElement('div',{style:{background:'#fff',borderRadius:10,padding:20}},
            React.createElement('div',{style:{fontWeight:700,fontSize:14,marginBottom:4,color:'#0D47A1'}},'\ud83c\udf7a Omzetprognose 2026 — Drinken (Borrel)'),
            React.createElement('div',{style:{fontSize:11,color:'#78909C',marginBottom:12}},'Donkerblauw=actueel · Lichtblauw=geboekt toekomst · Bars=scenario'),
            (function(){
              var getD=function(jj,mn){return getFD('Drinken',jj,mn);};
              var ytdD=[1,2,3,4].reduce(function(s,mn){return s+getD(2026,mn);},0);
              var futD=[5,6,7,8,9,10,11,12].reduce(function(s,mn){return s+getD(2026,mn);},0);
              var tot25D=[1,2,3,4,5,6,7,8,9,10,11,12].reduce(function(s,mn){return s+getD(2025,mn);},0);
              var allV=[1,2,3,4,5,6,7,8,9,10,11,12].map(function(mn){return Math.max(getD(2026,mn),getD(2025,mn)*scen[2].factor);});
              var maxV=Math.max.apply(null,allV)||1;
              var h=function(v){return v>0?Math.max(3,Math.round(v/maxV*90)):0;};
              return React.createElement('div',null,
                React.createElement('div',{style:{display:'flex',gap:3,alignItems:'flex-end',height:100,overflowX:'auto',marginBottom:12}},
                  [1,2,3,4,5,6,7,8,9,10,11,12].map(function(mn){
                    var act=mn<=maandNu?getD(2026,mn):0,bk=mn>maandNu?getD(2026,mn):0,v25=getD(2025,mn);
                    return React.createElement('div',{key:mn,style:{display:'flex',flexDirection:'column',alignItems:'center',flex:1,minWidth:28}},
                      React.createElement('div',{style:{display:'flex',gap:1,alignItems:'flex-end',height:94}},
                        act>0&&React.createElement('div',{title:'Actueel: '+euro(act),style:{width:10,height:h(act),background:'#0D47A1',borderRadius:'1px 1px 0 0'}}),
                        bk>0&&React.createElement('div',{title:'Geboekt: '+euro(bk),style:{width:10,height:h(bk),background:'#90CAF9',borderRadius:'1px 1px 0 0'}}),
                        mn>maandNu&&React.createElement('div',{style:{display:'flex',gap:1,alignItems:'flex-end'}},
                          scen.map(function(s){var sv=Math.max(bk,v25*s.factor);return React.createElement('div',{key:s.key,title:s.label+': '+euro(sv),style:{width:4,height:h(sv),background:s.color,borderRadius:'1px 1px 0 0',opacity:0.8}});})
                        )
                      ),
                      React.createElement('div',{style:{fontSize:8,color:'#78909C',marginTop:2}},MN[mn-1])
                    );
                  })
                ),
                React.createElement('table',{className:'kr-table',style:{width:'100%',borderCollapse:'collapse',fontSize:11}},
                  React.createElement('thead',null,React.createElement('tr',{style:{background:'#E3F2FD'}},
                    ['Scenario','YTD','Geboekt','Prognose rest','Jaarprognose','vs 2025'].map(function(h,i){return React.createElement('th',{key:i,style:{padding:'6px 10px',textAlign:i>0?'right':'left',color:i===0?'#0D47A1':'#78909C',fontWeight:700}},h);})
                  )),
                  React.createElement('tbody',null,scen.map(function(s){
                    var rest=[5,6,7,8,9,10,11,12].reduce(function(acc,mn){return acc+Math.max(0,getD(2025,mn)*s.factor-getD(2026,mn));},0);
                    var jp=ytdD+futD+rest,vs=tot25D>0?Math.round((jp/tot25D-1)*100):0;
                    return React.createElement('tr',{key:s.key,style:{borderBottom:'1px solid #F0F4F6',background:s.bg}},
                      React.createElement('td',{style:{padding:'6px 10px',fontWeight:700,color:s.color}},s.label),
                      React.createElement('td',{style:{padding:'6px 10px',textAlign:'right',color:'#0D47A1',fontWeight:700}},euroK(ytdD)),
                      React.createElement('td',{style:{padding:'6px 10px',textAlign:'right',color:'#90CAF9',fontWeight:700}},euroK(futD)),
                      React.createElement('td',{style:{padding:'6px 10px',textAlign:'right',color:s.color,fontWeight:700}},euroK(rest)),
                      React.createElement('td',{style:{padding:'6px 10px',textAlign:'right',fontSize:13,fontWeight:900,color:s.color}},euro(jp)),
                      React.createElement('td',{style:{padding:'6px 10px',textAlign:'right',fontWeight:700,color:vs>=0?'#2E7D32':'#F44336'}},(vs>=0?'+':'')+vs+'%')
                    );
                  }))
                )
              );
            })()
          )
        );
      })(),




      // Laatste imports
      imports.length > 0 && React.createElement('div', { style:{marginTop:16,background:C.white,borderRadius:10,padding:16} },
        React.createElement('div', { style:{fontWeight:700,fontSize:12,color:C.muted,letterSpacing:1,marginBottom:10} }, 'IMPORT GESCHIEDENIS'),
        imports.map(function(imp) {
          return React.createElement('div', { key:imp.id, style:{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #F0F4F6',fontSize:12,flexWrap:'wrap',gap:4} },
            React.createElement('span', { style:{color:C.night,fontWeight:700} }, imp.import_datum + ' \u2014 ' + (imp.periode_van||'?') + ' t/m ' + (imp.periode_tot||'?')),
            React.createElement('span', { style:{color:C.muted} }, imp.totaal_boekingen + ' boekingen \u2022 ' + imp.totaal_regels + ' regels \u2022 ' + euro(imp.totaal_omzet||0))
          );
        })
      )

    ) // einde !laden && regels.length > 0
  );
}

  window._FinancieelScreen = FinancieelScreen;
})();


// ===== geboekte-producten-screen.js (1108 bytes) =====
// KitchenRobot module: geboekte-producten-screen.js
// Geextraheerd uit index.html op 2026-05-05T10:13:58.393Z (v9 AST-walk)
// Bevat: GeboekteProductenScreen
// Externe refs (via window._): GeboekteProductenTab
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function GeboekteProductenScreen() {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: C.night, marginBottom: 4 } }, "🛒 Geboekte producten"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: C.muted } }, "Automatisch berekende Sligro-benodigdheden op basis van ge\xEFmporteerde boekingen per keuken.")), /* @__PURE__ */ React.createElement(window._GeboekteProductenTab, { standalone: true }));
}

  window._GeboekteProductenScreen = GeboekteProductenScreen;
})();


// ===== haccp-instellingen-screen.js (6863 bytes) =====
// KitchenRobot module: haccp-instellingen-screen.js
// Geextraheerd uit index.html op 2026-05-05T12:48:38.098Z (self-exposed dedicated-script, soort: iife)
// Bevat: HACCPInstellingenScreen
(function(){
  if(!window.React) return;
  var R = window.React.createElement;
  var useState = window.React.useState;
  var useEffect = window.React.useEffect;

  var FLD={fontSize:11,color:'#6E8591',textTransform:'uppercase',letterSpacing:'.04em',fontWeight:600,marginBottom:4,display:'block'};
  var INP={width:'100%',padding:'8px 10px',border:'1px solid #AEC5D1',borderRadius:4,fontSize:13,fontFamily:'inherit',background:'white',boxSizing:'border-box'};
  var TAB=function(actief){return {padding:'10px 22px',cursor:'pointer',borderBottom:actief?'3px solid #002D41':'3px solid transparent',fontWeight:actief?700:500,color:actief?'#002D41':'#6E8591',background:'transparent',border:'none',fontSize:14,marginBottom:-1};};
  var CARD={background:'white',padding:'20px 26px',borderRadius:8,boxShadow:'0 1px 3px rgba(0,0,0,.06)',marginBottom:14};
  var GRID2={display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px 22px'};
  var H={fontSize:14,fontWeight:700,color:'#002D41',margin:'0 0 12px 0',paddingBottom:6,borderBottom:'1px solid #E0E8EE',gridColumn:'1 / -1'};

  window._HACCPInstellingenScreen = function HACCPInstellingenScreen(){
    var os = useState('weesp'); var outlet = os[0]; var setOutlet = os[1];
    var fs = useState(null); var form = fs[0]; var setForm = fs[1];
    var ls = useState(true); var laadt = ls[0]; var setLaadt = ls[1];
    var ss = useState(false); var bewaard = ss[0]; var setBewaard = ss[1];
    var fS = useState(null); var fout = fS[0]; var setFout = fS[1];
    var bS = useState(false); var bewaarBezig = bS[0]; var setBewaarBezig = bS[1];

    useEffect(function(){
      if(!window._supa) return;
      setLaadt(true); setFout(null); setBewaard(false);
      window._supa.from('haccp_instellingen').select('*').eq('outlet_code',outlet).maybeSingle()
        .then(function(r){
          if(r.error){ setFout(r.error.message); }
          else { setForm(r.data || {outlet_code: outlet}); }
          setLaadt(false);
        });
    },[outlet]);

    function veld(key){ return (form && form[key] != null) ? form[key] : ''; }
    function setVeld(key, v){
      var nieuw = Object.assign({}, form || {});
      nieuw[key] = v;
      nieuw.outlet_code = outlet;
      setForm(nieuw);
      setBewaard(false);
    }

    function bewaar(){
      if(!window._supa || !form) return;
      setBewaarBezig(true); setFout(null);
      var payload = Object.assign({}, form, {outlet_code: outlet, gewijzigd_op: new Date().toISOString()});
      window._supa.from('haccp_instellingen').upsert(payload, {onConflict:'outlet_code'}).select().maybeSingle()
        .then(function(r){
          setBewaarBezig(false);
          if(r.error){ setFout(r.error.message); }
          else {
            setForm(r.data);
            setBewaard(true);
            if(window.kr && window.kr.toast) window.kr.toast('Bedrijfsgegevens opgeslagen','success');
          }
        });
    }

    function inputVeld(key, label, type){
      type = type || 'text';
      return R('label',null,
        R('span',{style:FLD}, label),
        R('input',{type:type, value:veld(key), onChange:function(e){setVeld(key, e.target.value);}, style:INP})
      );
    }

    var outletNaam = outlet === 'west' ? 'Amsterdam West' : 'Weesp';

    return R('div',{style:{padding:20,maxWidth:980,margin:'0 auto',color:'#234756'}},
      R('h1',{style:{fontSize:22,fontWeight:600,color:'#002D41',margin:'0 0 6px 0'}},'🏥 HACCP Bedrijfsgegevens'),
      R('div',{style:{color:'#6E8591',fontSize:13,marginBottom:18,lineHeight:1.5}},'Deze gegevens worden automatisch gebruikt op het NVWA-rapport (zowel het overzicht in admin als de exporteerbare PDF). Vul beide vestigingen in.'),
      R('div',{style:{borderBottom:'1px solid #D8E8EF',marginBottom:18,display:'flex',gap:4}},
        R('button',{onClick:function(){setOutlet('west');},style:TAB(outlet==='west')},'Amsterdam West'),
        R('button',{onClick:function(){setOutlet('weesp');},style:TAB(outlet==='weesp')},'Weesp')
      ),
      fout && R('div',{style:{padding:14,background:'#FFEBEE',color:'#C62828',borderRadius:4,marginBottom:14,fontSize:13}},'Fout: '+fout),
      laadt && R('div',{style:{padding:30,textAlign:'center',color:'#6E8591'}},'Laden...'),
      !laadt && form && R('div',null,
        R('div',{style:CARD},
          R('div',{style:GRID2},
            R('h3',{style:H},'Bedrijfsgegevens — '+outletNaam),
            inputVeld('bedrijfsnaam','Bedrijfsnaam'),
            inputVeld('kvk_nummer','KvK-nummer'),
            inputVeld('btw_nummer','BTW-nummer'),
            inputVeld('vestigingsnummer','Vestigingsnummer (optioneel)')
          )
        ),
        R('div',{style:CARD},
          R('div',{style:GRID2},
            R('h3',{style:H},'Adres'),
            R('label',{style:{gridColumn:'1 / -1'}},R('span',{style:FLD},'Straat + huisnummer'),R('input',{type:'text',value:veld('adres'),onChange:function(e){setVeld('adres',e.target.value);},style:INP})),
            inputVeld('postcode','Postcode'),
            inputVeld('plaats','Plaats')
          )
        ),
        R('div',{style:CARD},
          R('div',{style:GRID2},
            R('h3',{style:H},'Contact'),
            inputVeld('telefoon','Telefoon','tel'),
            inputVeld('email','E-mail','email')
          )
        ),
        R('div',{style:CARD},
          R('div',{style:GRID2},
            R('h3',{style:H},'Verantwoordelijke voedselveiligheid'),
            inputVeld('verantwoordelijke_naam','Naam'),
            inputVeld('verantwoordelijke_functie','Functie')
          )
        ),
        R('div',{style:CARD},
          R('div',{style:GRID2},
            R('h3',{style:H},'Vervanger (bij afwezigheid)'),
            inputVeld('vervanger_naam','Naam'),
            inputVeld('vervanger_functie','Functie')
          )
        ),
        R('div',{style:CARD},
          R('label',null,
            R('span',{style:FLD},'Toelichting bij rapport (optioneel)'),
            R('textarea',{rows:3,value:veld('toelichting_rapport'),onChange:function(e){setVeld('toelichting_rapport',e.target.value);},style:Object.assign({},INP,{fontFamily:'inherit',resize:'vertical'})})
          )
        ),
        R('div',{style:{display:'flex',justifyContent:'flex-end',gap:14,alignItems:'center',marginTop:18}},
          bewaard && R('span',{style:{color:'#2E7D32',fontSize:13,fontWeight:600}},'✓ Opgeslagen'),
          R('button',{onClick:bewaar,disabled:bewaarBezig,style:{padding:'11px 28px',background:bewaarBezig?'#6E8591':'#002D41',color:'white',border:'none',borderRadius:4,fontSize:14,fontWeight:600,cursor:bewaarBezig?'wait':'pointer'}}, bewaarBezig ? 'Bezig...' : 'Opslaan')
        )
      )
    );
  };
})();



// ===== haccp-screen.js (14057 bytes) =====
// KitchenRobot module: haccp-screen.js
// Geextraheerd uit index.html op 2026-05-05T06:50:46.414Z
// Bevat: HACCPScreen
// Externe refs (via window._): (geen)
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function HACCPScreen() {
  var [haccpMetingen, setHaccpMetingen] = useState([]);
  var [taakRegistraties, setTaakRegistraties] = useState([]);
  var [haccpLaden, setHaccpLaden] = useState(false);
  var [haccpPeriodeVan, setHaccpPeriodeVan] = useState(function() {
    var d = /* @__PURE__ */ new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  });
  var [haccpPeriodeTot, setHaccpPeriodeTot] = useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  var [haccpOutlet, setHaccpOutlet] = useState("alle");
  var [actievTab, setActievTab] = useState("temperatuur");
  function laadMetingen() {
    setHaccpLaden(true);
    var q = window._supa.from("kiosk_haccp_metingen").select("*").gte("gemeten_op", haccpPeriodeVan + "T00:00:00").lte("gemeten_op", haccpPeriodeTot + "T23:59:59").order("gemeten_op", { ascending: false });
    if (haccpOutlet !== "alle") q = q.eq("outlet_code", haccpOutlet);
    var q2 = window._supa.from("kiosk_registraties").select("*, kiosk_taak_templates(naam,frequentie,type)").gte("afgetekend_op", haccpPeriodeVan + "T00:00:00").lte("afgetekend_op", haccpPeriodeTot + "T23:59:59").order("afgetekend_op", { ascending: false });
    if (haccpOutlet !== "alle") q2 = q2.eq("outlet_code", haccpOutlet);
    Promise.all([q, q2]).then(function(results) {
      setHaccpMetingen(results[0].data || []);
      setTaakRegistraties(results[1].data || []);
      setHaccpLaden(false);
    });
  }
  var totaal = haccpMetingen.length;
  var afwijkingen = haccpMetingen.filter(function(m) {
    return m.binnen_norm === false;
  }).length;
  var gecorrigeerd = haccpMetingen.filter(function(m) {
    return m.correctieve_actie;
  }).length;
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: C.night, marginBottom: 4 } }, "🌡 HACCP Inspectierapport"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: C.muted } }, "Temperatuurmetingen \xE9n afgetekende taken — exporteerbaar voor de NVWA inspecteur.")), /* @__PURE__ */ React.createElement("div", { style: { ...SS.card, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "end" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Periode van"), /* @__PURE__ */ React.createElement("input", { type: "date", style: SS.inp, value: haccpPeriodeVan, onChange: function(e) {
    setHaccpPeriodeVan(e.target.value);
  } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Periode tot"), /* @__PURE__ */ React.createElement("input", { type: "date", style: SS.inp, value: haccpPeriodeTot, onChange: function(e) {
    setHaccpPeriodeTot(e.target.value);
  } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Keuken"), /* @__PURE__ */ React.createElement("select", { style: SS.inp, value: haccpOutlet, onChange: function(e) {
    setHaccpOutlet(e.target.value);
  } }, /* @__PURE__ */ React.createElement("option", { value: "alle" }, "Alle keukens"), /* @__PURE__ */ React.createElement("option", { value: "west" }, "Amsterdam West"), /* @__PURE__ */ React.createElement("option", { value: "weesp" }, "Weesp"))), /* @__PURE__ */ React.createElement("button", { style: SS.btnP, onClick: laadMetingen }, haccpLaden ? "Laden..." : `Laden`))), (totaal > 0 || taakRegistraties.length > 0) && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" } }, [["temperatuur", "🌡 Temperaturen (" + totaal + ")"], ["taken", "\u2705 Taken (" + taakRegistraties.length + ")"]].map(function(tb) {
    var act = actievTab === tb[0];
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: tb[0],
        style: { ...SS.btn, background: act ? C.night : "#fff", color: act ? "#fff" : C.night, border: "1px solid " + (act ? C.night : C.border), fontWeight: act ? 700 : 400, padding: "7px 16px", fontSize: 12 },
        onClick: function() {
          setActievTab(tb[0]);
        }
      },
      tb[1]
    );
  }), /* @__PURE__ */ React.createElement("div", { style: { marginLeft: "auto", display: "flex", gap: 8 } }, actievTab === "temperatuur" && totaal > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { style: SS.btnP, onClick: function() {
    if (typeof XLSX === "undefined") return;
    var rijen = haccpMetingen.map(function(m) {
      return { Datum: m.gemeten_op ? new Date(m.gemeten_op).toLocaleString("nl-NL") : "", Outlet: m.outlet_code === "west" ? "Amsterdam West" : "Weesp", Controlepunt: m.punt_naam, Meting: m.gemeten_temp !== null ? m.gemeten_temp + "\xB0C" : "", Min: m.min_norm !== null ? m.min_norm + "\xB0C" : "", Max: m.max_norm !== null ? m.max_norm + "\xB0C" : "", Resultaat: m.binnen_norm === true ? "OK" : m.binnen_norm === false ? "AFWIJKING" : "—", Opmerking: m.afwijking_opmerking || "", Correctieve_actie: m.correctieve_actie || "", Medewerker: m.medewerker_naam || "" };
    });
    var ws = XLSX.utils.json_to_sheet(rijen);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "HACCP Temp");
    XLSX.writeFile(wb, "HACCP_temp_" + haccpPeriodeVan + "_" + haccpPeriodeTot + ".xlsx");
  } }, "📊 Excel temp."), /* @__PURE__ */ React.createElement("button", { style: SS.btn, onClick: function() {
    window.print();
  } }, "🖨 Print")), actievTab === "taken" && taakRegistraties.length > 0 && /* @__PURE__ */ React.createElement("button", { style: SS.btnP, onClick: function() {
    if (typeof XLSX === "undefined") return;
    var rijen = taakRegistraties.map(function(r) {
      var tmpl = r.kiosk_taak_templates || {};
      return { Datum: r.afgetekend_op ? new Date(r.afgetekend_op).toLocaleString("nl-NL") : "", Outlet: r.outlet_code === "west" ? "Amsterdam West" : "Weesp", Taak: tmpl.naam || r.taak_template_id, Frequentie: tmpl.frequentie || "", Type: tmpl.type || "", Medewerker: r.medewerker_naam || "", Status: "Afgetekend", Opmerking: r.opmerking || "" };
    });
    var ws = XLSX.utils.json_to_sheet(rijen);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "HACCP Taken");
    XLSX.writeFile(wb, "HACCP_taken_" + haccpPeriodeVan + "_" + haccpPeriodeTot + ".xlsx");
  } }, "📊 Excel taken"))), actievTab === "temperatuur" && totaal > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 } }, [["Totaal metingen", totaal, C.aqua], ["Binnen norm", totaal - afwijkingen, C.green], ["Afwijkingen", afwijkingen, afwijkingen > 0 ? C.hot : C.green], ["Correctief gedoc.", gecorrigeerd, C.night]].map(function(s) {
    return /* @__PURE__ */ React.createElement("div", { key: s[0], style: { ...SS.card, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 } }, s[0]), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, fontWeight: 900, color: s[2] } }, s[1]));
  })), actievTab === "taken" && taakRegistraties.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 } }, (function() {
    var dag = taakRegistraties.filter(function(r) {
      return r.kiosk_taak_templates && r.kiosk_taak_templates.frequentie === "dagelijks";
    }).length;
    var wek = taakRegistraties.filter(function(r) {
      return r.kiosk_taak_templates && r.kiosk_taak_templates.frequentie === "wekelijks";
    }).length;
    return [["Totaal afgetekend", taakRegistraties.length, C.aqua], ["Dagelijkse taken", dag, C.green], ["Wekelijkse taken", wek, C.night]];
  })().map(function(s) {
    return /* @__PURE__ */ React.createElement("div", { key: s[0], style: { ...SS.card, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 } }, s[0]), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, fontWeight: 900, color: s[2] } }, s[1]));
  })), haccpLaden && /* @__PURE__ */ React.createElement("div", { style: { padding: 30, textAlign: "center", color: C.muted } }, "Laden..."), !haccpLaden && totaal === 0 && taakRegistraties.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { ...SS.card, textAlign: "center", padding: 40, color: C.muted } }, "Kies een periode en klik op Laden. Temperatuurmetingen en afgetekende taken worden beide geladen."), actievTab === "temperatuur" && totaal > 0 && /* @__PURE__ */ React.createElement("table", { className:"kr-table", style: { ...SS.tbl, fontSize: 12 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, ["Datum/tijd", "Keuken", "Controlepunt", "Meting", "Norm", "Resultaat", "Correctieve actie", "Medewerker"].map(function(h) {
    return /* @__PURE__ */ React.createElement("th", { key: h, style: SS.th }, h);
  }))), /* @__PURE__ */ React.createElement("tbody", null, haccpMetingen.map(function(m) {
    var isOk = m.binnen_norm === true;
    var isAfw = m.binnen_norm === false;
    return /* @__PURE__ */ React.createElement("tr", { key: m.id, style: { background: isAfw ? "#FFF5F5" : C.white } }, /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11, whiteSpace: "nowrap", color: C.muted } }, m.gemeten_op ? new Date(m.gemeten_op).toLocaleString("nl-NL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11 } }, m.outlet_code === "west" ? "West" : "Weesp"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 600 } }, m.punt_naam), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 900, color: isAfw ? C.hot : isOk ? C.green : C.muted, fontSize: 13 } }, m.gemeten_temp !== null ? m.gemeten_temp + "\xB0C" : "—"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11, color: C.muted } }, m.min_norm !== null ? m.min_norm + "\xB0C \u2013 " + m.max_norm + "\xB0C" : "—"), /* @__PURE__ */ React.createElement("td", { style: SS.td }, isAfw ? /* @__PURE__ */ React.createElement("span", { style: { background: "#FFEBEE", color: C.hot, borderRadius: 8, padding: "1px 7px", fontSize: 10, fontWeight: 700 } }, "\u26A0 Afwijking") : isOk ? /* @__PURE__ */ React.createElement("span", { style: { background: "#E8F5E9", color: C.green, borderRadius: 8, padding: "1px 7px", fontSize: 10, fontWeight: 700 } }, "✓ OK") : /* @__PURE__ */ React.createElement("span", { style: { color: C.muted, fontSize: 11 } }, "—")), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11, color: isAfw && !m.correctieve_actie ? C.hot : C.muted } }, m.correctieve_actie || (isAfw ? "\u26A0 Niet gedocumenteerd" : "—")), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11, color: C.muted } }, m.medewerker_naam || "—"));
  }))), actievTab === "taken" && taakRegistraties.length > 0 && /* @__PURE__ */ React.createElement("table", { className:"kr-table", style: { ...SS.tbl, fontSize: 12 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, ["Datum/tijd", "Keuken", "Taak", "Frequentie", "Type", "Medewerker", "Tijdstip"].map(function(h) {
    return /* @__PURE__ */ React.createElement("th", { key: h, style: SS.th }, h);
  }))), /* @__PURE__ */ React.createElement("tbody", null, taakRegistraties.map(function(r) {
    var tmpl = r.kiosk_taak_templates || {};
    var freq = tmpl.frequentie || "";
    var freqKl = { dagelijks: C.hot, wekelijks: C.aqua, maandelijks: "#FF9800", jaarlijks: C.muted }[freq] || C.muted;
    return /* @__PURE__ */ React.createElement("tr", { key: r.id }, /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11, whiteSpace: "nowrap", color: C.muted } }, r.afgetekend_op ? new Date(r.afgetekend_op).toLocaleString("nl-NL", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11 } }, r.outlet_code === "west" ? "West" : "Weesp"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 700 } }, tmpl.naam || r.taak_template_id), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("span", { style: { background: freqKl + "22", color: freqKl, borderRadius: 8, padding: "1px 6px", fontSize: 10, fontWeight: 700 } }, freq || "—")), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, color: C.muted, fontSize: 11 } }, tmpl.type || "—"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11 } }, r.medewerker_naam || "—"), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("span", { style: { background: "#E8F5E9", color: C.green, borderRadius: 8, padding: "1px 7px", fontSize: 10, fontWeight: 700 } }, "✓ ", r.afgetekend_op ? new Date(r.afgetekend_op).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }) : "Afgetekend")));
  }))));
}

  window._HACCPScreen = HACCPScreen;
})();


// ===== home-screen.js (72526 bytes) =====
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


// ===== inspiratie.js (15646 bytes) =====
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


// ===== instructies-tab.js (15056 bytes) =====
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


// ===== kiosk-beheer-tab.js (44226 bytes) =====
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


// ===== live-dashboard-blok.js (30653 bytes) =====
// KitchenRobot module: live-dashboard-blok.js
// Geextraheerd uit index.html op 2026-05-05T08:50:14.408Z
// Bevat: LiveDashboardBlok
// Externe refs (via window._): (geen)
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function LiveDashboardBlok({ outletFilter }) {
  var C = window._C || { night:'#234756', aqua:'#3FB8C4', hot:'#E8202B', green:'#2E7D32', muted:'#78909C', white:'#fff', orange:'#FF9800' };
  var [data, setData] = React.useState(null);
  var [marge, setMarge] = React.useState(null);
  var [margeTop, setMargeTop] = React.useState([]);
  var [margeBottom, setMargeBottom] = React.useState([]);
  var [waste, setWaste] = React.useState(null);
  var [sparkline, setSparkline] = React.useState([]);
  var [hoverIdx, setHoverIdx] = React.useState(null);
  var [forecastTrend, setForecastTrend] = React.useState(null);
  var [volume, setVolume] = React.useState([]);
  var [outletVerdeling, setOutletVerdeling] = React.useState([]);
  var [weekpatroon, setWeekpatroon] = React.useState([]);
  var [margeTotaal, setMargeTotaal] = React.useState(null);
  var [margePerPs, setMargePerPs] = React.useState([]);
  var [productsoortYtd, setProductsoortYtd] = React.useState([]);
  var [laatstUpdate, setLaatstUpdate] = React.useState(null);
  var [fout, setFout] = React.useState(null);

  function laad() {
    if (!window._supa) return;
    var bron = outletFilter === 'beide' ? 'v_fin_dashboard_totaal' : 'v_fin_dashboard';
    var q = window._supa.from(bron).select('*');
    if (outletFilter !== 'beide') q = q.eq('outlet_code', outletFilter);
    q.then(function(res) {
      if (res.error) { setFout(res.error.message || 'fout'); return; }
      var rij = (res.data && res.data[0]) || {};
      setData(rij);
      setLaatstUpdate(new Date());
      setFout(null);
    });
    // Marge samenvatting
    window._supa.from('v_fin_dashboard_marge').select('*').then(function(res) {
      if (!res.error && res.data && res.data[0]) setMarge(res.data[0]);
    });
    // Top 3 + bottom 3 marge
    window._supa.from('menu_engineering').select('menu_naam,marge_pct,classificatie').gt('verkoop_prijs', 0).not('marge_pct', 'is', null).order('marge_pct', { ascending: false }).limit(3).then(function(res) {
      if (!res.error) setMargeTop(res.data || []);
    });
    window._supa.from('menu_engineering').select('menu_naam,marge_pct,classificatie').gt('verkoop_prijs', 0).not('marge_pct', 'is', null).eq('alert_actief', true).order('marge_pct', { ascending: true }).limit(3).then(function(res) {
      if (!res.error) setMargeBottom(res.data || []);
    });
    // Waste
    var wq = window._supa.from('v_fin_dashboard_waste').select('*');
    if (outletFilter !== 'beide') wq = wq.eq('outlet_code', outletFilter);
    wq.then(function(res) {
      if (res.error) return;
      var wrij = null;
      if (outletFilter === 'beide') {
        wrij = (res.data || []).find(function(r){ return r.outlet_code === 'beide' || r.outlet_code === null; }) || { n_registraties_30d:0, kosten_30d:0, kosten_7d:0 };
      } else {
        wrij = (res.data && res.data[0]) || { n_registraties_30d:0, kosten_30d:0, kosten_7d:0 };
      }
      setWaste(wrij);
    });
    // Sparkline 30 dagen
    var sbron = outletFilter === 'beide' ? 'v_fin_sparkline_30d_totaal' : 'v_fin_sparkline_30d';
    var sq = window._supa.from(sbron).select('dag,omzet').order('dag', { ascending: true });
    if (outletFilter !== 'beide') sq = sq.eq('outlet_code', outletFilter);
    sq.then(function(res) {
      if (!res.error) setSparkline(res.data || []);
    });
    // NIEUW: Forecast obv historie
    window._supa.from('v_fin_forecast_trend').select('*').then(function(res) {
      if (!res.error && res.data && res.data[0]) setForecastTrend(res.data[0]);
    });
    // NIEUW: Volume KPI's (huidig + vorig jaar)
    var vbron = outletFilter === 'beide' ? 'v_fin_volume_totaal' : 'v_fin_volume_kpi';
    var vq = window._supa.from(vbron).select('*').order('jaar', { ascending: false });
    if (outletFilter !== 'beide') vq = vq.eq('outlet_code', outletFilter);
    vq.then(function(res) {
      if (!res.error) setVolume(res.data || []);
    });
    // NIEUW: Outlet verdeling (altijd beide)
    window._supa.from('v_fin_outlet_verdeling').select('*').then(function(res) {
      if (!res.error) setOutletVerdeling(res.data || []);
    });
    // NIEUW: Weekpatroon
    var wpq = window._supa.from('v_fin_weekpatroon').select('*');
    if (outletFilter !== 'beide') wpq = wpq.eq('outlet_code', outletFilter);
    wpq.then(function(res) {
      if (res.error) return;
      // Aggregeer per weekdag als meerdere outlets
      var arr = res.data || [];
      var per = {};
      arr.forEach(function(r){
        var d = r.weekdag;
        if (!per[d]) per[d] = { weekdag: d, totaal: 0, n_dagen: 0 };
        per[d].totaal += parseFloat(r.totaal_omzet || 0);
        per[d].n_dagen = Math.max(per[d].n_dagen, r.n_dagen || 0);
      });
      setWeekpatroon(Object.values(per).sort(function(a,b){ return a.weekdag - b.weekdag; }));
    });
    // NIEUW: Marge totaal (altijd over alles)
    window._supa.from('v_fin_marge_totaal').select('*').then(function(res) {
      if (!res.error && res.data && res.data[0]) setMargeTotaal(res.data[0]);
    });
    // NIEUW: Marge per productsoort
    var mpq = window._supa.from('v_fin_marge_richtlijn').select('*').order('omzet', { ascending: false });
    if (outletFilter !== 'beide') mpq = mpq.eq('outlet_code', outletFilter);
    mpq.then(function(res) {
      if (!res.error) setMargePerPs(res.data || []);
    });
    // NIEUW: Productsoort YTD met vergelijking
    var psq = window._supa.from('v_fin_productsoort_ytd').select('*');
    if (outletFilter !== 'beide') psq = psq.eq('outlet_code', outletFilter);
    psq.then(function(res) {
      if (!res.error) setProductsoortYtd(res.data || []);
    });
  }

  React.useEffect(function() {
    laad();
    var t = setInterval(laad, 30000); // 30s polling
    return function(){ clearInterval(t); };
  }, [outletFilter]);

  function euro(v) {
    var n = parseFloat(v || 0);
    return '€' + Math.round(n).toLocaleString('nl-NL');
  }
  function euroKort(v) {
    var n = parseFloat(v || 0);
    if (n >= 1000000) return '€' + (n/1000000).toFixed(1) + 'M';
    if (n >= 10000) return '€' + Math.round(n/1000) + 'k';
    return '€' + Math.round(n).toLocaleString('nl-NL');
  }
  function trend(nu, vj) {
    var n = parseFloat(nu || 0); var v = parseFloat(vj || 0);
    if (v === 0 && n === 0) return null;
    if (v === 0) return { tekst: 'nieuw', kleur: C.aqua, pijl: '↗' };
    var pct = Math.round((n - v) / v * 100);
    var kleur = pct > 0 ? C.green : pct < 0 ? C.hot : C.muted;
    var pijl = pct > 5 ? '↗' : pct < -5 ? '↘' : '→';
    return { tekst: (pct > 0 ? '+' : '') + pct + '%', kleur: kleur, pijl: pijl, vj: v };
  }

  if (!data) {
    return React.createElement('div', { style:{background:C.white,borderRadius:10,padding:16,marginBottom:12,textAlign:'center',color:C.muted,fontSize:13} },
      fout ? '⚠ ' + fout : '⏳ Live dashboard laden...'
    );
  }

  function KPICard(props) {
    var t = props.trend;
    return React.createElement('div', { style:{background:C.white,borderRadius:10,padding:'14px 16px',flex:'1 1 150px',minWidth:140,position:'relative'} },
      React.createElement('div', { style:{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:1,textTransform:'uppercase',marginBottom:4} }, props.label),
      React.createElement('div', { style:{fontSize:22,fontWeight:900,color:props.kleur||C.night,lineHeight:1.1} }, props.waarde),
      t && React.createElement('div', { style:{fontSize:11,color:t.kleur,marginTop:4,fontWeight:700,display:'flex',alignItems:'center',gap:4} },
        t.pijl + ' ' + t.tekst,
        React.createElement('span', { style:{color:C.muted,fontWeight:400,marginLeft:4} }, 'vs vj ' + euroKort(t.vj))
      ),
      props.sub && !t && React.createElement('div', { style:{fontSize:11,color:C.muted,marginTop:4} }, props.sub)
    );
  }

  var updateText = laatstUpdate ? ('Live · bijgewerkt ' + String(laatstUpdate.getHours()).padStart(2,'0') + ':' + String(laatstUpdate.getMinutes()).padStart(2,'0') + ':' + String(laatstUpdate.getSeconds()).padStart(2,'0')) : 'Laden...';

  return React.createElement('div', { style:{marginBottom:16} },
    React.createElement('div', { style:{display:'flex',alignItems:'center',gap:8,marginBottom:8,fontSize:11,color:C.muted} },
      React.createElement('span', { style:{display:'inline-block',width:8,height:8,borderRadius:100,background:C.green,boxShadow:'0 0 0 3px rgba(46,125,50,.2)',animation:'pulse 2s infinite'} }),
      React.createElement('strong', { style:{color:C.green,letterSpacing:1,textTransform:'uppercase',fontSize:10} }, 'Live'),
      React.createElement('span', null, updateText),
      React.createElement('span', { style:{marginLeft:'auto',fontSize:10,background:'#F0F4F7',padding:'2px 8px',borderRadius:100,color:C.night,fontWeight:700} },
        outletFilter === 'beide' ? '🏢 Alle outlets' : (outletFilter === 'west' ? '🔵 West' : '🟢 Weesp')
      )
    ),
    // RIJ 1: Gerealiseerd (vandaag, week, mtd, ytd)
    React.createElement('div', { style:{fontSize:10,color:C.night,fontWeight:800,letterSpacing:1,textTransform:'uppercase',marginBottom:6} }, '💰 Gerealiseerd'),
    React.createElement('div', { style:{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'} },
      KPICard({ label:'Vandaag', waarde:euro(data.vandaag), kleur:C.aqua, trend: trend(data.vandaag, data.vandaag_vj) }),
      KPICard({ label:'Deze week', waarde:euro(data.week_7d), kleur:C.aqua, trend: trend(data.week_7d, data.week_vj) }),
      KPICard({ label:'Deze maand', waarde:euro(data.maand_mtd), kleur:C.night, trend: trend(data.maand_mtd, data.maand_vj) }),
      KPICard({ label:'Dit jaar', waarde:euro(data.jaar_ytd), kleur:C.night, trend: trend(data.jaar_ytd, data.jaar_vj) })
    ),
    // SPARKLINE: omzet laatste 30 dagen
    sparkline.length > 0 && (function() {
      var W = 800, H = 70, P = 4;
      var waardes = sparkline.map(function(d){ return parseFloat(d.omzet || 0); });
      var max = Math.max.apply(null, waardes);
      if (max === 0) max = 1;
      var stapX = (W - P*2) / Math.max(sparkline.length - 1, 1);
      var vandaagIdx = sparkline.findIndex(function(d){ var dt = new Date(d.dag); dt.setHours(0,0,0,0); var td = new Date(); td.setHours(0,0,0,0); return dt.getTime() === td.getTime(); });
      var punten = sparkline.map(function(d, i) {
        var x = P + i * stapX;
        var y = P + (H - P*2) * (1 - (parseFloat(d.omzet||0) / max));
        return { x: x, y: y, dag: d.dag, omzet: parseFloat(d.omzet||0), gepland: i > vandaagIdx };
      });
      var polyStrGer = punten.filter(function(p,i){ return i <= vandaagIdx || vandaagIdx < 0; }).map(function(p){ return p.x+','+p.y; }).join(' ');
      var polyStrGep = vandaagIdx >= 0 ? punten.filter(function(p,i){ return i >= vandaagIdx; }).map(function(p){ return p.x+','+p.y; }).join(' ') : '';
      var areaGer = polyStrGer ? ('M'+P+','+(H-P)+' L'+polyStrGer.split(' ').join(' L')+' L'+(punten[vandaagIdx >= 0 ? vandaagIdx : punten.length-1].x)+','+(H-P)+' Z') : '';
      var hoverPunt = hoverIdx !== null && punten[hoverIdx] ? punten[hoverIdx] : null;
      var dagNaam = function(d){ var dt = new Date(d); return ['zo','ma','di','wo','do','vr','za'][dt.getDay()] + ' ' + dt.getDate() + '/' + (dt.getMonth()+1); };
      return React.createElement('div', { style:{background:C.white,borderRadius:10,padding:'10px 14px',marginBottom:12,marginTop:4} },
        React.createElement('div', { style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4} },
          React.createElement('div', { style:{fontSize:10,color:C.night,fontWeight:800,letterSpacing:1,textTransform:'uppercase'} }, '📈 Omzet per dag · laatste 30 dagen'),
          React.createElement('div', { style:{fontSize:10,color:C.muted,display:'flex',gap:10} },
            React.createElement('span', null, React.createElement('span', { style:{display:'inline-block',width:10,height:3,background:C.aqua,verticalAlign:'middle',marginRight:4} }), 'gerealiseerd'),
            vandaagIdx >= 0 && vandaagIdx < punten.length - 1 && React.createElement('span', null, React.createElement('span', { style:{display:'inline-block',width:10,height:3,background:C.orange,verticalAlign:'middle',marginRight:4,borderTop:'1px dashed ' + C.orange} }), 'gepland')
          )
        ),
        React.createElement('svg', {
          viewBox: '0 0 ' + W + ' ' + H,
          preserveAspectRatio: 'none',
          style: { width:'100%', height:H, display:'block', cursor:'crosshair' },
          onMouseMove: function(e) {
            var rect = e.currentTarget.getBoundingClientRect();
            var relX = (e.clientX - rect.left) / rect.width * W;
            var idx = Math.round((relX - P) / stapX);
            if (idx < 0) idx = 0; if (idx >= punten.length) idx = punten.length - 1;
            setHoverIdx(idx);
          },
          onMouseLeave: function() { setHoverIdx(null); }
        },
          // Area onder gerealiseerd
          areaGer && React.createElement('path', { d: areaGer, fill: C.aqua, opacity: 0.12 }),
          // Lijn gerealiseerd
          polyStrGer && React.createElement('polyline', { points: polyStrGer, fill:'none', stroke: C.aqua, strokeWidth: 2 }),
          // Lijn gepland (gestippeld)
          polyStrGep && React.createElement('polyline', { points: polyStrGep, fill:'none', stroke: C.orange, strokeWidth: 2, strokeDasharray: '4,3' }),
          // Vandaag verticale lijn
          vandaagIdx >= 0 && React.createElement('line', { x1: punten[vandaagIdx].x, y1: P, x2: punten[vandaagIdx].x, y2: H-P, stroke: C.night, strokeWidth: 1, strokeDasharray: '2,2', opacity: 0.4 }),
          // Hover punt + tooltip
          hoverPunt && React.createElement('circle', { cx: hoverPunt.x, cy: hoverPunt.y, r: 4, fill: hoverPunt.gepland ? C.orange : C.aqua, stroke:'#fff', strokeWidth: 2 }),
          hoverPunt && React.createElement('line', { x1: hoverPunt.x, y1: hoverPunt.y, x2: hoverPunt.x, y2: H-P, stroke: C.muted, strokeWidth: 1, opacity: 0.3 })
        ),
        React.createElement('div', { style:{display:'flex',justifyContent:'space-between',fontSize:10,color:C.muted,marginTop:2} },
          React.createElement('span', null, dagNaam(sparkline[0].dag)),
          hoverPunt
            ? React.createElement('strong', { style:{color:hoverPunt.gepland ? C.orange : C.aqua} }, dagNaam(hoverPunt.dag) + ' · ' + '€' + Math.round(hoverPunt.omzet).toLocaleString('nl-NL') + (hoverPunt.gepland ? ' gepland' : ''))
            : React.createElement('span', { style:{color:C.night,fontWeight:700} }, 'piek €' + Math.round(max).toLocaleString('nl-NL')),
          React.createElement('span', null, dagNaam(sparkline[sparkline.length-1].dag))
        )
      );
    })(),
    // RIJ 2: Forecast — eerst de RANGE (statistisch, conservatief↔positief)
    window._ForecastRangeBlok ? React.createElement(window._ForecastRangeBlok) : null,
    React.createElement('div', { style:{fontSize:10,color:C.night,fontWeight:800,letterSpacing:1,textTransform:'uppercase',marginBottom:6} }, '🔮 Forecast & geplande boekingen (oud)'),
    React.createElement('div', { style:{display:'flex',gap:8,flexWrap:'wrap'} },
      KPICard({ label:'Maand-forecast', waarde:euro(data.maand_forecast), kleur:C.orange, sub:'gerealiseerd + geplande boekingen' }),
      KPICard({ label:'Jaar-forecast', waarde:euro(data.jaar_forecast), kleur:C.orange, sub:'gerealiseerd + alle geplande boekingen' }),
      KPICard({ label:'Komende 30 dagen', waarde:euro(data.komende_30d_gepland), kleur:C.aqua, sub:'geplande omzet uit Recras' }),
      KPICard({ label:'Komende 7 dagen', waarde:euro(data.komende_7d_gepland), kleur:C.aqua, sub:'geplande omzet deze week' })
    ),
    // RIJ 3: Marge + Waste
    React.createElement('div', { style:{fontSize:10,color:C.night,fontWeight:800,letterSpacing:1,textTransform:'uppercase',marginBottom:6,marginTop:14} }, '📊 Marge & kosten'),
    React.createElement('div', { style:{display:'flex',gap:8,flexWrap:'wrap',marginBottom:10} },
      KPICard({
        label: 'Gem. marge',
        waarde: marge ? (parseFloat(marge.gem_marge_pct || 0).toFixed(1) + '%') : '...',
        kleur: marge && parseFloat(marge.gem_marge_pct||0) >= 60 ? C.green : C.orange,
        sub: marge ? (marge.n_met_marge + ' menus') : ''
      }),
      KPICard({
        label: 'Marge-alerts',
        waarde: marge ? marge.n_alert_actief : '...',
        kleur: marge && marge.n_alert_actief > 0 ? C.hot : C.green,
        sub: marge && marge.n_alert_actief > 0 ? 'menus onder drempel' : 'alles binnen drempel'
      }),
      KPICard({
        label: 'Waste 30 dagen',
        waarde: waste ? ('€' + Math.round(parseFloat(waste.kosten_30d||0)).toLocaleString('nl-NL')) : '...',
        kleur: waste && parseFloat(waste.kosten_30d||0) > 0 ? C.hot : C.muted,
        sub: waste ? (waste.n_registraties_30d + ' registraties') : ''
      }),
      KPICard({
        label: 'Waste 7 dagen',
        waarde: waste ? ('€' + Math.round(parseFloat(waste.kosten_7d||0)).toLocaleString('nl-NL')) : '...',
        kleur: C.muted,
        sub: 'deze week'
      })
    ),
    // Top + Bottom marge lijsten
    (margeTop.length > 0 || margeBottom.length > 0) && React.createElement('div', { style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:6} },
      React.createElement('div', { style:{background:C.white,borderRadius:10,padding:'10px 14px'} },
        React.createElement('div', { style:{fontSize:10,fontWeight:700,color:C.green,letterSpacing:1,textTransform:'uppercase',marginBottom:6} }, '⭐ Top 3 marge'),
        margeTop.map(function(m, i) {
          return React.createElement('div', { key:i, style:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'3px 0',fontSize:12} },
            React.createElement('span', { style:{color:C.night,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'} }, m.menu_naam),
            React.createElement('span', { style:{color:C.green,fontWeight:800,marginLeft:8} }, parseFloat(m.marge_pct).toFixed(1) + '%')
          );
        })
      ),
      React.createElement('div', { style:{background:C.white,borderRadius:10,padding:'10px 14px'} },
        React.createElement('div', { style:{fontSize:10,fontWeight:700,color:C.hot,letterSpacing:1,textTransform:'uppercase',marginBottom:6} }, '⚠ Laagste 3 marge'),
        margeBottom.length === 0
          ? React.createElement('div', { style:{fontSize:11,color:C.muted,fontStyle:'italic'} }, 'Geen menus onder drempel')
          : margeBottom.map(function(m, i) {
              return React.createElement('div', { key:i, style:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'3px 0',fontSize:12} },
                React.createElement('span', { style:{color:C.night,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'} }, m.menu_naam),
                React.createElement('span', { style:{color:C.hot,fontWeight:800,marginLeft:8} }, parseFloat(m.marge_pct).toFixed(1) + '%')
              );
            })
      )
    ),
    // NIEUWE RIJ: Smart Forecast obv historische dag-aandeel
    forecastTrend && React.createElement('div', { style:{marginTop:16} },
      React.createElement('div', { style:{fontSize:10,color:C.night,fontWeight:800,letterSpacing:1,textTransform:'uppercase',marginBottom:6} }, '🔮 Slimme jaar-forecast (obv trend 2024-2025)'),
      React.createElement('div', { style:{display:'flex',gap:8,flexWrap:'wrap'} },
        KPICard({
          label: 'Jaar-forecast (trend)',
          waarde: forecastTrend.jaar_forecast_trend ? euro(forecastTrend.jaar_forecast_trend) : '...',
          kleur: C.orange,
          sub: 'obv YTD + historische dag-aandeel'
        }),
        KPICard({
          label: 'Hist. aandeel YTD',
          waarde: forecastTrend.hist_aandeel_ytd ? (parseFloat(forecastTrend.hist_aandeel_ytd) * 100).toFixed(1) + '%' : '...',
          kleur: C.night,
          sub: 'dag ' + forecastTrend.huidige_doy + ' van 365 — gem 24+25'
        }),
        KPICard({
          label: 'Vorig jaar totaal',
          waarde: forecastTrend.vorig_jaar_totaal ? euro(forecastTrend.vorig_jaar_totaal) : '-',
          kleur: C.muted,
          sub: 'eindstand 2025'
        }),
        KPICard({
          label: 'Trend vs vj',
          waarde: forecastTrend.jaar_forecast_trend && forecastTrend.vorig_jaar_totaal && parseFloat(forecastTrend.vorig_jaar_totaal) > 0
            ? (((parseFloat(forecastTrend.jaar_forecast_trend) - parseFloat(forecastTrend.vorig_jaar_totaal)) / parseFloat(forecastTrend.vorig_jaar_totaal) * 100) > 0 ? '+' : '')
              + (((parseFloat(forecastTrend.jaar_forecast_trend) - parseFloat(forecastTrend.vorig_jaar_totaal)) / parseFloat(forecastTrend.vorig_jaar_totaal) * 100)).toFixed(0) + '%'
            : '-',
          kleur: forecastTrend.jaar_forecast_trend && forecastTrend.vorig_jaar_totaal && parseFloat(forecastTrend.jaar_forecast_trend) > parseFloat(forecastTrend.vorig_jaar_totaal) ? C.green : C.hot,
          sub: 'voorspelde groei'
        })
      )
    ),
    // NIEUWE RIJ: Volume KPI's
    volume.length > 0 && (function() {
      var huidig = volume.find(function(v){ return parseInt(v.jaar) === new Date().getFullYear(); }) || volume[0];
      var vorig = volume.find(function(v){ return parseInt(v.jaar) === new Date().getFullYear() - 1; });
      var trendPct = function(nu, oud) {
        if (!oud || parseFloat(oud) === 0) return null;
        var p = Math.round((parseFloat(nu) - parseFloat(oud)) / parseFloat(oud) * 100);
        return { tekst: (p > 0 ? '+' : '') + p + '%', kleur: p > 0 ? C.green : p < 0 ? C.hot : C.muted, vj: oud };
      };
      return React.createElement('div', { style:{marginTop:14} },
        React.createElement('div', { style:{fontSize:10,color:C.night,fontWeight:800,letterSpacing:1,textTransform:'uppercase',marginBottom:6} }, '📊 Volume KPI’s (YTD t/m zelfde punt vorig jaar)'),
        React.createElement('div', { style:{display:'flex',gap:8,flexWrap:'wrap'} },
          KPICard({
            label: 'Boekingen YTD',
            waarde: huidig.n_boekingen ? parseInt(huidig.n_boekingen).toLocaleString('nl-NL') : '0',
            kleur: C.aqua,
            trend: vorig ? trendPct(huidig.n_boekingen, vorig.n_boekingen) : null
          }),
          KPICard({
            label: 'Gem. € per boeking',
            waarde: huidig.omzet_per_boeking ? '€' + Math.round(parseFloat(huidig.omzet_per_boeking)).toLocaleString('nl-NL') : '-',
            kleur: C.night,
            trend: vorig ? trendPct(huidig.omzet_per_boeking, vorig.omzet_per_boeking) : null
          }),
          KPICard({
            label: 'Gem. groepsgrootte',
            waarde: huidig.groepsgrootte_gem ? Math.round(parseFloat(huidig.groepsgrootte_gem)) + ' pers' : '-',
            kleur: C.night,
            trend: vorig ? trendPct(huidig.groepsgrootte_gem, vorig.groepsgrootte_gem) : null
          }),
          KPICard({
            label: '€ per persoon',
            waarde: huidig.omzet_per_persoon ? '€' + Math.round(parseFloat(huidig.omzet_per_persoon)) : '-',
            kleur: C.aqua,
            trend: vorig ? trendPct(huidig.omzet_per_persoon, vorig.omzet_per_persoon) : null
          })
        )
      );
    })(),
    // NIEUWE RIJ: Verdeling west vs weesp (alleen als beide selected)
    outletFilter === 'beide' && outletVerdeling.length > 0 && (function() {
      var totaal = outletVerdeling.reduce(function(s, r){ return s + parseFloat(r.ytd || 0); }, 0);
      return React.createElement('div', { style:{marginTop:14} },
        React.createElement('div', { style:{fontSize:10,color:C.night,fontWeight:800,letterSpacing:1,textTransform:'uppercase',marginBottom:6} }, '🏢 Verdeling per outlet'),
        React.createElement('div', { style:{background:C.white,borderRadius:10,padding:'14px 18px',marginBottom:8} },
          outletVerdeling.map(function(o, i) {
            var pct = totaal > 0 ? (parseFloat(o.ytd || 0) / totaal * 100) : 0;
            var kleur = o.outlet_code === 'west' ? '#2196F3' : o.outlet_code === 'weesp' ? '#4CAF50' : C.muted;
            return React.createElement('div', { key:i, style:{marginBottom: i === outletVerdeling.length - 1 ? 0 : 10} },
              React.createElement('div', { style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4,fontSize:12} },
                React.createElement('strong', { style:{color:C.night} }, (o.outlet_code === 'west' ? '🔵 West' : o.outlet_code === 'weesp' ? '🟢 Weesp' : o.outlet_code) + ' — ' + euro(o.ytd) + ' YTD'),
                React.createElement('span', { style:{color:kleur,fontWeight:800} }, pct.toFixed(1) + '%')
              ),
              React.createElement('div', { style:{height:6,background:'#F0F4F7',borderRadius:6,overflow:'hidden'} },
                React.createElement('div', { style:{height:'100%',width:pct + '%',background:kleur,borderRadius:6} })
              ),
              React.createElement('div', { style:{fontSize:10,color:C.muted,marginTop:3} }, o.boekingen_ytd + ' boekingen · laatste 30 dagen: ' + euro(o.laatste_30d))
            );
          })
        )
      );
    })(),
    // NIEUWE RIJ: Weekpatroon
    weekpatroon.length > 0 && (function() {
      var labels = ['zo','ma','di','wo','do','vr','za'];
      var maxGem = Math.max.apply(null, weekpatroon.map(function(w){ return parseFloat(w.totaal || 0) / Math.max(w.n_dagen, 1); }));
      if (maxGem === 0) return null;
      return React.createElement('div', { style:{marginTop:14} },
        React.createElement('div', { style:{fontSize:10,color:C.night,fontWeight:800,letterSpacing:1,textTransform:'uppercase',marginBottom:6} }, '📅 Weekpatroon (gem omzet per weekdag · laatste 90d)'),
        React.createElement('div', { style:{background:C.white,borderRadius:10,padding:'14px 18px',display:'flex',gap:6,alignItems:'flex-end',height:100} },
          weekpatroon.map(function(w, i) {
            var gem = parseFloat(w.totaal || 0) / Math.max(w.n_dagen, 1);
            var h = maxGem > 0 ? (gem / maxGem * 70) : 0;
            var isWeekend = w.weekdag === 0 || w.weekdag === 6;
            return React.createElement('div', { key:i, style:{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',gap:4} },
              React.createElement('div', { style:{fontSize:10,color:C.muted,fontWeight:700} }, '€' + Math.round(gem / 1000) + 'k'),
              React.createElement('div', { style:{width:'100%',maxWidth:40,height:h + 'px',background: isWeekend ? C.orange : C.aqua,borderRadius:'6px 6px 0 0',minHeight:4} }),
              React.createElement('div', { style:{fontSize:10,color:C.night,fontWeight:700} }, labels[w.weekdag])
            );
          })
        )
      );
    })(),
    // NIEUWE RIJ: Marge-richtlijn + kickback
    margeTotaal && React.createElement('div', { style:{marginTop:14} },
      React.createElement('div', { style:{fontSize:10,color:C.night,fontWeight:800,letterSpacing:1,textTransform:'uppercase',marginBottom:6} }, '💸 Theoretische marge (richtlijn per productsoort)'),
      React.createElement('div', { style:{display:'flex',gap:8,flexWrap:'wrap',marginBottom:6} },
        KPICard({
          label: 'Bruto marge (richt)',
          waarde: margeTotaal.bruto_marge_euro ? euro(margeTotaal.bruto_marge_euro) : '-',
          kleur: C.green,
          sub: margeTotaal.bruto_marge_pct ? parseFloat(margeTotaal.bruto_marge_pct).toFixed(1) + '% obv richtlijnen' : ''
        }),
        KPICard({
          label: 'Kickback-retour',
          waarde: margeTotaal.kickback_euro ? euro(margeTotaal.kickback_euro) : '-',
          kleur: C.aqua,
          sub: parseFloat(margeTotaal.gebruikt_kickback_pct).toFixed(2) + '% van inkoop'
        }),
        KPICard({
          label: 'Netto marge',
          waarde: margeTotaal.netto_marge_euro ? euro(margeTotaal.netto_marge_euro) : '-',
          kleur: C.green,
          sub: margeTotaal.netto_marge_pct ? parseFloat(margeTotaal.netto_marge_pct).toFixed(1) + '% na kickback' : ''
        }),
        KPICard({
          label: 'Inkoopkosten (richt)',
          waarde: margeTotaal.totaal_omzet && margeTotaal.bruto_marge_euro ? euro(parseFloat(margeTotaal.totaal_omzet) - parseFloat(margeTotaal.bruto_marge_euro)) : '-',
          kleur: C.muted,
          sub: 'theoretisch obv richt-%'
        })
      ),
      React.createElement('div', { style:{fontSize:10,color:C.muted,fontStyle:'italic',marginTop:-4,marginBottom:8} }, 'Richtmarges instelbaar per productsoort in Beheer > (binnenkort). Standaard BBQ 55%, Lunch 65%, IJs 70%, etc.')
    ),
    // Marge per productsoort: staafjes
    margePerPs.length > 0 && React.createElement('div', { style:{background:C.white,borderRadius:10,padding:'12px 16px',marginTop:6} },
      React.createElement('div', { style:{fontSize:10,color:C.night,fontWeight:800,letterSpacing:1,textTransform:'uppercase',marginBottom:8} }, 'Marge per productsoort (YTD)'),
      (function(){
        var maxOmzet = Math.max.apply(null, margePerPs.map(function(p){ return parseFloat(p.omzet || 0); }));
        return margePerPs.filter(function(p){ return parseFloat(p.omzet||0) > 0; }).map(function(p, i) {
          var pct = maxOmzet > 0 ? (parseFloat(p.omzet) / maxOmzet * 100) : 0;
          return React.createElement('div', { key:i, style:{marginBottom:8} },
            React.createElement('div', { style:{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:3} },
              React.createElement('strong', { style:{color:C.night} }, p.productsoort_naam + (outletFilter==='beide' ? ' (' + (p.outlet_code||'?') + ')' : '')),
              React.createElement('span', null,
                React.createElement('span', { style:{color:C.muted,marginRight:10} }, euro(p.omzet)),
                React.createElement('span', { style:{color:C.green,fontWeight:700} }, parseFloat(p.netto_marge_pct||0).toFixed(1) + '% netto')
              )
            ),
            React.createElement('div', { style:{height:5,background:'#F0F4F7',borderRadius:5,overflow:'hidden'} },
              React.createElement('div', { style:{height:'100%',width:pct + '%',background:C.aqua,borderRadius:5} })
            )
          );
        });
      })()
    )
  );
}

  window._LiveDashboardBlok = LiveDashboardBlok;
})();


// ===== nvwa-inspectie-screen.js (26220 bytes) =====
// KitchenRobot module: nvwa-inspectie-screen.js
// Geextraheerd uit index.html op 2026-05-05T12:48:38.032Z (self-exposed dedicated-script, soort: iife)
// Bevat: NVWAInspectieScreen
(function(){
  if (typeof window === 'undefined' || !window.React) return;
  var R = window.React.createElement;
  var useState = window.React.useState;
  var useEffect = window.React.useEffect;
  var useMemo = window.React.useMemo;
  if (typeof document !== 'undefined' && !document.getElementById('nvwa-print-css')) {
    var st = document.createElement('style');
    st.id = 'nvwa-print-css';
    st.textContent = '@media print { .nvwa-noprint{display:none !important} body{background:white !important} @page{margin:18mm 15mm;size:A4 portrait} .nvwa-page{box-shadow:none !important;padding:0 !important;max-width:none !important} table{page-break-inside:auto} tr{page-break-inside:avoid} h2{page-break-after:avoid} }';
    document.head.appendChild(st);
  }
  function fmt(n, d){ d=(d==null?1:d); if(n==null||isNaN(+n))return '-'; return (+n).toFixed(d); }
  function fmtMin(m){ if(m==null||m<=0)return '-'; if(m<60)return Math.round(m)+' min'; return Math.floor(m/60)+'u '+Math.round(m%60)+'m'; }
  function badge(p){
    var s={display:'inline-block',padding:'2px 9px',fontSize:10.5,fontWeight:600,borderRadius:10,textTransform:'uppercase',letterSpacing:'.04em'};
    if(p==null) return R('span',{style:Object.assign({},s,{background:'#eee',color:'#666'})},'geen data');
    if(p>=98) return R('span',{style:Object.assign({},s,{background:'#E8F5E9',color:'#2E7D32'})},'binnen norm');
    if(p>=85) return R('span',{style:Object.assign({},s,{background:'#FFF3E0',color:'#E65100'})},'lichte afw.');
    return R('span',{style:Object.assign({},s,{background:'#FFEBEE',color:'#C62828'})},'signif. afw.');
  }
  var TH={textAlign:'left',padding:'9px 11px',fontSize:11,fontWeight:600,color:'#6E8591',textTransform:'uppercase',letterSpacing:'.05em',borderBottom:'2px solid #002D41',background:'#F5F8FA'};
  var THR=Object.assign({},TH,{textAlign:'right'});
  var TD={padding:'9px 11px',borderBottom:'1px solid #D8E8EF',fontSize:12.5};
  var TDR=Object.assign({},TD,{textAlign:'right',fontFamily:'monospace'});
  var LBL={display:'inline-block',minWidth:120,fontSize:11,color:'#6E8591',textTransform:'uppercase',letterSpacing:'.04em',marginRight:10,fontWeight:700};
  var FLD={display:'flex',flexDirection:'column',gap:4,fontSize:11,fontWeight:600,color:'#6E8591',textTransform:'uppercase',letterSpacing:'.05em'};
  var INP={padding:'7px 10px',border:'1px solid #AEC5D1',borderRadius:4,fontSize:13,fontFamily:'inherit'};
  window._NVWAInspectieScreen = function NVWAInspectieScreen(){
    var today = new Date().toISOString().slice(0,10);
    var thirtyAgo = new Date(Date.now()-30*86400000).toISOString().slice(0,10);
    var vs=useState(thirtyAgo); var van=vs[0]; var setVan=vs[1];
    var ts=useState(today); var tot=ts[0]; var setTot=ts[1];
    var ds=useState(30); var drempel=ds[0]; var setDrempel=ds[1];
    var oS=useState((window.kr&&window.kr.outlet&&window.kr.outlet.get&&window.kr.outlet.get()!=='alle')?window.kr.outlet.get():'weesp'); var outlet=oS[0]; var setOutlet=oS[1];
    var dS=useState([]); var dagen=dS[0]; var setDagen=dS[1];
    var eS=useState([]); var episodes=eS[0]; var setEpisodes=eS[1];
    var vS=useState([]); var verif=vS[0]; var setVerif=vS[1];
    var iS=useState({}); var inst=iS[0]; var setInst=iS[1];
    var lS=useState(true); var laadt=lS[0]; var setLaadt=lS[1];
    var fS=useState(null); var fout=fS[0]; var setFout=fS[1];
    var caS=useState([]); var corrActies=caS[0]; var setCorrActies=caS[1];
    var cfS=useState({omschrijving:'',datum:new Date().toISOString().slice(0,10),uitgevoerd_door:''}); var corrForm=cfS[0]; var setCorrForm=cfS[1];
    var snS=useState([]); var sensoren=snS[0]; var setSensoren=snS[1];
    var nvS=useState({sensor_id:'',steek_temp:'',sensor_temp:'',gemeten_door:'',opmerking:''}); var nieuweVerif=nvS[0]; var setNieuweVerif=nvS[1];
    var verifBezigS=useState(false); var verifBezig=verifBezigS[0]; var setVerifBezig=verifBezigS[1];
    var rapBezigS=useState(false); var rapBezig=rapBezigS[0]; var setRapBezig=rapBezigS[1];
    useEffect(function(){
      if(!window._supa||!outlet) return;
      window._supa.from('kiosk_sensoren').select('id,naam,min_norm,max_norm').eq('outlet_code',outlet).eq('actief',true).order('naam')
        .then(function(r){ if(!r.error) setSensoren(r.data||[]); });
      setCorrActies([]);
    },[outlet]);
    useEffect(function(){
      if(!window._supa||!van||!tot||!outlet) return;
      setLaadt(true); setFout(null);
      var sb=window._supa;
      var einde=tot+'T23:59:59';
      Promise.all([
        sb.from('v_haccp_inspectie_dag').select('*').eq('outlet_code',outlet).gte('datum',van).lte('datum',tot).order('datum'),
        sb.from('v_haccp_afwijkings_episodes').select('*').eq('outlet_code',outlet).eq('significant',true).gte('start_tijd',van).lte('start_tijd',einde).gte('duur_minuten',drempel).order('start_tijd'),
        sb.from('haccp_verificatie_metingen').select('*, kiosk_sensoren(naam)').eq('outlet_code',outlet).gte('gemeten_op',van).lte('gemeten_op',einde).order('gemeten_op',{ascending:false}),
        sb.from('haccp_instellingen').select('*').eq('outlet_code',outlet).maybeSingle()
      ]).then(function(rs){
        var err=rs[0].error||rs[1].error||rs[2].error||rs[3].error;
        if(err){setFout(err.message);}
        else{setDagen(rs[0].data||[]);setEpisodes(rs[1].data||[]);setVerif(rs[2].data||[]);setInst(rs[3].data||{});}
        setLaadt(false);
      }).catch(function(e){setFout(String(e));setLaadt(false);});
    },[van,tot,drempel,outlet]);
    var overzicht = useMemo(function(){
      var m={};
      dagen.forEach(function(d){
        if(!m[d.sensor_id]) m[d.sensor_id]={id:d.sensor_id,naam:d.sensor_naam,cat:d.categorie,minN:d.min_norm,maxN:d.max_norm,mt:0,buiten:0,sumT:0,tmin:Infinity,tmax:-Infinity,minB:0};
        var s=m[d.sensor_id];
        s.mt += d.aantal_metingen||0;
        s.buiten += d.aantal_metingen_buiten_norm||0;
        s.sumT += (+d.gem_temp||0)*(d.aantal_metingen||0);
        if(d.min_temp!=null) s.tmin = Math.min(s.tmin, +d.min_temp);
        if(d.max_temp!=null) s.tmax = Math.max(s.tmax, +d.max_temp);
        s.minB += +d.minuten_buiten_norm||0;
      });
      return Object.values(m).map(function(s){
        return {id:s.id,naam:s.naam,cat:s.cat,minN:s.minN,maxN:s.maxN,mt:s.mt,
          gem:s.mt>0?s.sumT/s.mt:null,
          tmin:s.tmin===Infinity?null:s.tmin,
          tmax:s.tmax===-Infinity?null:s.tmax,
          minB:s.minB,
          pct:s.mt>0?100*(s.mt-s.buiten)/s.mt:null};
      }).sort(function(a,b){return (a.pct==null?100:a.pct)-(b.pct==null?100:b.pct);});
    },[dagen]);
    return R('div',{style:{padding:20,background:'#EAF0F4',minHeight:'100vh',fontFamily:'system-ui,-apple-system,sans-serif',color:'#234756'}},
      R('div',{className:'nvwa-noprint',style:{background:'white',padding:16,borderRadius:6,marginBottom:20,display:'flex',gap:14,alignItems:'flex-end',flexWrap:'wrap'}},
        R('label',{style:FLD},'Van',R('input',{type:'date',value:van,onChange:function(e){setVan(e.target.value);},style:INP})),
        R('label',{style:FLD},'Tot',R('input',{type:'date',value:tot,onChange:function(e){setTot(e.target.value);},style:INP})),
        R('label',{style:FLD},'Min. duur afw.',R('select',{value:drempel,onChange:function(e){setDrempel(+e.target.value);},style:INP},
          R('option',{value:15},'15 min'),R('option',{value:30},'30 min'),R('option',{value:60},'1 uur'))),
        R('label',{style:FLD},'Vestiging',R('select',{value:outlet,onChange:function(e){setOutlet(e.target.value);},style:INP},
          R('option',{value:'west'},'Amsterdam West'),R('option',{value:'weesp'},'Weesp'))),
        R('button',{disabled:rapBezig,onClick:function(){
          if(!window._supa) return;
          setRapBezig(true);
          var totaalMet = overzicht.reduce(function(a,s){return a+(s.mt||0);},0);
          var rapportPayload = {
            outlet_code: outlet,
            periode_van: van,
            periode_tot: tot,
            gegenereerd_door: (window.kr&&window.kr.outlet&&document.getElementById('admin-versie-tag'))?document.getElementById('admin-versie-tag').textContent.trim():null,
            totaal_metingen: totaalMet,
            afwijkingen: episodes.length,
            correctieve_acties: corrActies,
            rapport_json: {
              overzicht: overzicht,
              episodes: episodes,
              verif: verif,
              inst: inst,
              drempel: drempel,
              gegenereerd_op: new Date().toISOString()
            }
          };
          window._supa.from('haccp_inspecties').insert(rapportPayload).select().maybeSingle()
            .then(function(r){
              setRapBezig(false);
              if(r.error){
                if(window.kr&&window.kr.toast) window.kr.toast('Fout bij opslaan: '+r.error.message,'error');
              } else {
                if(window.kr&&window.kr.toast) window.kr.toast('Rapport opgeslagen ('+totaalMet+' metingen, '+episodes.length+' afwijkingen)','success',5000);
                setCorrActies([]);
              }
            });
        },style:{marginLeft:'auto',padding:'9px 18px',background:rapBezig?'#6E8591':'#2E7D32',color:'white',border:'none',borderRadius:4,cursor:rapBezig?'wait':'pointer',fontSize:13,fontWeight:600}}, rapBezig?'Bezig...':'\u{1F4BE} Rapport opslaan'),
        R('button',{onClick:function(){window.print();},style:{padding:'9px 18px',background:'#002D41',color:'white',border:'none',borderRadius:4,cursor:'pointer',fontSize:13,fontWeight:600}},'Printen / PDF')
      ),
      fout && R('div',{style:{padding:16,background:'#FFEBEE',color:'#C62828',borderRadius:4,marginBottom:16}},'Fout: '+fout),
      laadt && R('div',{style:{padding:40,textAlign:'center',color:'#6E8591'}},'Laden...'),
      !laadt && !fout && R('div',{className:'nvwa-page',style:{background:'white',padding:'40px 48px',borderRadius:6,maxWidth:1180,margin:'0 auto'}},
        R('div',{style:{borderBottom:'3px solid #002D41',paddingBottom:18,marginBottom:28}},
          R('div',{style:{display:'flex',justifyContent:'space-between',marginBottom:10}},
            R('div',{style:{fontSize:19,fontWeight:700,color:'#002D41'}},'KitchenRobot'),
            R('div',{style:{fontSize:11,color:'#6E8591',textTransform:'uppercase',letterSpacing:'.06em'}},'HACCP Registratie - Voedselveiligheidsplan')
          ),
          R('h1',{style:{fontSize:26,fontWeight:600,color:'#002D41',margin:'6px 0 4px 0'}},'NVWA Inspectierapport - Temperatuurregistratie'),
          R('div',{style:{fontSize:12,color:'#6E8591',fontStyle:'italic'}},'Conform Hygienecode voor de Horeca (KHN) en Verordening (EG) 852/2004'),
          R('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px 40px',marginTop:18,fontSize:13}},
            R('div',null, R('span',{style:LBL},'Bedrijfsnaam'), inst.bedrijfsnaam || '(leeg - vul in bij HACCP Bedrijfsgegevens)'),
            R('div',null, R('span',{style:LBL},'Vestiging'), outlet==='west'?'Amsterdam West':'Weesp'),
            R('div',null, R('span',{style:LBL},'Adres'), [inst.adres,inst.postcode,inst.plaats].filter(Boolean).join(' - ')||'-'),
            R('div',null, R('span',{style:LBL},'Periode'), van+' t/m '+tot),
            R('div',null, R('span',{style:LBL},'KvK'), inst.kvk_nummer||'-'),
            R('div',null, R('span',{style:LBL},'BTW'), inst.btw_nummer||'-'),
            R('div',null, R('span',{style:LBL},'Telefoon'), inst.telefoon||'-'),
            R('div',null, R('span',{style:LBL},'E-mail'), inst.email||'-'),
            R('div',null, R('span',{style:LBL},'Verantwoordelijke'), [inst.verantwoordelijke_naam,inst.verantwoordelijke_functie].filter(Boolean).join(' - ')||'-'),
            R('div',null, R('span',{style:LBL},'Vervanger'), [inst.vervanger_naam,inst.vervanger_functie].filter(Boolean).join(' - ')||'-')
          )
        ),
        R('section',{style:{marginTop:36}},
          R('h2',{style:{fontSize:18,fontWeight:600,color:'#002D41',margin:'0 0 10px 0'}},'1. Overzicht per koeling'),
          R('table',{style:{width:'100%',borderCollapse:'collapse'}},
            R('thead',null,R('tr',null,
              R('th',{style:TH},'Koeling'),R('th',{style:TH},'Cat.'),R('th',{style:TH},'Norm C'),
              R('th',{style:THR},'Metingen'),R('th',{style:THR},'Gem.'),R('th',{style:THR},'Min.'),R('th',{style:THR},'Max.'),
              R('th',{style:THR},'Tijd buiten'),R('th',{style:THR},'% binnen'),R('th',{style:TH},'Status')
            )),
            R('tbody',null, overzicht.map(function(s,i){
              return R('tr',{key:i},
                R('td',{style:Object.assign({},TD,{fontWeight:600,color:'#002D41'})},s.naam),
                R('td',{style:TD},R('span',{style:{padding:'1px 7px',background:'#0277BD',color:'white',fontSize:9.5,borderRadius:3,letterSpacing:'.05em',textTransform:'uppercase'}},s.cat||'-')),
                R('td',{style:Object.assign({},TD,{fontFamily:'monospace'})}, (s.minN==null?'-':s.minN)+' / '+(s.maxN==null?'-':s.maxN)),
                R('td',{style:TDR}, s.mt),
                R('td',{style:TDR}, fmt(s.gem,2)),
                R('td',{style:TDR}, fmt(s.tmin,1)),
                R('td',{style:TDR}, fmt(s.tmax,1)),
                R('td',{style:TDR}, fmtMin(s.minB)),
                R('td',{style:Object.assign({},TDR,{fontWeight:600})}, fmt(s.pct,1)+'%'),
                R('td',{style:TD}, badge(s.pct))
              );
            }))
          )
        ),
        R('section',{style:{marginTop:36}},
          R('h2',{style:{fontSize:18,fontWeight:600,color:'#002D41',margin:'0 0 10px 0'}},'2. Detailoverzicht per dag'),
          R('table',{style:{width:'100%',borderCollapse:'collapse',fontSize:12}},
            R('thead',null,R('tr',null,
              R('th',{style:TH},'Datum'),R('th',{style:TH},'Koeling'),
              R('th',{style:THR},'Metingen'),R('th',{style:THR},'Gem.'),R('th',{style:THR},'Min.'),R('th',{style:THR},'Max.'),
              R('th',{style:THR},'Buiten'),R('th',{style:THR},'Signif.'),R('th',{style:THR},'Tijd buiten')
            )),
            R('tbody',null, dagen.map(function(d,i){
              var rowStyle = d.aantal_significante_afwijkingen>0?{background:'#FFF8E1'}:{};
              return R('tr',{key:i,style:rowStyle},
                R('td',{style:Object.assign({},TD,{fontFamily:'monospace'})}, d.datum),
                R('td',{style:TD}, d.sensor_naam),
                R('td',{style:TDR}, d.aantal_metingen),
                R('td',{style:TDR}, fmt(d.gem_temp,2)),
                R('td',{style:TDR}, fmt(d.min_temp,1)),
                R('td',{style:TDR}, fmt(d.max_temp,1)),
                R('td',{style:TDR}, d.aantal_metingen_buiten_norm),
                R('td',{style:Object.assign({},TDR,{color:d.aantal_significante_afwijkingen>0?'#C62828':'inherit',fontWeight:d.aantal_significante_afwijkingen>0?600:400})}, d.aantal_significante_afwijkingen||0),
                R('td',{style:TDR}, fmtMin(d.minuten_buiten_norm))
              );
            }))
          )
        ),
        R('section',{style:{marginTop:36}},
          R('h2',{style:{fontSize:18,fontWeight:600,color:'#002D41',margin:'0 0 4px 0'}},'3. Significante afwijkingen ('+drempel+' min of langer)'),
          R('div',{style:{fontSize:12,color:'#6E8591',marginBottom:12}},'Per afwijking kunt u onder de tabel correctieve acties registreren. Deze worden meegenomen bij \'Opslaan als rapport\'.'),
          episodes.length===0
            ? R('div',{style:{padding:20,background:'#E8F5E9',borderRadius:4,color:'#2E7D32'}},'Geen significante afwijkingen van '+drempel+' min of langer in deze periode.')
            : R('table',{style:{width:'100%',borderCollapse:'collapse',fontSize:12}},
                R('thead',null,R('tr',null,
                  R('th',{style:TH},'Start'),R('th',{style:TH},'Einde'),R('th',{style:TH},'Koeling'),
                  R('th',{style:THR},'Duur'),R('th',{style:THR},'Gem.'),R('th',{style:THR},'Max afw.')
                )),
                R('tbody',null, episodes.map(function(e,i){
                  return R('tr',{key:i},
                    R('td',{style:Object.assign({},TD,{fontFamily:'monospace',fontSize:11})}, new Date(e.start_tijd).toLocaleString('nl-NL')),
                    R('td',{style:Object.assign({},TD,{fontFamily:'monospace',fontSize:11})}, new Date(e.eind_tijd).toLocaleString('nl-NL')),
                    R('td',{style:Object.assign({},TD,{fontWeight:600})}, e.sensor_naam),
                    R('td',{style:TDR}, fmtMin(e.duur_minuten)),
                    R('td',{style:TDR}, fmt(e.gem_temp,1)+'C'),
                    R('td',{style:Object.assign({},TDR,{color:'#C62828',fontWeight:600})}, fmt(e.max_temp,1)+'C')
                  );
                }))
              ),
          R('div',{className:'nvwa-noprint',style:{marginTop:18,padding:16,background:'#F5F8FA',borderRadius:6,border:'1px solid #D8E8EF'}},
            R('div',{style:{fontSize:13,fontWeight:700,color:'#002D41',marginBottom:10}},'Correctieve acties registreren'),
            corrActies.length > 0 && R('div',{style:{marginBottom:12}},
              corrActies.map(function(a,i){
                return R('div',{key:i,style:{padding:'8px 10px',background:'white',borderRadius:4,marginBottom:6,fontSize:12,display:'flex',gap:10,alignItems:'flex-start',border:'1px solid #E0E8EE'}},
                  R('div',{style:{flex:1}},
                    R('div',{style:{fontWeight:600,color:'#002D41'}}, a.omschrijving),
                    R('div',{style:{fontSize:11,color:'#6E8591',marginTop:2}}, a.datum + (a.uitgevoerd_door? ' · door '+a.uitgevoerd_door:''))
                  ),
                  R('button',{onClick:function(){setCorrActies(corrActies.filter(function(_,j){return j!==i;}));},style:{background:'transparent',border:'none',color:'#C62828',cursor:'pointer',fontSize:13,padding:'2px 8px'}},'✕')
                );
              })
            ),
            R('div',{style:{display:'grid',gridTemplateColumns:'2fr 1fr 1fr auto',gap:8,alignItems:'end'}},
              R('label',{style:FLD},'Omschrijving correctieve actie',
                R('input',{type:'text',value:corrForm.omschrijving,onChange:function(e){setCorrForm(Object.assign({},corrForm,{omschrijving:e.target.value}));},style:INP,placeholder:'Bv. Vriescel deur dichtgedaan, sensor herstart, koeler gerepareerd...'})
              ),
              R('label',{style:FLD},'Datum',
                R('input',{type:'date',value:corrForm.datum,onChange:function(e){setCorrForm(Object.assign({},corrForm,{datum:e.target.value}));},style:INP})
              ),
              R('label',{style:FLD},'Door',
                R('input',{type:'text',value:corrForm.uitgevoerd_door,onChange:function(e){setCorrForm(Object.assign({},corrForm,{uitgevoerd_door:e.target.value}));},style:INP,placeholder:'Naam'})
              ),
              R('button',{onClick:function(){
                if(!corrForm.omschrijving.trim()){
                  if(window.kr&&window.kr.toast) window.kr.toast('Vul een omschrijving in','warn');
                  return;
                }
                setCorrActies(corrActies.concat([{omschrijving:corrForm.omschrijving.trim(),datum:corrForm.datum,uitgevoerd_door:corrForm.uitgevoerd_door.trim()}]));
                setCorrForm({omschrijving:'',datum:new Date().toISOString().slice(0,10),uitgevoerd_door:corrForm.uitgevoerd_door});
              },style:{padding:'8px 16px',background:'#1976D2',color:'white',border:'none',borderRadius:4,cursor:'pointer',fontSize:12.5,fontWeight:600,whiteSpace:'nowrap'}},'+ Toevoegen')
            )
          )
        ),
        R('section',{style:{marginTop:36}},
          R('h2',{style:{fontSize:18,fontWeight:600,color:'#002D41',margin:'0 0 4px 0'}},'4. Apparatuurverificatie (steekthermometer)'),
          R('div',{style:{fontSize:12,color:'#6E8591',marginBottom:12}},'Wekelijkse vergelijking sensor vs steekthermometer. Tolerantie: 2 graden. Voeg onderaan een nieuwe meting toe.'),
          verif.length===0
            ? R('div',{style:{padding:20,background:'#FFF3E0',borderRadius:4,color:'#E65100'}},'Nog geen verificatie-metingen in deze periode vastgelegd.')
            : R('table',{style:{width:'100%',borderCollapse:'collapse',fontSize:12}},
                R('thead',null,R('tr',null,
                  R('th',{style:TH},'Datum'),R('th',{style:TH},'Koeling'),
                  R('th',{style:THR},'Steek'),R('th',{style:THR},'Sensor'),R('th',{style:THR},'Verschil'),
                  R('th',{style:TH},'Door'),R('th',{style:TH},'Opmerking')
                )),
                R('tbody',null, verif.map(function(v,i){
                  return R('tr',{key:v.id||i},
                    R('td',{style:Object.assign({},TD,{fontFamily:'monospace',fontSize:11})}, new Date(v.gemeten_op).toLocaleString('nl-NL')),
                    R('td',{style:TD}, (v.kiosk_sensoren&&v.kiosk_sensoren.naam)||'-'),
                    R('td',{style:TDR}, fmt(v.steek_temp,1)+'C'),
                    R('td',{style:TDR}, fmt(v.sensor_temp,1)+'C'),
                    R('td',{style:Object.assign({},TDR,{color:v.binnen_tolerantie?'#2E7D32':'#C62828',fontWeight:600})}, fmt(v.verschil,1)+'C'),
                    R('td',{style:TD}, v.gemeten_door||'-'),
                    R('td',{style:TD}, v.opmerking||'-')
                  );
                }))
              ),
          R('div',{className:'nvwa-noprint',style:{marginTop:18,padding:16,background:'#F5F8FA',borderRadius:6,border:'1px solid #D8E8EF'}},
            R('div',{style:{fontSize:13,fontWeight:700,color:'#002D41',marginBottom:10}},'Nieuwe verificatie-meting toevoegen'),
            R('div',{style:{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:8,alignItems:'end',marginBottom:10}},
              R('label',{style:FLD},'Koeling',
                R('select',{value:nieuweVerif.sensor_id,onChange:function(e){setNieuweVerif(Object.assign({},nieuweVerif,{sensor_id:e.target.value}));},style:INP},
                  R('option',{value:''},'-- kies sensor --'),
                  sensoren.map(function(s){
                    return R('option',{key:s.id,value:s.id}, s.naam+' ('+(s.min_norm==null?'?':s.min_norm)+'/'+(s.max_norm==null?'?':s.max_norm)+'C)');
                  })
                )
              ),
              R('label',{style:FLD},'Steek-temp (C)',
                R('input',{type:'number',step:'0.1',value:nieuweVerif.steek_temp,onChange:function(e){setNieuweVerif(Object.assign({},nieuweVerif,{steek_temp:e.target.value}));},style:INP,placeholder:'verplicht'})
              ),
              R('label',{style:FLD},'Sensor-temp (C)',
                R('input',{type:'number',step:'0.1',value:nieuweVerif.sensor_temp,onChange:function(e){setNieuweVerif(Object.assign({},nieuweVerif,{sensor_temp:e.target.value}));},style:INP,placeholder:'optioneel'})
              ),
              R('label',{style:FLD},'Gemeten door',
                R('input',{type:'text',value:nieuweVerif.gemeten_door,onChange:function(e){setNieuweVerif(Object.assign({},nieuweVerif,{gemeten_door:e.target.value}));},style:INP,placeholder:'Naam'})
              )
            ),
            R('div',{style:{display:'grid',gridTemplateColumns:'1fr auto',gap:8,alignItems:'end'}},
              R('label',{style:FLD},'Opmerking (optioneel)',
                R('input',{type:'text',value:nieuweVerif.opmerking,onChange:function(e){setNieuweVerif(Object.assign({},nieuweVerif,{opmerking:e.target.value}));},style:INP})
              ),
              R('button',{disabled:verifBezig,onClick:function(){
                if(!nieuweVerif.sensor_id || nieuweVerif.steek_temp===''){
                  if(window.kr&&window.kr.toast) window.kr.toast('Kies een sensor en vul steek-temp in','warn');
                  return;
                }
                setVerifBezig(true);
                var payload = {
                  outlet_code: outlet,
                  sensor_id: nieuweVerif.sensor_id,
                  steek_temp: parseFloat(nieuweVerif.steek_temp),
                  sensor_temp: nieuweVerif.sensor_temp===''?null:parseFloat(nieuweVerif.sensor_temp),
                  gemeten_door: nieuweVerif.gemeten_door.trim()||null,
                  opmerking: nieuweVerif.opmerking.trim()||null
                };
                window._supa.from('haccp_verificatie_metingen').insert(payload).select('*, kiosk_sensoren(naam)').maybeSingle()
                  .then(function(r){
                    setVerifBezig(false);
                    if(r.error){
                      if(window.kr&&window.kr.toast) window.kr.toast('Fout: '+r.error.message,'error');
                    } else {
                      setVerif([r.data].concat(verif));
                      setNieuweVerif({sensor_id:'',steek_temp:'',sensor_temp:'',gemeten_door:nieuweVerif.gemeten_door,opmerking:''});
                      if(window.kr&&window.kr.toast) window.kr.toast('Verificatie-meting opgeslagen','success');
                    }
                  });
              },style:{padding:'9px 18px',background:verifBezig?'#6E8591':'#1976D2',color:'white',border:'none',borderRadius:4,cursor:verifBezig?'wait':'pointer',fontSize:13,fontWeight:600,whiteSpace:'nowrap'}}, verifBezig?'Bezig...':'Meting opslaan')
            )
          )
        ),
        R('div',{style:{marginTop:50,paddingTop:24,borderTop:'2px solid #002D41',display:'grid',gridTemplateColumns:'1fr 1fr',gap:40}},
          R('div',null, R('b',{style:{fontSize:11,color:'#6E8591',textTransform:'uppercase',letterSpacing:'.04em'}},'Opgesteld door'), R('div',{style:{borderBottom:'1px solid #234756',minHeight:42,marginTop:6}})),
          R('div',null, R('b',{style:{fontSize:11,color:'#6E8591',textTransform:'uppercase',letterSpacing:'.04em'}},'Datum en handtekening'), R('div',{style:{borderBottom:'1px solid #234756',minHeight:42,marginTop:6}}))
        ),
        R('div',{style:{marginTop:20,fontSize:10.5,color:'#6E8591',fontStyle:'italic'}},'Automatisch gegenereerd uit KitchenRobot. Metingen zijn tijdgestempeld en onveranderbaar. Bewaartermijn: 2 jaar.')
      )
    );
  };
})();



// ===== opzet-logboek-screen.js (9456 bytes) =====
// KitchenRobot module: opzet-logboek-screen.js
// Geextraheerd uit index.html op 2026-05-05T04:59:22.623Z
// Bevat: OpzetLogboekScreen
// Externe refs (via window._): (geen)
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function OpzetLogboekScreen() {
  var [data, setData] = useState([]);
  var [laden, setLaden] = useState(false);
  var [vanDatum, setVanDatum] = useState(function() {
    var d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  });
  var [totDatum, setTotDatum] = useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  var [filterOutlet, setFilterOutlet] = useState("alle");
  var [filterStatus, setFilterStatus] = useState("alle");
  var [zoek, setZoek] = useState("");
  var [gekozen, setGekozen] = useState(null);
  function laad() {
    if (!window._supa) return;
    setLaden(true);
    var q = window._supa.from("kiosk_opzet_voortgang").select("*").gte("geregistreerd_op", vanDatum + "T00:00:00").lte("geregistreerd_op", totDatum + "T23:59:59").order("geregistreerd_op", { ascending: false });
    if (filterOutlet !== "alle") q = q.eq("outlet_code", filterOutlet);
    if (filterStatus !== "alle") q = q.eq("status", filterStatus);
    q.then(function(r) {
      setData(r.data || []);
      setLaden(false);
    });
  }
  useEffect(laad, []);
  function exportExcel() {
    if (typeof XLSX === "undefined") return;
    var rijen = gefilterd.map(function(r) {
      var tijdstempel = r.uitgevoerd_op || r.opgezet_op || r.geregistreerd_op; var medewerker = r.uitgevoerd_door_naam || r.opgezet_door_naam || ""; return { Datum: tijdstempel ? new Date(tijdstempel).toLocaleString("nl-NL") : "", Keuken: r.outlet_code === "west" ? "West" : "Weesp", Boeking: r.boeking_naam || r.boeking_id, Locatie: r.locatie || "", Menu: r.menu_naam || "", Gerecht: r.gerecht_naam || "", Productsoort: r.ps_naam || "", Status: r.status, Medewerker: medewerker, Porties: r.opgezet_porties || r.geplande_porties || "" };
    });
    var ws = XLSX.utils.json_to_sheet(rijen);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Opzet Logboek");
    XLSX.writeFile(wb, "OpzetLogboek_" + vanDatum + "_" + totDatum + ".xlsx");
  }
  var gefilterd = data.filter(function(r) {
    if (zoek) {
      var zl = zoek.toLowerCase();
      return (r.boeking_naam || "").toLowerCase().includes(zl) || (r.gerecht_naam || "").toLowerCase().includes(zl) || (r.menu_naam || "").toLowerCase().includes(zl) || (r.uitgevoerd_door_naam || "").toLowerCase().includes(zl) || (r.opgezet_door_naam || "").toLowerCase().includes(zl);
    }
    return true;
  });
  var totaal = gefilterd.length;
  var opgezet = gefilterd.filter(function(r) {
    return r.status === "opgezet";
  }).length;
  var uitgevoerd = gefilterd.filter(function(r) {
    return r.status === "uitgevoerd";
  }).length;
  var uniekeBoekingen = new Set(gefilterd.map(function(r) {
    return r.boeking_id;
  })).size;
  var statusKleur = { opgezet: C.aqua, uitgevoerd: C.green, concept: C.muted };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: C.night, marginBottom: 4 } }, "\u2705 Opzet Logboek"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: C.muted } }, "Alle afgetekende opzet- en BBQ-taken vanuit de kiosk, met tijdstempel en medewerker.")), /* @__PURE__ */ React.createElement("div", { style: { ...SS.card, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 10, alignItems: "end" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Van"), /* @__PURE__ */ React.createElement("input", { type: "date", style: SS.inp, value: vanDatum, onChange: function(e) {
    setVanDatum(e.target.value);
  } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Tot"), /* @__PURE__ */ React.createElement("input", { type: "date", style: SS.inp, value: totDatum, onChange: function(e) {
    setTotDatum(e.target.value);
  } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Keuken"), /* @__PURE__ */ React.createElement("select", { style: SS.inp, value: filterOutlet, onChange: function(e) {
    setFilterOutlet(e.target.value);
  } }, /* @__PURE__ */ React.createElement("option", { value: "alle" }, "Alle"), /* @__PURE__ */ React.createElement("option", { value: "west" }, "West"), /* @__PURE__ */ React.createElement("option", { value: "weesp" }, "Weesp"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Status"), /* @__PURE__ */ React.createElement("select", { style: SS.inp, value: filterStatus, onChange: function(e) {
    setFilterStatus(e.target.value);
  } }, /* @__PURE__ */ React.createElement("option", { value: "alle" }, "Alle"), /* @__PURE__ */ React.createElement("option", { value: "opgezet" }, "Opgezet"), /* @__PURE__ */ React.createElement("option", { value: "uitgevoerd" }, "Uitgevoerd"))), /* @__PURE__ */ React.createElement("button", { style: SS.btnP, onClick: laad }, laden ? "Laden..." : "Laden")), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10 } }, /* @__PURE__ */ React.createElement("input", { style: SS.inp, value: zoek, onChange: function(e) {
    setZoek(e.target.value);
  }, placeholder: "🔍 Zoek boeking, gerecht, medewerker..." }))), totaal > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 } }, [["Registraties", totaal, C.aqua], ["Opgezet", opgezet, C.aqua], ["Uitgevoerd", uitgevoerd, C.green], ["Boekingen", uniekeBoekingen, C.night]].map(function(s) {
    return /* @__PURE__ */ React.createElement("div", { key: s[0], style: { ...SS.card, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 } }, s[0]), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, fontWeight: 900, color: s[2] } }, s[1]));
  })), totaal > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("button", { style: SS.btnP, onClick: exportExcel }, "📊 Export Excel")), laden && /* @__PURE__ */ React.createElement("div", { style: { padding: 30, textAlign: "center", color: C.muted } }, "Laden..."), !laden && totaal === 0 && /* @__PURE__ */ React.createElement("div", { style: { ...SS.card, textAlign: "center", padding: 30, color: C.muted } }, "Geen registraties gevonden. Selecteer een periode en klik Laden."), totaal > 0 && /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ React.createElement("table", { className:"kr-table", style: { ...SS.tbl, fontSize: 11 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, ["Datum/tijd", "Keuken", "Boeking", "Locatie", "Menu", "Gerecht", "Status", "Medewerker", "Porties"].map(function(h) {
    return /* @__PURE__ */ React.createElement("th", { key: h, style: SS.th }, h);
  }))), /* @__PURE__ */ React.createElement("tbody", null, gefilterd.map(function(r) {
    var kl = statusKleur[r.status] || C.muted;
    return /* @__PURE__ */ React.createElement("tr", { key: r.id, style: { background: r.status === "uitgevoerd" ? "#F0FFF4" : r.status === "opgezet" ? "#F0FAFF" : C.white } }, /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 10, whiteSpace: "nowrap", color: C.muted } }, (function(){ var t = r.uitgevoerd_op || r.opgezet_op || r.geregistreerd_op; return t ? new Date(t).toLocaleString("nl-NL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—"; })()), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 10 } }, r.outlet_code === "west" ? "West" : "Weesp"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 600, fontSize: 11 } }, r.boeking_naam || r.boeking_id), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 10, color: C.muted } }, r.locatie || "—"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 10 } }, r.menu_naam || "—"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 700 } }, r.gerecht_naam || "—"), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("span", { style: { background: kl + "22", color: kl, borderRadius: 8, padding: "1px 7px", fontSize: 10, fontWeight: 700 } }, r.status)), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11 } }, (r.uitgevoerd_door_naam || r.opgezet_door_naam || "—")), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, textAlign: "right", fontWeight: 700 } }, r.opgezet_porties || r.geplande_porties || "—"));
  })))));
}

  window._OpzetLogboekScreen = OpzetLogboekScreen;
})();


// ===== opzet-screen.js (20453 bytes) =====
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


// ===== pres-tab.js (16453 bytes) =====
// KitchenRobot module: pres-tab.js
// Geextraheerd uit index.html op 2026-05-05T12:24:49.637Z (v9 AST-walk v5)
// Bevat: PresTab
// Externe refs (via window._): alertI, btnP
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function PresTab({ g, items, setItems, onChange }) {
  var [gnFormaten, setGnFormaten] = useState([]);
  var [schaalFormaten, setSchaalFormaten] = useState([]);
  var [gerechtenGN, setGerechtenGN] = useState(g.gerecht_gn_formaten || []);
  var [gerechtenSchaal, setGerechtenSchaal] = useState(g.gerecht_schaal_formaten || []);
  var [melding, setMelding] = useState("");
  var isGn = !!g.is_gn;
  var [portiesGNState, setPortiesGNState] = useState(function() {
    var map = {};
    (g.gerecht_gn_formaten || []).forEach(function(item) {
      map[item.id] = String(item.porties_per_bak !== null && item.porties_per_bak !== void 0 ? item.porties_per_bak : 1);
    });
    return map;
  });
  var [portiesSchaalState, setPortiesSchaalState] = useState(function() {
    var map = {};
    (g.gerecht_schaal_formaten || []).forEach(function(item) {
      map[item.id] = String(item.porties_per_schaal !== null && item.porties_per_schaal !== void 0 ? item.porties_per_schaal : 1);
    });
    return map;
  });
  useEffect(function() {
    window._supa.from("standaard_gn_formaten").select("*").order("volgorde").then(function(r) {
      setGnFormaten(r.data || []);
    });
    window._supa.from("standaard_schaal_formaten").select("*").order("volgorde").then(function(r) {
      setSchaalFormaten(r.data || []);
    });
  }, []);
  function toon(t, fout) {
    setMelding(t);
    setTimeout(function() {
      setMelding("");
    }, fout ? 5e3 : 2e3);
  }
  function syncItems(nieuweGN, nieuweSchaal) {
    setItems(function(prev) {
      return prev.map(function(x) {
        if (x.id !== g.id) return x;
        var extra = {};
        if (nieuweGN !== void 0) extra.gerecht_gn_formaten = nieuweGN;
        if (nieuweSchaal !== void 0) extra.gerecht_schaal_formaten = nieuweSchaal;
        return Object.assign({}, x, extra);
      });
    });
  }
  function slaAllesOp() {
    var updatesGN = gerechtenGN.map(function(item) {
      var n = parseInt(portiesGNState[item.id]) || 1;
      return window._supa.from("gerecht_gn_formaten").update({ porties_per_bak: n }).eq("id", item.id).then(function(r) {
        if (r.error) throw new Error(r.error.message);
        return { id: item.id, n, type: "gn" };
      });
    });
    var updatesSchaal = gerechtenSchaal.map(function(item) {
      var n = parseInt(portiesSchaalState[item.id]) || 1;
      return window._supa.from("gerecht_schaal_formaten").update({ porties_per_schaal: n }).eq("id", item.id).then(function(r) {
        if (r.error) throw new Error(r.error.message);
        return { id: item.id, n, type: "schaal" };
      });
    });
    Promise.all(updatesGN.concat(updatesSchaal)).then(function(results) {
      var nieuwGN = gerechtenGN.map(function(x) {
        var r = results.find(function(r2) {
          return r2 && r2.type === "gn" && r2.id === x.id;
        });
        return r ? Object.assign({}, x, { porties_per_bak: r.n }) : x;
      });
      var nieuwSchaal = gerechtenSchaal.map(function(x) {
        var r = results.find(function(r2) {
          return r2 && r2.type === "schaal" && r2.id === x.id;
        });
        return r ? Object.assign({}, x, { porties_per_schaal: r.n }) : x;
      });
      setGerechtenGN(nieuwGN);
      setGerechtenSchaal(nieuwSchaal);
      syncItems(nieuwGN, nieuwSchaal);
      toon("Opgeslagen ✓");
      if (onChange) onChange();
    }).catch(function(e) {
      toon("Fout: " + e.message, true);
    });
  }
  function toggleGN(gfId, aan) {
    if (aan) {
      window._supa.from("gerecht_gn_formaten").insert({ gerecht_id: g.id, gn_formaat_id: gfId, porties_per_bak: 1, is_max_vorm: false, volgorde: gerechtenGN.length }).select("*, standaard_gn_formaten(*)").then(function(r) {
        if (r.error) {
          toon("Fout: " + r.error.message, true);
          return;
        }
        var nieuw = gerechtenGN.concat([r.data[0]]);
        setGerechtenGN(nieuw);
        setPortiesGNState(function(prev) {
          return Object.assign({}, prev, { [r.data[0].id]: "1" });
        });
        syncItems(nieuw, void 0);
        if (onChange) onChange();
      });
    } else {
      var item = gerechtenGN.find(function(x) {
        return x.gn_formaat_id === gfId;
      });
      if (!item) return;
      window._supa.from("gerecht_gn_formaten").delete().eq("id", item.id).then(function() {
        var nieuw = gerechtenGN.filter(function(x) {
          return x.gn_formaat_id !== gfId;
        });
        setGerechtenGN(nieuw);
        syncItems(nieuw, void 0);
        if (onChange) onChange();
      });
    }
  }
  function toggleSchaal(sfId, aan) {
    if (aan) {
      window._supa.from("gerecht_schaal_formaten").insert({ gerecht_id: g.id, schaal_formaat_id: sfId, porties_per_schaal: 1, is_max_vorm: false, volgorde: gerechtenSchaal.length }).select("*, standaard_schaal_formaten(*)").then(function(r) {
        if (r.error) {
          toon("Fout: " + r.error.message, true);
          return;
        }
        var nieuw = gerechtenSchaal.concat([r.data[0]]);
        setGerechtenSchaal(nieuw);
        setPortiesSchaalState(function(prev) {
          return Object.assign({}, prev, { [r.data[0].id]: "1" });
        });
        syncItems(void 0, nieuw);
        if (onChange) onChange();
      });
    } else {
      var item = gerechtenSchaal.find(function(x) {
        return x.schaal_formaat_id === sfId;
      });
      if (!item) return;
      window._supa.from("gerecht_schaal_formaten").delete().eq("id", item.id).then(function() {
        var nieuw = gerechtenSchaal.filter(function(x) {
          return x.schaal_formaat_id !== sfId;
        });
        setGerechtenSchaal(nieuw);
        syncItems(void 0, nieuw);
        if (onChange) onChange();
      });
    }
  }
  function setMaxVormGN(itemId) {
    var updates = gerechtenGN.map(function(x) {
      return window._supa.from("gerecht_gn_formaten").update({ is_max_vorm: x.id === itemId }).eq("id", x.id);
    });
    Promise.all(updates).then(function() {
      var nieuw = gerechtenGN.map(function(x) {
        return Object.assign({}, x, { is_max_vorm: x.id === itemId });
      });
      setGerechtenGN(nieuw);
      syncItems(nieuw, void 0);
      toon("Max vorm ingesteld ✓");
    });
  }
  function setMaxVormSchaal(itemId) {
    var updates = gerechtenSchaal.map(function(x) {
      return window._supa.from("gerecht_schaal_formaten").update({ is_max_vorm: x.id === itemId }).eq("id", x.id);
    });
    Promise.all(updates).then(function() {
      var nieuw = gerechtenSchaal.map(function(x) {
        return Object.assign({}, x, { is_max_vorm: x.id === itemId });
      });
      setGerechtenSchaal(nieuw);
      syncItems(void 0, nieuw);
      toon("Max vorm ingesteld ✓");
    });
  }
  if (!g.heeft_presentatie) {
    return /* @__PURE__ */ React.createElement("div", { style: SS.card }, /* @__PURE__ */ React.createElement("div", { style: window._alertI }, 'Zet "Presentatievorm van toepassing" op Ja via het tabblad Algemeen.'));
  }
  var gnTypeUitleg = {
    "GN_1_3_LAAG": "type 0 — 3 per dish",
    "GN_1_3_HOOG": "type 0 — 3 per dish",
    "GN_1_2_LAAG": "type 1 — 2 per dish",
    "GN_1_2_HOOG": "type 1 — 2 per dish",
    "GN_1_1_LAAG": "type 2 — 1 per dish",
    "GN_1_1_HOOG": "type 2 — 1 per dish"
  };
  var geselecteerdeGN = gerechtenGN.slice().sort(function(a, b) {
    return (a.volgorde || 0) - (b.volgorde || 0);
  });
  var geselecteerdeSchaal = gerechtenSchaal.slice().sort(function(a, b) {
    return (a.volgorde || 0) - (b.volgorde || 0);
  });
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, marginBottom: 12 } }, melding && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: melding.startsWith("Fout") ? C.hot : C.green } }, melding), (geselecteerdeGN.length > 0 || geselecteerdeSchaal.length > 0) && /* @__PURE__ */ React.createElement("button", { style: window._btnP, onClick: slaAllesOp }, "Opslaan")), isGn ? /* @__PURE__ */ React.createElement("div", { style: SS.card }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 14, marginBottom: 4 } }, "GN Bakken"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.muted, marginBottom: 4 } }, "Vink aan welke GN maten van toepassing zijn. Stel porties in. Markeer de ", /* @__PURE__ */ React.createElement("strong", null, "maximale vorm"), " voor de chafingdish berekening."), /* @__PURE__ */ React.createElement("div", { style: { ...window._alertI, fontSize: 11, marginBottom: 12 } }, "GN 1/3 = type 0 (3/dish) \u2022 GN 1/2 = type 1 (2/dish) \u2022 GN 1/1 = type 2 (1/dish)"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 } }, gnFormaten.map(function(gf) {
    var actief = gerechtenGN.some(function(x) {
      return x.gn_formaat_id === gf.id;
    });
    return /* @__PURE__ */ React.createElement("label", { key: gf.id, style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      background: actief ? C.light : C.gray,
      borderRadius: 14,
      cursor: "pointer",
      border: "1px solid " + (actief ? C.aqua : "transparent")
    } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: actief, onChange: function(e) {
      toggleGN(gf.id, e.target.checked);
    } }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: actief ? 700 : 400, fontSize: 12 } }, gf.naam), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.muted } }, gnTypeUitleg[gf.code] || "")));
  })), geselecteerdeGN.length > 0 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 12, marginBottom: 6 } }, "Porties per bak + maximale vorm:"), geselecteerdeGN.map(function(item) {
    var gf = item.standaard_gn_formaten || gnFormaten.find(function(f) {
      return f.id === item.gn_formaat_id;
    }) || {};
    var huidig = portiesGNState[item.id] !== void 0 ? portiesGNState[item.id] : String(item.porties_per_bak || 1);
    return /* @__PURE__ */ React.createElement("div", { key: item.id, style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 14px",
      background: item.is_max_vorm ? "#E8F8FF" : C.gray,
      border: "2px solid " + (item.is_max_vorm ? C.aqua : "transparent"),
      borderRadius: 14,
      marginBottom: 6
    } }, /* @__PURE__ */ React.createElement("div", { style: { minWidth: 110 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 13 } }, gf.naam), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: C.muted } }, gnTypeUitleg[gf.code] || "")), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, color: C.muted } }, "Porties:"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        min: "1",
        value: huidig,
        onChange: function(e) {
          var val = e.target.value;
          setPortiesGNState(function(prev) {
            return Object.assign({}, prev, { [item.id]: val });
          });
        },
        style: {
          ...SS.inp,
          width: 65,
          padding: "3px 6px",
          border: "1px solid " + (huidig === "1" ? "#FFC107" : C.border)
        }
      }
    ), /* @__PURE__ */ React.createElement("label", { style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      cursor: "pointer",
      background: item.is_max_vorm ? C.aqua : C.white,
      color: item.is_max_vorm ? C.white : C.night,
      padding: "4px 10px",
      borderRadius: 100,
      fontSize: 11,
      fontWeight: item.is_max_vorm ? 700 : 400,
      border: "1px solid " + C.aqua,
      marginLeft: "auto"
    } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "radio",
        name: "gnmax_" + g.id,
        checked: !!item.is_max_vorm,
        onChange: function() {
          setMaxVormGN(item.id);
        },
        style: { display: "none" }
      }
    ), item.is_max_vorm ? "✓ Max vorm" : "Markeer als max"));
  }))) : /* @__PURE__ */ React.createElement("div", { style: SS.card }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 14, marginBottom: 4 } }, "Schaalformaten"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.muted, marginBottom: 12 } }, "Vink aan welke schalen van toepassing zijn. Markeer de ", /* @__PURE__ */ React.createElement("strong", null, "maximale vorm"), "."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 16 } }, schaalFormaten.map(function(sf) {
    var actief = gerechtenSchaal.some(function(x) {
      return x.schaal_formaat_id === sf.id;
    });
    return /* @__PURE__ */ React.createElement("label", { key: sf.id, style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 14px",
      background: actief ? C.light : C.gray,
      borderRadius: 14,
      cursor: "pointer",
      flex: 1,
      border: "1px solid " + (actief ? C.aqua : "transparent")
    } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: actief, onChange: function(e) {
      toggleSchaal(sf.id, e.target.checked);
    } }), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: actief ? 700 : 400 } }, sf.naam));
  })), geselecteerdeSchaal.length > 0 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 12, marginBottom: 6 } }, "Porties per schaal + maximale vorm:"), geselecteerdeSchaal.map(function(item) {
    var sf = item.standaard_schaal_formaten || schaalFormaten.find(function(f) {
      return f.id === item.schaal_formaat_id;
    }) || {};
    var huidig = portiesSchaalState[item.id] !== void 0 ? portiesSchaalState[item.id] : String(item.porties_per_schaal || 1);
    return /* @__PURE__ */ React.createElement("div", { key: item.id, style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 14px",
      background: item.is_max_vorm ? "#E8F8FF" : C.gray,
      border: "2px solid " + (item.is_max_vorm ? C.aqua : "transparent"),
      borderRadius: 14,
      marginBottom: 6
    } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, fontSize: 13, minWidth: 110 } }, sf.naam), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, color: C.muted } }, "Porties:"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        min: "1",
        value: huidig,
        onChange: function(e) {
          var val = e.target.value;
          setPortiesSchaalState(function(prev) {
            return Object.assign({}, prev, { [item.id]: val });
          });
        },
        style: {
          ...SS.inp,
          width: 65,
          padding: "3px 6px",
          border: "1px solid " + (huidig === "1" ? "#FFC107" : C.border)
        }
      }
    ), /* @__PURE__ */ React.createElement("label", { style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      cursor: "pointer",
      background: item.is_max_vorm ? C.aqua : C.white,
      color: item.is_max_vorm ? C.white : C.night,
      padding: "4px 10px",
      borderRadius: 100,
      fontSize: 11,
      fontWeight: item.is_max_vorm ? 700 : 400,
      border: "1px solid " + C.aqua,
      marginLeft: "auto"
    } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "radio",
        name: "schaalmax_" + g.id,
        checked: !!item.is_max_vorm,
        onChange: function() {
          setMaxVormSchaal(item.id);
        },
        style: { display: "none" }
      }
    ), item.is_max_vorm ? "✓ Max vorm" : "Markeer als max"));
  }))));
}

  window._PresTab = PresTab;
})();


// ===== sensoren-screen.js (16121 bytes) =====
// KitchenRobot module: sensoren-screen.js
// Geextraheerd uit index.html op 2026-05-05T12:13:45.714Z (v9 AST-walk v5)
// Bevat: SensorenScreen
// Externe refs (via window._): (geen)
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function SensorenScreen() {
  var C = window._C || { night:'#234756', aqua:'#3FB8C4', hot:'#E8202B', green:'#2E7D32', muted:'#78909C', white:'#fff', orange:'#FF9800' };
  var SS = window._SS || { pT: { fontSize:22, fontWeight:900, color:'#234756', marginBottom:4 }, pD: { fontSize:12, color:'#78909C', marginBottom:16 } };
  var [sensoren, setSensoren] = React.useState([]);
  var [laden, setLaden] = React.useState(true);
  var [token, setToken] = React.useState('');
  var [secret, setSecret] = React.useState('');
  var [credsBezig, setCredsBezig] = React.useState(false);
  var [credsMelding, setCredsMelding] = React.useState(null);
  var [testMelding, setTestMelding] = React.useState(null);
  var [devices, setDevices] = React.useState([]);
  var [devicesLaden, setDevicesLaden] = React.useState(false);
  var [syncBezig, setSyncBezig] = React.useState(false);
  var [syncResult, setSyncResult] = React.useState(null);

  function laadStatus() {
    setLaden(true);
    window._supa.from('v_kiosk_sensor_status').select('*').order('naam').then(function(r) {
      setSensoren(r.data || []);
      setLaden(false);
    });
  }
  React.useEffect(laadStatus, []);
  React.useEffect(function() {
    var t = setInterval(laadStatus, 30000);
    return function(){ clearInterval(t); };
  }, []);

  function toon(set, tekst, ok) {
    set({ tekst: tekst, ok: ok !== false });
    setTimeout(function(){ set(null); }, 4000);
  }

  function saveCreds() {
    if (!token.trim() || !secret.trim()) { toon(setCredsMelding, 'Token en secret invullen', false); return; }
    setCredsBezig(true);
    fetch('https://aezatnwsrhlwtykpixsq.supabase.co/functions/v1/switchbot-sync?actie=credentials', {
      method: 'POST', headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ token: token.trim(), secret: secret.trim() })
    }).then(function(r){ return r.json(); }).then(function(d) {
      setCredsBezig(false);
      if (d.ok) {
        toon(setCredsMelding, '✓ Credentials opgeslagen. Druk op "Test verbinding".');
        setToken(''); setSecret('');
      } else toon(setCredsMelding, 'Fout: ' + (d.error||'onbekend'), false);
    });
  }

  function testVerbinding() {
    toon(setTestMelding, '⏳ Verbinden...', true);
    fetch('https://aezatnwsrhlwtykpixsq.supabase.co/functions/v1/switchbot-sync?actie=test').then(function(r){ return r.json(); }).then(function(d) {
      if (d.ok) toon(setTestMelding, '✓ ' + d.bericht);
      else toon(setTestMelding, '✗ ' + (d.error || 'fout'), false);
    });
  }

  function laadDevices() {
    setDevicesLaden(true);
    fetch('https://aezatnwsrhlwtykpixsq.supabase.co/functions/v1/switchbot-sync?actie=devices').then(function(r){ return r.json(); }).then(function(d) {
      setDevicesLaden(false);
      if (d.ok) setDevices(d.meters || []);
      else alert('Fout: ' + (d.error||''));
    });
  }

  function koppelDevice(sensorId, deviceId, deviceType, macAdres) {
    window._supa.from('kiosk_sensoren').update({
      switchbot_device_id: deviceId,
      switchbot_device_type: deviceType,
      mac_adres: macAdres,
      actief: true
    }).eq('id', sensorId).then(function(r) {
      if (r.error) alert('Fout: ' + r.error.message);
      else laadStatus();
    });
  }

  function ontkoppel(sensorId) {
    if (!confirm('Sensor ontkoppelen? De meetgeschiedenis blijft bewaard.')) return;
    window._supa.from('kiosk_sensoren').update({
      switchbot_device_id: null, switchbot_device_type: null, actief: false
    }).eq('id', sensorId).then(function(){ laadStatus(); });
  }

  function syncNu() {
    setSyncBezig(true);
    setSyncResult(null);
    fetch('https://aezatnwsrhlwtykpixsq.supabase.co/functions/v1/switchbot-sync?actie=sync', { method:'POST' })
      .then(function(r){ return r.json(); }).then(function(d) {
        setSyncBezig(false);
        setSyncResult(d);
        laadStatus();
      });
  }

  function statusBadge(status) {
    var cfg = {
      'ok': { bg:'#E8F5E9', color:C.green, txt:'✓ Binnen norm' },
      'te_warm': { bg:'#FFEBEE', color:C.hot, txt:'⚠ Te warm' },
      'te_koud': { bg:'#E3F2FD', color:'#1565C0', txt:'⚠ Te koud' },
      'geen_data': { bg:'#F5F5F5', color:C.muted, txt:'— Geen data' }
    };
    var c = cfg[status] || cfg['geen_data'];
    return React.createElement('span', { style:{background:c.bg,color:c.color,borderRadius:100,padding:'3px 10px',fontSize:11,fontWeight:700,whiteSpace:'nowrap'} }, c.txt);
  }
  function onlineBadge(status) {
    var cfg = {
      'online': { bg:'#E8F5E9', color:C.green, txt:'🟢 Online' },
      'vertraagd': { bg:'#FFF3E0', color:C.orange, txt:'🟡 Vertraagd' },
      'offline': { bg:'#FFEBEE', color:C.hot, txt:'🔴 Offline' },
      'nooit': { bg:'#F5F5F5', color:C.muted, txt:'— Nog geen meting' }
    };
    var c = cfg[status] || cfg['nooit'];
    return React.createElement('span', { style:{background:c.bg,color:c.color,borderRadius:100,padding:'3px 10px',fontSize:11,fontWeight:700,whiteSpace:'nowrap',marginLeft:4} }, c.txt);
  }

  var nGekoppeld = sensoren.filter(function(s){ return s.switchbot_device_id; }).length;
  var nOnline = sensoren.filter(function(s){ return s.online_status === 'online'; }).length;
  var nAlert = sensoren.filter(function(s){ return s.norm_status === 'te_warm' || s.norm_status === 'te_koud'; }).length;

  return React.createElement('div', null,
    React.createElement('div', { style: SS.pT }, '🌡️ Temperatuur-sensoren'),
    React.createElement('div', { style: SS.pD }, 'SwitchBot Hub Mini + Thermo-hygrometers voor automatische HACCP-registratie'),

    // KPI row
    React.createElement('div', { style:{display:'flex',gap:8,flexWrap:'wrap',marginBottom:16} },
      React.createElement('div', { style:{background:C.white,borderRadius:10,padding:'12px 16px',flex:1,minWidth:140} },
        React.createElement('div', { style:{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:1,textTransform:'uppercase'} }, 'Gekoppeld'),
        React.createElement('div', { style:{fontSize:22,fontWeight:900,color:C.night} }, nGekoppeld + ' / ' + sensoren.length)),
      React.createElement('div', { style:{background:C.white,borderRadius:10,padding:'12px 16px',flex:1,minWidth:140} },
        React.createElement('div', { style:{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:1,textTransform:'uppercase'} }, 'Online nu'),
        React.createElement('div', { style:{fontSize:22,fontWeight:900,color:nOnline > 0 ? C.green : C.muted} }, nOnline)),
      React.createElement('div', { style:{background:C.white,borderRadius:10,padding:'12px 16px',flex:1,minWidth:140} },
        React.createElement('div', { style:{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:1,textTransform:'uppercase'} }, 'Norm-alerts'),
        React.createElement('div', { style:{fontSize:22,fontWeight:900,color:nAlert > 0 ? C.hot : C.green} }, nAlert))
    ),

    // STAP 1: Credentials
    React.createElement('details', { style:{background:C.white,borderRadius:10,padding:'14px 18px',marginBottom:12}, open: nGekoppeld === 0 },
      React.createElement('summary', { style:{cursor:'pointer',fontSize:13,fontWeight:800,color:C.night} }, '🔐 Stap 1: SwitchBot API-credentials'),
      React.createElement('div', { style:{marginTop:10,fontSize:12,color:C.muted,lineHeight:1.5} },
        'Open SwitchBot app → Profile → Preferences → About → tik 10x op App Version → Developer Options → kopieer Token en Secret.'),
      React.createElement('div', { style:{display:'flex',gap:6,marginTop:10,flexWrap:'wrap'} },
        React.createElement('input', { type:'text', placeholder:'Token', value:token, onChange:function(e){ setToken(e.target.value); },
          style:{flex:2,minWidth:200,padding:'8px 10px',border:'1px solid #D8E8EF',borderRadius:6,fontSize:12,fontFamily:'monospace'} }),
        React.createElement('input', { type:'text', placeholder:'Secret', value:secret, onChange:function(e){ setSecret(e.target.value); },
          style:{flex:2,minWidth:200,padding:'8px 10px',border:'1px solid #D8E8EF',borderRadius:6,fontSize:12,fontFamily:'monospace'} }),
        React.createElement('button', { onClick:saveCreds, disabled:credsBezig,
          style:{background:C.green,color:'#fff',border:'none',borderRadius:6,padding:'8px 16px',fontWeight:700,fontSize:12,cursor:'pointer',fontFamily:'inherit'} }, credsBezig ? '...' : 'Opslaan'),
        React.createElement('button', { onClick:testVerbinding,
          style:{background:C.aqua,color:'#fff',border:'none',borderRadius:6,padding:'8px 16px',fontWeight:700,fontSize:12,cursor:'pointer',fontFamily:'inherit'} }, 'Test verbinding')
      ),
      credsMelding && React.createElement('div', { style:{marginTop:8,fontSize:12,color:credsMelding.ok ? C.green : C.hot} }, credsMelding.tekst),
      testMelding && React.createElement('div', { style:{marginTop:8,fontSize:12,color:testMelding.ok ? C.green : C.hot} }, testMelding.tekst)
    ),

    // STAP 2: Devices ophalen en koppelen
    React.createElement('details', { style:{background:C.white,borderRadius:10,padding:'14px 18px',marginBottom:12}, open: nGekoppeld === 0 && devices.length === 0 },
      React.createElement('summary', { style:{cursor:'pointer',fontSize:13,fontWeight:800,color:C.night} }, '🔗 Stap 2: Devices uit SwitchBot ophalen en koppelen'),
      React.createElement('div', { style:{marginTop:10} },
        React.createElement('button', { onClick:laadDevices, disabled:devicesLaden,
          style:{background:C.aqua,color:'#fff',border:'none',borderRadius:6,padding:'8px 14px',fontWeight:700,fontSize:12,cursor:'pointer',fontFamily:'inherit'} }, devicesLaden ? 'Laden...' : '🔄 Haal sensoren uit SwitchBot')),
      devices.length > 0 && React.createElement('div', { style:{marginTop:12} },
        React.createElement('div', { style:{fontSize:11,color:C.muted,marginBottom:6} }, devices.length + ' sensor(en) gevonden — koppel aan de juiste locatie:'),
        devices.map(function(d, i) {
          var alGekoppeld = sensoren.find(function(s){ return s.switchbot_device_id === d.deviceId; });
          return React.createElement('div', { key:d.deviceId, style:{display:'flex',alignItems:'center',gap:8,padding:'8px 10px',background:alGekoppeld ? '#F0F4F7' : '#F8FAFC',borderRadius:8,marginBottom:4,flexWrap:'wrap'} },
            React.createElement('div', { style:{flex:1,minWidth:200} },
              React.createElement('div', { style:{fontSize:13,fontWeight:700,color:C.night} }, d.deviceName || d.deviceId),
              React.createElement('div', { style:{fontSize:10,color:C.muted,fontFamily:'monospace'} }, d.deviceType + ' · ' + d.deviceId)
            ),
            alGekoppeld
              ? React.createElement('span', { style:{fontSize:12,color:C.green,fontWeight:700} }, '✓ Gekoppeld aan ' + alGekoppeld.naam)
              : React.createElement('select', {
                  onChange: function(e) {
                    if (e.target.value) {
                      koppelDevice(e.target.value, d.deviceId, d.deviceType, d.deviceId);
                      e.target.value = '';
                    }
                  },
                  defaultValue: '',
                  style:{padding:'6px 10px',border:'1px solid #D8E8EF',borderRadius:6,fontSize:12,fontFamily:'inherit',minWidth:160}
                },
                  React.createElement('option', { value:'' }, 'Koppel aan locatie...'),
                  sensoren.filter(function(s){ return !s.switchbot_device_id; }).map(function(s) {
                    return React.createElement('option', { key:s.id, value:s.id }, s.naam + ' (' + s.outlet_code + ')');
                  })
                )
          );
        })
      )
    ),

    // Sync knop + resultaat
    React.createElement('div', { style:{background:'#F8FAFC',borderRadius:10,padding:'12px 18px',marginBottom:12,display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'} },
      React.createElement('div', { style:{fontSize:12,color:C.muted,flex:1} }, 'Auto-sync: elke 5 minuten. Handmatig triggeren:'),
      React.createElement('button', { onClick:syncNu, disabled:syncBezig,
        style:{background:C.night,color:'#fff',border:'none',borderRadius:6,padding:'8px 14px',fontWeight:700,fontSize:12,cursor:'pointer',fontFamily:'inherit'} }, syncBezig ? '⏳ Syncen...' : '🔄 Sync nu'),
      syncResult && React.createElement('div', { style:{fontSize:11,color: syncResult.ok ? C.green : C.hot} },
        syncResult.ok
          ? '✓ ' + syncResult.verwerkt + '/' + syncResult.totaal + ' sensoren gesynct' + (syncResult.mislukt > 0 ? ' (' + syncResult.mislukt + ' fout)' : '')
          : '✗ ' + syncResult.error)
    ),

    // Sensor-status lijst
    React.createElement('div', { style:{fontSize:11,fontWeight:800,color:C.night,letterSpacing:1,textTransform:'uppercase',marginBottom:6} }, '📍 Alle sensoren (live status)'),
    laden ? React.createElement('div', { style:{padding:30,textAlign:'center',color:C.muted} }, '⏳ Laden...') :
    React.createElement('div', { className:'kr-table-scroll' },
      React.createElement('table', { className:'kr-table' },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', null, 'Naam'),
            React.createElement('th', null, 'Outlet'),
            React.createElement('th', null, 'Norm'),
            React.createElement('th', { 'data-num':'1' }, 'Temperatuur'),
            React.createElement('th', { 'data-num':'1' }, 'Vocht'),
            React.createElement('th', { 'data-num':'1' }, 'Batterij'),
            React.createElement('th', null, 'Status'),
            React.createElement('th', null, 'Laatste meting'),
            React.createElement('th', null, 'Actie')
          )
        ),
        React.createElement('tbody', null,
          sensoren.map(function(s) {
            return React.createElement('tr', { key:s.id },
              React.createElement('td', { style:{fontWeight:700} }, s.naam),
              React.createElement('td', null, s.outlet_code),
              React.createElement('td', null, s.min_norm + '° – ' + s.max_norm + '°'),
              React.createElement('td', { style:{textAlign:'right',fontWeight:700,color: s.norm_status === 'ok' ? C.green : (s.norm_status === 'geen_data' ? C.muted : C.hot)} },
                s.temperatuur !== null ? parseFloat(s.temperatuur).toFixed(1) + '°' : '—'),
              React.createElement('td', { style:{textAlign:'right',color:C.muted} }, s.luchtvochtigheid !== null ? Math.round(s.luchtvochtigheid) + '%' : '—'),
              React.createElement('td', { style:{textAlign:'right',color: s.batterij_pct !== null && s.batterij_pct < 20 ? C.hot : C.muted} },
                s.batterij_pct !== null ? s.batterij_pct + '%' : '—'),
              React.createElement('td', null, statusBadge(s.norm_status), onlineBadge(s.online_status)),
              React.createElement('td', { style:{fontSize:11,color:C.muted} },
                s.laatste_meting
                  ? (s.minuten_geleden < 60 ? Math.round(s.minuten_geleden) + ' min' : Math.round(s.minuten_geleden/60) + ' uur') + ' geleden'
                  : 'Nog nooit'),
              React.createElement('td', null,
                s.switchbot_device_id
                  ? React.createElement('button', { onClick: function(){ ontkoppel(s.id); },
                      style:{background:'transparent',border:'1px solid ' + C.hot,color:C.hot,borderRadius:6,padding:'4px 8px',fontSize:10,fontWeight:700,cursor:'pointer',fontFamily:'inherit'} }, 'Ontkoppel')
                  : React.createElement('span', { style:{fontSize:10,color:C.muted,fontStyle:'italic'} }, 'niet gekoppeld'))
            );
          })
        )
      )
    )
  );
}

  window._SensorenScreen = SensorenScreen;
})();


// ===== sligro-bestelling-screen.js (35678 bytes) =====
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


// ===== stam-screen.js (8664 bytes) =====
// KitchenRobot module: stam-screen.js
// Geextraheerd uit index.html op 2026-05-05T12:36:42.733Z (v9 AST-walk v5)
// Bevat: StamScreen
// Externe refs (via window._): AllergenenOverzichtTab, GERECHTEN_INIT, GerechtenTab, MENUS_INIT, MenusTab, PGTab, PRODUCTGROEPEN, RecrasTab, SLIGRO_INIT, SligroTab, btnP, btnSG, btnSP, tg
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function StamScreen({ initTab }) {
  var [tab, setTab] = useState(initTab || "pg");
  // NIEUW: luister naar initTab-verandering bij nav-klik
  useEffect(function() {
    if (initTab && initTab !== tab) {
      setTab(initTab);
      setPendingTab(null);
    }
  }, [initTab]);
  var [heeftWijzigingen, setHeeftWijzigingen] = useState(false);
  var [pendingTab, setPendingTab] = useState(null);
  var [opslaanBezig, setOpslaanBezig] = useState(false);
  var [opslaanMelding, setOpslaanMelding] = useState("");
  var [productgroepen, setProductgroepen] = useState(window._PRODUCTGROEPEN);
  var [gerechten, setGerechten] = useState(window._GERECHTEN_INIT);
  var [menus, setMenus] = useState(window._MENUS_INIT);
  var [sligro, setSligro] = useState(window._SLIGRO_INIT);
  var [laden, setLaden] = useState(true);
  useEffect(function() {
    setLaden(true);
    Promise.all([
      window._supa.from("productgroepen").select("*, productsoorten(*)").order("volgorde"),
      window._supa.from("gerechten").select("*, ingredienten(*), presentatievormen(*), gerecht_gn_formaten(*, standaard_gn_formaten(*)), gerecht_schaal_formaten(*, standaard_schaal_formaten(*)), gerecht_productsoort_koppelingen(productsoort_id)").order("naam"),
      window._supa.from("menus").select("*, menu_gerechten(*, gerechten(*))").order("code"),
      window._supa.from("sligro_producten").select("*, sligro_productgroep_koppelingen(productgroep_id)").order("naam")
    ]).then(function(results) {
      var pgData = results[0].data || [];
      if (pgData.length > 0) {
        setProductgroepen(pgData.map(function(pg) {
          return Object.assign({}, pg, { id: pg.id, soorten: (pg.productsoorten || []).map(function(ps) {
            return { id: ps.id, code: ps.code, naam: ps.naam };
          }) });
        }));
      }
      if (results[1].data && results[1].data.length > 0) setGerechten(results[1].data);
      if (results[2].data && results[2].data.length > 0) setMenus(results[2].data);
      if (results[3].data && results[3].data.length > 0) setSligro(results[3].data.map(function(p) {
        var koppelingen = (p.sligro_productgroep_koppelingen || []).map(function(k) {
          return k.productgroep_id;
        });
        return Object.assign({}, p, {
          artnr: p.artnr,
          naam: p.naam,
          merk: p.merk || "",
          pgIds: koppelingen.length ? koppelingen : p.productgroep_id ? [p.productgroep_id] : [],
          hoev: p.hoeveelheid,
          eenh: p.eenheid,
          prijs: p.prijs_excl,
          ok: p.ingesteld
        });
      }));
      setLaden(false);
      window._stamProductgroepen = (results[0].data || []).map(function(pg) { return Object.assign({}, pg, { soorten: pg.productsoorten || [] }); });
      window._stamGerechten = results[1].data || [];
      window._stamMenus = results[2].data || [];
      window._stamSligro = (results[3].data || []).map(function(p) {
        var kops = (p.sligro_productgroep_koppelingen || []).map(function(k) {
          return k.productgroep_id;
        });
        return Object.assign({}, p, { pgIds: kops.length ? kops : p.productgroep_id ? [p.productgroep_id] : [], hoev: p.hoeveelheid, eenh: p.eenheid, prijs: p.prijs_excl });
      });
      window._supa.from("recras_koppelingen").select("*").then(function(r) {
        window._stamKoppelingen = r.data || [];
      });
      window._supa.from("opzet_instellingen").select("*").then(function(r) {
        window._stamTijdenInst = (r.data || []).map(function(row) {
          try {
            return JSON.parse(row.instellingen_json || "{}");
          } catch (e) {
            return {};
          }
        });
      });
    }).catch(function(e) {
      console.warn("Supabase laden mislukt:", e);
      setLaden(false);
    });
  }, []);
  var tabs = [["pg", "Productgroepen"], ["sl", "Sligro Import"], ["gr", "Gerechten"], ["ti", "Buffet / Tijden"], ["mn", "Menus"], ["re", "Recras Import"], ["al", "🏷 Allergenen"], ["ki", "📱 Kiosk"], ["ins", "📄 Instructies"], ["dr", "📖 Draaiboek-links"]];
  function switchTab(newTab) {
    if (heeftWijzigingen) {
      setPendingTab(newTab);
    } else {
      setTab(newTab);
    }
  }
  function markeerGewijzigd() {
    setHeeftWijzigingen(true);
  }
  function markeerOpgeslagen() {
    setHeeftWijzigingen(false);
    setOpslaanMelding("Opgeslagen!");
    setTimeout(function() {
      setOpslaanMelding("");
    }, 2e3);
  }
  function bevestigWisselen() {
    setTab(pendingTab);
    setPendingTab(null);
    setHeeftWijzigingen(false);
  }
  function annuleerWisselen() {
    setPendingTab(null);
  }
  if (laden) {
    return React.createElement("div", { style: { padding: 40, textAlign: "center", color: C.muted } }, "Stamgegevens laden...");
  }
  return /* @__PURE__ */ React.createElement("div", null, pendingTab && /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(35,71,86,.65)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { background: C.white, borderRadius: 14, padding: 28, width: 420, boxShadow: "0 8px 28px rgba(0,0,0,.3)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 900, fontSize: 18, color: C.night, marginBottom: 8 } }, "Niet-opgeslagen wijzigingen"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: C.muted, margin: "0 0 20px" } }, "Je hebt wijzigingen die nog niet zijn opgeslagen. Wil je doorgaan zonder opslaan?"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("button", { style: window._btnSG, onClick: annuleerWisselen }, "Terug — ik ga opslaan"), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSP, background: C.orange }, onClick: bevestigWisselen }, "Toch doorgaan")))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: SS.pT }, "Stamgegevens"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, heeftWijzigingen && /* @__PURE__ */ React.createElement("span", { style: { ...window._tg(C.orange), fontSize: 11, padding: "4px 10px" } }, "Niet-opgeslagen wijzigingen"), opslaanMelding && /* @__PURE__ */ React.createElement("span", { style: { ...window._tg(C.green), fontSize: 11, padding: "4px 10px" } }, opslaanMelding), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnP, opacity: heeftWijzigingen ? 1 : 0.45 }, onClick: markeerOpgeslagen }, "Opslaan"))), tab === "pg" && /* @__PURE__ */ React.createElement(window._PGTab, { productgroepen, setProductgroepen, onChange: markeerGewijzigd, onSave: markeerOpgeslagen }), tab === "sl" && /* @__PURE__ */ React.createElement(window._SligroTab, { sligro, setSligro, productgroepen, onChange: markeerGewijzigd, onSave: markeerOpgeslagen }), tab === "gr" && /* @__PURE__ */ React.createElement(window._GerechtenTab, { gerechten, setGerechten, productgroepen, sligro, onChange: markeerGewijzigd, onSave: markeerOpgeslagen }), tab === "ti" && /* @__PURE__ */ React.createElement(window._TijdenTab, { productgroepen, onChange: markeerGewijzigd, onSave: markeerOpgeslagen }), tab === "mn" && /* @__PURE__ */ React.createElement(window._MenusTab, { menus, setMenus, gerechten, productgroepen, onChange: markeerGewijzigd, onSave: markeerOpgeslagen }), tab === "re" && /* @__PURE__ */ React.createElement(window._RecrasTab, { menus, onChange: markeerGewijzigd, onSave: markeerOpgeslagen }), tab === "al" && /* @__PURE__ */ React.createElement(window._AllergenenOverzichtTab, { gerechten, sligro, productgroepen }), tab === "ki" && /* @__PURE__ */ React.createElement(window._KioskBeheerTab, null), tab === "ins" && /* @__PURE__ */ React.createElement(window._InstructiesTab, null), tab === "dr" && /* @__PURE__ */ React.createElement(window._DraaiboekLinksTab, null));
}

  window._StamScreen = StamScreen;
})();


// ===== tijden-screen.js (22551 bytes) =====
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


// ===== tijden-tab.js (15950 bytes) =====
// KitchenRobot module: tijden-tab.js
// Geextraheerd uit index.html op 2026-05-05T12:24:49.393Z (v9 AST-walk v5)
// Bevat: TijdenTab
// Externe refs (via window._): alertI, btnP, btnSA, btnSG
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function TijdenTab({ productgroepen, onChange, onSave }) {
  var allePsIds = productgroepen.reduce(function(acc, g) {
    return acc.concat(g.soorten || []);
  }, []);
  var [actief, setActief] = useState(allePsIds.length > 0 ? allePsIds[0].id : "");
  var [instellingen, setInstellingen] = useState({});
  var [geladen, setGeladen] = useState(false);
  var [melding, setMelding] = useState("");
  useEffect(function() {
    if (allePsIds.length > 0 && !actief) setActief(allePsIds[0].id);
  }, [productgroepen]);
  useEffect(function() {
    window._supa.from("opzet_instellingen").select("*").then(function(r) {
      var map = {};
      (r.data || []).forEach(function(row) {
        try {
          map[row.productsoort_id] = JSON.parse(row.instellingen_json);
        } catch (e) {
        }
      });
      setInstellingen(map);
      setGeladen(true);
    });
  }, []);
  function toon(t, fout) {
    setMelding(t);
    setTimeout(function() {
      setMelding("");
    }, fout ? 5e3 : 2e3);
  }
  var pg = productgroepen.find(function(g) {
    return (g.soorten || []).some(function(s) {
      return s.id === actief;
    });
  });
  var ps = allePsIds.find(function(s) {
    return s.id === actief;
  });
  var inst = instellingen[actief] || {
    marges: [{ tot: "10", pct: "100" }, { tot: "25", pct: "95" }, { tot: "50", pct: "90" }, { tot: "100", pct: "85" }],
    bufs: [{ tot: "100", aantal: "1" }, { tot: "200", aantal: "2" }, { tot: "300", aantal: "3" }],
    tijden: [],
    minVoorRecras: 30
  };
  function updateInst(wijziging) {
    var nieuw = Object.assign({}, instellingen, { [actief]: Object.assign({}, inst, wijziging) });
    setInstellingen(nieuw);
    if (onChange) onChange();
  }
  function slaOp() {
    var data = { productsoort_id: actief, instellingen_json: JSON.stringify(inst) };
    window._supa.from("opzet_instellingen").upsert(data, { onConflict: "productsoort_id" }).then(function(r) {
      if (r.error) {
        toon("Fout: " + r.error.message, true);
        return;
      }
      toon("Instellingen opgeslagen ✓");
      if (onSave) onSave();
    });
  }
  function updateMarge(i, veld, waarde) {
    var nieuwMarges = inst.marges.map(function(m, j) {
      return j === i ? Object.assign({}, m, { [veld]: waarde }) : m;
    });
    updateInst({ marges: nieuwMarges });
  }
  function updateBuf(i, veld, waarde) {
    var nieuwBufs = inst.bufs.map(function(b, j) {
      return j === i ? Object.assign({}, b, { [veld]: waarde }) : b;
    });
    updateInst({ bufs: nieuwBufs });
  }
  function updateTijd(id, veld, waarde) {
    var nieuwTijden = inst.tijden.map(function(t) {
      return t.id === id ? Object.assign({}, t, { [veld]: waarde }) : t;
    });
    updateInst({ tijden: nieuwTijden });
  }
  function voegTijdToe() {
    var naam = prompt("Naam van de tijdinstelling:");
    if (!naam) return;
    var nieuweId = Date.now();
    var nieuwTijden = inst.tijden.concat([{ id: nieuweId, naam, minuten: "60", perGroep: false, kwalificatie: "Algemeen", basis: "vorige" }]);
    updateInst({ tijden: nieuwTijden });
  }
  function verwijderTijd(id) {
    updateInst({ tijden: inst.tijden.filter(function(t) {
      return t.id !== id;
    }) });
  }
  if (!geladen) return React.createElement("div", { style: { padding: 20, color: C.muted } }, "Laden...");
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 5, marginBottom: 12, flexWrap: "wrap" } }, allePsIds.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { color: C.muted } }, "Voeg eerst productgroepen toe.") : allePsIds.map(function(ps_) {
    return /* @__PURE__ */ React.createElement("button", { key: ps_.id, style: {
      background: actief === ps_.id ? C.night : C.white,
      color: actief === ps_.id ? C.white : C.night,
      border: "1.5px solid " + (actief === ps_.id ? C.night : C.border),
      borderRadius: 100,
      padding: "4px 11px",
      fontFamily: "inherit",
      fontWeight: 700,
      fontSize: 11,
      cursor: "pointer"
    }, onClick: function() {
      setActief(ps_.id);
    } }, ps_.naam);
  })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 900, fontSize: 12 } }, pg ? pg.naam : "", " — ", ps ? ps.naam : ""), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } }, melding && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: melding.startsWith("Fout") ? C.hot : C.green } }, melding), /* @__PURE__ */ React.createElement("button", { style: window._btnP, onClick: slaOp }, "Opslaan"))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: SS.card }, /* @__PURE__ */ React.createElement("div", { style: SS.cT }, "Opzetmarges"), /* @__PURE__ */ React.createElement("table", { className:"kr-table", style: SS.tbl }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, ["Tot pers.", "Pct %", ""].map(function(h) {
    return /* @__PURE__ */ React.createElement("th", { key: h, style: SS.th }, h);
  }))), /* @__PURE__ */ React.createElement("tbody", null, inst.marges.map(function(m, i) {
    return /* @__PURE__ */ React.createElement("tr", { key: i }, /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement(
      "input",
      {
        value: m.tot,
        style: { ...SS.inp, width: 55, padding: "3px 7px" },
        onChange: function(e) {
          updateMarge(i, "tot", e.target.value);
        }
      }
    )), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement(
      "input",
      {
        value: m.pct,
        style: { ...SS.inp, width: 55, padding: "3px 7px" },
        onChange: function(e) {
          updateMarge(i, "pct", e.target.value);
        }
      }
    )), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, color: C.hot }, onClick: function() {
      updateInst({ marges: inst.marges.filter(function(_, j) {
        return j !== i;
      }) });
    } }, "\u2715")));
  }))), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSA, marginTop: 6, fontSize: 10 }, onClick: function() {
    updateInst({ marges: inst.marges.concat([{ tot: "", pct: "" }]) });
  } }, "+ Rij")), /* @__PURE__ */ React.createElement("div", { style: SS.card }, /* @__PURE__ */ React.createElement("div", { style: SS.cT }, "Buffet per groepsgrootte"), /* @__PURE__ */ React.createElement("table", { className:"kr-table", style: SS.tbl }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, ["Tot pers.", "Aantal bufs", ""].map(function(h) {
    return /* @__PURE__ */ React.createElement("th", { key: h, style: SS.th }, h);
  }))), /* @__PURE__ */ React.createElement("tbody", null, inst.bufs.map(function(b, i) {
    return /* @__PURE__ */ React.createElement("tr", { key: i }, /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement(
      "input",
      {
        value: b.tot,
        style: { ...SS.inp, width: 55, padding: "3px 7px" },
        onChange: function(e) {
          updateBuf(i, "tot", e.target.value);
        }
      }
    )), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement(
      "input",
      {
        value: b.aantal,
        style: { ...SS.inp, width: 55, padding: "3px 7px" },
        onChange: function(e) {
          updateBuf(i, "aantal", e.target.value);
        }
      }
    )), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, color: C.hot }, onClick: function() {
      updateInst({ bufs: inst.bufs.filter(function(_, j) {
        return j !== i;
      }) });
    } }, "\u2715")));
  }))), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSA, marginTop: 6, fontSize: 10 }, onClick: function() {
    updateInst({ bufs: inst.bufs.concat([{ tot: "", aantal: "" }]) });
  } }, "+ Rij"))), /* @__PURE__ */ React.createElement("div", { style: SS.card }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: SS.cT }, "Tijdinstellingen"), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSA, fontSize: 10 }, onClick: voegTijdToe }, "+ Tijdstip")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12, padding: "8px 14px", background: inst.geenTijden ? "#FFF3E0" : C.light, borderRadius: 14, border: "1px solid " + (inst.geenTijden ? "#FF9800" : C.border) } }, /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flex: 1 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked: !!inst.geenTijden,
      onChange: function(e) {
        updateInst({ geenTijden: e.target.checked });
      }
    }
  ), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, fontSize: 12 } }, "Geen tijdinstellingen voor deze productsoort")), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: C.muted } }, inst.geenTijden ? "Alleen Recras deadline wordt gebruikt." : "Tijden worden berekend vanuit onderstaande instellingen.")), /* @__PURE__ */ React.createElement("div", { style: { ...window._alertI, fontSize: 11, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("strong", null, "Tijdlogica:"), ' De eerste tijdstelling is X minuten v\xF3\xF3r de Recras starttijd. Elke volgende tijdstelling is X minuten v\xF3\xF3r de vorige. Bijv: Recras start = 17:00 \u2192 BBQ aansteken (75 min eerder) = 15:45 \u2192 Producten ophalen (45 min eerder dan BBQ) = 15:00. Bij "Verschilt per groepsgrootte" vul je een tabel in met ', /* @__PURE__ */ React.createElement("em", null, "tot x personen \u2192 y minuten"), "."), inst.tijden.map(function(t) {
    return /* @__PURE__ */ React.createElement("div", { key: t.id, style: { background: C.gray, borderRadius: 14, marginBottom: 6, padding: "8px 12px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        value: t.naam,
        style: { ...SS.inp, flex: 1, minWidth: 120, padding: "3px 8px", fontSize: 12 },
        onChange: function(e) {
          updateTijd(t.id, "naam", e.target.value);
        }
      }
    ), /* @__PURE__ */ React.createElement(
      "select",
      {
        value: t.kwalificatie || "Algemeen",
        style: { ...SS.inp, width: 90, padding: "2px 6px", fontSize: 11 },
        onChange: function(e) {
          updateTijd(t.id, "kwalificatie", e.target.value);
        }
      },
      /* @__PURE__ */ React.createElement("option", { value: "Algemeen" }, "Algemeen"),
      /* @__PURE__ */ React.createElement("option", { value: "BBQ" }, "BBQ"),
      /* @__PURE__ */ React.createElement("option", { value: "Oven" }, "Oven"),
      /* @__PURE__ */ React.createElement("option", { value: "Frituur" }, "Frituur")
    ), /* @__PURE__ */ React.createElement(
      "select",
      {
        value: t.basis || "vorige",
        style: { ...SS.inp, width: 110, padding: "2px 6px", fontSize: 11 },
        onChange: function(e) {
          updateTijd(t.id, "basis", e.target.value);
        }
      },
      /* @__PURE__ */ React.createElement("option", { value: "recras" }, "v.a. Recras tijd"),
      /* @__PURE__ */ React.createElement("option", { value: "vorige" }, "v.a. vorige stap")
    ), !t.perGroep && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 11, color: C.muted, whiteSpace: "nowrap" } }, "min:"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        value: t.minuten,
        style: { ...SS.inp, width: 60, padding: "3px 6px" },
        onChange: function(e) {
          updateTijd(t.id, "minuten", e.target.value);
        }
      }
    )), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 5, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        checked: !!t.perGroep,
        onChange: function(e) {
          updateTijd(t.id, "perGroep", e.target.checked);
        }
      }
    ), "Per groepsgrootte"), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, color: C.hot }, onClick: function() {
      verwijderTijd(t.id);
    } }, "\u2715")), t.perGroep && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, paddingLeft: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: C.muted, marginBottom: 4 } }, "Per groepsgrootte (min. voor vorige/Recras):"), (t.tredes || []).map(function(tr, ti) {
      return /* @__PURE__ */ React.createElement("div", { key: ti, style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: C.muted } }, "Tot"), /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "number",
          value: tr.tot,
          style: { ...SS.inp, width: 60, padding: "2px 6px", fontSize: 11 },
          onChange: function(e) {
            var nieuwTredes = (t.tredes || []).map(function(x, xi) {
              return xi === ti ? Object.assign({}, x, { tot: e.target.value }) : x;
            });
            updateTijd(t.id, "tredes", nieuwTredes);
          }
        }
      ), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: C.muted } }, "pers."), /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "number",
          value: tr.min,
          style: { ...SS.inp, width: 60, padding: "2px 6px", fontSize: 11 },
          onChange: function(e) {
            var nieuwTredes = (t.tredes || []).map(function(x, xi) {
              return xi === ti ? Object.assign({}, x, { min: e.target.value }) : x;
            });
            updateTijd(t.id, "tredes", nieuwTredes);
          }
        }
      ), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: C.muted } }, "min."), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSG, color: C.hot, fontSize: 10 }, onClick: function() {
        var nieuwTredes = (t.tredes || []).filter(function(_, xi) {
          return xi !== ti;
        });
        updateTijd(t.id, "tredes", nieuwTredes);
      } }, "\u2715"));
    }), /* @__PURE__ */ React.createElement("button", { style: { ...window._btnSA, fontSize: 10, marginTop: 4 }, onClick: function() {
      var nieuwTredes = (t.tredes || []).concat([{ tot: "", min: "" }]);
      updateTijd(t.id, "tredes", nieuwTredes);
    } }, "+ Groepsgrootte trede")));
  })));
}

  window._TijdenTab = TijdenTab;
})();


// ===== voorraad-checker-tab.js (9311 bytes) =====
// KitchenRobot module: voorraad-checker-tab.js
// Geextraheerd uit index.html op 2026-05-05T03:45:48.309Z
// Bevat: VoorraadCheckerTab
// Externe refs (via window._): (geen)
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function VoorraadCheckerTab() {
  var [voorraad, setVoorraad] = useState([]);
  var [laden, setLaden] = useState(false);
  var [zoek, setZoek] = useState("");
  var [nieuwNaam, setNieuwNaam] = useState("");
  var [nieuwAantal, setNieuwAantal] = useState("");
  var [nieuwEenheid, setNieuwEenheid] = useState("st");

  function laad() {
    if (!window._supa) return;
    setLaden(true);
    window._supa.from("voorraad_checker").select("*").order("naam").then(function(r) {
      setVoorraad(r.data || []);
      setLaden(false);
    });
  }
  useEffect(function() { laad(); }, []);

  function voegToe() {
    if (!nieuwNaam.trim() || !window._supa) return;
    window._supa.from("voorraad_checker").upsert(
      { naam: nieuwNaam.trim(), hoeveelheid: parseFloat(nieuwAantal)||0, eenheid: nieuwEenheid, bijgewerkt_op: new Date().toISOString() },
      { onConflict: "naam" }
    ).then(function(r) { if (!r.error) { setNieuwNaam(""); setNieuwAantal(""); laad(); } });
  }

  function updateVoorraad(naam, hoeveelheid) {
    if (!window._supa) return;
    window._supa.from("voorraad_checker").update({ hoeveelheid: parseFloat(hoeveelheid)||0, bijgewerkt_op: new Date().toISOString() }).eq("naam", naam).then(function() { laad(); });
  }

  // Bereken benodigd per product vanuit geladen boekingen + stamdata
  var benodigdMap = {};
  (window._recrasBoekingen||[]).forEach(function(b) {
    (b.regels||[]).forEach(function(r) {
      if ((r.menuNaam||"").toLowerCase().includes("add up")) return;
      var kp = (window._stamKoppelingen||[]).find(function(k){ return (k.recras_naam||"").trim()===(r.menuNaam||"").trim(); });
      var m = kp ? (window._stamMenus||[]).find(function(mm){ return mm.id===kp.menu_id; }) : null;
      if (!m) return;
      (m.menu_gerechten||[]).forEach(function(mg){
        var g = (window._stamGerechten||[]).find(function(x){ return x.id===mg.gerecht_id; });
        if (!g) return;
        var pEff = r.aantal*(mg.porties_per_persoon||1);
        (g.ingredienten||[]).forEach(function(ing){
          if (ing.zichtbaar==="nee"||ing.zichtbaar==="nooit") return;
          var sp = (window._stamSligro||[]).find(function(p){ return p.id===ing.sligro_id; });
          if (!sp) return;
          var gebruikt = pEff*(parseFloat(ing.gebruik_per_portie)||0);
          var vp = parseFloat(sp.hoeveelheid||sp.hoev||1)||1;
          if (!benodigdMap[sp.naam]) benodigdMap[sp.naam] = 0;
          benodigdMap[sp.naam] += Math.ceil(gebruikt/vp);
        });
      });
    });
  });

  var gefilterd = voorraad.filter(function(v){ return v.naam.toLowerCase().includes(zoek.toLowerCase()); });

  return React.createElement("div", null,
    React.createElement("div", {style:{background:"#EFF9FB",border:"1.5px solid #3FB8C4",borderRadius:9,padding:"10px 14px",fontSize:12,fontWeight:700,color:"#234756",marginBottom:14,display:"flex",gap:8}},
      "ℹ️  Voer hier je huidige voorraad in. Per product zie je hoeveel er nodig is voor de geladen boekingen. De WhatsApp-assistent kan dit lezen om bestelvoorstellen te doen."
    ),
    // Nieuw product invoeren
    React.createElement("div", {style:{background:"#fff",borderRadius:12,padding:18,border:"1.5px solid #D8E8EF",marginBottom:14}},
      React.createElement("div",{style:{fontWeight:900,fontSize:14,color:"#234756",marginBottom:12}},"Voorraad bijwerken"),
      React.createElement("div",{style:{display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}},
        React.createElement("div",{style:{flex:2,minWidth:150}},
          React.createElement("label",{style:{fontWeight:700,fontSize:11,color:"#234756",marginBottom:4,display:"block"}},"Product"),
          React.createElement("input",{style:{border:"1.5px solid #D8E8EF",borderRadius:8,padding:"9px 12px",fontFamily:"inherit",fontSize:12,color:"#234756",width:"100%",outline:"none",boxSizing:"border-box"},
            placeholder:"Naam (bijv. Kipsaté 200g)",value:nieuwNaam,onChange:function(e){setNieuwNaam(e.target.value);}})
        ),
        React.createElement("div",{style:{flex:1,minWidth:80}},
          React.createElement("label",{style:{fontWeight:700,fontSize:11,color:"#234756",marginBottom:4,display:"block"}},"Hoeveelheid"),
          React.createElement("input",{style:{border:"1.5px solid #D8E8EF",borderRadius:8,padding:"9px 12px",fontFamily:"inherit",fontSize:12,color:"#234756",width:"100%",outline:"none",boxSizing:"border-box"},
            type:"number",placeholder:"0",value:nieuwAantal,onChange:function(e){setNieuwAantal(e.target.value);}})
        ),
        React.createElement("div",{style:{flex:1,minWidth:80}},
          React.createElement("label",{style:{fontWeight:700,fontSize:11,color:"#234756",marginBottom:4,display:"block"}},"Eenheid"),
          React.createElement("select",{style:{border:"1.5px solid #D8E8EF",borderRadius:8,padding:"9px 12px",fontFamily:"inherit",fontSize:12,color:"#234756",width:"100%",outline:"none",boxSizing:"border-box"},
            value:nieuwEenheid,onChange:function(e){setNieuwEenheid(e.target.value);}},
            ["st","kg","g","l","ml","zak","doos","rol","pak"].map(function(u){ return React.createElement("option",{key:u,value:u},u); })
          )
        ),
        React.createElement("button",{style:{background:"#E8202B",color:"#fff",border:"none",borderRadius:8,padding:"9px 18px",fontFamily:"inherit",fontWeight:700,fontSize:12,cursor:"pointer"},
          onClick:voegToe},"+ Opslaan")
      )
    ),
    React.createElement("input",{style:{border:"1.5px solid #D8E8EF",borderRadius:8,padding:"9px 12px",fontFamily:"inherit",fontSize:12,color:"#234756",width:"100%",outline:"none",boxSizing:"border-box",marginBottom:12},
      placeholder:"Zoek product...",value:zoek,onChange:function(e){setZoek(e.target.value);}}),
    laden ? React.createElement("div",{style:{textAlign:"center",padding:20,color:"#6B8A9A"}},"Laden...") :
    React.createElement("div",{style:{overflowX:"auto"}},
      React.createElement("table",{className:"kr-table",style:{width:"100%",borderCollapse:"collapse",fontSize:12}},
        React.createElement("thead",null,
          React.createElement("tr",null,
            ["Product","Op voorraad","Eenheid","Bijgewerkt","Benodigd","Status"].map(function(h){
              return React.createElement("th",{key:h,style:{background:"#234756",color:"#F1F7F9",padding:"10px 12px",textAlign:"left",fontWeight:700,fontSize:10,letterSpacing:1.5,textTransform:"uppercase"}},h);
            })
          )
        ),
        React.createElement("tbody",null,
          gefilterd.length===0 && React.createElement("tr",null,
            React.createElement("td",{colSpan:6,style:{padding:"20px",textAlign:"center",color:"#6B8A9A",fontStyle:"italic"}},
              "Nog geen voorraad. Voeg producten toe hierboven."
            )
          ),
          gefilterd.map(function(item,i){
            var benodigd = benodigdMap[item.naam]||0;
            var hv = parseFloat(item.hoeveelheid)||0;
            var status = benodigd===0?"ok":hv>=benodigd*1.5?"ok":hv>=benodigd?"laag":"kritiek";
            var skl = {ok:"#10B981",laag:"#F59E0B",kritiek:"#E8202B"}[status];
            var slabel = {ok:"✓ Voldoende",laag:"⚠ Krap",kritiek:"⛔ Te weinig"}[status];
            return React.createElement("tr",{key:i,style:{background:status==="kritiek"?"#FFF0F0":status==="laag"?"#FFFBEB":i%2===0?"#fff":"#F8FAFC"}},
              React.createElement("td",{style:{padding:"10px 12px",fontWeight:700,color:"#234756"}},item.naam),
              React.createElement("td",{style:{padding:"10px 12px"}},
                React.createElement("input",{
                  type:"number",
                  style:{border:"1.5px solid #D8E8EF",borderRadius:100,padding:"4px 8px",width:70,fontFamily:"inherit",fontSize:12,background:status==="kritiek"?"#FFF0F0":"#fff"},
                  defaultValue:item.hoeveelheid,
                  onBlur:function(e){ updateVoorraad(item.naam, e.target.value); }
                })
              ),
              React.createElement("td",{style:{padding:"10px 12px",color:"#6B8A9A"}},item.eenheid||""),
              React.createElement("td",{style:{padding:"10px 12px",fontSize:10,color:"#6B8A9A"}},
                item.bijgewerkt_op?new Date(item.bijgewerkt_op).toLocaleDateString("nl-NL",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}):"—"
              ),
              React.createElement("td",{style:{padding:"10px 12px",fontWeight:700,color:benodigd>0?"#234756":"#6B8A9A"}},
                benodigd>0?benodigd+"×":"—"
              ),
              React.createElement("td",{style:{padding:"10px 12px"}},
                React.createElement("span",{style:{background:skl+"18",color:skl,border:"1px solid "+skl+"44",borderRadius:5,padding:"3px 9px",fontSize:10,fontWeight:700}},slabel)
              )
            );
          })
        )
      )
    )
  );
}

  window._VoorraadCheckerTab = VoorraadCheckerTab;
})();

