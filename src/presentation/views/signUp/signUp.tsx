import React from 'react';

//hooks
import useCheckSession from '../../../customHooks/useCheckSession';
import useResetHeaderToggle from '../../../customHooks/useResetHeaderToggle';

//components
import SignUpForm from '../../components/signUpForm';
import Loader from '../../components/loader';

//styles
import './signUp.scss';

const SignUp = (): JSX.Element => {
    useResetHeaderToggle();
    const sessionResolution = useCheckSession();

    switch (sessionResolution) {
        case 'wait':
            return <Loader />;
        case 'redirect':
        case 'stop':
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
