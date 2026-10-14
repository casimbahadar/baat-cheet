// Checks every course line: unique keys, Roman Urdu in plain letters, the Urdu in Urdu
// script with the Urdu forms of yeh and kaf, a meaning, and matching question marks.
// Run: node test-content.mjs
import { LEVEL_1 } from './course-1.js';
import { LEVEL_2 } from './course-2.js';
import { LEVEL_3 } from './course-3.js';
import { LEVEL_4 } from './course-4.js';
import { LEVEL_5 } from './course-5.js';
import { LEVEL_6 } from './course-6.js';
import { LETTERS, SOUND_GUIDE } from './alphabet.js';
let passed = 0; const fails = [];
const check = (ok, m) => { if (ok) passed++; else fails.push(m); };
const lines = [];
const unitIds = new Set();
for (const lv of [LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5, LEVEL_6]) for (const u of lv.units) {
  check(!unitIds.has(u.id), `duplicate unit ${u.id}`); unitIds.add(u.id);
  check(u.words.length >= 5 && u.grammar.explain.length >= 2 && u.grammar.examples.length >= 3 && u.talk.lines.length >= 3, `${u.id}: a part of the unit is too thin`);
  check(new Set(u.words.map(w => w[0])).size === u.words.length && new Set(u.phrases.map(p => p[0])).size === u.phrases.length, `${u.id}: duplicate ids`);
  for (const [id, roman, urdu, english] of u.words) lines.push([`${u.id} word ${id}`, roman, urdu, english]);
  for (const [id, roman, urdu, english] of u.phrases) lines.push([`${u.id} phrase ${id}`, roman, urdu, english]);
  u.grammar.examples.forEach(([roman, urdu, english], i) => lines.push([`${u.id} example ${i}`, roman, urdu, english]));
  u.talk.lines.forEach(([who, roman, urdu, english], i) => { lines.push([`${u.id} line ${i}`, roman, urdu, english]); check(typeof who === 'string' && who.length > 1, `${u.id} line ${i}: no speaker`); });
  check(u.talk.lines.some(l => l[0] === 'You'), `${u.id}: the conversation has no lines for you`);
}
for (const s of SOUND_GUIDE) s.words.forEach(([roman, urdu, english], i) => lines.push([`sound ${s.id} ${i}`, roman, urdu, english]));
for (const [w, roman, urdu, english] of lines) {
  check(/^[A-Za-z0-9' .,?!:\-ṭḍṛ…]+$/.test(roman.replace(/\.\.\./g, '')), `${w}: Roman Urdu has unexpected characters: ${roman}`);
  check(/^[\u0600-\u06FF ،؟۔!.\-]+$/.test(urdu.replace(/\.\.\./g, '')), `${w}: the Urdu has characters outside Urdu script: ${urdu}`);
  check(!/[\u064A\u0643\u0647]/.test(urdu), `${w}: uses Arabic yeh, kaf or heh instead of the Urdu letters: ${urdu}`);
  check(english.trim().length >= 1, `${w}: no meaning`);
  check(roman.trim().endsWith('?') === urdu.trim().endsWith('؟'), `${w}: a question in one script but not the other`);
}
check(LETTERS.length === 39 && new Set(LETTERS.map(l => l.glyph)).size === 39, 'the alphabet is not 39 different letters');
console.log(`${unitIds.size} units, ${lines.length} lines. checks passed: ${passed}, failed: ${fails.length}`);
for (const f of fails) console.log(`FAIL ${f}`);
process.exit(fails.length ? 1 : 0);
