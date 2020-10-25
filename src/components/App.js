import React from "react";
import { Route, Router, Switch, useRouteMatch } from "react-router-dom";
import { history } from "../_helpers/history";

import LandingPage from "./LandingPage/LandingPage";
import PostPage from "./PostPage/PostPage";
import PageNotFound from "./PageNotFound";

function App() {
  return (
    <div>
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