
/* =====================================================
   FUN X PROFILE — INTERACTIONS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =================================================
       ELEMENTS
    ================================================= */

    const followBtn =
        document.getElementById("followBtn");


    const shareBtn =
        document.getElementById("shareBtn");


    const toast =
        document.getElementById("toast");


    const modal =
        document.getElementById("timelineModal");


    const modalClose =
        document.getElementById("modalClose");


    const modalDate =
        document.getElementById("modalDate");


    const modalTitle =
        document.getElementById("modalTitle");


    const modalDescription =
        document.getElementById("modalDescription");


    const events =
        document.querySelectorAll(
            ".timeline-event"
        );


    const revealElements =
        document.querySelectorAll(
            ".reveal"
        );


    /* =================================================
       TOAST
    ================================================= */

    function showToast(message) {

        toast.textContent =
            message;

        toast.classList.add("show");


        clearTimeout(
            showToast.timer
        );


        showToast.timer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 2200);

    }


    /* =================================================
       FOLLOW BUTTON
    ================================================= */

    followBtn.addEventListener(
        "click",
        () => {

            const following =
                followBtn.classList.contains(
                    "following"
                );


            if (following) {

                followBtn.classList.remove(
                    "following"
                );


                followBtn.innerHTML = `
                    <i class="fa-solid fa-user-plus"></i>
                    متابعة
                `;


                showToast(
                    "تم إلغاء المتابعة"
                );

            } else {

                followBtn.classList.add(
                    "following"
                );


                followBtn.innerHTML = `
                    <i class="fa-solid fa-check"></i>
                    متابع
                `;


                showToast(
                    "✅ تم تفعيل المتابعة"
                );

            }

        }
    );


    /* =================================================
       SHARE
    ================================================= */

    shareBtn.addEventListener(
        "click",
        async () => {

            const shareData = {

                title:
                    "Fun X | Profile",

                text:
                    "صفحة خالد التركي — Founder of Fun X",

                url:
                    window.location.href

            };


            try {

                if (
                    navigator.share
                ) {

                    await navigator.share(
                        shareData
                    );

                    showToast(
                        "📤 تم فتح المشاركة"
                    );

                } else {

                    await navigator.clipboard.writeText(
                        window.location.href
                    );

                    showToast(
                        "🔗 تم نسخ رابط الصفحة"
                    );

                }

            } catch (error) {

                /*
                 * المستخدم أغلق نافذة المشاركة
                 * أو المتصفح لا يدعمها.
                 */

                if (
                    error.name !==
                    "AbortError"
                ) {

                    showToast(
                        "🔗 يمكنك نسخ رابط الصفحة يدويًا"
                    );

                }

            }

        }
    );


    /* =================================================
       TIMELINE MODAL
    ================================================= */

    events.forEach(
        event => {

            event.addEventListener(
                "click",
                () => {

                    const date =
                        event
                            .querySelector(
                                ".timeline-content span"
                            )
                            .textContent;


                    const title =
                        event.dataset.title ||
                        "Fun X";


                    const description =
                        event.dataset.description ||
                        "تفاصيل المشروع";


                    modalDate.textContent =
                        date;


                    modalTitle.textContent =
                        title;


                    modalDescription.textContent =
                        description;


                    modal.classList.add(
                        "show"
                    );

                }
            );

        }
    );


    /* =================================================
       CLOSE MODAL
    ================================================= */

    function closeModal() {

        modal.classList.remove(
            "show"
        );

    }


    modalClose.addEventListener(
        "click",
        closeModal
    );


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closeModal();

            }

        }
    );


    /* =================================================
       ESCAPE
    ================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeModal();

            }

        }
    );


    /* =================================================
       SCROLL REVEAL
    ================================================= */

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(
        element => {

            observer.observe(
                element
            );

        }
    );


    /* =================================================
       PARTICLES
    ================================================= */

    const particles =
        document.getElementById(
            "particles"
        );


    const particleCount =
        window.innerWidth < 600
            ? 35
            : 65;


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.style.position =
            "absolute";


        particle.style.width =
            `${Math.random() * 2 + 1}px`;


        particle.style.height =
            particle.style.width;


        particle.style.borderRadius =
            "50%";


        particle.style.background =
            "rgba(120,190,255,0.65)";


        particle.style.left =
            `${Math.random() * 100}%`;


        particle.style.top =
            `${Math.random() * 100}%`;


        particle.style.boxShadow =
            "0 0 8px rgba(100,190,255,0.6)";


        particle.style.opacity =
            `${Math.random() * 0.5 + 0.15}`;


        const duration =
            Math.random() * 8 + 5;


        particle.style.animation =
            `particleFloat ${duration}s ease-in-out infinite`;


        particle.style.animationDelay =
            `${Math.random() * 5}s`;


        particles.appendChild(
            particle
        );

    }


    /* =================================================
       PARTICLE ANIMATION
    ================================================= */

    const particleStyle =
        document.createElement(
            "style"
        );


    particleStyle.textContent = `

        @keyframes particleFloat {

            0%,
            100% {
                transform:
                    translateY(0)
                    translateX(0);
            }

            50% {
                transform:
                    translateY(-18px)
                    translateX(10px);
            }

        }

    `;


    document.head.appendChild(
        particleStyle
    );


    /* =================================================
       IMAGE ERROR
    ================================================= */

    const profileImage =
        document.querySelector(
            ".profile-image"
        );


    if (profileImage) {

        profileImage.addEventListener(
            "error",
            () => {

                profileImage.style.display =
                    "none";


                showToast(
                    "⚠️ تعذر تحميل صورة البروفايل"
                );

            }
        );

    }


});

