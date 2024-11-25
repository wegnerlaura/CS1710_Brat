class Timeline{
    constructor(parentContainer){
        this.parentContainer = parentContainer;

        this.initVis()
    }

    initVis(){
        let vis = this

        vis.timelineData = [
            {year: 2012, description: "Released I Love It"},
            {year: 2013, description: "Released Boom Clap"},
            {year: 2014, description: "Released March"},
        ]


        vis.wrangleData()
    }

    wrangleData(){
        let vis = this

        vis.updateVis()
    }

    updateVis() {
        let vis = this

    }
}