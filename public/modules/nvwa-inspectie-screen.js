// KitchenRobot module: nvwa-inspectie-screen.js
// Geextraheerd uit index.html op 2026-05-05T12:48:38.032Z (self-exposed dedicated-script, soort: iife)
// Bevat: NVWAInspectieScreen
(function(){
  if (typeof window === 'undefined' || !window.React) return;
  var R = window.React.createElement;
  var useState = window.React.useState;
  var useEffect = window.React.useEffect;
  var useMemo = window.React.useMemo;
  if (typeof document !== 'undefined' && !document.getElementById('nvwa-print-css')) {
    var st = document.createElement('style');
    st.id = 'nvwa-print-css';
    st.textContent = '@media print { .nvwa-noprint{display:none !important} body{background:white !important} @page{margin:18mm 15mm;size:A4 portrait} .nvwa-page{box-shadow:none !important;padding:0 !important;max-width:none !important} table{page-break-inside:auto} tr{page-break-inside:avoid} h2{page-break-after:avoid} }';
    document.head.appendChild(st);
  }
  function fmt(n, d){ d=(d==null?1:d); if(n==null||isNaN(+n))return '-'; return (+n).toFixed(d); }
  function fmtMin(m){ if(m==null||m<=0)return '-'; if(m<60)return Math.round(m)+' min'; return Math.floor(m/60)+'u '+Math.round(m%60)+'m'; }
  function badge(p){
    var s={display:'inline-block',padding:'2px 9px',fontSize:10.5,fontWeight:600,borderRadius:10,textTransform:'uppercase',letterSpacing:'.04em'};
    if(p==null) return R('span',{style:Object.assign({},s,{background:'#eee',color:'#666'})},'geen data');
    if(p>=98) return R('span',{style:Object.assign({},s,{background:'#E8F5E9',color:'#2E7D32'})},'binnen norm');
    if(p>=85) return R('span',{style:Object.assign({},s,{background:'#FFF3E0',color:'#E65100'})},'lichte afw.');
    return R('span',{style:Object.assign({},s,{background:'#FFEBEE',color:'#C62828'})},'signif. afw.');
  }
  var TH={textAlign:'left',padding:'9px 11px',fontSize:11,fontWeight:600,color:'#6E8591',textTransform:'uppercase',letterSpacing:'.05em',borderBottom:'2px solid #002D41',background:'#F5F8FA'};
  var THR=Object.assign({},TH,{textAlign:'right'});
  var TD={padding:'9px 11px',borderBottom:'1px solid #D8E8EF',fontSize:12.5};
  var TDR=Object.assign({},TD,{textAlign:'right',fontFamily:'monospace'});
  var LBL={display:'inline-block',minWidth:120,fontSize:11,color:'#6E8591',textTransform:'uppercase',letterSpacing:'.04em',marginRight:10,fontWeight:700};
  var FLD={display:'flex',flexDirection:'column',gap:4,fontSize:11,fontWeight:600,color:'#6E8591',textTransform:'uppercase',letterSpacing:'.05em'};
  var INP={padding:'7px 10px',border:'1px solid #AEC5D1',borderRadius:4,fontSize:13,fontFamily:'inherit'};
  window._NVWAInspectieScreen = function NVWAInspectieScreen(){
    var today = new Date().toISOString().slice(0,10);
    var thirtyAgo = new Date(Date.now()-30*86400000).toISOString().slice(0,10);
    var vs=useState(thirtyAgo); var van=vs[0]; var setVan=vs[1];
    var ts=useState(today); var tot=ts[0]; var setTot=ts[1];
    var ds=useState(30); var drempel=ds[0]; var setDrempel=ds[1];
    var oS=useState((window.kr&&window.kr.outlet&&window.kr.outlet.get&&window.kr.outlet.get()!=='alle')?window.kr.outlet.get():'weesp'); var outlet=oS[0]; var setOutlet=oS[1];
    var dS=useState([]); var dagen=dS[0]; var setDagen=dS[1];
    var eS=useState([]); var episodes=eS[0]; var setEpisodes=eS[1];
    var vS=useState([]); var verif=vS[0]; var setVerif=vS[1];
    var iS=useState({}); var inst=iS[0]; var setInst=iS[1];
    var lS=useState(true); var laadt=lS[0]; var setLaadt=lS[1];
    var fS=useState(null); var fout=fS[0]; var setFout=fS[1];
    var caS=useState([]); var corrActies=caS[0]; var setCorrActies=caS[1];
    var cfS=useState({omschrijving:'',datum:new Date().toISOString().slice(0,10),uitgevoerd_door:''}); var corrForm=cfS[0]; var setCorrForm=cfS[1];
    var snS=useState([]); var sensoren=snS[0]; var setSensoren=snS[1];
    var nvS=useState({sensor_id:'',steek_temp:'',sensor_temp:'',gemeten_door:'',opmerking:''}); var nieuweVerif=nvS[0]; var setNieuweVerif=nvS[1];
    var verifBezigS=useState(false); var verifBezig=verifBezigS[0]; var setVerifBezig=verifBezigS[1];
    var rapBezigS=useState(false); var rapBezig=rapBezigS[0]; var setRapBezig=rapBezigS[1];
    useEffect(function(){
      if(!window._supa||!outlet) return;
      window._supa.from('kiosk_sensoren').select('id,naam,min_norm,max_norm').eq('outlet_code',outlet).eq('actief',true).order('naam')
        .then(function(r){ if(!r.error) setSensoren(r.data||[]); });
      setCorrActies([]);
    },[outlet]);
    useEffect(function(){
      if(!window._supa||!van||!tot||!outlet) return;
      setLaadt(true); setFout(null);
      var sb=window._supa;
      var einde=tot+'T23:59:59';
      Promise.all([
        sb.from('v_haccp_inspectie_dag').select('*').eq('outlet_code',outlet).gte('datum',van).lte('datum',tot).order('datum'),
        sb.from('v_haccp_afwijkings_episodes').select('*').eq('outlet_code',outlet).eq('significant',true).gte('start_tijd',van).lte('start_tijd',einde).gte('duur_minuten',drempel).order('start_tijd'),
        sb.from('haccp_verificatie_metingen').select('*, kiosk_sensoren(naam)').eq('outlet_code',outlet).gte('gemeten_op',van).lte('gemeten_op',einde).order('gemeten_op',{ascending:false}),
        sb.from('haccp_instellingen').select('*').eq('outlet_code',outlet).maybeSingle()
      ]).then(function(rs){
        var err=rs[0].error||rs[1].error||rs[2].error||rs[3].error;
        if(err){setFout(err.message);}
        else{setDagen(rs[0].data||[]);setEpisodes(rs[1].data||[]);setVerif(rs[2].data||[]);setInst(rs[3].data||{});}
        setLaadt(false);
      }).catch(function(e){setFout(String(e));setLaadt(false);});
    },[van,tot,drempel,outlet]);
    var overzicht = useMemo(function(){
      var m={};
      dagen.forEach(function(d){
        if(!m[d.sensor_id]) m[d.sensor_id]={id:d.sensor_id,naam:d.sensor_naam,cat:d.categorie,minN:d.min_norm,maxN:d.max_norm,mt:0,buiten:0,sumT:0,tmin:Infinity,tmax:-Infinity,minB:0};
        var s=m[d.sensor_id];
        s.mt += d.aantal_metingen||0;
        s.buiten += d.aantal_metingen_buiten_norm||0;
        s.sumT += (+d.gem_temp||0)*(d.aantal_metingen||0);
        if(d.min_temp!=null) s.tmin = Math.min(s.tmin, +d.min_temp);
        if(d.max_temp!=null) s.tmax = Math.max(s.tmax, +d.max_temp);
        s.minB += +d.minuten_buiten_norm||0;
      });
      return Object.values(m).map(function(s){
        return {id:s.id,naam:s.naam,cat:s.cat,minN:s.minN,maxN:s.maxN,mt:s.mt,
          gem:s.mt>0?s.sumT/s.mt:null,
          tmin:s.tmin===Infinity?null:s.tmin,
          tmax:s.tmax===-Infinity?null:s.tmax,
          minB:s.minB,
          pct:s.mt>0?100*(s.mt-s.buiten)/s.mt:null};
      }).sort(function(a,b){return (a.pct==null?100:a.pct)-(b.pct==null?100:b.pct);});
    },[dagen]);
    return R('div',{style:{padding:20,background:'#EAF0F4',minHeight:'100vh',fontFamily:'system-ui,-apple-system,sans-serif',color:'#234756'}},
      R('div',{className:'nvwa-noprint',style:{background:'white',padding:16,borderRadius:6,marginBottom:20,display:'flex',gap:14,alignItems:'flex-end',flexWrap:'wrap'}},
        R('label',{style:FLD},'Van',R('input',{type:'date',value:van,onChange:function(e){setVan(e.target.value);},style:INP})),
        R('label',{style:FLD},'Tot',R('input',{type:'date',value:tot,onChange:function(e){setTot(e.target.value);},style:INP})),
        R('label',{style:FLD},'Min. duur afw.',R('select',{value:drempel,onChange:function(e){setDrempel(+e.target.value);},style:INP},
          R('option',{value:15},'15 min'),R('option',{value:30},'30 min'),R('option',{value:60},'1 uur'))),
        R('label',{style:FLD},'Vestiging',R('select',{value:outlet,onChange:function(e){setOutlet(e.target.value);},style:INP},
          R('option',{value:'west'},'Amsterdam West'),R('option',{value:'weesp'},'Weesp'))),
        R('button',{disabled:rapBezig,onClick:function(){
          if(!window._supa) return;
          setRapBezig(true);
          var totaalMet = overzicht.reduce(function(a,s){return a+(s.mt||0);},0);
          var rapportPayload = {
            outlet_code: outlet,
            periode_van: van,
            periode_tot: tot,
            gegenereerd_door: (window.kr&&window.kr.outlet&&document.getElementById('admin-versie-tag'))?document.getElementById('admin-versie-tag').textContent.trim():null,
            totaal_metingen: totaalMet,
            afwijkingen: episodes.length,
            correctieve_acties: corrActies,
            rapport_json: {
              overzicht: overzicht,
              episodes: episodes,
              verif: verif,
              inst: inst,
              drempel: drempel,
              gegenereerd_op: new Date().toISOString()
            }
          };
          window._supa.from('haccp_inspecties').insert(rapportPayload).select().maybeSingle()
            .then(function(r){
              setRapBezig(false);
              if(r.error){
                if(window.kr&&window.kr.toast) window.kr.toast('Fout bij opslaan: '+r.error.message,'error');
              } else {
                if(window.kr&&window.kr.toast) window.kr.toast('Rapport opgeslagen ('+totaalMet+' metingen, '+episodes.length+' afwijkingen)','success',5000);
                setCorrActies([]);
              }
            });
        },style:{marginLeft:'auto',padding:'9px 18px',background:rapBezig?'#6E8591':'#2E7D32',color:'white',border:'none',borderRadius:4,cursor:rapBezig?'wait':'pointer',fontSize:13,fontWeight:600}}, rapBezig?'Bezig...':'\u{1F4BE} Rapport opslaan'),
        R('button',{onClick:function(){window.print();},style:{padding:'9px 18px',background:'#002D41',color:'white',border:'none',borderRadius:4,cursor:'pointer',fontSize:13,fontWeight:600}},'Printen / PDF')
      ),
      fout && R('div',{style:{padding:16,background:'#FFEBEE',color:'#C62828',borderRadius:4,marginBottom:16}},'Fout: '+fout),
      laadt && R('div',{style:{padding:40,textAlign:'center',color:'#6E8591'}},'Laden...'),
      !laadt && !fout && R('div',{className:'nvwa-page',style:{background:'white',padding:'40px 48px',borderRadius:6,maxWidth:1180,margin:'0 auto'}},
        R('div',{style:{borderBottom:'3px solid #002D41',paddingBottom:18,marginBottom:28}},
          R('div',{style:{display:'flex',justifyContent:'space-between',marginBottom:10}},
            R('div',{style:{fontSize:19,fontWeight:700,color:'#002D41'}},'KitchenRobot'),
            R('div',{style:{fontSize:11,color:'#6E8591',textTransform:'uppercase',letterSpacing:'.06em'}},'HACCP Registratie - Voedselveiligheidsplan')
          ),
          R('h1',{style:{fontSize:26,fontWeight:600,color:'#002D41',margin:'6px 0 4px 0'}},'NVWA Inspectierapport - Temperatuurregistratie'),
          R('div',{style:{fontSize:12,color:'#6E8591',fontStyle:'italic'}},'Conform Hygienecode voor de Horeca (KHN) en Verordening (EG) 852/2004'),
          R('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px 40px',marginTop:18,fontSize:13}},
            R('div',null, R('span',{style:LBL},'Bedrijfsnaam'), inst.bedrijfsnaam || '(leeg - vul in bij HACCP Bedrijfsgegevens)'),
            R('div',null, R('span',{style:LBL},'Vestiging'), outlet==='west'?'Amsterdam West':'Weesp'),
            R('div',null, R('span',{style:LBL},'Adres'), [inst.adres,inst.postcode,inst.plaats].filter(Boolean).join(' - ')||'-'),
            R('div',null, R('span',{style:LBL},'Periode'), van+' t/m '+tot),
            R('div',null, R('span',{style:LBL},'KvK'), inst.kvk_nummer||'-'),
            R('div',null, R('span',{style:LBL},'BTW'), inst.btw_nummer||'-'),
            R('div',null, R('span',{style:LBL},'Telefoon'), inst.telefoon||'-'),
            R('div',null, R('span',{style:LBL},'E-mail'), inst.email||'-'),
            R('div',null, R('span',{style:LBL},'Verantwoordelijke'), [inst.verantwoordelijke_naam,inst.verantwoordelijke_functie].filter(Boolean).join(' - ')||'-'),
            R('div',null, R('span',{style:LBL},'Vervanger'), [inst.vervanger_naam,inst.vervanger_functie].filter(Boolean).join(' - ')||'-')
          )
        ),
        R('section',{style:{marginTop:36}},
          R('h2',{style:{fontSize:18,fontWeight:600,color:'#002D41',margin:'0 0 10px 0'}},'1. Overzicht per koeling'),
          R('table',{style:{width:'100%',borderCollapse:'collapse'}},
            R('thead',null,R('tr',null,
              R('th',{style:TH},'Koeling'),R('th',{style:TH},'Cat.'),R('th',{style:TH},'Norm C'),
              R('th',{style:THR},'Metingen'),R('th',{style:THR},'Gem.'),R('th',{style:THR},'Min.'),R('th',{style:THR},'Max.'),
              R('th',{style:THR},'Tijd buiten'),R('th',{style:THR},'% binnen'),R('th',{style:TH},'Status')
            )),
            R('tbody',null, overzicht.map(function(s,i){
              return R('tr',{key:i},
                R('td',{style:Object.assign({},TD,{fontWeight:600,color:'#002D41'})},s.naam),
                R('td',{style:TD},R('span',{style:{padding:'1px 7px',background:'#0277BD',color:'white',fontSize:9.5,borderRadius:3,letterSpacing:'.05em',textTransform:'uppercase'}},s.cat||'-')),
                R('td',{style:Object.assign({},TD,{fontFamily:'monospace'})}, (s.minN==null?'-':s.minN)+' / '+(s.maxN==null?'-':s.maxN)),
                R('td',{style:TDR}, s.mt),
                R('td',{style:TDR}, fmt(s.gem,2)),
                R('td',{style:TDR}, fmt(s.tmin,1)),
                R('td',{style:TDR}, fmt(s.tmax,1)),
                R('td',{style:TDR}, fmtMin(s.minB)),
                R('td',{style:Object.assign({},TDR,{fontWeight:600})}, fmt(s.pct,1)+'%'),
                R('td',{style:TD}, badge(s.pct))
              );
            }))
          )
        ),
        R('section',{style:{marginTop:36}},
          R('h2',{style:{fontSize:18,fontWeight:600,color:'#002D41',margin:'0 0 10px 0'}},'2. Detailoverzicht per dag'),
          R('table',{style:{width:'100%',borderCollapse:'collapse',fontSize:12}},
            R('thead',null,R('tr',null,
              R('th',{style:TH},'Datum'),R('th',{style:TH},'Koeling'),
              R('th',{style:THR},'Metingen'),R('th',{style:THR},'Gem.'),R('th',{style:THR},'Min.'),R('th',{style:THR},'Max.'),
              R('th',{style:THR},'Buiten'),R('th',{style:THR},'Signif.'),R('th',{style:THR},'Tijd buiten')
            )),
            R('tbody',null, dagen.map(function(d,i){
              var rowStyle = d.aantal_significante_afwijkingen>0?{background:'#FFF8E1'}:{};
              return R('tr',{key:i,style:rowStyle},
                R('td',{style:Object.assign({},TD,{fontFamily:'monospace'})}, d.datum),
                R('td',{style:TD}, d.sensor_naam),
                R('td',{style:TDR}, d.aantal_metingen),
                R('td',{style:TDR}, fmt(d.gem_temp,2)),
                R('td',{style:TDR}, fmt(d.min_temp,1)),
                R('td',{style:TDR}, fmt(d.max_temp,1)),
                R('td',{style:TDR}, d.aantal_metingen_buiten_norm),
                R('td',{style:Object.assign({},TDR,{color:d.aantal_significante_afwijkingen>0?'#C62828':'inherit',fontWeight:d.aantal_significante_afwijkingen>0?600:400})}, d.aantal_significante_afwijkingen||0),
                R('td',{style:TDR}, fmtMin(d.minuten_buiten_norm))
              );
            }))
          )
        ),
        R('section',{style:{marginTop:36}},
          R('h2',{style:{fontSize:18,fontWeight:600,color:'#002D41',margin:'0 0 4px 0'}},'3. Significante afwijkingen ('+drempel+' min of langer)'),
          R('div',{style:{fontSize:12,color:'#6E8591',marginBottom:12}},'Per afwijking kunt u onder de tabel correctieve acties registreren. Deze worden meegenomen bij \'Opslaan als rapport\'.'),
          episodes.length===0
            ? R('div',{style:{padding:20,background:'#E8F5E9',borderRadius:4,color:'#2E7D32'}},'Geen significante afwijkingen van '+drempel+' min of langer in deze periode.')
            : R('table',{style:{width:'100%',borderCollapse:'collapse',fontSize:12}},
                R('thead',null,R('tr',null,
                  R('th',{style:TH},'Start'),R('th',{style:TH},'Einde'),R('th',{style:TH},'Koeling'),
                  R('th',{style:THR},'Duur'),R('th',{style:THR},'Gem.'),R('th',{style:THR},'Max afw.')
                )),
                R('tbody',null, episodes.map(function(e,i){
                  return R('tr',{key:i},
                    R('td',{style:Object.assign({},TD,{fontFamily:'monospace',fontSize:11})}, new Date(e.start_tijd).toLocaleString('nl-NL')),
                    R('td',{style:Object.assign({},TD,{fontFamily:'monospace',fontSize:11})}, new Date(e.eind_tijd).toLocaleString('nl-NL')),
                    R('td',{style:Object.assign({},TD,{fontWeight:600})}, e.sensor_naam),
                    R('td',{style:TDR}, fmtMin(e.duur_minuten)),
                    R('td',{style:TDR}, fmt(e.gem_temp,1)+'C'),
                    R('td',{style:Object.assign({},TDR,{color:'#C62828',fontWeight:600})}, fmt(e.max_temp,1)+'C')
                  );
                }))
              ),
          R('div',{className:'nvwa-noprint',style:{marginTop:18,padding:16,background:'#F5F8FA',borderRadius:6,border:'1px solid #D8E8EF'}},
            R('div',{style:{fontSize:13,fontWeight:700,color:'#002D41',marginBottom:10}},'Correctieve acties registreren'),
            corrActies.length > 0 && R('div',{style:{marginBottom:12}},
              corrActies.map(function(a,i){
                return R('div',{key:i,style:{padding:'8px 10px',background:'white',borderRadius:4,marginBottom:6,fontSize:12,display:'flex',gap:10,alignItems:'flex-start',border:'1px solid #E0E8EE'}},
                  R('div',{style:{flex:1}},
                    R('div',{style:{fontWeight:600,color:'#002D41'}}, a.omschrijving),
                    R('div',{style:{fontSize:11,color:'#6E8591',marginTop:2}}, a.datum + (a.uitgevoerd_door? ' · door '+a.uitgevoerd_door:''))
                  ),
                  R('button',{onClick:function(){setCorrActies(corrActies.filter(function(_,j){return j!==i;}));},style:{background:'transparent',border:'none',color:'#C62828',cursor:'pointer',fontSize:13,padding:'2px 8px'}},'✕')
                );
              })
            ),
            R('div',{style:{display:'grid',gridTemplateColumns:'2fr 1fr 1fr auto',gap:8,alignItems:'end'}},
              R('label',{style:FLD},'Omschrijving correctieve actie',
                R('input',{type:'text',value:corrForm.omschrijving,onChange:function(e){setCorrForm(Object.assign({},corrForm,{omschrijving:e.target.value}));},style:INP,placeholder:'Bv. Vriescel deur dichtgedaan, sensor herstart, koeler gerepareerd...'})
              ),
              R('label',{style:FLD},'Datum',
                R('input',{type:'date',value:corrForm.datum,onChange:function(e){setCorrForm(Object.assign({},corrForm,{datum:e.target.value}));},style:INP})
              ),
              R('label',{style:FLD},'Door',
                R('input',{type:'text',value:corrForm.uitgevoerd_door,onChange:function(e){setCorrForm(Object.assign({},corrForm,{uitgevoerd_door:e.target.value}));},style:INP,placeholder:'Naam'})
              ),
              R('button',{onClick:function(){
                if(!corrForm.omschrijving.trim()){
                  if(window.kr&&window.kr.toast) window.kr.toast('Vul een omschrijving in','warn');
                  return;
                }
                setCorrActies(corrActies.concat([{omschrijving:corrForm.omschrijving.trim(),datum:corrForm.datum,uitgevoerd_door:corrForm.uitgevoerd_door.trim()}]));
                setCorrForm({omschrijving:'',datum:new Date().toISOString().slice(0,10),uitgevoerd_door:corrForm.uitgevoerd_door});
              },style:{padding:'8px 16px',background:'#1976D2',color:'white',border:'none',borderRadius:4,cursor:'pointer',fontSize:12.5,fontWeight:600,whiteSpace:'nowrap'}},'+ Toevoegen')
            )
          )
        ),
        R('section',{style:{marginTop:36}},
          R('h2',{style:{fontSize:18,fontWeight:600,color:'#002D41',margin:'0 0 4px 0'}},'4. Apparatuurverificatie (steekthermometer)'),
          R('div',{style:{fontSize:12,color:'#6E8591',marginBottom:12}},'Wekelijkse vergelijking sensor vs steekthermometer. Tolerantie: 2 graden. Voeg onderaan een nieuwe meting toe.'),
          verif.length===0
            ? R('div',{style:{padding:20,background:'#FFF3E0',borderRadius:4,color:'#E65100'}},'Nog geen verificatie-metingen in deze periode vastgelegd.')
            : R('table',{style:{width:'100%',borderCollapse:'collapse',fontSize:12}},
                R('thead',null,R('tr',null,
                  R('th',{style:TH},'Datum'),R('th',{style:TH},'Koeling'),
                  R('th',{style:THR},'Steek'),R('th',{style:THR},'Sensor'),R('th',{style:THR},'Verschil'),
                  R('th',{style:TH},'Door'),R('th',{style:TH},'Opmerking')
                )),
                R('tbody',null, verif.map(function(v,i){
                  return R('tr',{key:v.id||i},
                    R('td',{style:Object.assign({},TD,{fontFamily:'monospace',fontSize:11})}, new Date(v.gemeten_op).toLocaleString('nl-NL')),
                    R('td',{style:TD}, (v.kiosk_sensoren&&v.kiosk_sensoren.naam)||'-'),
                    R('td',{style:TDR}, fmt(v.steek_temp,1)+'C'),
                    R('td',{style:TDR}, fmt(v.sensor_temp,1)+'C'),
                    R('td',{style:Object.assign({},TDR,{color:v.binnen_tolerantie?'#2E7D32':'#C62828',fontWeight:600})}, fmt(v.verschil,1)+'C'),
                    R('td',{style:TD}, v.gemeten_door||'-'),
                    R('td',{style:TD}, v.opmerking||'-')
                  );
                }))
              ),
          R('div',{className:'nvwa-noprint',style:{marginTop:18,padding:16,background:'#F5F8FA',borderRadius:6,border:'1px solid #D8E8EF'}},
            R('div',{style:{fontSize:13,fontWeight:700,color:'#002D41',marginBottom:10}},'Nieuwe verificatie-meting toevoegen'),
            R('div',{style:{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:8,alignItems:'end',marginBottom:10}},
              R('label',{style:FLD},'Koeling',
                R('select',{value:nieuweVerif.sensor_id,onChange:function(e){setNieuweVerif(Object.assign({},nieuweVerif,{sensor_id:e.target.value}));},style:INP},
                  R('option',{value:''},'-- kies sensor --'),
                  sensoren.map(function(s){
                    return R('option',{key:s.id,value:s.id}, s.naam+' ('+(s.min_norm==null?'?':s.min_norm)+'/'+(s.max_norm==null?'?':s.max_norm)+'C)');
                  })
                )
              ),
              R('label',{style:FLD},'Steek-temp (C)',
                R('input',{type:'number',step:'0.1',value:nieuweVerif.steek_temp,onChange:function(e){setNieuweVerif(Object.assign({},nieuweVerif,{steek_temp:e.target.value}));},style:INP,placeholder:'verplicht'})
              ),
              R('label',{style:FLD},'Sensor-temp (C)',
                R('input',{type:'number',step:'0.1',value:nieuweVerif.sensor_temp,onChange:function(e){setNieuweVerif(Object.assign({},nieuweVerif,{sensor_temp:e.target.value}));},style:INP,placeholder:'optioneel'})
              ),
              R('label',{style:FLD},'Gemeten door',
                R('input',{type:'text',value:nieuweVerif.gemeten_door,onChange:function(e){setNieuweVerif(Object.assign({},nieuweVerif,{gemeten_door:e.target.value}));},style:INP,placeholder:'Naam'})
              )
            ),
            R('div',{style:{display:'grid',gridTemplateColumns:'1fr auto',gap:8,alignItems:'end'}},
              R('label',{style:FLD},'Opmerking (optioneel)',
                R('input',{type:'text',value:nieuweVerif.opmerking,onChange:function(e){setNieuweVerif(Object.assign({},nieuweVerif,{opmerking:e.target.value}));},style:INP})
              ),
              R('button',{disabled:verifBezig,onClick:function(){
                if(!nieuweVerif.sensor_id || nieuweVerif.steek_temp===''){
                  if(window.kr&&window.kr.toast) window.kr.toast('Kies een sensor en vul steek-temp in','warn');
                  return;
                }
                setVerifBezig(true);
                var payload = {
                  outlet_code: outlet,
                  sensor_id: nieuweVerif.sensor_id,
                  steek_temp: parseFloat(nieuweVerif.steek_temp),
                  sensor_temp: nieuweVerif.sensor_temp===''?null:parseFloat(nieuweVerif.sensor_temp),
                  gemeten_door: nieuweVerif.gemeten_door.trim()||null,
                  opmerking: nieuweVerif.opmerking.trim()||null
                };
                window._supa.from('haccp_verificatie_metingen').insert(payload).select('*, kiosk_sensoren(naam)').maybeSingle()
                  .then(function(r){
                    setVerifBezig(false);
                    if(r.error){
                      if(window.kr&&window.kr.toast) window.kr.toast('Fout: '+r.error.message,'error');
                    } else {
                      setVerif([r.data].concat(verif));
                      setNieuweVerif({sensor_id:'',steek_temp:'',sensor_temp:'',gemeten_door:nieuweVerif.gemeten_door,opmerking:''});
                      if(window.kr&&window.kr.toast) window.kr.toast('Verificatie-meting opgeslagen','success');
                    }
                  });
              },style:{padding:'9px 18px',background:verifBezig?'#6E8591':'#1976D2',color:'white',border:'none',borderRadius:4,cursor:verifBezig?'wait':'pointer',fontSize:13,fontWeight:600,whiteSpace:'nowrap'}}, verifBezig?'Bezig...':'Meting opslaan')
            )
          )
        ),
        R('div',{style:{marginTop:50,paddingTop:24,borderTop:'2px solid #002D41',display:'grid',gridTemplateColumns:'1fr 1fr',gap:40}},
          R('div',null, R('b',{style:{fontSize:11,color:'#6E8591',textTransform:'uppercase',letterSpacing:'.04em'}},'Opgesteld door'), R('div',{style:{borderBottom:'1px solid #234756',minHeight:42,marginTop:6}})),
          R('div',null, R('b',{style:{fontSize:11,color:'#6E8591',textTransform:'uppercase',letterSpacing:'.04em'}},'Datum en handtekening'), R('div',{style:{borderBottom:'1px solid #234756',minHeight:42,marginTop:6}}))
        ),
        R('div',{style:{marginTop:20,fontSize:10.5,color:'#6E8591',fontStyle:'italic'}},'Automatisch gegenereerd uit KitchenRobot. Metingen zijn tijdgestempeld en onveranderbaar. Bewaartermijn: 2 jaar.')
      )
    );
  };
})();

