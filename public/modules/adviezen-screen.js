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
