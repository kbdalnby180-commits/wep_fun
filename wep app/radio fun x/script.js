const stations = [
  { name:"إذاعة القرآن الكريم – القاهرة", src:"https://p.liveonlineradio.net/?p=ertu-quran-karem" },
  { name:"إذاعة القرآن الكريم – الشروق", src:"https://p.liveonlineradio.net/?p=shurooq-quran-kareem" },
  { name:"Radio 9090", src:"https://p.liveonlineradio.net/?p=radio-9090" }
];

let index = 0;
const frame = document.getElementById("radioFrame");
const nameBox = document.getElementById("stationName");

function updateStation(){
  frame.src = stations[index].src; // يقفل القديم
  nameBox.textContent = stations[index].name;
}

function nextStation(){
  index = (index + 1) % stations.length;
  updateStation();
}

function prevStation(){
  index = (index - 1 + stations.length) % stations.length;
  updateStation();
}