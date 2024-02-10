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
    getPreviousRealTimePosts,
    PageCursors,
} from '../../../persistence/posts';
import { UserWithId } from '../../../persistence/users';

import DisplayPost from '../displayPost';

import {
    setSuccessfulPosts,
    setLastPost,
    setCurrentPage,
} from '../../../redux/homeViewReducer';

import { State } from '../../../redux/index';

import './timeline.scss';

interface PaginationProps {
    changePreviousPageCallback: () => void;
    pageValue: number;
    changeNextPageCallback: () => void;
}

const Pagination = (props: PaginationProps): JSX.Element => {
    const { pageValue, changeNextPageCallback, changePreviousPageCallback } = props;
    return (
        <div className="pagination">
            <button disabled={pageValue <= 1} onClick={changePreviousPageCallback}>
                <NavigateBeforeIcon />
            </button>
            <div>{"Pagina: "}{pageValue}</div>
            <button onClick={changeNextPageCallback}>
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
    const { posts, pageCursors, currentPage } = useSelector(
        (state: State) => state.homeView
    );
    const { sessionData } = props;

    const setPostsCallback = (data: Post[]) => {
        dispatch(setSuccessfulPosts(data));
    };

    const setPageCursorsCallback = (pageCursors: PageCursors) => {
        dispatch(setLastPost(pageCursors));
    };

    const setPageNumberCallback = (pageNumber: number) => {
        dispatch(setCurrentPage(pageNumber));
    };

    useEffect(() => {
        if (posts.status === 'pending') {
            getInitialRealTimePosts(
                setPostsCallback,
                setPageCursorsCallback,
                pageCursors
            );
        }
    }, [posts.status]);

    return (
        <>
            <div className="timeline">
                {posts.status === 'successful' && posts.data.length > 0 ? (
                    posts.data.map((post) => (
                        <DisplayPost
                            key={post.postId}
                            post={post}
                            sessionData={sessionData}
                            containedBy="timeline"
                        />
                    ))
                ) : (
                    <div className="notice">No hemos obtenido ningun post</div>
                )}
            </div>

            <Pagination
                changePreviousPageCallback={() => {
                    window.scrollTo(0, 0);
                    getPreviousRealTimePosts(
                        setPostsCallback,
                        setPageNumberCallback,
                        pageCursors,
                        currentPage
                    );
                }}
                pageValue={currentPage}
                changeNextPageCallback={() => {
                    window.scrollTo(0, 0);
                    getNextRealTimePosts(
                        setPostsCallback,
                        setPageCursorsCallback,
                        setPageNumberCallback,
                        pageCursors,
                        currentPage
                    );
                }}
            />
        </>
    );
};

export default Timeline;
