import React from 'react';

//components
import LoginForm from '../../components/loginForm';

//styles
import './login.scss';

const Login: React.FC = () => {
    return (
        <div className="login">
            <LoginForm />
        </div>
    );
};
export default Login;
