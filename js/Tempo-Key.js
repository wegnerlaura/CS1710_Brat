// Visualization dimensions
const diagramWidth = 800;
const diagramHeight = 800;
const diagramRadius = Math.min(diagramWidth, diagramHeight) / 2;

// Create SVG container
const tempoKeySVG = d3.select("#visualization")
    .append("svg")
    .attr("width", diagramWidth + 200)
    .attr("height", diagramHeight + 100) // Extra height for the sliders
    .append("g")
    .attr("transform", `translate(${diagramWidth / 2}, ${diagramHeight / 2})`);

// Create a tooltip container
const tooltip = d3.select("#visualization")
    .append("div")
    .style("position", "absolute")
    .style("background", "rgba(0, 0, 0, 0.8)")
    .style("color", "#c4f24c")
    .style("padding", "10px")
    .style("border-radius", "5px")
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("font-size", "12px");

// Load data
d3.csv("data/brat.csv").then(data => {
    // Ensure numerical values for key and tempo
    data.forEach(d => {
        d.tempo = +d.tempo;
        d.key = +d.key;
    });

    // Define scales
    const angleScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 2 * Math.PI]);

    const keyScale = d3.scaleLinear()
        // Musical keys range from 0 to 11
        .domain([0, 11])
        .range([diagramRadius * 0.7, diagramRadius * 0.9]);

    const tempoScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.tempo), d3.max(data, d => d.tempo)])
        .range([0, diagramRadius * 0.7]);

    // Define color scales for key and tempo
    const keyColorScale = d3.scaleSequential()
        .domain([0, 11])
        .interpolator(d3.interpolateGreens);

    const tempoColorScale = d3.scaleSequential()
        .domain([d3.min(data, d => d.tempo), d3.max(data, d => d.tempo)])
        .interpolator(d3.interpolateReds);

    // Select sliders and value display containers
    const keySlider = d3.select("#key-slider");
    const tempoSlider = d3.select("#tempo-slider");
    const keyValueDisplay = d3.select("#key-value");
    const tempoValueDisplay = d3.select("#tempo-value");

    // Draw key arcs (outer green ring)
    const keyArcs = tempoKeySVG.selectAll(".key-arc")
        .data(data)
        .enter()
        .append("path")
        .attr("class", "key-arc")
        .attr("d", (d, i) => {
            const startAngle = angleScale(i);
            const endAngle = angleScale(i + 1);
            return d3.arc()
                .innerRadius(diagramRadius * 0.7)
                .outerRadius(diagramRadius * 0.9)
                .startAngle(startAngle)
                .endAngle(endAngle)();
        })
        .attr("fill", d => keyColorScale(d.key))
        .attr("stroke", "#000") // Add black stroke here
        .attr("stroke-width", 1) // Adjust the thickness of the black lines
        .attr("opacity", 1) // Initial opacity
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip);


    // Draw tempo arcs (inner red region)
    const tempoArcs = tempoKeySVG.selectAll(".tempo-arc")
        .data(data)
        .enter()
        .append("path")
        .attr("class", "tempo-arc")
        .attr("d", (d, i) => {
            const startAngle = angleScale(i);
            const endAngle = angleScale(i + 1);
            return d3.arc()
                .innerRadius(0)
                .outerRadius(diagramRadius * 0.7)
                .startAngle(startAngle)
                .endAngle(endAngle)();
        })
        .attr("fill", d => tempoColorScale(d.tempo))
        .attr("stroke", "#000") // Add black stroke here
        .attr("stroke-width", 1) // Adjust the thickness of the black lines
        .attr("opacity", 1) // Initial opacity
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip);


    // Function to update filters dynamically
    function updateFilters() {
        // Get slider value for keys
        const keyThreshold = +keySlider.node().value;
        // Get slider value for tempo
        const tempoThreshold = +tempoSlider.node().value;

        // Update value displays dynamically
        keyValueDisplay.text(`Key: ${keyThreshold}`);
        tempoValueDisplay.text(`Tempo: ${tempoThreshold} BPM`);

        // Update key arcs (outer circle)
        keyArcs.attr("opacity", d => d.key <= keyThreshold ? 1 : 0.1);

        // Update tempo arcs (inner circle)
        tempoArcs.attr("opacity", d => d.tempo <= tempoThreshold ? 1 : 0.1);
    }

    // Attach event listeners for sliders
    keySlider.on("input", updateFilters);
    tempoSlider.on("input", updateFilters);

    // Initialize with default slider values
    updateFilters();

    // Add legend
    const legend = tempoKeySVG.append("g")
        .attr("transform", `translate(${diagramRadius + 50}, ${-diagramRadius + 20})`);

    // Key legend
    legend.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", keyColorScale(5.5));

    legend.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .attr("fill", "#FFFFFF")
        .style("font-size", "12px")
        .text("Key (outer circle)");

    // Tempo legend
    legend.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("y", 25)
        .attr("fill", tempoColorScale((d3.min(data, d => d.tempo) + d3.max(data, d => d.tempo)) / 2));

    legend.append("text")
        .attr("x", 20)
        .attr("y", 37)
        .attr("fill", "#FFFFFF")
        .style("font-size", "12px")
        .text("Tempo (inner circle)");

    // Tooltip handlers
    function showTooltip(event, d) {
        tooltip.style("opacity", 1)
            .html(`
                <strong>${d.name}</strong><br>
                <span>Tempo: ${d.tempo}</span><br>
                <span>Key: ${d.key}</span>
            `);
    }

    function moveTooltip(event) {
        tooltip.style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY + 10}px`);
    }

    function hideTooltip() {
        tooltip.style("opacity", 0);
    }
});
