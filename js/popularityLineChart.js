class LineChart{
    constructor(parentContainer, bratSearch, bratSummerSearch, charliSearch){
        this.parentContainer = parentContainer;
        this.bratSearch = bratSearch;
        this.bratSummerSearch = bratSummerSearch;
        this.charliSearch = charliSearch;

        this.initVis()
    }

    initVis() {
        let vis = this

        vis.margin = {top: 50, right: 50, bottom: 50, left: 50};
        vis.width = document.getElementById(vis.parentContainer).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 200; // Fixed height for the timeline

        // Create SVG
        vis.svg = d3.select(`#${vis.parentContainer}`)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);

        vis.wrangleData()
    }

    wrangleData() {
        let vis = this

        vis.updateVis()
    }

    updateVis() {
        let vis = this

    }

}