
/* =====================================================
   FUN X WALLPAPERS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =================================================
       WALLPAPERS
    ================================================= */

    const wallpapers = [

        "wallpar/1.jpg",
        "wallpar/2.jpg",
        "wallpar/3.jpg",
        "wallpar/4.jpg",
        "wallpar/5.jpg",
        "wallpar/6.jpg",
        "wallpar/7.jpg",
        "wallpar/8.jpg",
        "wallpar/9.jpg",
        "wallpar/10.jpg"

    ];


    /* =================================================
       ELEMENTS
    ================================================= */

    const gallery =
        document.getElementById(
            "gallery"
        );


    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const clearSearch =
        document.getElementById(
            "clearSearch"
        );


    const wallpaperCount =
        document.getElementById(
            "wallpaperCount"
        );


    const visibleCount =
        document.getElementById(
            "visibleCount"
        );


    const emptyState =
        document.getElementById(
            "emptyState"
        );


    const modal =
        document.getElementById(
            "previewModal"
        );


    const previewImage =
        document.getElementById(
            "previewImage"
        );


    const previewTitle =
        document.getElementById(
            "previewTitle"
        );


    const previewDownload =
        document.getElementById(
            "previewDownload"
        );


    const closeModal =
        document.getElementById(
            "closeModal"
        );


    const toast =
        document.getElementById(
            "toast"
        );


    /* =================================================
       TOAST
    ================================================= */

    function showToast(message) {

        toast.textContent =
            message;

        toast.classList.add(
            "show"
        );


        clearTimeout(
            showToast.timer
        );


        showToast.timer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 2000);

    }


    /* =================================================
       RENDER GALLERY
    ================================================= */

    function renderGallery(items) {

        gallery.innerHTML = "";


        visibleCount.textContent =
            items.length;


        if (items.length === 0) {

            emptyState.classList.add(
                "show"
            );

            return;

        }


        emptyState.classList.remove(
            "show"
        );


        items.forEach(
            (src, index) => {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "wallpaper-card";


                const title =
                    `خلفية رقم ${index + 1}`;


                card.innerHTML = `

                    <div class="image-container">

                        <img
                            src="${src}"
                            alt="${title}"
                            loading="lazy"
                        >

                        <div class="image-overlay">

                            <button
                                class="preview-btn"
                                type="button"
                                data-src="${src}"
                                data-title="${title}">

                                ⛶ معاينة كاملة

                            </button>

                        </div>

                    </div>


                    <div class="card-info">

                        <div>

                            <h3>
                                ${title}
                            </h3>

                            <small>
                                Fun X Wallpaper
                            </small>

                        </div>


                        <div class="card-actions">

                            <button
                                class="card-btn preview-card"
                                type="button"
                                data-src="${src}"
                                data-title="${title}">

                                👁

                            </button>


                            <a
                                class="card-btn download"
                                href="${src}"
                                download>

                                ⬇

                            </a>

                        </div>

                    </div>

                `;


                gallery.appendChild(
                    card
                );

            }
        );

    }


    /* =================================================
       SEARCH
    ================================================= */

    function filterWallpapers() {

        const query =
            searchInput.value
                .trim()
                .toLowerCase();


        const filtered =
            wallpapers.filter(
                (src, index) => {

                    const title =
                        `خلفية رقم ${index + 1}`;


                    return (
                        title
                            .toLowerCase()
                            .includes(query)
                        ||
                        src
                            .toLowerCase()
                            .includes(query)
                    );

                }
            );


        renderGallery(
            filtered
        );

    }


    searchInput.addEventListener(
        "input",
        filterWallpapers
    );


    clearSearch.addEventListener(
        "click",
        () => {

            searchInput.value =
                "";

            filterWallpapers();

            searchInput.focus();

        }
    );


    /* =================================================
       OPEN MODAL
    ================================================= */

    function openModal(src, title) {

        previewImage.src =
            src;


        previewImage.alt =
            title;


        previewTitle.textContent =
            title;


        previewDownload.href =
            src;


        modal.classList.add(
            "show"
        );


        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";

    }


    /* =================================================
       CLOSE MODAL
    ================================================= */

    function closePreview() {

        modal.classList.remove(
            "show"
        );


        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";

    }


    /* =================================================
       GALLERY EVENTS
    ================================================= */

    gallery.addEventListener(
        "click",
        event => {

            const previewButton =
                event.target.closest(
                    ".preview-btn, .preview-card"
                );


            if (
                !previewButton
            ) {

                return;

            }


            const src =
                previewButton.dataset.src;


            const title =
                previewButton.dataset.title;


            openModal(
                src,
                title
            );

        }
    );


    closeModal.addEventListener(
        "click",
        closePreview
    );


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closePreview();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closePreview();

            }

        }
    );


    /* =================================================
       IMAGE ERROR
    ================================================= */

    gallery.addEventListener(
        "error",
        event => {

            if (
                event.target.tagName !==
                "IMG"
            ) {

                return;

            }


            event.target.src =
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="800"
                        height="500"
                        viewBox="0 0 800 500">
                        <rect
                            width="800"
                            height="500"
                            fill="#080c16"/>
                        <text
                            x="400"
                            y="240"
                            text-anchor="middle"
                            fill="#8794a8"
                            font-size="25">
                            Image not found
                        </text>
                        <text
                            x="400"
                            y="280"
                            text-anchor="middle"
                            fill="#4f5d70"
                            font-size="16">
                            Fun X Wallpapers
                        </text>
                    </svg>
                `);

        },
        true
    );


    /* =================================================
       INITIAL
    ================================================= */

    wallpaperCount.textContent =
        wallpapers.length;


    renderGallery(
        wallpapers
    );

});

