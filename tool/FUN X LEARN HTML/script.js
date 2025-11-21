// الدروس الـ40 مع الكود والأمثلة
const lessons = [
{title:"الدرس 1: مقدمة HTML", content:"HTML هي لغة ترميز لإنشاء صفحات الويب.", codeExample:"<!DOCTYPE html>\n<html>\n<head>\n<title>صفحة HTML بسيطة</title>\n</head>\n<body>\n<h1>مرحبا بالعالم!</h1>\n<p>هذه صفحة HTML أولى.</p>\n</body>\n</html>"},
{title:"الدرس 2: العناوين", content:"العناوين من h1 إلى h6.", codeExample:"<h1>العنوان الرئيسي</h1>\n<h2>العنوان الثانوي</h2>\n<h3>العنوان الثالث</h3>"},
{title:"الدرس 3: الفقرات", content:"Paragraphs تستخدم لكتابة النصوص.", codeExample:"<p>هذه فقرة نصية.</p>\n<p>فقرة أخرى.</p>"},
{title:"الدرس 4: الروابط", content:"لإضافة روابط نستخدم العنصر a.", codeExample:"<a href='https://www.google.com'>اذهب إلى جوجل</a>"},
{title:"الدرس 5: الصور", content:"لإضافة صور نستخدم العنصر img.", codeExample:"<img src='image.jpg' alt='صورة مثال' width='200'>"},
{title:"الدرس 6: القوائم غير المرتبة", content:"القوائم ul و li.", codeExample:"<ul>\n<li>العنصر 1</li>\n<li>العنصر 2</li>\n<li>العنصر 3</li>\n</ul>"},
{title:"الدرس 7: القوائم المرتبة", content:"القوائم ol و li.", codeExample:"<ol>\n<li>العنصر الأول</li>\n<li>العنصر الثاني</li>\n</ol>"},
{title:"الدرس 8: الجداول", content:"إنشاء الجداول باستخدام table, tr, th, td.", codeExample:"<table border='1'>\n<tr><th>اسم</th><th>عمر</th></tr>\n<tr><td>Ali</td><td>25</td></tr>\n<tr><td>Sara</td><td>22</td></tr>\n</table>"},
{title:"الدرس 9: النماذج Forms", content:"Forms تستخدم لجمع البيانات.", codeExample:"<form>\n<label for='name'>الاسم:</label>\n<input type='text' id='name' name='name'>\n<input type='submit' value='ارسال'>\n</form>"},
{title:"الدرس 10: التعليقات", content:"التعليقات لا تظهر في المتصفح.", codeExample:"<!-- هذه تعليق -->"},
{title:"الدرس 11: Textarea", content:"لإدخال نص كبير نستخدم Textarea.", codeExample:"<textarea rows='4' cols='50'>اكتب هنا...</textarea>"},
{title:"الدرس 12: Select", content:"القائمة المنسدلة Select مع Options.", codeExample:"<select>\n<option value='1'>واحد</option>\n<option value='2'>اثنان</option>\n</select>"},
{title:"الدرس 13: Input أنواع مختلفة", content:"Text, password, checkbox, radio.", codeExample:"<input type='text' name='username'>\n<input type='password' name='pass'>\n<input type='checkbox' name='check'>\n<input type='radio' name='gender' value='male'>"},
{title:"الدرس 14: عناصر Inline", content:"span, a, strong, em.", codeExample:"<p>هذا <strong>نص قوي</strong> و <em>مائل</em>.</p>"},
{title:"الدرس 15: عناصر Block", content:"div, p, h1-h6.", codeExample:"<div>\n<p>فقرة داخل div</p>\n</div>"},
{title:"الدرس 16: الصور مع الروابط", content:"ربط صورة برابط.", codeExample:"<a href='https://google.com'><img src='image.jpg' alt='صورة'></a>"},
{title:"الدرس 17: Audio", content:"لإضافة صوت.", codeExample:"<audio controls>\n<source src='audio.mp3' type='audio/mpeg'>\n</audio>"},
{title:"الدرس 18: Video", content:"لإضافة فيديو.", codeExample:"<video width='320' height='240' controls>\n<source src='video.mp4' type='video/mp4'>\n</video>"},
{title:"الدرس 19: Iframe", content:"لإضافة صفحة داخل صفحة.", codeExample:"<iframe src='https://www.example.com' width='300' height='200'></iframe>"},
{title:"الدرس 20: Meta Tags", content:"Meta tags للمعلومات عن الصفحة.", codeExample:"<meta charset='UTF-8'>\n<meta name='description' content='مثال HTML'>"},
{title:"الدرس 21: Title Tag", content:"Title يظهر في تبويب المتصفح.", codeExample:"<title>عنوان الصفحة</title>"},
{title:"الدرس 22: CSS خارجي", content:"ربط CSS خارجي.", codeExample:"<link rel='stylesheet' href='style.css'>"},
{title:"الدرس 23: الخلفيات", content:"تعيين خلفية لصفحة أو div.", codeExample:"<style>\nbody { background-image: url('bg.jpg'); }\n</style>"},
{title:"الدرس 24: hr و br", content:"الخطوط والفواصل.", codeExample:"<p>فقرة</p>\n<br>\n<hr>"},
{title:"الدرس 25: Lists مع Links", content:"قوائم مع روابط.", codeExample:"<ul>\n<li><a href='#'>Link1</a></li>\n<li><a href='#'>Link2</a></li>\n</ul>"},
{title:"الدرس 26: header, footer", content:"العناصر الدلالية.", codeExample:"<header>رأس الصفحة</header>\n<footer>تذييل</footer>"},
{title:"الدرس 27: section, article", content:"العناصر الدلالية.", codeExample:"<section>قسم</section>\n<article>مقال</article>"},
{title:"الدرس 28: nav, aside", content:"عناصر التنقل والجانب.", codeExample:"<nav>قائمة التنقل</nav>\n<aside>جانب</aside>"},
{title:"الدرس 29: figure, figcaption", content:"لإضافة صورة مع وصف.", codeExample:"<figure><img src='img.jpg'><figcaption>الوصف</figcaption></figure>"},
{title:"الدرس 30: strong, em, mark", content:"التنسيق النصي.", codeExample:"<p>هذا <strong>قوي</strong> و <em>مائل</em> و <mark>مميز</mark></p>"},
{title:"الدرس 31: Abbreviation", content:"عنصر مختصر.", codeExample:"<abbr title='HyperText Markup Language'>HTML</abbr>"},
{title:"الدرس 32: Blockquote", content:"اقتباسات.", codeExample:"<blockquote>هذا اقتباس طويل.</blockquote>"},
{title:"الدرس 33: Code", content:"عرض كود.", codeExample:"<p>هذا <code>&lt;div&gt;مثال&lt;/div&gt;</code></p>"},
{title:"الدرس 34: Pre", content:"عرض نص منسق.", codeExample:"<pre>النص منسق\nمسافة محفوظة</pre>"},
{title:"الدرس 35: Small", content:"نص صغير.", codeExample:"<p>هذا <small>نص صغير</small></p>"},
{title:"الدرس 36: Sub, Sup", content:"نص أسفل/أعلى.", codeExample:"H<sub>2</sub>O و X<sup>2</sup>"},
{title:"الدرس 37: Lists HTML5", content:"قوائم تعريف dl, dt, dd.", codeExample:"<dl>\n<dt>HTML</dt>\n<dd>لغة ترميز</dd>\n</dl>"},
{title:"الدرس 38: Details, Summary", content:"لإظهار تفاصيل قابلة للطي.", codeExample:"<details><summary>معلومات</summary>المحتوى هنا</details>"},
{title:"الدرس 39: Audio/Video HTML5", content:"أمثلة متقدمة.", codeExample:"<video controls src='video.mp4'></video>\n<audio controls src='audio.mp3'></audio>"},
{title:"الدرس 40: مشروع صغير", content:"صفحة ويب بسيطة.", codeExample:"<!DOCTYPE html>\n<html>\n<head><title>مشروع صغير</title></head>\n<body>\n<h1>مشروع HTML</h1>\n<p>ابدأ بكتابة صفحتك هنا!</p>\n</body>\n</html>"}
];

let currentLesson = parseInt(localStorage.getItem('currentLesson')) || 0;
const savedCodes = JSON.parse(localStorage.getItem('savedCodes')) || {};

const titleEl = document.getElementById('lesson-title');
const contentEl = document.getElementById('lesson-content');
const codeEl = document.getElementById('lesson-code');
const editorEl = document.getElementById('editor');
const previewEl = document.getElementById('preview');
const counterEl = document.getElementById('lesson-counter');

function showLesson(index){
  const lesson = lessons[index];
  titleEl.textContent = lesson.title;
  contentEl.textContent = lesson.content;
  codeEl.textContent = lesson.codeExample;

  // خلي الـtextarea فارغ للمستخدم ليكتب الكود بنفسه
  editorEl.value = '';
  previewEl.srcdoc = '';
  
  counterEl.textContent = `درس ${index+1} من ${lessons.length}`;
  localStorage.setItem('currentLesson', index);
}

editorEl.addEventListener('input', ()=>{
  savedCodes[currentLesson] = editorEl.value;
  localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
});

document.getElementById('next-btn').addEventListener('click', ()=>{
  if(currentLesson < lessons.length-1){
    currentLesson++;
    showLesson(currentLesson);
  } else alert("أنت في آخر درس!");
});

document.getElementById('prev-btn').addEventListener('click', ()=>{
  if(currentLesson > 0){
    currentLesson--;
    showLesson(currentLesson);
  } else alert("أنت في أول درس!");
});

document.getElementById('run-btn').addEventListener('click', ()=>{
  previewEl.srcdoc = editorEl.value;
});

document.getElementById('copy-btn').addEventListener('click', ()=>{
  navigator.clipboard.writeText(editorEl.value).then(()=>{ alert("تم نسخ الكود!"); });
});

// Dark/Light mode
const modeToggle = document.getElementById('mode-toggle');
modeToggle.addEventListener('click', ()=>{
  document.body.classList.toggle('light');
});

showLesson(currentLesson);