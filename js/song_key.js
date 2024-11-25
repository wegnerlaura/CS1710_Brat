// song_key.js

const songData = [
    { name: "360", key: 0, danceability: 0.857, line: true, videoUrl: "https://www.youtube.com/watch?v=WJW-VvmRKsE" },
    { name: "Club classics", key: 4, danceability: 0.716, line: false, videoUrl: "https://www.youtube.com/watch?v=rd1AZym4lEY" },
    { name: "Sympathy is a knife", key: 8, danceability: 0.718, line: false, videoUrl: "https://www.youtube.com/watch?v=S9s4Ckt-aKo" },
    { name: "I might say something stupid", key: 6, danceability: 0.504, line: false, videoUrl: "https://www.youtube.com/watch?v=TD2j1OuHoik" },
    { name: "Talk talk", key: 0, danceability: 0.579, line: true, videoUrl: "https://www.youtube.com/watch?v=K5jyIoPbu4M" },
    { name: "Von dutch", key: 10, danceability: 0.706, line: false, videoUrl: "https://www.youtube.com/watch?v=cwZ1L_0QLjw" },
    { name: "Everything is romantic", key: 3, danceability: 0.485, line: false, videoUrl: "https://www.youtube.com/watch?v=FTIvFD7TCVg" },
    { name: "Rewind", key: 1, danceability: 0.504, line: false, videoUrl: "https://www.youtube.com/watch?v=cN7he0b0sK8" },
    { name: "So I", key: 2, danceability: 0.725, line: false, videoUrl: "https://www.youtube.com/watch?v=r9k1CR4LBjk" },
    { name: "Girl, so confusing", key: 11, danceability: 0.693, line: false, videoUrl: "https://www.youtube.com/watch?v=QXKvjyoH5lM" },
    { name: "Apple", key: 0, danceability: 0.804, line: true, videoUrl: "https://www.youtube.com/watch?v=CPWxExGk7PM" },
    { name: "B2b", key: 1, danceability: 0.769, line: false, videoUrl: "https://www.youtube.com/watch?v=If4-ckGcr0c" },
    { name: "Mean girls", key: 6, danceability: 0.708, line: false, videoUrl: "https://www.youtube.com/watch?v=IKUQDMEBXN0" },
    { name: "I think about it all the time", key: 0, danceability: 0.819, line: true, videoUrl: "https://www.youtube.com/watch?v=Mn0aho8Ayfk" },
    { name: "365", key: 0, danceability: 0.761, sharp: true, line: true, videoUrl: "https://www.youtube.com/watch?v=Ol9CCM240Ag" }
];

function createSongKeyVisualization() {
    const width = 1200;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const colors = ["#64dd43", "#04530a", "#7b807c", "#c4f24c"];

    const svg = d3.select("#key-visualization")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    const vizGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Draw staff lines
    const staffLines = [0, 1, 2, 3, 4];
    const lineSpacing = 20;
    staffLines.forEach(line => {
        vizGroup.append("line")
            .attr("x1", 0)
            .attr("y1", height/2 + line * lineSpacing)
            .attr("x2", width - margin.left - margin.right)
            .attr("y2", height/2 + line * lineSpacing)
            .attr("stroke", "#c4f24c")
            .attr("stroke-width", 2);
    });

    // Draw treble clef
    vizGroup.append("text")
        .attr("x", 30)
        .attr("y", height/2 + 45)
        .attr("font-size", "120px")
        .attr("font-family", "Arial Unicode MS, sans-serif")
        .attr("fill", "#c4f24c")
        .text("\u{1D11E}");

    function keyToStaffPosition(key) {
        const basePosition = height/2;
        const positions = {
            0: basePosition + 40,
            1: basePosition + 35,
            2: basePosition + 30,
            3: basePosition + 25,
            4: basePosition + 20,
            5: basePosition + 15,
            6: basePosition + 10,
            7: basePosition + 5,
            8: basePosition,
            9: basePosition - 5,
            10: basePosition - 10,
            11: basePosition - 15
        };
        return positions[key];
    }

    const noteGroup = vizGroup.selectAll("g.note")
        .data(songData)
        .enter()
        .append("g")
        .attr("class", "note")
        .attr("transform", (d, i) => `translate(${120 + i * ((width - 150) / songData.length)}, ${keyToStaffPosition(d.key)})`);

    // Add note heads
    noteGroup.append('ellipse')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('rx', (d) => d.danceability * 15)
        .attr('ry', (d) => d.danceability * 12)
        .attr('fill', (d, i) => colors[i % colors.length]);

    // Add stems
    noteGroup.append("line")
        .attr("x1", (d) => d.danceability * 15)
        .attr("y1", 0)
        .attr("x2", (d) => d.danceability * 15)
        .attr("y2", -80)
        .attr('stroke', (d, i) => colors[i % colors.length])
        .attr('stroke-width', 3);

    // Add sharps
    noteGroup.filter((d) => [1, 3, 6, 8, 10].includes(d.key) || d.sharp)
        .append('text')
        .attr('x', (d) => d.danceability * 20)
        .attr('y', 8)
        .attr('font-size', '30px')
        .attr('fill', (d, i) => colors[i % colors.length])
        .text('♯');

    // Create tooltip
    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background', 'rgba(0, 0, 0, 0.9)')
        .style('padding', '10px')
        .style('border', '1px solid #c4f24c')
        .style('pointer-events', 'all')
        .style('z-index', '1000');

    let currentNote = null;

    // Add note interactivity
    noteGroup.on('mouseover', function(event, d) {
        event.stopPropagation();
        currentNote = this;
        const note = d3.select(this);

        note.select('ellipse')
            .transition()
            .duration(200)
            .attr('rx', (d) => d.danceability * 18)
            .attr('ry', (d) => d.danceability * 15);

        tooltip
            .style('opacity', 0.9)
            .html(`
                <strong>Title:</strong> ${d.name}<br>
                <strong>Key:</strong> ${getKeyName(d.key)}${d.sharp ? '♯' : ''}<br>
                <strong>Danceability score:</strong> ${d.danceability.toFixed(3)}<br>
                <a href="${d.videoUrl}" target="_blank" style="color: #c4f24c;">Watch Music Video</a>
            `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
    });

    // Add tooltip hover behavior
    tooltip.on('mouseleave', function(event) {
        const toElement = event.relatedTarget;
        if (toElement && (toElement === currentNote || currentNote.contains(toElement))) {
            return;
        }

        d3.select(currentNote).select('ellipse')
            .transition()
            .duration(200)
            .attr('rx', (d) => d.danceability * 15)
            .attr('ry', (d) => d.danceability * 12);

        tooltip.transition()
            .duration(500)
            .style('opacity', 0);
    });
}

function getKeyName(key) {
    const keyNames = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'];
    return keyNames[key];
}

createSongKeyVisualization();