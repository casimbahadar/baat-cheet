// Drives the course in Chromium with a fake microphone: a unit's words, grammar,
// conversation and quiz; review; the alphabet; and the Family tab (fix, tick, record,
// move to another phone). Run: node test-app.mjs   Exit 0 = passed, 1 = failed, 2 = crashed.
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, 'test-output'); await mkdir(out, { recursive: true });
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.ttf': 'font/ttf' };
let passed = 0; const fails = [];
const check = (ok, m) => { if (ok) passed++; else fails.push(m); };
const server = createServer(async (q, r) => { try { const p = decodeURIComponent(new URL(q.url, 'http://x').pathname); const b = await readFile(join(root, p === '/' ? 'index.html' : p)); r.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'text/html' }); r.end(b); } catch { r.writeHead(404); r.end(); } });
let browser;
try {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
  browser = await chromium.launch({ args: ['--no-sandbox', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, acceptDownloads: true, permissions: ['microphone'] });
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  const state = () => page.evaluate(() => JSON.parse(localStorage.getItem('baatcheet') ?? '{}'));
  await page.goto(`${base}/index.html?test`); await page.waitForFunction(() => window.__bcReady);
  await page.screenshot({ path: join(out, 'course.png') });
  check(await page.$$eval('.level', e => e.length) === 6, 'Course does not show six levels');
  check(await page.$$eval('[data-unit]', e => e.length) === 38, `Course does not show 38 units (${await page.$$eval('[data-unit]', e => e.length)})`);
  // A unit: words.
  await page.click('[data-unit="l1-hello"]');
  await page.click('[data-step="words"]');
  check((await page.textContent('#card .roman')) === 'aap', 'the first word is not aap');
  await page.screenshot({ path: join(out, 'card.png') });
  for (let i = 0; i < 6; i++) await page.click('#know');
  // Grammar.
  await page.click('[data-step="grammar"]');
  check((await page.textContent('h1')) === 'Three ways to say "you"', 'the grammar page did not open');
  await page.screenshot({ path: join(out, 'grammar.png'), fullPage: true });
  await page.click('.back');
  // Conversation, your turn: your lines are hidden until Show.
  await page.click('[data-step="conversation"]');
  await page.click('#your-turn');
  const hiddenBefore = await page.$$eval('.line.you .line-body[hidden]', e => e.length);
  check(hiddenBefore === 2, `your two lines were not hidden in Your turn (${hiddenBefore})`);
  await page.click('.line.you .btn.quiet');
  check(await page.$$eval('.line.you .line-body[hidden]', e => e.length) === 1, 'Show did not reveal your line');
  await page.screenshot({ path: join(out, 'talk.png'), fullPage: true });
  await page.click('.back');
  // Quiz: all right finishes the unit.
  await page.click('[data-step="quiz"]');
  for (let i = 0; i < 10; i++) { await page.waitForSelector('.choice:not([disabled])'); await page.click('.choice[data-right="true"]'); await page.waitForTimeout(700); }
  await page.waitForSelector('#quiz-score');
  check((await page.textContent('#quiz-score')) === '10 of 10.', 'the quiz did not score 10 of 10');
  let s = await state();
  check(s.quiz['l1-hello'] === 10 && Object.keys(s.cards).length >= 13, `the quiz score and seen cards were not saved (${s.quiz['l1-hello']}, ${Object.keys(s.cards).length} cards)`);
  await page.click('[data-tab="course"]');
  check((await page.textContent('[data-unit="l1-hello"] .count')) === 'Done', 'the finished unit is not marked done');
  // Review: make everything due, then review.
  await page.evaluate(() => { const d = JSON.parse(localStorage.getItem('baatcheet')); for (const c of Object.values(d.cards)) c.due = 0; localStorage.setItem('baatcheet', JSON.stringify(d)); });
  await page.reload(); await page.waitForFunction(() => window.__bcReady);
  await page.click('[data-tab="review"]');
  await page.waitForSelector('#rev-show');
  for (let i = 0; i < 20; i++) { await page.click('#rev-show'); await page.click(i % 4 ? '#rev-good' : '#rev-again'); if (await page.$('#review-done')) break; }
  check(await page.$('#review-done') !== null, 'review did not finish');
  // Read: letters.
  await page.click('[data-tab="read"]');
  await page.click('[data-read="letters"]');
  await page.screenshot({ path: join(out, 'letter.png') });
  for (let i = 0; i < 3; i++) await page.click('#letter-know');
  check(Object.keys((await state()).letters).length === 3, 'learned letters were not saved');
  // Family: fix, tick, record, move.
  await page.click('[data-tab="family"]');
  await page.selectOption('#fam-unit', 'l1-hello');
  const row = '[data-item="p:l1-hello:hafiz"]';
  await page.fill(`${row} [data-field="roman"]`, 'Khuda hafiz'); await page.dispatchEvent(`${row} [data-field="roman"]`, 'change');
  await page.check(`${row} [data-check="p:l1-hello:hafiz"]`);
  await page.click(`${row} .rec`); await page.waitForTimeout(1200); await page.click(`${row} .rec`);
  await page.waitForFunction(() => /Kept/.test(document.getElementById('fam-status')?.textContent ?? ''), null, { timeout: 8000 });
  s = await state();
  check(s.edits['p:l1-hello:hafiz']?.roman === 'Khuda hafiz' && s.checked['p:l1-hello:hafiz'], 'the family fix and tick were not saved');
  await page.screenshot({ path: join(out, 'family.png') });
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#fam-export')]);
  const file = join(out, 'family.json'); await dl.saveAs(file);
  const ctx2 = await browser.newContext(); const p2 = await ctx2.newPage();
  await p2.goto(`${base}/index.html`); await p2.waitForFunction(() => window.__bcReady);
  await p2.click('[data-tab="family"]'); await p2.setInputFiles('#fam-import', file);
  await p2.waitForFunction(() => /Loaded 1 recording/.test(document.getElementById('fam-status').textContent), null, { timeout: 8000 });
  check((await p2.evaluate(() => JSON.parse(localStorage.getItem('baatcheet')))).edits['p:l1-hello:hafiz']?.roman === 'Khuda hafiz', 'the other phone did not get the fix');
  // Your own words: add one, then it shows in Find and is in Review.
  await page.click('[data-tab="family"]');
  await page.fill('#new-roman', 'Gajar ka halwa');
  await page.fill('#new-english', "carrot dessert, Nani's favourite");
  await page.click('#add-save');
  await page.waitForFunction(() => /Added/.test(document.getElementById('fam-status').textContent));
  s = await state();
  check(s.custom.length === 1 && Object.keys(s.cards).some(k => k.startsWith('c:')), 'the family word was not saved or not added to Review');
  // Find: search in English and in Roman Urdu.
  await page.click('[data-tab="find"]');
  await page.fill('#find-box', 'tired');
  await page.waitForSelector('[data-hit]');
  check((await page.$$eval('[data-hit]', e => e.map(x => x.dataset.hit))).includes('p:l1-feel:thak'), 'Find did not find "I am tired"');
  await page.fill('#find-box', 'halwa');
  await page.waitForSelector('[data-hit^="c:"]');
  check(true, '');
  await page.fill('#find-box', 'eat');
  await page.waitForSelector('[data-hit]');
  check(!(await page.$$eval('[data-hit]', e => e.map(x => x.dataset.hit))).includes('p:l3-past:bohat-maza'), 'Find matched "eat" inside "great"');
  await page.fill('#find-box', 'kya haal');
  await page.waitForSelector('[data-hit]');
  check((await page.$$eval('[data-hit]', e => e.map(x => x.dataset.hit))).includes('p:l1-ask:haal'), 'Find did not search Roman Urdu');
  await page.screenshot({ path: join(out, 'find.png') });
  // Sound guide.
  await page.click('[data-tab="read"]');
  await page.click('[data-read="sounds"]');
  check(await page.$$eval('[data-sound]', e => e.length) === 11, 'the sound guide does not show 11 sounds');
  await page.screenshot({ path: join(out, 'sounds.png') });
  // Listening: with fewer than 4 recordings it explains; with more it quizzes.
  await page.click('[data-tab="review"]');
  await page.waitForSelector('#open-listening');
  await page.click('#open-listening');
  check(await page.$('#listen-none') !== null, 'listening did not explain that it needs recordings');
  const clip = await page.evaluate(async () => (await (await import('./audio-store.js')).allClips('phrases'))['p:l1-hello:hafiz']);
  await page.evaluate(async c => {
    const { saveClips } = await import('./audio-store.js');
    await saveClips('phrases', Object.fromEntries(['p:l1-hello:shukriya', 'p:l1-hello:theek-hoon', 'p:l1-feel:thak', 'p:l1-food:mazedaar', 'p:l1-hello:salam'].map(k => [k, c])));
  }, clip);
  await page.reload(); await page.waitForFunction(() => window.__bcReady);
  await page.click('[data-tab="review"]'); await page.click('#open-listening');
  for (let i = 0; i < 6; i++) {
    if (await page.$('#listen-score')) break;
    if (await page.$('#listen-type')) {
      await page.fill('#listen-type', 'x'); await page.click('#listen-check');
    } else { await page.waitForSelector('.choice:not([disabled])'); await page.click('.choice[data-right="true"]'); }
    await page.waitForTimeout(2400);
  }
  await page.screenshot({ path: join(out, 'listening.png') });
  check(await page.$('#listen-score') !== null, 'the listening practice did not finish');
  check(errors.length === 0, `page errors: ${errors.join('; ')}`);
  console.log(`checks passed: ${passed}, failed: ${fails.length}`); for (const f of fails) console.log(`FAIL ${f}`);
  await browser.close(); server.close(); process.exit(fails.length ? 1 : 0);
} catch (err) { console.log(`DID NOT COMPLETE: ${err.stack}`); await browser?.close(); server.close(); process.exit(2); }
