import React from 'react';

//components
import SignUpForm from '../../components/signUpForm';

//styles
import './signUp.scss';

const SignUp = (): JSX.Element => {
    return (
        <div className="signUp">
            <SignUpForm />
        </div>
    );
};
export default SignUp;
