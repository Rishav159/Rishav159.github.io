import "../_global.scss";
import "./App.scss"
import React from "react";
import { Route, Router, Switch } from "react-router-dom";
import { history } from "../_helpers/history";
import LandingPage from "./LandingPage/LandingPage";
import PostPage from "./PostPage/PostPage";
import PageNotFound from "./PageNotFound";
import NavBar from "./NavBar/NavBar";

function App() {
  return (
    <div className="app">
      <NavBar />
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/post/:slug" component={PostPage} />
          <Route component={PageNotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;