# TZGRO 珠寶人生｜七章經營卡牌

2019 年、3 人、500 萬起步，經營彩色寶石公司走完七關（FB 粉專 → 直播 → 代理 → 短影音 → 電商 → 課程 → 併購上市）。純前端瀏覽器遊戲，存檔在本機瀏覽器。

完整玩法、七關目標、音樂與美術說明：[docs/GAME-GUIDE.md](docs/GAME-GUIDE.md)

## 本機開始玩

```bash
npm run dev          # 或 python3 launch.py／雙擊「啟動遊戲.command」
```

開 <http://127.0.0.1:8766/tzgro-card-tycoon.html>。3D 辦公室的 Three.js 走 CDN，需要網路。

## 目錄

| 路徑 | 內容 |
|---|---|
| `source/` | **唯一原始碼**：`engine.js`（規則引擎）、`ui.js`（畫面）、`index.html`（版型，內含 `/*ENGINE*/`、`/*UI*/` 兩個插入點）、`test.cjs` |
| `public/` | 上線與本機啟動的目錄。`tzgro-card-tycoon.html` 由 build 產生，不要手改 |
| `public/assets/` | 卡牌插圖（WebP）、背景音樂 |
| `scripts/` | `build.mjs` 合併單檔、`check-build.mjs` 檢查是否同步 |
| `docs/` | 遊戲說明、插圖提示詞、預覽截圖 |

## 修改流程

```bash
npm install          # 第一次
# 改 source/ 裡的檔案
npm run build        # 產生 public/tzgro-card-tycoon.html
npm test             # 引擎測試（含七關 120 週完整路徑）＋ build 同步檢查
```

## 部署（Cloudflare Workers）

`wrangler.jsonc` 已設定成純靜態資產 Worker（`public/` 整包），根網址轉到遊戲頁。

```bash
npm run deploy:dry   # 檢查
npm run deploy       # 正式上線（需登入 Cloudflare）
```

## 授權與素材

- 音樂：Fashion Lounge House by Music_For_Videos（Pixabay Content License）。曲目頁標註 Content ID Registered，公開上線或做成影片前請再確認。
- 插圖：AI 生成的虛構人物與場景，提示詞在 `docs/art-prompts.json`。原始 1254px PNG 已壓成 1000px WebP。
