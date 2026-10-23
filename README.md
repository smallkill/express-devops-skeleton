# express-devops-skeleton

## 用途

這是一個 Node.js / Express 最小可運行後端服務的範本（skeleton），用途是示範標準的 DevOps 工程實踐：分層架構（routes / controllers / services）、ESLint + Prettier 程式碼品質管控、Husky pre-commit hook、以及 GitHub Actions CI 自動化流程（lint → format → test → audit）。此 repo 本身不含任何業務邏輯，是一個可直接複製延伸的起始模板。

## 技術棧

| 項目     | 版本 / 說明                                  |
| -------- | -------------------------------------------- |
| Runtime  | Node.js >= 18                                |
| 框架     | Express 4.x                                  |
| 測試     | Jest 30 + Supertest 7                        |
| Lint     | ESLint 10（flat config）                     |
| 格式化   | Prettier 3                                   |
| Git hook | Husky 9 + lint-staged 16                     |
| CI       | GitHub Actions（`.github/workflows/ci.yml`） |

## 專案結構

```
index.js                  # 進入點：載入 app + config，啟動 HTTP server
app.js                    # Express app 組裝（middleware、router 掛載）
config/index.js           # 設定（PORT，預設 3000）
routes/
  health.js               # GET /health
  example.js              # GET /api/hello、GET /api/items
controllers/
  healthController.js     # 呼叫 healthService，回傳 JSON
  exampleController.js    # 呼叫 exampleService，回傳 JSON
services/
  healthService.js        # 回傳 { status: 'ok', timestamp }
  exampleService.js       # 回傳 hello message 與 hardcoded items 清單
.github/workflows/ci.yml  # lint → format → test → audit（Node 20 / 22 / 24）
.husky/pre-commit         # commit 前跑 format:check + lint + lint-staged
eslint.config.cjs         # ESLint flat config（含 prettier 整合）
.prettierrc               # Prettier 設定（single quote, 2 space, trailing comma）
```

## API 端點

| Method | Path                | 說明                                   |
| ------ | ------------------- | -------------------------------------- |
| GET    | `/health`           | 健康檢查，回傳 `{ status, timestamp }` |
| GET    | `/api/hello?name=X` | 回傳 `{ message: "Hello, X!" }`        |
| GET    | `/api/items`        | 回傳 hardcoded item 清單               |

## 如何執行

```bash
# 安裝依賴（需 Node.js >= 18）
npm install

# 啟動服務（預設 port 3000，可用環境變數覆蓋）
npm start
# 或
PORT=3000 npm start

# 執行測試（測試檔需放於 tests/**/*.test.js）
npm test

# Lint 檢查
npm run lint

# 格式化檢查
npm run format:check

# 自動修復 lint + format
npm run lint:fix
npm run format:fix
```

## CI 說明

`.github/workflows/ci.yml` 在 push 到 main 與每個 pull request 時，於 Node 20 / 22 / 24 依序執行：

1. `npm run lint` — ESLint 檢查
2. `npm run format:check` — Prettier 格式檢查
3. `npm test` — Jest 單元測試
4. `npm audit --omit=dev --audit-level=high` — 正式環境套件有 high 以上漏洞即失敗

不需要設定任何 secret；`GITHUB_TOKEN` 只給讀權限。Dependabot（`.github/dependabot.yml`）每週檢查 npm 套件與 Actions 更新。

## 狀態

**可跑（本地）**。`npm install && npm start` 即可啟動。

### 安全防護

- `helmet` 安全標頭、關閉 `X-Powered-By`
- `/api` 每 IP 速率限制（`express-rate-limit`）
- JSON body 上限 100kb；錯誤回應不外洩 stack trace

### 已知缺漏

- **無 `.env.example`**：環境變數 `PORT`（預設 3000）、`TRUST_PROXY`（在反向代理後面才設，例如 `1`）、`RATE_LIMIT_PER_MINUTE`（`/api` 每 IP 每分鐘上限，預設 100）沒有範本文件。
- **services 皆為 hardcoded stub**：`exampleService` 回傳靜態資料，不連接任何資料庫或外部服務。
