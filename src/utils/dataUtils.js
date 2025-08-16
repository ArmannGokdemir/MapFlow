// ----------------------------- FALLBACK DATA -----------------------------
export const RAW_ROWS = [
  ["Kongre", "Kongre Sürecini Başlat", "https://make.powerautomate.com/environments/Default-2d253016-30a2-4f87-bc61-adf119e508c9/solutions/1260bb9d-eb0b-4cc8-90e1-48333a1e6167/flows/9d4bdb23-0e57-f011-877a-7c1e5251be63/details", "Checks errors in congress process and orchestrates child flows", ""],
  ["Kongre", "GenerateGUID", "", "Creates a GUID for new files and updates working time; otherwise only updates working time. Runs in every process.", ""],
  ["Kongre", "Kongre Bakanlik Surecleri", "http://make.powerautomate.com/environments/Default-2d253016-30a2-4f87-bc61-adf119e508c9/flows/aa55527a-7d55-f011-877a-7c1e5251be63/details", "Fills ministry file", "KongreBakanlikV2"],
  ["Kongre", "Kongre PWC Sürecleri", "https://make.powerautomate.com/environments/Default-2d253016-30a2-4f87-bc61-adf119e508c9/flows/15433abd-7b55-f011-877a-7c1e5251be63/details", "Fills PWC file and inserts a SharePoint record", "CongressPWCV2"],
  ["Kongre", "Kongre MAP Surecleri", "https://make.powerautomate.com/environments/Default-2d253016-30a2-4f87-bc61-adf119e508c9/solutions/fd140aaf-4df4-11dd-bd17-0019b9312238/flows/57a7d2ed-5853-f011-877a-7c1e5251be63/details", "Fills MAP file", "KongreMAPV2"],
  ["Kongre", "Abbvie Notifications", "https://make.powerautomate.com/environments/Default-2d253016-30a2-4f87-bc61-adf119e508c9/flows/60dedc1f-b35c-f011-bec1-7c1e5251be63/details", "Sends Teams notifications on start/end/error. Runs in every process.", "Abbvie Notification Flow"],
  ["Kongre", "Abbvie Delete Old PWC Recs", "https://make.powerautomate.com/environments/Default-2d253016-30a2-4f87-bc61-adf119e508c9/flows/e7f89aac-89c7-1a0b-e369-94f1ae9bb3d5/details", "On reruns, deactivates old PWC records in SharePoint.", "DeleteOldPWCRecs"],

  ["UTT", "Abbvie Notifications", "", "General notifications", ""],
  ["UTT", "UTT MAP Surecleri", "https://make.powerautomate.com/environments/Default-2d253016-30a2-4f87-bc61-adf119e508c9/solutions/fd140aaf-4df4-11dd-bd17-0019b9312238/flows/c7adeb10-6b52-f011-877b-7c1e5251be63/details?utm_source=solution_explorer", "", "UTT_MAPV2"],
  ["UTT", "UTT PWC Surecleri", "https://make.powerautomate.com/environments/Default-2d253016-30a2-4f87-bc61-adf119e508c9/flows/58fe633e-8c52-f011-877b-7c1e5251be63/details", "", "UTT_PWCV2"],
  ["UTT", "UTT Deger Aktarimi", "https://make.powerautomate.com/environments/Default-2d253016-30a2-4f87-bc61-adf119e508c9/flows/71db6c60-555e-f011-bec2-6045bd90d2b3/details", "", "UTT_SharepointV2"],
  ["UTT", "GenerateGUID", "", "General GUID", ""],

  ["CTE", "Abbvie Notifications", "", "General notifications", ""],
  ["CTE", "Generate GUID", "", "General GUID", ""],
  ["CTE", "CTE PWC Surecleri", "https://make.powerautomate.com/environments/Default-2d253016-30a2-4f87-bc61-adf119e508c9/flows/bbf5d26b-af51-f011-877a-7c1e5251be63/details", "", "CTEPWCChild"],
  ["CTE", "Abbvie Delete Old PWC Recs", "", "", ""],
  ["CTE", "CTE Surecini Başlat", "https://make.powerautomate.com/environments/Default-2d253016-30a2-4f87-bc61-adf119e508c9/flows/59016f8c-af51-f011-877b-7c1e5251be63/details", "", ""],

  ["PSA", "PSA Sürecini Başlat", "https://make.powerautomate.com/environments/Default-2d253016-30a2-4f87-bc61-adf119e508c9/solutions/fd140aaf-4df4-11dd-bd17-0019b9312238/flows/c8619c74-c958-f011-bec1-7c1e5251be63/details", "", ""],
  ["PSA", "Abbvie Notifications", "", "General notifications", ""],
  ["PSA", "GenerateGUID", "", "General GUID", ""],
  ["PSA", "Abbvie Delete Old PWC Recs", "", "", ""],

  ["Bağış", "Bağış Sürecini Başlat", "https://make.powerautomate.com/environments/Default-2d253016-30a2-4f87-bc61-adf119e508c9/solutions/fd140aaf-4df4-11dd-bd17-0019b9312238/flows/1a4458b5-c758-f011-bec1-7c1e5251be63/details?utm_source=solution_explorer", "", ""],
  ["Bağış", "GenerateGUID", "", "General GUID", ""],
  ["Bağış", "Abbvie Notifications", "", "General notifications", ""],
];

export function rowsToGraph(rows) {
  const processes = new Set(rows.map((r) => r[0]));
  const flows = new Map();
  const links = [];
  rows.forEach(([proc, flowName, link, purpose, old]) => {
    if (!flows.has(flowName)) flows.set(flowName, { id: `flow:${flowName}`, type: "flow", name: flowName, link: link || "", purpose: purpose || "", oldName: old || "" });
    else {
      const f = flows.get(flowName);
      if (!f.link && link) f.link = link; if (!f.purpose && purpose) f.purpose = purpose; if (!f.oldName && old) f.oldName = old;
    }
    links.push({ source: `process:${proc}`, target: `flow:${flowName}` });
  });
  const nodes = [];
  processes.forEach((p) => nodes.push({ id: `process:${p}`, type: "process", name: p }));
  flows.forEach((v) => nodes.push(v));
  return { nodes, links };
}

export function buildFromPropsOrFallback(nodesData, linksData) {
  if (nodesData && linksData) return { nodes: nodesData, links: linksData };
  return rowsToGraph(RAW_ROWS);
}

// --------------- FILTERING ----------------
export function filterGraph(base, enabledMap, query) {
  const q = (query || "").trim().toLowerCase();
  const allowedProcIds = new Set(
    base.nodes.filter((n) => n.type === "process" && (enabledMap[n.name] ?? true)).map((n) => n.id)
  );

  const nodeSet = new Set();
  base.nodes.forEach((n) => {
    const matches = !q || (n.name || "").toLowerCase().includes(q);
    if (n.type === "process") {
      if (allowedProcIds.has(n.id) && matches) nodeSet.add(n.id);
    } else if (n.type === "flow") {
      const linked = base.links.some((l) => {
        const s = typeof l.source === "string" ? l.source : l.source.id || l.source;
        const t = typeof l.target === "string" ? l.target : l.target.id || l.target;
        return t === n.id && allowedProcIds.has(s);
      });
      if (linked && matches) nodeSet.add(n.id);
    }
  });

  const links = base.links.filter((l) => {
    const s = typeof l.source === "string" ? l.source : l.source.id || l.source;
    const t = typeof l.target === "string" ? l.target : l.target.id || l.target;
    return nodeSet.has(s) && nodeSet.has(t);
  });

  const nodes = base.nodes.filter((n) => nodeSet.has(n.id));
  return { nodes, links };
}
