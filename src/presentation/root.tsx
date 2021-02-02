import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//views
import Home from "./views/home";

//components
import Header from "./components/header";
import HeaderToggle from "./components/headerToggle";
import Overlay from "./components/overlay";

const Root: React.FC = () => {
  return (
    <div className="root">
      <Router>
        <Header />
        <HeaderToggle />
        <Overlay />
        <Switch>
          <Route path="/" component={Home}></Route>
        </Switch>
      </Router>
    </div>
  );
};
export default Root;