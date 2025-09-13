const generateBtn = document.getElementById('generateBtn');
const qrcodeContainer = document.getElementById('qrcode');
const urlInput = document.getElementById('urlInput');

function generateQRCode() {
    const url = urlInput.value.trim();
    if (!url) {
        alert("الرجاء إدخال رابط!");
        return;
    }
    qrcodeContainer.innerHTML = "";
    new QRCode(qrcodeContainer, {
        text: url,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

// إنشاء QR Code افتراضي عند تحميل الصفحة
window.onload = generateQRCode;

generateBtn.addEventListener('click', generateQRCode);
