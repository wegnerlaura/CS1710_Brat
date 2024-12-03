// use classes for all of the visualizations
// Promises.all in the main file (HW 8)

class WordCloud{
    constructor(parentContainer, lyricsData, wordCloudContainer){
        this.parentContainer = parentContainer;
        this.lyricsData = lyricsData;

        this.songTitles = Object.keys(lyricsData[0])
            .filter(col => col !== 'word' && col !== 'total_quantity');

        this.currentSong = 'total_quantity';

        this.createDropdown()

        this.initVis()
    }

    createDropdown() {
        let vis = this

        const dropdownContainer = d3.select(`#${vis.parentContainer}-dropdown`);
        console.log("Dropdown Container:", dropdownContainer.node() )

        const dropdown = dropdownContainer.append('select')
            .attr('id', 'song-select')
            .on('change', (event) => {
                this.currentSong = event.target.value;
                this.wrangleData();
            });

        // Add total album option
        dropdown.append('option')
            .attr('value', 'total_quantity')
            .text('Entire Album');

        // Add song-specific options
        this.songTitles.forEach(song => {
            dropdown.append('option')
                .attr('value', song)
                .text(song);
        });

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

        vis.wrangleData()
    }

    wrangleData() {
        console.log("wrangleData");
        let vis = this;

        // Process data based on current song selection
        vis.wordCloudWordsArray = vis.lyricsData
            .filter(row => row[vis.currentSong] > 0)  // Remove words with zero frequency
            .map(row => ({
                word: row.word,
                quantity: row[vis.currentSong]
            }))
            .sort((a, b) => b.quantity - a.quantity)  // Sort by quantity
            .slice(0, 100);  // Limit to top 100 words to prevent overcrowding

        vis.updateVis();
    }


    updateVis() {
        // console.log("updateVis")

        let vis = this

        const maxQuantity = d3.max(vis.wordCloudWordsArray, d => d.quantity) || 1; // Prevent division by zero
        let fontScaleFactor = Math.min(vis.width, vis.height) / 4; // Adjust this value to scale fonts appropriately
        let fontScale = d3.scaleLinear()
            .domain([0, maxQuantity]) // Map quantity range
            .range([10, fontScaleFactor]); // Map to font size range

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

        // Create and configure the layout
        d3.layout.cloud()
            .size([vis.width, vis.height])
            // issue here!
            .words(vis.wordCloudWordsArray.map(d => ({
                text: d.word,
                size: fontScale(d.quantity)  // Cap maximum size
            })))
            .padding(5)
            .rotate(() => 0)
            .fontSize(d => d.size)
            .spiral("archimedean")
            .on("end", draw)
            .start();
    }
}