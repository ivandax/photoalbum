import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

//Interfaces

export interface Comment {
    commentId: string;
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
    aspectRatio: number;
    //picPreview: string;
    //fileUrl: string;
    //storageBucket: string;
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
interface UploadSuccess {
    status: 'successful';
    downloadUrl: string;
    bucket: string;
}
interface UploadFailure {
    status: 'failed';
    error: string;
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

interface PostSuccess {
    status: 'successful';
}

interface PostFailure {
    status: 'failed';
    error: string;
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

interface ImageUrlSuccess {
    status: 'successful';
    url: string;
}
interface ImageUrlFailure {
    status: 'failed';
    error: string;
}

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

async function deleteImage(fileName: string): Promise<void> {
    const ref = firebase.storage().ref().child(`posts/${fileName}`);
    await ref.delete();
}

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

function getRealTimePosts(setPostsState: (data: Post[]) => void): void {
    console.log('getting realtime posts');
    const db = getDbInstance();
    db.collection('posts')
        .orderBy('createdOn', 'desc')
        .onSnapshot((querySnapshop) => {
            const posts = querySnapshop.docs.reduce((soFar: Post[], docSnap) => {
                const parsed = parsePost(docSnap);
                if (parsed) {
                    return [...soFar, parsed];
                } else {
                    return soFar;
                }
            }, []);
            setPostsState(posts);
        });
}

const deletePost = async (id: string, fileName: string): Promise<void | string> => {
    try {
        console.log('Deleting post');
        const db = getDbInstance();
        await db.collection('posts').doc(id).delete();
        await deleteImage(fileName);
    } catch (e) {
        return 'No hemos podido borrar el post';
    }
};

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

const deleteComment = async (commentId: string, postId: string): Promise<void> => {
    try {
        console.log('Deleting comment');
        const db = getDbInstance();
        const docData = await db.collection('posts').doc(postId).get();
        const parsed = parsePost(docData);
        if (parsed !== undefined) {
            const comments = parsed.comments;
            const newComments = [...comments].filter(
                (comment) => comment.commentId !== commentId
            );
            await db
                .collection('posts')
                .doc(postId)
                .set({ comments: newComments, updatedOn: +new Date() }, { merge: true });
        }
    } catch (e) {
        console.log(e);
    }
};

export {
    addPost,
    uploadFile,
    getPostImage,
    getPosts,
    getRealTimePosts,
    addComment,
    deleteComment,
    deletePost,
};
