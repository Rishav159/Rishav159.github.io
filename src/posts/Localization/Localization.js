import React, { useEffect } from 'react';
import LocalizationDiagram from "./LocalizationDiagram";

function Localization() {
  useEffect(() => {
    LocalizationDiagram.init(".localization-diagram-holder");
  });
  return (
    <div>
      <h1>Localization Diagram here</h1>
      <div className="localization-diagram-holder"></div>
    </div>
  )
}

export default Localization;
