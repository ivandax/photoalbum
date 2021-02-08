import React from 'react';
import { useSelector } from 'react-redux';

//hooks
import useResetHeaderToggle from '../../../customHooks/useResetHeaderToggle';

//components
import SignUpForm from '../../components/signUpForm';
import Loader from '../../components/loader';

import { State } from '../../../redux/index';

//styles
import './signUp.scss';

const SignUp = (): JSX.Element => {
    useResetHeaderToggle();
    const sessionData = useSelector((state: State) => state.session.sessionData);

    switch (sessionData.status) {
        case 'pending':
        case 'ongoing':
            return <Loader />;
        case 'failed':
        case 'successful':
            return (
                <div className="signUp">
                    <SignUpForm />
                </div>
            );
        default:
            return <></>;
    }
};
export default SignUp;
