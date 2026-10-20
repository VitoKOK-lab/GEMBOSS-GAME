# TZGRO 珠寶人生

彩色寶石公司的經營養成遊戲：客人像口碑一樣擴散、對手同步搶市場、現金跑道倒數。一局從 2019 年經營到 2025 年底，約 30–45 分鐘，給主管培訓用。

- 線上：<https://vitokok-lab.github.io/GEMBOSS-GAME/>
- 玩法：[docs/GAME-GUIDE.md](docs/GAME-GUIDE.md)　設計與模擬驗證：[docs/V3-DESIGN.md](docs/V3-DESIGN.md)

## 本機開始玩

```bash
npm run dev          # 或 python3 launch.py／雙擊「啟動遊戲.command」
```

開 <http://127.0.0.1:8766/>。

## 目錄

| 路徑 | 內容 |
|---|---|
| `public/engine.js` | 規則引擎：擴散、對手、現金、能力樹、事件、結局診斷。結果只由規則與種子決定 |
| `public/index.html` | 畫面、新手教學、玩法卡 |
| `public/office/` | 3D 辦公室場景（舊版沿用，換皮階段改成粉彩房間＋Q 版角色）；`preview.html` 可單獨預覽 |
| `public/assets/` | 卡牌插圖（WebP）、背景音樂（換皮階段接上） |
| `test/` | `v3-engine.test.cjs` 行為測試；`v3-strategies.cjs` 三種模擬玩家（`npm run sim`） |
| `docs/legacy/` | 已下架的舊版七章遊戲：規則引擎（新聞與事件文案參考）、說明、截圖 |

## 修改流程

```bash
# 改 public/engine.js 或 public/index.html
npm test             # 行為測試：各打法結局、逐年成長、事件依情境、查證、解鎖
npm run sim          # 看三種打法的結局與年營收
```

數值調整後若 `npm test` 失敗，代表玩法承諾被破壞（例如不作為也能贏），要先修數值，不改測試。

## 部署

**GitHub Pages（目前使用）**：PR 合併進 `main` 後，`.github/workflows/pages.yml` 先跑 `npm test`，通過才把 `public/` 部署上線；PR 本身只跑測試。
repo 的 Settings → Pages → Source 必須是「GitHub Actions」，改成「Deploy from a branch」會讓首頁變成 README。

**Cloudflare Workers（備用）**：`wrangler.jsonc` 已設定成純靜態資產 Worker，`npm run deploy:dry` 檢查、`npm run deploy` 上線。

## 授權與素材

- 音樂：Fashion Lounge House by Music_For_Videos（Pixabay Content License）。曲目頁標註 Content ID Registered，公開上線或做成影片前請再確認。
- 插圖：AI 生成的虛構人物與場景，提示詞在 `docs/art-prompts.json`。
