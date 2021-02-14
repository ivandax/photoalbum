import React, { useState, useEffect } from 'react';

//persistence
import { Post, getRealtimePosts } from '../../../persistence/posts';
import { UserWithId } from '../../../persistence/users';

import DisplayPost from '../displayPost';

import './timeline.scss';

type GetPostsOp = AsyncOp<Post[], string>;
interface TimelineProps {
    sessionData: UserWithId;
}

const Timeline = (props: TimelineProps): JSX.Element => {
    const { sessionData } = props;

    const [postList, setPostList] = useState<GetPostsOp>({ status: 'pending' });

    useEffect(() => {
        const onGetPosts = async () => {
            setPostList({ status: 'ongoing' });
            const result = await getRealtimePosts();
            if (typeof result === 'string') {
                setPostList({ status: 'failed', error: result });
            } else {
                setPostList({ status: 'successful', data: result });
            }
        };
        if (postList.status === 'pending') {
            onGetPosts();
        }
    }, [postList.status]);

    return (
        <div className="timeline">
            {postList.status === 'pending' || postList.status === 'ongoing' ? (
                <div>Loading...</div>
            ) : null}
            {postList.status === 'failed' ? <div>{postList.error}</div> : null}
            {postList.status === 'successful'
                ? postList.data.map((post) => (
                      <DisplayPost
                          key={post.postId}
                          sessionData={sessionData}
                          post={post}
                      />
                  ))
                : null}
        </div>
    );
};

export default Timeline;
