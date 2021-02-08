import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addUser, getUser, UserWithId } from '../persistence/users';
import { registerAuthObserver } from '../persistence/auth';

import { State } from '../redux/index';

import {
    setValidSessionData,
    setFailedSessionData,
    setOngoingSessionData,
} from '../redux/sessionReducer';

function useValidateAuthentication(): AsyncOp<UserWithId, string> {
    const dispatch = useDispatch();
    const sessionData = useSelector((state: State) => state.session.sessionData);

    useEffect(() => {
        const cancelObserver = registerAuthObserver(async (user) => {
            dispatch(setOngoingSessionData());
            if (user !== null) {
                console.log('auth observer user success...' + user);
                const existingProfile = await getUser(user.uid);
                if (existingProfile === null || existingProfile === undefined) {
                    const newProfile = {
                        name: '',
                        email: user.email,
                        role: 'standard',
                        createdOn: +new Date(),
                        isAdmin: false,
                        id: user.uid,
                        emailVerified: user.emailVerified,
                    };
                    await addUser(newProfile, user.uid);
                    dispatch(setValidSessionData(newProfile));
                } else {
                    if (user.emailVerified !== existingProfile.emailVerified) {
                        const reviewedProfile = {
                            ...existingProfile,
                            emailVerified: user.emailVerified,
                        };
                        await addUser(reviewedProfile, user.uid);
                        dispatch(setValidSessionData(reviewedProfile));
                    } else {
                        dispatch(setValidSessionData(existingProfile));
                    }
                }
            } else {
                dispatch(setFailedSessionData('No se ha podido validar una sesión'));
            }
        });

        return () => {
            cancelObserver();
        };
    }, []);

    return sessionData;
}

export default useValidateAuthentication;
