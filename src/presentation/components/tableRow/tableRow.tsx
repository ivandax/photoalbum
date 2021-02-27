import React from 'react';

import './tableRow.scss';

interface TableRowProps {
    children: JSX.Element[];
    axisY: number;
}

const TableRow = ({ children, axisY }: TableRowProps): JSX.Element => {
    return (
        <tr className={`tableRow y${axisY} ${axisY % 2 === 0 ? 'even' : 'odd'}`}>
            {children}
        </tr>
    );
};

export default TableRow;
