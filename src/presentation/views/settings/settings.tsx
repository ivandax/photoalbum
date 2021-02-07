import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { State } from '../../../redux/index';
import { logout } from '../../../persistence/auth';

//hooks
import useCheckSession from '../../../customHooks/useCheckSession';

//components
import StyledButton from '../../components/styledButton';
import Loader from '../../components/loader';
import EditSettings from '../../components/editSettings';

//styles
import './settings.scss';

const Settings = (): JSX.Element => {
    const sessionState = useSelector((state: State) => state.session);
    const history = useHistory();
    const sessionResolution = useCheckSession();

    useEffect(() => {
        if (sessionResolution === 'redirect') {
            history.push('./login');
        }
    }, [sessionResolution]);

    const handleLogout = () => logout();

    switch (sessionResolution) {
        case 'wait':
        case 'redirect':
            return <Loader />;
        case 'stop':
            return (
                <div className="settings">
                    {sessionState.sessionData.status === 'successful' ? (
                        <div>
                            <h3>Usted tiene una sesión iniciada</h3>
                            <p>Loggeado como: {sessionState.sessionData.data.email}</p>
                            <EditSettings userData={sessionState.sessionData.data} />
                            <StyledButton
                                value="Cerrar Sesión"
                                callback={handleLogout}
                                className="red"
                            />
                        </div>
                    ) : (
                        <div>Error: No hay sesión iniciada</div>
                    )}
                </div>
            );
        default:
            return <></>;
    }
};
export default Settings;
