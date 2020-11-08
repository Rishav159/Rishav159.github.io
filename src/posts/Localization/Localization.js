import "./Localization.scss";
import React, { useEffect } from "react";
import LocalizationProblem from "./LocalizationProblem";
import LocalizationIntroduction from "./LocalizationIntroduction";
import SCGIcons from "../../SCGIcons";

function Localization() {
  let localizationIntroduction = new LocalizationIntroduction({ selector: ".localization-intro-holder" });
  let localizationProblem = new LocalizationProblem({ selector: ".localization-diagram-holder" });
  
  useEffect(() => {
    localizationIntroduction.start();
    localizationProblem.start();
    d3.graphScroll()
      .offset(10)
      .sections(d3.selectAll(".sections > section"))
      .graph(d3.selectAll(".graph"))
      .container(d3.selectAll(".container"))
      .on("active", function (i) {});
  });

  return (
    <div>
      <div className={"row container"}>
        <h2 className={"subtitle"}>What exactly is localization?</h2>
        <div className={"column right-column graph"}>
          <div className="diagram-holder">
          <div className={"diagram localization-intro-holder"}>
          </div>
          <div className={"diagram-helper"}>
            <ul>
              <li><div className={"restart-button"} onClick={() => { localizationIntroduction.start(); }}>Restart</div></li>
              <li>
                Use Arrow Keys &nbsp; {SCGIcons.leftArrowSVG} &nbsp;{SCGIcons.rightArrowSVG}
              </li>
            </ul>
          </div>
          </div>
        </div>
        <div className={"column left-column sections"}>
          <section>
            <p>
              Localization in the context of AI is a computational problem where a robot tries to find out its own location in a known map.
              The robot has sensors that provides some information about its current environment. It is also free to move around the map and get updated sensor data. Using these information, the robot tries to figure out its own location.
            </p>
          </section>
          <section>
            <p>
              In this diagram, the robot is in a circular corridor. Use your arrow keys to move the robot around the corridor. <br></br><span className="text-color-legend wall"></span> represents a wall and <span className="text-color-legend door"></span> represents a door. The robot has a primitive sensor that simply tells it whether it is standing in front of a door or a wall. You can observe what the robot can see in the <span className="highlighter">Bot's perception.</span>.<br></br> Use the restart button to randomize the corridor.
            </p>
          </section>
        </div>
      </div>
      <div className={"row container"}>
        <h2 className={"subtitle"}>Try it yourself</h2>
        <div className={"column right-column graph"}>
          <div className="diagram-holder">
            <div className={"diagram localization-diagram-holder"}>

            </div>
            <div className={"diagram-helper"}>
              <ul>
                <li><div className={"restart-button"} onClick={() => { localizationProblem.start(); }}>Restart</div></li>
                <li>
                  Use Arrow Keys &nbsp; {SCGIcons.leftArrowSVG} &nbsp;{SCGIcons.rightArrowSVG}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={"column left-column sections"}>
          <section>
            <p>
              Since you can see the robot in the map, its pretty easy to pinpoint its location. But what if you were in the robot's shoes? 
            </p>
          </section>
          <section>
            <p>
              Click on the Start button to hide the robot. You can still use arrow keys to move the robot around. Try to figure out the robot's location using information from the <span className="highlighter">Bot's perception.</span><br />
              Once you know the location, click on the door/wall to reveal the bot. <br /><br/>
              Try to find the bot in less than 20 moves.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Localization;
