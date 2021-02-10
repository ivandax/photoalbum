import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/pipeable';

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

type RoleChange = { id: string; role: string };

const getFromArray = (array: RoleChange[], evalId: string): RoleChange | undefined => {
    return array.find((item) => item.id === evalId);
};

const removeFromArray = (array: RoleChange[], evalId: string): RoleChange[] => {
    return array.filter((item) => item.id !== evalId);
};

const Admin = (): JSX.Element => {
    useResetHeaderToggle();
    const history = useHistory();
    const dispatch = useDispatch();
    const sessionData = useSelector((state: State) => state.session.sessionData);
    const { users } = useSelector((state: State) => state.adminPanel);

    const [roleChanges, setRoleChanges] = useState<RoleChange[]>([]);

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
                    ) : sessionData.data.isAdmin ? (
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
                                            <td>
                                                <select
                                                    value={pipe(
                                                        O.fromNullable(
                                                            getFromArray(
                                                                roleChanges,
                                                                user.id
                                                            )
                                                        ),
                                                        O.map(
                                                            (roleChange) =>
                                                                roleChange.role
                                                        ),
                                                        O.getOrElse(() => user.role)
                                                    )}
                                                    onChange={(
                                                        event: React.ChangeEvent<HTMLSelectElement>
                                                    ) => {
                                                        if (
                                                            event.currentTarget.value ===
                                                            user.role
                                                        ) {
                                                            setRoleChanges(
                                                                removeFromArray(
                                                                    [...roleChanges],
                                                                    user.id
                                                                )
                                                            );
                                                        } else {
                                                            setRoleChanges([
                                                                ...roleChanges,
                                                                {
                                                                    id: user.id,
                                                                    role:
                                                                        event
                                                                            .currentTarget
                                                                            .value,
                                                                },
                                                            ]);
                                                        }
                                                    }}
                                                >
                                                    <option>member</option>
                                                    <option>standard</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <div>Access Denied</div>
                    )}
                </div>
            );
        default:
            return <></>;
    }
};
export default Admin;
