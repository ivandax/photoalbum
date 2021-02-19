import { UserWithId } from '../persistence/users';

//STATE

export interface AppUsersState {
    appUsers: AsyncOp<UserWithId[], string>;
}

//ACTION TYPES

export type SetPendingAppUsersAction = {
    type: 'setPendingAppUsers';
};

export type SetOngoingAppUsersAction = {
    type: 'setOngoingAppUsers';
};

export type SetFailedAppUsersAction = {
    type: 'setFailedAppUsers';
    error: string;
};

export type SetSuccessfulAppUsersAction = {
    type: 'setSuccessfulAppUsers';
    data: UserWithId[];
};

type SetAppUsersAction =
    | SetPendingAppUsersAction
    | SetOngoingAppUsersAction
    | SetFailedAppUsersAction
    | SetSuccessfulAppUsersAction;

//ACTIONS

export const setPendingAppUsers = (): SetPendingAppUsersAction => {
    return { type: 'setPendingAppUsers' };
};
export const setOngoingAppUsers = (): SetOngoingAppUsersAction => {
    return { type: 'setOngoingAppUsers' };
};
export const setFailedAppUsers = (error: string): SetFailedAppUsersAction => {
    return { type: 'setFailedAppUsers', error: error };
};
export const setSuccessfulAppUsers = (user: UserWithId[]): SetSuccessfulAppUsersAction => {
    return { type: 'setSuccessfulAppUsers', data: user };
};

//STATE AND REDUCER

const initialState: AppUsersState = { appUsers: { status: 'pending' } };

function appUsersReducer(
    state = initialState,
    action: SetAppUsersAction
): AppUsersState {
    switch (action.type) {
        case 'setPendingAppUsers':
            return { ...state, appUsers: { status: 'pending' } };
        case 'setOngoingAppUsers':
            return { ...state, appUsers: { status: 'ongoing' } };
        case 'setFailedAppUsers':
            return {
                ...state,
                appUsers: {
                    status: 'failed',
                    error: action.error,
                },
            };
        case 'setSuccessfulAppUsers':
            return { ...state, appUsers: { status: 'successful', data: action.data } };
        default:
            return state;
    }
}

export default appUsersReducer;
