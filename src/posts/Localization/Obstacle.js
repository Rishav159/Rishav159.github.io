import Config from "./Config";
const { obstacleColorMap } = Config;

class Obstacle {
  constructor(config) {
      this.centerX = config.centerX;
      this.centerY = config.centerY;
      this.radius = config.radius;
      this.index = config.index;
      this.totalParts = config.parts;
      this.root = config.root;
      this.type = config.type;

      this.theta = this.index*(2*Math.PI/this.totalParts); 
      this.x = this.centerX 
      this.y = this.centerY - this.radius;
      this.circumference = this.getCircumference(this.radius);
      this.length = this.circumference/this.totalParts - 2;
      this.degreeTheta = this.theta*180 / Math.PI;
      this.color = obstacleColorMap[this.type];
  }
  getCircumference(radius) {
      return 2 * Math.PI * radius;
  }
  draw() {
      this.obstacleElement = this.root.append("path")
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

export default Obstacle;