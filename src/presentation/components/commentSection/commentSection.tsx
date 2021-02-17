import React, { useState } from 'react';
import { Close as CloseIcon, MoreVert as MoreVertIcon } from '@material-ui/icons';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/pipeable';

import { UserWithId } from '../../../persistence/users';
import { Post, Comment, addComment } from '../../../persistence/posts';

import './commentSection.scss';

interface CommentComponentProps {
    key: string;
    comment: Comment;
}

const CommentComponent = (props: CommentComponentProps): JSX.Element => {
    const { key, comment } = props;
    return (
        <div key={key} className="comment">
            <div className="commentContent">
                <div className="by">{`${new Date(
                    comment.createdOn
                ).toLocaleDateString()} ${comment.postedByName}:`}</div>
                <div className="text">{comment.text}</div>
            </div>
            <div>
                <MoreVertIcon />
            </div>
        </div>
    );
};

interface CommentSectionProps {
    isOpen: boolean;
    onClose: () => void;
    sessionData: UserWithId;
    post: Post | null;
}

const CommentSection = (props: CommentSectionProps): JSX.Element => {
    const { isOpen, onClose, post, sessionData } = props;

    const [myComment, setMyComment] = useState<O.Option<string>>(O.none);

    const handleCleanUpAndClose = (): void => {
        setMyComment(O.none);
        onClose();
    };

    const handleSaveComment = () => {
        pipe(
            O.fromNullable(post),
            O.fold(
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                () => {},
                (validPost) => {
                    pipe(
                        myComment,
                        O.fold(
                            // eslint-disable-next-line @typescript-eslint/no-empty-function
                            () => {},
                            async (commentText) => {
                                setMyComment(O.none);
                                const comment: Comment = {
                                    postedById: sessionData.id,
                                    postedByName:
                                        sessionData.name !== ''
                                            ? sessionData.name
                                            : sessionData.email === null
                                            ? sessionData.id
                                            : sessionData.email,
                                    createdOn: +new Date(),
                                    text: commentText,
                                    textColor: 'black',
                                };
                                await addComment(comment, validPost.postId);
                            }
                        )
                    );
                }
            )
        );
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
                            <div className="commentArea">
                                {validPost.comments.map((comment) => (
                                    <CommentComponent
                                        key={`${comment.createdOn}${comment.postedById}`}
                                        comment={comment}
                                    />
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
