# express-devops-skeleton

## 用途

這是一個 Node.js / Express 最小可運行後端服務的範本（skeleton），用途是示範標準的 DevOps 工程實踐：分層架構（routes / controllers / services）、ESLint + Prettier 程式碼品質管控、Husky pre-commit hook、以及 GitLab CI/CD 自動化流程（lint → format → test → auto create MR）。此 repo 本身不含任何業務邏輯，是一個可直接複製延伸的起始模板。

## 技術棧

| 項目 | 版本 / 說明 |
|------|------------|
| Runtime | Node.js >= 18 |
| 框架 | Express 4.x |
| 測試 | Jest 29 + Supertest 7 |
| Lint | ESLint 10（flat config） |
| 格式化 | Prettier 3 |
| Git hook | Husky 9 + lint-staged 16 |
| CI | GitLab CI/CD（`.gitlab-ci.yml`） |

## 專案結構

```
index.js                  # 進入點：載入 app + config，啟動 HTTP server
app.js                    # Express app 組裝（middleware、router 掛載）
config/index.js           # 設定（PORT，預設 6000）
routes/
  health.js               # GET /health
  example.js              # GET /api/hello、GET /api/items
controllers/
  healthController.js     # 呼叫 healthService，回傳 JSON
  exampleController.js    # 呼叫 exampleService，回傳 JSON
services/
  healthService.js        # 回傳 { status: 'ok', timestamp }
  exampleService.js       # 回傳 hello message 與 hardcoded items 清單
.gitlab-ci.yml            # stages: lint → format → test → create-mr
.husky/pre-commit         # commit 前跑 format:check + lint + lint-staged
eslint.config.cjs         # ESLint flat config（含 prettier 整合）
.prettierrc               # Prettier 設定（single quote, 2 space, trailing comma）
```

## API 端點

| Method | Path | 說明 |
|--------|------|------|
| GET | `/health` | 健康檢查，回傳 `{ status, timestamp }` |
| GET | `/api/hello?name=X` | 回傳 `{ message: "Hello, X!" }` |
| GET | `/api/items` | 回傳 hardcoded item 清單 |

## 如何執行

```bash
# 安裝依賴（需 Node.js >= 18）
npm install

# 啟動服務（預設 port 6000，可用環境變數覆蓋）
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

## GitLab CI 說明

`.gitlab-ci.yml` 在每次 `push` 時依序執行：
1. `lint` — ESLint 檢查
2. `format` — Prettier 格式檢查
3. `test` — Jest 單元測試
4. `create-mr` — 若非 main branch 且無現存 MR，自動建立 Merge Request

CI 使用 `node:20` image。`create-mr` 階段需要 GitLab CI 環境變數 `GITLAB_TOKEN`（Personal Access Token），需在 GitLab 專案設定中配置。

## 狀態

**可跑（本地）**。`npm install && npm start` 即可啟動。

### 已知缺漏

- **無任何測試檔**：`jest.config.js` 指定 `tests/**/*.test.js`，但 repo 中不存在 `tests/` 目錄，`npm test` 會因找不到測試而報錯或空跑。
- **CI 需要 `GITLAB_TOKEN`**：`create-mr` 階段用到 `${GITLAB_TOKEN}` 環境變數，需在 GitLab CI/CD 變數中手動設定。
- **無 `.env.example`**：唯一的環境變數 `PORT` 沒有範本文件，但影響極小（有預設值 6000）。
- **services 皆為 hardcoded stub**：`exampleService` 回傳靜態資料，不連接任何資料庫或外部服務。
