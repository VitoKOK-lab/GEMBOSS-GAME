// v3 原型的行為測試：數值調整後，這些「玩法承諾」必須仍然成立。
const assert = require('node:assert/strict');
const V3 = require('../public/prototype/v3/engine.js');
const { play } = require('./v3-strategies.cjs');
const seeds = [7919, 15838, 23757];

// 1. 同一個種子、同一組決策，結果完全相同
assert.deepEqual(play('balanced', { seed: 42 }).history, play('balanced', { seed: 42 }).history);

// 2. 不作為會在 2025 年底前被對手定義品類；猛投廣告、不顧產能會破產
for (const seed of seeds) {
  const passive = play('passive', { seed });
  assert.equal(passive.ending, 'defined');
  assert(passive.t < V3.MONTHS, '不作為不應撐完七年');
  assert.equal(play('blitz', { seed }).ending, 'bankrupt');
}

// 3. 會看產能、跑道、查證的打法，標準難度下兩種開局能上市，網紅開局至少成為區域品牌
for (const seed of seeds) {
  assert.equal(play('balanced', { seed }).ending, 'listed');
  assert.equal(play('balanced', { seed, start: 'oem' }).ending, 'listed');
  assert(['listed', 'regional'].includes(play('balanced', { seed, start: 'influencer' }).ending));
}

// 4. 成長曲線逐年上升（起飛感），不是早早碰頂
const g = play('balanced', { seed: 7919 }).metrics.goals.map(x => x.revenue);
for (let i = 1; i < g.length; i++) assert(g[i] > g[i - 1], `第 ${i + 1} 年營收應高於前一年`);

// 5. 同一種事件沒有固定答案：急單在有餘裕時全接最好，超載時全接會傷口碑
function rushOutcome(overloaded) {
  const s = V3.create({ seed: 1 }); V3.confirmEra(s); V3.step(s);
  s.queue = []; s.phase = 'running';
  const h = s.history.at(-1); h.capacity = 100; h.orders = overloaded ? 100 : 50;
  s.queue.push({ type: 'event', kind: 'rush', bad: false, choices: [] }); s.phase = 'decide';
  const brand = s.brand; V3.choose(s, 'accept');
  return s.brand - brand;
}
assert(rushOutcome(false) > 0 && rushOutcome(true) < 0, '急單的好壞要取決於產能餘裕');

// 6. 查證會揭露供應商條件，並計入診斷
{
  const s = V3.create({ seed: 3 }); V3.confirmEra(s);
  s.queue.push({ type: 'event', kind: 'supplier', bad: true, verify: true, verified: false, text: '', choices: [] }); s.phase = 'decide';
  V3.verify(s);
  assert.match(s.queue[0].text, /瑕疵不退換/);
  assert.equal(s.metrics.verified, 1);
}

// 7. 辦公室依年代開放，能力樹依前置條件開放
{
  const s = V3.create({ seed: 5 }); s.cash = 1e8;
  assert.equal(V3.expand(s), '');
  assert.match(V3.expand(s), /2020 年/);
  assert.equal(V3.available(s, 'overseas'), false);
}

// 8. 結局診斷涵蓋現金、獲客、產能、查證、對手、目標、事件七項
assert.equal(V3.diagnose(play('balanced', { seed: 7919 })).length, 7);

console.log('v3 prototype: determinism, endings by play style, yearly growth, contextual events, verification, unlocks, diagnosis: PASS');
