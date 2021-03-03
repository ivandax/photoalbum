import firebase from 'firebase/app';
import 'firebase/firestore';

//Interfaces

export interface CategoriesArray {
    list: string[];
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
    createdOn: number;
}

interface AsyncSuccess {
    status: 'successful';
}

interface AsyncFailure {
    status: 'failed';
    error: string;
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

async function addToCategoriesArray(
    newCategory: string
): Promise<AsyncSuccess | AsyncFailure> {
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

const addCategory = async (item: Category): Promise<AsyncSuccess | AsyncFailure> => {
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

async function addPostReferenceToCategory(
    category: string,
    postReference: PostReference
): Promise<AsyncSuccess | AsyncFailure> {
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

async function removePostReferenceFromCategory(
    category: string,
    postId: string
): Promise<AsyncSuccess | AsyncFailure> {
    const currentCategory = await getCategory(category);
    if (typeof currentCategory === 'string') {
        return {
            status: 'failed',
            error: 'Error obteniendo categoría para agregar referencia.',
        };
    } else {
        const currentReferences = currentCategory.postReferences;
        const newReferences = currentReferences.reduce(
            (soFar: PostReference[], currentRef: PostReference) =>
                currentRef.postId === postId ? soFar : [...soFar, currentRef],
            []
        );
        const db = getDbInstance();
        await db
            .collection('categories')
            .doc(category)
            .set({ postReferences: newReferences }, { merge: true });
        console.log('Eliminado de ' + category);
        return {
            status: 'successful',
        };
    }
}

async function addPostReferenceToAllCategories(
    categories: string[],
    postReference: PostReference
): Promise<AsyncSuccess | AsyncFailure> {
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
            error: 'No todas las categorías se han actualizado agregando el post ref',
        };
    }
}

async function removePostReferenceFromAllCategories(
    categories: string[],
    postId: string
): Promise<AsyncSuccess | AsyncFailure> {
    const processes = await Promise.all(
        categories.map(
            async (category) => await removePostReferenceFromCategory(category, postId)
        )
    );
    if (processes.every((result) => result.status === 'successful')) {
        return { status: 'successful' };
    } else {
        return {
            status: 'failed',
            error: 'No todas las categorías se han actualizado eliminando el post ref',
        };
    }
}

async function getCategories(): Promise<Category[] | string> {
    const db = getDbInstance();
    const categories: Category[] = [];
    try {
        await db
            .collection('categories')
            .orderBy('createdOn')
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach((doc) => {
                    const data = parseCategory(doc);
                    if (data) {
                        categories.push(data);
                    }
                });
            });
        return categories;
    } catch (e) {
        return `Error al traer categorías - ${e.message}`;
    }
}

function getRealTimeCategories(setCategoriesState: (data: Category[]) => void): void {
    console.log('getting realtime categories');
    const db = getDbInstance();
    db.collection('categories')
        .orderBy('createdOn', 'desc')
        .onSnapshot((querySnapshop) => {
            const categories = querySnapshop.docs.reduce((soFar: Category[], docSnap) => {
                const parsed = parseCategory(docSnap);
                if (parsed) {
                    return [...soFar, parsed];
                } else {
                    return soFar;
                }
            }, []);
            setCategoriesState(categories);
        });
}

export {
    getCategoriesArray,
    addCategory,
    addPostReferenceToAllCategories,
    removePostReferenceFromAllCategories,
    getCategories,
    getRealTimeCategories,
};
