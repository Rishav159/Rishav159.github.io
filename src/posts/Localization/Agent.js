import robotSVG from "./RobotSvg.js";

class Agent {
  constructor(config) {
      this.totalParts = config.parts;
      this.position = config.position;
      this.radius = config.radius;
      this.root = config.root;
      this.centerX = config.centerX;
      this.centerY = config.centerY;
      this.transitionDuration = config.transitionDuration || 200;
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


      this.robotWrapper = this.root.append("g")
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

export default Agent;
