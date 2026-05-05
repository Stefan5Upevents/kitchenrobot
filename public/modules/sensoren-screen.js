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
