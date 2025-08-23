import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  TextInput,
  Image,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { signUp } from '../services/authService';
import { createUserProfile } from '../services/userService';
import { useTheme } from '../context/ThemeContext';
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

  const handleAvatarUpload = () => {
    // In a real app, this would open image picker
    Alert.alert(
      'Upload Avatar',
      'Avatar upload functionality would be implemented here with image picker.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK' }
      ]
    );
  };

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

      const authUser = await signUp(email, password, displayName);

      await createUserProfile(authUser, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: formData.phone.trim(),
        dateOfBirth: formData.dateOfBirth,
        suburb: formData.suburb,
        city: formData.city,
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
      handleAvatarUpload={handleAvatarUpload}
      handleSignUp={handleSignUp}
      isLoading={isLoading}
    />
  );
}

