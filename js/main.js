let myWordCloud,
    myPersonalityQuiz;

// load data using promises
let promises = [
    d3.csv("data/brat-lyrics.csv"),
    d3.csv("data/brat.csv"),
    d3.csv("data/brat-search.csv"),
    d3.csv("data/brat_summer-search.csv"),
    d3.csv("data/charli-search.csv")
];

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
     myTimeline = new Timeline ('timelineContainer', data[1])
 }

