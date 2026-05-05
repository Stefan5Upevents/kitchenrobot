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
