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
