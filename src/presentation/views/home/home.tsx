import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Add as AddIcon } from '@material-ui/icons';

//reducer actions
import { setCommentSectionClose } from '../../../redux/commentSectionReducer';

//components
import Loader from '../../components/loader';
import CreatePost from '../../components/createPost';
import Timeline from '../../components/timeline';
import CommentSection from '../../components/commentSection';

//hooks
import useResetHeaderToggle from '../../../customHooks/useResetHeaderToggle';

import { State } from '../../../redux/index';

//styles
import './home.scss';

const Home = (): JSX.Element => {
    useResetHeaderToggle();
    const history = useHistory();
    const dispatch = useDispatch();
    const sessionData = useSelector((state: State) => state.session.sessionData);
    const commentSection = useSelector((state: State) => state.commentSection);

    const [openCreatePost, setOpenCreatePost] = useState(false);

    useEffect(() => {
        if (sessionData.status === 'failed') {
            history.push('./login');
        }
    }, [sessionData.status]);

    switch (sessionData.status) {
        case 'pending':
        case 'ongoing':
        case 'failed':
            return <Loader />;
        case 'successful':
            return sessionData.data.role === 'member' ? (
                <div
                    className={`home ${
                        openCreatePost ? 'blocked' : ''
                    }`}
                >
                    <Timeline />
                    <CommentSection
                        isOpen={commentSection.isOpen}
                        onClose={() => dispatch(setCommentSectionClose())}
                        sessionData={sessionData.data}
                        post={commentSection.post}
                    />
                    <CreatePost
                        isOpen={openCreatePost}
                        sessionData={sessionData.data}
                        onClose={() => setOpenCreatePost(false)}
                    />
                    <div className="toolbar">
                        <button onClick={() => setOpenCreatePost(true)}>
                            <AddIcon />
                        </button>
                    </div>
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
export default Home;
