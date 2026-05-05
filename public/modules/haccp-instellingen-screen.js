// KitchenRobot module: haccp-instellingen-screen.js
// Geextraheerd uit index.html op 2026-05-05T12:48:38.098Z (self-exposed dedicated-script, soort: iife)
// Bevat: HACCPInstellingenScreen
(function(){
  if(!window.React) return;
  var R = window.React.createElement;
  var useState = window.React.useState;
  var useEffect = window.React.useEffect;

  var FLD={fontSize:11,color:'#6E8591',textTransform:'uppercase',letterSpacing:'.04em',fontWeight:600,marginBottom:4,display:'block'};
  var INP={width:'100%',padding:'8px 10px',border:'1px solid #AEC5D1',borderRadius:4,fontSize:13,fontFamily:'inherit',background:'white',boxSizing:'border-box'};
  var TAB=function(actief){return {padding:'10px 22px',cursor:'pointer',borderBottom:actief?'3px solid #002D41':'3px solid transparent',fontWeight:actief?700:500,color:actief?'#002D41':'#6E8591',background:'transparent',border:'none',fontSize:14,marginBottom:-1};};
  var CARD={background:'white',padding:'20px 26px',borderRadius:8,boxShadow:'0 1px 3px rgba(0,0,0,.06)',marginBottom:14};
  var GRID2={display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px 22px'};
  var H={fontSize:14,fontWeight:700,color:'#002D41',margin:'0 0 12px 0',paddingBottom:6,borderBottom:'1px solid #E0E8EE',gridColumn:'1 / -1'};

  window._HACCPInstellingenScreen = function HACCPInstellingenScreen(){
    var os = useState('weesp'); var outlet = os[0]; var setOutlet = os[1];
    var fs = useState(null); var form = fs[0]; var setForm = fs[1];
    var ls = useState(true); var laadt = ls[0]; var setLaadt = ls[1];
    var ss = useState(false); var bewaard = ss[0]; var setBewaard = ss[1];
    var fS = useState(null); var fout = fS[0]; var setFout = fS[1];
    var bS = useState(false); var bewaarBezig = bS[0]; var setBewaarBezig = bS[1];

    useEffect(function(){
      if(!window._supa) return;
      setLaadt(true); setFout(null); setBewaard(false);
      window._supa.from('haccp_instellingen').select('*').eq('outlet_code',outlet).maybeSingle()
        .then(function(r){
          if(r.error){ setFout(r.error.message); }
          else { setForm(r.data || {outlet_code: outlet}); }
          setLaadt(false);
        });
    },[outlet]);

    function veld(key){ return (form && form[key] != null) ? form[key] : ''; }
    function setVeld(key, v){
      var nieuw = Object.assign({}, form || {});
      nieuw[key] = v;
      nieuw.outlet_code = outlet;
      setForm(nieuw);
      setBewaard(false);
    }

    function bewaar(){
      if(!window._supa || !form) return;
      setBewaarBezig(true); setFout(null);
      var payload = Object.assign({}, form, {outlet_code: outlet, gewijzigd_op: new Date().toISOString()});
      window._supa.from('haccp_instellingen').upsert(payload, {onConflict:'outlet_code'}).select().maybeSingle()
        .then(function(r){
          setBewaarBezig(false);
          if(r.error){ setFout(r.error.message); }
          else {
            setForm(r.data);
            setBewaard(true);
            if(window.kr && window.kr.toast) window.kr.toast('Bedrijfsgegevens opgeslagen','success');
          }
        });
    }

    function inputVeld(key, label, type){
      type = type || 'text';
      return R('label',null,
        R('span',{style:FLD}, label),
        R('input',{type:type, value:veld(key), onChange:function(e){setVeld(key, e.target.value);}, style:INP})
      );
    }

    var outletNaam = outlet === 'west' ? 'Amsterdam West' : 'Weesp';

    return R('div',{style:{padding:20,maxWidth:980,margin:'0 auto',color:'#234756'}},
      R('h1',{style:{fontSize:22,fontWeight:600,color:'#002D41',margin:'0 0 6px 0'}},'🏥 HACCP Bedrijfsgegevens'),
      R('div',{style:{color:'#6E8591',fontSize:13,marginBottom:18,lineHeight:1.5}},'Deze gegevens worden automatisch gebruikt op het NVWA-rapport (zowel het overzicht in admin als de exporteerbare PDF). Vul beide vestigingen in.'),
      R('div',{style:{borderBottom:'1px solid #D8E8EF',marginBottom:18,display:'flex',gap:4}},
        R('button',{onClick:function(){setOutlet('west');},style:TAB(outlet==='west')},'Amsterdam West'),
        R('button',{onClick:function(){setOutlet('weesp');},style:TAB(outlet==='weesp')},'Weesp')
      ),
      fout && R('div',{style:{padding:14,background:'#FFEBEE',color:'#C62828',borderRadius:4,marginBottom:14,fontSize:13}},'Fout: '+fout),
      laadt && R('div',{style:{padding:30,textAlign:'center',color:'#6E8591'}},'Laden...'),
      !laadt && form && R('div',null,
        R('div',{style:CARD},
          R('div',{style:GRID2},
            R('h3',{style:H},'Bedrijfsgegevens — '+outletNaam),
            inputVeld('bedrijfsnaam','Bedrijfsnaam'),
            inputVeld('kvk_nummer','KvK-nummer'),
            inputVeld('btw_nummer','BTW-nummer'),
            inputVeld('vestigingsnummer','Vestigingsnummer (optioneel)')
          )
        ),
        R('div',{style:CARD},
          R('div',{style:GRID2},
            R('h3',{style:H},'Adres'),
            R('label',{style:{gridColumn:'1 / -1'}},R('span',{style:FLD},'Straat + huisnummer'),R('input',{type:'text',value:veld('adres'),onChange:function(e){setVeld('adres',e.target.value);},style:INP})),
            inputVeld('postcode','Postcode'),
            inputVeld('plaats','Plaats')
          )
        ),
        R('div',{style:CARD},
          R('div',{style:GRID2},
            R('h3',{style:H},'Contact'),
            inputVeld('telefoon','Telefoon','tel'),
            inputVeld('email','E-mail','email')
          )
        ),
        R('div',{style:CARD},
          R('div',{style:GRID2},
            R('h3',{style:H},'Verantwoordelijke voedselveiligheid'),
            inputVeld('verantwoordelijke_naam','Naam'),
            inputVeld('verantwoordelijke_functie','Functie')
          )
        ),
        R('div',{style:CARD},
          R('div',{style:GRID2},
            R('h3',{style:H},'Vervanger (bij afwezigheid)'),
            inputVeld('vervanger_naam','Naam'),
            inputVeld('vervanger_functie','Functie')
          )
        ),
        R('div',{style:CARD},
          R('label',null,
            R('span',{style:FLD},'Toelichting bij rapport (optioneel)'),
            R('textarea',{rows:3,value:veld('toelichting_rapport'),onChange:function(e){setVeld('toelichting_rapport',e.target.value);},style:Object.assign({},INP,{fontFamily:'inherit',resize:'vertical'})})
          )
        ),
        R('div',{style:{display:'flex',justifyContent:'flex-end',gap:14,alignItems:'center',marginTop:18}},
          bewaard && R('span',{style:{color:'#2E7D32',fontSize:13,fontWeight:600}},'✓ Opgeslagen'),
          R('button',{onClick:bewaar,disabled:bewaarBezig,style:{padding:'11px 28px',background:bewaarBezig?'#6E8591':'#002D41',color:'white',border:'none',borderRadius:4,fontSize:14,fontWeight:600,cursor:bewaarBezig?'wait':'pointer'}}, bewaarBezig ? 'Bezig...' : 'Opslaan')
        )
      )
    );
  };
})();

