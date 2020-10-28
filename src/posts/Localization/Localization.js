import "./Localization.scss";
import React, { useEffect } from "react";
import LocalizationProblem from "./LocalizationProblem";
import LocalizationDiagram from "./LocalizationDiagram";

function Localization() {
  useEffect(() => {
    let localizationProblem = new LocalizationProblem({ selector: ".localization-diagram-holder" });
    // let localizationDiagram = new LocalizationDiagram(
    //   ".localization-diagram-holder-2",
    //   $(window).innerHeight(),
    //   $(".localization-diagram-holder").innerWidth()
    // );
    localizationProblem.start();
    d3.graphScroll()
      .sections(d3.selectAll(".sections > section"))
      .graph(d3.selectAll(".graph"))
      .container(d3.selectAll(".container"))
      .on("active", function (i) {});
  });

  let leftArrowSVG = (
    <svg width="23" height="11" viewBox="0 0 23 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0.26021 6.12793L0.261011 6.12878L4.89627 10.7417C5.24352 11.0873 5.80519 11.086 6.15085 10.7387C6.49646 10.3914 6.49513 9.82975 6.14788 9.48413L3.03576 6.3871L21.8226 6.3871C22.3126 6.3871 22.7097 5.98994 22.7097 5.5C22.7097 5.01006 22.3126 4.6129 21.8226 4.6129L3.03581 4.6129L6.14783 1.51587C6.49509 1.17026 6.49642 0.608592 6.1508 0.261337C5.80515 -0.0860056 5.24344 -0.0872034 4.89623 0.258321L0.260965 4.87123L0.260166 4.87207C-0.0872655 5.21884 -0.0861573 5.78232 0.26021 6.12793Z"
        fill="white"
      />
    </svg>
  );

  let rightArrowSVG = (
    <svg width="23" height="12" viewBox="0 0 23 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.4495 5.72692L22.4487 5.72608L17.8134 1.11318C17.4662 0.767606 16.9045 0.768893 16.5589 1.11619C16.2133 1.46345 16.2146 2.02511 16.5618 2.37072L19.674 5.46776L0.887098 5.46776C0.397154 5.46776 8.75986e-07 5.86491 9.61651e-07 6.35486C1.04732e-06 6.8448 0.397155 7.24196 0.887098 7.24196L19.6739 7.24195L16.5619 10.339C16.2146 10.6846 16.2133 11.2463 16.5589 11.5935C16.9046 11.9409 17.4663 11.9421 17.8135 11.5965L22.4488 6.98363L22.4496 6.98279C22.797 6.63602 22.7959 6.07254 22.4495 5.72692Z"
        fill="white"
      />
    </svg>
  );

  return (
    <div>
      <div className={"row container"}>
        <div className={"column right-column graph"}>
          <div className="diagram-holder">
            <div className={"diagram localization-diagram-holder"}></div>
            <div className={"diagram-helper"}>
              <ul>
                <li>
                  Use Arrow Keys &nbsp; {leftArrowSVG} &nbsp;{rightArrowSVG}
                </li>
              </ul>
            </div>
          </div>
          {/* <div className="diagram-holder">
              <div className={"diagram localization-diagram-holder"}> 

              </div>
            </div> */}
        </div>
        <div className={"column left-column sections"}>
          <section>
            In this problem, there is a robot inside a circular corridor. There are several doors in the corridor between the walls. The robot has a
            sensor that given information on what is currently in front of it. You can see this perception of the robot. Use left and right arrow to
            move the robot around. As the robots move, its perception will also change. Use this information to deduce the location of the robot in
            the minimum number of moves. Once you have figured out the location, click on the door/wall to reveal the robot. Click on the start button
            to start the game.
          </section>
          <section>
            In this problem, there is a robot inside a circular corridor. There are several doors in the corridor between the walls. The robot has a
            sensor that given information on what is currently in front of it. You can see this perception of the robot. Use left and right arrow to
            move the robot around. As the robots move, its perception will also change. Use this information to deduce the location of the robot in
            the minimum number of moves. Once you have figured out the location, click on the door/wall to reveal the robot. Click on the start button
            to start the game.
          </section>
          <section>
            In this problem, there is a robot inside a circular corridor. There are several doors in the corridor between the walls. The robot has a
            sensor that given information on what is currently in front of it. You can see this perception of the robot. Use left and right arrow to
            move the robot around. As the robots move, its perception will also change. Use this information to deduce the location of the robot in
            the minimum number of moves. Once you have figured out the location, click on the door/wall to reveal the robot. Click on the start button
            to start the game.
          </section>
          <section>
            In this problem, there is a robot inside a circular corridor. There are several doors in the corridor between the walls. The robot has a
            sensor that given information on what is currently in front of it. You can see this perception of the robot. Use left and right arrow to
            move the robot around. As the robots move, its perception will also change. Use this information to deduce the location of the robot in
            the minimum number of moves. Once you have figured out the location, click on the door/wall to reveal the robot. Click on the start button
            to start the game.
          </section>
          <section>
            In this problem, there is a robot inside a circular corridor. There are several doors in the corridor between the walls. The robot has a
            sensor that given information on what is currently in front of it. You can see this perception of the robot. Use left and right arrow to
            move the robot around. As the robots move, its perception will also change. Use this information to deduce the location of the robot in
            the minimum number of moves. Once you have figured out the location, click on the door/wall to reveal the robot. Click on the start button
            to start the game.
          </section>
          <section>
            In this problem, there is a robot inside a circular corridor. There are several doors in the corridor between the walls. The robot has a
            sensor that given information on what is currently in front of it. You can see this perception of the robot. Use left and right arrow to
            move the robot around. As the robots move, its perception will also change. Use this information to deduce the location of the robot in
            the minimum number of moves. Once you have figured out the location, click on the door/wall to reveal the robot. Click on the start button
            to start the game.
          </section>
          <section>
            In this problem, there is a robot inside a circular corridor. There are several doors in the corridor between the walls. The robot has a
            sensor that given information on what is currently in front of it. You can see this perception of the robot. Use left and right arrow to
            move the robot around. As the robots move, its perception will also change. Use this information to deduce the location of the robot in
            the minimum number of moves. Once you have figured out the location, click on the door/wall to reveal the robot. Click on the start button
            to start the game.
          </section>
          <section>
            In this problem, there is a robot inside a circular corridor. There are several doors in the corridor between the walls. The robot has a
            sensor that given information on what is currently in front of it. You can see this perception of the robot. Use left and right arrow to
            move the robot around. As the robots move, its perception will also change. Use this information to deduce the location of the robot in
            the minimum number of moves. Once you have figured out the location, click on the door/wall to reveal the robot. Click on the start button
            to start the game.
          </section>
        </div>
      </div>
    </div>
  );
}

export default Localization;
