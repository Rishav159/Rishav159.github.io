import Obstacle from "./Obstacle";
import Agent from "./Agent";
import Percept from "./Percept";
class Status {
    constructor({currentState, startCallback, stopCallback, root,x,y, width = 100, height=50}) {
        this.state = currentState;
        this.root = root;
        this.width = width;
        this.height = height;
        this.x = x - this.width/2;
        this.y = y - this.height/2;
        let self = this;
        this.startCallback = startCallback;
        this.stopHandler = stopCallback;
        this.startHandler = function() {
            self.startDiagram();
            self.startCallback();
        }
        this.stopHandler = function() {
            self.stopHandler();
        }
        this.buttonColor = "#602080";
        this.movesColorInterpolation = d3.scaleLinear()
                        .domain([0, 10, 20])
                        .range(['#1a9850','#fff000','#d73027'])
                        .clamp(true)
                        .interpolate(d3.interpolateRgb);
    }
    startDiagram() {
        this.statusHolder.select("rect").transition().duration(200).style("opacity",0).remove();
        this.statusHolder.select("text").transition().duration(200).style("opacity",0).remove();
        this.moves = 0;
        this.gameText = this.statusHolder.append("g").attr("class","game-status")
                        .append("text")
                        .style("text-anchor","middle")
                        .style("dominant-baseline","central")
                        .attr("fill","white")
                        .style("cursor","pointer")
                        .style("font-weight", "bold")
                        .style("letter-spacing","1.5px")
                        .attr("fill",this.movesColorInterpolation(this.moves))
                        .attr("transform",`translate(${this.width/2},${(this.height/2)-50})`)
                        .text(`Moves ${this.moves}`);
        let self = this;
        this.stopButton = this.statusHolder.append("rect")
                        .attr("class","restart-button")
                        .attr("rx",10)
                        .attr("height",this.height)
                        .attr("width",this.width)
                        .attr("stroke","white")
                        .attr("stroke-width",0)
                        .attr("fill",this.buttonColor)
                        .attr("fill-opacity","50%")
                        .style("cursor","pointer")
                        .on("click",() => {
                            self.stopCallback();
                            self.restart();
                        });
        this.stopButtonText = this.statusHolder
                        .append("text")
                        .style("text-anchor","middle")
                        .style("dominant-baseline","central")
                        .attr("fill","white")
                        .style("cursor","pointer")
                        .attr("transform",`translate(${this.width/2},${this.height/2})`)
                        .style("font-weight", "bold")
                        .style("letter-spacing","1.5px")
                        .text("Give Up!")
                        .on("click",() => {
                            self.stopCallback();
                            self.restart();
                        });
    }
    incrementMove() {
        this.moves = this.moves + 1;
        this.gameText && this.gameText.text(`Moves ${this.moves}`);
        this.gameText && this.gameText.attr("fill",this.movesColorInterpolation(this.moves))
    }
    restart() {
        this.statusHolder.selectAll("*").remove();
        this.statusHolder.append("rect")
        .attr("class","start-button")
        .attr("rx",10)
        .attr("height",this.height)
        .attr("width",this.width)
        .attr("stroke","white")
        .attr("stroke-width",0)
        .attr("fill",this.buttonColor)
        .attr("fill-opacity","50%")
        .style("cursor","pointer")
        .on("click",this.startHandler);
    this.statusHolder
        .append("text")
        .style("text-anchor","middle")
        .style("dominant-baseline","central")
        .attr("fill","white")
        .style("cursor","pointer")
        .attr("transform",`translate(${this.width/2},${this.height/2})`)
        .style("font-weight", "bold")
        .style("letter-spacing","1.5px")
        .text("Start")
        .on("click",this.startHandler);
    }
    draw() {
        this.statusHolder = this.root.append("g").attr("class","status").attr("transform",`translate(${this.x},${this.y})`);
        this.restart();
    }

}

class LocalizationProblem {
    constructor({selector, radius=200, parts=60}){
        this.selector = selector;
        this.radius = radius;
        this.parts = parts;
        let self = this;
        this.keyDownEventHandler = function(e) {
            switch(e.which) {
                case 37:
                    self.agent.goLeft();
                    self.status.incrementMove();
                    self.percept.transition({direction: "left"});
                    break;
                case 39: 
                    self.agent.goRight();
                    self.status.incrementMove();
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
        
        this.status = new Status({root: this.svg, currentState: "inactive", x:this.width/2, y:this.height/2});
        this.bindKeyEvent();
        window.obstacles = this.obstacles;
        let startHandler = function() {
            self.agent.hideAnimate();
            self.percept.transition({direction: "right"});
            _.each(_.range(self.parts), function(index) {
                self.obstacles[index].obstacleElement.on("click", function(e) {
                    let clickTarget = parseInt(d3.select(e.target).attr("index"));
                    if(clickTarget == self.agent.position) {
                        self.obstacles[index].transitionColorEffect("green");
                        self.status.restart();
                        self.agent.show();
                    } else { 
                        self.obstacles[index].transitionColorEffect("red");
                    }
                });
            });
        }
        this.status.startCallback = startHandler;
        this.status.stopCallback = function() {
            self.agent.show();
        };
        this.status.draw();
    }
}

export default LocalizationProblem;