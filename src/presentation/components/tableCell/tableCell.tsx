import React from 'react';

import './tableCell.scss';

interface TableCellProps {
    value: string | JSX.Element;
    axisX: number;
    amTotal: boolean;
    columnHeader: string;
    orderedBy: string;
    className?: string;
}

const TableCell = ({
    value,
    axisX,
    amTotal,
    columnHeader,
    orderedBy,
    className,
}: TableCellProps): JSX.Element => {
    return (
        <td
            className={`tableCell ${className} ${axisX} ${amTotal ? 'total' : ''} ${
                columnHeader === orderedBy ? 'highlight' : ''
            }`}
        >
            {value}
        </td>
    );
};

export default TableCell;
