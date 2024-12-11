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
        vis.height = 1000;

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
        const legendWidth = 200;
        const legendHeight = 100;
        const legend = this.svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${(this.width - legendWidth) / 2}, ${this.margin.top / 2})`);

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
            Math.cos(angle - Math.PI/6) * leafWidth, Math.sin(angle - Math.PI/6) * leafWidth,
            Math.cos(angle) * leafLength * 0.6, Math.sin(angle) * leafLength * 0.6,
            Math.cos(angle) * leafLength, Math.sin(angle) * leafLength
        );
        path.bezierCurveTo(
            Math.cos(angle) * leafLength * 0.6, Math.sin(angle) * leafLength * 0.6,
            Math.cos(angle + Math.PI/6) * leafWidth, Math.sin(angle + Math.PI/6) * leafWidth,
            0, 0
        );

        return path.toString();
    }

    createFlower(d, x, y) {
        if (!d) return;

        const flowerGroup = this.svg.append("g")
            .attr("class", "flower-group")
            .attr("transform", `translate(${x}, ${y})`);

        const baseRadius = 60;
        const totalPetals = 36;

        this.features.forEach((feature, i) => {
            const numPetals = Math.max(1, Math.round(d[feature] * totalPetals));

            const startAngles = {
                speechiness: Math.PI * 1.5,
                acousticness: Math.PI * 0.8,
                instrumentalness: 0.5
            };

            for (let j = 0; j < numPetals; j++) {
                const angle = startAngles[feature] + (j * Math.PI/5);

                const path = d3.path();
                const leafWidth = baseRadius * 0.4;
                const leafLength = baseRadius;

                path.moveTo(0, 0);
                path.bezierCurveTo(
                    Math.cos(angle - Math.PI/6) * leafWidth, Math.sin(angle - Math.PI/6) * leafWidth,
                    Math.cos(angle) * leafLength * 0.6, Math.sin(angle) * leafLength * 0.6,
                    Math.cos(angle) * leafLength, Math.sin(angle) * leafLength
                );
                path.bezierCurveTo(
                    Math.cos(angle) * leafLength * 0.6, Math.sin(angle) * leafLength * 0.6,
                    Math.cos(angle + Math.PI/6) * leafWidth, Math.sin(angle + Math.PI/6) * leafWidth,
                    0, 0
                );

                flowerGroup.append("path")
                    .attr("d", path.toString())
                    .attr("fill", this.colors[feature])
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 0.5)
                    .attr("opacity", 0.7);
            }
        });

        const titleY = (d.name.length > 30 && d.name !== "360 featuring robyn & yung lean") ? 140 : 100;

        flowerGroup.append("text")
            .attr("class", "song-name")
            .attr("text-anchor", "middle")
            .attr("y", titleY)
            .attr("fill", "#64dd43")
            .style("font-size", "24px")
            .text(d.name);

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
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background-color", "rgba(0, 0, 0, 0.8)")
            .style("color", "#64dd43")
            .style("padding", "10px")
            .style("border", "1px solid #64dd43")
            .style("border-radius", "5px");

        const featureValues = this.features.map(feature => ({ name: feature, value: d[feature] }));
        const mostProminent = featureValues.reduce((max, obj) => obj.value > max.value ? obj : max, featureValues[0]);

        let tooltipContent = `<strong>${d.name}</strong><br><br>`;
        this.features.forEach(feature => {
            const percentage = Math.round(d[feature] * 100);
            tooltipContent += `${feature}: ${percentage}/100<br>`;
        });

        const descriptions = {
            speechiness: "represents presence of spoken words. This is usually extremely present in rap, some R&B, Latin music, but is also present in any song with words in it",
            acousticness: "measures the presence of more acoustic/melodic melodies and instruments. Typically, acoustic songs have more of a raw feeling to them, meaning less production and editing",
            instrumentalness: "measures how much instrumentation vs. vocal presence is in a song. In Charli's album, most of the instrumentation comes from studio work, mixing and editing"
        };

        tooltipContent += `<br>The most prominent musical feature in "${d.name}" is ${mostProminent.name}, with a score of ${Math.round(mostProminent.value * 100)}/100. ${mostProminent.name} ${descriptions[mostProminent.name]}.`;

        tooltip.html(tooltipContent)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 15) + "px")
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("font-size", "24px");
    }

    hideTooltip() {
        const flowerTooltip = d3.select("body").selectAll(".song-flower-tooltip");
        flowerTooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
            .on("end", function() {
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


