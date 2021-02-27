import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/pipeable';
import { flow } from 'fp-ts/lib/function';
import { Select, Checkbox, ListItemText, MenuItem, Input } from '@material-ui/core';

import { UserWithId } from '../../../persistence/users';
import { uploadFile, addPost, Post } from '../../../persistence/posts';
import {
    addPostReferenceToAllCategories,
    PostReference,
} from '../../../persistence/categories';

import { State } from '../../../redux/index';

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
    const categoryOptions = useSelector(
        (state: State) => state.categoriesArray.categoriesArray
    );
    const photoRef = useRef<HTMLInputElement>(null);
    const imagePreviewRef = useRef<HTMLImageElement>(null);

    const [onePhotoMessage, setOnePhotoMessage] = useState<O.Option<string>>(O.none);
    const [onePhotoPreview, setOnePhotoPreview] = useState<O.Option<PhotoReference>>(
        O.none
    );
    const [onePhotoTitle, setOnePhotoTitle] = useState('');
    const [fileUploadPercent, setFileUploadPercent] = useState(0);
    const [localUpdateProcess, setLocalUpdateProcess] = useState('resolved');
    const [categories, setCategories] = React.useState<string[]>([]);

    const handleCleanUpAndClose = (): void => {
        setOnePhotoMessage(O.none);
        setOnePhotoPreview(O.none);
        setOnePhotoTitle('');
        setFileUploadPercent(0);
        setLocalUpdateProcess('resolved');
        setCategories([]);
        onClose();
    };

    const handleChangeCategories = (event: React.ChangeEvent<{ value: unknown }>) => {
        setCategories(event.target.value as string[]);
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
                    const aspectRatio = pipe(
                        O.fromNullable(imagePreviewRef.current),
                        O.fold(
                            () => 1,
                            (image) => image.clientWidth / image.clientHeight
                        )
                    );
                    const newPost: Post = {
                        postId,
                        title: onePhotoTitle,
                        postedBy: sessionData.id,
                        postedByName: userIdentifier,
                        createdOn: now,
                        updatedOn: now,
                        comments: [],
                        fileName: photoRef.handle.name,
                        categories: [...categories, 'Todo'],
                        aspectRatio: aspectRatio,
                        //picPreview: photoRef.base64,
                        //fileUrl: uploadedPhoto.downloadUrl,
                        //storageBucket: uploadedPhoto.bucket,
                    };
                    const postedPhoto = await addPost(newPost, postId);
                    if (postedPhoto.status === 'failed') {
                        setOnePhotoMessage(O.some(postedPhoto.error));
                    } else {
                        const postRef: PostReference = {
                            postId,
                            postTitle: onePhotoTitle,
                            postedById: sessionData.id,
                            postedByName: userIdentifier,
                        };
                        const updateCategoriesProcess = await addPostReferenceToAllCategories(
                            [...categories, 'Todo'], //we add all post references to All by default.
                            postRef
                        );
                        if (updateCategoriesProcess.status === 'failed') {
                            console.log(updateCategoriesProcess.error);
                        }
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
                <div className="onePhoto">
                    <div className="upload">
                        <input
                            type="file"
                            id="files"
                            className="hidden"
                            accept="image/*"
                            ref={photoRef}
                            onChange={handleLoadPhoto}
                            onClick={(event) => {
                                //resets file on input
                                event.currentTarget.value = '';
                            }}
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
                            ref={imagePreviewRef}
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
                                            onChange={(value) => setOnePhotoTitle(value)}
                                            className="photoTitle"
                                            maxLength={120}
                                        />
                                        {categoryOptions.status === 'successful' ? (
                                            <Select
                                                multiple
                                                className="photoCategories"
                                                value={categories}
                                                onChange={handleChangeCategories}
                                                input={<Input />}
                                                renderValue={(selected) =>
                                                    (selected as string[]).join(', ')
                                                }
                                            >
                                                {categoryOptions.data.list.map(
                                                    (category: string, index) => (
                                                        <MenuItem
                                                            key={index}
                                                            value={category}
                                                        >
                                                            <Checkbox
                                                                checked={
                                                                    categories.indexOf(
                                                                        category
                                                                    ) > -1
                                                                }
                                                            />
                                                            <ListItemText
                                                                primary={category}
                                                            />
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Select>
                                        ) : null}
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
            </div>
        </div>
    );
};

export default CreatePost;
