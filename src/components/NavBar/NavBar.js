import "./NavBar.scss";
import React from 'react';
import brandingLogo from "./branding.svg";

export default function NavBar() {
  return (
    <div className={"nav-bar"}>
      <div className={"left"}>
        <a href="/"><img src={brandingLogo} className={"logo"}/></a>
      </div>
      <div className="right">
        <ul>
          <a href="/"><li>Home</li></a>
          <a href="/me"><li>About Me</li></a>
          <a href="/contact"><li class="contact">Contact Me</li></a>
        </ul>
      </div>
    </div>
  )
}
