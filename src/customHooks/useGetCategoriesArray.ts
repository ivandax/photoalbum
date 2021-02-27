import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getCategoriesArray } from '../persistence/categories';
import { State } from '../redux/index';

import {
    setOngoingCategoriesArray,
    setFailedCategoriesArray,
    setSuccessfulCategoriesArray,
    CategoriesArrayState,
} from '../redux/categoriesArrayReducer';

function useValidateAuthentication(): CategoriesArrayState['categoriesArray'] {
    const dispatch = useDispatch();
    const { categoriesArray } = useSelector((state: State) => state.categoriesArray);

    useEffect(() => {
        const onGetUsers = async () => {
            dispatch(setOngoingCategoriesArray());
            const categoriesList = await getCategoriesArray();
            typeof categoriesList === 'string'
                ? dispatch(setFailedCategoriesArray('Error obteniendo categorias'))
                : dispatch(setSuccessfulCategoriesArray(categoriesList));
        };
        if (categoriesArray.status === 'pending') {
            onGetUsers();
        }
    }, [categoriesArray.status]);

    return categoriesArray;
}

export default useValidateAuthentication;
