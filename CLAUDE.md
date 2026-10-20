# TZGRO 珠寶人生（GEMBOSS-GAME）給 Claude 的工作規則

## 程式
- 遊戲就是 `public/index.html`（畫面、教學）＋ `public/engine.js`（規則）。舊版七章遊戲已下架（委託人 2026-10-20），`docs/legacy/` 只留作參考，不要接回。
- 規則與數值只放在 `engine.js`，結果由規則與種子決定；畫面不做計算。
- 改完一律 `npm test`。測試鎖住玩法承諾（不作為會輸、猛衝會破產、平衡打法能上市、逐年成長、事件依情境）；失敗時修數值，不改測試。
- 新玩法、新數值、新教學步驟要同步更新 `docs/GAME-GUIDE.md` 與 `docs/V3-DESIGN.md`。
- 新插圖轉 WebP（長邊 1000px、quality 82）放 `public/assets/tzgro-cards/`，提示詞補進 `docs/art-prompts.json`。

## Git
- 每個 session 用自己的分支（`claude/xxx`），main 只能靠 PR 合併，委託人回「合併」才合。
- 上 main 前：`git fetch origin main` → **merge**（不是 rebase）`origin/main` 進自己的分支 → 解衝突、`npm test`、`npm run deploy:dry` → 開 PR。
- **禁止** `git push --force`／`-f`／`--force-with-lease` 到 main；push 被拒就 merge 再推。

## 部署
- 合併進 main 後 GitHub Actions 自動部署 `public/` 到 Pages。Pages 的 Source 必須維持「GitHub Actions」。
