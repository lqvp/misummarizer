import assert from 'node:assert/strict';

function normalizeNote(note) {
  if (!note || typeof note !== 'object') return null;
  const text = [note.cw ? `【CW: ${note.cw}】` : '', note.text || note.note || '']
    .filter(Boolean)
    .join(' ')
    .trim();
  const createdAt = note.createdAt || note.created_at || note.date || null;
  const visibility = note.visibility || note.scope || 'public';
  return {
    id: note.id || 'generated-id',
    text,
    createdAt,
    visibility,
  };
}

function renderTemplate(template, context) {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const trimmed = key.trim();
    return Object.hasOwn(context, trimmed) ? context[trimmed] : `{{${trimmed}}}`;
  });
}

(function testNormalizeNote() {
  const input = {
    id: 'n1',
    text: 'テスト投稿',
    cw: 'ネタバレ',
    visibility: 'home',
    createdAt: '2025-09-01T00:00:00.000Z',
  };
  const result = normalizeNote(input);
  assert.equal(result.id, 'n1');
  assert.equal(result.text, '【CW: ネタバレ】 テスト投稿');
  assert.equal(result.visibility, 'home');
  assert.equal(result.createdAt, '2025-09-01T00:00:00.000Z');
})();

(function testNormalizeNoteFallbacks() {
  const input = {
    note: '旧フィールド',
    scope: 'followers',
  };
  const result = normalizeNote(input);
  assert.equal(result.visibility, 'followers');
  assert.equal(result.text, '旧フィールド');
})();

(function testRenderTemplate() {
  const template = 'プロフィール: {{name}} / ノート数: {{count}} / 日付: {{date}}';
  const context = { name: 'Alice', count: '12', date: '2025-10-06' };
  const output = renderTemplate(template, context);
  assert.equal(output, 'プロフィール: Alice / ノート数: 12 / 日付: 2025-10-06');
})();

(function testRenderTemplateFallback() {
  const template = 'Unknown: {{missing}}';
  const output = renderTemplate(template, {});
  assert.equal(output, 'Unknown: {{missing}}');
})();

console.log('All parser tests passed.');
