
document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       STATIONS
    ===================================================== */

    const stations = [

        {
            name:
                "إذاعة القرآن الكريم – القاهرة",

            src:
                "https://p.liveonlineradio.net/?p=ertu-quran-karem"
        },

        {
            name:
                "إذاعة القرآن الكريم – الشروق",

            src:
                "https://p.liveonlineradio.net/?p=shurooq-quran-kareem"
        },

        {
            name:
                "Radio 9090",

            src:
                "https://p.liveonlineradio.net/?p=radio-9090"
        }

    ];


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const frame =
        document.getElementById(
            "radioFrame"
        );


    const nameBox =
        document.getElementById(
            "stationName"
        );


    const stationList =
        document.getElementById(
            "stationList"
        );


    const stationCounter =
        document.getElementById(
            "stationCounter"
        );


    const stationEmoji =
        document.getElementById(
            "stationEmoji"
        );


    const playerStatus =
        document.getElementById(
            "playerStatus"
        );


    const clock =
        document.getElementById(
            "clock"
        );


    const toast =
        document.getElementById(
            "toast"
        );


    const prevBtn =
        document.getElementById(
            "prevBtn"
        );


    const nextBtn =
        document.getElementById(
            "nextBtn"
        );


    const refreshBtn =
        document.getElementById(
            "refreshBtn"
        );


    const equalizer =
        document.getElementById(
            "equalizer"
        );


    /* =====================================================
       STATE
    ===================================================== */

    let index = 0;


    /* =====================================================
       TOAST
    ===================================================== */

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

            }, 1800);

    }


    /* =====================================================
       STATION ICON
    ===================================================== */

    function getStationIcon(stationIndex) {

        if (stationIndex === 0) {
            return "📖";
        }

        if (stationIndex === 1) {
            return "🕌";
        }

        return "🎵";

    }


    /* =====================================================
       UPDATE CURRENT STATION
    ===================================================== */

    function updateStation() {

        const station =
            stations[index];


        nameBox.textContent =
            station.name;


        frame.src =
            station.src;


        stationEmoji.textContent =
            getStationIcon(index);


        stationCounter.textContent =
            `${index + 1} / ${stations.length}`;


        playerStatus.textContent =
            "جاري تحميل المحطة...";


        renderStationList();


        /*
         * تعطي المتصفح وقتًا لتحميل iframe.
         */

        setTimeout(() => {

            playerStatus.textContent =
                "البث متاح";

        }, 1600);

    }


    /* =====================================================
       STATION LIST
    ===================================================== */

    function renderStationList() {

        stationList.innerHTML =
            "";


        stations.forEach(
            (station, stationIndex) => {

                const item =
                    document.createElement(
                        "button"
                    );


                item.type =
                    "button";


                item.className =
                    "station-item";


                if (
                    stationIndex === index
                ) {

                    item.classList.add(
                        "active"
                    );

                }


                item.innerHTML = `

                    <div class="station-number">
                        ${stationIndex + 1}
                    </div>

                    <div class="station-item-content">

                        <span class="station-item-title">
                            ${station.name}
                        </span>

                        <span class="station-item-status">
                            ${
                                stationIndex === index
                                    ? "● المحطة الحالية"
                                    : "اضغط للاستماع"
                            }
                        </span>

                    </div>

                `;


                item.addEventListener(
                    "click",
                    () => {

                        selectStation(
                            stationIndex
                        );

                    }
                );


                stationList.appendChild(
                    item
                );

            }
        );

    }


    /* =====================================================
       SELECT STATION
    ===================================================== */

    function selectStation(
        stationIndex
    ) {

        if (
            stationIndex < 0 ||
            stationIndex >=
            stations.length
        ) {

            return;

        }


        index =
            stationIndex;


        updateStation();


        showToast(
            `📻 ${stations[index].name}`
        );

    }


    /* =====================================================
       NEXT
    ===================================================== */

    nextBtn.addEventListener(
        "click",
        () => {

            index =
                (
                    index + 1
                ) %
                stations.length;


            updateStation();

            showToast(
                "⏭ المحطة التالية"
            );

        }
    );


    /* =====================================================
       PREVIOUS
    ===================================================== */

    prevBtn.addEventListener(
        "click",
        () => {

            index =
                (
                    index - 1 +
                    stations.length
                ) %
                stations.length;


            updateStation();

            showToast(
                "⏮ المحطة السابقة"
            );

        }
    );


    /* =====================================================
       REFRESH
    ===================================================== */

    refreshBtn.addEventListener(
        "click",
        () => {

            const currentSrc =
                frame.src;


            frame.src =
                "";


            setTimeout(() => {

                frame.src =
                    currentSrc;

                playerStatus.textContent =
                    "جاري إعادة الاتصال...";


                setTimeout(() => {

                    playerStatus.textContent =
                        "البث متاح";

                }, 1300);

            }, 100);


            showToast(
                "🔄 تمت إعادة تحميل المحطة"
            );

        }
    );


    /* =====================================================
       CLOCK
    ===================================================== */

    function updateClock() {

        const now =
            new Date();


        clock.textContent =
            now.toLocaleTimeString(
                "ar-EG",
                {
                    hour:
                        "2-digit",

                    minute:
                        "2-digit",

                    second:
                        "2-digit"
                }
            );

    }


    setInterval(
        updateClock,
        1000
    );


    updateClock();


    /* =====================================================
       IFRAME LOAD
    ===================================================== */

    frame.addEventListener(
        "load",
        () => {

            playerStatus.textContent =
                "البث متاح";

        }
    );


    /* =====================================================
       KEYBOARD
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "ArrowRight"
            ) {

                nextBtn.click();

            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                prevBtn.click();

            }


            if (
                event.key ===
                "r" ||
                event.key ===
                "R"
            ) {

                refreshBtn.click();

            }

        }
    );


    /* =====================================================
       START
    ===================================================== */

    renderStationList();

    updateStation();


});

