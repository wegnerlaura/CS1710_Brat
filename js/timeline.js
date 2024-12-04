class Timeline{
    constructor(parentContainer){
        this.parentContainer = parentContainer;

        this.initVis()
    }

    initVis(){
        let vis = this

        vis.timelineData = [
            {year: 2012, description: "released hit song I Love It"},
            {year: 2013, description: "released hit song Boom Clap"},
            {year: 2020, description: "released hit song Vroom Vroom "},
            {year: 2024, description: "released album Brat"},
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
                console.log("hover triggered", d);  // Make sure this is firing for each year
                d3.select(this)
                    .style("fill", "#64dd43")
                    .style("font-size", "40px")

                vis.tooltip
                    .html(`<strong>In ${d.year}</strong><br>Charli XCX ${d.description}`)
                    .style("font-size", "25px")
                    .style("visibility", "visible")
                    .style("opacity", "1")
                    .style("position", "absolute")
                    .style("background", "rgba(0, 0, 0, 0.8)")
                    .style("color", "#64dd43")
                    .style("border", '1px solid #64dd43')
                    .style("padding", "8px")
                    .style("z-index", "1000")
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY) + "px");
            })
            .on("mousemove", function(event, d) {
                vis.tooltip
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function(event, d) {
                vis.tooltip
                    .style("visibility", "hidden")
            });


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