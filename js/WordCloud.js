// use classes for all of the visualizations
// Promises.all in the main file (HW 8)

class WordCloud{
    constructor(parentContainer, lyricsData, wordCloudContainer){
        this.parentContainer = parentContainer;
        this.lyricsData = lyricsData;

        this.songTitles = Object.keys(lyricsData[0])
            .filter(col => col !== 'word' && col !== 'total_quantity');

        this.currentSong = 'total_quantity';

        this.tooltip = d3.select("body").append("div")
            .attr("class", "word-cloud-tooltip")
            .style("position", "absolute")
            .style("background", "white")
            .style("border", "1px solid black")
            .style("padding", "10px")
            .style("display", "none")
            .style("pointer-events", "none")

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
            .slice(0, vis.currentSong === 'total_quantity' ? 200 : 100);
        ;  // Limit to top 100 words to prevent overcrowding

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
            const textSelection = vis.svg.selectAll("text")
                .data(words)
                .join("text")
                .style("font-size", d => `${d.size}px`)
                .style("fill", (d, i) => vis.colors[i % vis.colors.length])
                .attr("text-anchor", "middle")
                .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
                .style("opacity", 0)
                .text(d => d.text)
                .on("mouseover", (event, d) => vis.showWordTooltip(event, d))
                .on("mouseout", () => vis.hideTooltip())
                .transition()  // Apply transition
                .duration(1000)  // Duration of the transition
                .style("opacity", 1)  // Fade in the word
                .attr("transform", d => `translate(${d.x}, ${d.y})rotate(${d.rotate}) scale(1)`)  // Ensure correct positioning
                .ease(d3.easeBounceOut)  // Apply bounce effect
                .attr("transform", d => `translate(${d.x}, ${d.y})rotate(${d.rotate}) scale(1.2)`)  // Bounce effect
                .transition()
                .duration(500)  // Duration of the bounce
                .attr("transform", d => `translate(${d.x}, ${d.y})rotate(${d.rotate}) scale(1)`);  // Set scale back to 1

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

    showWordTooltip(event, d) {
        let vis = this;

        const wordFrequencies = this.songTitles
            .map(song => ({
                song: song,
                frequency: +this.lyricsData.find(row => row.word === d.text)?.[song] || 0 // Convert to number
            }))
            .filter(item => item.frequency > 0)
            .sort((a, b) => b.frequency - a.frequency)
            .slice(0, 5);

        this.tooltip.html("");

        this.tooltip.append("div")
            .style("font-weight", "bold")
            .style("margin-bottom", "10px")
            .text(d.text)

        const tooltipWidth = 600;
        const tooltipHeight = 500;
        const margin = { top: 20, right: 20, bottom: 175, left: 100};
        const graphWidth = tooltipWidth - margin.left - margin.right;
        const graphHeight = tooltipHeight - margin.top - margin.bottom;

        const tooltipSvg = this.tooltip.append("svg")
            .attr("width", tooltipWidth)
            .attr("height", tooltipHeight)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)

        // tooltip title:
        this.tooltip.select("svg")
            .append("text")
            .attr("x", tooltipWidth / 2)
            .attr("y", margin.top / 1.2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text(`Word Frequency: "${d.text}"`);

        // axes on tooltip:
        const x = d3.scaleBand()
            .domain(wordFrequencies.map(f => f.song))
            .range([0, graphWidth])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(wordFrequencies, f => f.frequency)])
            .nice()
            .range([graphHeight, 0]);

        // Add X axis
        tooltipSvg.append("g")
            .attr("transform", `translate(0,${graphHeight})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-30)") // Use a smaller angle
            .style("text-anchor", "end")
            .style("fill", "black") // Ensure the text is visible
            .style("font-size", "12px");

        // Add Y axis
        tooltipSvg.append("g")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("fill", "black")
            .style("font-size", "12px");

        tooltipSvg.selectAll(".tick line")
            .style("stroke", "black") // Ensure tick lines are black
            .style("stroke-width", "1px"); // Set line width

        tooltipSvg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -graphHeight / 2)
            .attr("y", -margin.left + 15)
            .style("text-anchor", "middle")
            .text("Quantity");

        // Bars
        tooltipSvg.selectAll(".bar")
            .data(wordFrequencies)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", f => x(f.song))
            .attr("width", x.bandwidth())
            .attr("y", f => y(f.frequency))
            .attr("height", f => graphHeight - y(f.frequency))
            .attr("fill", "#64dd43");

        // Position and show tooltip
        this.tooltip
            .style("display", "block")
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");
    }

    hideTooltip() {
        this.tooltip.style("display", "none");
    }

}