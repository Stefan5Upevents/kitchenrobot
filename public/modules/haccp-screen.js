// KitchenRobot module: haccp-screen.js
// Geextraheerd uit index.html op 2026-05-05T06:50:46.414Z
// Bevat: HACCPScreen
// Externe refs (via window._): (geen)
(function() {
  'use strict';
  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  function HACCPScreen() {
  var [haccpMetingen, setHaccpMetingen] = useState([]);
  var [taakRegistraties, setTaakRegistraties] = useState([]);
  var [haccpLaden, setHaccpLaden] = useState(false);
  var [haccpPeriodeVan, setHaccpPeriodeVan] = useState(function() {
    var d = /* @__PURE__ */ new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  });
  var [haccpPeriodeTot, setHaccpPeriodeTot] = useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  var [haccpOutlet, setHaccpOutlet] = useState("alle");
  var [actievTab, setActievTab] = useState("temperatuur");
  function laadMetingen() {
    setHaccpLaden(true);
    var q = window._supa.from("kiosk_haccp_metingen").select("*").gte("gemeten_op", haccpPeriodeVan + "T00:00:00").lte("gemeten_op", haccpPeriodeTot + "T23:59:59").order("gemeten_op", { ascending: false });
    if (haccpOutlet !== "alle") q = q.eq("outlet_code", haccpOutlet);
    var q2 = window._supa.from("kiosk_registraties").select("*, kiosk_taak_templates(naam,frequentie,type)").gte("afgetekend_op", haccpPeriodeVan + "T00:00:00").lte("afgetekend_op", haccpPeriodeTot + "T23:59:59").order("afgetekend_op", { ascending: false });
    if (haccpOutlet !== "alle") q2 = q2.eq("outlet_code", haccpOutlet);
    Promise.all([q, q2]).then(function(results) {
      setHaccpMetingen(results[0].data || []);
      setTaakRegistraties(results[1].data || []);
      setHaccpLaden(false);
    });
  }
  var totaal = haccpMetingen.length;
  var afwijkingen = haccpMetingen.filter(function(m) {
    return m.binnen_norm === false;
  }).length;
  var gecorrigeerd = haccpMetingen.filter(function(m) {
    return m.correctieve_actie;
  }).length;
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: C.night, marginBottom: 4 } }, "🌡 HACCP Inspectierapport"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: C.muted } }, "Temperatuurmetingen \xE9n afgetekende taken — exporteerbaar voor de NVWA inspecteur.")), /* @__PURE__ */ React.createElement("div", { style: { ...SS.card, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "end" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Periode van"), /* @__PURE__ */ React.createElement("input", { type: "date", style: SS.inp, value: haccpPeriodeVan, onChange: function(e) {
    setHaccpPeriodeVan(e.target.value);
  } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Periode tot"), /* @__PURE__ */ React.createElement("input", { type: "date", style: SS.inp, value: haccpPeriodeTot, onChange: function(e) {
    setHaccpPeriodeTot(e.target.value);
  } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: SS.lbl }, "Keuken"), /* @__PURE__ */ React.createElement("select", { style: SS.inp, value: haccpOutlet, onChange: function(e) {
    setHaccpOutlet(e.target.value);
  } }, /* @__PURE__ */ React.createElement("option", { value: "alle" }, "Alle keukens"), /* @__PURE__ */ React.createElement("option", { value: "west" }, "Amsterdam West"), /* @__PURE__ */ React.createElement("option", { value: "weesp" }, "Weesp"))), /* @__PURE__ */ React.createElement("button", { style: SS.btnP, onClick: laadMetingen }, haccpLaden ? "Laden..." : `Laden`))), (totaal > 0 || taakRegistraties.length > 0) && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" } }, [["temperatuur", "🌡 Temperaturen (" + totaal + ")"], ["taken", "\u2705 Taken (" + taakRegistraties.length + ")"]].map(function(tb) {
    var act = actievTab === tb[0];
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: tb[0],
        style: { ...SS.btn, background: act ? C.night : "#fff", color: act ? "#fff" : C.night, border: "1px solid " + (act ? C.night : C.border), fontWeight: act ? 700 : 400, padding: "7px 16px", fontSize: 12 },
        onClick: function() {
          setActievTab(tb[0]);
        }
      },
      tb[1]
    );
  }), /* @__PURE__ */ React.createElement("div", { style: { marginLeft: "auto", display: "flex", gap: 8 } }, actievTab === "temperatuur" && totaal > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { style: SS.btnP, onClick: function() {
    if (typeof XLSX === "undefined") return;
    var rijen = haccpMetingen.map(function(m) {
      return { Datum: m.gemeten_op ? new Date(m.gemeten_op).toLocaleString("nl-NL") : "", Outlet: m.outlet_code === "west" ? "Amsterdam West" : "Weesp", Controlepunt: m.punt_naam, Meting: m.gemeten_temp !== null ? m.gemeten_temp + "\xB0C" : "", Min: m.min_norm !== null ? m.min_norm + "\xB0C" : "", Max: m.max_norm !== null ? m.max_norm + "\xB0C" : "", Resultaat: m.binnen_norm === true ? "OK" : m.binnen_norm === false ? "AFWIJKING" : "—", Opmerking: m.afwijking_opmerking || "", Correctieve_actie: m.correctieve_actie || "", Medewerker: m.medewerker_naam || "" };
    });
    var ws = XLSX.utils.json_to_sheet(rijen);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "HACCP Temp");
    XLSX.writeFile(wb, "HACCP_temp_" + haccpPeriodeVan + "_" + haccpPeriodeTot + ".xlsx");
  } }, "📊 Excel temp."), /* @__PURE__ */ React.createElement("button", { style: SS.btn, onClick: function() {
    window.print();
  } }, "🖨 Print")), actievTab === "taken" && taakRegistraties.length > 0 && /* @__PURE__ */ React.createElement("button", { style: SS.btnP, onClick: function() {
    if (typeof XLSX === "undefined") return;
    var rijen = taakRegistraties.map(function(r) {
      var tmpl = r.kiosk_taak_templates || {};
      return { Datum: r.afgetekend_op ? new Date(r.afgetekend_op).toLocaleString("nl-NL") : "", Outlet: r.outlet_code === "west" ? "Amsterdam West" : "Weesp", Taak: tmpl.naam || r.taak_template_id, Frequentie: tmpl.frequentie || "", Type: tmpl.type || "", Medewerker: r.medewerker_naam || "", Status: "Afgetekend", Opmerking: r.opmerking || "" };
    });
    var ws = XLSX.utils.json_to_sheet(rijen);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "HACCP Taken");
    XLSX.writeFile(wb, "HACCP_taken_" + haccpPeriodeVan + "_" + haccpPeriodeTot + ".xlsx");
  } }, "📊 Excel taken"))), actievTab === "temperatuur" && totaal > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 } }, [["Totaal metingen", totaal, C.aqua], ["Binnen norm", totaal - afwijkingen, C.green], ["Afwijkingen", afwijkingen, afwijkingen > 0 ? C.hot : C.green], ["Correctief gedoc.", gecorrigeerd, C.night]].map(function(s) {
    return /* @__PURE__ */ React.createElement("div", { key: s[0], style: { ...SS.card, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 } }, s[0]), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, fontWeight: 900, color: s[2] } }, s[1]));
  })), actievTab === "taken" && taakRegistraties.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 } }, (function() {
    var dag = taakRegistraties.filter(function(r) {
      return r.kiosk_taak_templates && r.kiosk_taak_templates.frequentie === "dagelijks";
    }).length;
    var wek = taakRegistraties.filter(function(r) {
      return r.kiosk_taak_templates && r.kiosk_taak_templates.frequentie === "wekelijks";
    }).length;
    return [["Totaal afgetekend", taakRegistraties.length, C.aqua], ["Dagelijkse taken", dag, C.green], ["Wekelijkse taken", wek, C.night]];
  })().map(function(s) {
    return /* @__PURE__ */ React.createElement("div", { key: s[0], style: { ...SS.card, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 } }, s[0]), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, fontWeight: 900, color: s[2] } }, s[1]));
  })), haccpLaden && /* @__PURE__ */ React.createElement("div", { style: { padding: 30, textAlign: "center", color: C.muted } }, "Laden..."), !haccpLaden && totaal === 0 && taakRegistraties.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { ...SS.card, textAlign: "center", padding: 40, color: C.muted } }, "Kies een periode en klik op Laden. Temperatuurmetingen en afgetekende taken worden beide geladen."), actievTab === "temperatuur" && totaal > 0 && /* @__PURE__ */ React.createElement("table", { className:"kr-table", style: { ...SS.tbl, fontSize: 12 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, ["Datum/tijd", "Keuken", "Controlepunt", "Meting", "Norm", "Resultaat", "Correctieve actie", "Medewerker"].map(function(h) {
    return /* @__PURE__ */ React.createElement("th", { key: h, style: SS.th }, h);
  }))), /* @__PURE__ */ React.createElement("tbody", null, haccpMetingen.map(function(m) {
    var isOk = m.binnen_norm === true;
    var isAfw = m.binnen_norm === false;
    return /* @__PURE__ */ React.createElement("tr", { key: m.id, style: { background: isAfw ? "#FFF5F5" : C.white } }, /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11, whiteSpace: "nowrap", color: C.muted } }, m.gemeten_op ? new Date(m.gemeten_op).toLocaleString("nl-NL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11 } }, m.outlet_code === "west" ? "West" : "Weesp"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 600 } }, m.punt_naam), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 900, color: isAfw ? C.hot : isOk ? C.green : C.muted, fontSize: 13 } }, m.gemeten_temp !== null ? m.gemeten_temp + "\xB0C" : "—"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11, color: C.muted } }, m.min_norm !== null ? m.min_norm + "\xB0C \u2013 " + m.max_norm + "\xB0C" : "—"), /* @__PURE__ */ React.createElement("td", { style: SS.td }, isAfw ? /* @__PURE__ */ React.createElement("span", { style: { background: "#FFEBEE", color: C.hot, borderRadius: 8, padding: "1px 7px", fontSize: 10, fontWeight: 700 } }, "\u26A0 Afwijking") : isOk ? /* @__PURE__ */ React.createElement("span", { style: { background: "#E8F5E9", color: C.green, borderRadius: 8, padding: "1px 7px", fontSize: 10, fontWeight: 700 } }, "✓ OK") : /* @__PURE__ */ React.createElement("span", { style: { color: C.muted, fontSize: 11 } }, "—")), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11, color: isAfw && !m.correctieve_actie ? C.hot : C.muted } }, m.correctieve_actie || (isAfw ? "\u26A0 Niet gedocumenteerd" : "—")), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11, color: C.muted } }, m.medewerker_naam || "—"));
  }))), actievTab === "taken" && taakRegistraties.length > 0 && /* @__PURE__ */ React.createElement("table", { className:"kr-table", style: { ...SS.tbl, fontSize: 12 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, ["Datum/tijd", "Keuken", "Taak", "Frequentie", "Type", "Medewerker", "Tijdstip"].map(function(h) {
    return /* @__PURE__ */ React.createElement("th", { key: h, style: SS.th }, h);
  }))), /* @__PURE__ */ React.createElement("tbody", null, taakRegistraties.map(function(r) {
    var tmpl = r.kiosk_taak_templates || {};
    var freq = tmpl.frequentie || "";
    var freqKl = { dagelijks: C.hot, wekelijks: C.aqua, maandelijks: "#FF9800", jaarlijks: C.muted }[freq] || C.muted;
    return /* @__PURE__ */ React.createElement("tr", { key: r.id }, /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11, whiteSpace: "nowrap", color: C.muted } }, r.afgetekend_op ? new Date(r.afgetekend_op).toLocaleString("nl-NL", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11 } }, r.outlet_code === "west" ? "West" : "Weesp"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontWeight: 700 } }, tmpl.naam || r.taak_template_id), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("span", { style: { background: freqKl + "22", color: freqKl, borderRadius: 8, padding: "1px 6px", fontSize: 10, fontWeight: 700 } }, freq || "—")), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, color: C.muted, fontSize: 11 } }, tmpl.type || "—"), /* @__PURE__ */ React.createElement("td", { style: { ...SS.td, fontSize: 11 } }, r.medewerker_naam || "—"), /* @__PURE__ */ React.createElement("td", { style: SS.td }, /* @__PURE__ */ React.createElement("span", { style: { background: "#E8F5E9", color: C.green, borderRadius: 8, padding: "1px 7px", fontSize: 10, fontWeight: 700 } }, "✓ ", r.afgetekend_op ? new Date(r.afgetekend_op).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }) : "Afgetekend")));
  }))));
}

  window._HACCPScreen = HACCPScreen;
})();
