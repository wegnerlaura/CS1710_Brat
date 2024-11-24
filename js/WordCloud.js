// use classes for all of the visualizations
// Promises.all in the main file (HW 8)

class WordCloud{
    constructor(parentContainer, lyricsData){
        this.parentContainer = parentContainer;
        this.lyricsData = lyricsData;

        this.initVis()
    }

    initVis() {
        console.log("initVis");
        let vis = this

        // set margin / width / height
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentContainer).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentContainer).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentContainer).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height)
            .append('g')
            .attr(
                "transform",
                `translate(${vis.margin.left + vis.width / 2}, ${
                    vis.margin.top + vis.height / 2
                })`
            );

        vis.colors = ["#64dd43", "white", "#04530a", "#7b807c"]
        //
        // let container = vis.svg.append("g")
        //     .attr("transform", `translate(${vis.width / 2}, ${vis.height / 2})`);

        // container.append("rect")
        //     .attr("x", -vis.width / 2)
        //     .attr("y", -vis.height / 2)
        //     .attr("width", vis.width)
        //     .attr("height", vis.height)
        //     .attr("fill", "white")

        vis.wrangleData()
    }

    // wrangleData() {
    //     // as advised by Robert, my next iteration will make the wrangleData process much quicker,
    //     // since I will work in python
    //
    //     console.log("wrangleData")
    //     let vis = this
    //
    //     // Define rules for filtering (customize as needed)
    //     const stopWords = new Set(["a", "the", "and", "is", "in", "of", "to", "for", "on", "it"]);
    //
    //     // Aggregate word frequencies
    //     let wordFrequency = {};
    //     vis.lyricsData.forEach((row) => {
    //         row.lyrics.split(/\s+/).forEach((word) => {
    //             word = word.toLowerCase().replace(/[^a-z0-9]/g, ""); // Normalize and clean
    //             if (word && !stopWords.has(word)) { // Apply filtering rules
    //                 wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    //             }
    //         });
    //     });
    //
    //     // Convert wordFrequency object to array
    //     vis.wordCloudWordsArray = Object.entries(wordFrequency).map(
    //         ([word, frequency]) => ({
    //             text: word,
    //             size: frequency,
    //         })
    //     );
    //
    //
    //     // let wordCloudWordsDict = {}
    //     // vis.wordCloudWordsArray = []
    //     //
    //     // let lyrics = vis.lyricsData.map(song => song.lyrics)
    //     // lyrics.forEach(song_lyrics => {
    //     //     let words_array = song_lyrics.split(" ")
    //     //     words_array.forEach(word => {
    //     //         if (word in wordCloudWordsDict) {
    //     //             wordCloudWordsDict[word] += 1
    //     //         } else {
    //     //             wordCloudWordsDict[word] = 1;
    //     //         }
    //     //     })
    //     // })
    //     // console.log(wordCloudWordsDict)
    //     //
    //     // // words.keys.forEach(d => console.log(d))
    //     // Object.entries(wordCloudWordsDict).forEach(d => {
    //     //     vis.wordCloudWordsArray.push(
    //     //         {
    //     //             word: d[0],
    //     //             quantity: d[1]
    //     //         }
    //     //     )
    //     // })
    //     // console.log(vis.wordCloudWordsArray)
    //
    //
    //     vis.updateVis()
    // }

    wrangleData() {
        console.log("wrangleData");
        let vis = this;

        // Define rules for filtering (customize stopWords as needed)
        const stopWords = new Set(["a", "the", "and", "is", "in", "of", "to", "for", "on", "it"]);

        // Initialize storage
        let wordCloudWordsDict = {};
        vis.wordCloudWordsArray = [];

        // Process lyrics
        let lyrics = vis.lyricsData.map((song) => song.lyrics);
        lyrics.forEach((songLyrics) => {
            // Normalize and clean text
            let wordsArray = songLyrics
                .toLowerCase() // Convert to lowercase
                .replace(/[^a-z0-9\s]/g, "") // Remove punctuation
                .split(/\s+/); // Split by whitespace

            wordsArray.forEach((word) => {
                if (word && !stopWords.has(word)) {
                    if (word in wordCloudWordsDict) {
                        wordCloudWordsDict[word] += 1;
                    } else {
                        wordCloudWordsDict[word] = 1;
                    }
                }
            });
        });

        console.log(wordCloudWordsDict);

        // Convert dictionary to array
        Object.entries(wordCloudWordsDict).forEach(([key, value]) => {
            vis.wordCloudWordsArray.push({
                word: key,
                quantity: value,
            });
        });

        console.log(vis.wordCloudWordsArray);

        vis.updateVis();
    }


    updateVis() {
        // console.log("updateVis")

        let vis = this

        let fontScale = 20;

        function draw(words) {
            vis.svg.selectAll("text")
                .data(words)
                .join("text")
                .style("font-size", d => `${d.size}px`)
                .style("fill", (d, i) => vis.colors[i % vis.colors.length])
                .attr("text-anchor", "middle")
                .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
                .text(d => d.text);
        }
        console.log(vis.wordCloudWordsArray)

        // Create and configure the layout
        d3.layout.cloud()
            .size([vis.width, vis.height])
            // issue here!
            .words(vis.wordCloudWordsArray.map(d => ({
                text: d.word,
                size: d.quantity * fontScale  // Cap maximum size
            })))
            .padding(5)
            .rotate(() => 0)
            .fontSize(d => d.size)
            .spiral("archimedean")
            .on("end", draw)
            .start();
    }
}