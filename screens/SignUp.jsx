import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { signUp } from '../services/authService';
import { createUserProfile } from '../services/userService';
import { uploadAvatarForUser } from '../services/imageUploadService';
import SignUpForm from '../components/SignUpForm';

export default function SignUp() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    avatar: require('../assets/idea.png')
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const { firstName, lastName, email, password } = formData;
      const displayName = `${firstName} ${lastName}`;

      // Create user account
      const authUser = await signUp(email, password, displayName);

      let photoURL = null;

      // Upload avatar if selected
      if (formData.avatar && formData.avatar.uri) {
        try {
          photoURL = await uploadAvatarForUser(authUser.uid, formData.avatar.uri);
          console.log('Avatar uploaded successfully:', photoURL);
        } catch (uploadError) {
          console.error('Avatar upload failed:', uploadError);
          // Continue with account creation even if avatar upload fails
          Alert.alert(
            'Warning',
            'Account created successfully, but avatar upload failed. You can update your avatar later in your profile.'
          );
        }
      }

      // Create user profile
      await createUserProfile(authUser, null, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: formData.phone.trim(),
        dateOfBirth: formData.dateOfBirth,
        suburb: formData.suburb,
        city: formData.city,
        photoURL: photoURL,
      });

      //Sign in process
      Alert.alert(
        'Success',
        'Account created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error) {
      console.error('Error signing up:', error);
      let errorMessage = 'Failed to create account.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already in use.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password must be at least 6 characters long.';
          break;
        default:
          errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignUpForm
      formData={formData}
      setFormData={setFormData}
      isPasswordVisible={isPasswordVisible}
      setIsPasswordVisible={setIsPasswordVisible}
      isConfirmPasswordVisible={isConfirmPasswordVisible}
      setIsConfirmPasswordVisible={setIsConfirmPasswordVisible}
      handleSignUp={handleSignUp}
      isLoading={isLoading}
    />
  );
}

