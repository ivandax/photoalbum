import React from 'react';

import './tableHeader.scss';

interface TableHeaderProps {
    value: string;
    axisX: number;
    field: string;
    reorder: (field: string) => void;
}

const TableHeader = ({ value, axisX, field, reorder }: TableHeaderProps): JSX.Element => {
    const handleReorder = () => {
        reorder(field);
    };

    return (
        <th className={`tableHeader ${axisX}`} onClick={handleReorder}>
            {value}
        </th>
    );
};

export default TableHeader;
