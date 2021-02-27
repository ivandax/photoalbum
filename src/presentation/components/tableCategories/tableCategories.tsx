import React from 'react';

import { Category } from '../../../persistence/categories';

import TableCell from '../tableCell';
import TableHeader from '../tableHeader';
import TableRow from '../tableRow';

import './tableCategories.scss';

interface TableCategoriesProps {
    data: Category[];
}

const TableCategories = ({ data }: TableCategoriesProps): JSX.Element => {
    return (
        <table className="tableCategories">
            <thead>
                <tr>
                    <TableHeader
                        value="Carpeta"
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
                </tr>
            </thead>
            <tbody>
                {data.map((category, index) => (
                    <TableRow key={category.categoryId} axisY={index}>
                        <TableCell
                            value={category.name}
                            axisX={0}
                            amTotal={false}
                            columnHeader="carpeta"
                            orderedBy=""
                        />
                        <TableCell
                            value={`${new Date(category.createdOn).toLocaleDateString(
                                'es-ES'
                            )}`}
                            axisX={1}
                            amTotal={false}
                            columnHeader="createdOn"
                            orderedBy=""
                        />
                    </TableRow>
                ))}
            </tbody>
        </table>
    );
};

export default TableCategories;
