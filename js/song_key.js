// song_key.js

// Data for the songs (key and danceability)
const songData = [
    { name: "360", key: 0, danceability: 0.857 },
    { name: "Club classics", key: 4, danceability: 0.716 },
    { name: "Sympathy is a knife", key: 7, danceability: 0.718 },
    { name: "I might say something stupid", key: 5, danceability: 0.504 },
    { name: "Talk talk", key: 0, danceability: 0.579 },
    { name: "Von dutch", key: 10, danceability: 0.706 },
    { name: "Everything is romantic", key: 2, danceability: 0.485 },
    { name: "Rewind", key: 1, danceability: 0.504 },
    { name: "So I", key: 2, danceability: 0.725 },
    { name: "Girl, so confusing", key: 11, danceability: 0.693 },
    { name: "Apple", key: 0, danceability: 0.804 },
    { name: "B2b", key: 1, danceability: 0.769 },
    { name: "Mean girls", key: 6, danceability: 0.708 },
    { name: "I think about it all the time", key: 0, danceability: 0.819 },
    { name: "365", key: 1, danceability: 0.761 }
];

// Set up the SVG
const width = 600;
const height = 300;
const margin = { top: 40, right: 20, bottom: 20, left: 60 };

const svg = d3.select("#key-visualization")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

// Draw the staff lines
const staffLines = [0, 1, 2, 3, 4];
staffLines.forEach(line => {
    svg.append("line")
        .attr("x1", margin.left)
        .attr("y1", margin.top + line * 20)
        .attr("x2", width - margin.right)
        .attr("y2", margin.top + line * 20)
        .attr("stroke", "#c4f24c");
});

// Draw the treble clef
svg.append("text")
    .attr("x", margin.left - 5)
    .attr("y", margin.top + 75)
    .attr("font-size", "80px")
    .attr("font-family", "Arial Unicode MS, sans-serif")
    .attr("fill", "#c4f24c")
    .text("\u{1D11E}");

// Map keys to y-positions
const keyToY = {
    0: 100, 1: 95, 2: 90, 3: 85, 4: 80, 5: 75, 6: 70,
    7: 65, 8: 60, 9: 55, 10: 50, 11: 45
};

// Create notes with staffs
const noteGroup = svg.selectAll("g.note")
    .data(songData)
    .enter()
    .append("g")
    .attr("class", "note")
    .attr("transform", (d, i) => `translate(${margin.left + 80 + i * 30}, ${margin.top + keyToY[d.key]})`);

noteGroup.append("line")
    .attr("x1", d => d.danceability * 8)
    .attr("y1", d => d.danceability * 6 - 4)
    .attr("x2", d => d.danceability * 8)
    .attr("y2", -40)
    .attr("stroke", "#c4f24c")
    .attr("stroke-width", 1);

noteGroup.append("ellipse")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("rx", d => d.danceability * 8)
    .attr("ry", d => d.danceability * 6)
    .attr("fill", "#c4f24c");

// Add horizontal lines for C and C# notes
noteGroup.filter(d => d.key === 0 || d.key === 1)
    .append("line")
    .attr("x1", d => -d.danceability * 8 - 5)  // Extend slightly to the left
    .attr("y1", 0)  // Center of the note
    .attr("x2", d => d.danceability * 8 + 5)   // Extend slightly to the right
    .attr("y2", 0)  // Center of the note
    .attr("stroke", "#c4f24c")
    .attr("stroke-width", 1);

// Add sharp signs
svg.selectAll("text.sharp")
    .data(songData.filter(d => [1, 3, 6, 8, 10].includes(d.key)))
    .enter()
    .append("text")
    .attr("class", "sharp")
    .attr("x", (d, i) => margin.left + 85 + songData.findIndex(song => song === d) * 30)
    .attr("y", d => margin.top + keyToY[d.key] - 5)
    .attr("font-size", "20px")
    .attr("fill", "#c4f24c")
    .text("♯");

// Function to get key name from number
function getKeyName(key) {
    const keyNames = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'];
    return keyNames[key];
}

// Add hover functionality
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

noteGroup.on("mouseover", function(event, d) {
    tooltip.transition()
        .duration(200)
        .style("opacity", .9);
    tooltip.html(`<strong>Title:</strong> ${d.name}<br>
                  <strong>Key:</strong> ${getKeyName(d.key)}<br>
                  <strong>Danceability score:</strong> ${d.danceability.toFixed(3)}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
})
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

// modify these numbers to place songs and key in the right spot compared to the visualization
// Add x-axis label
svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 5)
    .attr("text-anchor", "middle")
    .attr("fill", "#c4f24c")
    .text("Songs");

// Add y-axis label
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .attr("fill", "#c4f24c")
    .text("Key");