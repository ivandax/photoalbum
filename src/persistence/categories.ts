import firebase from 'firebase/app';
import 'firebase/firestore';

//Interfaces

export interface CategoriesArray {
    list: string[];
    createdOn: number;
}

export interface Category {
    postReferences: PostReference[];
    createdOn: number;
    name: string;
    categoryId: string;
}

interface PostReference {
    postId: string;
    postTitle: string;
    postedById: string;
    postedByName: string;
}

//Functions

function parseDoc(
    doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
) {
    const castedDoc = doc.data() as CategoriesArray;
    if (castedDoc) {
        return castedDoc;
    }
}

let db: firebase.firestore.Firestore;
function getDbInstance() {
    if (!db) {
        db = firebase.firestore();
    }
    return db;
}

async function getCategoriesArray(): Promise<CategoriesArray | string | undefined> {
    const db = getDbInstance();
    console.log(`Getting category array`);
    try {
        const document = await db.collection('categoriesArray').doc('mainArray').get();
        if (document.exists) {
            const parsed = parseDoc(document);
            if (parsed !== undefined) {
                return parsed;
            }
        }
    } catch (e) {
        return `Error obteniendo array de categorias ${e.message}`;
    }
}

export { getCategoriesArray };
