import React from 'react';

import './confirmationModal.scss';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    actionConfirmation: string;
    confirmationCallback: () => void;
}

const ConfirmationModal = (props: ConfirmationModalProps): JSX.Element => {
    const { isOpen, onClose, message, actionConfirmation, confirmationCallback } = props;

    const handleCleanUpAndClose = (): void => {
        onClose();
    };

    const handleConfirm = () => {
        confirmationCallback();
    };

    return (
        <div
            className={`confirmationModal ${
                isOpen === true ? 'confirmationModalShow' : 'confirmationModalHide'
            }`}
        >
            <div className="dialogContent">
                <div>{message}</div>
                <div className="actions">
                    <button onClick={handleConfirm} className="deletePostButton">
                        {actionConfirmation}
                    </button>
                    <button onClick={handleCleanUpAndClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
