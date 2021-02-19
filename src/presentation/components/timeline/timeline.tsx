import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

//persistence
import { Post, getRealTimePosts } from '../../../persistence/posts';

import DisplayPost from '../displayPost';

import { setSuccessfulPosts } from '../../../redux/homeViewReducer';

import { State } from '../../../redux/index';

import './timeline.scss';

const Timeline = (): JSX.Element => {
    const dispatch = useDispatch();
    const { posts } = useSelector((state: State) => state.homeView);

    const setPostsCallback = (data: Post[]) => {
        dispatch(setSuccessfulPosts(data));
    };

    useEffect(() => {
        if (posts.status === 'pending') {
            getRealTimePosts(setPostsCallback);
        }
    }, [posts.status]);

    return (
        <div className="timeline">
            {posts.status === 'successful' && posts.data.length > 0 ? (
                posts.data.map((post) => <DisplayPost key={post.postId} post={post} />)
            ) : (
                <div className="notice">No hemos obtenido ningun post</div>
            )}
        </div>
    );
};

export default Timeline;
