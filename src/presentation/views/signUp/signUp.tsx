import React from 'react';

//components
import SignUpForm from '../../components//SignUpForm';

//styles
import './signUp.scss';

const SignUp: React.FC = () => {
    return (
        <div className="signUp">
            <SignUpForm />
        </div>
    );
};
export default SignUp;
