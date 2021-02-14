import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Add as AddIcon } from '@material-ui/icons';

//components
import Loader from '../../components/loader';
import CreatePost from '../../components/createPost';

//persistence
import { getPostImage } from '../../../persistence/posts';

//hooks
import useResetHeaderToggle from '../../../customHooks/useResetHeaderToggle';

import { State } from '../../../redux/index';

//styles
import './home.scss';

const Home = (): JSX.Element => {
    useResetHeaderToggle();
    const history = useHistory();
    const sessionData = useSelector((state: State) => state.session.sessionData);

    const [openCreatePost, setOpenCreatePost] = useState(false);

    const [test, setTest] = useState('');
    const getTestImage = async () => {
        const url = await getPostImage('quarantine.png');
        if (url) {
            setTest(url);
        }
    };

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
            return (
                <div className={`home ${openCreatePost ? 'blocked' : ''}`}>
                    <CreatePost
                        isOpen={openCreatePost}
                        sessionData={sessionData.data}
                        onClose={() => setOpenCreatePost(false)}
                    />
                    <button onClick={getTestImage}>GetImage</button>
                    <img src={test} />
                    <div className="toolbar">
                        <button onClick={() => setOpenCreatePost(true)}>
                            <AddIcon />
                        </button>
                    </div>
                </div>
            );
        default:
            return <></>;
    }
};
export default Home;
