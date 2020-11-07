import Config from "./Config";
const { obstacleColorMap } = Config;

class Percept {
  constructor({root, agent, title}) {
      this.root = root;
      this.agent = agent;
      this.title = title || "Bot's Perception";
  }
  draw() {
      let value = this.agent.getPerception();
      this.perceptWrapper = this.root.append('g')
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
                                  .style("fill", obstacleColorMap[value]);

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
                                  .text(this.title);

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
          .style("fill", obstacleColorMap[value]);
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

export default Percept;