import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    NavigateNext as NavigateNextIcon,
    NavigateBefore as NavigateBeforeIcon,
} from '@material-ui/icons';

//persistence
import {
    Post,
    getInitialRealTimePosts,
    getNextRealTimePosts,
    FirstAndLastPost,
} from '../../../persistence/posts';
import { UserWithId } from '../../../persistence/users';

import DisplayPost from '../displayPost';

import { setSuccessfulPosts, setLastPost } from '../../../redux/homeViewReducer';

import { State } from '../../../redux/index';

import './timeline.scss';

interface PaginationProps {
    pageValue: number;
    changePageCallback: () => void;
}

const Pagination = (props: PaginationProps): JSX.Element => {
    const { pageValue, changePageCallback } = props;
    return (
        <div className="pagination">
            <button disabled={pageValue <= 1}>
                <NavigateBeforeIcon />
            </button>
            <div>{pageValue}</div>
            <button onClick={changePageCallback}>
                <NavigateNextIcon />
            </button>
        </div>
    );
};

interface TimelineProps {
    sessionData: UserWithId;
}

const Timeline = (props: TimelineProps): JSX.Element => {
    const dispatch = useDispatch();
    const { posts, firstAndLastPost, currentPage } = useSelector(
        (state: State) => state.homeView
    );
    const { sessionData } = props;

    const setPostsCallback = (data: Post[]) => {
        dispatch(setSuccessfulPosts(data));
    };

    const setFirstAndLastPostCallback = (firstAndLastPost: FirstAndLastPost) => {
        dispatch(setLastPost(firstAndLastPost));
    };

    useEffect(() => {
        if (posts.status === 'pending') {
            getInitialRealTimePosts(setPostsCallback, setFirstAndLastPostCallback);
        }
    }, [posts.status]);

    return (
        <div className="timeline">
            {posts.status === 'successful' && posts.data.length > 0 ? (
                <>
                    {posts.data.map((post) => (
                        <DisplayPost
                            key={post.postId}
                            post={post}
                            sessionData={sessionData}
                            containedBy="timeline"
                        />
                    ))}
                    <Pagination
                        pageValue={currentPage}
                        changePageCallback={() =>
                            getNextRealTimePosts(
                                setPostsCallback,
                                setFirstAndLastPostCallback,
                                firstAndLastPost
                            )
                        }
                    />
                </>
            ) : (
                <div className="notice">No hemos obtenido ningun post</div>
            )}
        </div>
    );
};

export default Timeline;
