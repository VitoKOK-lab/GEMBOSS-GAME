// 把 source/index.html 的 /*ENGINE*/、/*UI*/ 換成 engine.js、ui.js，輸出單檔遊戲頁。
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
export const OUT = root + 'public/tzgro-card-tycoon.html';
const read = f => readFileSync(root + 'source/' + f, 'utf8');

export function build() {
  const html = read('index.html');
  for (const mark of ['/*ENGINE*/', '/*UI*/'])
    if (html.split(mark).length !== 2) throw new Error(`source/index.html 必須剛好有一個 ${mark}`);
  // 用函式取代，避免程式碼裡的 $& 等字樣被當成取代語法
  return html.replace('/*ENGINE*/', () => read('engine.js')).replace('/*UI*/', () => read('ui.js'));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync(OUT, build());
  console.log('built', OUT);
}
