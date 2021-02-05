import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//views
import Home from './views/home';
import Login from './views/login';
import SignUp from './views/signUp';

//components
import Header from './components/header';
import HeaderToggle from './components/headerToggle';
import Overlay from './components/overlay';

///hooks
import useValidateSession from '../customHooks/useValidateSession';

const Root: React.FC = () => {
    const resolvedUser = useValidateSession();

    if (!resolvedUser) return <>Loading...</>;

    return (
        <div className="root">
            <Router>
                <Header />
                <HeaderToggle />
                <Overlay />
                <Switch>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/sign-up" component={SignUp}></Route>
                    <Route path="/home" component={Home}></Route>
                    <Route path="/" component={Home}></Route>
                </Switch>
            </Router>
        </div>
    );
};
export default Root;
