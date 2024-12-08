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

    // Find the index of the fastest tempo
    const maxTempoIndex = data.findIndex(d => d.tempo === d3.max(data, d => d.tempo));

// Rotate the data to place the fastest tempo at 12 o'clock
    const rotatedData = [...data.slice(maxTempoIndex), ...data.slice(0, maxTempoIndex)];


    const sortedData = data.sort((a, b) => b.tempo - a.tempo);
    const angleScale = d3.scaleLinear()
        .domain([0, sortedData.length]) // Map sorted data indices to angles
        .range([-Math.PI / 2, 3 * Math.PI / 2]);

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
        .data(rotatedData) // Use rotatedData here
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
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("opacity", 1)
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

// Add gradient-based legend
    const legendWidth = 120; // Adjust the width of the gradient
    const legendHeight = 20; // Adjust the height of the gradient
    const legendPadding = 10; // Padding between legend items

// Key gradient legend
    const keyGradient = tempoKeySVG.append("defs")
        .append("linearGradient")
        .attr("id", "keyGradient")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

    keyGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", keyColorScale(0)); // Start color of key gradient

    keyGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", keyColorScale(11)); // End color of key gradient

    tempoKeySVG.append("rect")
        .attr("x", diagramRadius + 50) // Adjust position
        .attr("y", -diagramRadius + 20) // Adjust position
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#keyGradient)");

    tempoKeySVG.append("text")
        .attr("x", diagramRadius + 50 + legendWidth / 2)
        .attr("y", -diagramRadius + 15) // Position above the rectangle
        .attr("text-anchor", "middle")
        .attr("fill", "#FFFFFF")
        .style("font-size", "12px")
        .text("Key (outer circle)");

// Tempo gradient legend
    const tempoGradient = tempoKeySVG.append("defs")
        .append("linearGradient")
        .attr("id", "tempoGradient")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

    tempoGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", tempoColorScale(d3.min(data, d => d.tempo))); // Start color of tempo gradient

    tempoGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", tempoColorScale(d3.max(data, d => d.tempo))); // End color of tempo gradient

    tempoKeySVG.append("rect")
        .attr("x", diagramRadius + 50) // Adjust position
        .attr("y", -diagramRadius + 50 + legendPadding) // Adjust position
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#tempoGradient)");

    tempoKeySVG.append("text")
        .attr("x", diagramRadius + 50 + legendWidth / 2)
        .attr("y", -diagramRadius + 45 + legendPadding) // Position above the rectangle
        .attr("text-anchor", "middle")
        .attr("fill", "#FFFFFF")
        .style("font-size", "12px")
        .text("Tempo (inner circle)");

});
