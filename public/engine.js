// TZGRO v3 數值原型：一局 2019-01 → 2025-12（84 個月），客群擴散＋能力樹＋對手＋現金跑道。
// 所有數字由這支檔案的規則與種子決定；UI 只負責顯示與點擊。
const V3 = (() => {
'use strict';
const MONTHS = 84, MONTH_MS = 20000; // 1x 速度：一個月 20 秒
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const copy = o => JSON.parse(JSON.stringify(o));
function rand(s) { s.seed = (Math.imul(1664525, s.seed) + 1013904223) >>> 0; return s.seed / 4294967296; }
const ym = t => `${2019 + Math.floor(t / 12)}-${String(t % 12 + 1).padStart(2, '0')}`;
const wan = n => Math.round(n / 10000).toLocaleString('zh-TW') + ' 萬';

// 市場：N＝會買彩色寶石的潛在客人。對手在所有地區都會成長，未開拓的地區也會被搶。
const REGIONS = [
  { id: 'north', name: '台灣北部', N: 8000 },
  { id: 'south', name: '台灣中南部', N: 7000, unlock: 'ecom' },
  { id: 'hk', name: '香港', N: 6000, unlock: 'agency', commission: .25 },
  { id: 'sg', name: '新加坡', N: 5000, unlock: 'overseas' },
  { id: 'jp', name: '日本', N: 12000, unlock: 'crossborder' },
];

// 能力樹：pts＝口碑點，cash＝現金，year＝最早可點年份。
const node = (id, branch, name, pts, cash, year, req, desc) => ({ id, branch, name, pts, cash, year, req, desc });
const NODES = [
  node('select', 'product', '精選主打', 3, 50000, 2019, [], '轉換率提高'),
  node('quality', 'product', '品質檢查制度', 5, 80000, 2019, ['select'], '熟客留存提高、品質事件損失變小'),
  node('premium', 'product', '精品線', 8, 300000, 2020, ['select'], '客單價 ×1.35，轉換率略降；對手較難模仿'),
  node('crystal', 'product', '水晶療癒線', 9, 400000, 2024, ['select'], '潛在客人 +30%，客單價 ×0.8，成本 +3%'),
  node('course', 'product', '線上知識課程', 9, 500000, 2024, ['premium'], '口碑擴散 ×1.2，熟客每月帶來課程收入'),
  node('fanpage', 'channel', '粉專經營', 0, 0, 2019, [], '開局即有：自然觸及'),
  node('live', 'channel', '直播', 6, 250000, 2020, ['fanpage'], '自然觸及 +，轉換率 ×1.1'),
  node('ecom', 'channel', '官網電商', 6, 200000, 2020, ['fanpage'], '開拓台灣中南部，廣告效率 ×1.2'),
  node('video', 'channel', '短影音', 8, 200000, 2022, ['fanpage'], '自然觸及大幅提高'),
  node('agency', 'channel', '香港代理', 8, 300000, 2021, ['fanpage'], '開拓香港；代理抽成 25%，會有代理風險事件'),
  node('overseas', 'channel', '海外電商', 9, 500000, 2023, ['ecom'], '開拓新加坡'),
  node('crossborder', 'channel', '日本跨境', 12, 800000, 2024, ['overseas'], '開拓日本（最大市場）'),
  node('process', 'org', '出貨流程', 3, 50000, 2019, [], '出貨產能 ×1.25'),
  node('contract', 'org', '授權與合約', 5, 80000, 2019, [], '合作與代理事件的損失減半'),
  node('warehouse', 'org', '倉儲外包', 6, 300000, 2021, ['process'], '出貨產能 ×1.5，營收 3% 倉儲費'),
  node('hr', 'org', 'HR 與培訓制度', 6, 150000, 2023, [], '超載扣士氣減半，新人免適應期'),
  node('finance', 'org', '財務治理', 9, 400000, 2024, ['contract'], '上市必要條件'),
  node('merger', 'org', '併購互補公司', 12, 50000000, 2025, ['finance'], '取得 1,500 位熟客與 300 單產能'),
  node('listing', 'org', '上市申請', 15, 10000000, 2025, ['finance'], '上市結局的必要條件'),
];
const byId = Object.fromEntries(NODES.map(n => [n.id, n]));
const BRANCH = { product: '商品', channel: '通路', org: '組織' };

const STARTS = {
  founder: { name: '標準創業', desc: '500 萬、3 人、口碑普通', cash: 5e6, brand: 65, staff: 3, paid: 0, wom: 1, perStaff: 22, cogs: 0, aov: 1, loyal: 0 },
  influencer: { name: '網紅起家', desc: '200 萬、口碑強、出貨弱', cash: 2e6, brand: 78, staff: 3, paid: 0, wom: 1.4, perStaff: 17, cogs: 0, aov: 1, loyal: 120 },
  oem: { name: '代工轉品牌', desc: '1,000 萬、5 人、產能強、品牌弱', cash: 1e7, brand: 45, staff: 5, paid: 2, wom: .85, perStaff: 26, cogs: -.05, aov: .85, loyal: 0 },
};
const DIFFICULTY = { easy: { name: '輕鬆', comp: .0004, bad: .3 }, normal: { name: '標準', comp: .0007, bad: .4 }, hard: { name: '困難', comp: .00085, bad: .5 } };

const SEATS = [3, 6, 12, 24, 40], RENT = [30000, 65000, 150000, 350000, 700000], EXPAND = [600000, 1500000, 4000000, 10000000], EXPAND_YEAR = [2019, 2020, 2022, 2024];
const ROOMS = ['起步工作室', '一樓擴編', '兩層辦公室', '整層總部', '總部大樓'];
const SALARY = 45000, AOV = 18000, ERA_GOALS = [15e6, 35e6, 70e6, 110e6, 160e6, 220e6, 300e6];
const NAMES = ['雅筑', '舒涵', '品妍', '思妤', '宛庭', '予安', '靜宜', '若瑜', '映潔', '詠晴', '芷萱', '采蓁'];

// 真實新聞的「遊戲推演」效果；mods 以月計。
const NEWS = [
  { t: 14, id: 'covid', title: 'WHO 宣布 COVID-19 全球大流行', fact: '2020-03-11，WHO 表示 COVID-19 可被描述為全球大流行。',
    choices: [
      { id: 'online', label: '加碼線上：本月追加 30 萬投放', cost: 300000, mods: { live: 1.7, conv: .9, adCost: .85 }, months: 15 },
      { id: 'hold', label: '保守觀望：現金不動', cost: 0, mods: { live: 1.4, conv: .85 }, months: 15 },
    ] },
  { t: 27, id: 'att', title: 'Apple App Tracking Transparency 上路', fact: '2021-04-26 起，iOS App 須徵求追蹤許可。',
    choices: [
      { id: 'own', label: '經營自有名單：熟客私訊與會員', cost: 100000, mods: { adCost: 1.35, wom: 1.1 }, months: 36 },
      { id: 'keep', label: '維持原投放策略', cost: 0, mods: { adCost: 1.6 }, months: 36 },
    ] },
  { t: 37, id: 'reels', title: 'Facebook Reels 擴展到 150 多國', fact: '2022-02-22，Meta 宣布 Reels 擴展至全球 150 多個國家。',
    choices: [
      { id: 'ride', label: '跟上：抽一人專做短影音（士氣 -5）', cost: 0, mods: { video: 1.6 }, months: 24, morale: -5 },
      { id: 'skip', label: '暫不跟進', cost: 0, mods: { video: 1.15 }, months: 24 },
    ] },
  { t: 38, id: 'fed', title: '美國聯準會開始升息', fact: '2022-03-16，聯準會上調聯邦基金利率 0.25 個百分點。',
    choices: [
      { id: 'value', label: '推入門款，守住轉換', cost: 0, mods: { conv: .95, aov: .9 }, months: 18 },
      { id: 'stay', label: '維持精品定位', cost: 0, mods: { conv: .85 }, months: 18 },
    ] },
  { t: 63, id: 'quake', title: '花蓮近海規模 7.2 強震', fact: '2024-04-03，中央氣象署記錄規模 7.2 地震。',
    choices: [
      { id: 'care', label: '主動通知客人出貨延遲', cost: 50000, mods: { capacity: .85 }, months: 2, brand: 2 },
      { id: 'quiet', label: '照常出貨不另通知', cost: 0, mods: { capacity: .85 }, months: 2, brand: -3 },
    ] },
];

function person(s, i, paid) {
  const r = () => 40 + Math.floor(rand(s) * 50);
  return { id: 'p' + s.hires++, name: i < 3 ? ['Regina', '怡安', '若晴'][i] : NAMES[Math.floor(rand(s) * NAMES.length)], skill: { product: r(), channel: r(), org: r() }, salary: paid ? SALARY : 0, adapt: 0 };
}

function create({ start = 'founder', difficulty = 'normal', seed = 20190101 } = {}) {
  const st = STARTS[start], s = {
    seed, start, difficulty, t: 0, cash: st.cash, brand: st.brand, morale: 78, points: 2, hires: 0,
    staff: [], leads: {}, office: 0, nodes: { fanpage: true }, adBudget: 0, shocks: [], queue: [], reveals: [],
    comp: { rate: .003, brand: 60 }, history: [], log: [], phase: 'running', ending: null, prevQ: 1, bubbles: 0,
    metrics: { minRunway: 99, overload: 0, adSpend: 0, adCustomers: 0, verified: 0, risky: 0, eventsRight: 0, events: 0, peakComp: 0, goals: [] },
  };
  for (let i = 0; i < st.staff; i++) s.staff.push(person(s, i, i >= st.staff - st.paid));
  s.staff[0].skill.product = 82;
  s.regions = REGIONS.map(r => ({ id: r.id, N: r.N, P: r.N, A: 0, C: 0, L: 0, K: r.N * .02 }));
  s.regions[0].L = st.loyal; s.regions[0].P -= st.loyal;
  s.leads = { product: s.staff[0].id, channel: s.staff[1].id, org: s.staff[2].id };
  s.queue.push({ type: 'era' }); s.phase = 'decide';
  return s;
}

const year = s => 2019 + Math.floor(Math.min(s.t, MONTHS - 1) / 12);
const has = (s, id) => !!s.nodes[id];
const isOpen = (s, r) => !REGIONS.find(x => x.id === r.id).unlock || has(s, REGIONS.find(x => x.id === r.id).unlock);
function mod(s, key) { return s.shocks.reduce((v, x) => v * (x.mods[key] || 1), 1); }
function leadMult(s, slot) {
  const p = s.staff.find(x => x.id === s.leads[slot]);
  if (!p) return .6;
  const slots = Object.values(s.leads).filter(id => id === p.id).length;
  return (.7 + p.skill[slot] / 100 * .6) * (slots > 1 ? .8 : 1) * (p.adapt ? .8 : 1) * (has(s, 'hr') ? 1.08 : 1);
}
function capacity(s) {
  const st = STARTS[s.start], moraleF = .6 + s.morale / 250;
  const people = s.staff.reduce((n, p) => n + (p.adapt ? .5 : 1), 0);
  return (people * st.perStaff * moraleF * (has(s, 'process') ? 1.25 : 1) * (has(s, 'warehouse') ? 1.5 : 1) * (.85 + .15 * leadMult(s, 'org')) + (has(s, 'merger') ? 300 : 0)) * mod(s, 'capacity');
}
function burn(s) { // 不含廣告的固定月支出
  return s.staff.reduce((n, p) => n + p.salary, 0) + RENT[s.office];
}
function runway(s) {
  const last = s.history.slice(-3), net = last.length ? last.reduce((n, h) => n + h.net, 0) / last.length : -burn(s);
  return net >= 0 ? 99 : clamp(s.cash / -net, 0, 99);
}
function available(s, id) {
  const n = byId[id];
  if (!n || has(s, id)) return false;
  return year(s) >= n.year && n.req.every(r => has(s, r));
}
function buy(s, id) {
  const n = byId[id];
  if (!available(s, id)) return '尚未開放';
  if (s.points < n.pts) return '口碑點不足';
  if (s.cash < n.cash) return '現金不足';
  s.points -= n.pts; s.cash -= n.cash; s.nodes[id] = true;
  if (id === 'crystal') for (const r of s.regions) { const add = r.N * .3; r.N += add; r.P += add; }
  if (id === 'merger') { s.regions[0].L += 1500; s.regions[0].P = Math.max(0, s.regions[0].P - 1500); for (let i = 0; i < 4; i++) if (s.staff.length < SEATS[s.office]) s.staff.push(person(s, 9, true)); }
  log(s, `完成「${n.name}」`);
  return '';
}
function hire(s) {
  if (s.staff.length >= SEATS[s.office]) return '座位已滿，請先擴張辦公室';
  const p = person(s, 9, true); p.adapt = has(s, 'hr') ? 0 : 1; s.staff.push(p);
  log(s, `錄用 ${p.name}`); return '';
}
function fire(s) {
  const p = [...s.staff].reverse().find(x => x.salary && !Object.values(s.leads).includes(x.id));
  if (!p) return '沒有可調整的同事';
  s.staff = s.staff.filter(x => x !== p); s.cash -= p.salary; s.morale = clamp(s.morale - 6, 15, 100);
  log(s, `${p.name} 離開公司（資遣一個月薪資）`); return '';
}
function expand(s) {
  if (s.office >= EXPAND.length) return '已是最大辦公室';
  if (year(s) < EXPAND_YEAR[s.office]) return `${EXPAND_YEAR[s.office]} 年才有合適空間`;
  const fee = EXPAND[s.office];
  if (s.cash < fee) return '現金不足';
  s.cash -= fee; s.office++; log(s, `辦公室擴張為「${ROOMS[s.office]}」`); return '';
}
function setAds(s, v) { s.adBudget = clamp(Math.round(v / 50000) * 50000, 0, 3e6); }
function assign(s, slot, id) { if (s.staff.some(p => p.id === id)) s.leads[slot] = id; }
function collect(s, n = 1) { s.points += n; }
function log(s, text) { s.log.unshift({ date: ym(s.t), text }); s.log = s.log.slice(0, 80); }

// 一般事件：正確選擇取決於當下狀態（產能、口碑、現金跑道）或是否查證。
function makeEvent(s) {
  const kinds = ['rush', 'supplier', 'promo', 'influencer'];
  if (s.staff.length > 3) kinds.push('poach');
  if (has(s, 'agency')) kinds.push('agency', 'agency');
  const type = kinds[Math.floor(rand(s) * kinds.length)], bad = rand(s) < DIFFICULTY[s.difficulty].bad;
  const E = {
    rush: { title: '熟客介紹企業禮品急單', text: '一筆 NT$30 萬的禮品訂單，三週內要全部交貨。', choices: [['accept', '全接'], ['split', '只接一半，分批交'], ['decline', '婉拒']] },
    supplier: { title: '供應商限時整批報價', text: '整批彩寶 NT$60 萬，報價比平常低 15%，今天要回覆。', choices: [['buy', '直接下單'], ['decline', '這次不買']], verify: true },
    promo: { title: '電商平台邀請參加大促', text: '平台保證曝光，條件是全館八折。', choices: [['join', '參加'], ['skip', '不參加']] },
    influencer: { title: '網紅業配邀約', text: '百萬粉絲網紅，業配費 NT$50 萬。', choices: [['sign', '簽約'], ['skip', '婉拒']] },
    poach: { title: '對手來挖角你的通路負責人', text: '對方開出月薪多 2 萬。', choices: [['raise', '加薪留人（每月 +2 萬）'], ['talk', '談成長計畫，不加薪'], ['let', '讓他走']] },
    agency: { title: '香港代理私下降價', text: '有客人反映代理商的售價比官網低兩成。', choices: [['end', '終止代理'], ['talk', '依合約協商'], ['ignore', '先不處理']] },
  }[type];
  return { type: 'event', kind: type, bad, verified: false, ...E };
}
function verify(s) {
  const e = s.queue[0];
  if (!e || !e.verify || e.verified) return '';
  if (s.points < 1) return '查證需要 1 點口碑點';
  s.points -= 1; e.verified = true; s.metrics.verified++;
  e.text += e.bad ? '\n查證結果：報價另收處理費，瑕疵不退換。' : '\n查證結果：條件與歷史交貨紀錄一致，可七日換貨。';
  return '';
}
const slack = s => { const h = s.history.at(-1); return h ? 1 - h.orders / Math.max(1, h.capacity) : .5; };
function reveal(s, title, result, principle, right) {
  s.metrics.events++; if (right) s.metrics.eventsRight++;
  s.reveals.push({ date: ym(s.t), title, result, principle });
  log(s, `${title}：${result}`);
}
function resolveEvent(s, e, c) {
  const sl = slack(s), lead = s.staff.find(p => p.id === s.leads.channel), half = has(s, 'contract') ? .5 : 1;
  const money = (gross, margin = .55) => { s.cash += gross * margin; s.bonusRevenue = (s.bonusRevenue || 0) + gross; };
  if (e.kind === 'rush') {
    if (c === 'decline') return reveal(s, e.title, '婉拒訂單，團隊照原計畫出貨。', '產能不夠時說不，比接了做壞更划算。', sl < .15);
    if (c === 'split') { money(150000); return reveal(s, e.title, '分批交付，客人接受。', '大單可以拆，交期和品質不能拆。', true); }
    if (sl >= .15) { money(300000); s.brand += 2; return reveal(s, e.title, '產能有餘裕，全數準時交貨，客人再介紹朋友。', '接單前先看產能餘裕，不是先看金額。', true); }
    money(300000, .2); s.brand -= 6; s.morale -= 8;
    return reveal(s, e.title, '產能不足，延遲交貨、加急運費吃掉利潤，團隊也累垮。', '接單前先看產能餘裕，不是先看金額。', false);
  }
  if (e.kind === 'supplier') {
    if (c === 'decline') return reveal(s, e.title, '保留現金，放棄這批貨。', e.verified ? '查證後再決定，放棄也是有根據的選擇。' : '低價背後的條件，要查證才知道。', e.bad);
    if (s.cash < 600000) return reveal(s, e.title, '現金不足，無法下單。', '採購前先確認現金能撐過交貨週期。', false);
    if (!e.verified) s.metrics.risky++;
    s.cash -= 600000;
    if (e.bad) { s.cash += 600000 * .6 * half; s.brand -= 6; return reveal(s, e.title, '到貨有瑕疵又不能退，品質客訴拉低口碑。', '低價背後的條件，要查證才知道。', false); }
    s.cash += 600000; s.shocks.push({ id: 'supplier', mods: { cogs: .85 }, left: 6, label: '低價貨源' });
    return reveal(s, e.title, '貨源順利到貨，未來半年成本降低。', e.verified ? '查證成本很小，避開的風險很大。' : '這次運氣好；沒查證的好結果不能複製。', e.verified);
  }
  if (e.kind === 'promo') {
    const tight = runway(s) < 4;
    if (c === 'skip') return reveal(s, e.title, '維持原價，口碑穩定。', '折扣買到的是這個月，不是熟客。', !tight);
    s.shocks.push({ id: 'promo', mods: { conv: 1.6, aov: .8 }, left: 1, label: '平台大促' }); s.brand -= 3;
    return reveal(s, e.title, '本月訂單衝高、單價下滑，部分熟客開始等折扣。', tight ? '現金告急時，用折扣換現金流是合理的止血。' : '折扣買到的是這個月，不是熟客。', tight);
  }
  if (e.kind === 'influencer') {
    if (c === 'skip') return reveal(s, e.title, '婉拒業配。', '曝光要接得住：口碑與產能先到位。', !(s.brand >= 60 && sl >= .2));
    if (s.cash < 500000) return reveal(s, e.title, '現金不足，無法簽約。', '行銷支出先確認現金跑道。', false);
    s.cash -= 500000; const ok = s.brand >= 60 && sl >= .2;
    for (const r of s.regions) if (isOpen(s, r)) { const add = r.P * (ok ? .05 : .03); r.P -= add; r.A += add; }
    if (!ok) { s.brand -= 4; s.shocks.push({ id: 'flop', mods: { capacity: .9 }, left: 1, label: '詢問爆量' }); }
    return reveal(s, e.title, ok ? '詢問量暴增，團隊接得住，轉單漂亮。' : '詢問湧入但回覆不及，留言區出現抱怨。', '曝光要接得住：口碑與產能先到位。', ok);
  }
  if (e.kind === 'poach') {
    const key = lead && lead.skill.channel >= 70;
    if (c === 'raise') { if (lead) lead.salary += 20000; return reveal(s, e.title, `${lead?.name || '負責人'}留下。`, key ? '關鍵人才的成本，要跟他帶來的成果一起算。' : '加薪要看貢獻，不是看對手開價。', key); }
    if (c === 'talk') {
      const stay = has(s, 'hr') || rand(s) < .5;
      if (!stay) { s.staff = s.staff.filter(p => p !== lead); s.leads.channel = null; s.morale -= 4; }
      return reveal(s, e.title, stay ? '談完成長路徑後決定留下。' : '還是離開了，通路負責人出缺。', '留人靠制度和成長空間，HR 制度讓這種談話有根據。', stay);
    }
    s.staff = s.staff.filter(p => p !== lead); s.leads.channel = null; s.morale -= 3;
    return reveal(s, e.title, '負責人離職，通路暫時無人主導。', key ? '放走關鍵人才前，先算出缺的代價。' : '貢獻普通的人離開，是調整的機會。', !key);
  }
  if (e.kind === 'agency') {
    const hk = s.regions.find(r => r.id === 'hk');
    if (c === 'end') { delete s.nodes.agency; hk.C *= .3; hk.L *= .5; return reveal(s, e.title, '終止代理，香港客人流失大半。', '有合約保障時，先用合約處理，不必砍掉通路。', !has(s, 'contract')); }
    if (c === 'talk') {
      if (has(s, 'contract')) return reveal(s, e.title, '依合約條款協商，代理恢復定價。', '合約不是形式，是出事時的工具。', true);
      s.cash -= 200000; s.brand -= 3; return reveal(s, e.title, '沒有書面條款，協商花了律師費，價格仍混亂。', '合約不是形式，是出事時的工具。', false);
    }
    s.brand -= 8 * half; s.cash -= 300000 * half;
    return reveal(s, e.title, '價格混亂擴大，官網客人轉向代理或對手。', '通路衝突放著不管，傷的是品牌。', false);
  }
}
function choose(s, c) {
  const e = s.queue[0];
  if (!e) return '';
  if (e.type === 'news') {
    const n = NEWS.find(x => x.id === e.id), opt = n.choices.find(x => x.id === c);
    if (!opt) return '請選擇方案';
    if (s.cash < opt.cost) return '現金不足';
    s.cash -= opt.cost; s.shocks.push({ id: n.id, mods: opt.mods, left: opt.months, label: n.title });
    if (opt.morale) s.morale = clamp(s.morale + opt.morale, 15, 100);
    if (opt.brand) s.brand = clamp(s.brand + opt.brand, 20, 100);
    log(s, `${n.title}：${opt.label}`);
  } else if (e.type === 'event') resolveEvent(s, e, c);
  s.brand = clamp(s.brand, 20, 100); s.morale = clamp(s.morale, 15, 100);
  s.queue.shift(); s.phase = s.queue.length ? 'decide' : 'running';
  if (s.cash < 0) end(s, 'bankrupt');
  return '';
}
function confirmEra(s) {
  if (s.queue[0]?.type !== 'era') return;
  s.queue.shift(); s.phase = s.queue.length ? 'decide' : 'running';
}

// 一個月的經營：觸及 → 詢問 → 成交 → 熟客，口碑帶來新客；對手同時搶潛在客人。
function step(s) {
  if (s.phase !== 'running') return null;
  const st = STARTS[s.start], ch = leadMult(s, 'channel'), pr = leadMult(s, 'product');
  const open = s.regions.filter(r => isOpen(s, r));
  const organic = (.004 + (has(s, 'live') ? .006 * mod(s, 'live') : 0) + (has(s, 'video') ? .008 * mod(s, 'video') * (s.t >= 36 ? 1 : .5) : 0)) * ch;
  const convBase = .1 * pr * (has(s, 'select') ? 1.15 : 1) * (has(s, 'premium') ? .9 : 1) * (has(s, 'live') ? 1.1 : 1) * mod(s, 'conv');
  const aov = AOV * st.aov * (has(s, 'premium') ? 1.35 : 1) * (has(s, 'crystal') ? .8 : 1) * mod(s, 'aov');
  const diff = 1 - .15 * ['premium', 'quality', 'course'].filter(id => has(s, id)).length;
  const openP = open.reduce((n, r) => n + r.P, 0), openN = open.reduce((n, r) => n + r.N, 0);
  const costPerAware = 260 * Math.pow(openN / Math.max(1, openP), .7) * mod(s, 'adCost') / (has(s, 'ecom') ? 1.2 : 1) / (.8 + .2 * ch);
  const adAware = s.adBudget / costPerAware, q = s.prevQ;
  let orders = 0, revenue = 0, newC = 0, adC = 0, wom = 0;
  s.comp.rate += DIFFICULTY[s.difficulty].comp; s.comp.brand = Math.min(85, s.comp.brand + .25);
  for (const r of s.regions) {
    const steal = r.P * Math.min(.12, s.comp.rate * (isOpen(s, r) ? diff : 1)), back = r.K * .03 * s.brand / s.comp.brand;
    r.P += back - steal; r.K += steal - back;
    if (!isOpen(s, r)) continue;
    const womRate = .35 * (r.L + .3 * r.C) / r.N * s.brand / 65 * st.wom * (has(s, 'course') ? 1.2 : 1) * mod(s, 'wom');
    const adShare = openP ? r.P / openP : 0;
    const fromAds = Math.min(r.P * .5, adAware * adShare), fromOrganic = r.P * Math.min(.3, organic + womRate);
    const newA = Math.min(r.P, fromAds + fromOrganic);
    r.P -= newA; r.A += newA;
    const conv = convBase * s.brand / 65 * q, c = r.A * conv;
    r.A -= c; r.C += c; newC += c; adC += fromAds / Math.max(1, newA) * c; wom += womRate * r.P;
    const decayA = r.A * .3; r.A -= decayA; r.P += decayA;
    const pressure = 1 + .3 * r.K / r.N;
    const toL = r.C * .08 * q * (has(s, 'quality') ? 1.25 : 1), churnC = r.C * .12 * pressure, churnL = r.L * .02 / Math.max(.4, q) * pressure;
    r.C += -toL - churnC; r.L += toL - churnL; r.P += churnC + churnL;
    const o = c + r.C * .08 + r.L * .2;
    orders += o; revenue += o * aov * (1 - (REGIONS.find(x => x.id === r.id).commission || 0));
  }
  const cap = capacity(s), fulfilled = Math.min(orders, cap * 1.1), quality = clamp(cap / Math.max(1, orders), .4, 1);
  revenue *= fulfilled / Math.max(1, orders);
  if (has(s, 'course')) revenue += s.regions.reduce((n, r) => n + r.L, 0) * 300;
  revenue += s.bonusRevenue || 0; s.bonusRevenue = 0;
  const cogs = revenue * (.38 + st.cogs + (has(s, 'crystal') ? .03 : 0)) * mod(s, 'cogs'), platform = revenue * (.06 + (has(s, 'warehouse') ? .03 : 0)), opex = revenue * .22;
  const fixed = burn(s), net = revenue - cogs - platform - opex - fixed - s.adBudget;
  s.cash += net;
  s.metrics.adSpend += s.adBudget; s.metrics.adCustomers += adC;
  // 口碑、士氣、適應
  s.brand = clamp(s.brand + (quality >= .95 ? .4 + (60 - s.brand) * .04 : -(1 - quality) * 10), 20, 100);
  const over = quality < .95;
  if (over) s.metrics.overload++;
  s.morale = clamp(s.morale + (over ? (has(s, 'hr') ? -2 : -4) : 2 + (75 - s.morale) * .05), 15, 100);
  for (const p of s.staff) p.adapt = 0;
  s.prevQ = quality;
  const loyal = s.regions.reduce((n, r) => n + r.L, 0), mine = s.regions.reduce((n, r) => n + r.C + r.L, 0), N = s.regions.reduce((n, r) => n + r.N, 0), K = s.regions.reduce((n, r) => n + r.K, 0);
  s.bubbles = newC >= 10 ? 1 + (newC >= 200 ? 1 : 0) : s.t % 2;
  const h = { t: s.t, date: ym(s.t), revenue, net, orders, capacity: cap, quality, newC, loyal, cash: s.cash, brand: s.brand, morale: s.morale, share: mine / N, comp: K / N, ads: s.adBudget, runway: 0 };
  s.history.push(h); h.runway = runway(s);
  s.metrics.minRunway = Math.min(s.metrics.minRunway, h.runway); s.metrics.peakComp = Math.max(s.metrics.peakComp, h.comp);
  for (const x of s.shocks) x.left--; s.shocks = s.shocks.filter(x => x.left > 0);
  s.t++;
  // 結局檢查
  if (s.cash < 0) { end(s, 'bankrupt'); return h; }
  if (h.comp >= .6) { end(s, 'defined'); return h; }
  if (s.t % 12 === 0) {
    const yr = s.history.slice(-12).reduce((n, x) => n + x.revenue, 0), g = ERA_GOALS[s.t / 12 - 1];
    s.metrics.goals.push({ year: 2018 + s.t / 12, revenue: yr, goal: g, hit: yr >= g });
    log(s, `${2018 + s.t / 12} 年營收 ${wan(yr)}／目標 ${wan(g)}${yr >= g ? '　達成' : ''}`);
    s.points += 2;
    if (s.t >= MONTHS) { end(s, finalEnding(s)); return h; }
    s.queue.push({ type: 'era' });
  }
  const news = NEWS.find(n => n.t === s.t);
  if (news) s.queue.push({ type: 'news', id: news.id, title: news.title, text: news.fact, choices: news.choices.map(c => [c.id, c.label]) });
  else if (s.t > 2 && rand(s) < .22) s.queue.push(makeEvent(s));
  if (s.queue.length) s.phase = 'decide';
  return h;
}
function finalEnding(s) {
  const y = s.history.slice(-12), rev = y.reduce((n, x) => n + x.revenue, 0), profit = y.reduce((n, x) => n + x.net, 0);
  if (has(s, 'listing') && rev >= 2.5e8 && profit > 0 && s.morale >= 45) return 'listed';
  if (rev >= 8e7) return 'regional';
  return 'boutique';
}
const ENDINGS = {
  listed: { title: '成功上市', text: '年營收突破 2.5 億、穩定獲利，治理到位。' },
  regional: { title: '區域品牌', text: '在亞洲站穩腳步，但還沒走到上市。' },
  boutique: { title: '小而美工作室', text: '活下來了，熟客喜歡你，規模停在工作室。' },
  bankrupt: { title: '現金燒完', text: '公司在成長途中耗盡現金。' },
  defined: { title: '品類被對手定義', text: '對手拿下六成市場，客人提到彩寶只想到它。' },
};
function end(s, kind) { s.phase = 'end'; s.ending = kind; s.queue = []; }

// 結局診斷：只列指標與原則，不評斷人。
function diagnose(s) {
  const m = s.metrics, h = s.history, out = [];
  const ltvMargin = .5, aov = h.length ? h.reduce((n, x) => n + x.revenue, 0) / Math.max(1, h.reduce((n, x) => n + x.orders, 0)) : AOV;
  const cac = m.adCustomers > 1 ? m.adSpend / m.adCustomers : 0, ltv = aov * ltvMargin * 2.4;
  out.push({ key: '現金跑道最低點', value: m.minRunway >= 99 ? '一直賺錢' : m.minRunway.toFixed(1) + ' 個月', ok: m.minRunway >= 4, principle: '成長期每次加碼前，先算還能撐幾個月；跑道低於 4 個月就沒有犯錯空間。' });
  out.push({ key: '廣告獲客成本 vs 客人價值', value: cac ? `CAC ${Math.round(cac).toLocaleString()}／LTV ${Math.round(ltv).toLocaleString()}` : '沒有投放廣告', ok: !cac || ltv / cac >= 3, principle: '一位客人帶來的毛利要是獲客成本的 3 倍以上，買流量才划算。' });
  out.push({ key: '產能超載月數', value: m.overload + ' 個月', ok: m.overload <= 6, principle: '訂單超過出貨產能，傷的不是這個月，是熟客回購與口碑。' });
  out.push({ key: '採購前查證', value: m.verified + ' 次查證／' + m.risky + ' 次沒查就下單', ok: m.risky === 0, principle: '低價條件要查證；沒查證的好結果不能複製。' });
  out.push({ key: '對手最高市占', value: Math.round(m.peakComp * 100) + '%', ok: m.peakComp < .45, principle: '晚開拓的市場會先被對手拿走；差異化（精品、品質、課程）讓對手難搶。' });
  out.push({ key: '年度目標', value: m.goals.filter(g => g.hit).length + '／' + m.goals.length + ' 年達成', ok: m.goals.filter(g => g.hit).length >= Math.ceil(m.goals.length / 2), principle: '每年的目標是檢查點：落後時先找瓶頸在觸及、轉換還是產能。' });
  out.push({ key: '事件判斷', value: m.eventsRight + '／' + m.events + ' 次符合當下情境', ok: !m.events || m.eventsRight / m.events >= .6, principle: '同一種事件沒有固定答案，看的是當下的產能、現金和查證結果。' });
  return out;
}
function view(s) {
  const h = s.history.at(-1) || { revenue: 0, net: 0, orders: 0, capacity: capacity(s), share: 0, comp: .02, runway: 99 };
  return { date: ym(Math.min(s.t, MONTHS - 1)), year: year(s), h, runway: runway(s), capacity: capacity(s), seats: SEATS[s.office], room: ROOMS[s.office], expandFee: EXPAND[s.office], expandYear: EXPAND_YEAR[s.office], goal: ERA_GOALS[Math.min(6, Math.floor(s.t / 12))], yearRevenue: s.history.filter(x => Math.floor(x.t / 12) === Math.floor(s.t / 12)).reduce((n, x) => n + x.revenue, 0) };
}
return { MONTHS, MONTH_MS, REGIONS, NODES, byId, BRANCH, STARTS, DIFFICULTY, ENDINGS, ERA_GOALS, ROOMS, SEATS, create, step, buy, hire, fire, expand, setAds, assign, collect, verify, choose, confirmEra, available, runway, capacity, diagnose, view, isOpen, has, ym, wan, copy };
})();
if (typeof module !== 'undefined') module.exports = V3;
