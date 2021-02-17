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

type SetCommentSectionAction = SetCommentSectionOpen | SetCommentSectionClose;

//ACTIONS

export const setCommentSectionOpen = (post: Post): SetCommentSectionOpen => {
    return { type: 'setCommentSectionOpen', post: post };
};
export const setCommentSectionClose = (): SetCommentSectionClose => {
    return { type: 'setCommentSectionClose' };
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
        default:
            return state;
    }
}

export default commentSectionReducer;
