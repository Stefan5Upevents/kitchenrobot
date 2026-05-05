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
