import { useEffect, useState } from 'react';
import { useDispatch, } from 'react-redux';

import { addUser, getUser } from '../persistence/users';
import { registerAuthObserver } from '../persistence/auth';

import { setValidSession, setUserProfile } from '../redux/sessionReducer';

function useValidateSession() {
    const dispatch = useDispatch();

    const [resolvedUser, setResolvedUser] = useState(false)

    useEffect(() => {
        const cancelObserver = registerAuthObserver(async (user) => {
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
                        dispatch(setUserProfile(newProfile));
                        dispatch(setValidSession());
                        setResolvedUser(true);
                    } else {
                        dispatch(setUserProfile(profile));
                        dispatch(setValidSession());
                        setResolvedUser(true)
                    }
                } else {
                    dispatch(setUserProfile(null));
                }
            } else {
                console.log('auth observer user failure');
            }
        });

        return () => {
            cancelObserver();
        };
    }, [dispatch]);

    return resolvedUser;
}

export default useValidateSession;
