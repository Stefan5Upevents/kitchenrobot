// KitchenRobot module: fin-instellingen-screen.js
// Geextraheerd uit index.html op 2026-05-05T10:24:17.356Z (v9 AST-walk)
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
  var SS = window._SS || { pT:{fontSize:22,fontWeight:900,color:'#234756',marginBottom:4}, pD:{fontSize:12,color:'#78909C',marginBottom:16} };
  var [kickback, setKickback] = React.useState(6.25);
  var [richtmarges, setRichtmarges] = React.useState([]);
  var [laden, setLaden] = React.useState(true);
  var [bezig, setBezig] = React.useState(false);
  var [bericht, setBericht] = React.useState(null);
  var [nieuweSoort, setNieuweSoort] = React.useState('');
  var [nieuweMarge, setNieuweMarge] = React.useState(60);

  function laad() {
    setLaden(true);
    Promise.all([
      window._supa.from('fin_instellingen').select('kickback_pct').eq('id', 1).single(),
      window._supa.from('fin_richtmarge').select('*').order('productsoort_naam')
    ]).then(function(res) {
      if (res[0].data) setKickback(parseFloat(res[0].data.kickback_pct || 6.25));
      setRichtmarges(res[1].data || []);
      setLaden(false);
    });
  }
  React.useEffect(laad, []);

  function slaKickbackOp() {
    setBezig(true);
    window._supa.from('fin_instellingen').update({
      kickback_pct: kickback, bijgewerkt_op: new Date().toISOString()
    }).eq('id', 1).then(function(res) {
      setBezig(false);
      if (res.error) setBericht({ ok:false, tekst: 'Fout: ' + res.error.message });
      else setBericht({ ok:true, tekst: 'Kickback opgeslagen: ' + kickback + '%' });
      setTimeout(function(){ setBericht(null); }, 3000);
    });
  }
  function updateMarge(ps, nieuwePct) {
    var pct = parseFloat(nieuwePct);
    if (isNaN(pct) || pct < 0 || pct > 100) { alert('Marge moet tussen 0 en 100 zijn'); return; }
    setBezig(true);
    window._supa.from('fin_richtmarge').update({
      bruto_marge_pct: pct, bijgewerkt_op: new Date().toISOString()
    }).eq('productsoort_naam', ps).then(function(res) {
      setBezig(false);
      if (res.error) setBericht({ ok:false, tekst: 'Fout: ' + res.error.message });
      else { setBericht({ ok:true, tekst: ps + ' → ' + pct + '%' }); laad(); }
      setTimeout(function(){ setBericht(null); }, 2000);
    });
  }
  function updateOpmerking(ps, tekst) {
    window._supa.from('fin_richtmarge').update({ opmerking: tekst, bijgewerkt_op: new Date().toISOString() }).eq('productsoort_naam', ps).then(function(){});
  }
  function voegToe() {
    if (!nieuweSoort.trim()) { alert('Naam vereist'); return; }
    setBezig(true);
    window._supa.from('fin_richtmarge').insert({
      productsoort_naam: nieuweSoort.trim(),
      bruto_marge_pct: parseFloat(nieuweMarge),
      opmerking: 'Handmatig toegevoegd'
    }).then(function(res) {
      setBezig(false);
      if (res.error) setBericht({ ok:false, tekst: 'Fout: ' + res.error.message });
      else { setBericht({ ok:true, tekst: 'Toegevoegd: ' + nieuweSoort }); setNieuweSoort(''); setNieuweMarge(60); laad(); }
      setTimeout(function(){ setBericht(null); }, 3000);
    });
  }
  function verwijder(ps) {
    if (!confirm('Zeker weten? "' + ps + '" verwijderen?')) return;
    window._supa.from('fin_richtmarge').delete().eq('productsoort_naam', ps).then(function(res) {
      if (res.error) setBericht({ ok:false, tekst: 'Fout: ' + res.error.message });
      else { setBericht({ ok:true, tekst: 'Verwijderd: ' + ps }); laad(); }
      setTimeout(function(){ setBericht(null); }, 2000);
    });
  }

  if (laden) return React.createElement('div', { style:{padding:40,textAlign:'center',color:C.muted} }, '⏳ Instellingen laden...');

  return React.createElement('div', null,
    React.createElement('div', { style: SS.pT }, '💸 Financieel instellingen'),
    React.createElement('div', { style: SS.pD }, 'Kickback-percentage en theoretische marges per productsoort. Deze beïnvloeden de marge-berekening op het Financieel dashboard.'),
    
    bericht && React.createElement('div', { style:{background: bericht.ok ? '#E8F5E9' : '#FFEBEE', color: bericht.ok ? C.green : C.hot, padding:'10px 14px', borderRadius:8, marginBottom:12, fontSize:13, fontWeight:700} }, bericht.tekst),

    // Kickback blok
    React.createElement('div', { style:{background:C.white,borderRadius:10,padding:'18px 22px',marginBottom:20} },
      React.createElement('div', { style:{fontSize:11,color:C.night,fontWeight:800,letterSpacing:1,textTransform:'uppercase',marginBottom:10} }, '💰 Kickback (retour van Sligro op inkoop)'),
      React.createElement('div', { style:{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'} },
        React.createElement('label', { style:{fontSize:13,color:C.night,fontWeight:700} }, 'Kickback percentage:'),
        React.createElement('input', {
          type:'number', step:'0.01', min:'0', max:'100',
          value: kickback,
          onChange: function(e){ setKickback(parseFloat(e.target.value) || 0); },
          style:{width:90,padding:'8px 12px',border:'1px solid #D8E8EF',borderRadius:8,fontSize:14,fontFamily:'inherit',textAlign:'right'}
        }),
        React.createElement('span', { style:{fontSize:14,color:C.muted,fontWeight:700} }, '% van inkoopprijs'),
        React.createElement('button', {
          onClick: slaKickbackOp, disabled: bezig,
          style:{background:C.green,color:'#fff',border:'none',borderRadius:8,padding:'8px 18px',fontSize:13,fontWeight:800,cursor:'pointer',fontFamily:'inherit',marginLeft:'auto',opacity:bezig?.5:1}
        }, 'Opslaan')
      ),
      React.createElement('div', { style:{fontSize:11,color:C.muted,marginTop:8,fontStyle:'italic'} },
        'Voorbeeld: bij ' + kickback + '% en €100.000 inkoopkosten retour = €' + Math.round(100000 * kickback / 100).toLocaleString('nl-NL') + '/jaar kickback'
      )
    ),

    // Richtmarges per productsoort
    React.createElement('div', { style:{background:C.white,borderRadius:10,padding:'18px 22px'} },
      React.createElement('div', { style:{fontSize:11,color:C.night,fontWeight:800,letterSpacing:1,textTransform:'uppercase',marginBottom:4} }, '🎯 Richtmarges per productsoort'),
      React.createElement('div', { style:{fontSize:11,color:C.muted,marginBottom:14,fontStyle:'italic'} }, 'Typische bruto-marge % die voor deze productsoort wordt gebruikt totdat de echte kostprijs-berekening klopt.'),

      React.createElement('div', { style:{overflowX:'auto'} },
        React.createElement('table', { className:'kr-table', style:{width:'100%',borderCollapse:'collapse',fontSize:13} },
          React.createElement('thead', null,
            React.createElement('tr', { style:{borderBottom:'2px solid #E8EEF2',textAlign:'left'} },
              React.createElement('th', { style:{padding:'8px 4px',color:C.muted,fontSize:10,fontWeight:700,letterSpacing:.5,textTransform:'uppercase'} }, 'Productsoort'),
              React.createElement('th', { style:{padding:'8px 4px',color:C.muted,fontSize:10,fontWeight:700,letterSpacing:.5,textTransform:'uppercase',textAlign:'right'} }, 'Bruto marge %'),
              React.createElement('th', { style:{padding:'8px 4px',color:C.muted,fontSize:10,fontWeight:700,letterSpacing:.5,textTransform:'uppercase'} }, 'Opmerking'),
              React.createElement('th', { style:{padding:'8px 4px'} })
            )
          ),
          React.createElement('tbody', null,
            richtmarges.map(function(r) {
              return React.createElement('tr', { key: r.productsoort_naam, style:{borderBottom:'1px solid #F0F4F7'} },
                React.createElement('td', { style:{padding:'10px 4px',color:C.night,fontWeight:700} }, r.productsoort_naam),
                React.createElement('td', { style:{padding:'10px 4px',textAlign:'right'} },
                  React.createElement('input', {
                    type:'number', step:'0.5', min:'0', max:'100',
                    defaultValue: r.bruto_marge_pct,
                    onBlur: function(e) { 
                      var v = parseFloat(e.target.value);
                      if (v !== parseFloat(r.bruto_marge_pct) && !isNaN(v)) updateMarge(r.productsoort_naam, v); 
                    },
                    style:{width:70,padding:'6px 8px',border:'1px solid #D8E8EF',borderRadius:6,fontSize:13,fontFamily:'inherit',textAlign:'right'}
                  }),
                  React.createElement('span', { style:{color:C.muted,marginLeft:4} }, '%')
                ),
                React.createElement('td', { style:{padding:'10px 4px'} },
                  React.createElement('input', {
                    type:'text',
                    defaultValue: r.opmerking || '',
                    onBlur: function(e) { if (e.target.value !== (r.opmerking || '')) updateOpmerking(r.productsoort_naam, e.target.value); },
                    placeholder: 'optioneel — waarom dit %',
                    style:{width:'100%',padding:'6px 8px',border:'1px solid #D8E8EF',borderRadius:6,fontSize:12,fontFamily:'inherit'}
                  })
                ),
                React.createElement('td', { style:{padding:'10px 4px',textAlign:'right'} },
                  React.createElement('button', {
                    onClick: function(){ verwijder(r.productsoort_naam); },
                    style:{background:'transparent',color:C.hot,border:'1px solid transparent',borderRadius:6,padding:'4px 8px',fontSize:11,cursor:'pointer',fontFamily:'inherit'},
                    title: 'Verwijderen'
                  }, '🗑')
                )
              );
            })
          )
        )
      ),

      // Nieuwe toevoegen
      React.createElement('div', { style:{marginTop:16,padding:'12px 14px',background:'#F8FAFC',borderRadius:8,display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'} },
        React.createElement('span', { style:{fontSize:11,color:C.muted,fontWeight:700,letterSpacing:.5,textTransform:'uppercase',marginRight:6} }, '+ Nieuwe'),
        React.createElement('input', {
          type:'text', value: nieuweSoort,
          onChange: function(e){ setNieuweSoort(e.target.value); },
          placeholder: 'productsoort naam',
          style:{padding:'7px 10px',border:'1px solid #D8E8EF',borderRadius:6,fontSize:13,fontFamily:'inherit',flex:1,minWidth:160}
        }),
        React.createElement('input', {
          type:'number', step:'0.5', min:'0', max:'100',
          value: nieuweMarge,
          onChange: function(e){ setNieuweMarge(e.target.value); },
          style:{width:80,padding:'7px 10px',border:'1px solid #D8E8EF',borderRadius:6,fontSize:13,fontFamily:'inherit',textAlign:'right'}
        }),
        React.createElement('span', { style:{color:C.muted,fontSize:13,fontWeight:700} }, '%'),
        React.createElement('button', {
          onClick: voegToe, disabled: bezig,
          style:{background:C.aqua,color:'#fff',border:'none',borderRadius:6,padding:'8px 16px',fontSize:12,fontWeight:800,cursor:'pointer',fontFamily:'inherit',opacity:bezig?.5:1}
        }, '+ Toevoegen')
      )
    )
  );
}

  window._FinInstellingenScreen = FinInstellingenScreen;
})();
