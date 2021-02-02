import React from 'react';
import { useDispatch } from 'react-redux';

import { showHeader } from '../../../redux/headerToggleReducer';

import LittleBurger from '../littleBurger';

import './headerToggle.scss';

const HeaderToggle = () => {
    const dispatch = useDispatch();

    const handleToggle = () => {
        dispatch(showHeader());
    };

    return (
        <div className="headerToggle">
            <LittleBurger handleToggle={handleToggle} />
        </div>
    );
};

export default HeaderToggle;
