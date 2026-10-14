# Baat Cheet

A course in spoken Urdu for an adult beginner whose goal is to talk with family. It runs in the browser on a phone or computer, with no account and no server. Baat Cheet ("conversation") is a working title.

The course goes from first greetings to understanding fast family speech, reading the newspaper and giving a short speech at a family gathering. Speaking comes first: every line is shown in Roman Urdu (how to say it) and its meaning, with the Urdu script alongside, which can be switched off.

## The course

6 levels, 38 units, 788 lines.

| Level | What it covers |
| --- | --- |
| 1. Beginner | Greetings and manners, family members, "I am, you are", asking questions, feelings and needs, food and home, numbers to 20 |
| 2. Elementary | Everyday verbs, time and days, places and directions, shopping and money, "right now", bigger numbers |
| 3. Intermediate | The past, plans, health and the body, asking politely, weather and comparing, can, must and should |
| 4. Upper intermediate | If and then, who and which, compound verbs, getting things done, reported speech, doctor and bank, weddings and Eid |
| 5. Advanced | Opinions and disagreeing kindly, formal speech, idioms and proverbs, the news, blessings, telling a longer story |
| 6. Expert | Fast speech, Urdu and Punjabi at home, reading the newspaper, writing messages, poetry, speaking at a family gathering |

Each unit has five steps:

1. **Words**, one card at a time.
2. **Grammar**: one idea explained plainly, with examples.
3. **Phrases**.
4. **Conversation**: read it through, then "Your turn", which hides your lines until you have said them.
5. **Quiz**: 10 questions. 8 of 10 finishes the unit.

Every word and phrase card has **Say it**. You record yourself, play it back, and compare it with the family recording. These practice recordings are not saved.

## The tabs

| Tab | What it does |
| --- | --- |
| Course | The levels and units above |
| Review | Everything you have seen comes back to review: the same day, then after 1, 3, 7, 21 and 60 days as you get it right. A miss sends it back to the start. Review also opens Listening practice: once family have recorded at least 4 lines, you hear one and pick its meaning or type what you heard. |
| Read | The 39 Urdu letters, each with its name, its sound and a word from the course; a reading quiz on words you know; and the Sound guide, 11 sounds English speakers miss, with how to make each and two words to compare |
| Find | A phrasebook: type English or Roman Urdu and see matching lines at once, for the moment you need a word on a call |
| Family | For family members: record each line the way the family says it, change the Roman Urdu or the meaning to match, and tick "Checked". Also add your family's own words and phrases (names, dishes, sayings), which go into Review and Find |

Family recordings play wherever that line appears. Without one, the app uses the phone's Urdu voice if it has one installed. Otherwise the button says "No recording yet".

"Save a file for another phone" exports the recordings, fixes and ticks, and "Load a file" brings them in on another phone.

## About the Urdu

The course content was written by Claude, an AI model, and has not yet been checked by a native speaker. Every line shows "Not checked by family yet" until a family member ticks it in the Family tab.

A few things to keep in mind:

- Levels 4 to 6 are more formal and idiomatic, so a family check matters most there.
- The Punjabi unit uses common Punjabi forms written in Urdu script. Families differ, and that unit leans most on the family check.
- Verbs are in the form a man uses about himself (main thak gaya hoon). The grammar notes give the other forms.

## Setting it up

1. Upload every file to the root of a GitHub repository, for example `baat-cheet`.
2. In the repository settings, turn on GitHub Pages for the main branch.
3. Open the https address it gives you.

The microphone only works from that https address, not from a file or a local server.

To put it on the home screen, open it in Safari, tap Share, then Add to Home Screen. It opens full screen from there. An iPhone keeps a home-screen app's data separate from Safari's, so to carry progress over: in Safari, Family, Save my progress (and Save a file for another phone, for family recordings); then in the home-screen app, Family, Load my progress and Load a file.

## What the app keeps

The app keeps your progress (cards, review dates, quiz scores, letters learned), the family's fixes and ticks, and recordings. They are stored in the browser on that device, and nothing is sent anywhere.

## Files

| Files | What they are |
| --- | --- |
| `index.html`, `app.js`, `styles.css` | The app |
| `course-1.js` to `course-6.js` | The six levels |
| `alphabet.js` | The reading track |
| `audio-store.js` | Recordings on the device, export and import |
| `NotoNastaliqUrdu.ttf`, `AtkinsonHyperlegible-*.ttf` | Fonts |
| `test-content.mjs`, `test-app.mjs` | Tests |
| `DECISIONS.md`, `TODO.md` | Design decisions and open tasks |

## Tests

| Test | Checks |
| --- | --- |
| `node test-content.mjs` | Every course line: Roman Urdu in plain letters, Urdu in Urdu script with the Urdu forms of yeh, kaf and heh, a meaning, and matching question marks. 4,248 checks. |
| `node test-app.mjs` | A full unit, review, the letters, and the Family tab with a fake microphone. Needs Playwright with Chromium. |

## Fonts and licences

The fonts are Noto Nastaliq Urdu for Urdu and Atkinson Hyperlegible for English, both under the SIL Open Font License. Their licence files are included.

No licence has been chosen yet for the app's own code and content.
