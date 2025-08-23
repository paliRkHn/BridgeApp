import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { signUp, signIn, logOut, sendPasswordResetEmail } from '../services/authService';
import { getUserProfile, updateUserProfile, createUserProfile } from '../services/userService';

import { auth } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                setUser(authUser);
                try {
                  const profile = await getUserProfile(authUser.uid);  
                  setUserProfile(profile);


                } catch (error) {
                    console.error('Error getting user profile:', error);
                }
            } else {
                setUser(null);
                setUserProfile(null);
            }
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);



    const value = {
        user,
        userProfile,
        isLoading,
        isAuthenticated: !!user,
        refreshUserProfile: async () => {
            if (user) {
                const profile = await getUserProfile(user.uid);
                setUserProfile(profile);
            }
        },
        signUp,
        signIn,
        logOut,
        sendPasswordResetEmail,
        updateUserProfile,
        createUserProfile,

    };

    return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
    );
};