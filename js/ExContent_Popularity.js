// excontent_popularity.js

document.addEventListener('DOMContentLoaded', function() {
    // Data for the songs (explicit and popularity)
    const songData = [
        { name: "360", explicit: true, popularity: 54 },
        { name: "Club classics", explicit: false, popularity: 54 },
        { name: "Sympathy is a knife", explicit: true, popularity: 54 },
        { name: "I might say something stupid", explicit: false, popularity: 49 },
        { name: "Talk talk", explicit: false, popularity: 52 },
        { name: "Von dutch", explicit: true, popularity: 54 },
        { name: "Everything is romantic", explicit: false, popularity: 52 },
        { name: "Rewind", explicit: false, popularity: 50 },
        { name: "So I", explicit: false, popularity: 48 },
        { name: "Girl, so confusing", explicit: false, popularity: 50 },
        { name: "Apple", explicit: false, popularity: 56 },
        { name: "B2b", explicit: false, popularity: 52 },
        { name: "Mean girls", explicit: true, popularity: 51 },
        { name: "I think about it all the time", explicit: false, popularity: 47 },
        { name: "365", explicit: true, popularity: 55 }
    ];

    // Set up the SVG
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 20, bottom: 60, left: 60 };

    const svg = d3.select("#excontent-popularity-visualization")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    // Create scales
    const xScale = d3.scaleBand()
        .domain(songData.map(d => d.name))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(songData, d => d.popularity)])
        .range([height - margin.bottom, margin.top]);

    // Create axes
    const xAxis = d3.axisBottom(xScale)
        .tickSize(0);

    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("fill", "#c4f24c");

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis)
        .selectAll("text")
        .attr("fill", "#c4f24c");

    // Create bars
    svg.selectAll("rect")
        .data(songData)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.name))
        .attr("y", d => yScale(d.popularity))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - margin.bottom - yScale(d.popularity))
        .attr("fill", d => d.explicit ? "#ff6b6b" : "#4ecdc4");

    // Add labels
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "#c4f24c")
        .text("Songs");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .attr("fill", "#c4f24c")
        .text("Popularity");

    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 100}, ${margin.top})`);

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", "#ff6b6b");

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", "#4ecdc4")
        .attr("y", 25);

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .attr("fill", "#c4f24c")
        .text("Explicit");

    legend.append("text")
        .attr("x", 24)
        .attr("y", 34)
        .attr("dy", ".35em")
        .attr("fill", "#c4f24c")
        .text("Non-Explicit");

    // Add hover functionality
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.selectAll("rect")
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`<strong>${d.name}</strong><br>Popularity: ${d.popularity}<br>Explicit: ${d.explicit ? "Yes" : "No"}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
});