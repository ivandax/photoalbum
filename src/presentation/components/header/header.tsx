import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

//redux
import { HeaderToggleState } from '../../../redux/headerToggleReducer';

import './header.scss';

interface State {
    headerToggle: HeaderToggleState;
}

const Header = (): JSX.Element => {
    const displayMobileHeader = useSelector((state: State) => state.headerToggle.show);

    return (
        <header className={`header ${displayMobileHeader === true ? 'show' : 'hide'}`}>
            <div className="left">
                <h3>Pizza Pizza Pizza</h3>
                <NavLink to={'/home'} activeClassName="activeRoute">
                    Home
                </NavLink>
            </div>
            <div className="right">
                <NavLink to={'/login'} activeClassName="activeRoute">
                    Login
                </NavLink>
                <NavLink to={'/settings'} activeClassName="activeRoute">
                    Settings
                </NavLink>
            </div>
        </header>
    );
};

export default Header;
