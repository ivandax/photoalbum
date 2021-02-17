import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

//Interfaces

export interface Comment {
    postedById: string;
    postedByName: string;
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

function parsePost(
    doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
) {
    const castedDoc = doc.data() as Post;
    if (castedDoc) {
        return castedDoc;
    }
}

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

async function getPosts(): Promise<Post[] | string> {
    const db = getDbInstance();
    const posts: Post[] = [];
    try {
        await db
            .collection('posts')
            .get()
            .then((querySnapshop) => {
                querySnapshop.forEach((post) => {
                    const data = parsePost(post);
                    if (data) {
                        console.log(data);
                        posts.push(data);
                    }
                });
            });
        return posts;
    } catch (e) {
        return `Error cargando posts - ${e.message}`;
    }
}

function getRealTimePosts(
    setPostsState: React.Dispatch<React.SetStateAction<AsyncOp<Post[], string>>>
): void {
    const db = getDbInstance();
    db.collection('posts')
        .orderBy('updatedOn', 'desc')
        .onSnapshot((querySnapshop) => {
            try {
                const posts = querySnapshop.docs.reduce((soFar: Post[], docSnap) => {
                    const parsed = parsePost(docSnap);
                    if (parsed) {
                        return [...soFar, parsed];
                    } else {
                        return soFar;
                    }
                }, []);
                setPostsState({ status: 'successful', data: posts });
            } catch (e) {
                setPostsState({ status: 'failed', error: `Error obteniendo posts` });
            }
        });
}

const addComment = async (comment: Comment, id: string): Promise<void> => {
    try {
        console.log('Adding comment');
        const db = getDbInstance();
        const docData = await db.collection('posts').doc(id).get();
        const parsed = parsePost(docData);
        if (parsed !== undefined) {
            const comments = parsed.comments;
            const newComments = [...comments, comment];
            await db
                .collection('posts')
                .doc(id)
                .set(
                    { comments: newComments, updatedOn: comment.createdOn },
                    { merge: true }
                );
        }
    } catch (e) {
        console.log(e);
    }
};

export { addPost, uploadFile, getPostImage, getPosts, getRealTimePosts, addComment };
