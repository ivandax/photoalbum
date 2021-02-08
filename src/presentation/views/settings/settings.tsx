import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { State } from '../../../redux/index';
import { logout } from '../../../persistence/auth';

//hooks
import useResetHeaderToggle from '../../../customHooks/useResetHeaderToggle';

//components
import StyledButton from '../../components/styledButton';
import Loader from '../../components/loader';
import EditSettings from '../../components/editSettings';

//styles
import './settings.scss';

const Settings = (): JSX.Element => {
    useResetHeaderToggle();
    const sessionData = useSelector((state: State) => state.session.sessionData);
    const history = useHistory();

    useEffect(() => {
        if (sessionData.status === 'failed') {
            history.push('./login');
        }
    }, [sessionData.status]);

    const handleLogout = () => logout();

    switch (sessionData.status) {
        case 'pending':
        case 'ongoing':
        case 'failed':
            return <Loader />;
        case 'successful':
            return (
                <div className="settings">
                    <div>
                        <h3>Usted tiene una sesión iniciada</h3>
                        <p>Loggeado como: {sessionData.data.email}</p>
                        <EditSettings userData={sessionData.data} />
                        <StyledButton
                            value="Cerrar Sesión"
                            callback={handleLogout}
                            className="red"
                        />
                    </div>
                </div>
            );
        default:
            return <></>;
    }
};
export default Settings;
