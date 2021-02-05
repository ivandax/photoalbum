import React from 'react';

//components
import LoginForm from '../../components/loginForm';

//styles
import './login.scss';

const Login = (): JSX.Element => {
    return (
        <div className="login">
            <LoginForm />
        </div>
    );
};
export default Login;
