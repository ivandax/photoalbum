import React, { useState } from 'react';
import { Close as CloseIcon, MoreVert as MoreVertIcon } from '@material-ui/icons';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/pipeable';

import { UserWithId } from '../../../persistence/users';
import { Post, Comment, addComment, deleteComment } from '../../../persistence/posts';

import './commentSection.scss';

interface CommentComponentProps {
    comment: Comment;
    sessionData: UserWithId;
    postId: string;
}

const CommentComponent = (props: CommentComponentProps): JSX.Element => {
    const { comment, sessionData, postId } = props;

    const [displayDelete, setDisplayDelete] = useState(false);

    const handleDeleteMe = async () => {
        await deleteComment(comment.commentId, postId);
    };

    return (
        <div className="comment">
            <div className={`commentContent ${displayDelete ? 'hide' : ''}`}>
                <div className={`by ${comment.textColor}`}>{`En ${new Date(
                    comment.createdOn
                ).toLocaleDateString('es-ES')} ${
                    sessionData.id === comment.postedById
                        ? 'tu comentaste'
                        : `${comment.postedByName} comentó`
                }:`}</div>
                <div className="text">{comment.text}</div>
            </div>
            <div
                className={`actions ${
                    sessionData.id === comment.postedById ? 'show' : ''
                }`}
            >
                <button className={displayDelete ? 'show' : ''} onClick={handleDeleteMe}>
                    Borrar
                </button>
                <MoreVertIcon
                    className="moreIcon"
                    onClick={() => setDisplayDelete(!displayDelete)}
                />
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

    const handleSaveComment = (event: React.FormEvent) => {
        event.preventDefault();
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
                                const now = +new Date();
                                const comment: Comment = {
                                    commentId: `${sessionData.id}${now}`,
                                    postedById: sessionData.id,
                                    postedByName:
                                        sessionData.name !== ''
                                            ? sessionData.name
                                            : sessionData.email === null
                                            ? sessionData.id
                                            : sessionData.email,
                                    createdOn: now,
                                    text: commentText,
                                    textColor: sessionData.color,
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
                                        sessionData={sessionData}
                                        postId={validPost.postId}
                                    />
                                ))}
                            </div>
                        )
                    )
                )}
            </div>
            <form className="commentInput" onSubmit={handleSaveComment}>
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
                    <button disabled={O.isNone(myComment)} type="submit">
                        Guardar
                    </button>
                </form>
        </div>
    );
};

export default CommentSection;
