# Hypotheses Tree (2025-10-06)

## Root Goal
Misskeyユーザーのプロフィール要約生成を静的ウェブアプリで完結させる。

### H1: 認証経路
- H1.1 MiAuthはブラウザからHTTPSホストされた静的アプリでもコールバック実行が可能。 *Confidence: 0.6* (Misskey Docs)
- H1.2 ローカル環境では`http://localhost`など任意のカスタムスキームをコールバックに指定できる。 *Confidence: 0.75* (FoundKey Dart Docs)
- H1.3 `file://`スキームではMiAuthのコールバックが利用できず、簡易ローカルサーバー等の案内が必要。 *Confidence: 0.8*

### H2: データ取得
- H2.1 Misskeyノートオブジェクトは`text`, `cw`, `visibility`, `createdAt`等のフィールドを持つ。 *Confidence: 0.85*
- H2.2 プロフィール情報はエクスポートJSONに含まれないためユーザー入力フォームが必須。 *Confidence: 0.9*

### H3: LLMインタラクション
- H3.1 OpenAI互換API向けには`/v1/chat/completions`フォーマットを使用する柔軟設計が必要。 *Confidence: 0.7* (実装済み)
- H3.2 Gemini向けには`/v1beta/models/*:generateContent`へのPOSTを想定したテンプレートが必要。 *Confidence: 0.8* (実装済み)
- H3.3 任意RESTエンドポイントにPOSTできる設定UIを提供する。 *Confidence: 0.8* (実装済み)

### H4: UX要件
- H4.1 Pastel Pinkを基調に柔らかい配色テーマを設定するとユーザー嗜好に合う。 *Confidence: 0.9* (UI適用済み)
- H4.2 ノートの公開範囲フィルターは`public`, `home`, `followers`の少なくとも3種をチェックボックスで提供する。 *Confidence: 0.9*
- H4.3 生成結果はコピー操作に加えてローカル保存（例: ダウンロードテキスト）を提供すると利便性が高い。 *Confidence: 0.75* (実装済み)

### H5: プライバシー/ローカル性
- H5.1 認証情報・APIキーのlocalStorage保存はユーザー承諾トグルが必要。 *Confidence: 0.8* (実装済み)
- H5.2 全処理はブラウザ内で完結し、外部サーバー送信はLLMエンドポイントのみ。 *Confidence: 0.9*

### Pending Validation
- MisskeyエクスポートJSONの具体的スキーマと添付ファイルの扱い (要サンプル収集)。
- MiAuth実機検証 (CORS / followersノート取得可否)。
- LLMエンドポイント拡張 (ストリーミング対応など) の評価。
