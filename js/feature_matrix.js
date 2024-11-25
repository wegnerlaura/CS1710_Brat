class FeatureMatrix {
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.features = [
            "speechiness",
            "acousticness",
            "instrumentalness",
            "liveness",
            "valence",
            "tempo"
        ];

        this.colors = ["#64dd43", "#04530a", "#7b807c", "#c4f24c"];

        // Define feature descriptions
        this.featureDescriptions = {
            "speechiness": "Speechiness detects the presence of spoken words in a track. Values above 0.66 describe tracks that are probably made entirely of spoken words, values between 0.33 and 0.66 describe tracks that may contain both music and speech, and values below 0.33 most likely represent music.",
            "acousticness": "Acousticness measures the likelihood a recording was created by acoustic means (non-electronic instruments). A value of 1.0 represents high confidence the track is acoustic.",
            "instrumentalness": "Instrumentalness predicts whether a track contains no vocals. The closer to 1.0, the greater likelihood the track has no vocal content. Values above 0.5 represent instrumental tracks.",
            "liveness": "Liveness detects the presence of an audience in the recording. Higher values represent an increased probability that the track was performed live.",
            "valence": "Valence describes the musical positiveness conveyed by a track. Tracks with high valence sound more positive (happy, cheerful, euphoric), while tracks with low valence sound more negative (sad, depressed, angry).",
            "tempo": "Tempo represents the overall estimated pace of a track in beats per minute (BPM). This value has been normalized to a 0-1 scale, where 1.0 represents 200 BPM."
        };

        this.initVis();
    }

    initVis() {
        let vis = this;

        // Set up dimensions
        vis.margin = {top: 40, right: 120, bottom: 40, left: 200};
        vis.width = 1000 - vis.margin.left - vis.margin.right;
        vis.height = 600 - vis.margin.top - vis.margin.bottom;

        // Create SVG
        vis.svg = d3.select("#" + vis.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left},${vis.margin.top})`);

        // Scales
        vis.xScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, vis.width]);

        vis.yScale = d3.scaleBand()
            .range([0, vis.height])
            .padding(0.2);

        vis.colorScale = d3.scaleOrdinal()
            .domain(vis.features)
            .range(vis.colors);

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        // Filter for standard album tracks only
        const standardTracks = [
            "360",
            "club classics",
            "sympathy is a knife",
            "i might say something stupid",
            "talk talk",
            "von dutch",
            "everything is romantic",
            "rewind",
            "so i",
            "girl, so confusing",
            "apple",
            "b2b",
            "mean girls",
            "365"
        ];

        // Filter and normalize data
        vis.processedData = vis.data
            .filter(d => standardTracks.includes(d.name.toLowerCase()))
            .map(d => {
                let obj = {...d};
                obj.tempo = d.tempo / 200; // Normalize tempo to 0-1 range
                return obj;
            });

        vis.yScale.domain(vis.processedData.map(d => d.name));

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Create groups for each song
        let songGroups = vis.svg.selectAll(".song-group")
            .data(vis.processedData)
            .join("g")
            .attr("class", "song-group")
            .attr("transform", d => `translate(0,${vis.yScale(d.name)})`);

        // Add feature segments
        let xOffset = 0;
        vis.features.forEach((feature, i) => {
            songGroups.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", d => vis.xScale(d[feature]))
                .attr("height", vis.yScale.bandwidth())
                .attr("fill", vis.colorScale(feature))
                .attr("transform", `translate(${xOffset},0)`)
                .on("mouseover", function(event, d) {
                    d3.select(this).style("opacity", 0.8);
                    // Show tooltip
                    d3.select("body").append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0.9)
                        .style("background", "rgba(0, 0, 0, 0.9)")
                        .style("color", "#c4f24c")
                        .style("padding", "10px")
                        .style("border", "1px solid #c4f24c")
                        .html(`
                            <strong>${d.name}</strong><br/>
                            ${feature}: ${d[feature].toFixed(3)}
                            ${feature === 'tempo' ? ' (normalized)' : ''}
                        `)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    d3.select(this).style("opacity", 1);
                    d3.selectAll(".tooltip").remove();
                });

            xOffset += vis.width / vis.features.length;
        });

        // Add song labels
        vis.svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(vis.yScale))
            .selectAll("text")
            .style("fill", "#c4f24c")
            .style("font-size", "12px");

        // Add feature labels with hover descriptions
        vis.features.forEach((feature, i) => {
            vis.svg.append("text")
                .attr("x", (i + 0.5) * (vis.width / vis.features.length))
                .attr("y", -10)
                .attr("text-anchor", "middle")
                .style("fill", "#c4f24c")
                .style("font-size", "14px")
                .text(feature)
                .on("mouseover", function(event) {
                    d3.select("body").append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0.9)
                        .style("background", "rgba(0, 0, 0, 0.9)")
                        .style("color", "#c4f24c")
                        .style("padding", "10px")
                        .style("border", "1px solid #c4f24c")
                        .style("max-width", "300px")
                        .html(`<strong>${feature}:</strong><br>${vis.featureDescriptions[feature]}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    d3.selectAll(".tooltip").remove();
                });
        });
    }
}