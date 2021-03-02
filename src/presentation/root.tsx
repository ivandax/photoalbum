import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//views
import Home from './views/home';
import Login from './views/login';
import SignUp from './views/signUp';
import Settings from './views/settings';
import Admin from './views/admin';
import Categories from './views/categories';
import Viewer from './views/viewer';

//components
import Header from './components/header';
import HeaderToggle from './components/headerToggle';
import Overlay from './components/overlay';

///hooks
import useValidateAuthentication from '../customHooks/useValidateAuthentication';
import useGetCategoriesArray from '../customHooks/useGetCategoriesArray';

const Root: React.FC = () => {
    const resolvedUser = useValidateAuthentication();
    useGetCategoriesArray();
    return (
        <div className="root">
            <Router>
                {resolvedUser.status === 'successful' ? <Header /> : null}
                {resolvedUser.status === 'successful' ? <HeaderToggle /> : null}
                {resolvedUser.status === 'successful' ? <Overlay /> : null}
                <Switch>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/sign-up" component={SignUp}></Route>
                    <Route path="/settings" component={Settings}></Route>
                    <Route path="/admin" component={Admin}></Route>
                    <Route path="/categories" component={Categories}></Route>
                    <Route path="/viewer/:postId" component={Viewer}></Route>
                    <Route path="/home" component={Home}></Route>
                    <Route path="/" component={Home}></Route>
                </Switch>
            </Router>
        </div>
    );
};
export default Root;
