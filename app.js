// Baat Cheet (working title): a course from beginner to expert in spoken Urdu for family.
// Course: levels and units, each with words, a grammar idea, phrases, a conversation and
// a quiz. Review: spaced repetition of everything seen. Read: the Urdu letters and
// reading words. Family: family members record, fix and check everything. All of it stays
// on this device; a file moves the family's work to another phone.
import { LEVEL_1 } from './course-1.js';
import { LEVEL_2 } from './course-2.js';
import { LEVEL_3 } from './course-3.js';
import { LEVEL_4 } from './course-4.js';
import { LEVEL_5 } from './course-5.js';
import { LEVEL_6 } from './course-6.js';
import { LETTERS, READING_NOTES, SOUND_GUIDE } from './alphabet.js';
import { allClips, saveClip, saveClips, measure, exportFile, readFile } from './audio-store.js';

export const LEVELS = [LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5, LEVEL_6];
const $ = id => document.getElementById(id);
const KEY = 'baatcheet';
const TEST = new URLSearchParams(location.search).has('test');
const hooks = TEST ? (window.__bc = { spoken: [] }) : null;

// Every learnable line, with a stable key: w (word), p (phrase), g (grammar example), t (conversation line).
const ITEMS = [];
for (const lv of LEVELS) for (const u of lv.units) {
  u.words.forEach(([id, roman, urdu, english, note]) => ITEMS.push({ key: `w:${u.id}:${id}`, kind: 'w', roman, urdu, english, note: note ?? '', unit: u.id, level: lv.id }));
  u.phrases.forEach(([id, roman, urdu, english, note]) => ITEMS.push({ key: `p:${u.id}:${id}`, kind: 'p', roman, urdu, english, note: note ?? '', unit: u.id, level: lv.id }));
  u.grammar.examples.forEach(([roman, urdu, english], i) => ITEMS.push({ key: `g:${u.id}:${i}`, kind: 'g', roman, urdu, english, note: '', unit: u.id, level: lv.id }));
  u.talk.lines.forEach(([who, roman, urdu, english], i) => ITEMS.push({ key: `t:${u.id}:${i}`, kind: 't', who, roman, urdu, english, note: '', unit: u.id, level: lv.id }));
}
// The sound guide's words, so family can record them.
for (const s of SOUND_GUIDE) s.words.forEach(([roman, urdu, english], i) => ITEMS.push({ key: `s:${s.id}:${i}`, kind: 's', roman, urdu, english, note: s.title, unit: 'sounds', level: 'S' }));
const byKey = Object.fromEntries(ITEMS.map(i => [i.key, i]));
const unitById = Object.fromEntries(LEVELS.flatMap(l => l.units.map(u => [u.id, { ...u, level: l }])));
window.__bcItems = ITEMS.length;

let data;
try { data = JSON.parse(localStorage.getItem(KEY)) ?? {}; } catch { data = {}; }
data = { version: 2, cards: {}, quiz: {}, edits: {}, checked: {}, showScript: true, letters: {}, ...data };
if (data.version !== 2) data = { ...data, version: 2, cards: {}, quiz: {} };
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* keeps working this session */ } };
let clips = await allClips('phrases').catch(() => ({}));
// Your family's own words: added in Family, reviewed and searchable like the course.
data.custom ??= [];
const customItem = c => ({ key: `c:${c.id}`, kind: 'c', roman: c.roman, urdu: c.urdu ?? '', english: c.english, note: c.note ?? '', unit: 'custom', level: 'F' });
function addCustomItem(c) { const it = customItem(c); ITEMS.push(it); byKey[it.key] = it; return it; }
for (const c of data.custom) addCustomItem(c);

function el(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === false || v == null) continue;
    if (k === 'class') n.className = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) n.append(kid);
  return n;
}
const item = key => ({ ...byKey[key], ...(data.edits[key] ?? {}) });
const shuffle = a => a.map(x => [Math.random(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
const today = () => Math.floor(Date.now() / 86400000);
const urduText = it => (data.showScript ? el('span', { class: 'urdu', lang: 'ur', dir: 'rtl' }, it.urdu) : null);

// ---------- spaced review ----------
// Six boxes; a card comes back after 0, 1, 3, 7, 21 or 60 days depending on its box.
const WAIT = [0, 1, 3, 7, 21, 60];
function grade(key, ok) {
  const c = data.cards[key] ?? { box: 0 };
  c.box = ok ? Math.min(5, c.box + 1) : 0;
  c.due = today() + WAIT[c.box];
  data.cards[key] = c;
  save();
}
const seen = key => !!data.cards[key];
const due = () => Object.entries(data.cards).filter(([, c]) => c.due <= today()).map(([k]) => k).filter(k => byKey[k]);

// ---------- sound ----------
// Mark the app's sound as media playback (Safari's Audio Session API), so it follows the
// media volume and goes to AirPlay or a speaker; recording switches it while the mic is on.
const audioType = t => { try { if (navigator.audioSession) navigator.audioSession.type = t; } catch { /* older browsers */ } };
audioType('playback');
let ctx = null;
const audio = () => (ctx ??= new (window.AudioContext || window.webkitAudioContext)());
const urduVoice = () => (window.speechSynthesis ? speechSynthesis.getVoices().find(v => v.lang?.startsWith('ur')) ?? null : null);
const canPlay = it => !!clips[it.key] || !!urduVoice();
async function playClip(c) {
  audio().resume();
  const b = await audio().decodeAudioData(Uint8Array.from(atob(c.src.split(',')[1]), ch => ch.charCodeAt(0)).buffer);
  const s = audio().createBufferSource(), g = audio().createGain();
  g.gain.value = c.gain ?? 1; s.buffer = b; s.connect(g); g.connect(audio().destination);
  s.start(audio().currentTime + 0.02, c.start ?? 0, (c.end ?? b.duration) - (c.start ?? 0));
}
async function play(it) {
  hooks?.spoken.push(it.key);
  if (clips[it.key]) return playClip(clips[it.key]);
  const v = urduVoice();
  if (!v) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(item(it.key).urdu);
  u.voice = v; u.lang = v.lang; u.rate = 0.8; u.volume = 1;
  speechSynthesis.speak(u);
}
// In lists, a line with nothing to play shows no button at all; the main card says why.
const hearBtn = (it, { note = false } = {}) => (canPlay(it) ? el('button', { type: 'button', class: 'btn quiet', onclick: () => play(it) }, clips[it.key] ? 'Hear family' : 'Hear') : note ? el('span', { class: 'no-audio' }, 'No recording yet') : null);

// Speaking practice: record yourself and play it back next to the family recording.
let mine = null, stream = null, recorder = null;
async function recordTo(done, btn, status) {
  if (recorder) { recorder.stop(); return; }
  if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) { status.textContent = 'Recording needs the app opened from its https web address.'; return; }
  audioType('play-and-record');
  try { stream ??= await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: true } }); } catch { status.textContent = 'The microphone is not allowed for this site.'; return; }
  audio().resume();
  const parts = [];
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = e => parts.push(e.data);
  recorder.onstop = async () => {
    audioType('playback');
    recorder = null; btn.textContent = btn.dataset.idle;
    try {
      const src = await new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = no; r.readAsDataURL(new Blob(parts, { type: parts[0]?.type })); });
      const b = await audio().decodeAudioData(Uint8Array.from(atob(src.split(',')[1]), c => c.charCodeAt(0)).buffer);
      const m = measure(b.getChannelData(0), b.sampleRate);
      if (!m) throw new Error('silent');
      await done({ src, ...m });
    } catch { status.textContent = 'Nothing was heard. Try again a little closer to the microphone.'; }
  };
  recorder.start(); btn.textContent = 'Stop';
  setTimeout(() => recorder?.stop(), 8000);
}
function sayItRow(it) {
  const status = el('p', { class: 'status', role: 'status' });
  const playMine = el('button', { type: 'button', class: 'btn quiet', disabled: true, onclick: () => mine && playClip(mine) }, 'Hear me');
  const rec = el('button', { type: 'button', class: 'btn quiet', 'data-idle': 'Say it', onclick: () => recordTo(async c => { mine = c; playMine.disabled = false; status.textContent = 'Compare with the family recording.'; playClip(c); }, rec, status) }, 'Say it');
  const hear = canPlay(it) ? hearBtn(it) : null;
  return [el('div', { class: 'row' }, hear, rec, playMine), canPlay(it) ? null : el('p', { class: 'no-audio' }, 'No family recording yet. Say it, then compare with a recording later.'), status];
}

// ---------- Course ----------
const unitItems = (u, kinds) => ITEMS.filter(i => i.unit === u.id && kinds.includes(i.kind));
const unitDone = u => (data.quiz[u.id] ?? 0) >= 8;
// The next thing to do: the first unit not finished, and the first step of it not started.
function nextStep() {
  for (const lv of LEVELS) for (const u of lv.units) {
    if (unitDone(u)) continue;
    const started = k => unitItems(u, [k]).some(x => seen(x.key));
    const step = !started('w') ? ['Words', () => cards(u.id, 'w', 0)] : !started('g') ? ['Grammar', () => grammar(u.id)]
      : !started('p') ? ['Phrases', () => cards(u.id, 'p', 0)] : !started('t') ? ['Conversation', () => talk(u.id, false)] : ['Quiz', () => quiz(u.id)];
    return { u, lv, step };
  }
  return null;
}
function course() {
  const next = nextStep();
  const doneCount = LEVELS.flatMap(l => l.units).filter(unitDone).length;
  const total = LEVELS.flatMap(l => l.units).length;
  return [el('header', { class: 'masthead' },
      el('div', { class: 'masthead-text' }, el('strong', {}, 'Baat Cheet'), el('span', { class: 'help' }, `Urdu for talking with family. ${doneCount} of ${total} units done.`)),
      el('p', { class: 'wordmark', lang: 'ur', 'aria-hidden': 'true' }, 'بات چیت')),
    next ? el('section', { class: 'continue' }, el('h2', {}, 'Carry on'),
      el('p', {}, `${next.lv.name.replace(/^Level \d+: /, '')}: ${next.u.name}. Next is ${next.step[0].toLowerCase()}.`),
      el('button', { id: 'continue', type: 'button', class: 'btn', onclick: () => open(next.step[1]()) }, `Start ${next.step[0].toLowerCase()}`)) : null,
    el('label', { class: 'check' }, el('input', { id: 'show-script', type: 'checkbox', checked: data.showScript, onchange: e => { data.showScript = e.target.checked; save(); } }), 'Show the Urdu script too'),
    ...LEVELS.map(lv => el('section', { class: 'level' }, el('div', { class: 'level-head' }, el('h2', {}, lv.name), el('p', { class: 'help' }, lv.goal)),
      el('div', { class: 'units' }, lv.units.map((u, i) => el('button', { type: 'button', class: unitDone(u) ? 'unit done' : 'unit', 'data-unit': u.id, onclick: () => open(unit(u.id)) },
        el('span', { class: 'num', 'aria-hidden': 'true' }, unitDone(u) ? '\u2713' : String(i + 1)),
        el('span', { class: 'unit-text' }, el('span', { class: 'unit-name' }, u.name),
          el('span', { class: 'count' }, unitDone(u) ? 'Done' : data.quiz[u.id] != null ? `Quiz ${data.quiz[u.id]} of 10` : 'Not started')))))))];
}
function unit(id) {
  const u = unitById[id];
  let n = 0;
  const step = (label, fn, sub) => el('button', { type: 'button', class: 'unit', 'data-step': label.toLowerCase(), onclick: () => open(fn()) },
    el('span', { class: 'num', 'aria-hidden': 'true' }, String(++n)), el('span', { class: 'unit-text' }, el('span', { class: 'unit-name' }, label), el('span', { class: 'count' }, sub)));
  return [el('button', { type: 'button', class: 'back', onclick: () => open(course()) }, 'All levels'),
    el('h1', {}, u.name), el('p', { class: 'help' }, u.level.name),
    el('div', { class: 'units' },
      step('Words', () => cards(id, 'w', 0), `${u.words.length} words`),
      step('Grammar', () => grammar(id), u.grammar.title),
      step('Phrases', () => cards(id, 'p', 0), `${u.phrases.length} phrases`),
      step('Conversation', () => talk(id, false), u.talk.title),
      step('Quiz', () => quiz(id), data.quiz[id] != null ? `Best ${data.quiz[id]} of 10` : '10 questions'))];
}
function cards(id, kind, i) {
  const list = unitItems(unitById[id], [kind]);
  const it = item(list[i].key);
  if (!seen(it.key)) grade(it.key, false);
  const next = ok => { grade(it.key, ok); open(i + 1 < list.length ? cards(id, kind, i + 1) : unit(id)); };
  return [el('button', { type: 'button', class: 'back', onclick: () => open(unit(id)) }, unitById[id].name),
    el('h2', {}, `${kind === 'w' ? 'Words' : 'Phrases'}, ${i + 1} of ${list.length}`),
    el('div', { class: 'card', id: 'card' }, el('span', { class: 'roman' }, it.roman), urduText(it), el('span', { class: 'english' }, it.english),
      it.note ? el('span', { class: 'note' }, it.note) : null, data.checked[it.key] ? null : el('span', { class: 'unchecked' }, 'Not checked by family yet'), ...sayItRow(it)),
    el('div', { class: 'row' }, el('button', { id: 'again', type: 'button', class: 'btn quiet', onclick: () => next(false) }, 'Practise again'), el('button', { id: 'know', type: 'button', class: 'btn', onclick: () => next(true) }, 'I can say it'))];
}
function grammar(id) {
  const u = unitById[id];
  return [el('button', { type: 'button', class: 'back', onclick: () => open(unit(id)) }, u.name), el('h1', {}, u.grammar.title),
    ...u.grammar.explain.map(t => el('p', { class: 'explain' }, t)),
    el('h2', {}, 'Examples'),
    ...unitItems(u, ['g']).map(x => { const it = item(x.key); if (!seen(it.key)) grade(it.key, false); return el('div', { class: 'card left' }, el('span', { class: 'roman small' }, it.roman), urduText(it), el('span', { class: 'english' }, it.english), hearBtn(it)); })];
}
function talk(id, yourTurn) {
  const u = unitById[id];
  const lines = unitItems(u, ['t']).map(x => item(x.key));
  return [el('button', { type: 'button', class: 'back', onclick: () => open(unit(id)) }, u.name), el('h1', {}, u.talk.title),
    el('p', { class: 'help' }, yourTurn ? 'Your turn: read the English, say your line in Urdu out loud, then tap Show to check.' : 'Read it through and listen. Then try Your turn.'),
    el('div', { class: 'row' }, el('button', { id: 'read-through', type: 'button', class: yourTurn ? 'btn quiet' : 'btn', onclick: () => open(talk(id, false)) }, 'Read through'), el('button', { id: 'your-turn', type: 'button', class: yourTurn ? 'btn' : 'btn quiet', onclick: () => open(talk(id, true)) }, 'Your turn')),
    ...lines.map(it => {
      if (!seen(it.key)) grade(it.key, false);
      const you = it.who === 'You';
      const hidden = yourTurn && you;
      const body = el('div', { class: 'line-body' }, el('span', { class: 'roman small' }, it.roman), urduText(it));
      if (hidden) body.hidden = true;
      return el('div', { class: you ? 'line you' : 'line', 'data-line': it.key }, el('span', { class: 'who' }, it.who), body, el('span', { class: 'english' }, it.english),
        hidden ? el('button', { type: 'button', class: 'btn quiet', onclick: e => { body.hidden = false; e.currentTarget.remove(); } }, 'Show') : hearBtn(it));
    })];
}
function quiz(id) {
  const u = unitById[id];
  const pool = shuffle(unitItems(u, ['w', 'p', 'g', 't'])).slice(0, 10);
  let i = 0, right = 0;
  const ask = () => {
    if (i >= pool.length) {
      const score = Math.round((right / pool.length) * 10);
      data.quiz[id] = Math.max(data.quiz[id] ?? 0, score); save();
      return open([el('h1', {}, 'Quiz'), el('p', { class: 'english', id: 'quiz-score' }, `${score} of 10.`),
        el('p', {}, score >= 8 ? 'Unit done. On to the next one when you are ready.' : 'Go back over the words and phrases, then try again.'),
        el('div', { class: 'row' }, el('button', { type: 'button', class: 'btn quiet', onclick: () => open(quiz(id)) }, 'Try again'), el('button', { type: 'button', class: 'btn', onclick: () => open(course()) }, 'All levels'))]);
    }
    const it = item(pool[i].key);
    const mode = ['toEnglish', 'toUrdu', data.showScript ? 'read' : 'toEnglish'][i % 3];
    const others = shuffle(ITEMS.filter(x => x.key !== it.key && x.kind === it.kind && x.level === it.level)).slice(0, 2).map(x => item(x.key));
    const options = shuffle([it, ...others]);
    const label = x => (mode === 'toUrdu' || mode === 'read' ? x.roman : x.english);
    const buttons = options.map(o => el('button', { type: 'button', class: 'choice', 'data-right': String(o.key === it.key), onclick: e => {
      const ok = o.key === it.key;
      if (ok) right++;
      grade(it.key, ok);
      for (const b of buttons) b.disabled = true;
      e.currentTarget.classList.add(ok ? 'right' : 'wrong');
      buttons.find(b => b.dataset.right === 'true').classList.add('right');
      setTimeout(() => { i++; ask(); }, ok ? 600 : 1500);
    } }, label(o)));
    const prompt = mode === 'toEnglish' ? [el('span', { class: 'roman' }, it.roman), urduText(it), hearBtn(it)]
      : mode === 'read' ? [el('span', { class: 'urdu big', lang: 'ur', dir: 'rtl' }, it.urdu)] : [el('span', { class: 'english' }, it.english)];
    open([el('h1', {}, 'Quiz'), el('p', { class: 'help' }, `${i + 1} of ${pool.length}`), el('div', { class: 'card' }, ...prompt),
      el('p', {}, { toEnglish: 'What does it mean?', toUrdu: 'How do you say it?', read: 'Read it: which is it?' }[mode]), el('div', { class: 'choices' }, buttons)]);
  };
  setTimeout(ask);
  return [el('p', {}, 'Loading')];
}

// ---------- Review ----------
function review() {
  const keys = shuffle(due()).slice(0, 20);
  const recorded = ITEMS.filter(x => clips[x.key]).length;
  const listenBtn = el('button', { id: 'open-listening', type: 'button', class: 'btn quiet', onclick: () => open(listening()) }, `Listening practice (${recorded} recorded)`);
  if (!keys.length) return [el('h1', {}, 'Review'), listenBtn, el('p', {}, Object.keys(data.cards).length ? 'Nothing due today. Come back tomorrow, or carry on with the course.' : 'Start a unit in Course first. Everything you see comes back here to review.')];
  let i = 0;
  const show = () => {
    if (i >= keys.length) return open([el('h1', {}, 'Review'), el('p', { id: 'review-done' }, `Done: ${keys.length} reviewed.`)]);
    const it = item(keys[i]);
    const back = el('div', { class: 'back-face' }, el('span', { class: 'roman' }, it.roman), urduText(it), hearBtn(it));
    back.hidden = true;
    const rate = el('div', { class: 'row' }, el('button', { id: 'rev-again', type: 'button', class: 'btn quiet', onclick: () => { grade(it.key, false); i++; show(); } }, 'Again'), el('button', { id: 'rev-good', type: 'button', class: 'btn', onclick: () => { grade(it.key, true); i++; show(); } }, 'I knew it'));
    rate.hidden = true;
    open([el('h1', {}, 'Review'), i === 0 ? listenBtn : null, el('p', { class: 'help' }, `${i + 1} of ${keys.length}. Say it in Urdu, then check.`),
      el('div', { class: 'card' }, el('span', { class: 'english' }, it.english), back),
      el('button', { id: 'rev-show', type: 'button', class: 'btn', onclick: e => { back.hidden = false; rate.hidden = false; e.currentTarget.remove(); } }, 'Show'), rate]);
  };
  setTimeout(show);
  return [el('p', {}, 'Loading')];
}

// ---------- Read ----------
function read() {
  const known = LETTERS.filter(l => data.letters[l.glyph]).length;
  return [el('h1', {}, 'Read'), ...READING_NOTES.map(t => el('p', { class: 'help' }, t)),
    el('p', { class: 'week' }, `${known} of ${LETTERS.length} letters learned.`),
    el('div', { class: 'units' }, [
      ['letters', 'The letters', `${LETTERS.length} letters, in alphabet order`, () => letter(0)],
      ['quiz', 'Reading quiz', 'Read words you already know', () => readQuiz()],
      ['sounds', 'Sound guide', `${SOUND_GUIDE.length} sounds English speakers miss`, () => sounds()]
    ].map(([key, name, sub, go], i) => el('button', { type: 'button', class: 'unit', 'data-read': key, onclick: () => open(go()) },
      el('span', { class: 'num', 'aria-hidden': 'true' }, String(i + 1)), el('span', { class: 'unit-text' }, el('span', { class: 'unit-name' }, name), el('span', { class: 'count' }, sub)))))];
}
function letter(i) {
  const l = LETTERS[i];
  const go = ok => { if (ok) data.letters[l.glyph] = true; save(); open(i + 1 < LETTERS.length ? letter(i + 1) : read()); };
  return [el('button', { type: 'button', class: 'back', onclick: () => open(read()) }, 'Read'), el('h2', {}, `Letter ${i + 1} of ${LETTERS.length}`),
    el('div', { class: 'card', id: 'letter' }, el('span', { class: 'urdu huge', lang: 'ur' }, l.glyph), el('span', { class: 'roman small' }, l.name), el('span', { class: 'english' }, `Sound: ${l.sound}`),
      el('span', { class: 'urdu', lang: 'ur', dir: 'rtl' }, l.word), el('span', { class: 'note' }, `as in ${l.roman}`)),
    el('div', { class: 'row' }, el('button', { type: 'button', class: 'btn quiet', onclick: () => go(false) }, 'Not yet'), el('button', { id: 'letter-know', type: 'button', class: 'btn', onclick: () => go(true) }, 'I know it'))];
}
function readQuiz() {
  const pool = shuffle(ITEMS.filter(x => x.kind === 'w' && (seen(x.key) || x.level === 'L1'))).slice(0, 10);
  let i = 0, right = 0;
  const ask = () => {
    if (i >= pool.length) return open([el('h1', {}, 'Reading quiz'), el('p', { class: 'english' }, `${right} of ${pool.length} read right.`), el('button', { type: 'button', class: 'btn', onclick: () => open(readQuiz()) }, 'Again')]);
    const it = item(pool[i].key);
    const options = shuffle([it, ...shuffle(ITEMS.filter(x => x.kind === 'w' && x.key !== it.key && x.roman !== it.roman)).slice(0, 2).map(x => item(x.key))]);
    const buttons = options.map(o => el('button', { type: 'button', class: 'choice', 'data-right': String(o.key === it.key), onclick: e => {
      const ok = o.key === it.key; if (ok) right++;
      for (const b of buttons) b.disabled = true;
      e.currentTarget.classList.add(ok ? 'right' : 'wrong'); buttons.find(b => b.dataset.right === 'true').classList.add('right');
      setTimeout(() => { i++; ask(); }, ok ? 600 : 1500);
    } }, `${o.roman}: ${o.english}`));
    open([el('h1', {}, 'Reading quiz'), el('p', { class: 'help' }, `${i + 1} of ${pool.length}`), el('div', { class: 'card' }, el('span', { class: 'urdu big', lang: 'ur', dir: 'rtl' }, it.urdu)), el('p', {}, 'Which word is this?'), el('div', { class: 'choices' }, buttons)]);
  };
  setTimeout(ask);
  return [el('p', {}, 'Loading')];
}

// ---------- Find ----------
// A phrasebook: type English or Urdu and get matching lines at once, for the moment you
// need a word on a call.
const fold = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const unitName = it => (it.unit === 'custom' ? "Your family's words" : it.unit === 'sounds' ? 'Sound guide' : unitById[it.unit]?.name ?? '');
function find(q = '') {
  const box = el('input', { id: 'find-box', type: 'search', placeholder: 'Type English or Urdu, for example "tired"', value: q, autocomplete: 'off' });
  const list = el('div', { id: 'find-results', class: 'results' });
  const run = () => {
    const f = fold(box.value);
    if (f.length < 2) { list.replaceChildren(el('p', { class: 'help' }, 'Type at least two letters.')); return; }
    const words = f.split(' ');
    // Each typed word must start a word in the line, so "eat" finds "eaten" but not "great".
    const hits = ITEMS.map(x => item(x.key)).filter(it => { const h = fold(`${it.english} ${it.roman}`).split(' '); return words.every(w => h.some(x => x.startsWith(w))); })
      .sort((a, b) => (a.kind === 'w') - (b.kind === 'w') || a.english.length - b.english.length).slice(0, 40);
    list.replaceChildren(...(hits.length ? hits.map(it => el('div', { class: 'card left hit', 'data-hit': it.key }, el('span', { class: 'roman small' }, it.roman), urduText(it), el('span', { class: 'english' }, it.english), el('span', { class: 'note' }, unitName(it)), hearBtn(it)))
      : [el('p', { class: 'help' }, 'Nothing found. Ask family, then add it in Family, Your family\'s words.')]));
  };
  box.oninput = run;
  setTimeout(() => { run(); box.focus(); });
  return [el('h1', {}, 'Find'), el('label', { class: 'field' }, 'Search', box), list];
}

// ---------- Listening ----------
// Uses only lines a family member has recorded: hear it, then pick the meaning or type
// what you heard.
function listening() {
  const pool = shuffle(ITEMS.filter(x => clips[x.key])).slice(0, 10);
  if (pool.length < 4) return [el('h1', {}, 'Listening'), el('p', { id: 'listen-none' }, `Listening practice uses family recordings, and there ${pool.length === 1 ? 'is' : 'are'} ${pool.length} so far. Once at least 4 lines are recorded in Family, they turn up here.`)];
  let i = 0, right = 0;
  const ask = () => {
    if (i >= pool.length) return open([el('h1', {}, 'Listening'), el('p', { class: 'english', id: 'listen-score' }, `${right} of ${pool.length}.`), el('button', { type: 'button', class: 'btn', onclick: () => open(listening()) }, 'Again')]);
    const it = item(pool[i].key);
    const typed = i % 2 === 1;
    const again = el('button', { id: 'listen-play', type: 'button', class: 'btn', onclick: () => play(it) }, 'Hear it again');
    const reveal = el('div', { class: 'back-face' }, el('span', { class: 'roman' }, it.roman), urduText(it), el('span', { class: 'english' }, it.english));
    reveal.hidden = true;
    const next = ok => { if (ok) right++; grade(it.key, ok); reveal.hidden = false; setTimeout(() => { i++; ask(); }, ok ? 900 : 2200); };
    let answer;
    if (typed) {
      const input = el('input', { id: 'listen-type', class: 'type-box', autocomplete: 'off', placeholder: 'Type it in Roman Urdu' });
      const go = el('button', { id: 'listen-check', type: 'button', class: 'btn', onclick: () => { go.disabled = true; next(fold(input.value).replace(/ /g, '') === fold(it.roman).replace(/ /g, '')); } }, 'Check');
      answer = [el('p', {}, 'Type what you hear.'), input, go];
    } else {
      const others = shuffle(ITEMS.filter(x => x.key !== it.key && x.kind !== 's')).slice(0, 2).map(x => item(x.key));
      const buttons = shuffle([it, ...others]).map(o => el('button', { type: 'button', class: 'choice', 'data-right': String(o.key === it.key), onclick: e => {
        for (const b of buttons) b.disabled = true; const ok = o.key === it.key; e.currentTarget.classList.add(ok ? 'right' : 'wrong'); next(ok);
      } }, o.english));
      answer = [el('p', {}, 'What does it mean?'), el('div', { class: 'choices' }, buttons)];
    }
    open([el('h1', {}, 'Listening'), el('p', { class: 'help' }, `${i + 1} of ${pool.length}`), again, ...answer, reveal]);
    play(it);
  };
  setTimeout(ask);
  return [el('p', {}, 'Loading')];
}

// ---------- Sound guide ----------
function sounds() {
  return [el('button', { type: 'button', class: 'back', onclick: () => open(read()) }, 'Read'), el('h1', {}, 'Sound guide'),
    el('p', { class: 'help' }, 'The Urdu sounds English speakers most often miss. Listen to the two words, say them both, and record yourself to compare. A family member can record the words in Family, Sound guide.'),
    ...SOUND_GUIDE.map(s => el('section', { class: 'card left', 'data-sound': s.id }, el('h2', {}, s.title), el('p', { class: 'explain' }, s.how),
      ...s.words.map((_, i) => { const it = item(`s:${s.id}:${i}`); return el('div', { class: 'pair' }, el('span', { class: 'roman small' }, it.roman), el('span', { class: 'urdu', lang: 'ur', dir: 'rtl' }, it.urdu), el('span', { class: 'english' }, it.english), ...sayItRow(it)); })))];
}

// ---------- Family ----------
function family(unitId = 'custom') {
  const status = el('p', { id: 'fam-status', class: 'status', role: 'status' });
  const done = ITEMS.filter(i => data.checked[i.key]).length;
  const u = unitById[unitId] ?? { name: unitId === 'sounds' ? 'Sound guide' : "Your family's words" };
  const rows = ITEMS.filter(i => i.unit === unitId).map(base => {
    const it = item(base.key);
    const rec = el('button', { type: 'button', class: 'btn rec', 'data-idle': clips[it.key] ? 'Record again' : 'Record', onclick: () => recordTo(async c => {
      clips[it.key] = c; await saveClip('phrases', it.key, c); playClip(c); open(family(unitId)); $('fam-status').textContent = `Kept "${it.roman}".`;
    }, rec, status) }, clips[it.key] ? 'Record again' : 'Record');
    const field = (name, label) => el('label', { class: 'field' }, label, el('input', { value: it[name], 'data-field': name, onchange: e => { data.edits[it.key] = { ...(data.edits[it.key] ?? {}), [name]: e.target.value.trim() }; save(); status.textContent = 'Saved.'; } }));
    return el('div', { class: 'frow', 'data-item': it.key }, el('span', { class: 'box' }, { w: 'Word', p: 'Phrase', g: 'Example', t: `Conversation: ${it.who}`, s: it.note, c: 'Your word' }[it.kind]),
      el('span', { class: 'urdu', lang: 'ur', dir: 'rtl' }, it.urdu), field('roman', 'How we say it'), field('english', 'Meaning'),
      el('label', { class: 'check' }, el('input', { type: 'checkbox', 'data-check': it.key, checked: !!data.checked[it.key], onchange: e => { data.checked[it.key] = e.target.checked; save(); } }), 'Checked: this is how we say it'),
      el('div', { class: 'row' }, rec, hearBtn(it)));
  });
  const pick = el('select', { id: 'fam-unit', class: 'pick', onchange: e => open(family(e.target.value)) },
    el('option', { value: 'custom', selected: unitId === 'custom' }, "Your family's words"), el('option', { value: 'sounds', selected: unitId === 'sounds' }, 'Sound guide'),
    LEVELS.map(lv => el('optgroup', { label: lv.name }, lv.units.map(x => el('option', { value: x.id, selected: x.id === unitId }, x.name)))));
  // Adding your own word or phrase.
  const nf = name => el('input', { id: `new-${name}`, autocomplete: 'off' });
  const fRoman = nf('roman'), fEnglish = nf('english'), fUrdu = el('input', { id: 'new-urdu', lang: 'ur', dir: 'rtl', autocomplete: 'off' });
  const addForm = unitId !== 'custom' ? null : el('section', { class: 'card left', id: 'add-word' }, el('h2', {}, 'Add a word or phrase'),
    el('p', { class: 'help' }, 'Names, family dishes, things your family always says. They go into Review and Find like the course.'),
    el('label', { class: 'field' }, 'How we say it (Roman Urdu)', fRoman), el('label', { class: 'field' }, 'Meaning in English', fEnglish), el('label', { class: 'field' }, 'Urdu script (optional)', fUrdu),
    el('button', { id: 'add-save', type: 'button', class: 'btn', onclick: () => {
      if (!fRoman.value.trim() || !fEnglish.value.trim()) { status.textContent = 'Fill in how you say it and what it means.'; return; }
      const c = { id: Date.now().toString(36), roman: fRoman.value.trim(), english: fEnglish.value.trim(), urdu: fUrdu.value.trim() };
      data.custom.push(c); data.checked[`c:${c.id}`] = true; const it = addCustomItem(c); grade(it.key, false); save();
      open(family('custom')); $('fam-status').textContent = `Added "${c.roman}". Record it below.`;
    } }, 'Add'));
  const exp = el('button', { id: 'fam-export', type: 'button', class: 'btn quiet', onclick: () => {
    const body = JSON.stringify({ ...JSON.parse(exportFile('phrases', clips)), edits: data.edits, checked: data.checked, custom: data.custom });
    const a = el('a', { href: URL.createObjectURL(new Blob([body], { type: 'application/json' })), download: 'baat-cheet-family.json' });
    document.body.append(a); a.click(); a.remove(); status.textContent = 'Saved. Load this file on another phone in Family, Load a file.';
  } }, 'Save a file for another phone');
  const imp = el('input', { id: 'fam-import', type: 'file', accept: 'application/json,.json' });
  imp.onchange = async () => {
    try {
      const text = await imp.files[0].text();
      const incoming = readFile('phrases', text);
      const extra = JSON.parse(text);
      await saveClips('phrases', incoming); clips = await allClips('phrases');
      Object.assign(data.edits, extra.edits ?? {}); Object.assign(data.checked, extra.checked ?? {});
      for (const c of extra.custom ?? []) if (c?.id && c.roman && c.english && !data.custom.some(x => x.id === c.id)) { data.custom.push(c); grade(addCustomItem(c).key, false); }
      save();
      open(family(unitId)); $('fam-status').textContent = `Loaded ${Object.keys(incoming).length} recordings.`;
    } catch { status.textContent = 'That file is not a Baat Cheet family file.'; }
  };
  // Loading progress replaces this copy's progress, after checking the file is one of ours.
  const progressIn = el('input', { id: 'progress-import', type: 'file', accept: 'application/json,.json' });
  progressIn.onchange = async () => {
    try {
      const f = JSON.parse(await progressIn.files[0].text());
      const d = f?.data;
      if (f?.kind !== 'baat-cheet-progress' || !d || typeof d.cards !== 'object' || typeof d.quiz !== 'object' || typeof d.edits !== 'object' || !Array.isArray(d.custom ?? [])) throw new Error('bad');
      localStorage.setItem(KEY, JSON.stringify(d));
      location.reload();
    } catch { status.textContent = 'That file is not a Baat Cheet progress file. Nothing was changed.'; }
  };
  return [el('h1', {}, 'Family'), el('p', { class: 'help' }, 'For a family member: record each line the way you say it at home, fix anything that is not how your family says it, and tick Checked. Recordings stay on this phone.'),
    el('p', { class: 'week' }, `${done} of ${ITEMS.length} lines checked by family.`), el('label', { class: 'field' }, 'Section', pick), addForm, el('h2', {}, u.name),
    ...(rows.length ? rows : [el('p', { class: 'help' }, 'Nothing here yet.')]), status,
    el('h2', {}, 'Another phone'), exp, el('label', { class: 'field' }, 'Load a file', imp),
    el('h2', {}, 'Your progress'),
    el('p', { class: 'help' }, 'Lessons done, review dates, quiz scores, letters learned and your settings. Save a file to move them to another phone, or into the home-screen app, which keeps its own copy.'),
    el('button', { id: 'progress-export', type: 'button', class: 'btn quiet', onclick: () => {
      const a = el('a', { href: URL.createObjectURL(new Blob([JSON.stringify({ kind: 'baat-cheet-progress', version: 2, data })], { type: 'application/json' })), download: 'baat-cheet-progress.json' });
      document.body.append(a); a.click(); a.remove();
      $('fam-status').textContent = 'Progress saved. Load it in the other copy of the app, here in Family.';
    } }, 'Save my progress'),
    el('label', { class: 'field' }, 'Load my progress', progressIn)];
}

// ---------- tabs ----------
const TABS = { course, review, read, find, family };
function open(nodes) { $('main').replaceChildren(...nodes.filter(Boolean)); window.scrollTo(0, 0); }
for (const b of $('tabs').querySelectorAll('button')) b.onclick = () => {
  for (const x of $('tabs').querySelectorAll('button')) x.setAttribute('aria-current', String(x === b));
  open(TABS[b.dataset.tab]());
};
$('tabs').querySelector('[data-tab="course"]').setAttribute('aria-current', 'true');
open(course());
window.__bcReady = true;
