import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import { login } from '../../../persistence/auth';
import { State } from '../../../redux/index';

import FormInput from '../formInput';

import './loginForm.scss';

const LoginForm = (): JSX.Element => {
    const state = useSelector((state: State) => state);
    console.log(state);
    const history = useHistory();

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage('');
        const { email, password } = loginData;
        if (email.length === 0 || password.length === 0) {
            setMessage('Por favor, rellene todos los campos.');
        } else {
            const result = await login(email, password);
            if (result !== undefined) {
                setMessage(result);
            } else {
                history.push('./home');
            }
        }
    };

    return (
        <form onSubmit={handleLogin} className="loginForm">
            <h3>Iniciar Sesión</h3>
            <FormInput
                placeholder="Email"
                value={loginData.email}
                type="email"
                onChange={(value) => setLoginData({ ...loginData, email: value })}
            />
            <FormInput
                placeholder="Contraseña"
                value={loginData.password}
                type="password"
                onChange={(value) => setLoginData({ ...loginData, password: value })}
            />
            <button type="submit">Ingresar</button>
            <Link to="./sign-up">Crear una cuenta</Link>
            <span className="message">{message}</span>
            {state.session.profile === null && (
                <span className="message">Email pendiente de validación.</span>
            )}
        </form>
    );
};

export default LoginForm;
