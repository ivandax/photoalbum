import firebase from 'firebase/app';
import 'firebase/firestore';

//Interfaces

export interface User {
    name: string;
    email: string | null;
    role: string;
    createdOn: number;
    isAdmin: boolean;
}

export interface UserWithId extends User {
    id: string;
}

//Functions

function parseDoc(
    doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
) {
    const castedDoc = doc.data() as UserWithId
    if (castedDoc) {
        return { ...castedDoc, id: doc.id };
    }
}

let db: firebase.firestore.Firestore;
function getDbInstance() {
    if (!db) {
        db = firebase.firestore();
    }
    return db;
}

const addUser = async (item: User, id: string) => {
    console.log('Adding or modifying user data');
    const db = getDbInstance();
    await db.collection('users').doc(id).set(item, { merge: true });
};

async function getUser(id: string) {
    const db = getDbInstance();
    console.log(`Getting user ${id} from users`);
    const document = await db.collection('users').doc(id).get();
    if (document.exists) {
        return parseDoc(document);
    }
    return null;
}

export { addUser, getUser };
