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
