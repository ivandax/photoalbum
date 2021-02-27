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

export interface PostReference {
    postId: string;
    postTitle: string;
    postedById: string;
    postedByName: string;
}

//Functions

function parseCategoriesArray(
    doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
) {
    const castedDoc = doc.data() as CategoriesArray;
    return castedDoc;
}

function parseCategory(
    doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
) {
    const castedDoc = doc.data() as Category;
    return castedDoc;
}

let db: firebase.firestore.Firestore;
function getDbInstance() {
    if (!db) {
        db = firebase.firestore();
    }
    return db;
}

async function getCategoriesArray(): Promise<CategoriesArray | string> {
    const db = getDbInstance();
    console.log(`Getting category array`);
    try {
        const document = await db.collection('categoriesArray').doc('mainArray').get();
        const parsed = parseCategoriesArray(document);
        return parsed;
    } catch (e) {
        return `Error obteniendo array de categorias ${e.message}`;
    }
}

interface AddToCategoriesArraySuccess {
    status: 'successful';
}

interface AddToCategoriesArrayFailure {
    status: 'failed';
    error: string;
}

async function addToCategoriesArray(
    newCategory: string
): Promise<AddToCategoriesArraySuccess | AddToCategoriesArrayFailure> {
    try {
        const currentCategories = await getCategoriesArray();
        if (typeof currentCategories !== 'string') {
            if (currentCategories.list.indexOf(newCategory) > -1) {
                return { status: 'failed', error: 'Error. Categoría ya existe' };
            } else {
                const db = getDbInstance();
                await db
                    .collection('categoriesArray')
                    .doc('mainArray')
                    .set({ list: [...currentCategories.list, newCategory] });
                return { status: 'successful' };
            }
        } else {
            return {
                status: 'failed',
                error: 'Error al obtener la lista de categorías actuales',
            };
        }
    } catch (e) {
        return {
            status: 'failed',
            error: 'Error procesando el agregar a lista de categorías',
        };
    }
}

interface CategorySuccess {
    status: 'successful';
}

interface CategoryFailure {
    status: 'failed';
    error: string;
}

const addCategory = async (
    item: Category
): Promise<CategorySuccess | CategoryFailure> => {
    try {
        const addToCategoriesArrayProcess = await addToCategoriesArray(item.name);
        if (addToCategoriesArrayProcess.status === 'successful') {
            console.log('Adding category');
            const db = getDbInstance();
            await db.collection('categories').doc(item.name).set(item, { merge: true });
            return { status: 'successful' };
        } else {
            return {
                status: 'failed',
                error: 'Error en proceso de actualizar listado de categorías',
            };
        }
    } catch (e) {
        return { status: 'failed', error: `Error en post: ${e.message}` };
    }
};

async function getCategory(category: string): Promise<string | Category> {
    const db = getDbInstance();
    console.log(`Getting array`);
    try {
        const document = await db.collection('categories').doc(category).get();
        const parsed = parseCategory(document);
        return parsed;
    } catch (e) {
        return `Error obteniendo categoría ${e.message}`;
    }
}

interface AddPostReferenceToCategorySuccess {
    status: 'successful';
}

interface AddPostReferenceToCategoryFailure {
    status: 'failed';
    error: string;
}

async function addPostReferenceToCategory(
    category: string,
    postReference: PostReference
): Promise<AddPostReferenceToCategorySuccess | AddPostReferenceToCategoryFailure> {
    const currentCategory = await getCategory(category);
    if (typeof currentCategory === 'string') {
        return {
            status: 'failed',
            error: 'Error obteniendo categoría para agregar referencia.',
        };
    } else {
        const currentReferences = currentCategory.postReferences;
        const db = getDbInstance();
        await db
            .collection('categories')
            .doc(category)
            .set(
                { postReferences: [...currentReferences, postReference] },
                { merge: true }
            );
        console.log('Añadido a ' + category);
        return {
            status: 'successful',
        };
    }
}

interface AllPostReferencesAddedSuccess {
    status: 'successful';
}

interface AllPostReferencesAddedyFailure {
    status: 'failed';
    error: string;
}

async function addPostReferenceToAllCategories(
    categories: string[],
    postReference: PostReference
): Promise<AllPostReferencesAddedSuccess | AllPostReferencesAddedyFailure> {
    const processes = await Promise.all(
        categories.map(
            async (category) => await addPostReferenceToCategory(category, postReference)
        )
    );
    if (processes.every((result) => result.status === 'successful')) {
        return { status: 'successful' };
    } else {
        return {
            status: 'failed',
            error: 'No todas las categorías se han actualizado con el post.',
        };
    }
}

export { getCategoriesArray, addCategory, addPostReferenceToAllCategories };
