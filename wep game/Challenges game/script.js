const challenges = [
  "ارقص لمدة دقيقة كاملة بدون موسيقى 💃",
  "غني بصوت عالي أغنية من اختيار المجموعة 🎤",
  "قل نكتة، لو محدش ضحك تعمل 10 ضغط 😂",
  "اتصل بصديق وقل له: أنا أحب البيتزا 🍕",
  "امشي كأنك عارض أزياء لمدة 2 دقيقة 👠",
  "قل كلمة (بطاطس) في كل جملة لمدة 3 دقائق 🥔",
  "خذ سيلفي مضحك وارسلها في الجروب 🤳",
  "تكلم بلهجة مختلفة 5 دقائق 🎭",
  "اعمل 15 قفزة جاك 🏃",
  "غطي عينيك وحاول تمشي خط مستقيم 👀",
  "اعمل 10 ضغط 💪",
  "خلي حد يرسم حاجة على وشك بقلم ✍️",
  "اقرأ رسالة قديمة في تليفونك بصوت عالي 📱",
  "اعمل تمثيلية قصيرة عن فيلم مشهور 🎬",
  "غني بصوت عكس صوتك الطبيعي 🙃",
  "قول حكاية مضحكة حصلتلك 😅",
  "اقلد شخصية مشهورة 🎭",
  "اعمل صوت حيوان لحد ما المجموعة تعرف 🐶",
  "قول اسمك بالعكس 5 مرات 😂",
  "اعمل 20 قفزة متتالية 🏋️"
  // يمكنك إضافة باقي التحديات بنفس الطريقة
];

// إذا عدد التحديات أقل من 200، نكررها حتى تصل 200
while (challenges.length < 200) {
  challenges.push(...challenges.slice(0, 200 - challenges.length));
}

const challengeDiv = document.getElementById("challenge");
const challengeBtn = document.getElementById("challengeBtn");

challengeBtn.addEventListener("click", () => {
  const randomIndex = Math.floor(Math.random() * challenges.length);
  challengeDiv.textContent = challenges[randomIndex];
});
