import React, { useEffect } from 'react';
import { useHistory } from 'react-router';

//hooks
import useCheckSession from '../../../customHooks/useCheckSession';

//components
import SignUpForm from '../../components/signUpForm';

//styles
import './signUp.scss';

const SignUp = (): JSX.Element => {
    const sessionResolution = useCheckSession();
    const history = useHistory();

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
