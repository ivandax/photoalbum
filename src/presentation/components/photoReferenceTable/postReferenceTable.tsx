import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
    setOngoingCategories,
    setSuccessfulCategories,
    setFailedCategories,
    setPendingCategories,
    setSelectedCategory,
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
    const { categories, selectedCategory } = useSelector(
        (state: State) => state.categoriesView
    );
    const categoriesOptions = useSelector(
        (state: State) => state.categoriesArray.categoriesArray
    );
    const dispatch = useDispatch();

    const setCategorySelection = (category: string) => {
        dispatch(setSelectedCategory(category));
    };

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
            const selected = categories.data.find(
                (category) => category.name === selectedCategory
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
                            initialValue={selectedCategory}
                            setState={setCategorySelection}
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
                                    field="title"
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
                            {selected ? (
                                selected.postReferences.map((category, index) => (
                                    <TableRow key={category.postId} axisY={index}>
                                        <TableCell
                                            value={
                                                <Link to={`./viewer/${category.postId}`}>
                                                    {category.postTitle === ''
                                                        ? category.postId
                                                        : category.postTitle}
                                                </Link>
                                            }
                                            axisX={0}
                                            amTotal={false}
                                            columnHeader="Title"
                                            orderedBy=""
                                            className="postReferenceTitle"
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
