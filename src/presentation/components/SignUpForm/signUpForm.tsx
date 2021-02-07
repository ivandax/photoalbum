import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { signup, sendEmailValidation } from '../../../persistence/auth';
import { State } from '../../../redux/index';

import FormInput from '../formInput';

import './signUpForm.scss';

const SignUpForm = (): JSX.Element => {
    const sessionState = useSelector((state: State) => state.session);

    const [signUpData, setSignUpData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleSignUp = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage('');
        const { email, password } = signUpData;
        if (email.length === 0 || password.length === 0) {
            setMessage('Por favor, rellene todos los campos.');
        } else {
            const signUp = await signup(email, password);
            if (typeof signUp === 'string') {
                setMessage(signUp);
            }
            const sendEmail = await sendEmailValidation();
            if (typeof sendEmail === 'string') {
                setMessage(sendEmail);
            }
        }
    };

    return (
        <form onSubmit={handleSignUp} className="signUpForm">
            {sessionState.sessionData.status === 'successful' ? (
                <>
                    <h3>Usted ya ha iniciado sesión</h3>
                    {!sessionState.sessionData.data.emailVerified ? (
                        <p>Email pendiente de verificación. Revise su correo.</p>
                    ) : null}
                    {sessionState.sessionData.data.role === 'standard' ? (
                        <p>
                            El administrador debe darle permisos para hacer publicaciones.
                        </p>
                    ) : (
                        <p>
                            Puede ver o hacer publicaciones en{' '}
                        </p>
                    )}
                    <p>Ir a <Link to={'./home'}>Inicio</Link></p>
                </>
            ) : (
                <>
                    <h3>Crear una cuenta</h3>
                    <FormInput
                        placeholder="Email"
                        value={signUpData.email}
                        type="email"
                        onChange={(value) =>
                            setSignUpData({ ...signUpData, email: value })
                        }
                    />
                    <FormInput
                        placeholder="Contraseña"
                        value={signUpData.password}
                        type="password"
                        onChange={(value) =>
                            setSignUpData({ ...signUpData, password: value })
                        }
                    />
                    <button type="submit">Crear</button>
                    <span className="message">{message}</span>
                </>
            )}
        </form>
    );
};

export default SignUpForm;
