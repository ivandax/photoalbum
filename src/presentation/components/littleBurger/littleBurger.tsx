import React from 'react';

import './littleBurger.scss';

interface LittleBurgerProps {
    handleToggle: () => void;
}

const LittleBurger: React.FC<LittleBurgerProps> = (props: LittleBurgerProps) => {
    const { handleToggle } = props;
    return (
        <div className="littleBurger" onClick={handleToggle}>
            <span className="line1"></span>
            <span className="line2"></span>
            <span className="line3"></span>
        </div>
    );
};

export default LittleBurger;
