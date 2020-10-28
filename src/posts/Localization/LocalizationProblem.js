import robotSVG from "./RobotSvg.js";
class Obstacle {
    constructor(config) {
        this.centerX = config.centerX;
        this.centerY = config.centerY;
        this.radius = config.radius;
        this.index = config.index;
        this.totalParts = config.parts;
        this.isDoor = config.isDoor;
        this.ele = config.ele;
        this.type = config.type;

        this.theta = this.index*(2*Math.PI/this.totalParts); 
        this.x = this.centerX 
        this.y = this.centerY - this.radius;
        this.circumference = this.getCircumference(this.radius);
        this.length = this.circumference/this.totalParts - 2;
        this.degreeTheta = this.theta*180 / Math.PI;
        this.color = this.type === "door"?"#DEB887":"gray";
    }
    getCircumference(radius) {
        return 2 * Math.PI * radius;
    }
    draw() {
        this.obstacleElement = this.ele.append("path")
             .attr("d", "M"+this.x+" "+this.y+" a "+this.radius+" "+this.radius+" 0 0 1 0 "+(this.radius*2)+" a "+this.radius+" "+this.radius+" 0 0 1 0 "+(this.radius*(-2)))
             .attr("fill","none")
             .attr("stroke",this.color)
             .attr("stroke-width", 20)
             .attr("stroke-dasharray",this.length+","+(this.circumference-this.length))
             .attr("transform" , "rotate("+this.degreeTheta+","+this.centerX+","+this.centerY+")")
             .attr("index",this.index)
             .style("cursor","pointer")
             .attr("class", "obstacle c"+this.index)
             .on("mouseover", function(d, i) {
                d3.select(this).transition("hover").duration(50).attr("opacity","0.5");
             })
             .on("mouseout", function(d,i) {
                d3.select(this).transition("hover").duration(50).attr("opacity","1");
             });
    }
    transitionColorEffect(color) {
        let originalColor = this.color;
        this.obstacleElement.transition("click").duration(200).attr("stroke", color).attr("opacity","1").transition("click").duration(200).attr("stroke", originalColor);
    }
}

class Agent {
    constructor(config) {
        this.totalParts = config.parts;
        this.position = config.position;
        this.radius = config.radius;
        this.ele = config.ele;
        this.centerX = config.centerX;
        this.centerY = config.centerY;
        this.transitionDuration = 200;
        this.obstacles = config.obstacles;
        this.obsProbMatrix = config.obsProbMatrix || {
            door : {
                obs_door : 1,
                obs_wall : 0
            },
            wall : {
                obs_door : 0,
                obs_wall : 1
            }
        }
    }

    move() {
        this.theta = this.position * (2*Math.PI / this.totalParts);
        this.theta += (Math.PI / this.totalParts);
        this.degreeTheta = (this.theta*180 / Math.PI)%360;
        this.robotRotate.transition().duration(this.transitionDuration)
                        .attr("transform","rotate("+(this.degreeTheta)+")")
    }
    getPerception() {
        let obstacleAtFront = this.obstacles[this.position];
        let r = Math.random();
        if(obstacleAtFront.type == "door") {
            if(r <= this.obsProbMatrix["door"]["obs_door"]) {
                return "door";
            }else{
                return "wall";
            }
        }else{
            if(r <= this.obsProbMatrix["wall"]["obs_wall"]) {
                return "wall";
            }else{
                return "door";
            }
        }
    }

    changePosition(newPosition) {
        this.position = newPosition;
        this.move();
    }

    goRight() {
        this.position = (this.position+1+this.totalParts)%this.totalParts;
        this.move();
    }
    goLeft() {
        this.position = (this.position-1+this.totalParts)%this.totalParts;
        this.move();
    }
    show() {
        this.robotEle.transition().duration(200).attr("opacity",1);
    }
    hideAnimate() {
        let oldDegreeTheta = this.degreeTheta;
        this.position = Math.floor(Math.random() * this.totalParts);
        this.theta = this.position * (2*Math.PI / this.totalParts);
        this.theta += (Math.PI / this.totalParts);
        this.degreeTheta = (this.theta*180 / Math.PI)%360;
        let self = this;
        this.robotRotate.transition().duration(2000)
                        .attrTween("transform",function() {
                            let rotationInterpolate = d3.interpolate(oldDegreeTheta, 720 + self.degreeTheta );
                            return function(t) {
                                return `rotate(${rotationInterpolate(t)})`;
                            }
                        });
        this.robotEle.transition().duration(1500)
                        .attrTween("opacity",function() {
                            let opacityInterpolation = d3.interpolate(1, 0 );
                            return function(t) {
                                return `${opacityInterpolation(t)}`;
                            }
                        });
    }
    hide() {
        this.robotEle.attr("opacity",0);
    }
    draw() {
        this.theta = this.position * (2*Math.PI / this.totalParts);
        this.theta += (Math.PI / this.totalParts);
        this.degreeTheta = (this.theta*180 / Math.PI)%360;


        this.robotWrapper = this.ele.append("g")
                                    .attr("class","robot-wrapper")
                                    .attr("transform", "translate("+ (this.centerX)+ ","+ (this.centerY - this.radius)+")");
        this.robotRotate = this.robotWrapper.append("g")
                                .style("transform-origin",`0px ${this.radius}px`)
                                .attr("transform",` rotate(${this.degreeTheta})`);

        this.robotEle = this.robotRotate.append("g")
                .attr("class", "robot-group")
                .attr("fill","white")
                .attr("transform","rotate(90) translate(-20 -25)");
        this.robotEle.html(robotSVG)
    }
}

class Percept {
    constructor({ele, agent}) {
        this.ele = ele;
        this.agent = agent;
    }
    draw() {
        let value = this.agent.getPerception();
        this.perceptWrapper = this.ele.append('g')
                                .attr("class", "perceptWrapper")
                                .attr("width",100)
                                .attr("transform","translate(50,50)");
        this.activePercept = this.perceptWrapper
                                    .append("rect")
                                    .attr("class", "activePercept")
                                    .attr("width", 100)
                                    .attr("height", 100)
                                    .attr("stroke","black")
                                    .attr("stroke-width", 2)
                                    .style("fill",value === "door"?"#DEB887":"gray");

        this.perceptContainer = this.perceptWrapper
                                    .append("rect")
                                    .attr("class", "perceptContainer")
                                    .attr("width", 100)
                                    .attr("height", 100)
                                    .attr("fill","red")
                                    .attr("stroke","black")
                                    .attr("stroke-width", 2)
                                    .attr("fill-opacity","0");
        this.perceptTitle = this.perceptWrapper
                                    .append("text")
                                    .attr("transform","translate(50,-10)")
                                    .style("text-anchor","middle")
                                    .style("dominant-baseline","central")
                                    .attr("fill","white")
                                    .text("Bot's Perception")

    }
    transition({direction}) {
        //Make sure to call this only after agent has changed position
        let value = this.agent.getPerception();
        this.secondaryPercept = this.perceptWrapper
            .append("rect")
            .attr("class", "activePercept")
            .attr("width", 0)
            .attr("height", 100)
            .attr("stroke","black")
            .attr("stroke-width", 2)
            .style("fill",value === "door"?"#DEB887":"gray");
        if(direction == "left") {
            this.activePercept
                .transition()
                .duration(200)
                .attr("width",0)
                .attr("x",100)
                .remove();
            this.secondaryPercept
                        .transition()
                        .duration(200)
                        .attr("width",100);
                                        
        } else {
            this.activePercept
                .transition()
                .duration(200)
                .attr("width",0)
                .remove();
                                        
            this.secondaryPercept       
                        .attr("x",100)
                        .transition()
                        .duration(200)
                        .attr("width",100)
                        .attr("x",0);
        }
        this.activePercept = this.secondaryPercept
    }
}

class Status {
    constructor({currentState, startCallback, stopCallback, ele,x,y, width = 100, height=50}) {
        this.state = currentState;
        this.ele = ele;
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
        this.statusHolder = this.ele.append("g").attr("class","status").attr("transform",`translate(${this.x},${this.y})`);
        this.restart();
    }

}
class LocalizationProblem {
    constructor({selector, radius=300, parts=50}){
        this.selector = selector;
        this.radius = radius;
        this.parts = parts;
    }
    bindKeyEvent() {
        let self = this;
        function keyDownEventHandler(e) {
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
        $(document).off("keydown",this.selector, keyDownEventHandler).keydown(keyDownEventHandler);
    }
    start() {
        //Should start and restart
        this.wrapper = d3.select(this.selector);
        this.wrapper.selectAll("*").remove();
        this.svg = this.wrapper.append("svg");
        this.width = $(this.selector).innerWidth();
        this.height = $(window).innerHeight();
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
                ele : self.obstaclesEle
            });
            obstacle.draw();
            self.obstacles.push(obstacle);
        });
        
        this.agent = new Agent({
            ele : this.svg,
            parts : this.parts,
            position : Math.floor(Math.random() * this.parts),
            centerX : this.width/2,
            centerY : this.height/2,
            radius : this.radius - 30,
            obstacles: this.obstacles
        });
        this.agent.draw();
        this.percept = new Percept({ele: this.svg, agent: this.agent});
        this.percept.draw();

        this.status = new Status({ele: this.svg, currentState: "inactive",x:this.width/2,y:this.height/2});
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