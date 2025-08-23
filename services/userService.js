import { db } from '../firebase';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export const createUserProfile = async (authUser, googleUser, additionalData = {}) => {
    if (!authUser) return;

    try {
        const userRef = doc(db, 'users', authUser.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            const {displayName, email, photoURL, providerData} = authUser;
            

            let firstName = additionalData.firstName || '';
            let lastName = additionalData.lastName || '';



            await setDoc(userRef, {
                displayName: displayName || '',
                email: email || '',
                photoURL: photoURL || null,
                firstName: additionalData.firstName || '',
                lastName: additionalData.lastName || '',
                phone: additionalData.phone || '',
                dateOfBirth: additionalData.dateOfBirth || '',
                suburb: additionalData.suburb || '',
                city: additionalData.city || '',
                state: additionalData.state || '',
                notifications: {
                    email: false,
                    push: true,
                    jobAlerts: true,
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                isActive: true,
                ...additionalData,
            });

            console.log('User profile created successfully');
        } else {
            console.log('User profile already exists');
            await updateDoc(userRef, {
                updatedAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                // Update photo if it's a Google user and photo changed
                ...(authUser.photoURL && { photoURL: authUser.photoURL }),
            });

            console.log('User profile updated successfully');
        }

        return userRef;
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
    }
};

export const getUserProfile = async (uid) => {
    try {
        const userRef = doc(db, 'users', uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
            return { id: userSnapshot.id, ...userSnapshot.data() };
        } else {
            console.log('User profile not found');
            return null;
        }
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
};

export const updateUserProfile = async (uid, updateData) => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            ...updateData,
            updatedAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
        });
        console.log('User profile updated successfully');
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};