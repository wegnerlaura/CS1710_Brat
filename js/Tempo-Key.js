// Visualization dimensions (renamed variables to avoid conflicts)
const diagramWidth = 800;
const diagramHeight = 800;
const diagramRadius = Math.min(diagramWidth, diagramHeight) / 2;

// Create a unique SVG container for the diagram
const tempoKeySVG = d3.select("#visualization")
    .append("svg")
    .attr("width", diagramWidth)
    .attr("height", diagramHeight)
    .append("g")
    .attr("transform", `translate(${diagramWidth / 2}, ${diagramHeight / 2})`);

// Load data from the CSV file
d3.csv("data/brat.csv").then(data => {
    // Ensure numerical values for key and tempo
    data.forEach(d => {
        d.tempo = +d.tempo;
        d.key = +d.key;
    });

    // Scales for the visualization
    const angleScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 2 * Math.PI]);

    const keyScale = d3.scaleLinear()
        .domain([0, 11]) // Musical keys range from 0 to 11
        .range([diagramRadius * 0.5, diagramRadius * 0.8]);

    const tempoScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.tempo), d3.max(data, d => d.tempo)])
        .range([diagramRadius * 0.1, diagramRadius * 0.3]);

    // Add key path
    tempoKeySVG.append("path")
        .datum(data)
        .attr("fill", "rgba(196, 242, 76, 0.2)")
        .attr("stroke", "#c4f24c")
        .attr("stroke-width", 2)
        .attr("d", d3.lineRadial()
            .angle((d, i) => angleScale(i))
            .radius(d => keyScale(d.key))
        );

    // Add tempo path
    tempoKeySVG.append("path")
        .datum(data)
        .attr("fill", "rgba(255, 0, 0, 0.2)")
        .attr("stroke", "#ff0000")
        .attr("stroke-width", 2)
        .attr("d", d3.lineRadial()
            .angle((d, i) => angleScale(i))
            .radius(d => tempoScale(d.tempo))
        );
}).catch(error => {
    console.error("Error loading or processing data:", error);
});
