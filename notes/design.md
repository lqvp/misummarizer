# Design Outline (2025-10-06)

## 1. Architecture Overview
- Deliverable: single `index.html` containing HTML structure, inline CSS (pastel pink theme), and module ES6 JavaScript.
- JS will be organized into modules via `<script type="module">` with separated logical sections (state management, MiAuth flow, data processing, LLM dispatch).
- No external build step; optional third-party libraries must be embedded (minified) if required.

## 2. Key Modules
1. **State Manager**: reactive store built on `Proxy`/plain objects to manage inputs, API tokens, profile, notes, and derived data. Persists to `localStorage` when user toggles "remember settings".
2. **MiAuth Client**:
   - Generates UUID session using Web Crypto (with fallback generator).
   - Opens Misskey MiAuth URL (`https://{instance}/miauth/{session}?permission=...&callback=...`).
   - Redirect target is `callback.html`, which performs `miauth/{session}/check`, surfaces the access token + account name, and stores the payload in `localStorage` for same-origin sharing.
   - ユーザーは`index.html`側の「MiAuthアクセストークン」入力欄にトークンを貼り付けてプロフィール/ノート取得を実行できる。postMessage/localStorageでの自動受け渡しも可能。
   - Fallback instructions if running via `file://` (prompt user to serve locally or use JSON import).
3. **JSON Importer**:
   - Accepts `.json` (array/object) or `.zip` (notes.json). Optionally embed JSZip to unzip.
   - Normalizes notes to canonical format `{ text, cw, createdAt, visibility }`.
   - Allows manual profile entry when JSON lacks profile fields.
   - 取得したノートはキャッシュに蓄積し、追記/上書きを切り替えられる。キャッシュはエクスポートやクリアが可能で、フィルターや要約生成はキャッシュを基礎に行う。自動取得は生成ワークフローに統合し、必要に応じて不足分を補完する。
4. **LLM Request Builder**:
   - Supports presets: OpenAI Chat Completions, OpenAI responses for upcoming (2025) structure? Provide customizing? need to confirm latest? We'll probably align with 2024 data but confirm? We'll implement generically for open API.
   - Additional preset for Gemini `generateContent`.
   - Custom endpoint mode for user-specified HTTP method/headers/body template using placeholders (e.g., `{{prompt}}`, `{{profile}}`, `{{notes}}`).
   - Handles streaming? optionally simple (non streaming) fetch with JSON.
   - GeminiプリセットではAPIキーを用いて`/models`エンドポイントから利用可能モデルを取得し、datalistに表示する。Thinking対応モデルは`thinkingBudget`入力を有効化し、空値=無制限として扱う。
5. **Prompt Composer**:
   - Default template based on spec prompt (converted to plain string referencing ban on bullet list etc.).
   - Users may edit system/instruction text and placeholders for profile/notes.
6. **Summary Renderer**:
   - Renders output text, tracks history, allows copy + download `.txt`.
   - Optionally show tokens? maybe integrated with usage metrics if API returns? (maybe for later).

## 3. User Flow
1. Choose data source (MiAuth or JSON). If MiAuth selected, enter instance URL, optionally call `Check Connectivity` (GET meta) for validation.
2. Provide profile fallback info (name/bio/location) when JSON route.
3. Configure note scope (checkboxes). Provide slider for max notes (#). Provide text filters (keyword include/exclude) to manage noise.
4. Input LLM config: choose preset (OpenAI/Gemini/Custom). Provide API key, model name, temperature, max tokens, base URL (for open-source clones).
5. Adjust prompt template optionally.
6. Click `Generate Summary`. UI shows status indicator (progress steps). On success, show result with copy + download. Provide area for prompt/response history.

## 4. Data Handling Details
- Misskey `/api/notes` requires POST with JSON body. We'll call with `token` or `i`. For MiAuth tokens, we use `POST /api/notes` with `token`. We'll fetch notes with pagination using `sinceId` or `untilId` loop until limit reached or server returns < limit.
- We will ded ded on watchers? Need to handle rate limit by small delays? Use `await new Promise`? We'll implement sequential fetch with `await`.
- For JSON import, we parse whichever structure: if root contains `data` object with `notes`, support. We'll implement detection heuristics.
- Filter note visibilities using user selection.

## 5. UI/Styling
- Pastel pink base (#f9e1ec) backgrounds, deeper accent (#f2b6cd) for buttons, soft grey (#6b6b6b) text.
- Flexbox layout with responsive design (two column on desktop, stacked on mobile).
- Use CSS variables for theme colors, accessible contrast (AA). Provide dark mode toggle? optional? Maybe lighten? We'll include optional dark-mode (prefers-color-scheme) variant with muted pink (#3d2f3f) backgrounds.
- Use `@media (prefers-reduced-motion)` to disable transitions.

## 6. Error Handling
- Step-specific errors displayed inline + aggregated log panel.
- Provide `details` toggle to show raw error messages (API responses) for debugging.
- Retry options for fetch operations.

## 7. Accessibility
- Form controls labeled, `aria-live` region for status updates.
- Keyboard accessible modals for instructions, fallback guidance.

## 8. Testing Approach
- Provide `mock-data.json` sample? (Will embed sample in comments or link?). For tests, implement Node-based script to simulate note parsing (ESM). Provide `npm`? Without package? We'll create simple Node script inside `tools/`? maybe lighten. We'll produce simple tests using `node` + `assert` to run via `node tests/parser.test.mjs` verifying aggregator functions. We'll mention in docs.
- Provide instructions to run `node tests/parser.test.mjs` to validate parsing & prompt composition.

## 9. Outstanding Questions / Risks
- Need to embed zipped file support? Evaluate JSZip size vs spec (lack of dependencies). Possibly instruct users to unzip manually to keep file small.
- Determine best approach to handle MiAuth callback for static host; potentially implement simplified fallback (manual token copy) when callback not accessible.
- Evaluate security for storing API key (default not saved, optional).
