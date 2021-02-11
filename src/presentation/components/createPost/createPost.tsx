import React from 'react';

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

    const handlePost = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log('attempting to post');
    };

    return (
        <div className={`createPost ${isOpen === true ? 'show' : 'hide'}`}>
            <div className="content">
                <div className="options">
                    <div>Una foto</div>
                    <div>Muchas fotos</div>
                </div>
                <div>
                    <button>Subir foto</button>
                </div>
                <form onSubmit={handlePost}>
                    <div>
                        <button disabled>Publicar</button>
                        <button onClick={onClose}>Cerrar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
