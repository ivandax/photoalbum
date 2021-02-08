import { UserWithId } from '../persistence/users';

//STATE

export interface AdminPanelState {
    users: AsyncOp<UserWithId[], string>;
}

//ACTION TYPES

export type SetPendingUsersAction = {
    type: 'setPendingUsers';
};

export type SetOngoingUsersAction = {
    type: 'setOngoingUsers';
};

export type SetFailedUsersAction = {
    type: 'setFailedUsers';
    error: string;
};

export type SetSuccessfulUsersAction = {
    type: 'setSuccessfulUsers';
    data: UserWithId[];
};

type SetUsersAction =
    | SetPendingUsersAction
    | SetOngoingUsersAction
    | SetFailedUsersAction
    | SetSuccessfulUsersAction;

//ACTIONS

export const setPendingUsers = (): SetPendingUsersAction => {
    return { type: 'setPendingUsers' };
};
export const setOngoingUsers = (): SetOngoingUsersAction => {
    return { type: 'setOngoingUsers' };
};
export const setFailedUsers = (error: string): SetFailedUsersAction => {
    return { type: 'setFailedUsers', error: error };
};
export const setSuccessfulUsers = (user: UserWithId[]): SetSuccessfulUsersAction => {
    return { type: 'setSuccessfulUsers', data: user };
};

//STATE AND REDUCER

const initialState: AdminPanelState = { users: { status: 'pending' } };

function adminPanelReducer(
    state = initialState,
    action: SetUsersAction
): AdminPanelState {
    switch (action.type) {
        case 'setPendingUsers':
            return { ...state, users: { status: 'pending' } };
        case 'setOngoingUsers':
            return { ...state, users: { status: 'ongoing' } };
        case 'setFailedUsers':
            return {
                ...state,
                users: {
                    status: 'failed',
                    error: action.error,
                },
            };
        case 'setSuccessfulUsers':
            return { ...state, users: { status: 'successful', data: action.data } };
        default:
            return state;
    }
}

export default adminPanelReducer;
