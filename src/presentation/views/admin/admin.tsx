import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

//components
import Loader from '../../components/loader';

//hooks
import useResetHeaderToggle from '../../../customHooks/useResetHeaderToggle';

//persistence
import { getUsers } from '../../../persistence/users';

//redux
import {
    setOngoingUsers,
    setFailedUsers,
    setSuccessfulUsers,
} from '../../../redux/adminPanelReducer';

import { State } from '../../../redux/index';

//styles
import './admin.scss';

const Admin = (): JSX.Element => {
    useResetHeaderToggle();
    const history = useHistory();
    const dispatch = useDispatch();
    const sessionData = useSelector((state: State) => state.session.sessionData);
    const { users } = useSelector((state: State) => state.adminPanel);

    useEffect(() => {
        if (sessionData.status === 'failed') {
            history.push('./login');
        }
    }, [sessionData.status]);

    useEffect(() => {
        const onGetUsers = async () => {
            dispatch(setOngoingUsers());
            const userList = await getUsers();
            typeof userList === 'string'
                ? dispatch(setFailedUsers(userList))
                : dispatch(setSuccessfulUsers(userList));
        };
        if (users.status === 'pending') {
            onGetUsers();
        }
    }, [users.status]);

    if (users.status === 'pending' || users.status === 'ongoing') {
        return <Loader />;
    }

    switch (sessionData.status) {
        case 'pending':
        case 'ongoing':
        case 'failed':
            return <Loader />;
        case 'successful':
            return (
                <div className="admin">
                    {users.status === 'failed' ? (
                        <div>No se han podido obtener usuarios. {users.error}</div>
                    ) : (
                        <>
                            <h3>Lista de Usuarios</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Email</th>
                                        <th>Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            );
        default:
            return <></>;
    }
};
export default Admin;
