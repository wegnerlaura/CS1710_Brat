class Timeline{
    constructor(parentContainer){
        this.parentContainer = parentContainer;

        this.initVis()
    }

    initVis(){
        let vis = this

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