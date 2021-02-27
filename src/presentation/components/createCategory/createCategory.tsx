import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/pipeable';

import { UserWithId } from '../../../persistence/users';

import { State } from '../../../redux/index';

import FormInput from '../formInput';

import './createCategory.scss';

interface CreateCategoryProps {
    isOpen: boolean;
    onClose: () => void;
    sessionData: UserWithId;
}

const CreateCategory = (props: CreateCategoryProps): JSX.Element => {
    const { sessionData, isOpen, onClose } = props;
    const categoryOptions = useSelector(
        (state: State) => state.categoriesArray.categoriesArray
    );
    const [localUpdateProcess, setLocalUpdateProcess] = useState('resolved');
    const [categoryName, setCategoryName] = useState<O.Option<string>>(O.none);

    const handleCleanUpAndClose = (): void => {
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
                (name) => {
                    console.log(name);
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
                <div className="post">
                    <button
                        disabled={O.isNone(categoryName)}
                        onClick={handlePost}
                        className={O.isSome(categoryName) ? 'readyToPost' : ''}
                    >
                        Publicar
                    </button>
                    <button onClick={handleCleanUpAndClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default CreateCategory;
