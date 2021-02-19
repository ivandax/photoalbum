import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/pipeable';

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

const colors = [
    'black',
    'red',
    'blue',
    'orange',
    'yellow',
    'lightblue',
    'green',
    'purple',
    'pink',
];

type UserChange = Partial<UserWithId>;

const EditSettings = (props: EditSettingsProps): JSX.Element => {
    const dispatch = useDispatch();
    const { userData } = props;

    const [userName, setUserName] = useState<O.Option<string>>(O.none);
    const [userColor, setUserColor] = useState<O.Option<string>>(O.none);
    const [message, setMessage] = useState('');

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault();
        if (O.isNone(userName) && O.isNone(userColor)) {
            setMessage('No se han detectado cambios.');
        } else {
            const nameChange: UserChange = pipe(
                userName,
                O.map((newName) => ({ name: newName })),
                O.getOrElse(() => ({}))
            );
            const colorChange: UserChange = pipe(
                userColor,
                O.map((newColor) => ({ color: newColor })),
                O.getOrElse(() => ({}))
            );
            dispatch(setOngoingSessionData());
            await updateUser({ ...nameChange, ...colorChange }, userData.id);
            const updatedUser = await getUser(userData.id);
            if (updatedUser === null || updatedUser === undefined) {
                //session is not lost if users changes are not saved.
                dispatch(setValidSessionData(userData));
            } else {
                dispatch(setValidSessionData(updatedUser));
            }
        }
    };

    return (
        <form onSubmit={handleSave} className="editSettings">
            <h3>Editar información de perfil</h3>
            <div className="properties">
                <div>
                    <h5>Nombre:</h5>
                    <FormInput
                        placeholder="Nombre"
                        value={pipe(
                            userName,
                            O.getOrElse(() => userData.name)
                        )}
                        type="text"
                        onChange={(value) =>
                            value === userData.name
                                ? setUserName(O.none)
                                : setUserName(O.some(value))
                        }
                    />
                </div>
                <div>
                    <h5>Color favorito:</h5>
                    <select
                        value={pipe(
                            userColor,
                            O.getOrElse(() => userData.color)
                        )}
                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                            event.target.value === userData.color
                                ? setUserColor(O.none)
                                : setUserColor(O.some(event.target.value));
                        }}
                    >
                        {colors.map((color) => (
                            <option key={color} className={color}>
                                {color}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={O.isNone(userName) && O.isNone(userColor)}
                    >
                        Guardar Cambios
                    </button>
                </div>
            </div>

            <span className="message">{message}</span>
        </form>
    );
};

export default EditSettings;
