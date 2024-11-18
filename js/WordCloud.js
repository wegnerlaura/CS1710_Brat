let words = []
let colors = ["#64dd43", "black", "#04530a", "#7b807c"]

const width = 800;
const height = 400;

const svg = d3.select("section")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const layout = d3.layout
    .cloud()
    .size([width, height])
    .words(
        words.map((word) => ({
            text: word.word,
            size: word.quantity * 20,
        }))
    )
    .padding(10)
    .rotate(0)
    .fontSize(d => d.size)
    .spiral("rectangular")
    .on("end", draw);

layout.start();

function draw (words) {
    svg.selectAll("*").remove();

    svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", d => d.size + "px")
        .style("fill", (d,i) => {
            return colors[i % colors.length];
        }).attr("text-anchor", "middle")
        .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
        .text((d) => d.text)
}