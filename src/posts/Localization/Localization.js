import React, { useEffect } from 'react';
import LocalizationProblem from "./LocalizationProblem";
import LocalizationDiagram from "./LocalizationDiagram";

function Localization() {
  useEffect(() => {
    LocalizationProblem.init(".localization-diagram-holder", $(window).innerHeight(),$(".localization-diagram-holder").innerWidth());
    LocalizationDiagram.init(".localization-diagram-holder-2", $(window).innerHeight(),$(".localization-diagram-holder").innerWidth());
  });
  return (
    <div>
      <h1>Localization Problem (Work in progress. Don't judge)</h1>
      <div className={"row"}>
        <div className={"column left-column"}>
          In this problem, there is a robot inside a circular corridor. There are several doors in the corridor between the walls. 
          The robot has a sensor that given information on what is currently in front of it. You can see this perception of the robot. 
          Use left and right arrow to move the robot around. As the robots move, its perception will also change. Use this information to deduce the location of the robot in the minimum number of moves. 
          Once you have figured out the location, click on the door/wall to reveal the robot.
          Click on the start button to start the game.
        </div>
        <div className={"column right-column"}>
          <div className="localization-diagram-holder"></div>
          <div className="localization-diagram-holder-2"></div>
        </div>
      </div>
    </div>
  )
}

export default Localization;
