import React, { useState, useEffect } from 'react';

//persistence
import { Post, getPostImage } from '../../../persistence/posts';
import { UserWithId } from '../../../persistence/users';

import './displayPost.scss';

type GetPhotoOp = AsyncOp<string, string>;

interface DisplayPostProps {
    key: string;
    sessionData: UserWithId;
    post: Post;
}

const DisplayPost = (props: DisplayPostProps): JSX.Element => {
    const { post } = props;

    const [photoSrc, setPhotoSrc] = useState<GetPhotoOp>({ status: 'pending' });

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
                <div>Loading</div>
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
                </div>
            ) : null}
            {photoSrc.status === 'failed' ? <div>{photoSrc.error}</div> : null}
        </div>
    );
};

export default DisplayPost;
