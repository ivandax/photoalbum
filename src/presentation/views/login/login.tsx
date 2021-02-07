import React from 'react';

//hooks
import useCheckSession from '../../../customHooks/useCheckSession';

//components
import LoginForm from '../../components/loginForm';
import Loader from '../../components/loader';

//styles
import './login.scss';

const Login = (): JSX.Element => {
    const sessionResolution = useCheckSession();
    
    switch (sessionResolution) {
        case 'wait':
            return <Loader />;
        case 'redirect':
        case 'stop':
            return (
                <div className="signUp">
                    <LoginForm />
                </div>
            );
        default:
            return <></>;
    }
};
export default Login;
