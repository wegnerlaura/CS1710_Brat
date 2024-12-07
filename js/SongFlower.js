class SongFlower {
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.features = {
            primary: ["speechiness", "acousticness", "instrumentalness"],
            weight: ["liveness", "valence", "tempo"]
        };

        this.colors = {
            speechiness: "#64dd43",    // Light green
            acousticness: "#04530a",   // Dark green
            instrumentalness: "#7b807c" // Gray
        };

        this.featureDescriptions = {
            speechiness: "represents presence of spoken words",
            acousticness: "measures likelihood of acoustic instruments",
            instrumentalness: "predicts whether a track contains no vocals",
            liveness: "detects presence of live audience",
            valence: "describes musical positiveness",
            tempo: "represents overall estimated pace"
        };

        this.hoverScaleFactor = 1.1; // Add this line
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 60, right: 60, bottom: 115, left: 60};
        vis.width = 400 - vis.margin.left - vis.margin.right;
        vis.height = 1225 - vis.margin.top - vis.margin.bottom;

        vis.container = d3.select("#flower-container")
            .style("display", "grid")
            .style("grid-template-columns", "repeat(3, 1fr)")
            .style("gap", "60px") // Increase gap to allow for growth
            .style("padding", "60px") // Increase padding
            .style("width", "100%")
            .style("max-width", "1200px")
            .style("min-height", "1425px")
            .style("margin", "0 auto");

        if (!d3.select("#tooltip").node()) {
            d3.select("body").append("div")
                .attr("id", "tooltip")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "10px");
        }

        vis.svg = vis.container
            .selectAll(".flower-container")
            .data(vis.data)
            .join("div")
            .attr("class", "flower-container")
            .append("svg")
            .attr("class", "flower")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.width/2 + vis.margin.left},${vis.height/2 + vis.margin.top})`);

        vis.updateVis();
    }

    createPetal(value, angle, scale) {
        const petalPath = d3.path();
        const petalSize = value * scale;
        const width = petalSize * 0.5;

        petalPath.moveTo(0, 0);
        petalPath.bezierCurveTo(
            width * Math.cos(angle - 0.5), width * Math.sin(angle - 0.5),
            petalSize * Math.cos(angle), petalSize * Math.sin(angle),
            0, 0
        );

        return petalPath.toString();
    }

    updateVis() {
        let vis = this;

        let tooltip = d3.select("#tooltip");

        vis.svg.each(function(songData, index) {
            const flower = d3.select(this);
            const flowerGroup = flower.append("g")
                .attr("class", "flower-group");

            const petalCounts = vis.features.weight.map(feature =>
                Math.max(5, Math.floor(songData[feature] * 15))
            );

            vis.features.primary.forEach((feature, layerIndex) => {
                const numPetals = petalCounts[layerIndex];
                const angles = d3.range(numPetals)
                    .map(i => (i * 2 * Math.PI) / numPetals);

                angles.forEach(angle => {
                    flowerGroup.append("path")
                        .attr("d", vis.createPetal(
                            songData[feature],
                            angle,
                            250 + (layerIndex * 40)
                        ))
                        .attr("fill", vis.colors[feature])
                        .attr("opacity", 0.7)
                        .attr("stroke", "#fff")
                        .attr("stroke-width", 0.5)
                        .on("mouseover", function(event) {
                            d3.select(this.parentNode) // Select the flower group
                                .transition()
                                .duration(200)
                                .attr("transform", `scale(${vis.hoverScaleFactor})`);

                            d3.select(this)
                                .transition()
                                .duration(200)
                                .attr("opacity", 1);

                            tooltip.transition()
                                .duration(200)
                                .style("opacity", .9);
                            tooltip.html(`
                            <strong>${songData.name}</strong><br/>
                            ${feature}: ${songData[feature]}<br/>
                            ${vis.featureDescriptions[feature]}
                        `)
                                .style("left", (event.pageX + 10) + "px")
                                .style("top", (event.pageY - 28) + "px");
                        })
                        .on("mouseout", function() {
                            d3.select(this.parentNode) // Select the flower group
                                .transition()
                                .duration(200)
                                .attr("transform", "scale(1)");

                            d3.select(this)
                                .transition()
                                .duration(200)
                                .attr("opacity", 0.7);

                            tooltip.transition()
                                .duration(500)
                                .style("opacity", 0);
                        });
                });
            });

            flower.append("text")
                .attr("y", -vis.height/2 + 370)
                .attr("x", 0)
                .attr("text-anchor", "middle")
                .attr("class", "song-name")
                .style("fill", "#c4f24c")
                .style("font-size", "16px")
                .style("font-weight", "bold")
                .text(songData.name);
        });
    }
}