import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { updateUser, UserWithId, getUser } from '../../../persistence/users';
import {
    setOngoingSessionData,
    setValidSessionData,
} from '../../../redux/sessionReducer';

//components
import FormInput from '../formInput';

import './editSettings.scss';

interface EditSettingsProps {
    userData: UserWithId;
}

const EditSettings = (props: EditSettingsProps): JSX.Element => {
    const dispatch = useDispatch();
    const { userData } = props;

    const [userChange, setUserChange] = useState({ name: userData.name });
    const [message, setMessage] = useState('');

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault();
        if (userChange.name === userData.name) {
            setMessage('No se han detectado cambios.');
        } else {
            dispatch(setOngoingSessionData());
            await updateUser(userChange, userData.id);
            const updatedUser = await getUser(userData.id);
            if (updatedUser === null || updatedUser === undefined) {
                dispatch(setValidSessionData(userData));
            } else {
                dispatch(setValidSessionData(updatedUser));
            }
        }
    };

    return (
        <form onSubmit={handleSave} className="editSettings">
            <h3>Editar información de perfil</h3>
            <h5>Nombre:</h5>
            <div>
                <FormInput
                    placeholder="Nombre"
                    value={
                        userChange.name === userData.name
                            ? userData.name
                            : userChange.name
                    }
                    type="text"
                    onChange={(value) => setUserChange({ ...userChange, name: value })}
                />
                <button type="submit" disabled={userChange.name === userData.name}>
                    Guardar Cambios
                </button>
            </div>

            <span className="message">{message}</span>
        </form>
    );
};

export default EditSettings;
