import React from 'react';

import './tableCell.scss';

interface TableCellProps {
    value: string;
    axisX: number;
    amTotal: boolean;
    columnHeader: string;
    orderedBy: string;
}

const TableCell = ({
    value,
    axisX,
    amTotal,
    columnHeader,
    orderedBy,
}: TableCellProps): JSX.Element => {
    return (
        <td
            className={`tableCell ${axisX} ${amTotal ? 'total' : ''} ${
                columnHeader === orderedBy ? 'highlight' : ''
            }`}
        >
            {value}
        </td>
    );
};

export default TableCell;
