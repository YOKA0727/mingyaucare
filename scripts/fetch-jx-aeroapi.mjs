// 從 FlightAware AeroAPI 抓星宇航空（ICAO：SJX）近三天的所有航班，存成 starlux/data/jx-flights.json 給 App 讀。
// 由 GitHub Actions 執行；API Key 放在 GitHub Secrets（AEROAPI_KEY），不會出現在網頁或程式碼裡。
//
// 用到的查詢（依 AeroAPI 4.30 規格；價格依官網，可能變動）：
//   GET /operators/SJX/flights/scheduled  即將出發（含近期取消）   $0.005／結果集（15 筆）
//   GET /operators/SJX/flights/enroute    飛行中                   $0.005／結果集
//   GET /operators/SJX/flights/arrivals   已抵達                   $0.005／結果集
// 個人方案限制：每分鐘 10 個結果集 → 每頁之間等 6.5 秒。
//
// 環境變數：
//   AEROAPI_KEY   必填
//   MAX_PAGES     全部查詢合計最多抓幾頁（預設 60，約 $0.30），超過就停，避免意外花費
//   OUT           輸出路徑（預設 starlux/data/jx-flights.json）
//   MOCK_DIR      測試用：從本機資料夾讀假回應，不連網

import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const BASE = 'https://aeroapi.flightaware.com/aeroapi';
const KEY = process.env.AEROAPI_KEY;
const MAX_PAGES = Number(process.env.MAX_PAGES || 60);
const OUT = process.env.OUT || 'starlux/data/jx-flights.json';
const MOCK_DIR = process.env.MOCK_DIR;
const PRICE_PER_SET = 0.005;
const sleep = ms => new Promise(r => setTimeout(r, ms));

if (!KEY && !MOCK_DIR) { console.error('缺少 AEROAPI_KEY'); process.exit(1); }

const now = Date.now();
const iso = ms => new Date(ms).toISOString().replace(/\.\d{3}Z$/, 'Z');
// 規格限制：start／end 不能早於 10 天前、不能晚於 2 天後
const win = { start: iso(now - 30 * 3600e3), end: iso(now + 47 * 3600e3) };

let pagesUsed = 0;
const perEndpoint = {};

async function getPage(pathAndQuery, label, pageNo) {
  if (MOCK_DIR) {
    const f = `${MOCK_DIR}/${label}-${pageNo}.json`;
    try { return JSON.parse(await readFile(f, 'utf8')); } catch { return { links: null }; }
  }
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(BASE + pathAndQuery, { headers: { 'x-apikey': KEY, accept: 'application/json' } });
    if (res.status === 429) { console.log('達到速率上限，等 60 秒'); await sleep(60e3); continue; }
    if (!res.ok) throw new Error(`${label} HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    return res.json();
  }
  throw new Error(`${label} 一直被限速，放棄`);
}

async function collect(label, firstPath) {
  const out = [];
  let path = firstPath, pageNo = 1;
  while (path) {
    if (pagesUsed >= MAX_PAGES) { console.log(`已達 MAX_PAGES=${MAX_PAGES}，停止抓取（${label}）`); break; }
    if (pagesUsed > 0 && !MOCK_DIR) await sleep(6500);
    const data = await getPage(path, label, pageNo);
    pagesUsed++; perEndpoint[label] = (perEndpoint[label] || 0) + 1;
    out.push(...(data[label] || []));
    const next = data.links && data.links.next;
    path = next ? (next.startsWith('http') ? next.replace(BASE, '') : next) : null;
    pageNo++;
  }
  return out;
}

const q = s => new URLSearchParams(s).toString();
const scheduled = await collect('scheduled', `/operators/SJX/flights/scheduled?${q({ start: win.start, end: win.end, max_pages: 1 })}`);
const enroute = await collect('enroute', `/operators/SJX/flights/enroute?${q({ max_pages: 1 })}`);
const arrivals = await collect('arrivals', `/operators/SJX/flights/arrivals?${q({ start: win.start, end: iso(now), max_pages: 1 })}`);

// 同一班可能同時出現在多個清單：以「已抵達 > 飛行中 > 排定」的最新狀態為準
const byId = new Map();
for (const f of [...scheduled, ...enroute, ...arrivals]) byId.set(f.fa_flight_id || `${f.ident}-${f.scheduled_out}`, f);

const pick = a => a ? { code: a.code_iata || a.code || null, tz: a.timezone || null } : { code: null, tz: null };
const flights = [...byId.values()].map(f => {
  const o = pick(f.origin), d = pick(f.destination);
  return {
    id: f.fa_flight_id || null,
    ident: f.ident_iata || f.ident || null,        // 例：JX800
    from: o.code, fromTz: o.tz, to: d.code, toTz: d.tz,
    sched_out: f.scheduled_out || f.scheduled_off || null,
    est_out: f.estimated_out || f.estimated_off || null,
    act_out: f.actual_out || f.actual_off || null,
    sched_in: f.scheduled_in || f.scheduled_on || null,
    est_in: f.estimated_in || f.estimated_on || null,
    act_in: f.actual_in || f.actual_on || null,
    dep_delay: f.departure_delay ?? null,            // 秒
    arr_delay: f.arrival_delay ?? null,              // 秒
    status: f.status || null,
    cancelled: !!f.cancelled,
    term_from: f.terminal_origin || null, term_to: f.terminal_destination || null,
    gate_from: f.gate_origin || null, gate_to: f.gate_destination || null,
    baggage: f.baggage_claim || null,
    aircraft: f.aircraft_type || null,
  };
}).filter(f => f.ident && f.from && f.to && f.sched_out)
  .sort((a, b) => a.sched_out.localeCompare(b.sched_out));

const result = {
  generatedAt: iso(now),
  source: 'FlightAware AeroAPI',
  windowStart: win.start, windowEnd: win.end,
  pages: pagesUsed, perEndpoint,
  estCostUSD: +(pagesUsed * PRICE_PER_SET).toFixed(3),
  flights,
};
await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(result));
console.log(`完成：${flights.length} 班（排定 ${scheduled.length}、飛行中 ${enroute.length}、已抵達 ${arrivals.length}），共 ${pagesUsed} 頁，估計費用 US$${result.estCostUSD}`);
console.log('各查詢頁數：', JSON.stringify(perEndpoint));
