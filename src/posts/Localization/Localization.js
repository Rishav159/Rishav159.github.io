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
              Localization in the context of AI is a computational problem where a robot tries to find out its own location is a known map.
              The robot has sensors that provides some information about its current environment. It is also free to move around the map and get updated sensor data. Using these information, the robot tries to figure out its own location.
            </p>
          </section>
          <section>
            <p>
              In this diagram, the robot is in a circular corridor. Use your arrow keys to move the robot around the corridor. The grey represents a wall and brown represents a door. The robot has a primitive sensor that simply tells it whether it is standing in front of a door or a wall.
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
              Localization in the context of AI is a computational problem where a robot tries to find out its own location is a known map.
              The robot has sensors that provides some information about its current environment. It is also free to move around the map and get updated sensor data. Using these information, the robot tries to figure out its own location.
            </p>
          </section>
          <section>
            <p>
              In this diagram, the robot is in a circular corridor. Use your arrow keys to move the robot around the corridor. The grey represents a wall and brown represents a door. The robot has a primitive sensor that simply tells it whether it is standing in front of a door or a wall.
            </p>
          </section>
          <section>
            <p>
              In this problem, there is a robot inside a circular corridor. There are several doors in the corridor between the walls. The robot has a
              sensor that given information on what is currently in front of it. You can see this perception of the robot. Use left and right arrow to
              move the robot around. As the robots move, its perception will also change. Use this information to deduce the location of the robot in
              the minimum number of moves. Once you have figured out the location, click on the door/wall to reveal the robot. Click on the start button
              to start the game.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Localization;
