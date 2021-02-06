import React, { useEffect } from 'react';
import { useHistory } from 'react-router';

//components

//hooks
import useCheckSession from '../../../customHooks/useCheckSession';

//styles
import './home.scss';

const Home = (): JSX.Element => {
    const history = useHistory();
    const sessionResolution = useCheckSession();

    useEffect(() => {
        if (sessionResolution === 'redirect') {
            history.push('./login');
        }
    }, [sessionResolution]);

    switch (sessionResolution) {
        case 'wait':
        case 'redirect':
            return <>Loading...</>;
        case 'stop':
            return <div className="home">Home page</div>;
        default:
            return <></>;
    }
};
export default Home;
