class Timeline{
    constructor(parentContainer){
        this.parentContainer = parentContainer;

        this.initVis()
    }

    initVis(){
        let vis = this

        vis.timelineData = [
            {year: 2012,
                description: "The song, I love it, featuring Charli XCX was her first breakout song and first hit in the United States. <br> Charli wrote and contributed vocals to this song. The song gained prominence when it was featured in the \"cocaine dance club\" scene on the HBO show <i>Girls</i>.",
            youtubeLink:"https://www.youtube.com/watch?v=UxxajLWwzqY&ab_channel=IconaPop"
            },
            {year: 2013,
                description: "Next, Charli XCX released the hit song \"Boom Clap\" which was one of the first singles for the smash movie <i> Fault in Our Stars </i>. <br>The song was originally written for Hillary Duff, Charli was told it wasn't <i>cool</i> enough for Duff.",
            youtubeLink: "https://www.youtube.com/watch?v=AOPMlIIg_38&ab_channel=Charlixcx"},
            {year: 2014,
                description: "Charli released her album <i>Sucker</i> which incorporated some of her smash hits and introduced her audience to her ballad prowess. Her song, Break the Rules, became a huge single for the artist.",
            youtubeLink: "https://www.youtube.com/watch?v=ABhDiXbUaBE&ab_channel=Charlixcx"},
            {year: 2016,
            description: "Perhaps the most significant project of her career, <i>Vroom Vroom</i> marked Charli’s first foray away from conventional pop tropes in favor of  experimental electronic production",
            youtubeLink: "https://www.youtube.com/watch?v=qfAqtFuGjWM&ab_channel=VroomVroomRecordings",},
            {year: 2017,
            description: "After releasing her mixtape <i>Number 1 Angel</i>, Charli released her second mixtape of the year, <i>Pop 2</i>. This album contained a number of collaborations, representing a continued mastery of her sound and fresh collaborative abilities.</i>",
            youtubeLink: "https://www.youtube.com/watch?v=wI1GcWaZELQ&ab_channel=Charlixcx",},
            {year: 2020,
                description: "Charli released her most stripped-down album yet, forgoing any bombastic elements in favor of A.G. Cook’s familiar electronic-heavy production for <i>how i'm feeling now</i>.<br>Declaring this a quarantine album, Charli obliterated her comfort zone for this personal album.",
                youtubeLink: "https://www.youtube.com/watch?v=TbJE-KVZvTA&pp=ygUSZm9yZXZlciBjaGFybGkgeGN4",},

            {year: 2022,
                description: "Charli created a novel hyperpop experience that she has become known for, giving her an edge over her pop contemporaries, through her album titled, <i>Crash</i>. Her standout tracks from Crash include <i>Good Ones</i> and <i>Beg for You (feat. Rina Sawayama)</i>.",
                youtubeLink: "https://www.youtube.com/watch?v=kjAuUXdSFaM&ab_channel=Charlixcx",},

            {year: 2024,
                description: "The <i>Brat</i> album declared Charli XCX as an international superstar. From her viral marketing strategy, to hedonistic aesthetic, and her collaborations with other superstars, including Lorde and Billie Eilish, Charli has solidifed her place as a creative and groundbreaking artist.",
            youtubeLink: "https://www.youtube.com/watch?v=huGd4efgdPA&ab_channel=Charlixcx"},
        ]

        console.log(vis.timelineData)

        // Set dimensions and margins
        vis.margin = { top: 50, right: 50, bottom: 50, left: 50 };
        vis.width = document.getElementById(vis.parentContainer).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 200; // Fixed height for the timeline

        // Create SVG
        vis.svg = d3.select(`#${vis.parentContainer}`)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);

        console.log("svg width:", vis.width + vis.margin.left + vis.margin.right)
        vis.svgWidth = vis.width + vis.margin.left + vis.margin.right;
        console.log(vis.svgWidth)

        // Initialize scales
        vis.xScale = d3.scalePoint()
            .range([0, vis.width])
            .padding(0.5);

        // Create tooltip div
        if (!d3.select("#timeline-tooltip").node()) {
            vis.tooltip = d3.select("body").append("div")
                .attr("id", "timeline-tooltip")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("visibility", "hidden")
                .style("background", "white")
                .style("border", "1px solid black")
                .style("padding", "8px")
                .style("border-radius", "4px")
                .style("pointer-events", "none");
        }

        console.log(vis.tooltip.node()); // Check if tooltip exists

        vis.wrangleData()
    }

    wrangleData(){
        let vis = this

        vis.timelineData.sort((a, b) => a.year - b.year);

        vis.xScale.domain(vis.timelineData.map(d => d.year));
        console.log("xScale domain:", vis.xScale.domain());

        vis.updateVis()
    }

    updateVis() {
        let vis = this

        console.log("xScale domain:", vis.xScale.domain());
        console.log("xScale range:", vis.xScale.range());

        console.log('Container width:', document.getElementById(vis.parentContainer).getBoundingClientRect().width);
        console.log('Calculated SVG width:', vis.width);

        vis.svg.selectAll(".timeline-line").remove();
        // need to center the line before submission
        vis.svg.append("line")
            .attr("class", "timeline-line")
            .attr("x1", 0)
            .attr("x2", vis.width - vis.margin.left)
            .attr("y1", vis.height / 2)
            .attr("y2", vis.height / 2)
            .attr("transform", `translate(${vis.margin.left}, 0)`)
            .attr("stroke", "#64dd43")
            .attr("stroke-width", 5)

        console.log("line width:", vis.width + vis.margin.left + vis.margin.right)

        // Update scales with data
        vis.xScale.domain(vis.timelineData.map((d) => d.year));

        // Add dashes
        const dashHeight = 100; // Height of each dash
        let dashes = vis.svg.selectAll(".timeline-dash")
            .data(vis.timelineData);

        dashes.exit().remove();

        dashes.enter()
            .append("line")
            .merge(dashes)
            .attr("class", "timeline-dash")
            .attr("x1", d => vis.xScale(d.year))
            .attr("x2", d => vis.xScale(d.year))
            .attr("y1", (d, i) => i % 2 === 0 ?
                (vis.height / 2) - (dashHeight / 2) :
                (vis.height / 2) - (dashHeight / 2))
            .attr("y2", (d, i) => i % 2 === 0 ?
                (vis.height / 2) + (dashHeight / 2) :
                (vis.height / 2) + (dashHeight / 2))
            .attr("stroke", "#64dd43")
            .attr("stroke-width", 10)

            .on("mouseover", function(event, d) {
                // Extract YouTube video ID from the full URL
                let youtubeVideoId = null;
                if (d.youtubeLink) {
                    const urlParams = new URL(d.youtubeLink);
                    youtubeVideoId = urlParams.searchParams.get('v');
                }

                // Create the base tooltip HTML
                let tooltipHTML = `<strong>${d.year}: </strong><br>${d.description} <br><br>Listen to the song below!`;

                // Add YouTube thumbnail if video ID is available
                if (youtubeVideoId) {
                    const thumbnailUrl = `https://img.youtube.com/vi/${youtubeVideoId}/0.jpg`;
                    tooltipHTML += `
            <br>
            <a href="${d.youtubeLink}" target="_blank">
                <img src="${thumbnailUrl}" 
                     style="max-width: 300px; max-height: 200px; object-fit: cover; margin-top: 10px; border: 2px solid #64dd43;">
            </a>
        `;
                }

                vis.tooltip
                    .html(tooltipHTML)
                    .style("font-size", "25px")
                    .style("visibility", "visible")
                    .style("opacity", "1")
                    .style("position", "absolute")
                    .style("background", "rgba(0, 0, 0, 0.8)")
                    .style("color", "#64dd43")
                    .style("border", '1px solid #64dd43')
                    .style("padding", "8px")
                    .style("pointer-events", "auto") // Allow interaction with tooltip content
                    .style("z-index", "1000")
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY) + "px");
            })

            .on("mouseout", function(event, d) {
                // Use a small delay to check if mouse has left the tooltip
                setTimeout(() => {
                    // Check if the mouse is not currently over the tooltip
                    if (!vis.tooltip.node().matches(':hover')) {
                        vis.tooltip
                            .style("visibility", "hidden")
                            .style("opacity", "0");
                    }
                }, 0); // 100ms delay allows for smoother interaction
            })


        let labels = vis.svg.selectAll(".timeline-label")
            .data(vis.timelineData);

        // Remove old labels
        labels.exit().remove();

        // Add new labels
        labels.enter()
            .append("text")
            .merge(labels)
            .attr("class", "timeline-label")
            .attr("x", d => vis.xScale(d.year))
            .attr("y", (d, i) => i % 2 === 0 ?
                (vis.height / 2) - (dashHeight / 2) - 15 :
                (vis.height / 2) + (dashHeight / 2) + 30)
            .attr("text-anchor", "middle")
            .text(d => d.year)
            .style("font-size", "30px")
            .style("fill", "#64dd43")

    }
}