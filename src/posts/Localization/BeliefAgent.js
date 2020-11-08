import Agent from "./Agent";
import robotSVG from "./RobotSvg";
import Config from "./Config";
const { obstacleColorMap } = Config;

class BeliefAgent extends Agent {
  constructor(config) {
    super(config);
    this.active = config.active;
  }
  draw() {
    this.robotWrapper = this.root.append("g")
                                .attr("class","robot-wrapper")
                                .attr("transform", "translate("+ (this.centerX)+ ","+ (this.centerY - this.radius)+")");
    this.robotRotate = this.robotWrapper.append("g")
                            .style("transform-origin",`0px ${this.radius}px`)
                            .attr("transform",` rotate(${this.degreeTheta})`);
    this.robotEle = this.robotRotate.append("g")
            .attr("class", "robot-group")
            .attr("fill","white")
            .style("opacity",0.5)
            .attr("transform","rotate(90) translate(-20 -25)");
    this.localPercept = this.robotRotate.append("rect")
          .attr("class", "local-percept")
          .attr("height", "15")
          .attr("width", "15")
          .attr("fill", obstacleColorMap[this.getPerception()])
          .style("opacity",1)
          .attr("transform","rotate(90) translate(35,-7)");
    this.robotEle.html(robotSVG)
  }
  goLeft() {
    super.goLeft();
    this.localPercept.attr("fill", obstacleColorMap[this.getPerception()])
  }
  goRight() {
    super.goRight();
    this.localPercept.attr("fill", obstacleColorMap[this.getPerception()])
  }
  hide(duration = 1000) {
    this.robotEle
      .transition()
      .duration(duration)
      .style("opacity", 0);
    this.localPercept
      .transition()
      .duration(duration)
      .style("opacity", 0);
  }
}

export default BeliefAgent;