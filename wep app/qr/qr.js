document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    // =====================================================
    // ELEMENTS
    // =====================================================

    const generateBtn = document.getElementById("generateBtn");
    const copyBtn = document.getElementById("copyBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const clearBtn = document.getElementById("clearBtn");

    const urlInput = document.getElementById("urlInput");
    const qrcodeContainer = document.getElementById("qrcode");

    const qrText = document.getElementById("qrText");
    const toast = document.getElementById("toast");

    let currentURL = "";

    // =====================================================
    // TOAST
    // =====================================================

    function showToast(message) {

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(showToast.timer);

        showToast.timer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2200);

    }

    // =====================================================
    // NORMALIZE URL
    // =====================================================

    function normalizeURL(value) {

        let url = value.trim();

        if (!url) {
            return "";
        }

        /*
         * لو المستخدم كتب:
         *
         * google.com
         *
         * نضيف https:// تلقائيًا.
         */

        if (
            !url.startsWith("http://") &&
            !url.startsWith("https://")
        ) {
            url = "https://" + url;
        }

        return url;

    }

    // =====================================================
    // VALIDATE URL
    // =====================================================

    function isValidURL(url) {

        try {

            const parsed = new URL(url);

            return (
                parsed.protocol === "http:" ||
                parsed.protocol === "https:"
            );

        } catch {
            return false;
        }

    }

    // =====================================================
    // GENERATE QR
    // =====================================================

    function generateQRCode() {

        const rawURL = urlInput.value.trim();

        if (!rawURL) {

            showToast("⚠️ اكتب رابط أولًا");

            urlInput.focus();

            return;

        }

        const url = normalizeURL(rawURL);

        if (!isValidURL(url)) {

            showToast("❌ الرابط غير صحيح");

            urlInput.focus();

            return;

        }

        /*
         * حفظ الرابط الحالي
         */

        currentURL = url;

        /*
         * تحديث input بالرابط بعد تصحيحه
         */

        urlInput.value = url;

        /*
         * حذف QR القديم
         */

        qrcodeContainer.innerHTML = "";

        /*
         * إنشاء QR جديد
         */

        new QRCode(qrcodeContainer, {

            text: url,

            width: 230,
            height: 230,

            colorDark: "#000000",
            colorLight: "#ffffff",

            correctLevel: QRCode.CorrectLevel.H

        });

        qrText.textContent =
            "امسح الكود للوصول إلى الرابط";

        showToast("✅ تم إنشاء QR Code");

    }

    // =====================================================
    // COPY URL
    // =====================================================

    async function copyURL() {

        const url = currentURL || normalizeURL(urlInput.value);

        if (!url) {

            showToast("⚠️ لا يوجد رابط لنسخه");

            return;

        }

        try {

            await navigator.clipboard.writeText(url);

            showToast("📋 تم نسخ الرابط");

        } catch {

            /*
             * طريقة احتياطية للمتصفحات القديمة
             */

            const temp = document.createElement("textarea");

            temp.value = url;

            document.body.appendChild(temp);

            temp.select();

            document.execCommand("copy");

            temp.remove();

            showToast("📋 تم نسخ الرابط");

        }

    }

    // =====================================================
    // DOWNLOAD QR
    // =====================================================

    function downloadQRCode() {

        const canvas =
            qrcodeContainer.querySelector("canvas");

        const image =
            qrcodeContainer.querySelector("img");

        if (!canvas && !image) {

            showToast("⚠️ أنشئ QR Code أولًا");

            return;

        }

        let downloadURL;

        if (canvas) {

            downloadURL = canvas.toDataURL("image/png");

        } else {

            downloadURL = image.src;

        }

        const link = document.createElement("a");

        link.href = downloadURL;

        link.download = "QR-X-Code.png";

        document.body.appendChild(link);

        link.click();

        link.remove();

        showToast("⬇️ تم تحميل QR Code");

    }

    // =====================================================
    // CLEAR
    // =====================================================

    function clearInput() {

        urlInput.value = "";

        currentURL = "";

        qrcodeContainer.innerHTML = "";

        qrText.textContent =
            "أدخل رابطًا لإنشاء QR Code";

        urlInput.focus();

        showToast("🧹 تم مسح الرابط");

    }

    // =====================================================
    // LIVE ENTER
    // =====================================================

    urlInput.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            generateQRCode();

        }

    });

    // =====================================================
    // BUTTONS
    // =====================================================

    generateBtn.addEventListener(
        "click",
        generateQRCode
    );

    copyBtn.addEventListener(
        "click",
        copyURL
    );

    downloadBtn.addEventListener(
        "click",
        downloadQRCode
    );

    clearBtn.addEventListener(
        "click",
        clearInput
    );

    // =====================================================
    // AUTO GENERATE
    // =====================================================

    /*
     * ننتظر تحميل مكتبة QRCode
     */

    function waitForQRCode() {

        if (typeof QRCode !== "undefined") {

            generateQRCode();

            return;

        }

        setTimeout(
            waitForQRCode,
            100
        );

    }

    waitForQRCode();

});