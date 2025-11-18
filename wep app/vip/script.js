// التحقق من الرموز
function checkCode() {
  const input = document.getElementById("codeInput").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  fetch("codes.json")
    .then(response => response.json())
    .then(data => {
      const codes = data.codes;
      const usedCodes = JSON.parse(localStorage.getItem("usedCodes") || "[]");

      if (codes.includes(input) && !usedCodes.includes(input)) {
        // تخزين الرمز كمستخدم
        usedCodes.push(input);
        localStorage.setItem("usedCodes", JSON.stringify(usedCodes));
        localStorage.setItem("loggedIn", "true");
        window.location.href = "main.html";
      } else {
        errorMsg.textContent = "رمز غير صالح أو مستخدم مسبقًا!";
      }
    });
}

// إذا المستخدم سبق وسجل الدخول، يسمح له بالدخول مباشرة
if (window.location.pathname.includes("main.html")) {
  if (!localStorage.getItem("loggedIn")) {
    window.location.href = "login.html";
  }
}
