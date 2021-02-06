import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { addUser, getUser, UserWithId } from '../persistence/users';
import { registerAuthObserver } from '../persistence/auth';

import { setValidSessionData, setFailedSessionData } from '../redux/sessionReducer';

function useValidateSession(): AsyncOp<UserWithId, string> {
    const dispatch = useDispatch();

    const [resolvedUser, setResolvedUser] = useState<AsyncOp<UserWithId, string>>({
        status: 'pending',
    });

    useEffect(() => {
        const cancelObserver = registerAuthObserver(async (user) => {
            setResolvedUser({ status: 'ongoing' });
            console.log(user);
            if (user !== null) {
                console.log('auth observer user success...' + user);
                if (user.emailVerified === true) {
                    const profile = await getUser(user.uid);
                    if (profile === null || profile === undefined) {
                        const newProfile = {
                            name: '',
                            email: user.email,
                            role: 'member',
                            createdOn: +new Date(),
                            isAdmin: false,
                            id: user.uid,
                        };
                        await addUser(newProfile, user.uid);
                        dispatch(setValidSessionData(newProfile));
                        setResolvedUser({ status: 'successful', data: newProfile });
                    } else {
                        dispatch(setValidSessionData(profile));
                        setResolvedUser({ status: 'successful', data: profile });
                    }
                } else {
                    dispatch(setFailedSessionData("No se ha podido validar una sesión"));
                    setResolvedUser({ status: 'failed', error: 'Email no verificado' });
                }
            } else {
                console.log('auth observer user failure');
                setResolvedUser({
                    status: 'failed',
                    error: 'No se ha podido obtener un usuario',
                });
            }
        });

        return () => {
            cancelObserver();
        };
    }, [dispatch]);

    return resolvedUser;
}

export default useValidateSession;
