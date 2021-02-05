import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { hideHeader } from '../../../redux/headerToggleReducer';

//redux
import { HeaderToggleState } from '../../../redux/headerToggleReducer';

//style
import './overlay.scss';
interface State {
    headerToggle: HeaderToggleState;
}

const Overlay = (): JSX.Element => {
    const displayMobileHeader = useSelector((state: State) => state.headerToggle.show);

    const dispatch = useDispatch();

    const handleOverlayClick = () => {
        dispatch(hideHeader());
    };

    return (
        <div
            className={`overlay ${displayMobileHeader === true ? 'show' : 'hide'}`}
            onClick={handleOverlayClick}
        ></div>
    );
};

export default Overlay;
