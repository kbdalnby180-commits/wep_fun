# دليل Fun X — محاكي تداول (شبيه ExpertOption/OlympTrade) — بالعربي

## محتويات الحزمة
- `index.html` — الواجهة الأمامية (تعمل أوفلاين، افتح في المتصفح).
- `styles.css` — أنماط الواجهة.
- `app.js` — منطق المحاكاة، التداول، الواجهة، والحفظ المحلي.
- `README.md` — هذا الملف (شرح تفصيلي لكل جزء) — شامل أمثلة باك-إند بلغة Java وNode.js.

## شرح كل جزء في اللعبة (بالعربي)
### الواجهة العامة
- الشريط الأيسر: يحتوي على علامة الموقع، اختيار المبلغ، أزرار شراء/بيع، إعدادات المدة والعائد، وأدوات سريعة مثل التصدير وإعادة التعيين.
- منتصف الصفحة: المخطط البياني (يمكن تبديل بين خطوط وشموع)، ويعرض السعر الحالي في الأعلى.
- الجهة اليمنى: سجل الصفقات، وحالة الوضع (تعليمي/لعب)، وإعدادات الأداء (تغيير سرعة التحديث وعدد نقاط الرسم).

### العناصر والوظائف
1. **Balance (الرصيد):** رصيد وهمي يبدأ بـ 1000$ يُستخدم لفتح صفقات.
2. **أزرار المبالغ الجاهزة:** تسهل اختيار مبالغ سريعة (1$، 5$، 10$، 50$) أو إدخال مبلغ مخصص.
3. **BUY / SELL:** فتح صفقة توقعًا لتحرك السعر للأعلى (شراء) أو للأسفل (بيع).
4. **المدة (Duration):** زمن انتهاء الصفقة (30s، 1m، 5m...). عند انتهاء الزمن يُقارن السعر النهائي بالسعر عند فتح الصفقة.
5. **العائد (Payout):** نسبة العائد التي تُستخدم لحساب الربح المحتمل عند النجاح.
6. **المخطط:** يُحاكي حركة السعر عبر محاكاة عشوائية. يمكنك تفعيل الشموع أو متوسط متحرك MA.
7. **سجل الصفقات:** يعرض كل صفقة (مفتوحة/منتهية) مع الربح/الخسارة.
8. **تصدير CSV:** لتحميل سجل الصفقات ومشاركته أو تحليله خارجيًا.
9. **Leaderboard (محلي):** تُحفظ نتائج الفوز محليًا في `localStorage` ويمكنك تصديرها واستيرادها (في النسخة Pro السابقة).

### كيف تُحسب الأرباح/الخسائر (مبسّط)
- عند فتح صفقة تُخصم قيمة المبلغ من الرصيد فورًا (كمخاطرة).
- عند انتهاء الصفقة:
  - إذا نجحت (اتجه السعر كما توقعت) فتحسب الربح = amount * payout * relative_change.
  - إذا خسرت، المبلغ مفقود (رصيدك لا يرجع).
- هذه حسابات مبسطة للتدريب — ليست تداول حقيقي.

## أمثلة باك-إند (لو حبيت تربط Leaderboard أو حفظ سحابي)
### مثال Java (Spring Boot) — API بسيط للـ leaderboard
```java
// ملف: LeaderboardController.java (مقتطف)
@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {
    private List<Map<String,Object>> lb = new ArrayList<>();
    @GetMapping
    public List<Map<String,Object>> getLb(){ return lb; }
    @PostMapping
    public ResponseEntity<?> postEntry(@RequestBody Map<String,Object> entry){
        lb.add(entry);
        lb.sort((a,b)->Double.compare((Double)b.get("balance"), (Double)a.get("balance")));
        if(lb.size()>50) lb = lb.subList(0,50);
        return ResponseEntity.ok(Map.of("status","ok"));
    }
}
```
تشغيل المشروع يحتاج `spring-boot-starter-web` وإعداد بسيط — هذا كافٍ كـ backend محلي.

### مثال Node.js (Express)
```js
// server.js
const express = require('express');
const app = express();
app.use(express.json());
let lb = [];
app.get('/api/leaderboard', (req,res)=> res.json(lb));
app.post('/api/leaderboard', (req,res)=>{ lb.push(req.body); lb.sort((a,b)=> b.balance - a.balance); lb = lb.slice(0,50); res.json({status:'ok'}); });
app.listen(3000, ()=> console.log('listening 3000'));
```

## نصائح لتقليل التقطّع (Performance)
- زيادة `updateInterval` (في الواجهة) إلى 2000 أو 3000 ملّي ثانية.
- تقليل `maxPoints` إلى 50 أو 100.
- تعطيل الشموع أو MA إذا لاحظت بطءًا.
- فتح اللعبة في متصفح حديث (Chrome/Edge/Firefox) وإغلاق تبويبات أخرى الكثيرة.

## كيف أضيف دعم Java كمثال عملي؟
- يمكنك تشغيل مثال Spring Boot كمشروع Maven أو Gradle ثم استدعاء الـ API من الواجهة عبر `fetch('/api/leaderboard', {method:'POST', body: JSON.stringify({...})})` بعد تشغيل السيرفر محليًا.

---
### طرق الاستخدام
1. لفك الضغط: ضع الملفات في فولدر وافتح `index.html` في المتصفح.
2. لو حابب ربط سيرفر: استعمل ملفات المثال أعلاه وغيّر واجهة `app.js` على الدوال التي تحفظ الـ leaderboard في `localStorage` لتستعمل `fetch` إلى API.

