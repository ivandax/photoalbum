import { combineReducers } from 'redux';

import headerToggleReducer, { HeaderToggleState } from './headerToggleReducer';
import sessionReducer, { SessionState } from './sessionReducer';
import adminPanelReducer, { AdminPanelState } from './adminPanelReducer';
import commentSectionReducer, { CommentSectionState } from './commentSectionReducer';

export type State = {
    headerToggle: HeaderToggleState;
    session: SessionState;
    adminPanel: AdminPanelState;
    commentSection: CommentSectionState;
};

const rootReducers = combineReducers({
    headerToggle: headerToggleReducer,
    session: sessionReducer,
    adminPanel: adminPanelReducer,
    commentSection: commentSectionReducer,
});

export default rootReducers;
