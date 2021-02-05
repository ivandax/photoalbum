import { combineReducers } from 'redux';

import headerToggleReducer, { HeaderToggleState } from './headerToggleReducer';
import sessionReducer, { SessionState } from './sessionReducer';

export type State = {
    headerToggle: HeaderToggleState;
    session: SessionState;
};

const rootReducers = combineReducers({
    headerToggle: headerToggleReducer,
    session: sessionReducer,
});

export default rootReducers;
