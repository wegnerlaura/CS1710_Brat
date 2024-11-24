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
        vis.width = 800;
        vis.height = 1200;
        vis.colors = ["#64dd43", "black", "#04530a", "#7b807c"]

        vis.svg = d3.select(".word-cloud-section .visual-placeholder")
            .append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height);

        vis.svg.selectAll("*").remove();

        let container = vis.svg.append("g")
            .attr("transform", `translate(${vis.width / 2},${vis.height / 2})`);

        container.append("rect")
            .attr("x", -vis.width / 2)
            .attr("y", -vis.height / 2)
            .attr("width", vis.width * 2)
            .attr("height", vis.height)
            .attr("fill", "white")

        vis.wrangleData()
    }

    wrangleData() {
        console.log("wrangleData")
        let vis = this

        let wordCloudWordsDict = {}
        vis.wordCloudWordsArray = []

        let lyrics = vis.lyricsData.map(song => song.lyrics)
        lyrics.forEach(song_lyrics => {
            let words_array = song_lyrics.split(" ")
            words_array.forEach(word => {
                if (word in wordCloudWordsDict) {
                    wordCloudWordsDict[word] += 1
                } else {
                    wordCloudWordsDict[word] = 1;
                }
            })
        })
        console.log(wordCloudWordsDict)

        // words.keys.forEach(d => console.log(d))
        Object.entries(wordCloudWordsDict).forEach(d => {
            vis.wordCloudWordsArray.push(
                {
                    word: d[0],
                    quantity: d[1]
                }
            )
        })
        console.log(vis.wordCloudWordsArray)


        vis.updateVis()
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