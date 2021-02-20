import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Comment as CommentIcon,
    EmojiPeople as EmojiPeopleIcon,
    KeyboardArrowDown as ArrowDownIcon,
    KeyboardArrowUp as ArrowUpIcon,
} from '@material-ui/icons';

//persistence
import { Post, getPostImage, deletePost } from '../../../persistence/posts';
import { UserWithId } from '../../../persistence/users';

//actions
import {
    setCommentSectionOpen,
    setCommentSectionUpdate,
} from '../../../redux/commentSectionReducer';
import { State } from '../../../redux/index';

//components
import ConfirmationModal from '../confirmationModal';

import './displayPost.scss';

type GetPhotoOp = AsyncOp<string, string>;

interface DisplayPostProps {
    key: string;
    post: Post;
    sessionData: UserWithId;
}

const DisplayPost = (props: DisplayPostProps): JSX.Element => {
    const dispatch = useDispatch();
    const commentSection = useSelector((state: State) => state.commentSection);
    const { post, sessionData } = props;

    const [photoSrc, setPhotoSrc] = useState<GetPhotoOp>({ status: 'pending' });
    const [displayPostActions, setDisplayPostActions] = useState(false);
    const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);

    const handleDeletePost = () => {
        setIsOpenConfirmationModal(true);
    };

    useEffect(() => {
        const onGetPhoto = async () => {
            setPhotoSrc({ status: 'ongoing' });
            const result = await getPostImage(post.fileName);
            if (result.status === 'failed') {
                setPhotoSrc({ status: 'failed', error: result.error });
            } else {
                setPhotoSrc({ status: 'successful', data: result.url });
            }
        };
        if (photoSrc.status === 'pending') {
            onGetPhoto();
        }
    }, [photoSrc.status]);

    useEffect(() => {
        if (commentSection.isOpen) {
            dispatch(setCommentSectionUpdate(post));
        }
    }, [post.comments.length]);

    return (
        <div className="displayPost">
            {photoSrc.status === 'pending' || photoSrc.status === 'ongoing' ? (
                <div className="postLoader">
                    <div>Cargando...</div>
                </div>
            ) : null}
            {photoSrc.status === 'successful' ? (
                <div className="figureContainer">
                    <figure>
                        <img
                            alt={post.title === '' ? post.postedByName : post.title}
                            src={photoSrc.data}
                            className="postImage"
                        />
                        <figcaption>{post.title}</figcaption>
                        <span>Publicado por {post.postedByName}</span>
                    </figure>
                    <div className={'commentsCountArea'}>
                        <div>
                            <EmojiPeopleIcon />
                            <span>{post.comments.length}</span>
                        </div>
                        {(sessionData.isAdmin || post.postedBy === sessionData.id) &&
                        displayPostActions === false ? (
                            <ArrowDownIcon
                                className="arrowIcon"
                                onClick={() => setDisplayPostActions(!displayPostActions)}
                            />
                        ) : null}
                        {(sessionData.isAdmin || post.postedBy === sessionData.id) &&
                        displayPostActions === true ? (
                            <ArrowUpIcon
                                className="arrowIcon"
                                onClick={() => setDisplayPostActions(!displayPostActions)}
                            />
                        ) : null}
                        <CommentIcon
                            onClick={() => dispatch(setCommentSectionOpen(post))}
                            className="commentIcon"
                        />
                    </div>
                    <div className={`postActions ${displayPostActions ? 'show' : ''}`}>
                        <button onClick={handleDeletePost} className="deletePostButton">
                            Borrar
                        </button>
                        <button
                            onClick={() => setDisplayPostActions(false)}
                            className="backPostButton"
                        >
                            Cerrar
                        </button>
                    </div>
                    <ConfirmationModal
                        isOpen={isOpenConfirmationModal}
                        onClose={() => setIsOpenConfirmationModal(false)}
                        message="Atención! Se borrará esta publicación, la foto asociada y todos los comentarios. Seguro que quieres borrar?"
                        actionConfirmation="Sí, borrar"
                        confirmationCallback={() =>
                            deletePost(post.postId, post.fileName)
                        }
                    />
                </div>
            ) : null}
            {photoSrc.status === 'failed' ? <div>{photoSrc.error}</div> : null}
        </div>
    );
};

export default DisplayPost;
