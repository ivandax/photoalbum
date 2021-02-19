import { Post } from '../persistence/posts';

//STATE

export interface HomeViewState {
    posts: AsyncOp<Post[], string>;
}

//ACTION TYPES

export type SetPendingPostsAction = {
    type: 'setPendingPosts';
};

export type SetOngoingPostsAction = {
    type: 'setOngoingPosts';
};

export type SetFailedPostsAction = {
    type: 'setFailedPosts';
    error: string;
};

export type SetSuccessfulPostsAction = {
    type: 'setSuccessfulPosts';
    data: Post[];
};

type SetPostsAction =
    | SetPendingPostsAction
    | SetOngoingPostsAction
    | SetFailedPostsAction
    | SetSuccessfulPostsAction;

//ACTIONS

export const setPendingPosts = (): SetPendingPostsAction => {
    return { type: 'setPendingPosts' };
};
export const setOngoingPosts = (): SetOngoingPostsAction => {
    return { type: 'setOngoingPosts' };
};
export const setFailedPosts = (error: string): SetFailedPostsAction => {
    return { type: 'setFailedPosts', error: error };
};
export const setSuccessfulPosts = (data: Post[]): SetSuccessfulPostsAction => {
    return { type: 'setSuccessfulPosts', data };
};

//STATE AND REDUCER

const initialState: HomeViewState = { posts: { status: 'pending' } };

function homeViewReducer(
    state = initialState,
    action: SetPostsAction
): HomeViewState {
    switch (action.type) {
        case 'setPendingPosts':
            return { ...state, posts: { status: 'pending' } };
        case 'setOngoingPosts':
            return { ...state, posts: { status: 'ongoing' } };
        case 'setFailedPosts':
            return {
                ...state,
                posts: {
                    status: 'failed',
                    error: action.error,
                },
            };
        case 'setSuccessfulPosts':
            return { ...state, posts: { status: 'successful', data: action.data } };
        default:
            return state;
    }
}

export default homeViewReducer;
