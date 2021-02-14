import React, { useState, useRef } from 'react';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/pipeable';
import { flow } from 'fp-ts/lib/function';

import { UserWithId } from '../../../persistence/users';
import { uploadFile, addPost } from '../../../persistence/posts';

import FormInput from '../formInput';

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
    const [onePhotoTitle, setOnePhotoTitle] = useState('');
    const [fileUploadPercent, setFileUploadPercent] = useState(0);
    const [localUpdateProcess, setLocalUpdateProcess] = useState('resolved');

    const handleCleanUpAndClose = (): void => {
        setOnePhotoMessage(O.none);
        setOnePhotoPreview(O.none);
        setOnePhotoTitle('');
        setFileUploadPercent(0);
        setLocalUpdateProcess('resolved');
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
        setLocalUpdateProcess('uploading');
        pipe(
            onePhotoPreview,
            O.map(async (photoRef) => {
                const uploadedPhoto = await uploadFile(
                    photoRef.handle,
                    photoRef.handle.name,
                    setFileUploadPercent
                );
                if (uploadedPhoto.status === 'failed') {
                    setOnePhotoMessage(O.some(uploadedPhoto.error));
                    setLocalUpdateProcess('resolved');
                } else {
                    setLocalUpdateProcess('posting');
                    const now = +new Date();
                    const userIdentifier =
                        sessionData.name !== ''
                            ? sessionData.name
                            : pipe(
                                  O.fromNullable(sessionData.email),
                                  O.getOrElse(() => sessionData.id)
                              );
                    const postId = `${sessionData.id}${now}`;
                    const newPost = {
                        postId,
                        title: onePhotoTitle,
                        postedBy: sessionData.id,
                        postedByName: userIdentifier,
                        createdOn: now,
                        updatedOn: now,
                        comments: [],
                        fileName: photoRef.handle.name,
                        categories: [],
                        //picPreview: photoRef.base64,
                        //fileUrl: uploadedPhoto.downloadUrl,
                        //storageBucket: uploadedPhoto.bucket,
                    };
                    const postedPhoto = await addPost(newPost, postId);
                    if (postedPhoto.status === 'failed') {
                        setOnePhotoMessage(O.some(postedPhoto.error));
                    } else {
                        handleCleanUpAndClose();
                    }
                    setLocalUpdateProcess('resolved');
                }
            })
        );
    };

    return (
        <div
            className={`createPost ${
                isOpen === true ? 'createPostShow' : 'createPostHide'
            }`}
        >
            <div className="dialogContent">
                {localUpdateProcess === 'uploading' ? (
                    <div className="dialogLoader">
                        <div>Subiendo foto... {fileUploadPercent.toFixed()}%</div>
                    </div>
                ) : null}
                {localUpdateProcess === 'posting' ? (
                    <div className="dialogLoader">
                        <div>Finalizando post...</div>
                    </div>
                ) : null}
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
                                accept="image/*"
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
                                alt="image preview for post"
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
                        {pipe(
                            onePhotoPreview,
                            O.fold(
                                () => null,
                                () => (
                                    <>
                                        <div className="postProps">
                                            <FormInput
                                                placeholder="Titulo (Opcional)"
                                                value={onePhotoTitle}
                                                type="text"
                                                onChange={(value) =>
                                                    setOnePhotoTitle(value)
                                                }
                                                className="photoTitle"
                                            />
                                        </div>
                                    </>
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
