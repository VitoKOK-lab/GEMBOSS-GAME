// public/ 的遊戲頁必須跟 source/ 一致；不一致代表改了 source 沒跑 npm run build。
import { readFileSync } from 'node:fs';
import { build, OUT } from './build.mjs';

if (readFileSync(OUT, 'utf8') !== build()) {
  console.error('public/tzgro-card-tycoon.html 與 source/ 不同步，請執行 npm run build');
  process.exit(1);
}
console.log('Bundle in sync with source/: PASS');
