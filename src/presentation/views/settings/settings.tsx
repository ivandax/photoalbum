import React from 'react';
import { useSelector } from 'react-redux';

import { State } from '../../../redux/index';
import { logout } from '../../../persistence/auth';

//components
import StyledButton from '../../components/styledButton';

//styles
import './settings.scss';

const Settings = (): JSX.Element => {
    const sessionState = useSelector((state: State) => state.session);

    const handleLogout = () => logout();

    return (
        <div className="settings">
            {sessionState.sessionData.status === 'successful' ? (
                <div>
                    <h3>Usted tiene una sesión iniciada</h3>
                    <p>Loggeado como: {sessionState.sessionData.data.email}</p>
                    <StyledButton value="Cerrar Sesión" callback={handleLogout}/>
                </div>
            ) : (
                <div>Error: No hay sesión iniciada</div>
            )}
        </div>
    );
};
export default Settings;
