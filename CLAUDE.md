# TZGRO 珠寶人生（GEMBOSS-GAME）給 Claude 的工作規則

## 原始碼
- `source/` 是唯一原始碼。`public/tzgro-card-tycoon.html` 是 `npm run build` 產物，**不要手改**。
- 改完一律 `npm run build && npm test`；`npm test` 會擋下 build 沒同步的情況。
- 新插圖轉 WebP（長邊 1000px、quality 82）放 `public/assets/tzgro-cards/`，提示詞補進 `docs/art-prompts.json`。
- 玩法、數值、新功能變更同步更新 `docs/GAME-GUIDE.md`。

## Git
- 每個 session 用自己的分支（`claude/xxx`），main 只能靠 PR 合併，委託人回「合併」才合。
- 上 main 前：`git fetch origin main` → **merge**（不是 rebase）`origin/main` 進自己的分支 → 解衝突、`npm test`、`npm run deploy:dry` → 開 PR。
- **禁止** `git push --force`／`-f`／`--force-with-lease` 到 main；push 被拒就 merge 再推。
