const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createApp } = require('../server');

test('serves the PetCare static files without exposing project or API routes', async t => {
  const server = createApp().listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  t.after(() => new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  }));

  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const page = await fetch(baseUrl);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /PetCare/);

  for (const asset of ['/index.html', '/script.js', '/styles.css']) {
    const response = await fetch(`${baseUrl}${asset}`);
    assert.equal(response.status, 200, `${asset} should be available`);
  }

  for (const blockedPath of ['/api/state', '/package.json', '/server.js']) {
    const response = await fetch(`${baseUrl}${blockedPath}`);
    assert.equal(response.status, 404, `${blockedPath} should not be exposed`);
  }
});
