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
