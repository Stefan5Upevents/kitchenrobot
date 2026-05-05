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
