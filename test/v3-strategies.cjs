// v3 原型的模擬玩家：用來驗證「有策略會起飛、亂衝會出事、不作為會被追上」。
const V3 = require('../public/prototype/v3/engine.js');

const PRIORITY = ['select', 'process', 'contract', 'quality', 'live', 'ecom', 'premium', 'agency', 'warehouse', 'video', 'overseas', 'hr', 'crossborder', 'finance', 'listing', 'course', 'crystal', 'merger'];

// 每個策略回傳一個 decide(s) 函式，在每個月開始前與每個決策點呼叫。
const strategies = {
  // 不點能力、不投放、不招人、事件一律保守
  passive: () => ({
    month() {},
    event(s, e) { V3.choose(s, e.choices.at(-1)[0]); },
  }),
  // 會看產能、跑道、查證的經營者
  balanced: () => ({
    month(s) {
      const v = V3.view(s), h = s.history.at(-1);
      // 2024 起為上市申請保留口碑點，不把點數全花在新商品線
      const reserve = id => !V3.has(s, 'listing') && s.t >= 60 && !['finance', 'listing'].includes(id) ? V3.byId.listing.pts + (V3.has(s, 'finance') ? 0 : V3.byId.finance.pts) : 0;
      for (const id of PRIORITY) if (V3.available(s, id) && s.points - reserve(id) >= V3.byId[id].pts && s.cash - V3.byId[id].cash > 1.5e6) V3.buy(s, id);
      if (h && h.orders > h.capacity * .85) {
        if (s.staff.length >= v.seats && v.expandFee && s.cash > v.expandFee * 2) V3.expand(s);
        if (s.staff.length < V3.view(s).seats && V3.runway(s) > 6) V3.hire(s);
      }
      const slackOk = !h || h.orders < h.capacity * .9;
      V3.setAds(s, slackOk && V3.runway(s) > 6 ? Math.min(s.cash * .06, 2.5e6) : 0);
      V3.collect(s, Math.round(s.bubbles * .8));
    },
    event(s, e) {
      if (e.type === 'news') return V3.choose(s, e.choices[0][0]);
      const h = s.history.at(-1), slack = h ? 1 - h.orders / h.capacity : .5;
      const pick = {
        rush: slack >= .15 ? 'accept' : 'split',
        supplier: (V3.verify(s), e.bad ? 'decline' : 'buy'),
        promo: V3.runway(s) < 4 ? 'join' : 'skip',
        influencer: s.brand >= 60 && slack >= .2 && s.cash > 2e6 ? 'sign' : 'skip',
        poach: 'raise',
        agency: V3.has(s, 'contract') ? 'talk' : 'end',
      }[e.kind];
      V3.choose(s, pick);
    },
  }),
  // 只看營收：猛投廣告、什麼單都接、不顧產能
  blitz: () => ({
    month(s) {
      for (const id of ['live', 'ecom', 'video', 'agency', 'overseas', 'crossborder', 'select']) if (V3.available(s, id) && s.points >= V3.byId[id].pts && s.cash > V3.byId[id].cash) V3.buy(s, id);
      V3.setAds(s, 1.5e6);
      V3.collect(s, s.bubbles);
    },
    event(s, e) { V3.choose(s, e.choices[0][0]); },
  }),
};

function play(name, opts) {
  const s = V3.create(opts), p = strategies[name]();
  let guard = 0;
  while (s.phase !== 'end' && guard++ < 500) {
    if (s.phase === 'decide') {
      const e = s.queue[0];
      if (e.type === 'era') V3.confirmEra(s); else p.event(s, e);
      continue;
    }
    p.month(s);
    V3.step(s);
  }
  return s;
}

function takeoff(s) { // 第一次「月營收比半年前翻倍」的時間點
  const h = s.history;
  for (let i = 6; i < h.length; i++) if (h[i].revenue > 2 * h[i - 6].revenue && h[i].revenue > 1e6) return h[i].date;
  return '—';
}

module.exports = { strategies, play, takeoff };

if (require.main === module) {
  for (const start of Object.keys(V3.STARTS)) for (const name of Object.keys(strategies)) {
    const rows = [1, 2, 3, 4, 5].map(seed => play(name, { start, seed: seed * 7919 }));
    const endings = rows.map(s => s.ending), last = rows[0].history;
    const yr = s => s.history.slice(-12).reduce((n, x) => n + x.revenue, 0);
    console.log(start.padEnd(10), name.padEnd(9), endings.join(','), '| 月數', rows.map(s => s.t).join(','), '| 最後一年營收', rows.map(s => Math.round(yr(s) / 1e6) + 'M').join(','), '| 起飛', takeoff(rows[0]), '| 對手', Math.round(last.at(-1).comp * 100) + '%', '| 超載', rows[0].metrics.overload);
  }
}
