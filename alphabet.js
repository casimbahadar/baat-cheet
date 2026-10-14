// Reading track: the Urdu letters in alphabet order, each with its name, the sound it
// usually makes, and a word you already know from the course that uses it.
export const LETTERS = [
  ['ا', 'alif', 'a, aa, or a carrier for a vowel', 'ابو', 'Abbu'], ['ب', 'be', 'b', 'بھائی', 'bhai'], ['پ', 'pe', 'p', 'پانی', 'paani'], ['ت', 'te', 't (soft, tongue on the teeth)', 'تین', 'teen'],
  ['ٹ', 'ṭe', 'ṭ (hard, tongue curled back)', 'ٹھیک', 'theek'], ['ث', 'se', 's', 'ثواب', 'sawaab'], ['ج', 'jeem', 'j', 'جی', 'jee'], ['چ', 'che', 'ch', 'چائے', 'chai'],
  ['ح', 'baṛi he', 'h', 'حال', 'haal'], ['خ', 'khe', 'kh (rough, at the back of the throat)', 'خوش', 'khush'], ['د', 'daal', 'd (soft)', 'دو', 'do'], ['ڈ', 'ḍaal', 'ḍ (hard)', 'ڈاکٹر', 'doctor'],
  ['ذ', 'zaal', 'z', 'ذرا', 'zara'], ['ر', 're', 'r (rolled)', 'روٹی', 'roti'], ['ڑ', 'ṛe', 'ṛ (a flapped r)', 'سڑک', 'sarak'], ['ز', 'ze', 'z', 'زیادہ', 'zyada'],
  ['ژ', 'zhe', 'zh (as in "measure")', 'ٹیلیوژن', 'television'], ['س', 'seen', 's', 'سات', 'saat'], ['ش', 'sheen', 'sh', 'شکریہ', 'shukriya'], ['ص', "su'ad", 's', 'صبح', 'subah'],
  ['ض', "zu'ad", 'z', 'ضرور', 'zaroor'], ['ط', "to'e", 't', 'طبیعت', 'tabiyat'], ['ظ', "zo'e", 'z', 'حافظ', 'hafiz'], ['ع', "'ain", 'a vowel carrier, soft catch', 'عمر', 'umar'],
  ['غ', 'ghain', 'gh (gargled)', 'غلط', 'ghalat'], ['ف', 'fe', 'f', 'فکر', 'fikar'], ['ق', 'qaaf', 'q (deep k)', 'قریب', 'qareeb'], ['ک', 'kaaf', 'k', 'کیا', 'kya'],
  ['گ', 'gaaf', 'g', 'گھر', 'ghar'], ['ل', 'laam', 'l', 'لینا', 'lena'], ['م', 'meem', 'm', 'میں', 'main'], ['ن', 'noon', 'n', 'نانی', 'Nani'], ['ں', 'noon ghunna', 'nasal sound, n through the nose', 'ہاں', 'haan'],
  ['و', 'wao', 'w, v, oo, or o', 'وہ', 'woh'], ['ہ', 'choṭi he', 'h, or a at the end of a word', 'ہم', 'hum'], ['ھ', 'do-chashmi he', 'adds breath: bh, ph, th, kh, gh', 'بھائی', 'bhai'],
  ['ء', 'hamza', 'a short break between vowels', 'آئیے', 'aaiye'], ['ی', 'choṭi ye', 'y, ee, or ai', 'یہ', 'yeh'], ['ے', 'baṛi ye', 'e or ay, at the end of a word', 'ہے', 'hai']
].map(([glyph, name, sound, word, roman]) => ({ glyph, name, sound, word, roman }));

export const READING_NOTES = [
  'Urdu is written from right to left.',
  'Most letters join to the next letter and change shape a little when they do. Seven never join to the letter after them: ا د ڈ ذ ر ڑ ز ژ و.',
  'Short vowels are usually not written, so you learn to read whole words you already know how to say. That is why the reading track uses words from your course.',
  'Letters in the same family share a shape and differ by dots: ب پ ت ٹ ث, and ج چ ح خ.'
];

// The sound guide: the Urdu sounds English speakers most often miss, each with how to
// make it and words to hear the difference. Family members can record the words.
export const SOUND_GUIDE = [
  { id: 'kh-breath', title: 'k and kh (breathy)', how: 'kh with ھ is a k with a puff of air after it, like the k in "kit" said strongly. Plain k has no puff.', words: [['kaana', 'کانا', 'one-eyed'], ['khaana', 'کھانا', 'food']] },
  { id: 'ph', title: 'p and ph', how: 'ph is a p with a puff of air, not an f. Hold a hand in front of your mouth: ph pushes air, p barely does.', words: [['pal', 'پل', 'a moment'], ['phal', 'پھل', 'fruit']] },
  { id: 't-hard', title: 'soft t and hard ṭ', how: 'For soft t (ت), the tongue touches the back of the upper teeth. For hard ṭ (ٹ), curl the tongue back and touch the roof of the mouth.', words: [['teen', 'تین', 'three'], ['ṭheek', 'ٹھیک', 'fine']] },
  { id: 'd-hard', title: 'soft d and hard ḍ', how: 'The same as t: soft d (د) on the teeth, hard ḍ (ڈ) with the tongue curled back.', words: [['daal', 'دال', 'lentils'], ['ḍaal', 'ڈال', 'put (it), or a branch']] },
  { id: 'kh-rough', title: 'breathy kh and rough kh', how: 'Urdu has two kh sounds. کھ is a breathy k. خ is rough, made at the back of the throat, like clearing it gently or the ch in Scottish "loch".', words: [['khaana', 'کھانا', 'food (breathy kh)'], ['khush', 'خوش', 'happy (rough kh)']] },
  { id: 'gh', title: 'breathy gh and gargled gh', how: 'گھ is a g with a puff of air. غ is made far back, like a gentle gargle or the French r.', words: [['ghar', 'گھر', 'home (breathy gh)'], ['ghalat', 'غلط', 'wrong (gargled gh)']] },
  { id: 'q', title: 'k and q', how: 'q (ق) is made further back than k, deep in the throat where the tongue meets the soft part of the roof of the mouth.', words: [['kam', 'کم', 'less'], ['qalam', 'قلم', 'pen']] },
  { id: 'chh', title: 'ch and chh', how: 'chh is ch with a puff of air after it.', words: [['chai', 'چائے', 'tea'], ['chhe', 'چھ', 'six']] },
  { id: 'r-flap', title: 'r and ṛ', how: 'r (ر) is a light tap of the tongue behind the teeth. ṛ (ڑ) curls the tongue back and flicks it forward.', words: [['raat', 'رات', 'night'], ['saṛak', 'سڑک', 'road']] },
  { id: 'nasal', title: 'the nasal n', how: 'ں makes the vowel before it come through the nose, with no full n. It is the difference between is and are.', words: [['hai', 'ہے', 'is'], ['hain', 'ہیں', 'are']] },
  { id: 'long-a', title: 'short a and long aa', how: 'Vowel length changes the word. Hold aa about twice as long as a.', words: [['kam', 'کم', 'less'], ['kaam', 'کام', 'work']] }
];
