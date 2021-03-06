import { Post, FirstAndLastPost } from '../persistence/posts';
import * as O from 'fp-ts/lib/Option';

//STATE

export interface HomeViewState {
    posts: AsyncOp<Post[], string>;
    firstAndLastPost: FirstAndLastPost;
    currentPage: number;
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

export type SetFirstAndLastPostAction = {
    type: 'setFirstAndLastPost';
    firstAndLast: FirstAndLastPost;
};

export type SetCurrentPageAction = {
    type: 'setCurrentPage';
    page: number;
};

type SetPostsAction =
    | SetPendingPostsAction
    | SetOngoingPostsAction
    | SetFailedPostsAction
    | SetSuccessfulPostsAction
    | SetFirstAndLastPostAction
    | SetCurrentPageAction;

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
export const setLastPost = (
    firstAndLast: FirstAndLastPost
): SetFirstAndLastPostAction => {
    return { type: 'setFirstAndLastPost', firstAndLast };
};
export const setCurrentPage = (page: number): SetCurrentPageAction => {
    return { type: 'setCurrentPage', page };
};

//STATE AND REDUCER

const initialState: HomeViewState = {
    posts: { status: 'pending' },
    firstAndLastPost: { first: O.none, last: O.none },
    currentPage: 1,
};

function homeViewReducer(state = initialState, action: SetPostsAction): HomeViewState {
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
        case 'setFirstAndLastPost':
            return {
                ...state,
                firstAndLastPost: {
                    first: action.firstAndLast.first,
                    last: action.firstAndLast.last,
                },
            };
        case 'setCurrentPage':
            return { ...state, currentPage: action.page };
        default:
            return state;
    }
}

export default homeViewReducer;
