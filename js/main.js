let myWordCloud,
    myPersonalityQuiz;

// load data using promises
let promises = [
    d3.csv("data/album_word_frequencies.csv"),
    d3.csv("data/brat.csv"),
    d3.csv("data/brat-search.csv"),
    d3.csv("data/brat_summer-search.csv"),
    d3.csv("data/charli-search.csv")
];

let featureMatrix;

d3.csv("data/brat.csv").then(data => {
    featureMatrix = new FeatureMatrix("feature-matrix", data);
});

Promise.all(promises)
    .then(function (data) {
        initMainPage(data)
    })
    .catch(function (err) {
        console.log(err)
    });

 function initMainPage(data) {

     // word cloud
     myWordCloud = new WordCloud ('wordCloudContainer', data[0]);
     myTimeline = new Timeline ('timelineContainer')
 }
