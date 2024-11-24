let words = [
    {word: "amor", quantity: 5},
    {word: "love", quantity: 4},
    {word: "brat", quantity: 3}
]
let colors = ["#64dd43", "black", "#04530a", "#7b807c"]

const width = 800;
const height = 400;

const svg = d3.select(".word-cloud-section .visual-placeholder")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const fontScale = 20;

d3.layout.cloud()
    .size([width, height])
    .words(
        words.map(d => ({
            text: d.word,
            size: d.quantity * fontScale
        }))
    )
    .padding(20)
    .rotate(0)
    .fontSize(d => d.size)
    .spiral("archimedean")
    .on("end", draw)
    .start();

function draw (words) {
    svg.selectAll("*").remove();

    const container = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    container.append("rect")
        .attr("x", width)
        .attr("y", height)
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "white")

    const getColor = (d) => {
        const originalWord = words.find(w => w.text === d.text);
        const colorIndex = Math.floor((originalWord.size / fontScale) - 1) % colors.length;
        return colors[colorIndex];
    };

    container.selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", d => d.size + "px")
        .style("fill", d => getColor(d))
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
        .text((d) => d.text);


    console.log(words.map(d => ({
        text: d.text,
        size: d.size,
        x: d.x,
        y: d.y
    })))
}

console.log("words", words)