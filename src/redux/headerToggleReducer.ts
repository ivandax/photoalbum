export interface HeaderToggleState {
    show: boolean;
}

export interface HeaderToggleAction {
    type: 'show' | 'hide';
}

export const showHeader = (): HeaderToggleAction => {
    return { type: 'show' };
};

export const hideHeader = (): HeaderToggleAction => {
    return { type: 'hide' };
};

//STATE AND REDUCER

const initialState: HeaderToggleState = { show: false };

function headerToggleReducer(
    state = initialState,
    action: HeaderToggleAction
): HeaderToggleState {
    switch (action.type) {
        case 'show':
            return { show: true };
        case 'hide':
            return { show: false };
        default:
            return state;
    }
}

export default headerToggleReducer;
