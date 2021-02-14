import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

//Interfaces

interface Comment {
    id: string;
    name: string;
    createdOn: number;
    text: string;
    textColor: string;
}

export interface Post {
    postId: string;
    title: string;
    postedBy: string;
    postedByName: string;
    createdOn: number;
    updatedOn: number;
    comments: Comment[];
    fileName: string;
    categories: string[];
    //picPreview: string;
    //fileUrl: string;
    //storageBucket: string;
}

interface UploadSuccess {
    status: 'successful';
    downloadUrl: string;
    bucket: string;
}

interface UploadFailure {
    status: 'failed';
    error: string;
}
interface PostSuccess {
    status: 'successful';
}

interface PostFailure {
    status: 'failed';
    error: string;
}
interface ImageUrlSuccess {
    status: 'successful';
    url: string;
}
interface ImageUrlFailure {
    status: 'failed';
    error: string;
}

//Functions

// function parseDoc(
//     doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
// ) {
//     const castedDoc = doc.data() as Post;
//     if (castedDoc) {
//         return { ...castedDoc, id: doc.id };
//     }
// }

const uploadFile = (
    file: File,
    identifier: string,
    setFileUploadPercent: React.Dispatch<React.SetStateAction<number>>
): Promise<UploadSuccess | UploadFailure> => {
    return new Promise((resolve, reject) => {
        const storageRef = firebase.storage().ref().child(`posts/${identifier}`);
        const uploadTask = storageRef.put(file);
        const bucket = storageRef.bucket;

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFileUploadPercent(progress);
            },
            (error) => {
                reject({ status: 'failed', error: `Error uploading ${error.message}` });
            },
            async () => {
                const downloadUrl: string = await uploadTask.snapshot.ref.getDownloadURL();
                resolve({ status: 'successful', downloadUrl, bucket });
            }
        );
    });
};

let db: firebase.firestore.Firestore;
function getDbInstance() {
    if (!db) {
        db = firebase.firestore();
    }
    return db;
}

const addPost = async (item: Post, id: string): Promise<PostSuccess | PostFailure> => {
    try {
        console.log('Adding post');
        const db = getDbInstance();
        await db.collection('posts').doc(id).set(item, { merge: true });
        return { status: 'successful' };
    } catch (e) {
        return { status: 'failed', error: `Error en post: ${e.message}` };
    }
};

const getPostImage = async (
    fileName: string
): Promise<ImageUrlSuccess | ImageUrlFailure> => {
    try {
        const ref = firebase.storage().ref().child(`posts/${fileName}`);
        const url: string = await ref.getDownloadURL();
        return { status: 'successful', url };
    } catch (e) {
        return { status: 'failed', error: `Error al obtener imagen: ${e.message}` };
    }
};

const getPosts = (): void => {
    console.log('getting posts');
};

// const updateUser = async (
//     item: PartialUserWithId,
//     id: string
// ): Promise<void | string> => {
//     console.log('Editing user');
//     const db = getDbInstance();
//     try {
//         await db.collection('users').doc(id).set(item, { merge: true });
//     } catch (e) {
//         console.log(e);
//         return `Error - ${e.message}`;
//     }
// };

// async function getUser(id: string): Promise<UserWithId | null | undefined> {
//     const db = getDbInstance();
//     console.log(`Getting user ${id} from users`);
//     const document = await db.collection('users').doc(id).get();
//     if (document.exists) {
//         return parseDoc(document);
//     }
//     return null;
// }

// async function getUsers(): Promise<UserWithId[] | string> {
//     const db = getDbInstance();
//     const results: UserWithId[] = [];
//     try {
//         await db
//             .collection('users')
//             .orderBy('createdOn')
//             .get()
//             .then(function (querySnapshot) {
//                 querySnapshot.forEach((doc) => {
//                     const data = parseDoc(doc);
//                     if (data) {
//                         results.push(data);
//                     }
//                 });
//             });
//         return results;
//     } catch (e) {
//         return `Error - ${e.message}`;
//     }
// }

export { addPost, uploadFile, getPostImage, getPosts };
