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
                .attr("transform","rotate(180) translate(-15.5 -16)");
        this.robotEle
                .append("path")
                .attr("d", "M24.66,23.699c0-2.363-1.916-4.279-4.278-4.279h-1.646v-0.852c1.532-0.692,2.76-1.944,3.418-3.497c1.354-0.194,2.396-1.356,2.396-2.766c0-1.457-1.115-2.653-2.538-2.784c-0.363-0.748-0.865-1.416-1.467-1.977l2.279-6.524c0.141-0.399-0.071-0.838-0.471-0.978c-0.4-0.14-0.839,0.072-0.979,0.472l-2.125,6.082c-0.96-0.538-2.064-0.849-3.242-0.854l0,0c-0.002,0-0.005,0-0.008,0c-0.003,0-0.005,0-0.008,0l0,0c-1.175,0.007-2.28,0.316-3.24,0.854l-2.124-6.082c-0.14-0.399-0.578-0.611-0.979-0.472c-0.4,0.14-0.611,0.578-0.471,0.978l2.279,6.524c-0.602,0.561-1.103,1.229-1.467,1.977C8.565,9.653,7.45,10.85,7.45,12.307c0,1.408,1.042,2.57,2.396,2.767c0.659,1.552,1.885,2.804,3.418,3.496v0.852h-1.645c-2.363-0.001-4.278,1.915-4.278,4.278c0,2.338,1.876,4.237,4.206,4.276v4.025h3.292v-4.023h1.154h0.016h1.154v4.023h3.291v-4.024C22.783,27.937,24.66,26.038,24.66,23.699z M20.973,21.271l0.993,0.994c-0.111,0.071-0.245,0.114-0.387,0.114c-0.398,0-0.721-0.322-0.721-0.72C20.859,21.516,20.902,21.383,20.973,21.271z M20.973,23.182l0.993,0.994c-0.111,0.072-0.245,0.115-0.387,0.115c-0.398,0-0.721-0.323-0.721-0.722C20.859,23.427,20.902,23.294,20.973,23.182z M11.126,12.454c0-2.691,2.179-4.881,4.866-4.9l0,0c0.003,0,0.005,0,0.008,0c0.002,0,0.005,0,0.008,0l0,0c2.687,0.02,4.867,2.209,4.867,4.9c0,2.689-2.181,4.881-4.867,4.899l0,0c-0.002,0-0.005,0-0.008,0c-0.003,0-0.005,0-0.008,0l0,0C13.305,17.335,11.126,15.144,11.126,12.454z M21.58,26.309c-0.398,0-0.721-0.323-0.721-0.72c0-0.145,0.043-0.276,0.114-0.388l0.993,0.992C21.855,26.266,21.722,26.309,21.58,26.309z M22.185,25.977l-0.992-0.995c0.111-0.07,0.244-0.113,0.387-0.113c0.398,0,0.722,0.321,0.722,0.721C22.3,25.73,22.257,25.863,22.185,25.977z M22.185,23.957l-0.992-0.993c0.111-0.071,0.244-0.114,0.387-0.114c0.398,0,0.722,0.322,0.722,0.72C22.3,23.712,22.257,23.845,22.185,23.957z M22.185,22.046l-0.992-0.994c0.111-0.072,0.244-0.114,0.387-0.114c0.398,0,0.722,0.322,0.722,0.722C22.3,21.802,22.257,21.934,22.185,22.046z")
        this.robotEle
                .append("path")
                .attr("d","M20.107,12.454c0-2.271-1.84-4.117-4.106-4.131c-2.267,0.014-4.106,1.86-4.106,4.131c0,2.27,1.839,4.116,4.106,4.131C18.267,16.569,20.107,14.724,20.107,12.454z M13.046,12.454c0-1.636,1.316-2.96,2.947-2.979V9.474c0.003,0,0.005,0,0.008,0c0.002,0,0.005,0,0.008,0v0.001c1.63,0.019,2.945,1.344,2.945,2.979c0,1.634-1.315,2.96-2.945,2.979l0,0c-0.002,0-0.005,0-0.008,0s-0.005,0-0.008,0l0,0C14.362,15.414,13.046,14.088,13.046,12.454z")
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
    constructor({selector, radius=200, parts=50}){
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