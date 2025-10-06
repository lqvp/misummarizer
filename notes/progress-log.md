# Progress Log

## 2025-10-06
- Initialized task tracker (`memory.md`) and hypothesis tree (`notes/hypotheses.md`). Confidence overall: 0.5 (requirements understood but implementation details pending).
- Reviewed legacy Vue-based scripts in `src/tempura-script` for reference; confirmed they rely on Misskey internal utilities not usable in static build.
- 2025-10-06: Researched MiAuth flow & note export APIs. Confirmed session-based auth via `https://{host}/miauth/{session}` and token retrieval using `/api/miauth/{session}/check`. Identified callback can use custom URL schemes for local apps and exports rely on background jobs (e.g., `createExportNotesJob`). Confidence: 0.55 pending deeper export format confirmation.
- Self-critique: current research lacks confirmed schema for exported notes; risk that ZIP handling may be mandatory. Need follow-up doc/sample before finalizing parser.
- 実装: `index.html` にUI・MiAuthフロー・LLM連携・履歴管理を実装。Pastel Pinkテーマ採用、ユーザープロンプト編集機能を追加。信頼度: 0.7 (実機MiAuthテスト未実施)。
- 実装: `tests/parser.test.mjs` でノート正規化とテンプレート置換の単体テストを追加。信頼度: 0.6 (実データ検証未完了)。
- テスト: `node tests/parser.test.mjs` を実行し成功。信頼度: 0.8 (ミニマルな関数のみカバー)
- Self-critique: MiAuthフローは実機インスタンスで未検証。CORS制限やfollowersノート取得の可否が不明なため、今後のレビューが必要。信頼度: 0.4
- 2025-10-06: 修正: 非セキュアコンテキストで`crypto.randomUUID`が未定義となるため`generateId`フォールバックを実装し、MiAuth・履歴・ログで利用。信頼度: 0.85 (Chrome HTTP環境で再現テスト済み).
- 2025-10-06: 追加: MiAuth手動トークンフローを導入。`index.html`に手動入力欄と適用処理を追加し、`callback.html`でトークン表示・localStorage連携を実装。信頼度: 0.75 (ホスティング環境での最終確認待ち)。
- テスト: 変更後に `node tests/parser.test.mjs` を実行し成功。信頼度: 0.8
- 2025-10-06: 機能拡張: LLM設定で最大トークンを無制限にできるフロー追加、Geminiモデル一覧の動的取得とThinking Budget制御を実装。信頼度: 0.7 (Google APIレスポンス仕様の最終確認待ち)。
- 2025-10-06: Geminiモデル取得APIのページネーションとフィルタリングを実装し、埋め込み/Imagenモデルを除外、Thinkingフラグ(`thinking`)も判定に利用。信頼度: 0.75。
- 2025-10-06: ノートキャッシュ機能を実装。取得結果を追記/上書きモードで管理し、キャッシュクリア・エクスポート、フィルターと連動した統計表示を追加。信頼度: 0.8。
- 2025-10-06: 取得制御拡張。キャッシュ追記/上書き切替に加え、取得上限設定・重複スキップ設定・手動重複整理ボタンを追加。Markdownプレビューを実装し、要約結果をHTMLとして整形表示。信頼度: 0.75。
- 2025-10-06: MarkdownプレビューをMarked+DOMPurifyに置き換え、MiAuthノート取得を手動ボタンおよび自動パイプライン化。fetchTarget/skipDuplicate設定と自動補完を追加。信頼度: 0.7。
