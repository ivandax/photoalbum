import { Post } from '../persistence/posts';

//STATE

export interface CommentSectionState {
    post: Post | null;
    isOpen: boolean;
}

//ACTION TYPES

export type SetCommentSectionOpen = {
    type: 'setCommentSectionOpen';
    post: Post;
};

export type SetCommentSectionClose = {
    type: 'setCommentSectionClose';
};

export type SetCommentSectionUpdate = {
    type: 'setCommentSectionUpdate';
    post: Post;
};

type SetCommentSectionAction =
    | SetCommentSectionOpen
    | SetCommentSectionClose
    | SetCommentSectionUpdate;

//ACTIONS

export const setCommentSectionOpen = (post: Post): SetCommentSectionOpen => {
    return { type: 'setCommentSectionOpen', post: post };
};
export const setCommentSectionClose = (): SetCommentSectionClose => {
    return { type: 'setCommentSectionClose' };
};
export const setCommentSectionUpdate = (post: Post): SetCommentSectionUpdate => {
    return { type: 'setCommentSectionUpdate', post: post };
};

//STATE AND REDUCER

const initialState: CommentSectionState = { post: null, isOpen: false };

function commentSectionReducer(
    state = initialState,
    action: SetCommentSectionAction
): CommentSectionState {
    switch (action.type) {
        case 'setCommentSectionOpen':
            return { ...state, post: action.post, isOpen: true };
        case 'setCommentSectionClose':
            return { ...state, post: null, isOpen: false };
        case 'setCommentSectionUpdate':
            return { ...state, post: action.post };
        default:
            return state;
    }
}

export default commentSectionReducer;
