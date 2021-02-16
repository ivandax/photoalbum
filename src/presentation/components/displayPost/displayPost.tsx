import React, { useState, useEffect } from 'react';
import { Comment as CommentIcon } from '@material-ui/icons';

//persistence
import { Post, getPostImage } from '../../../persistence/posts';
import { UserWithId } from '../../../persistence/users';

//components
import CommentSection from '../commentSection';

import './displayPost.scss';

type GetPhotoOp = AsyncOp<string, string>;

interface DisplayPostProps {
    key: string;
    sessionData: UserWithId;
    post: Post;
}

const DisplayPost = (props: DisplayPostProps): JSX.Element => {
    const { post, sessionData } = props;

    const [photoSrc, setPhotoSrc] = useState<GetPhotoOp>({ status: 'pending' });
    const [openCommentSection, setOpenCommentSection] = useState(false);

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
                    <div
                        className={`comments ${
                            post.comments.length > 0 ? 'withLength' : ''
                        }`}
                    >
                        {post.comments.length > 0 ? (
                            <div>{`Comentarios: ${post.comments.length}`}</div>
                        ) : null}
                        <button onClick={() => setOpenCommentSection(true)}>
                            <CommentIcon />
                        </button>
                    </div>
                    <CommentSection
                        isOpen={openCommentSection}
                        onClose={() => setOpenCommentSection(false)}
                        sessionData={sessionData}
                        post={post}
                    />
                </div>
            ) : null}
            {photoSrc.status === 'failed' ? <div>{photoSrc.error}</div> : null}
        </div>
    );
};

export default DisplayPost;
