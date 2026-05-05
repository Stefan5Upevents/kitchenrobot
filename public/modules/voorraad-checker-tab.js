// KitchenRobot module: voorraad-checker-tab.js
// Geextraheerd uit index.html op 2026-05-05T03:45:48.309Z
// Bevat: VoorraadCheckerTab
// Externe refs (via window._): (geen)
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function VoorraadCheckerTab() {
  var [voorraad, setVoorraad] = useState([]);
  var [laden, setLaden] = useState(false);
  var [zoek, setZoek] = useState("");
  var [nieuwNaam, setNieuwNaam] = useState("");
  var [nieuwAantal, setNieuwAantal] = useState("");
  var [nieuwEenheid, setNieuwEenheid] = useState("st");

  function laad() {
    if (!window._supa) return;
    setLaden(true);
    window._supa.from("voorraad_checker").select("*").order("naam").then(function(r) {
      setVoorraad(r.data || []);
      setLaden(false);
    });
  }
  useEffect(function() { laad(); }, []);

  function voegToe() {
    if (!nieuwNaam.trim() || !window._supa) return;
    window._supa.from("voorraad_checker").upsert(
      { naam: nieuwNaam.trim(), hoeveelheid: parseFloat(nieuwAantal)||0, eenheid: nieuwEenheid, bijgewerkt_op: new Date().toISOString() },
      { onConflict: "naam" }
    ).then(function(r) { if (!r.error) { setNieuwNaam(""); setNieuwAantal(""); laad(); } });
  }

  function updateVoorraad(naam, hoeveelheid) {
    if (!window._supa) return;
    window._supa.from("voorraad_checker").update({ hoeveelheid: parseFloat(hoeveelheid)||0, bijgewerkt_op: new Date().toISOString() }).eq("naam", naam).then(function() { laad(); });
  }

  // Bereken benodigd per product vanuit geladen boekingen + stamdata
  var benodigdMap = {};
  (window._recrasBoekingen||[]).forEach(function(b) {
    (b.regels||[]).forEach(function(r) {
      if ((r.menuNaam||"").toLowerCase().includes("add up")) return;
      var kp = (window._stamKoppelingen||[]).find(function(k){ return (k.recras_naam||"").trim()===(r.menuNaam||"").trim(); });
      var m = kp ? (window._stamMenus||[]).find(function(mm){ return mm.id===kp.menu_id; }) : null;
      if (!m) return;
      (m.menu_gerechten||[]).forEach(function(mg){
        var g = (window._stamGerechten||[]).find(function(x){ return x.id===mg.gerecht_id; });
        if (!g) return;
        var pEff = r.aantal*(mg.porties_per_persoon||1);
        (g.ingredienten||[]).forEach(function(ing){
          if (ing.zichtbaar==="nee"||ing.zichtbaar==="nooit") return;
          var sp = (window._stamSligro||[]).find(function(p){ return p.id===ing.sligro_id; });
          if (!sp) return;
          var gebruikt = pEff*(parseFloat(ing.gebruik_per_portie)||0);
          var vp = parseFloat(sp.hoeveelheid||sp.hoev||1)||1;
          if (!benodigdMap[sp.naam]) benodigdMap[sp.naam] = 0;
          benodigdMap[sp.naam] += Math.ceil(gebruikt/vp);
        });
      });
    });
  });

  var gefilterd = voorraad.filter(function(v){ return v.naam.toLowerCase().includes(zoek.toLowerCase()); });

  return React.createElement("div", null,
    React.createElement("div", {style:{background:"#EFF9FB",border:"1.5px solid #3FB8C4",borderRadius:9,padding:"10px 14px",fontSize:12,fontWeight:700,color:"#234756",marginBottom:14,display:"flex",gap:8}},
      "ℹ️  Voer hier je huidige voorraad in. Per product zie je hoeveel er nodig is voor de geladen boekingen. De WhatsApp-assistent kan dit lezen om bestelvoorstellen te doen."
    ),
    // Nieuw product invoeren
    React.createElement("div", {style:{background:"#fff",borderRadius:12,padding:18,border:"1.5px solid #D8E8EF",marginBottom:14}},
      React.createElement("div",{style:{fontWeight:900,fontSize:14,color:"#234756",marginBottom:12}},"Voorraad bijwerken"),
      React.createElement("div",{style:{display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}},
        React.createElement("div",{style:{flex:2,minWidth:150}},
          React.createElement("label",{style:{fontWeight:700,fontSize:11,color:"#234756",marginBottom:4,display:"block"}},"Product"),
          React.createElement("input",{style:{border:"1.5px solid #D8E8EF",borderRadius:8,padding:"9px 12px",fontFamily:"inherit",fontSize:12,color:"#234756",width:"100%",outline:"none",boxSizing:"border-box"},
            placeholder:"Naam (bijv. Kipsaté 200g)",value:nieuwNaam,onChange:function(e){setNieuwNaam(e.target.value);}})
        ),
        React.createElement("div",{style:{flex:1,minWidth:80}},
          React.createElement("label",{style:{fontWeight:700,fontSize:11,color:"#234756",marginBottom:4,display:"block"}},"Hoeveelheid"),
          React.createElement("input",{style:{border:"1.5px solid #D8E8EF",borderRadius:8,padding:"9px 12px",fontFamily:"inherit",fontSize:12,color:"#234756",width:"100%",outline:"none",boxSizing:"border-box"},
            type:"number",placeholder:"0",value:nieuwAantal,onChange:function(e){setNieuwAantal(e.target.value);}})
        ),
        React.createElement("div",{style:{flex:1,minWidth:80}},
          React.createElement("label",{style:{fontWeight:700,fontSize:11,color:"#234756",marginBottom:4,display:"block"}},"Eenheid"),
          React.createElement("select",{style:{border:"1.5px solid #D8E8EF",borderRadius:8,padding:"9px 12px",fontFamily:"inherit",fontSize:12,color:"#234756",width:"100%",outline:"none",boxSizing:"border-box"},
            value:nieuwEenheid,onChange:function(e){setNieuwEenheid(e.target.value);}},
            ["st","kg","g","l","ml","zak","doos","rol","pak"].map(function(u){ return React.createElement("option",{key:u,value:u},u); })
          )
        ),
        React.createElement("button",{style:{background:"#E8202B",color:"#fff",border:"none",borderRadius:8,padding:"9px 18px",fontFamily:"inherit",fontWeight:700,fontSize:12,cursor:"pointer"},
          onClick:voegToe},"+ Opslaan")
      )
    ),
    React.createElement("input",{style:{border:"1.5px solid #D8E8EF",borderRadius:8,padding:"9px 12px",fontFamily:"inherit",fontSize:12,color:"#234756",width:"100%",outline:"none",boxSizing:"border-box",marginBottom:12},
      placeholder:"Zoek product...",value:zoek,onChange:function(e){setZoek(e.target.value);}}),
    laden ? React.createElement("div",{style:{textAlign:"center",padding:20,color:"#6B8A9A"}},"Laden...") :
    React.createElement("div",{style:{overflowX:"auto"}},
      React.createElement("table",{className:"kr-table",style:{width:"100%",borderCollapse:"collapse",fontSize:12}},
        React.createElement("thead",null,
          React.createElement("tr",null,
            ["Product","Op voorraad","Eenheid","Bijgewerkt","Benodigd","Status"].map(function(h){
              return React.createElement("th",{key:h,style:{background:"#234756",color:"#F1F7F9",padding:"10px 12px",textAlign:"left",fontWeight:700,fontSize:10,letterSpacing:1.5,textTransform:"uppercase"}},h);
            })
          )
        ),
        React.createElement("tbody",null,
          gefilterd.length===0 && React.createElement("tr",null,
            React.createElement("td",{colSpan:6,style:{padding:"20px",textAlign:"center",color:"#6B8A9A",fontStyle:"italic"}},
              "Nog geen voorraad. Voeg producten toe hierboven."
            )
          ),
          gefilterd.map(function(item,i){
            var benodigd = benodigdMap[item.naam]||0;
            var hv = parseFloat(item.hoeveelheid)||0;
            var status = benodigd===0?"ok":hv>=benodigd*1.5?"ok":hv>=benodigd?"laag":"kritiek";
            var skl = {ok:"#10B981",laag:"#F59E0B",kritiek:"#E8202B"}[status];
            var slabel = {ok:"✓ Voldoende",laag:"⚠ Krap",kritiek:"⛔ Te weinig"}[status];
            return React.createElement("tr",{key:i,style:{background:status==="kritiek"?"#FFF0F0":status==="laag"?"#FFFBEB":i%2===0?"#fff":"#F8FAFC"}},
              React.createElement("td",{style:{padding:"10px 12px",fontWeight:700,color:"#234756"}},item.naam),
              React.createElement("td",{style:{padding:"10px 12px"}},
                React.createElement("input",{
                  type:"number",
                  style:{border:"1.5px solid #D8E8EF",borderRadius:100,padding:"4px 8px",width:70,fontFamily:"inherit",fontSize:12,background:status==="kritiek"?"#FFF0F0":"#fff"},
                  defaultValue:item.hoeveelheid,
                  onBlur:function(e){ updateVoorraad(item.naam, e.target.value); }
                })
              ),
              React.createElement("td",{style:{padding:"10px 12px",color:"#6B8A9A"}},item.eenheid||""),
              React.createElement("td",{style:{padding:"10px 12px",fontSize:10,color:"#6B8A9A"}},
                item.bijgewerkt_op?new Date(item.bijgewerkt_op).toLocaleDateString("nl-NL",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}):"—"
              ),
              React.createElement("td",{style:{padding:"10px 12px",fontWeight:700,color:benodigd>0?"#234756":"#6B8A9A"}},
                benodigd>0?benodigd+"×":"—"
              ),
              React.createElement("td",{style:{padding:"10px 12px"}},
                React.createElement("span",{style:{background:skl+"18",color:skl,border:"1px solid "+skl+"44",borderRadius:5,padding:"3px 9px",fontSize:10,fontWeight:700}},slabel)
              )
            );
          })
        )
      )
    )
  );
}

  window._VoorraadCheckerTab = VoorraadCheckerTab;
})();
