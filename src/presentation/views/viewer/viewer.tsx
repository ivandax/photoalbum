import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';

//reducer actions
import { setCommentSectionClose } from '../../../redux/commentSectionReducer';
import {
    setSuccessfulPost,
    setPendingPost,
} from '../../../redux/viewerViewReducer';

//persistence
import { getRealtimePost, Post } from '../../../persistence/posts';

//components
import Loader from '../../components/loader';
import CommentSection from '../../components/commentSection';
import DisplayPost from '../../components/displayPost';

//hooks
import useResetHeaderToggle from '../../../customHooks/useResetHeaderToggle';

import { State } from '../../../redux/index';

//styles
import './viewer.scss';

const Viewer = (): JSX.Element => {
    useResetHeaderToggle();
    const history = useHistory();
    const params: { postId: string } = useParams();
    const dispatch = useDispatch();
    const sessionData = useSelector((state: State) => state.session.sessionData);
    const commentSection = useSelector((state: State) => state.commentSection);
    const { post } = useSelector((state: State) => state.viewerView);

    useEffect(() => {
        if (sessionData.status === 'failed') {
            history.push('./login');
        }
    }, [sessionData.status]);

    const setPostCallback = (data: Post) => {
        dispatch(setSuccessfulPost(data));
    };

    useEffect(() => {
        if (post.status === 'pending') {
            getRealtimePost(params.postId, setPostCallback);
        }

        return function cleanUp() {
            dispatch(setPendingPost());
        };
    }, []);

    const postIsLoading = post.status === 'pending' || post.status === 'ongoing';

    switch (sessionData.status) {
        case 'pending':
        case 'ongoing':
        case 'failed':
            return <Loader />;
        case 'successful':
            return sessionData.data.role === 'member' ? (
                <div className="viewer">
                    {postIsLoading ? <Loader /> : null}
                    {post.status === 'failed' ? <div>{post.error}</div> : null}
                    {post.status === 'successful' ? (
                        <DisplayPost
                            key={params.postId}
                            sessionData={sessionData.data}
                            post={post.data}
                            containedBy="viewer"
                        />
                    ) : null}
                    <CommentSection
                        isOpen={commentSection.isOpen}
                        onClose={() => dispatch(setCommentSectionClose())}
                        sessionData={sessionData.data}
                        post={commentSection.post}
                    />
                </div>
            ) : (
                <div className="securityNotice">
                    <p>
                        El administrador debe proporcionarle derechos de creación y
                        edición.
                    </p>
                </div>
            );

        default:
            return <></>;
    }
};
export default Viewer;
