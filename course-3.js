// Level 3, Intermediate: telling stories. Past and future, health, polite requests,
// weather and comparing, and saying what you can and must do.
export const LEVEL_3 = {
  id: 'L3', name: 'Level 3: Intermediate', goal: 'Tell what happened, make plans, talk about health and weather, and ask politely.',
  units: [
    { id: 'l3-past', name: 'What happened',
      words: [['gaya', 'gaya', 'گیا', 'went (a man)'], ['aaya', 'aaya', 'آیا', 'came (a man)'], ['kiya', 'kiya', 'کیا', 'did'], ['khaaya', 'khaaya', 'کھایا', 'ate'], ['dekha', 'dekha', 'دیکھا', 'saw'], ['kaha', 'kaha', 'کہا', 'said'], ['mila', 'mila', 'ملا', 'met, got'], ['tha', 'tha', 'تھا', 'was (a man or thing)'], ['thi', 'thi', 'تھی', 'was (a woman or thing)'], ['the', 'the', 'تھے', 'were']],
      grammar: { title: 'The past, and the little word ne', explain: [
        'For going and coming, the verb agrees with you: main gaya (I went, a man), main gayi (a woman), hum gaye (we went).',
        'For verbs that do something to something (eat, see, do), add ne after the doer and the verb agrees with the thing instead: maine khana khaaya (I ate food), maine film dekhi (I watched a film, film is feminine).',
        'Main becomes maine, aap becomes aap ne, woh becomes us ne.'],
        examples: [['Main kal bazaar gaya', 'میں کل بازار گیا', 'I went to the market yesterday'], ['Maine khana khaaya', 'میں نے کھانا کھایا', 'I ate (the meal)'], ['Ammi ne kya kaha?', 'امی نے کیا کہا؟', 'What did Mom say?'], ['Woh ghar par tha', 'وہ گھر پر تھا', 'He was at home']] },
      phrases: [['kal-kya-kiya', 'Kal aap ne kya kiya?', 'کل آپ نے کیا کیا؟', 'What did you do yesterday?'], ['bohat-maza', 'Bohat maza aaya', 'بہت مزہ آیا', 'It was great fun'], ['der-ho-gayi', 'Mujhe der ho gayi', 'مجھے دیر ہو گئی', 'I got late'], ['bhool-gaya', 'Main bhool gaya', 'میں بھول گیا', 'I forgot']],
      talk: { title: 'Telling about yesterday', lines: [['Mamu', 'Kal kya kiya?', 'کل کیا کیا؟', 'What did you do yesterday?'], ['You', 'Hum park gaye. Bachchon ne bohat khela.', 'ہم پارک گئے۔ بچوں نے بہت کھیلا۔', 'We went to the park. The children played a lot.'],
        ['Mamu', 'Wah! Khana kahan khaaya?', 'واہ! کھانا کہاں کھایا؟', 'Great! Where did you eat?'], ['You', 'Ghar aa kar khaaya. Bohat maza aaya.', 'گھر آ کر کھایا۔ بہت مزہ آیا۔', 'We ate after coming home. It was great fun.']] } },
    { id: 'l3-future', name: 'Plans',
      words: [['karunga', 'karunga', 'کروں گا', 'I will do (a man)'], ['jaunga', 'jaunga', 'جاؤں گا', 'I will go (a man)'], ['aaenge', 'aaenge', 'آئیں گے', 'will come (we, or respect)'], ['shayad', 'shayad', 'شاید', 'maybe'], ['zaroor', 'zaroor', 'ضرور', 'definitely, of course'], ['agle', 'agle', 'اگلے', 'next'], ['chhutti', 'chhutti', 'چھٹی', 'day off, holiday'], ['safar', 'safar', 'سفر', 'journey, travel']],
      grammar: { title: 'Will: -unga, -enge', explain: [
        'For the future, add -unga (I, a man), -ungi (I, a woman), -ega or -egi (he or she), -enge (we, you with aap, or they) to the verb stem: karna becomes karunga.',
        'Saying "main kal aaunga" is a promise; add shayad to make it a maybe.'],
        examples: [['Main kal phone karunga', 'میں کل فون کروں گا', 'I will call tomorrow'], ['Hum agle hafte aaenge', 'ہم اگلے ہفتے آئیں گے', 'We will come next week'], ['Shayad barish hogi', 'شاید بارش ہوگی', 'Maybe it will rain']] },
      phrases: [['kab-aaenge', 'Aap kab aaenge?', 'آپ کب آئیں گے؟', 'When will you come?'], ['zaroor-aaunga', 'Main zaroor aaunga', 'میں ضرور آؤں گا', 'I will definitely come'], ['chhutti', 'Agle hafte meri chhutti hai', 'اگلے ہفتے میری چھٹی ہے', 'I have time off next week'], ['pakistan-jaunga', 'Main Pakistan jaunga', 'میں پاکستان جاؤں گا', 'I will go to Pakistan']],
      talk: { title: 'Weekend plans', lines: [['Behen', 'Is hafte kya karoge?', 'اس ہفتے کیا کرو گے؟', 'What will you do this weekend?'], ['You', 'Hafte ko Nani ke ghar jaenge.', 'ہفتے کو نانی کے گھر جائیں گے۔', 'On Saturday we will go to Nani\'s house.'],
        ['Behen', 'Main bhi aaungi! Kitne baje?', 'میں بھی آؤں گی! کتنے بجے؟', 'I will come too! What time?'], ['You', 'Shayad dopahar ko. Main tumhein phone karunga.', 'شاید دوپہر کو۔ میں تمہیں فون کروں گا۔', 'Maybe in the afternoon. I will call you.']] } },
    { id: 'l3-health', name: 'Health and the body',
      words: [['sar', 'sar', 'سر', 'head'], ['pait', 'pait', 'پیٹ', 'stomach'], ['haath', 'haath', 'ہاتھ', 'hand'], ['paon', 'paon', 'پاؤں', 'foot'], ['aankh', 'aankh', 'آنکھ', 'eye'], ['kaan', 'kaan', 'کان', 'ear'], ['dard', 'dard', 'درد', 'pain'], ['bukhaar', 'bukhaar', 'بخار', 'fever'], ['dawai', 'dawai', 'دوائی', 'medicine'], ['daaktar', 'doctor', 'ڈاکٹر', 'doctor'], ['aaraam', 'aaraam', 'آرام', 'rest']],
      grammar: { title: '"There is pain in my head"', explain: [
        'Urdu says where the pain is: mere sar mein dard hai, literally "in my head there is pain". Swap the body part: mere pait mein dard hai.',
        'For being ill, use tabiyat (health): meri tabiyat theek nahin hai, I am not well.'],
        examples: [['Mere sar mein dard hai', 'میرے سر میں درد ہے', 'I have a headache'], ['Mujhe bukhaar hai', 'مجھے بخار ہے', 'I have a fever'], ['Aaraam kijiye', 'آرام کیجیے', 'Please rest']] },
      phrases: [['tabiyat-nahin', 'Meri tabiyat theek nahin hai', 'میری طبیعت ٹھیک نہیں ہے', 'I am not feeling well'], ['dawai-li', 'Dawai li?', 'دوائی لی؟', 'Did you take medicine?'], ['doctor-ke-paas', 'Doctor ke paas jaayen', 'ڈاکٹر کے پاس جائیں', 'Go to the doctor'], ['jaldi-theek', 'Allah aap ko jaldi theek kare', 'اللہ آپ کو جلدی ٹھیک کرے', 'May Allah make you well soon']],
      talk: { title: 'Nana is unwell', lines: [['You', 'Nana, aap ki tabiyat kaisi hai?', 'نانا، آپ کی طبیعت کیسی ہے؟', 'Nana, how are you feeling?'], ['Nana', 'Theek nahin, beta. Sar mein dard hai.', 'ٹھیک نہیں، بیٹا۔ سر میں درد ہے۔', 'Not well, son. My head hurts.'],
        ['You', 'Dawai li?', 'دوائی لی؟', 'Did you take medicine?'], ['Nana', 'Haan, subah li thi.', 'ہاں، صبح لی تھی۔', 'Yes, I took it this morning.'], ['You', 'Aaraam kijiye. Allah aap ko jaldi theek kare.', 'آرام کیجیے۔ اللہ آپ کو جلدی ٹھیک کرے۔', 'Please rest. May Allah make you well soon.']] } },
    { id: 'l3-ask', name: 'Asking politely',
      words: [['zara', 'zara', 'ذرا', 'just, a little (softens a request)'], ['dijiye', 'dijiye', 'دیجیے', 'please give'], ['laiye', 'laiye', 'لائیے', 'please bring'], ['bataiye', 'bataiye', 'بتائیے', 'please tell'], ['sakte', 'sakte', 'سکتے', 'can (with aap, plural)'], ['ijaazat', 'ijaazat', 'اجازت', 'permission']],
      grammar: { title: 'Three levels of asking', explain: [
        'Karo is for friends and children, karein is polite, kijiye is most polite. Kar dijiye adds "for me" warmth: yeh kar dijiye.',
        'Kya aap ... sakte hain? is "could you ...?": kya aap mujhe bata sakte hain? (could you tell me?).'],
        examples: [['Zara paani dijiye', 'ذرا پانی دیجیے', 'Please pass some water'], ['Kya aap madad kar sakte hain?', 'کیا آپ مدد کر سکتے ہیں؟', 'Could you help?'], ['Mujhe bataiye', 'مجھے بتائیے', 'Please tell me']] },
      phrases: [['ijaazat', 'Ab ijaazat dijiye', 'اب اجازت دیجیے', 'Please allow me to leave now (a polite goodbye)'], ['bata-sakte', 'Kya aap mujhe bata sakte hain?', 'کیا آپ مجھے بتا سکتے ہیں؟', 'Could you tell me?'], ['dua', 'Mere liye dua kijiye', 'میرے لیے دعا کیجیے', 'Please pray for me'], ['khayal', 'Apna khayal rakhiye', 'اپنا خیال رکھیے', 'Take care of yourself']],
      talk: { title: 'Leaving after a visit', lines: [['You', 'Khala, ab ijaazat dijiye. Der ho gayi hai.', 'خالہ، اب اجازت دیجیے۔ دیر ہو گئی ہے۔', 'Khala, please excuse us now. It is getting late.'], ['Khala', 'Itni jaldi? Chai to pee kar jaao!', 'اتنی جلدی؟ چائے تو پی کر جاؤ!', 'So soon? At least have tea before you go!'],
        ['You', 'Agli baar zaroor. Apna khayal rakhiye.', 'اگلی بار ضرور۔ اپنا خیال رکھیے۔', 'Next time for sure. Take care of yourself.'], ['Khala', 'Tum bhi. Allah hafiz!', 'تم بھی۔ اللہ حافظ!', 'You too. Goodbye!']] } },
    { id: 'l3-weather', name: 'Weather and comparing',
      words: [['mausam', 'mausam', 'موسم', 'weather, season'], ['garmi', 'garmi', 'گرمی', 'heat, summer'], ['sardi', 'sardi', 'سردی', 'cold, winter'], ['barish', 'barish', 'بارش', 'rain'], ['barf', 'barf', 'برف', 'snow, ice'], ['dhoop', 'dhoop', 'دھوپ', 'sunshine'], ['thanda', 'thanda', 'ٹھنڈا', 'cold'], ['garam', 'garam', 'گرم', 'hot'], ['zyada', 'zyada', 'زیادہ', 'more'], ['kam', 'kam', 'کم', 'less']],
      grammar: { title: 'More than: se zyada', explain: [
        'To compare, put se after the thing you compare with: Canada Pakistan se thanda hai, Canada is colder than Pakistan.',
        'For "the most", use sab se: sab se achha (the best), sab se thanda (the coldest).'],
        examples: [['Yahan wahan se zyada sardi hai', 'یہاں وہاں سے زیادہ سردی ہے', 'It is colder here than there'], ['Aaj kal se garam hai', 'آج کل سے گرم ہے', 'Today is hotter than yesterday'], ['Yeh sab se achha hai', 'یہ سب سے اچھا ہے', 'This is the best']] },
      phrases: [['mausam-kaisa', 'Wahan mausam kaisa hai?', 'وہاں موسم کیسا ہے؟', 'How is the weather there?'], ['barf-gir', 'Yahan barf gir rahi hai', 'یہاں برف گر رہی ہے', 'It is snowing here'], ['bohat-garmi', 'Bohat garmi hai', 'بہت گرمی ہے', 'It is very hot']],
      talk: { title: 'Canada and Pakistan', lines: [['Dadi', 'Wahan mausam kaisa hai?', 'وہاں موسم کیسا ہے؟', 'How is the weather there?'], ['You', 'Bohat sardi hai, Dadi. Barf gir rahi hai.', 'بہت سردی ہے، دادی۔ برف گر رہی ہے۔', 'It is very cold, Dadi. It is snowing.'],
        ['Dadi', 'Yahan to bohat garmi hai!', 'یہاں تو بہت گرمی ہے!', 'Here it is very hot!'], ['You', 'Canada Pakistan se bohat zyada thanda hai.', 'کینیڈا پاکستان سے بہت زیادہ ٹھنڈا ہے۔', 'Canada is much colder than Pakistan.']] } },
    { id: 'l3-can', name: 'Can, must, should',
      words: [['sakna', 'sakna', 'سکنا', 'to be able to'], ['parna', 'parna', 'پڑنا', 'to have to (must)'], ['chahiye-v', 'chahiye', 'چاہیے', 'should'], ['zaroori', 'zaroori', 'ضروری', 'important, necessary'], ['koshish', 'koshish', 'کوشش', 'try, effort'], ['mushkil', 'mushkil', 'مشکل', 'difficult'], ['aasaan', 'aasaan', 'آسان', 'easy']],
      grammar: { title: 'Can, must and should', explain: [
        'Can: verb stem + sakta hoon: main Urdu bol sakta hoon, I can speak Urdu.',
        'Must: mujhe + verb + parega (will have to) or parta hai (always has to): mujhe jaana parega, I will have to go.',
        'Should: mujhe + verb + chahiye: mujhe zyada Urdu bolni chahiye, I should speak more Urdu.'],
        examples: [['Main thodi Urdu bol sakta hoon', 'میں تھوڑی اردو بول سکتا ہوں', 'I can speak a little Urdu'], ['Mujhe kal kaam par jaana parega', 'مجھے کل کام پر جانا پڑے گا', 'I will have to go to work tomorrow'], ['Aap ko aaraam karna chahiye', 'آپ کو آرام کرنا چاہیے', 'You should rest']] },
      phrases: [['koshish', 'Main koshish karunga', 'میں کوشش کروں گا', 'I will try'], ['mushkil-hai', 'Urdu mushkil hai, lekin main seekh raha hoon', 'اردو مشکل ہے، لیکن میں سیکھ رہا ہوں', 'Urdu is hard, but I am learning'], ['bol-sakta', 'Main thodi Urdu bol sakta hoon', 'میں تھوڑی اردو بول سکتا ہوں', 'I can speak a little Urdu']],
      talk: { title: 'Speaking Urdu with Nani', lines: [['Nani', 'Tum to ab Urdu bolne lage ho!', 'تم تو اب اردو بولنے لگے ہو!', 'You have started speaking Urdu now!'], ['You', 'Jee, main koshish kar raha hoon. Mushkil hai, lekin achhi lagti hai.', 'جی، میں کوشش کر رہا ہوں۔ مشکل ہے، لیکن اچھی لگتی ہے۔', 'Yes, I am trying. It is hard, but I like it.'],
        ['Nani', 'Roz thodi baat kiya karo.', 'روز تھوڑی بات کیا کرو۔', 'Talk a little every day.'], ['You', 'Zaroor. Mujhe aap se roz baat karni chahiye.', 'ضرور۔ مجھے آپ سے روز بات کرنی چاہیے۔', 'Definitely. I should talk with you every day.']] } }
  ]
};
