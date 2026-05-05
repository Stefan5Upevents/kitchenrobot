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
