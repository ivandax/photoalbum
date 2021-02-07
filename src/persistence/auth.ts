import firebase from 'firebase/app';
import 'firebase/auth';

//INTERFACES

type AuthObserverCallback = (a: firebase.User | null) => void;

//FUNCTIONS

async function signup(email: string, password: string): Promise<string | undefined> {
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch (e) {
        console.log(e);
        return `Error al crear la cuenta - ${e.message}`;
    }
}

async function sendEmailValidation(): Promise<string | undefined> {
    try {
        await firebase.auth().currentUser?.sendEmailVerification();
    } catch (e) {
        console.log(e);
        return `Error al enviar el email de validación - ${e.message}`;
    }
}

async function login(email: string, password: string): Promise<string | undefined> {
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (e) {
        console.log(e);
        return `Error al iniciar sesión - ${e.message}`;
    }
}

function logout(): void {
    firebase.auth().signOut();
}

function registerAuthObserver(callback: AuthObserverCallback): firebase.Unsubscribe {
    return firebase.auth().onAuthStateChanged(callback);
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

export {
    signup,
    sendEmailValidation,
    logout,
    login,
    registerAuthObserver,
    recoverUserPassword,
};
