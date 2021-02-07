import React, { useState } from 'react';

import { updateUser, UserWithId } from '../../../persistence/users';

//components
import FormInput from '../formInput';

import './editSettings.scss';

interface EditSettingsProps {
    userData: UserWithId;
}

const EditSettings = (props: EditSettingsProps): JSX.Element => {
    const { userData } = props;

    const [userChange, setUserChange] = useState({ name: '' });
    const [message, setMessage] = useState('');

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault();
        if (userChange.name.length === 0) {
            setMessage('No se han detectado cambios.');
        } else {
            await updateUser(userChange, userData.id);
        }
    };

    return (
        <form onSubmit={handleSave} className="editSettings">
            <h3>Editar información de perfil</h3>
            <div>
                <FormInput
                    placeholder="Nombre"
                    value={userChange.name !== '' ? userChange.name : userData.name}
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
