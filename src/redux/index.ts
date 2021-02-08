import { combineReducers } from 'redux';

import headerToggleReducer, { HeaderToggleState } from './headerToggleReducer';
import sessionReducer, { SessionState } from './sessionReducer';
import adminPanelReduer, { AdminPanelState } from './adminPanelReducer';

export type State = {
    headerToggle: HeaderToggleState;
    session: SessionState;
    adminPanel: AdminPanelState;
};

const rootReducers = combineReducers({
    headerToggle: headerToggleReducer,
    session: sessionReducer,
    adminPanel: adminPanelReduer,
});

export default rootReducers;
