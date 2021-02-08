import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//views
import Home from './views/home';
import Login from './views/login';
import SignUp from './views/signUp';
import Settings from './views/settings';

//components
import Header from './components/header';
import HeaderToggle from './components/headerToggle';
import Overlay from './components/overlay';

///hooks
import useValidateAuthentication from '../customHooks/useValidateAuthentication';

const Root: React.FC = () => {
    const resolvedUser = useValidateAuthentication();
    return (
        <div className="root">
            <Router>
                {resolvedUser.status === 'successful' ? <Header /> : null}
                {resolvedUser.status === 'successful' ? <HeaderToggle /> : null}
                {resolvedUser.status === 'successful' ? <Overlay /> : null}
                <Switch>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/sign-up" component={SignUp}></Route>
                    <Route path="/home" component={Home}></Route>
                    <Route path="/settings" component={Settings}></Route>
                    <Route path="/" component={Home}></Route>
                </Switch>
            </Router>
        </div>
    );
};
export default Root;
