import firebase from 'firebase/app';
import 'firebase/auth';

//INTERFACES

type AuthObserverCallback = (a: firebase.User | null) => void;

//FUNCTIONS

async function signup(
    email: string,
    password: string
): Promise<string | null | undefined> {
    const createResult = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
    if (createResult) {
        const auth = firebase.auth();
        if (auth !== null) {
            if (auth.currentUser !== null) {
                auth.currentUser.sendEmailVerification();
                return auth.currentUser.email;
            }
        }
    }
}

function logout(): void {
    firebase.auth().signOut();
}

function registerAuthObserver(callback: AuthObserverCallback): firebase.Unsubscribe {
    return firebase.auth().onAuthStateChanged(callback);
}

async function login(email: string, password: string): Promise<string | undefined> {
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch(e) {
        console.log(e)
        return "Error al iniciar sesión";
    }
}

async function recoverUserPassword(address: string): Promise<string> {
    let resolution = '';
    await firebase
        .auth()
        .sendPasswordResetEmail(address)
        .then(function () {
            resolution =
                'Revise su correo. Hemos enviado un mail de recuperación de contraseña';
        })
        .catch(function () {
            resolution = 'Error en la dirección de correo. Por favor, revise el formato.';
        });
    return resolution;
}

export { signup, logout, login, registerAuthObserver, recoverUserPassword };
