        // مصفوفة الخلفيات
        const wallpapers = [ 
            "wallpar/1.jpg",
            "wallpar/2.jpg",
            "wallpar/3.jpg",
            "wallpar/4.jpg",
            "wallpar/5.jpg",
            "wallpar/6.jpg",
            "wallpar/6.jpg",
            "wallpar/7.jpg",
            "wallpar/8.jpg",
            "wallpar/9.jpg",
            "wallpar/10.jpg",
        ];

        const gallery = document.getElementById("gallery");

        wallpapers.forEach((src, index) => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <img src="${src}" alt="Wallpaper ${index + 1}">
                <div class="info">
                    <h3>خلفية رقم ${index + 1}</h3>
                    <a href="${src}" download>تحميل</a>
                </div>
            `;

            gallery.appendChild(card);
        });