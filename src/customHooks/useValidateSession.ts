import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addUser, getUser } from '../persistence/users';
import { registerAuthObserver } from '../persistence/auth';

import { setValidSession, setUserProfile, SessionState } from '../redux/sessionReducer';

function useValidateSession() {
    const dispatch = useDispatch();

    useEffect(() => {
        const cancelObserver = registerAuthObserver(async (user) => {
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
                    } else {
                        dispatch(setUserProfile(profile));
                        dispatch(setValidSession());
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

    const session = useSelector((state: SessionState) => state);

    return session.validSession;
}

export default useValidateSession;
