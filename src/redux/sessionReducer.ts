import { UserWithId } from '../persistence/users';

//STATE

export interface SessionState {
    validSession: boolean;
    profile: UserWithId | null;
}

//ACTION TYPES

export type SetValidSessionAction = {
    type: 'setValidSession';
};

export type SetUserProfileAction = {
    type: 'setUserProfile';
    payload: UserWithId | null;
};

export type SessionAction = SetValidSessionAction | SetUserProfileAction;

//ACTIONS

export const setValidSession = (): SetValidSessionAction => {
    return { type: 'setValidSession' };
};

export const setUserProfile = (user: UserWithId | null): SetUserProfileAction => {
    return { type: 'setUserProfile', payload: user };
};

//STATE AND REDUCER

const initialState: SessionState = { validSession: false, profile: null };

function sessionReducer(state = initialState, action: SessionAction): SessionState {
    switch (action.type) {
        case 'setValidSession':
            return { ...state, validSession: true };
        case 'setUserProfile':
            return { ...state, profile: action.payload };
        default:
            return state;
    }
}

export default sessionReducer;
