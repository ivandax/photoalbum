import React, { useState } from 'react';
import { useHistory } from 'react-router';

import { signup } from '../../../persistence/auth';

import FormInput from '../formInput';

import './signUpForm.scss';

const SignUpForm = (): JSX.Element => {
    const history = useHistory();

    const [signUpData, setSignUpData] = useState({email:'',password:''});
    const [message, setMessage] = useState('');

    const handleSignUp = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage('');
        const { email, password } = signUpData;
        if (email.length === 0 || password.length === 0) {
            setMessage('Por favor, rellene todos los campos.');
        } else {
            const result = await signup(email, password);
            if (typeof result !== "string") {
                setMessage("Ha ocurrido un error");
            } else {
                history.push('./home');
            }
        }
    };

    return (
        <form onSubmit={handleSignUp} className="signUpForm">
            <h3>Crear una cuenta</h3>
            <FormInput
                placeholder="Email"
                value={signUpData.email}
                type="email"
                onChange={(value) => setSignUpData({ ...signUpData, email: value })}
            />
            <FormInput
                placeholder="Contraseña"
                value={signUpData.password}
                type="password"
                onChange={(value) => setSignUpData({ ...signUpData, password: value })}
            />
            <button type="submit">Ingresar</button>
            <span className="message">{message}</span>
        </form>
    );
};

export default SignUpForm;
