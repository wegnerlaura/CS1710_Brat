class LineChart{
    constructor(parentContainer, bratSearch, charliSearch){
        this.parentContainer = parentContainer;
        this.bratSearch = bratSearch;
        this.charliSearch = charliSearch;

        this.initVis()
    }

    initVis() {
        let vis = this

        vis.margin = {top: 50, right: 50, bottom: 50, left: 50};
        vis.containerWidth = document.getElementById(vis.parentContainer).getBoundingClientRect().width;
        vis.width = vis.containerWidth / 2 - vis.margin.left - vis.margin.right;
        vis.height = 300;

        // Create SVG
        vis.svgBrat = this.createSVG('bratSearchChart', vis.width, vis.height);
        vis.svgCharli = this.createSVG('charliSearchChart', vis.width, vis.height);

        vis.wrangleData()
    }

    createSVG(id, width, height) {
        let vis = this;
        return d3.select(`#${vis.parentContainer}`)
            .append("svg")
            .attr("id", id)
            .attr("width", width + vis.margin.left + vis.margin.right)
            .attr("height", height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);
    }

    wrangleData() {
        let vis = this;

        // Process data to extract dates and values
        vis.bratSearchData = this.processSearchData(vis.bratSearch);
        vis.charliSearchData = this.processSearchData(vis.charliSearch);

        vis.updateVis();
    }

    processSearchData(data) {
        const processed = data.map(entry => ({
            week: entry['Week'], // Adjust this if column names differ
            search: +entry['Search'] // Adjust this if column names differ
        }));
        console.log("Processed Data:", processed);
        return processed;
    }


    updateVis() {
        let vis = this;

        console.log(vis.charliSearchData )

        // Create scales for each chart
        const createScales = (data) => {
            const xScale = d3.scaleTime()
                .domain(d3.extent(data, d => new Date(d.week))) // Parse date strings
                .range([0, vis.width]);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.search)])
                .range([vis.height, 0]);

            return { xScale, yScale };
        };

        // Create line generator
        const createLineGenerator = (xScale, yScale) => {
            return d3.line()
                .x(d => xScale(new Date(d.week))) // Convert `week` to a Date object
                .y(d => yScale(d.search)); // Use `search` for y-axis values
        };

        // Render each chart
        this.renderChart(
            vis.svgBrat,
            vis.bratSearchData,
            createScales(vis.bratSearchData),
            createLineGenerator,
            "BRAT Search"
        );

        this.renderChart(
            vis.svgCharli,
            vis.charliSearchData,
            createScales(vis.charliSearchData),
            createLineGenerator,
            "Charli XCX Search"
        );
    }

    renderChart(svg, data, scales, lineGenerator, title) {
        const { xScale, yScale } = scales;

        // Create line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#64dd43")
            .attr("stroke-width", 2)
            .attr("d", lineGenerator(xScale, yScale));

        // X-axis
        svg.append("g")
            .attr("transform", `translate(0, ${this.height})`)
            .call(d3.axisBottom(xScale)
                .tickFormat(d => {
                    // Format date if needed
                    const date = new Date(d);
                    return d3.timeFormat("%b %d")(date);
                })
            )
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        // Y-axis
        svg.append("g")
            .call(d3.axisLeft(yScale));

        // Title (now in white)
        svg.append("text")
            .attr("x", this.width / 2)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("fill", "white")  // Set text color to white
            .text(title);
    }
}