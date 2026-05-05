// KitchenRobot module: opzet-logboek-screen.js
// Geextraheerd uit index.html op 2026-05-05T04:55:43.078Z
// Bevat: OpzetLogboekScreen
// Externe refs (via window._): (geen)
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function OpzetLogboekScreen() {
  var [data, setData] = useState([]);
  var [laden, setLaden] = useState(false);
  var [vanDatum, setVanDatum] = useState(function() {
    var d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  });
  var [totDatum, setTotDatum] = useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  var [filterOutlet, setFilterOutlet] = useState("alle");
  var [filterStatus, setFilterStatus] = useState("alle");
  var [zoek, setZoek] = useState("");
  var [gekozen, setGekozen] = useState(null);
  function laad() {
    if (!window._supa) return;
    setLaden(true);
    var q = window._supa.from("kiosk_opzet_voortgang").select("*").gte("geregistreerd_op", vanDatum + "T00:00:00").lte("geregistreerd_op", totDatum + "T23:59:59").order("geregistreerd_op", { ascending: false });
    if (filterOutlet !== "alle") q = q.eq("outlet_code", filterOutlet);
    if (filterStatus !== "alle") q = q.eq("status", filterStatus);
    q.then(function(r) {
      setData(r.data || []);
      setLaden(false);
    });
  }
  useEffect(laad, []);
  function exportExcel() {
    if (typeof XLSX === "undefined") return;
    var rijen = gefilterd.map(function(r) {
      var tijdstempel = r.uitgevoerd_op || r.opgezet_op || r.geregistreerd_op; var medewerker = r.uitgevoerd_door_naam || r.opgezet_door_naam || ""; return { Datum: tijdstempel ? new Date(tijdstempel).toLocaleString("nl-NL") : "", Keuken: r.outlet_code === "west" ? "West" : "Weesp", Boeking: r.boeking_naam || r.boeking_id, Locatie: r.locatie || "", Menu: r.menu_naam || "", Gerecht: r.gerecht_naam || "", Productsoort: r.ps_naam || "", Status: r.status, Medewerker: medewerker, Porties: r.opgezet_porties || r.geplande_porties || "" };
    });
    var ws = XLSX.utils.json_to_sheet(rijen);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Opzet Logboek");
    XLSX.writeFile(wb, "OpzetLogboek_" + vanDatum + "_" + totDatum + ".xlsx");
  }
  var gefilterd = data.filter(function(r) {
    if (zoek) {
      var zl = zoek.toLowerCase();
      return (r.boeking_naam || "").toLowerCase().includes(zl) || (r.gerecht_naam || "").toLowerCase().includes(zl) || (r.menu_naam || "").toLowerCase().includes(zl) || (r.uitgevoerd_door_naam || "").toLowerCase().includes(zl) || (r.opgezet_door_naam || "").toLowerCase().includes(zl);
    }
    return true;
  });
  var totaal = gefilterd.length;
  var opgezet = gefilterd.filter(function(r) {
    return r.status === "opgezet";
  }).length;
  var uitgevoerd = gefilterd.filter(function(r) {
    return r.status === "uitgevoerd";
  }).length;
  var uniekeBoekingen = new Set(gefilterd.map(function(r) {
    return r.boeking_id;
  })).size;
  var statusKleur = { opgezet: C.aqua, uitgevoerd: C.green, concept: C.muted };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: C.night, marginBottom: 4 } }, "\u2705 Opzet Logboek"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: C.muted } }, "Alle afgetekende opzet- en BBQ-taken vanuit de kiosk, met tijdstempel en medewerker.")), /* @__PURE__ */ React.createElement("div", { style: { ...SS.card, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 10, alignItems: "end" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Van"), /* @__PURE__ */ React.createElement("input", { type: "date", style: SS.inp, value: vanDatum, onChange: function(e) {
    setVanDatum(e.target.value);
  } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Tot"), /* @__PURE__ */ React.createElement("input", { type: "date", style: SS.inp, value: totDatum, onChange: function(e) {
    setTotDatum(e.target.value);
  } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Keuken"), /* @__PURE__ */ React.createElement("select", { style: SS.inp, value: filterOutlet, onChange: function(e) {
    setFilterOutlet(e.target.value);
  } }, /* @__PURE__ */ React.createElement("option", { value: "alle" }, "Alle"), /* @__PURE__ */ React.createElement("option", { value: "west" }, "West"), /* @__PURE__ */ React.createElement("option", { value: "weesp" }, "Weesp"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Status"), /* @__PURE__ */ React.createElement("select", { style: SS.inp, value: filterStatus, onChange: function(e) {
    setFilterStatus(e.target.value);
  } }, /* @__PURE__ */ React.createElement("option", { value: "alle" }, "Alle"), /* @__PURE__ */ React.createElement("option", { value: "opgezet" }, "Opgezet"), /* @__PURE__ */ React.createElement("option", { value: "uitgevoerd" }, "Uitgevoerd"))), /* @__PURE__ */ React.createElement("button", { style: SS.btnP, onClick: laad }, laden ? "Laden..." : "Laden")), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10 } }, /* @__PURE__ */ React.createElement("input", { style: SS.inp, value: zoek, onChange: function(e) {
    setZoek(e.target.value);
  }, placeholder: "🔍 Zoek boeking, gerecht, medewerker..." }))), totaal > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 } }, [["Registraties", totaal, C.aqua], ["Opgezet", opgezet, C.aqua], ["Uitgevoerd", uitgevoerd, C.green], ["Boekingen", uniekeBoekingen, C.night]].map(function(s) {
    return /* @__PURE__ */ React.createElement("div", { key: s[0], style: { ...SS.card, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 } }, s[0]), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, fontWeight: 900, color: s[2] } }, s[1]));
  })), totaal > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("button", { style: SS.btnP, onClick: exportExcel }, "📊 Export Excel")), laden && /* @__PURE__ */ React.createElement("div", { style: { padding: 30, textAlign: "center", color: C.muted } }, "Laden..."), !laden && totaal === 0 && /* @__PURE__ */ React.createElement("div", { style: { ...SS.card, textAlign: "center", padding: 30, color: C.muted } }, "Geen registraties gevonden. Selecteer een periode en klik Laden."), totaal > 0 && /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ React.createElement("table", { className:"kr-table", style: { ...SS.tbl, fontSize: 11 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, ["Datum/tijd", "Keuken", "Boeking", "Locatie", "Menu", "Gerecht", "Status", "Medewerker", "Porties"].map(function(h) {
    return /* @__PURE__ */ React.createElement("th", { key: h, style: SS.th }, h);
  }))), /* @__PURE__ */ React.createElement("tbody", null, gefilterd.map(function(r) {
    var kl = statusKleur[r.status] || C.muted;
    return /* @__PURE__ */ React.createElement("tr", { key: r.id, style: { background: r.status === "uitgevoerd" ? "#F0FFF4" : r.status === "opgezet" ? "#F0FAFF" : C.white } }, /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 10, whiteSpace: "nowrap", color: C.muted } }, (function(){ var t = r.uitgevoerd_op || r.opgezet_op || r.geregistreerd_op; return t ? new Date(t).toLocaleString("nl-NL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—"; })()), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 10 } }, r.outlet_code === "west" ? "West" : "Weesp"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 600, fontSize: 11 } }, r.boeking_naam || r.boeking_id), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 10, color: C.muted } }, r.locatie || "—"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 10 } }, r.menu_naam || "—"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 700 } }, r.gerecht_naam || "—"), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("span", { style: { background: kl + "22", color: kl, borderRadius: 8, padding: "1px 7px", fontSize: 10, fontWeight: 700 } }, r.status)), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11 } }, (r.uitgevoerd_door_naam || r.opgezet_door_naam || "—")), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, textAlign: "right", fontWeight: 700 } }, r.opgezet_porties || r.geplande_porties || "—"));
  })))));
}

  window._OpzetLogboekScreen = OpzetLogboekScreen;
})();
