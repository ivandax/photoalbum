import { combineReducers } from 'redux';

import headerToggleReducer, { HeaderToggleState } from './headerToggleReducer';
import sessionReducer, { SessionState } from './sessionReducer';
import appUsersReducer, { AppUsersState } from './appUsersReducer';
import categoriesArrayReducer, { CategoriesArrayState } from './categoriesArrayReducer';
import adminPanelReducer, { AdminPanelState } from './adminPanelReducer';
import commentSectionReducer, { CommentSectionState } from './commentSectionReducer';
import homeViewReducer, { HomeViewState } from './homeViewReducer';
import categoriesViewReducer, { CategoriesViewState } from './categoryViewReducer';
import viewerViewReducer, { ViewerViewState } from './viewerViewReducer';

export type State = {
    headerToggle: HeaderToggleState;
    session: SessionState;
    appUsers: AppUsersState;
    categoriesArray: CategoriesArrayState;
    adminPanel: AdminPanelState;
    commentSection: CommentSectionState;
    homeView: HomeViewState;
    categoriesView: CategoriesViewState;
    viewerView: ViewerViewState;
};

const rootReducers = combineReducers({
    headerToggle: headerToggleReducer,
    session: sessionReducer,
    appUsers: appUsersReducer,
    categoriesArray: categoriesArrayReducer,
    adminPanel: adminPanelReducer,
    commentSection: commentSectionReducer,
    homeView: homeViewReducer,
    categoriesView: categoriesViewReducer,
    viewerView: viewerViewReducer,
});

export default rootReducers;
