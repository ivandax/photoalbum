import React from 'react';

interface StyledButtonProps {
    value: string;
    callback: () => void;
    className?: string;
}

const StyledButton: React.FC<StyledButtonProps> = (props: StyledButtonProps) => {
    const { value, callback, className } = props;

    return (
        <button
            onClick={() => callback()}
            className={
                className !== undefined ? `styledButton ${className}` : 'styledButton'
            }
        >
            {value}
        </button>
    );
};

export default StyledButton;
