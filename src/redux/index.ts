import { combineReducers } from 'redux';

import headerToggleReducer from './headerToggleReducer';
import sessionReducer from './sessionReducer';

const rootReducers = combineReducers({
    headerToggle: headerToggleReducer,
    session: sessionReducer,
});

export default rootReducers;
