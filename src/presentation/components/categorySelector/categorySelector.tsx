import React from 'react';

import './categorySelector.scss';

interface CategorySelectorProps {
    options: string[];
    initialValue: string;
    setState: (selection: string) => void;
}

const CategorySelector = (props: CategorySelectorProps): JSX.Element => {
    const { options, initialValue, setState } = props;

    const handleSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;
        setState(value);
    };

    return (
        <select
            onChange={handleSelection}
            value={initialValue}
            className="categorySelector"
        >
            {['Todo', ...options].map((option) => (
                <option className="categoryOption" key={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};

export default CategorySelector;
