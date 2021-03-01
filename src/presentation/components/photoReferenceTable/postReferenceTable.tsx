import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    setOngoingCategories,
    setSuccessfulCategories,
    setFailedCategories,
    setPendingCategories,
} from '../../../redux/categoryViewReducer';

import { getCategories } from '../../../persistence/categories';

import { State } from '../../../redux/index';

import Loader from '../../components/loader';
import TableCell from '../tableCell';
import TableHeader from '../tableHeader';
import TableRow from '../tableRow';
import CategorySelector from '../categorySelector';

import './postReferenceTable.scss';

const postReferenceTable = (): JSX.Element => {
    const categories = useSelector((state: State) => state.categoriesView.categories);
    const categoriesOptions = useSelector(
        (state: State) => state.categoriesArray.categoriesArray
    );
    const dispatch = useDispatch();

    const [selection, setSelection] = useState('Todo');

    useEffect(() => {
        const onGetCategories = async () => {
            dispatch(setOngoingCategories());
            const result = await getCategories();
            if (typeof result === 'string') {
                dispatch(setFailedCategories(result));
            } else {
                dispatch(setSuccessfulCategories(result));
            }
        };
        if (categories.status === 'pending') {
            onGetCategories();
        }
    }, [categories.status]);

    switch (categories.status) {
        case 'pending':
        case 'ongoing':
            return <Loader />;
        case 'failed':
            return <div>{categories.error}</div>;
        case 'successful':
            const selectedCategory = categories.data.find(
                (category) => category.name === selection
            );
            return (
                <>
                    <div className="postReferenceTableActions">
                        <CategorySelector
                            options={
                                categoriesOptions.status === 'successful'
                                    ? categoriesOptions.data.list
                                    : []
                            }
                            initialValue={selection}
                            setState={setSelection}
                        />
                        <button onClick={() => dispatch(setPendingCategories())}>
                            Refrescar
                        </button>
                    </div>
                    <table className="postReferenceTable">
                        <thead>
                            <tr>
                                <TableHeader
                                    value="Title"
                                    axisX={0}
                                    field="category"
                                    reorder={(field) => console.log(field)}
                                />
                                <TableHeader
                                    value="Creación"
                                    axisX={1}
                                    field="createdOn"
                                    reorder={(field) => console.log(field)}
                                />
                                <TableHeader
                                    value="Posteado por"
                                    axisX={2}
                                    field="postedByName"
                                    reorder={(field) => console.log(field)}
                                />
                            </tr>
                        </thead>
                        <tbody>
                            {selectedCategory ? (
                                selectedCategory.postReferences.map((category, index) => (
                                    <TableRow key={category.postId} axisY={index}>
                                        <TableCell
                                            value={
                                                category.postTitle === ''
                                                    ? category.postId
                                                    : category.postTitle
                                            }
                                            axisX={0}
                                            amTotal={false}
                                            columnHeader="Title"
                                            orderedBy=""
                                        />
                                        <TableCell
                                            value={`${new Date(
                                                category.createdOn
                                            ).toLocaleDateString('es-ES')}`}
                                            axisX={1}
                                            amTotal={false}
                                            columnHeader="createdOn"
                                            orderedBy=""
                                        />
                                        <TableCell
                                            value={category.postedByName}
                                            axisX={2}
                                            amTotal={false}
                                            columnHeader="postedByName"
                                            orderedBy=""
                                        />
                                    </TableRow>
                                ))
                            ) : (
                                <div>Error. No match for the selection.</div>
                            )}
                        </tbody>
                    </table>
                </>
            );
    }
};

export default postReferenceTable;
