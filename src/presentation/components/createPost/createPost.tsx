import React, { useState, useRef } from 'react';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/pipeable';
import { flow } from 'fp-ts/lib/function';

//import { login } from '../../../persistence/auth';
import { UserWithId } from '../../../persistence/users';

//import FormInput from '../formInput';

import './createPost.scss';
import placeholder from '../../../style/images/placeholder.png';

interface CreatePostProps {
    isOpen: boolean;
    onClose: () => void;
    sessionData: UserWithId;
}

interface PhotoReference {
    handle: File;
    base64: string;
}

const CreatePost = (props: CreatePostProps): JSX.Element => {
    const { sessionData, isOpen, onClose } = props;
    const photoRef = useRef<HTMLInputElement>(null);

    const [tab, setTab] = useState('onePhoto');
    const [onePhotoMessage, setOnePhotoMessage] = useState<O.Option<string>>(O.none);
    const [onePhotoPreview, setOnePhotoPreview] = useState<O.Option<PhotoReference>>(
        O.none
    );

    const handleCleanUpAndClose = (): void => {
        setOnePhotoMessage(O.none);
        setOnePhotoPreview(O.none);
        onClose();
    };

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
                () =>
                    setOnePhotoMessage(
                        O.some('No hemos podido leer la archivo como imagen')
                    ),
                (fileOrUndefined) => {
                    pipe(
                        O.fromNullable(fileOrUndefined),
                        O.map((file) => {
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = () => {
                                const result = reader.result;
                                if (typeof result === 'string') {
                                    setOnePhotoPreview(
                                        O.some({ handle: file, base64: result })
                                    );
                                } else {
                                    setOnePhotoMessage(
                                        O.some('No hemos podido leer la imagen')
                                    );
                                }
                            };
                        })
                    );
                }
            )
        );
    };

    const handlePost = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log(sessionData);
    };

    return (
        <div
            className={`createPost ${
                isOpen === true ? 'createPostShow' : 'createPostHide'
            }`}
        >
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
                    <div className="onePhoto">
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
                        <div className="picPreview">
                            <img
                                src={pipe(
                                    onePhotoPreview,
                                    O.map((photoRef) => photoRef.base64),
                                    O.getOrElse(() => placeholder)
                                )}
                            />
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
                            <button
                                disabled={O.isNone(onePhotoPreview)}
                                onClick={handlePost}
                                className={O.isSome(onePhotoPreview) ? 'readyToPost' : ''}
                            >
                                Publicar
                            </button>
                            <button onClick={handleCleanUpAndClose}>Cerrar</button>
                        </div>
                    </div>
                ) : null}
                {tab === 'manyPhotos' ? (
                    <div className="manyPhotos">Esta sección esta en construcción</div>
                ) : null}
            </div>
        </div>
    );
};

export default CreatePost;
