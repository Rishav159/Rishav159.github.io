import Obstacle from "./Obstacle";
import BeliefAgent from "./BeliefAgent";
import Percept from "./Percept";
import Agent from "./Agent";

class Status {
    constructor({root, x, y, width = 100, height=50, clickHandler}) {
        this.root = root;
        this.width = width;
        this.height = height;
        this.x = x - this.width/2;
        this.y = y - this.height/2;
        this.clickHandler = clickHandler;
        this.buttonColor = "#602080";

        this.movesColorInterpolation = d3.scaleLinear()
          .domain([30, 15, 1])
          .range(['#d73027', '#1a9850','#fff000'])
          .clamp(true)
          .interpolate(d3.interpolateRgb);
        this.statesRemaining = 30;
    }
    restart() {
      let self = this;
      this.statusHolder.selectAll("*").remove();
      this.statusHolder.append("rect")
        .attr("class","eliminate-button")
        .attr("rx",10)
        .attr("height",this.height)
        .attr("width",this.width)
        .attr("stroke","white")
        .attr("stroke-width",0)
        .attr("fill",this.buttonColor)
        .attr("fill-opacity","50%")
        .style("cursor","pointer")
        .on("click",this.clickHandler);
      this.statusHolder
        .append("text")
        .style("text-anchor","middle")
        .style("dominant-baseline","central")
        .attr("fill","white")
        .style("cursor","pointer")
        .attr("transform",`translate(${this.width/2},${this.height/2})`)
        .style("font-weight", "bold")
        .style("letter-spacing","1.5px")
        .text("Eliminate")
        .on("click",this.clickHandler);
      
      let textProperties = function(element) {
        return element.style("text-anchor","middle")
          .style("dominant-baseline","central")
          .style("font-weight", "bold")
          .style("letter-spacing","1.5px")
          .attr("fill",self.movesColorInterpolation(self.statesRemaining))
      }
      this.gameTextLabel = this.statusHolder.append("g").attr("class","game-status-label")
        .append("text");
      this.gameTextLabel = textProperties(this.gameTextLabel)
        .attr("transform",`translate(${this.width/2},${(this.height/2)-60})`)
        .text(`Remaining Belief States`);
      this.gameTextValue = this.statusHolder.append("g").attr("class","game-status-value")
        .append("text");
      this.gameTextValue = textProperties(this.gameTextValue)
        .attr("transform",`translate(${this.width/2},${(this.height/2)-40})`)
        .text(this.statesRemaining);
    }
    setStatesRemaining(newState) {
      this.statesRemaining = newState;
      this.gameTextLabel.attr("fill",this.movesColorInterpolation(this.statesRemaining));
      this.gameTextValue.attr("fill",this.movesColorInterpolation(this.statesRemaining)).transition().duration(1000).text(newState);
    }
    draw() {
        this.statusHolder = this.root.append("g").attr("class","status").attr("transform",`translate(${this.x},${this.y+30})`);
        this.restart();
    }

}

class DeterminsticLocalizationSolver {
    constructor({selector, radius=200, parts=30}){
        this.selector = selector;
        this.radius = radius;
        this.parts = parts;
        let self = this;
        this.keyDownEventHandler = function(e) {
            switch(e.which) {
                case 37:
                    self.realAgent.goLeft();
                    self.beliefAgents.forEach(beliefAgent => {
                      beliefAgent.goLeft();
                    })
                    self.percept.transition({direction: "left"});
                    // self.removeUnmatchingBeliefs();
                    break;
                case 39: 
                    self.realAgent.goRight();
                    self.beliefAgents.forEach(beliefAgent => {
                      beliefAgent.goRight();
                    })
                    self.percept.transition({direction: "right"});
                    // self.removeUnmatchingBeliefs();
                    break;
            }
        }
    }
    bindKeyEvent() {
        let self = this;
        $(document).off("keydown", self.keyDownEventHandler).on("keydown", self.keyDownEventHandler);
    }
    removeUnmatchingBeliefs() {
      let existingBeliefStateCounts = 0;
      let currentPercept = this.realAgent.getPerception();
      this.beliefAgents.map(beliefAgent => {
        if(!beliefAgent.active) {
          return;
        }
        if(beliefAgent.getPerception() !== currentPercept) {
          beliefAgent.hide();
          beliefAgent.active = false;
          return;
        }
        existingBeliefStateCounts += 1;
      });
      this.existingBeliefStateCounts = existingBeliefStateCounts;
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
        
        this.realAgent = new Agent({
            root : this.svg,
            parts : this.parts,
            position : Math.floor(Math.random() * this.parts),
            centerX : this.width/2,
            centerY : this.height/2,
            radius : this.radius - 30,
            obstacles: this.obstacles
        });
        this.realAgent.draw();
        this.realAgent.hide();
        this.percept = new Percept({root: this.svg, agent: this.realAgent, title: "Real Bot's Perception"});
        this.percept.draw();
        

        this.beliefAgents = _.range(this.parts).map(index => {
          return new BeliefAgent({
            root : this.svg,
            parts : this.parts,
            position : index,
            centerX : this.width/2,
            centerY : this.height/2,
            radius : this.radius - 30,
            obstacles: this.obstacles,
            active: true
          })
        }).map(agent => {
          agent.draw();
          return agent;
        });
        this.status = new Status({
          root: this.svg,
          currentState: "inactive",
          x: this.width/2,
          y: this.height/2, 
          clickHandler: function() {
            self.removeUnmatchingBeliefs();
            self.status.setStatesRemaining(self.existingBeliefStateCounts);
          }
        });

        this.status.draw();
        this.bindKeyEvent();
    }
}

export default DeterminsticLocalizationSolver;