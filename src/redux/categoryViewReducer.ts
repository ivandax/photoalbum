import { Category } from '../persistence/categories';

//STATE

export interface CategoriesViewState {
    categories: AsyncOp<Category[], string>;
}

//ACTION TYPES

export type SetPendingCategoriesAction = {
    type: 'setPendingCategories';
};

export type SetOngoingCategoriesAction = {
    type: 'setOngoingCategories';
};

export type SetFailedCategoriesAction = {
    type: 'setFailedCategories';
    error: string;
};

export type SetSuccessfulCategoriesAction = {
    type: 'setSuccessfulCategories';
    data: Category[];
};

type SetCategoriesAction =
    | SetPendingCategoriesAction
    | SetOngoingCategoriesAction
    | SetFailedCategoriesAction
    | SetSuccessfulCategoriesAction;

//ACTIONS

export const setPendingCategories = (): SetPendingCategoriesAction => {
    return { type: 'setPendingCategories' };
};
export const setOngoingCategories = (): SetOngoingCategoriesAction => {
    return { type: 'setOngoingCategories' };
};
export const setFailedCategories = (error: string): SetFailedCategoriesAction => {
    return { type: 'setFailedCategories', error: error };
};
export const setSuccessfulCategories = (data: Category[]): SetSuccessfulCategoriesAction => {
    return { type: 'setSuccessfulCategories', data };
};

//STATE AND REDUCER

const initialState: CategoriesViewState = { categories: { status: 'pending' } };

function categoriesViewReducer(
    state = initialState,
    action: SetCategoriesAction
): CategoriesViewState {
    switch (action.type) {
        case 'setPendingCategories':
            return { ...state, categories: { status: 'pending' } };
        case 'setOngoingCategories':
            return { ...state, categories: { status: 'ongoing' } };
        case 'setFailedCategories':
            return {
                ...state,
                categories: {
                    status: 'failed',
                    error: action.error,
                },
            };
        case 'setSuccessfulCategories':
            return { ...state, categories: { status: 'successful', data: action.data } };
        default:
            return state;
    }
}

export default categoriesViewReducer;
