# 貓咪咖啡廳大混亂！Cat Café Chaos!

一款手機直式優先的 H5 休閒小遊戲。你是貓咪咖啡廳的店員，要在 **90 秒** 內依照任性貓咪客人的訂單，按正確順序點擊食材做出飲料與甜點。

- React 18 + Vite + JavaScript（無 TypeScript、無遊戲引擎）
- 貓咪、店內背景與 Logo 為手繪風插畫（WebP），食材、餐點與 UI 圖示為原創 SVG
- 音效以 Web Audio API 即時合成，不需要音檔
- 最高分與音效設定存在 localStorage
- 可直接部署到 GitHub Pages

## 快速開始

```bash
npm install
npm run dev        # 開發伺服器
npm test           # 執行自動化測試（Vitest）
npm run build      # 產生 dist/
npm run preview    # 預覽建置結果
```

開發模式下網址加上 `?gallery`（例如 `http://localhost:5173/?gallery`）可以檢視所有貓咪表情、食材與餐點插畫。

## 玩法

1. 點選上方的貓咪訂單（最多同時 3 張），訂單會標示「製作中」。
2. 依照步驟順序點擊下方食材按鈕。切換訂單時，各訂單的進度都會保留。
3. 步驟完成後按「完成餐點！出餐」。
4. 放錯材料扣 10 分且該訂單進度歸零；貓咪耐心歸零會生氣離開並扣 30 分。

| 餐點 | 步驟 | 基礎分數 |
|---|---|---|
| 美式咖啡 | 咖啡 → 熱水 | 100 |
| 拿鐵 | 咖啡 → 牛奶 | 120 |
| 草莓牛奶 | 牛奶 → 草莓 | 120 |
| 貓掌鬆餅 | 麵糊 → 烘烤 → 蜂蜜 | 180 |
| 草莓蛋糕 | 蛋糕 → 鮮奶油 → 草莓 | 180 |

**計分**：基礎分數；耐心 ≥ 70% 額外 +30；每連續完成 3 張 Combo +50（超時會中斷連擊）；招財貓期間基礎分數 ×2；總分最低 0。

**隨機事件**（31 秒後開始，同時只會有一個，事件之間有 8 秒冷卻）：

- **奧客改單**：三花貓換成另一道餐點，進度歸零，同一張訂單最多改一次（補回 15% 耐心）。
- **貓咪打翻牛奶**：按「擦乾淨」3 下前不能製作或出餐。
- **幸運招財貓**：接下來 10 秒出餐基礎分數加倍。

**階段**：0–30 秒新手適應（只有兩步驟餐點）→ 31–60 秒開始忙碌（三步驟甜點、事件）→ 61–90 秒尖峰時段（生成更快、耐心下降 1.3 倍、事件更頻繁）。

**稱號**：0 咖啡廳見習生 / 500 貓咪服務員 / 1200 人氣咖啡師 / 2000 貓咪店長 / 3000 傳說中的貓奴店長。

## 專案結構

```
src/
  components/
    StartScreen.jsx      開始畫面
    GameScreen.jsx       遊戲主畫面（組合各區塊、效果→音效、暫停/結束覆蓋層）
    GameHud.jsx          頂部時間/分數/Combo
    OrderBoard.jsx       三個固定座位 + 背景 + 浮動加分
    OrderCard.jsx        單張訂單（貓咪、餐點、步驟、耐心條）
    CookingStation.jsx   製作區（步驟、食材格、出餐、打翻牛奶）
    IngredientButton.jsx 食材按鈕（星星與錯誤抖動特效）
    EventNotification.jsx 事件狀態列與大型提示
    ResultScreen.jsx     結算畫面
    CatCharacter.jsx     貓咪插畫（4 花色 × 4 表情，讀取 assets/cats/*.webp）
    ArtGallery.jsx       開發用素材總覽（?gallery）
    art/                 食材、餐點、招財貓等 SVG；背景與 Logo 圖片元件
  hooks/
    useGameEngine.js     rAF 迴圈、失焦暫停、把純函式包成 React 狀態
    useAudio.js          Web Audio 音效
  data/
    recipes.js  cats.js  events.js
  utils/
    gameConfig.js        ★ 所有難度、計分、事件機率參數
    gameLogic.js         純函式遊戲邏輯（可單獨測試）
    storage.js           localStorage 包裝
  styles/
    global.css  animations.css
  assets/                遊戲實際使用的 WebP（由腳本產生）
  art-source/            原始 PNG 插畫（不會打包進遊戲）
scripts/
  build-art.py           把 art-source 的 PNG 裁切、壓縮成 assets 的 WebP
tests/
  gameLogic.test.js      食譜判定、計分、超時、事件、重設、整局模擬
  storage.test.js        最高分儲存
```

### 設計重點

- **純函式核心**：`gameLogic.js` 的 `tick / addIngredient / serveOrder / cleanSpill …` 都是「舊 state → 新 state」，不碰 DOM，因此能用 Vitest 直接驗證；React 端只負責畫面。
- **與 FPS 無關**：每個影格依 `performance.now()` 的實際經過時間推進，dt 有上限避免卡頓後瞬移；部分 WebView 節流 rAF 時由計時器補影格。
- **Strict Mode 安全**：計時迴圈放在 `useEffect` 中並在 cleanup 取消，重複掛載不會產生兩個計時器。
- **同步的提示**：事件提示、訊息、浮動分數的消失時間都以「遊戲時間」記錄，暫停時一起凍結；CSS 動畫也會在暫停時 `animation-play-state: paused`。
- **重新開始**：每局用新的 `key` 重新掛載 `GameScreen`，狀態從 `createInitialState()` 全新建立。
- **調整平衡**：只要改 `src/utils/gameConfig.js`（階段、生成間隔、耐心倍率、事件機率、計分）與 `src/data/*.js`（食譜、貓咪耐心與偏好、事件權重）。

### 手機體驗

- 參考尺寸 390×844，支援 320px 寬；桌機容器最大 480px。
- 所有按鈕 ≥ 44×44px，食材按鈕同時有圖示與文字。
- 支援 iPhone Safe Area、禁止縮放與長按選單、`touch-action: manipulation`。
- 視窗失焦或切換分頁自動暫停，回來後按「繼續營業」。
- 支援 `prefers-reduced-motion`。
- 音效預設關閉，需使用者點擊開啟（符合瀏覽器自動播放限制）。

## 部署到 GitHub Pages

`vite.config.js` 使用 `base: './'`，建置結果可放在任何子路徑。

**CI（自動檢查）**：每次 push 或開 PR，`.github/workflows/ci.yml` 會自動跑測試與建置，只檢查、不部署。

**發布（手動）**：網站更新時機由自己決定，用 gh-pages 分支發布。

```bash
npm run deploy
```

`predeploy` 會先跑 `npm test` 與 `npm run build`，通過後才把 `dist/` 推到 `gh-pages` 分支。

第一次設定：到 repo 的 **Settings → Pages → Build and deployment → Source** 選 **Deploy from a branch**，分支選 `gh-pages`、資料夾選 `/ (root)`。網址為 `https://chia-zz.github.io/cat-cafe-chaos/`。

## 平台串接預留

- **Android 套件名稱**：`com.testzzz.catcafechaos`（之後用 Capacitor 打包時使用；上傳過一次就不能再改）。
- **玩家顯示區**：開始畫面右上角、暫停視窗會顯示目前玩家，預設為「訪客」。所有畫面都從 `src/utils/player.js` 讀取。
  - 測試：網址加上 `?player=名字`，例如 `http://localhost:5173/?player=Tester`。
  - 串接平台：SDK 取得身分後呼叫 `setPlayer({ name })`，畫面會自動更新。
- 畫面切換只用 React state，不使用 `history.pushState`；目前也沒有設定 CSP，之後若要加，`connect-src` 需允許平台 API 網域。

## 美術說明

- 貓咪 16 張（4 花色 × 4 表情）、咖啡廳背景與 Logo 放在 `src/art-source/`，執行 `python scripts/build-art.py`（需要 Pillow）會輸出到 `src/assets/`。
- 16 張貓咪使用同一個裁切框，換表情時位置不會跳動；更換插畫時請維持相同構圖與畫布大小，再重新執行腳本。
- 待機動畫改為整張插畫以腳底為支點：平常呼吸、開心彈跳、不耐煩加快、生氣發抖。
- 食材、餐點、招財貓與 UI 圖示仍為原創 SVG，未使用 Emoji。
