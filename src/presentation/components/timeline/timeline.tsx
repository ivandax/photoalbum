import React, { useState, useEffect } from 'react';

//persistence
import { Post, getRealTimePosts } from '../../../persistence/posts';

import DisplayPost from '../displayPost';

import './timeline.scss';

type GetPostsOp = AsyncOp<Post[], string>;

const Timeline = (): JSX.Element => {
    const [postList, setPostList] = useState<GetPostsOp>({ status: 'pending' });

    useEffect(() => {
        setPostList({ status: 'ongoing' });
        getRealTimePosts(setPostList);
    }, []);

    return (
        <div className="timeline">
            {postList.status === 'pending' || postList.status === 'ongoing' ? (
                <div>Loading...</div>
            ) : null}
            {postList.status === 'failed' ? <div>{postList.error}</div> : null}
            {postList.status === 'successful' && postList.data.length > 0 ? (
                postList.data.map((post) => (
                    <DisplayPost
                        key={post.postId}
                        post={post}
                    />
                ))
            ) : (
                <div className="notice">No hemos obtenido ningun post</div>
            )}
        </div>
    );
};

export default Timeline;
