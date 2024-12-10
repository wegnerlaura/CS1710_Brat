let myWordCloud, myPersonalityQuiz, flowerVis, myTimeline, myLineChart;

// Load data using promises
let promises = [
    d3.csv("data/album_word_frequencies.csv"),
    d3.csv("data/brat.csv"),
    d3.csv("data/brat-search.csv"),
    d3.csv("data/brat_summer-search.csv"),
    d3.csv("data/charli-search.csv")
];

document.addEventListener('DOMContentLoaded', function() {
    Promise.all(promises)
        .then(function (data) {
            initMainPage(data);
        })
        .catch(function (err) {
            console.log(err);
        });
});

function initMainPage(data) {
    // popularity
    myLineChart = new LineChart('lineChartContainer', data[2], data[3], data[4]);

    // Word cloud
    myWordCloud = new WordCloud('wordCloudContainer', data[0]);

    // Timeline
    myTimeline = new Timeline('timelineContainer');

    // Flower visualization
    const selectedSongs = [
        "360",
        "club classics",
        "sympathy is a knife",
        "i might say something stupid",
        "talk talk",
        "von dutch",
        "so i",
        "360 featuring robyn & yung lean",
        "365 featuring shygirl",
        "i might say something stupid featuring the 1975 & jon hopkins",
        "spring breakers",
        "shy girl",
        "everything is romantic"
    ];

    const filteredData = data[1].filter(d => selectedSongs.includes(d.name.toLowerCase()));
    console.log("Filtered Data:", filteredData);

    flowerVis = new SongFlower("flower-container", filteredData);
}