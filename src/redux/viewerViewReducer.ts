import { Post } from '../persistence/posts';

//STATE

export interface ViewerViewState {
    post: AsyncOp<Post, string>;
}

//ACTION TYPES

export type SetPendingPostAction = {
    type: 'setPendingPost';
};

export type SetOngoingPostAction = {
    type: 'setOngoingPost';
};

export type SetFailedPostAction = {
    type: 'setFailedPost';
    error: string;
};

export type SetSuccessfulPostAction = {
    type: 'setSuccessfulPost';
    data: Post;
};

type SetPostAction =
    | SetPendingPostAction
    | SetOngoingPostAction
    | SetFailedPostAction
    | SetSuccessfulPostAction;

//ACTIONS

export const setPendingPost = (): SetPendingPostAction => {
    return { type: 'setPendingPost' };
};
export const setOngoingPost = (): SetOngoingPostAction => {
    return { type: 'setOngoingPost' };
};
export const setFailedPost = (error: string): SetFailedPostAction => {
    return { type: 'setFailedPost', error: error };
};
export const setSuccessfulPost = (data: Post): SetSuccessfulPostAction => {
    return { type: 'setSuccessfulPost', data };
};

//STATE AND REDUCER

const initialState: ViewerViewState = { post: { status: 'pending' } };

function viewerViewReducer(state = initialState, action: SetPostAction): ViewerViewState {
    switch (action.type) {
        case 'setPendingPost':
            return { ...state, post: { status: 'pending' } };
        case 'setOngoingPost':
            return { ...state, post: { status: 'ongoing' } };
        case 'setFailedPost':
            return {
                ...state,
                post: {
                    status: 'failed',
                    error: action.error,
                },
            };
        case 'setSuccessfulPost':
            return { ...state, post: { status: 'successful', data: action.data } };
        default:
            return state;
    }
}

export default viewerViewReducer;
