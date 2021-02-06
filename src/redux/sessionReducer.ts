import { UserWithId } from '../persistence/users';

//STATE

export interface SessionState {
    sessionData: AsyncOp<UserWithId, string>;
}

//ACTION TYPES

export type SetPendingSessionDataAction = {
    type: 'setPendingSessionData';
};

export type SetOngoingSessionDataAction = {
    type: 'setOngoingSessionData';
};

export type SetFailedSessionDataAction = {
    type: 'setFailedSessionData';
    error: string;
};

export type SetValidSessionDataAction = {
    type: 'setValidSessionData';
    data: UserWithId;
};

type SetSessionDataAction =
    | SetPendingSessionDataAction
    | SetOngoingSessionDataAction
    | SetFailedSessionDataAction
    | SetValidSessionDataAction;

//ACTIONS

export const setPendingSessionData = (): SetPendingSessionDataAction => {
    return { type: 'setPendingSessionData' };
};
export const setOngoingSessionData = (): SetOngoingSessionDataAction => {
    return { type: 'setOngoingSessionData' };
};
export const setFailedSessionData = (error: string): SetFailedSessionDataAction => {
    return { type: 'setFailedSessionData', error: error };
};
export const setValidSessionData = (user: UserWithId): SetValidSessionDataAction => {
    return { type: 'setValidSessionData', data: user };
};

//STATE AND REDUCER

const initialState: SessionState = { sessionData: { status: 'pending' } };

function sessionReducer(
    state = initialState,
    action: SetSessionDataAction
): SessionState {
    switch (action.type) {
        case 'setPendingSessionData':
            return { ...state, sessionData: { status: 'pending' } };
        case 'setOngoingSessionData':
            return { ...state, sessionData: { status: 'ongoing' } };
        case 'setFailedSessionData':
            return {
                ...state,
                sessionData: {
                    status: 'failed',
                    error: action.error,
                },
            };
        case 'setValidSessionData':
            return { ...state, sessionData: { status: 'successful', data: action.data } };
        default:
            return state;
    }
}

export default sessionReducer;
