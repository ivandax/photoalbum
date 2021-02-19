import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUsers } from '../persistence/users';
import { State } from '../redux/index';

import {
    setOngoingAppUsers,
    setFailedAppUsers,
    setSuccessfulAppUsers,
    AppUsersState,
} from '../redux/appUsersReducer';

function useValidateAuthentication(): AppUsersState['appUsers'] {
    const dispatch = useDispatch();
    const { appUsers } = useSelector((state: State) => state.appUsers);

    useEffect(() => {
        const onGetUsers = async () => {
            dispatch(setOngoingAppUsers());
            const userList = await getUsers();
            typeof userList === 'string'
                ? dispatch(setFailedAppUsers(userList))
                : dispatch(setSuccessfulAppUsers(userList));
        };
        if (appUsers.status === 'pending') {
            onGetUsers();
        }
    }, [appUsers.status]);

    return appUsers;
}

export default useValidateAuthentication;
