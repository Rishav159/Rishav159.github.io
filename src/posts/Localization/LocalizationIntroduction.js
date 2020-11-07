import Obstacle from "./Obstacle";
import Agent from "./Agent";
import Percept from "./Percept";
class LocalizationIntroduction {
    constructor({selector, radius=200, parts=10}){
        this.selector = selector;
        this.radius = radius;
        this.parts = parts;
        let self = this;
        this.keyDownEventHandler = function(e) {
            switch(e.which) {
                case 37:
                    self.agent.goLeft();
                    self.percept.transition({direction: "left"});
                    break;
                case 39: 
                    self.agent.goRight();
                    self.percept.transition({direction: "right"});
                    break;
            }
        }
    }
    bindKeyEvent() {
        let self = this;
        $(document).off("keydown", self.keyDownEventHandler).on("keydown", self.keyDownEventHandler);
    }
    start() {
        //Should start and restart
        this.wrapper = d3.select(this.selector);
        this.wrapper.selectAll("*").remove();
        this.svg = this.wrapper.append("svg");
        this.width = $(this.selector).innerWidth();
        this.height = Math.min($(window).innerHeight(),500);
        this.svg
            .attr("height", this.height)
            .attr("width", this.width);
        this.obstaclesEle = this.svg.append('g')
            .classed("obstacles",true);
        this.barEle = this.svg.append('g')
            .classed("bars",true);
        
        this.obstacles = [];
        this.bars = [];
        let self = this;
        _.each(_.range(this.parts), function(index) {
            let obstacle = new Obstacle({
                centerX : self.width/2,
                centerY : self.height/2,
                radius : self.radius,
                index : index,
                parts : self.parts,
                type : (Math.random() > 0.5)?"door" : "wall",
                root : self.obstaclesEle
            });
            obstacle.draw();
            self.obstacles.push(obstacle);
        });
        
        this.agent = new Agent({
            root : this.svg,
            parts : this.parts,
            position : Math.floor(Math.random() * this.parts),
            centerX : this.width/2,
            centerY : this.height/2,
            radius : this.radius - 30,
            obstacles: this.obstacles
        });
        this.agent.draw();
        this.percept = new Percept({root: this.svg, agent: this.agent});
        this.percept.draw();
        console.log("Localization Introduction")
        this.bindKeyEvent();
    }
}

export default LocalizationIntroduction;