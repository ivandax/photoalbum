import { CategoriesArray } from '../persistence/categories';

//STATE

export interface CategoriesArrayState {
    categoriesArray: AsyncOp<CategoriesArray, string>;
}

//ACTION TYPES

export type SetPendingCategoriesArrayAction = {
    type: 'setPendingCategoriesArray';
};

export type SetOngoingCategoriesArrayAction = {
    type: 'setOngoingCategoriesArray';
};

export type SetFailedCategoriesArrayAction = {
    type: 'setFailedCategoriesArray';
    error: string;
};

export type SetSuccessfulCategoriesArrayAction = {
    type: 'setSuccessfulCategoriesArray';
    data: CategoriesArray;
};

type SetCategoriesArrayAction =
    | SetPendingCategoriesArrayAction
    | SetOngoingCategoriesArrayAction
    | SetFailedCategoriesArrayAction
    | SetSuccessfulCategoriesArrayAction;

//ACTIONS

export const setPendingCategoriesArray = (): SetPendingCategoriesArrayAction => {
    return { type: 'setPendingCategoriesArray' };
};
export const setOngoingCategoriesArray = (): SetOngoingCategoriesArrayAction => {
    return { type: 'setOngoingCategoriesArray' };
};
export const setFailedCategoriesArray = (error: string): SetFailedCategoriesArrayAction => {
    return { type: 'setFailedCategoriesArray', error: error };
};
export const setSuccessfulCategoriesArray = (categoriesArray: CategoriesArray): SetSuccessfulCategoriesArrayAction => {
    return { type: 'setSuccessfulCategoriesArray', data: categoriesArray };
};

//STATE AND REDUCER

const initialState: CategoriesArrayState = { categoriesArray: { status: 'pending' } };

function CategoriesArrayReducer(
    state = initialState,
    action: SetCategoriesArrayAction
): CategoriesArrayState {
    switch (action.type) {
        case 'setPendingCategoriesArray':
            return { ...state, categoriesArray: { status: 'pending' } };
        case 'setOngoingCategoriesArray':
            return { ...state, categoriesArray: { status: 'ongoing' } };
        case 'setFailedCategoriesArray':
            return {
                ...state,
                categoriesArray: {
                    status: 'failed',
                    error: action.error,
                },
            };
        case 'setSuccessfulCategoriesArray':
            return { ...state, categoriesArray: { status: 'successful', data: action.data } };
        default:
            return state;
    }
}

export default CategoriesArrayReducer;
