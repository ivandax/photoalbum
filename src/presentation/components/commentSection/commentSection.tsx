import React from 'react';
import { Close as CloseIcon } from '@material-ui/icons';

import { UserWithId } from '../../../persistence/users';
import { Post } from '../../../persistence/posts';

import './commentSection.scss';

interface CommentSectionProps {
    isOpen: boolean;
    onClose: () => void;
    sessionData: UserWithId;
    post: Post;
}

const CommentSection = (props: CommentSectionProps): JSX.Element => {
    const { isOpen, onClose } = props;

    const handleCleanUpAndClose = (): void => {
        onClose();
    };

    return (
        <div
            className={`commentSection ${
                isOpen === true ? 'commentSectionShow' : 'commentSectionHide'
            }`}
        >
            <div className="commentSectionContent">
                <div className="heading">
                    <h3>Comentarios</h3>
                    <button onClick={handleCleanUpAndClose}>
                        <CloseIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentSection;
