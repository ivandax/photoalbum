import React, { useState } from 'react';
import { Close as CloseIcon } from '@material-ui/icons';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/pipeable';

import { UserWithId } from '../../../persistence/users';
import { Post } from '../../../persistence/posts';

import './commentSection.scss';

interface CommentSectionProps {
    isOpen: boolean;
    onClose: () => void;
    sessionData: UserWithId;
    post: Post | null;
}

const CommentSection = (props: CommentSectionProps): JSX.Element => {
    const { isOpen, onClose, post } = props;

    const [myComment, setMyComment] = useState<O.Option<string>>(O.none);

    const handleCleanUpAndClose = (): void => {
        onClose();
    };

    const handleSaveComment = () => {
        console.log(myComment);
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
                {pipe(
                    O.fromNullable(post),
                    O.fold(
                        (): JSX.Element => <></>,
                        (validPost): JSX.Element => (
                            <div className="comments">
                                {validPost.comments.map((comment) => (
                                    <div key={comment.createdOn}>{comment.text}</div>
                                ))}
                            </div>
                        )
                    )
                )}
                <div className="commentInput">
                    <textarea
                        placeholder="Comentar..."
                        value={pipe(
                            myComment,
                            O.getOrElse(() => '')
                        )}
                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                            event.target.value === ''
                                ? setMyComment(O.none)
                                : setMyComment(O.some(event.target.value));
                        }}
                    ></textarea>
                    <button disabled={O.isNone(myComment)} onClick={handleSaveComment}>
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentSection;
