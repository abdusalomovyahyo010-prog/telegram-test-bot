require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')

const token = process.env.BOT_TOKEN
const channelUsername = process.env.CHANNEL_USERNAME
const appUrl = process.env.APP_URL

if (!token) {
	console.error('BOT_TOKEN topilmadi. .env fayliga bot tokenini yozing.')
	process.exit(1)
}

if (!channelUsername || !appUrl) {
	console.error('CHANNEL_USERNAME va APP_URL .env faylida bo‘lishi kerak.')
	process.exit(1)
}

const bot = new TelegramBot(token, { polling: false })

const languages = {
	uz: 'O‘zbekcha',
	ru: 'Русский',
	en: 'English',
}

function languageKeyboard() {
	return {
		inline_keyboard: [
			[
				{ text: 'O‘zbekcha', callback_data: 'lang_uz' },
				{ text: 'Русский', callback_data: 'lang_ru' },
				{ text: 'English', callback_data: 'lang_en' },
			],
		],
	}
}

function repetitionKeyboard() {
	return {
		inline_keyboard: [
			[
				{ text: 'HTML', callback_data: 'repeat_html' },
				{ text: 'CSS', callback_data: 'repeat_css' },
				{ text: 'JS', callback_data: 'repeat_js' },
			],
		],
	}
}

function testCountKeyboard(subject) {
	return {
		inline_keyboard: [
			[
				{ text: '10 ta', callback_data: `count_${subject}_10` },
				{ text: '20 ta', callback_data: `count_${subject}_20` },
				{ text: '40 ta', callback_data: `count_${subject}_40` },
			],
		],
	}
}

const questionBanks = {
	html: [
		{ question: 'HTML nimaning qisqartmasi?', options: ['HyperText Markup Language', 'HighText Machine Language', 'Home Tool Markup Language'], answer: 0 },
		{ question: 'Eng katta sarlavha tegi qaysi?', options: ['<h6>', '<h1>', '<head>'], answer: 1 },
		{ question: 'Havola yaratish uchun qaysi teg ishlatiladi?', options: ['<link>', '<a>', '<url>'], answer: 1 },
		{ question: 'Rasm qo‘shish uchun qaysi teg ishlatiladi?', options: ['<image>', '<picture>', '<img>'], answer: 2 },
		{ question: 'Tartibli ro‘yxat tegi qaysi?', options: ['<ul>', '<ol>', '<list>'], answer: 1 },
		{ question: 'Matn paragrafi tegi qaysi?', options: ['<p>', '<text>', '<paragraph>'], answer: 0 },
		{ question: 'HTML hujjatining asosiy ko‘rinadigan qismi qaysi?', options: ['<body>', '<main>', '<content>'], answer: 0 },
		{ question: 'Forma yuborish tugmasi uchun qaysi input turi ishlatiladi?', options: ['send', 'submit', 'button-submit'], answer: 1 },
		{ question: 'HTML izohi qanday yoziladi?', options: ['// izoh', '/* izoh */', '<!-- izoh -->'], answer: 2 },
		{ question: 'Jadval qatori tegi qaysi?', options: ['<td>', '<tr>', '<row>'], answer: 1 },
		{ question: 'HTML5 hujjati boshida qaysi deklaratsiya yoziladi?', options: ['<!DOCTYPE html>', '<html5>', '<document html>'], answer: 0 },
		{ question: 'Rasm yuklanmasa ko‘rsatiladigan matn qaysi atributda beriladi?', options: ['title', 'alt', 'src'], answer: 1 },
		{ question: 'Sahifa tilini ko‘rsatish uchun qaysi atribut ishlatiladi?', options: ['lang', 'language', 'locale'], answer: 0 },
		{ question: 'HTML faylining kodlashini belgilash uchun qaysi meta yoziladi?', options: ['<meta charset="UTF-8">', '<meta encoding="UTF-8">', '<charset value="UTF-8">'], answer: 0 },
		{ question: 'Formadagi yozuvni input bilan bog‘laydigan teg qaysi?', options: ['<caption>', '<label>', '<legend>'], answer: 1 },
		{ question: 'Ma’noli, semantik yuqori qism tegi qaysi?', options: ['<top>', '<header>', '<head>'], answer: 1 },
		{ question: 'Ma’noli navigatsiya bo‘limi qaysi teg bilan yoziladi?', options: ['<navigate>', '<nav>', '<menu-link>'], answer: 1 },
		{ question: 'Yangi qatordan boshlash uchun qaysi teg ishlatiladi?', options: ['<newline>', '<br>', '<line>'], answer: 1 },
		{ question: 'Qalin va muhim matn uchun semantik teg qaysi?', options: ['<strong>', '<bold>', '<thick>'], answer: 0 },
		{ question: 'Ochiladigan ro‘yxat yaratish uchun qaysi teg ishlatiladi?', options: ['<dropdown>', '<select>', '<options>'], answer: 1 },
		{ question: 'Havola manzili qaysi atributda yoziladi?', options: ['src', 'href', 'link'], answer: 1 },
		{ question: 'HTML elementiga yagona identifikator beradigan atribut qaysi?', options: ['id', 'key', 'unique'], answer: 0 },
		{ question: 'Bir elementga bir nechta class berish mumkinmi?', options: ['Ha, bo‘sh joy bilan ajratiladi', 'Yo‘q, faqat bitta mumkin', 'Faqat CSS orqali mumkin'], answer: 0 },
		{ question: 'HTML5 ning asosiy mazmun qismi uchun qaysi teg mos?', options: ['<main>', '<center>', '<content>'], answer: 0 },
		{ question: 'Sahifaning pastki qismi uchun semantik teg qaysi?', options: ['<bottom>', '<footer>', '<end>'], answer: 1 },
		{ question: 'Mustaqil mazmun bo‘limi uchun qaysi semantik teg ishlatiladi?', options: ['<section>', '<part>', '<block>'], answer: 0 },
		{ question: 'Email kiritish maydoni uchun input turi qaysi?', options: ['mail', 'email', 'address'], answer: 1 },
		{ question: 'Formadagi maydonni majburiy qilish atributi qaysi?', options: ['needed', 'required', 'must-fill'], answer: 1 },
		{ question: 'Input ichidagi yordamchi matn qaysi atributda beriladi?', options: ['placeholder', 'hint', 'help-text'], answer: 0 },
		{ question: 'Jadval sarlavha katagi uchun qaysi teg ishlatiladi?', options: ['<th>', '<thead-cell>', '<header-cell>'], answer: 0 },
		{ question: 'Video boshqaruv tugmalarini chiqarish atributi qaysi?', options: ['buttons', 'controls', 'player'], answer: 1 },
		{ question: 'JavaScript faylini HTML ga ulash uchun qaysi teg ishlatiladi?', options: ['<js>', '<script>', '<javascript>'], answer: 1 },
		{ question: 'Viewport sozlamasi odatda qaysi meta atributida beriladi?', options: ['name="viewport"', 'type="viewport"', 'screen="viewport"'], answer: 0 },
		{ question: 'Yangi oynada ochiladigan havola uchun target qiymati qaysi?', options: ['_blank', '_newtab', 'new-window'], answer: 0 },
		{ question: 'Maxsus ma’lumot saqlash uchun HTML atributi qaysi prefiks bilan boshlanadi?', options: ['custom-', 'data-', 'attr-'], answer: 1 },
		{ question: 'Elementni vaqtincha ko‘rinmas qilish uchun qaysi global atribut ishlatiladi?', options: ['hidden', 'invisible', 'display-none'], answer: 0 },
		{ question: 'HTML faylida tashqi CSS ulash tegi qaysi?', options: ['<style src="style.css">', '<link rel="stylesheet" href="style.css">', '<css href="style.css">'], answer: 1 },
		{ question: 'Formadagi tanlash katagi uchun input turi qaysi?', options: ['check', 'checkbox', 'selectbox'], answer: 1 },
		{ question: 'HTML belgilarini to‘g‘ri ko‘rsatish uchun qaysi kodlash tavsiya qilinadi?', options: ['UTF-8', 'ASCII-2', 'HTML-16'], answer: 0 },
		{ question: 'HTML atribut qiymati odatda qaysi belgilar orasida yoziladi?', options: ['Qavslar orasida', 'Qo‘shtirnoqlar orasida', 'Yulduzchalar orasida'], answer: 1 },
	],
	css: [
		{ question: 'CSS nimaning qisqartmasi?', options: ['Cascading Style Sheets', 'Creative Style System', 'Computer Styled Syntax'], answer: 0 },
		{ question: 'Matn rangini o‘zgartirish xususiyati qaysi?', options: ['font-color', 'text-color', 'color'], answer: 2 },
		{ question: 'Tashqi masofa qaysi xususiyat bilan beriladi?', options: ['padding', 'margin', 'spacing'], answer: 1 },
		{ question: 'Ichki masofa qaysi xususiyat bilan beriladi?', options: ['padding', 'margin', 'inside'], answer: 0 },
		{ question: 'Flex konteyner yaratish qiymati qaysi?', options: ['display: flex', 'position: flex', 'layout: flex'], answer: 0 },
		{ question: 'Fon rangini o‘zgartirish xususiyati qaysi?', options: ['background-color', 'bg-color', 'color-background'], answer: 0 },
		{ question: 'CSS izohi qanday yoziladi?', options: ['// izoh', '/* izoh */', '<!-- izoh -->'], answer: 1 },
		{ question: 'Elementni ID orqali tanlash belgisi qaysi?', options: ['.', '#', '@'], answer: 1 },
		{ question: 'Elementni class orqali tanlash belgisi qaysi?', options: ['.', '#', ':'], answer: 0 },
		{ question: 'Shrift o‘lchami qaysi xususiyat bilan beriladi?', options: ['font-size', 'text-size', 'size'], answer: 0 },
		{ question: 'CSS box model tarkibiga qaysi qismlar kiradi?', options: ['content, padding, border, margin', 'text, image, link, table', 'header, main, footer, nav'], answer: 0 },
		{ question: 'Elementni grid konteyner qilish qiymati qaysi?', options: ['display: grid', 'layout: grid', 'position: grid'], answer: 0 },
		{ question: 'Hover holatini tanlash selektori qaysi?', options: ['::hover', ':hover', '.hover'], answer: 1 },
		{ question: 'Burchaklarni yumaloqlash xususiyati qaysi?', options: ['corner-radius', 'border-radius', 'radius-border'], answer: 1 },
		{ question: 'Elementning shaffofligini boshqaradigan xususiyat qaysi?', options: ['transparency', 'opacity', 'visibility-color'], answer: 1 },
		{ question: 'Media query qaysi belgi bilan boshlanadi?', options: ['@media', '#media', ':media'], answer: 0 },
		{ question: 'Elementni sahifaga nisbatan mutlaq joylashtirish qiymati qaysi?', options: ['position: absolute', 'display: absolute', 'layout: absolute'], answer: 0 },
		{ question: 'Qavatlar ustma-ust joylashish tartibini qaysi xususiyat boshqaradi?', options: ['layer-index', 'z-index', 'stack-order'], answer: 1 },
		{ question: 'Flex elementlar yo‘nalishini beradigan xususiyat qaysi?', options: ['flex-direction', 'flex-way', 'direction-flex'], answer: 0 },
		{ question: 'Element kengligini ota elementdan oshirmaslik uchun qaysi xususiyat ishlatiladi?', options: ['max-width', 'limit-width', 'width-maximum'], answer: 0 },
		{ question: 'CSS qoidalarining ustunligini aniqlashda qaysi tushuncha ishlatiladi?', options: ['specificity', 'priority-name', 'style-order-only'], answer: 0 },
		{ question: 'Element o‘lchamiga padding va borderni qo‘shib hisoblash qiymati qaysi?', options: ['box-sizing: border-box', 'size-mode: inner', 'box-model: full'], answer: 0 },
		{ question: 'Ortiqcha kontentni yashirish uchun qaysi qoida ishlatiladi?', options: ['overflow: hidden', 'content: hide', 'display: crop'], answer: 0 },
		{ question: 'display: none elementga qanday ta’sir qiladi?', options: ['Joyini saqlab ko‘rinmas qiladi', 'Elementni layoutdan olib tashlaydi', 'Faqat rangini o‘zgartiradi'], answer: 1 },
		{ question: 'visibility: hidden elementga qanday ta’sir qiladi?', options: ['Joyini saqlaydi, lekin ko‘rinmaydi', 'Layoutdan butunlay olib tashlaydi', 'Elementni o‘chiradi'], answer: 0 },
		{ question: 'Ekranga nisbatan mahkamlangan element uchun qaysi qiymat mos?', options: ['position: fixed', 'position: screen', 'display: fixed-screen'], answer: 0 },
		{ question: 'Scroll paytida ma’lum joyda yopishib turadigan joylashuv qaysi?', options: ['position: sticky', 'position: attached', 'position: scroll'], answer: 0 },
		{ question: 'Elementni burish yoki siljitish uchun qaysi xususiyat ishlatiladi?', options: ['transform', 'change-position', 'move-style'], answer: 0 },
		{ question: 'Xususiyat o‘zgarishini silliqlashtirish uchun qaysi xususiyat ishlatiladi?', options: ['transition', 'smooth-change', 'animate-style'], answer: 0 },
		{ question: 'CSS animatsiya nomi qaysi qoidada beriladi?', options: ['animation-name', 'motion-name', 'keyframe-name'], answer: 0 },
		{ question: 'Grid ustunlarini belgilaydigan xususiyat qaysi?', options: ['grid-template-columns', 'grid-columns-count', 'columns-grid'], answer: 0 },
		{ question: 'Flex yoki Grid oralig‘ini berish uchun qaysi xususiyat ishlatiladi?', options: ['gap', 'space-between-only', 'distance'], answer: 0 },
		{ question: 'Flex elementlarini ko‘ndalang o‘q bo‘yicha tekislash xususiyati qaysi?', options: ['align-items', 'cross-align', 'items-position'], answer: 0 },
		{ question: 'Flex elementlarini asosiy o‘q bo‘yicha tekislash xususiyati qaysi?', options: ['justify-content', 'main-align', 'content-position'], answer: 0 },
		{ question: 'Rasm yoki video konteynerga qanday joylashishini qaysi xususiyat belgilaydi?', options: ['object-fit', 'media-fit', 'image-position-mode'], answer: 0 },
		{ question: 'CSS da ildiz shriftiga nisbatan o‘lchov birligi qaysi?', options: ['rem', 'rootpx', 'rpx'], answer: 0 },
		{ question: 'CSS o‘zgaruvchisi nomi odatda qaysi belgilar bilan boshlanadi?', options: ['--', '$$', '@@'], answer: 0 },
		{ question: 'CSS o‘zgaruvchisini ishlatish funksiyasi qaysi?', options: ['css-var()', 'var()', 'use-variable()'], answer: 1 },
		{ question: 'Element ichki kontentini gorizontal o‘rtaga tekislash uchun qaysi qiymat ko‘p ishlatiladi?', options: ['text-align: center', 'align-text: middle', 'horizontal: center'], answer: 0 },
		{ question: 'CSS da barcha elementlarni tanlaydigan selektor qaysi?', options: ['#', '.', '*'], answer: 2 },
	],
	js: [
		{ question: 'JavaScript fayli kengaytmasi qaysi?', options: ['.java', '.js', '.script'], answer: 1 },
		{ question: 'O‘zgarmas qiymat e’lon qilish uchun qaysi kalit so‘z ishlatiladi?', options: ['let', 'var', 'const'], answer: 2 },
		{ question: 'Massivning oxiriga element qo‘shish metodi qaysi?', options: ['push()', 'add()', 'append()'], answer: 0 },
		{ question: 'Konsolga ma’lumot chiqarish usuli qaysi?', options: ['console.log()', 'print()', 'log.console()'], answer: 0 },
		{ question: 'Qat’iy tenglik operatori qaysi?', options: ['=', '==', '==='], answer: 2 },
		{ question: 'Funksiya e’lon qilish kalit so‘zi qaysi?', options: ['function', 'def', 'method'], answer: 0 },
		{ question: 'Obyekt xususiyatiga murojaat qilish usuli qaysi?', options: ['object.property', 'object->property', 'object/property'], answer: 0 },
		{ question: 'Stringni katta harflarga o‘tkazish metodi qaysi?', options: ['toUpperCase()', 'upper()', 'uppercase()'], answer: 0 },
		{ question: 'Shart operatori qaysi?', options: ['if', 'when', 'check'], answer: 0 },
		{ question: 'JSON nimaga asoslangan?', options: ['Faqat massivga', 'JavaScript obyekt yozuviga', 'CSS sintaksisiga'], answer: 1 },
		{ question: 'Qiymat turini aniqlash uchun qaysi operator ishlatiladi?', options: ['type()', 'typeof', 'kindof'], answer: 1 },
		{ question: 'Massiv elementlarini o‘zgartirib yangi massiv qaytaradigan metod qaysi?', options: ['map()', 'changeAll()', 'transformArray()'], answer: 0 },
		{ question: 'Shartga mos massiv elementlarini ajratadigan metod qaysi?', options: ['select()', 'filter()', 'whereArray()'], answer: 1 },
		{ question: 'Massivdagi birinchi mos elementni qaytaradigan metod qaysi?', options: ['find()', 'firstMatch()', 'searchOne()'], answer: 0 },
		{ question: 'Promise tugagach natijani kutish uchun qaysi kalit so‘z ishlatiladi?', options: ['wait', 'await', 'pause'], answer: 1 },
		{ question: 'await odatda qaysi funksiya ichida ishlatiladi?', options: ['async funksiya', 'for funksiya', 'defer funksiya'], answer: 0 },
		{ question: 'DOM elementini CSS selektor orqali topish metodi qaysi?', options: ['document.querySelector()', 'document.findElement()', 'dom.select()'], answer: 0 },
		{ question: 'Hodisaga funksiya biriktirish metodi qaysi?', options: ['onEvent()', 'addEventListener()', 'listenEvent()'], answer: 1 },
		{ question: 'Template literal qaysi belgilar orasida yoziladi?', options: ['bir tirnoq', 'qo‘shtirnoq', 'backtick (`)'], answer: 2 },
		{ question: 'Qiymat mavjud emasligini ifodalovchi maxsus qiymat qaysi?', options: ['empty', 'null', 'none'], answer: 1 },
		{ question: 'Faqat blok ichida amal qiladigan o‘zgaruvchi e’loni qaysi?', options: ['let', 'var-global', 'define'], answer: 0 },
		{ question: 'Massiv yoki obyekt qiymatlarini alohida o‘zgaruvchilarga ajratish nima deyiladi?', options: ['destructuring', 'splitting-only', 'unpacking-css'], answer: 0 },
		{ question: 'Massiv yoki obyekt elementlarini yoyish operatori qaysi?', options: ['...', '>>>', 'spread()'], answer: 0 },
		{ question: 'Funksiyada qolgan argumentlarni massiv sifatida olish uchun qaysi sintaksis ishlatiladi?', options: ['rest operator (...)', 'remaining[]', 'args.rest()'], answer: 0 },
		{ question: 'Funksiya parametri uchun boshlang‘ich qiymat berish mumkinmi?', options: ['Ha, default parameter bilan', 'Yo‘q', 'Faqat class ichida'], answer: 0 },
		{ question: 'Zanjirdagi qiymat null yoki undefined bo‘lsa xato bermaslik uchun qaysi operator ishlatiladi?', options: ['?.', '??.', 'safe-dot'], answer: 0 },
		{ question: 'null yoki undefined bo‘lganda zaxira qiymat beradigan operator qaysi?', options: ['||?', '??', 'fallback()'], answer: 1 },
		{ question: 'Massivdagi barcha elementlar shartga mosligini tekshiradigan metod qaysi?', options: ['every()', 'all()', 'checkAll()'], answer: 0 },
		{ question: 'Massivdagi kamida bitta element shartga mosligini tekshiradigan metod qaysi?', options: ['some()', 'anyElement()', 'existsAll()'], answer: 0 },
		{ question: 'Massivni bitta qiymatga jamlaydigan metod qaysi?', options: ['reduce()', 'combine()', 'joinValues()'], answer: 0 },
		{ question: 'sort() metodi odatda nimani o‘zgartiradi?', options: ['Asl massivni tartiblaydi', 'Har doim yangi massiv qaytaradi', 'Faqat stringni o‘zgartiradi'], answer: 0 },
		{ question: 'Massivdan nusxa olib bir qismini olish metodi qaysi?', options: ['slice()', 'copyPart()', 'segment()'], answer: 0 },
		{ question: 'Massiv ichidan element qo‘shish yoki o‘chirish metodi qaysi?', options: ['splice()', 'editArray()', 'changeAt()'], answer: 0 },
		{ question: 'Tasodifiy son yaratish uchun qaysi funksiya ishlatiladi?', options: ['Math.random()', 'Random.number()', 'Math.randomNumber()'], answer: 0 },
		{ question: 'Kechiktirib funksiya chaqirish uchun qaysi funksiya ishlatiladi?', options: ['setTimeout()', 'delayCall()', 'waitFunction()'], answer: 0 },
		{ question: 'Xatoni ushlab qayta ishlash uchun qaysi konstruksiya ishlatiladi?', options: ['try...catch', 'check...error', 'error...handle'], answer: 0 },
		{ question: 'JavaScriptda xatoni ataylab chiqarish uchun qaysi kalit so‘z ishlatiladi?', options: ['throw', 'raise', 'error'], answer: 0 },
		{ question: 'Hozirgi vaqtni olish uchun qaysi obyekt ishlatiladi?', options: ['Date', 'TimeNow', 'Clock'], answer: 0 },
		{ question: 'Brauzerda foydalanuvchidan matn so‘rash funksiyasi qaysi?', options: ['prompt()', 'askUser()', 'input()'], answer: 0 },
		{ question: 'Boolean qiymatlari qaysilar?', options: ['true va false', 'yes va no', '1 va 2'], answer: 0 },
	],
}

const quizSessions = new Map()
const startMessages = new Map()

async function deleteMessage(chatId, messageId) {
	if (!messageId) return
	try {
		await bot.deleteMessage(chatId, messageId)
	} catch (error) {
		if (/message to delete not found/i.test(error.message)) return
		try {
			await bot.editMessageReplyMarkup(
				{ inline_keyboard: [] },
				{ chat_id: chatId, message_id: messageId },
			)
		} catch (fallbackError) {
			console.error('Eski xabarni o‘chirishda xato:', fallbackError.message)
		}
	}
}

function answerKeyboard(subjectCode, questionIndex, options) {
	return {
		inline_keyboard: options.map((option, answerIndex) => [
			{ text: option, callback_data: `answer_${subjectCode}_${questionIndex}_${answerIndex}` },
		]),
	}
}

function subjectName(subjectCode) {
	return subjectCode === 'html' ? 'HTML' : subjectCode === 'css' ? 'CSS' : 'JavaScript'
}

function shuffleQuestions(questions) {
	const shuffled = [...questions]
	for (let index = shuffled.length - 1; index > 0; index -= 1) {
		const randomIndex = Math.floor(Math.random() * (index + 1))
		;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
	}
	return shuffled
}

function finishQuiz(chatId, session) {
	clearTimeout(session.timer)
	quizSessions.delete(chatId)
	return bot.sendMessage(
		chatId,
		`Test tugadi!\n${subjectName(session.subject)}\nNatija: ${session.score}/${session.questions.length}\nTo‘g‘ri: ${session.score}\nXato: ${session.questions.length - session.score}`,
	)
}

async function askQuestion(chatId, session) {
	if (session.questionIndex >= session.questions.length) {
		return finishQuiz(chatId, session)
	}

	await deleteMessage(chatId, session.messageId)
	const question = session.questions[session.questionIndex]
	const currentNumber = session.questionIndex + 1
	const message = await bot.sendMessage(chatId, `Savol ${currentNumber}/${session.questions.length}\n⏱ 10 sekund\n\n${question.question}`, {
		reply_markup: answerKeyboard(session.subject, session.questionIndex, question.options),
	})
	if (quizSessions.get(chatId) !== session) return message
	session.messageId = message.message_id
	session.timer = setTimeout(() => {
		if (quizSessions.get(chatId) !== session) return
		deleteMessage(chatId, session.messageId).then(() => {
			session.questionIndex += 1
			askQuestion(chatId, session)
		})
	}, 10000)
	return message
}

function startQuiz(chatId, subjectCode, requestedCount) {
	const questions = questionBanks[subjectCode]
	const selectedQuestions = shuffleQuestions(questions).slice(0, requestedCount)
	const session = {
		subject: subjectCode,
		questions: selectedQuestions,
		questionIndex: 0,
		score: 0,
		timer: null,
	}
	const previousSession = quizSessions.get(chatId)
	if (previousSession) clearTimeout(previousSession.timer)
	quizSessions.set(chatId, session)
	return askQuestion(chatId, session)
}

function subscriptionKeyboard() {
	return {
		inline_keyboard: [
			[{ text: 'Kanalga obuna bo‘lish', url: `https://t.me/${channelUsername.replace(/^@/, '')}` }],
			[{ text: 'Obunani tekshirish', callback_data: 'check_subscription' }],
		],
	}
}

function appKeyboard() {
	return {
		inline_keyboard: [[{
			text: 'Ilovani ochish',
			web_app: { url: appUrl },
		}]],
	}
}

function sendLanguageMenu(chatId) {
	return bot.sendMessage(chatId, 'Tilni tanlang:', { reply_markup: languageKeyboard() })
}

function sendSubscriptionMenu(chatId, language = 'uz') {
	const text = language === 'ru'
		? 'Сначала подпишитесь на канал, затем нажмите «Проверить подписку».'
		: language === 'en'
			? 'Subscribe to the channel, then press “Check subscription”.'
			: 'Avval kanalga obuna bo‘ling, keyin «Obunani tekshirish» tugmasini bosing.'
	return bot.sendMessage(chatId, text, { reply_markup: subscriptionKeyboard() })
}

async function isSubscribed(userId) {
	const member = await bot.getChatMember(channelUsername, userId)
	return ['creator', 'administrator', 'member'].includes(member.status)
}

bot.onText(/^\/start(?:@\w+)?$/, (message) => {
	const chatId = message.chat.id
	deleteMessage(chatId, startMessages.get(chatId))
	bot.sendMessage(chatId, 'Salom! Qaysi birini takrorlamoqchisiz?', {
		reply_markup: repetitionKeyboard(),
	}).then((sentMessage) => {
		startMessages.set(chatId, sentMessage.message_id)
	})
})

bot.onText(/^\/help(?:@\w+)?$/, (message) => {
	bot.sendMessage(
		message.chat.id,
		'/start - botni ishga tushirish\n/help - buyruqlar ro‘yxati\n/info - bot haqida\n/id - chat ID ni ko‘rsatish',
	)
})

bot.on('callback_query', async (query) => {
	const chatId = query.message.chat.id
	const data = query.data
	let callbackText = ''
	let showAlert = false

	if (data.startsWith('answer_')) {
		const [, subjectCode, questionIndexText, answerIndexText] = data.split('_')
		const session = quizSessions.get(chatId)
		const questionIndex = Number(questionIndexText)
		const answerIndex = Number(answerIndexText)
		const isCurrentQuestion = session
			&& session.subject === subjectCode
			&& session.questionIndex === questionIndex

		callbackText = isCurrentQuestion
			? session.questions[questionIndex].answer === answerIndex ? 'To‘g‘ri!' : 'Xato!'
			: 'Bu savol uchun vaqt tugagan.'
		showAlert = true
	}

	try {
		await bot.answerCallbackQuery(query.id, { text: callbackText, show_alert: showAlert })
	} catch (error) {
		console.error('Callback javobini yuborishda xato:', error.message)
	}

	await deleteMessage(chatId, query.message.message_id)

	if (data.startsWith('lang_')) {
		const language = data.replace('lang_', '')
		await bot.sendMessage(chatId, `${languages[language]} tanlandi.`)
		await sendSubscriptionMenu(chatId, language)
		return
	}

	if (data.startsWith('repeat_')) {
		const subject = data === 'repeat_html'
			? 'HTML'
			: data === 'repeat_css'
				? 'CSS'
				: 'JavaScript'
		const subjectCode = data.replace('repeat_', '')
		await bot.sendMessage(chatId, `${subject}dan nechta test ishlamoqchisiz?`, {
			reply_markup: testCountKeyboard(subjectCode),
		})
		return
	}

	if (data.startsWith('count_')) {
		const [, subjectCode, count] = data.split('_')
		await startQuiz(chatId, subjectCode, Number(count))
		return
	}

	if (data.startsWith('answer_')) {
		const [, subjectCode, questionIndexText, answerIndexText] = data.split('_')
		const session = quizSessions.get(chatId)
		const questionIndex = Number(questionIndexText)
		const answerIndex = Number(answerIndexText)

		if (!session || session.subject !== subjectCode || session.questionIndex !== questionIndex) {
			await bot.sendMessage(chatId, 'Bu savol uchun vaqt tugagan yoki test yakunlangan.')
			return
		}

		clearTimeout(session.timer)
		if (session.questions[questionIndex].answer === answerIndex) session.score += 1
		session.questionIndex += 1
		await askQuestion(chatId, session)
		return
	}

	if (data === 'check_subscription') {
		try {
			if (await isSubscribed(query.from.id)) {
				await bot.sendMessage(chatId, 'Obuna tasdiqlandi. Ilovani ochishingiz mumkin:', {
					reply_markup: appKeyboard(),
				})
			} else {
				await bot.sendMessage(chatId, 'Siz hali kanalga obuna bo‘lmagansiz.', {
					reply_markup: subscriptionKeyboard(),
				})
			}
		} catch (error) {
			console.error('Obunani tekshirishda xato:', error.message)
			await bot.sendMessage(chatId, 'Tekshirishda xato bo‘ldi. Bot kanalga admin qilinganini tekshiring.')
		}
	}
})

bot.onText(/^\/info(?:@\w+)?$/, (message) => {
	bot.sendMessage(message.chat.id, 'Bu Node.js yordamida yaratilgan Telegram bot.')
})

bot.onText(/^\/id(?:@\w+)?$/, (message) => {
	bot.sendMessage(message.chat.id, `Sizning chat ID: ${message.chat.id}`)
})

bot.onText(/^\/(?!start(?:@\w+)?$|help(?:@\w+)?$|info(?:@\w+)?$|id(?:@\w+)?$).+/, (message) => {
	bot.sendMessage(message.chat.id, 'Bunday buyruq mavjud emas. /help ni yuboring.')
})

bot.on('message', (message) => {
	if (message.text && !message.text.startsWith('/')) {
		bot.sendMessage(message.chat.id, `Siz yozdingiz: ${message.text}`)
	}
})

async function startBot() {
	await bot.deleteWebHook({ drop_pending_updates: true })
	await bot.startPolling()
	console.log('Telegram bot ishga tushdi')
}

startBot().catch((error) => {
	console.error('Botni ishga tushirishda xato:', error.message)
	process.exit(1)
})
