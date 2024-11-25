// Visualization dimensions
const diagramWidth = 800;
const diagramHeight = 800;
const diagramRadius = Math.min(diagramWidth, diagramHeight) / 2;

// Create SVG container
const tempoKeySVG = d3.select("#visualization")
    .append("svg")
    .attr("width", diagramWidth + 200)
    .attr("height", diagramHeight)
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
        // Outer blue ring width
        .range([diagramRadius * 0.7, diagramRadius * 0.9]);

    const tempoScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.tempo), d3.max(data, d => d.tempo)])
        // Extend red slices inward to the center
        .range([0, diagramRadius * 0.7]);

    // Define color scales for key and tempo
    const keyColorScale = d3.scaleSequential()
        .domain([0, 11])
        .interpolator(d3.interpolateGreens);

    const tempoColorScale = d3.scaleSequential()
        .domain([d3.min(data, d => d.tempo), d3.max(data, d => d.tempo)])
        .interpolator(d3.interpolateReds);

    // Draw key arcs (outer blue ring)
    data.forEach((d, i) => {
        // Calculate angles
        const startAngle = angleScale(i);
        const endAngle = angleScale(i + 1);

        // Arc generator for key
        const keyArc = d3.arc()
            // Inner edge of blue arcs
            .innerRadius(diagramRadius * 0.7)
            // Outer edge of blue arcs
            .outerRadius(diagramRadius * 0.9)
            .startAngle(startAngle)
            .endAngle(endAngle);

        tempoKeySVG.append("path")
            .attr("d", keyArc)
            .attr("fill", keyColorScale(d.key))
            .attr("stroke", "none")
            .on("mouseover", () => showTooltip(d))
            .on("mousemove", moveTooltip)
            .on("mouseout", hideTooltip);
    });

    // Draw tempo arcs (inner red region)
    data.forEach((d, i) => {
        // Calculate angles
        const startAngle = angleScale(i);
        const endAngle = angleScale(i + 1);

        // Arc generator for tempo
        const tempoArc = d3.arc()
            // Start from the center
            .innerRadius(0)
            // Outer edge matches blue inner edge
            .outerRadius(diagramRadius * 0.7)
            .startAngle(startAngle)
            .endAngle(endAngle);

        tempoKeySVG.append("path")
            .attr("d", tempoArc)
            .attr("fill", tempoColorScale(d.tempo))
            .attr("stroke", "none")
            .on("mouseover", () => showTooltip(d))
            .on("mousemove", moveTooltip)
            .on("mouseout", hideTooltip);
    });

    // Add legend
    const legend = tempoKeySVG.append("g")
        // Position legend outside the diagram
        .attr("transform", `translate(${diagramRadius + 50}, ${-diagramRadius + 20})`);

    // Key legend
    legend.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", d3.interpolateBlues(0.5));

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
        .attr("fill", d3.interpolateReds(0.5));

    legend.append("text")
        .attr("x", 20)
        .attr("y", 37)
        .attr("fill", "#FFFFFF")
        .style("font-size", "12px")
        .text("Tempo (inner circle)");

    // Tooltip handlers
    function showTooltip(d) {
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
