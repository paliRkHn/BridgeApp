import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail as firebaseSendPasswordResetEmail,
    updateProfile,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
} from 'firebase/auth';
import { auth } from '../firebase';

export const signUp = async (email, password, displayName) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
// Claude dio: { displayName: displayName }
        await updateProfile(user, { displayName });
        
        return user;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
};

export const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
};

export const getCurrentUser = () => {
    return auth.currentUser;
};

export const getAuthState = (callback) => {
    return onAuthStateChanged(auth, callback);
};

export const sendPasswordResetEmail = async (email) => {
    try {
        await firebaseSendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
};

export const logOut = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
};
