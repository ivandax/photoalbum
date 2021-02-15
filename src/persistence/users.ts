import firebase from 'firebase/app';
import 'firebase/firestore';

//Interfaces

export interface UserWithId {
    name: string;
    email: string | null;
    role: string;
    createdOn: number;
    isAdmin: boolean;
    emailVerified: boolean;
    id: string;
}

export type PartialUserWithId = Partial<UserWithId>;

//Functions

function parseDoc(
    doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
) {
    const castedDoc = doc.data() as UserWithId;
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

const addUser = async (item: UserWithId, id: string): Promise<void> => {
    console.log('Adding user');
    const db = getDbInstance();
    await db.collection('users').doc(id).set(item, { merge: true });
};

const updateUser = async (
    item: PartialUserWithId,
    id: string
): Promise<void | string> => {
    console.log('Editing user');
    const db = getDbInstance();
    try {
        await db.collection('users').doc(id).set(item, { merge: true });
    } catch (e) {
        console.log(e);
        return `Error - ${e.message}`;
    }
};

async function getUser(id: string): Promise<UserWithId | null | undefined> {
    const db = getDbInstance();
    console.log(`Getting user ${id} from users`);
    const document = await db.collection('users').doc(id).get();
    if (document.exists) {
        return parseDoc(document);
    }
    return null;
}

async function getUsers(): Promise<UserWithId[] | string> {
    const db = getDbInstance();
    const users: UserWithId[] = [];
    try {
        await db
            .collection('users')
            .orderBy('createdOn')
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach((doc) => {
                    const data = parseDoc(doc);
                    if (data) {
                        users.push(data);
                    }
                });
            });
        return users;
    } catch (e) {
        return `Error - ${e.message}`;
    }
}

export { addUser, getUser, updateUser, getUsers };
