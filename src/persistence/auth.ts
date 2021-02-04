import firebase from 'firebase/app';
import 'firebase/auth';

//INTERFACES

type AuthObserverCallback = (a: firebase.User | null) => void;

//FUNCTIONS

async function signup(email: string, password: string) {
    const createResult = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
    if (createResult) {
        const auth = firebase.auth();
        if (auth !== null) {
            if (auth.currentUser !== null) {
                auth.currentUser.sendEmailVerification();
                return auth.currentUser.email
            }
        }
    }
}

function logout() {
    firebase.auth().signOut();
}

function registerAuthObserver(callback: AuthObserverCallback) {
    return firebase.auth().onAuthStateChanged(callback);
}

async function login(email: string, password: string) {
    try {
        const result = await firebase.auth().signInWithEmailAndPassword(email, password);
        if (result.user !== null) {
            return result.user.uid;
        }
    } catch (error) {
        return error;
    }
}

async function recoverUserPassword(address: string) {
    let resolution = '';
    await firebase
        .auth()
        .sendPasswordResetEmail(address)
        .then(function () {
            resolution =
                'Revise su correo. Hemos enviado un mail de recuperación de contraseña';
        })
        .catch(function (error) {
            resolution = 'Error en la dirección de correo. Por favor, revise el formato.';
        });
    return resolution;
}

export { signup, logout, login, registerAuthObserver, recoverUserPassword };
