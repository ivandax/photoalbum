import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

//redux
import { HeaderToggleState } from '../../../redux/headerToggleReducer';

import './header.scss';
import littlePizza from '../../../style/images/littlepizza.png';

interface State {
    headerToggle: HeaderToggleState;
}

const Header = (): JSX.Element => {
    const displayMobileHeader = useSelector((state: State) => state.headerToggle.show);

    return (
        <header className={`header ${displayMobileHeader === true ? 'show' : 'hide'}`}>
            <div className="left">
                <div className="logo">
                    <img src={littlePizza} alt="little pizza image" />
                    <img src={littlePizza} alt="little pizza image" />
                    <img src={littlePizza} alt="little pizza image" />
                </div>
                <NavLink to={'/home'} activeClassName="activeRoute">
                    Inicio
                </NavLink>
            </div>
            <div className="right">
                <NavLink to={'/login'} activeClassName="activeRoute">
                    Sesión
                </NavLink>
                <NavLink to={'/settings'} activeClassName="activeRoute">
                    Configuración
                </NavLink>
            </div>
        </header>
    );
};

export default Header;
