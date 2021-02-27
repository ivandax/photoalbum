import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/pipeable';

//persistence
import { addCategory, Category } from '../../../persistence/categories';

//redux
import { setPendingCategoriesArray } from '../../../redux/categoriesArrayReducer';

//components
import FormInput from '../formInput';

import './createCategory.scss';

interface CreateCategoryProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateCategory = (props: CreateCategoryProps): JSX.Element => {
    const dispatch = useDispatch();
    const { isOpen, onClose } = props;
    const [localUpdateProcess, setLocalUpdateProcess] = useState('resolved');
    const [categoryName, setCategoryName] = useState<O.Option<string>>(O.none);
    const [addCategoryError, setAddCategoryError] = useState<O.Option<string>>(O.none);

    const handleCleanUpAndClose = (): void => {
        setLocalUpdateProcess('resolved');
        setCategoryName(O.none);
        onClose();
    };

    const handlePost = async (event: React.FormEvent) => {
        event.preventDefault();
        setLocalUpdateProcess('creating');
        pipe(
            categoryName,
            O.fold(
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                () => {},
                async (name) => {
                    const newCategory: Category = {
                        postReferences: [],
                        createdOn: +new Date(),
                        name: name,
                        categoryId: name,
                    };
                    const result = await addCategory(newCategory);
                    if (result.status === 'successful') {
                        dispatch(setPendingCategoriesArray());
                        handleCleanUpAndClose();
                    } else {
                        setAddCategoryError(O.some(result.error));
                    }
                }
            )
        );
    };

    return (
        <div
            className={`createCategory ${
                isOpen === true ? 'createCategoryShow' : 'createCategoryHide'
            }`}
        >
            <div className="dialogContent">
                {localUpdateProcess === 'creating' ? (
                    <div className="dialogLoader">
                        <div>Creando carpeta</div>
                    </div>
                ) : null}
                <div className="createCategoryContent">
                    <h3>Crear nueva carpeta</h3>
                    <FormInput
                        value={pipe(
                            categoryName,
                            O.getOrElse(() => '')
                        )}
                        type="text"
                        onChange={(value) =>
                            value === ''
                                ? setCategoryName(O.none)
                                : setCategoryName(O.some(value))
                        }
                        placeholder="Nombre de carpeta"
                        className="categoryName"
                    />
                </div>
                {pipe(
                    addCategoryError,
                    O.fold(
                        () => null,
                        (error) => <div>{error}</div>
                    )
                )}
                <div className="post">
                    <button
                        disabled={O.isNone(categoryName)}
                        onClick={handlePost}
                        className={O.isSome(categoryName) ? 'readyToPost' : ''}
                    >
                        Crear
                    </button>
                    <button onClick={handleCleanUpAndClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default CreateCategory;
