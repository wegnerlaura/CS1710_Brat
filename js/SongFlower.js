class SongFlower {
    constructor(containerId, data) {
        this.containerId = containerId;
        this.data = data;

        this.features = ["speechiness", "acousticness", "instrumentalness"];
        this.colors = {
            speechiness: "#64dd43",
            acousticness: "#04530a",
            instrumentalness: "#7b807c"
        };

        this.initVis();
    }

    initVis() {
        let vis = this;

        d3.select(`#${this.containerId}`).selectAll("*").remove();

        vis.margin = { top: 100, right: 50, bottom: 50, left: 50 };
        vis.width = document.getElementById(vis.containerId).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 800;

        console.log(vis.width);

        this.svg = d3.select(`#${this.containerId}`)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height)
            .attr("viewBox", `0 0 ${vis.width} ${vis.height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .style("background-color", "black");

        this.createLegend();
        this.updateVis();
    }

    createLegend() {
        const legend = this.svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(20, 20)`);

        this.features.forEach((feature, i) => {
            const legendRow = legend.append("g")
                .attr("transform", `translate(0, ${i * 25})`);

            legendRow.append("circle")
                .attr("r", 6)
                .attr("fill", this.colors[feature]);

            legendRow.append("text")
                .attr("x", 15)
                .attr("y", 4)
                .text(feature)
                .attr("fill", "#64dd43")
                .style("font-size", "20px");
        });
    }

    createLeaf(radius, angle) {
        const path = d3.path();
        const leafWidth = radius * 0.4;
        const leafLength = radius;

        path.moveTo(0, 0);
        path.bezierCurveTo(
            Math.cos(angle - Math.PI/6) * leafWidth,
            Math.sin(angle - Math.PI/6) * leafWidth,
            Math.cos(angle) * leafLength * 0.6,
            Math.sin(angle) * leafLength * 0.6,
            Math.cos(angle) * leafLength,
            Math.sin(angle) * leafLength
        );
        path.bezierCurveTo(
            Math.cos(angle) * leafLength * 0.6,
            Math.sin(angle) * leafLength * 0.6,
            Math.cos(angle + Math.PI/6) * leafWidth,
            Math.sin(angle + Math.PI/6) * leafWidth,
            0,
            0
        );

        return path.toString();
    }

    createFlower(d, x, y) {
        if (!d) return;

        const flowerGroup = this.svg.append("g")
            .attr("class", "flower-group")
            .attr("transform", `translate(${x}, ${y})`);

        // Create petals for each feature
        this.features.forEach((feature, i) => {
            const baseRadius = 40; // Fixed size for all petals
            const totalPetals = 42; // Total possible petal positions

            // Calculate number of petals to draw based on feature value
            const numPetals = Math.max(1, Math.round(d[feature] * totalPetals));

            // Define starting angles for each feature (in radians)
            const startAngles = {
                speechiness: Math.PI * 1.5,    // Points left
                acousticness: Math.PI * 0.8,    // Points right
                instrumentalness: 0.5            // Points up
            };

            // Create petals
            for (let j = 0; j < numPetals; j++) {
                const angle = startAngles[feature] + (j * Math.PI/5); // Smaller angle for tighter grouping

                // Create petal using the leaf shape
                const path = d3.path();
                const leafWidth = baseRadius * 0.4;
                const leafLength = baseRadius;

                path.moveTo(0, 0);
                path.bezierCurveTo(
                    Math.cos(angle - Math.PI/6) * leafWidth,
                    Math.sin(angle - Math.PI/6) * leafWidth,
                    Math.cos(angle) * leafLength * 0.6,
                    Math.sin(angle) * leafLength * 0.6,
                    Math.cos(angle) * leafLength,
                    Math.sin(angle) * leafLength
                );
                path.bezierCurveTo(
                    Math.cos(angle) * leafLength * 0.6,
                    Math.sin(angle) * leafLength * 0.6,
                    Math.cos(angle + Math.PI/6) * leafWidth,
                    Math.sin(angle + Math.PI/6) * leafWidth,
                    0,
                    0
                );

                flowerGroup.append("path")
                    .attr("d", path.toString())
                    .attr("fill", this.colors[feature])
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 0.5)
                    .attr("opacity", 0.7);
            }
        });

        // Add song name
        flowerGroup.append("text")
            .attr("class", "song-name")
            .attr("text-anchor", "middle")
            .attr("y", 80)
            .attr("fill", "#64dd43")
            .style("font-size", "20px")
            .text(d.name);

        // Add interactivity
        flowerGroup
            .on("mouseover", (event) => {
                this.showTooltip(event, d);
                d3.select(event.currentTarget)
                    .transition()
                    .duration(200)
                    .attr("transform", `translate(${x}, ${y}) scale(1.1)`);
            })


        .on("mouseout", (event) => {
                this.hideTooltip();
                d3.select(event.currentTarget)
                    .transition()
                    .duration(200)
                    .attr("transform", `translate(${x}, ${y})`);
            });
    }

    showTooltip(event, d) {
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "song-flower-tooltip")

        // if (!d) return;

        // const tooltip = d3.select("body")
        //     .append("div")
        //     .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background-color", "rgba(0, 0, 0, 0.8)")
            .style("color", "#64dd43")
            .style("padding", "10px")
            .style("border", "1px solid #64dd43")
            .style("border-radius", "5px");

        // Find the most prominent feature
        const featureValues = this.features.map(feature => ({
            name: feature,
            value: d[feature]
        }));
        const mostProminent = featureValues.reduce((max, obj) =>
            obj.value > max.value ? obj : max, featureValues[0]);

        // Create tooltip content
        let tooltipContent = `<strong>${d.name}</strong><br><br>`;
        this.features.forEach(feature => {
            const percentage = Math.round(d[feature] * 100);
            tooltipContent += `${feature}: ${percentage}/100<br>`;
        });

        // Add the descriptive sentence
        const descriptions = {
            speechiness: "represents presence of spoken words. This is usually extremely present in rap, some R&B, Latin music, but is also present in any song with words in it",
            acousticness: "measures the presence of more acoustic/melodic melodies and instruments. Typically, acoustic songs have more of a raw feeling to them, meaning less production and editing",
            instrumentalness: "measures how much instrumentation vs. vocal presence is in a song.In Charli's album, most of the instrumentation comes from studio work, mixing and editing"
        };

        tooltipContent += `<br>The most prominent musical feature in "${d.name}" is ${mostProminent.name}, 
        with a score of ${Math.round(mostProminent.value * 100)}/100. 
        ${mostProminent.name} ${descriptions[mostProminent.name]}.`;

        tooltip.html(tooltipContent)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px")
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("font-size", "20px");
    }

    // hideTooltip() {
    //     if (this.tooltip) {
    //         this.tooltip
    //             .transition()
    //             .duration(200)
    //             .style("opacity", 0)
    //             .on("end", () => {
    //                 this.tooltip.style("visibility", "hidden");
    //             });
    //     }
    //     hideTooltip() {
    //         const flowerTooltip = d3.select("body").selectAll(".tooltip");
    //
    //         flowerTooltip
    //             .transition()
    //             .duration(200)
    //             .style("opacity", 0)
    //             .on("end", function() {
    //                 // Only remove if not hovering over the tooltip
    //                 if (!d3.select(this).node().matches(':hover')) {
    //                     d3.select(this).remove();
    //                 }
    //             });
    //     }
        hideTooltip() {
            const flowerTooltip = d3.select("body").selectAll(".song-flower-tooltip");

            flowerTooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
                .on("end", function() {
                    // Only remove if not hovering over the tooltip
                    if (!d3.select(this).node().matches(':hover')) {
                        d3.select(this).remove();
                    }
                });
        }
    

    updateVis() {
        const numCols = 3;
        const numRows = Math.ceil(this.data.length / numCols);
        const cellWidth = (this.width - this.margin.left - this.margin.right) / numCols;
        const cellHeight = (this.height - this.margin.top - this.margin.bottom) / numRows;

        this.data.forEach((d, i) => {
            if (d) {
                const col = i % numCols;
                const row = Math.floor(i / numCols);
                const x = this.margin.left + col * cellWidth + cellWidth / 2;
                const y = this.margin.top + row * cellHeight + cellHeight / 2;
                this.createFlower(d, x, y);
            }
        });
    }
}