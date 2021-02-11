import React, { useState, useRef } from 'react';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/pipeable';
import { flow } from 'fp-ts/lib/function';

//import { login } from '../../../persistence/auth';
import { UserWithId } from '../../../persistence/users';

//import FormInput from '../formInput';

import './createPost.scss';

interface CreatePostProps {
    isOpen: boolean;
    onClose: () => void;
    sessionData: UserWithId;
}

const CreatePost = (props: CreatePostProps): JSX.Element => {
    const { sessionData, isOpen, onClose } = props;
    console.log(sessionData);
    const photoRef = useRef<HTMLInputElement>(null);

    const [tab, setTab] = useState('onePhoto');
    const [onePhotoMessage, setOnePhotoMessage] = useState<O.Option<string>>(O.none);

    const handleLoadPhoto = (): void => {
        setOnePhotoMessage(O.none);
        pipe(
            O.fromNullable(photoRef?.current),
            O.map((element) => element.files),
            O.chain(
                flow(
                    O.fromNullable,
                    O.map((files) => files[0])
                )
            ),
            O.fold(
                () => setOnePhotoMessage(O.some('No hemos podido cargar la foto')),
                (file) => console.log(file)
            )
        );
    };

    const handlePost = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log('attempting to post');
    };

    return (
        <div className={`createPost ${isOpen === true ? 'show' : 'hide'}`}>
            <div className="content">
                <div className="options">
                    <button
                        className={`left ${tab === 'onePhoto' ? 'active' : ''}`}
                        onClick={() => setTab('onePhoto')}
                    >
                        Una foto
                    </button>
                    <button
                        className={`right ${tab === 'manyPhotos' ? 'active' : ''}`}
                        onClick={() => setTab('manyPhotos')}
                    >
                        Muchas fotos
                    </button>
                </div>
                {tab === 'onePhoto' ? (
                    <>
                        <div className="upload">
                            <input
                                type="file"
                                id="files"
                                className="hidden"
                                accept="image/png, image/jpeg image/jpg"
                                ref={photoRef}
                                onChange={handleLoadPhoto}
                            />
                            <label htmlFor="files">Subir foto</label>
                        </div>
                        {pipe(
                            onePhotoMessage,
                            O.fold(
                                () => null,
                                (message) => (
                                    <div>
                                        <p>{message}</p>
                                    </div>
                                )
                            )
                        )}
                        <div className="post">
                            <button disabled onClick={handlePost}>
                                Publicar
                            </button>
                            <button onClick={onClose}>Cerrar</button>
                        </div>
                    </>
                ) : null}
                {tab === 'manyPhotos' ? <>Esta sección esta en construcción</> : null}
            </div>
        </div>
    );
};

export default CreatePost;
