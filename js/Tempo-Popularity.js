// Visualization dimensions
const diagramWidth = 800;
const diagramHeight = 800;
const diagramRadius = (Math.min(diagramWidth, diagramHeight) / 2) * 0.9;

// Create SVG container
const tempoKeySVG = d3.select("#visualization")
    .append("svg")
    .attr("width", diagramWidth + 200)
    .attr("height", diagramHeight + 400)
    .append("g")
    .attr("transform", `translate(${diagramWidth / 2 - 80}, ${diagramHeight / 2 + 50})`);

// Create legend group
const legendGroup = tempoKeySVG.append("g")
    .attr("transform", `translate(0, ${-diagramRadius - 120})`);


// Create a tooltip container
const tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "rgba(0, 0, 0, 0.8)")
    .style("color", "#64dd43")
    .style("padding", "13px")
    .style("border-radius", "5px")
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("z-index", 1000)
    .style("font-size", "20px");


// Load data
d3.csv("data/brat.csv").then(data => {
    // Ensure numerical values for tempo, popularity
    data.forEach(d => {
        d.tempo = +d.tempo;
        d.popularity = +d.popularity; // Ensure popularity is numeric
    });

    // Sort data by tempo in descending order (highest tempo first)
    const sortedData = data.sort((a, b) => b.tempo - a.tempo);

    // Define scales
    const angleScale = d3.scaleLinear()
        .domain([0, sortedData.length]) // Map sorted data indices to angles
        .range([-Math.PI / 2, 4 * Math.PI / 2]); // Start at 12 o’clock (-90 degrees)

    const popularityScale = d3.scaleLinear()
        .domain([d3.min(sortedData, d => d.popularity), d3.max(sortedData, d => d.popularity)]) // Use popularity data
        .range([diagramRadius * 0.7, diagramRadius * 0.9]);

    const tempoScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.tempo), d3.max(data, d => d.tempo)])
        .range([0, diagramRadius * 0.7]);

    // Define color scales for popularity (green) and tempo
    const popularityColorScale = d3.scaleSequential()
        .domain([d3.min(sortedData, d => d.popularity), d3.max(sortedData, d => d.popularity)]) // Use popularity range
        .interpolator(d3.interpolateGreens);

    const tempoColorScale = d3.scaleSequential()
        .domain([d3.min(data, d => d.tempo), d3.max(data, d => d.tempo)])
        .interpolator(d3.interpolateReds);

    // Select sliders and value display containers
    const popularitySlider = d3.select("#popularity-slider").node();
    const tempoSlider = d3.select("#tempo-slider").node();
    const popularityValueDisplay = d3.select("#popularity-value");
    const tempoValueDisplay = d3.select("#tempo-value");

    // Draw popularity arcs (outer green ring)
    const popularityArcs = tempoKeySVG.selectAll(".popularity-arc")
        .data(sortedData) // Use sortedData for consistent order
        .enter()
        .append("path")
        .attr("class", "popularity-arc")
        .attr("d", (d, i) => {
            const startAngle = angleScale(i);
            const endAngle = angleScale(i + 1);
            return d3.arc()
                .innerRadius(diagramRadius * 0.7)
                .outerRadius(diagramRadius * 0.9)
                .startAngle(startAngle)
                .endAngle(endAngle)();
        })
        .attr("fill", d => popularityColorScale(d.popularity)) // Use popularity color scale
        .attr("stroke", "#000") // Add black stroke here
        .attr("stroke-width", 1) // Adjust the thickness of the black lines
        .attr("opacity", 1) // Initial opacity
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip);

    // Draw tempo arcs (inner red region)
    const tempoArcs = tempoKeySVG.selectAll(".tempo-arc")
        .data(sortedData) // Use sortedData for consistent order
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
        // Get slider values
        const popularityThreshold = popularitySlider ? +popularitySlider.value : d3.max(sortedData, d => d.popularity);
        const tempoThreshold = tempoSlider ? +tempoSlider.value : d3.max(sortedData, d => d.tempo);

        // Update value displays dynamically
        popularityValueDisplay.text(`Popularity: ${popularityThreshold}`);
        tempoValueDisplay.text(`Tempo: ${tempoThreshold} BPM`);

        // Update popularity arcs (outer circle)
        popularityArcs.attr("opacity", d => d.popularity <= popularityThreshold ? 1 : 0.1);


        // Update tempo arcs (inner circle)
        tempoArcs.attr("opacity", d => d.tempo <= tempoThreshold ? 1 : 0.1);
    }

    // Attach event listeners for sliders
    d3.select("#popularity-slider").on("input", updateFilters);
    d3.select("#tempo-slider").on("input", updateFilters);

    // Initialize with default slider values
    updateFilters();

    // Tooltip handlers
    function showTooltip(event, d) {
        tooltip.style("opacity", 1)
            .html(`
                <strong>${d.name}</strong><br>
                <span>Tempo: ${d.tempo}</span><br>
                <span>Popularity: ${d.popularity}</span>
            `);
    }

    function moveTooltip(event) {
        tooltip.style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY + 10}px`);
    }

    function hideTooltip() {
        tooltip.style("opacity", 0);
    }

    // Gradient-based legend
    const legendWidth = 120;
    const legendHeight = 20;

// Create defs for gradients
    const defs = tempoKeySVG.append("defs");

// Popularity gradient legend
    const popularityGradient = defs.append("linearGradient")
        .attr("id", "popularityGradient")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

    popularityGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", popularityColorScale(d3.min(data, d => d.popularity)));

    popularityGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", popularityColorScale(d3.max(data, d => d.popularity)));

// Tempo gradient legend
    const tempoGradient = defs.append("linearGradient")
        .attr("id", "tempoGradient")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

    tempoGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", tempoColorScale(d3.min(data, d => d.tempo)));

    tempoGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", tempoColorScale(d3.max(data, d => d.tempo)));

/// Add popularity legend rectangle
    tempoKeySVG.append("rect")
        .attr("x", -legendWidth / 2)
        .attr("y", -diagramRadius)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#popularityGradient)");

// Add popularity legend text
    tempoKeySVG.append("text")
        .attr("x", 0)
        .attr("y", -diagramRadius - 8)
        .attr("text-anchor", "middle")
        .attr("fill", "#FFFFFF")
        .style("font-size", "20px")
        .text("Popularity (outer circle)");

// Add tempo legend rectangle
    tempoKeySVG.append("rect")
        .attr("x", -legendWidth / 2)
        .attr("y", -diagramRadius - 60)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#tempoGradient)");

// Add tempo legend text
    tempoKeySVG.append("text")
        .attr("x", 0)
        .attr("y", -diagramRadius - 68)
        .attr("text-anchor", "middle")
        .attr("fill", "#FFFFFF")
        .style("font-size", "20px")
        .text("Tempo (inner circle)");
});

