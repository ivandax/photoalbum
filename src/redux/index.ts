import { combineReducers } from "redux";

import headerToggleReducer from "./headerToggleReducer";

const rootReducers = combineReducers({
  headerToggle: headerToggleReducer,
});

export default rootReducers;
