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
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import AvatarUpload from './AvatarUpload';

// Static default theme for SignUp screen (unaffected by theme changes)
const defaultTheme = {
  background: '#FFFFFF',
  text: '#333333',
  primary: '#432272',
  secondary: '#666666',
  card: '#f8f9fa',
  border: '#e0e0e0'
};

export default function SignUpForm({ 
  formData, 
  setFormData, 
  isPasswordVisible, 
  setIsPasswordVisible, 
  isConfirmPasswordVisible, 
  setIsConfirmPasswordVisible,
  handleSignUp,
  isLoading = false
}) {
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  // Handle avatar changes from AvatarUpload component
  const handleAvatarChange = (newAvatar) => {
    setFormData(prev => ({
      ...prev,
      avatar: newAvatar
    }));
  };

  const styles = getStyles(defaultTheme);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: defaultTheme.primary }]}>Sign Up</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <AvatarUpload
            avatar={formData.avatar}
            onAvatarChange={handleAvatarChange}
            size={120}
            showUploadButton={true}
            style={styles.avatarUploadContainer}
          />
        </View>

        {/* Registration Form */}
        <View style={styles.formContainer}>
          {/* Name Fields */}
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <Text style={[styles.label, { color: defaultTheme.text }]}>First Name *</Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: defaultTheme.secondary,
                  backgroundColor: defaultTheme.background,
                  color: defaultTheme.text
                }]}
                value={formData.firstName}
                onChangeText={(text) => setFormData({...formData, firstName: text})}
                placeholder="Enter first name"
                placeholderTextColor="#999"
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
            <View style={styles.nameField}>
              <Text style={[styles.label, { color: defaultTheme.text }]}>Last Name *</Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: defaultTheme.secondary,
                  backgroundColor: defaultTheme.background,
                  color: defaultTheme.text
                }]}
                value={formData.lastName}
                onChangeText={(text) => setFormData({...formData, lastName: text})}
                placeholder="Enter last name"
                placeholderTextColor="#999"
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: defaultTheme.text }]}>Email Address *</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: defaultTheme.secondary,
                backgroundColor: defaultTheme.background,
                color: defaultTheme.text
              }]}
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              placeholder="Enter email address"
              placeholderTextColor={defaultTheme.secondary}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>

          {/* Password Field */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: defaultTheme.text }]}>Password *</Text>
            <View style={[styles.passwordContainer, { 
              borderColor: defaultTheme.secondary,
              backgroundColor: defaultTheme.background
            }]}>
              <TextInput
                style={[styles.passwordInput, { color: defaultTheme.text }]}
                value={formData.password}
                onChangeText={(text) => setFormData({...formData, password: text})}
                placeholder="Enter password"
                placeholderTextColor="#999"
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                returnKeyType="next"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <View style={styles.eyeButtonText}>
                  {isPasswordVisible ? <MaterialIcons name="visibility" size={24} color="black" /> : <MaterialIcons name="visibility-off" size={24} color="black" />}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Field */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: defaultTheme.text }]}>Confirm Password *</Text>
            <View style={[styles.passwordContainer, { 
              borderColor: defaultTheme.secondary,
              backgroundColor: defaultTheme.background
            }]}>
              <TextInput
                style={[styles.passwordInput, { color: defaultTheme.text }]}
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                placeholder="Confirm password"
                placeholderTextColor="#999"
                secureTextEntry={!isConfirmPasswordVisible}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleSignUp}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              >
                <View style={styles.eyeButtonText}>
                  {isConfirmPasswordVisible ? <MaterialIcons name="visibility" size={24} color="black" /> : <MaterialIcons name="visibility-off" size={24} color="black" />}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms and Conditions */}
          <View style={styles.termsContainer}>
            <Text style={[styles.termsText, { color: defaultTheme.secondary }]}>
              By signing up, you agree to our{' '}
              <Text style={[styles.linkText, { color: defaultTheme.primary }]}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={[styles.linkText, { color: defaultTheme.primary }]}>Privacy Policy</Text>
            </Text>
          </View>
        </View>

        {/* Sign Up Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.signUpButton, { backgroundColor: defaultTheme.primary }]} 
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text style={styles.signUpButtonText}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, { color: defaultTheme.secondary }]}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.loginLink, { color: defaultTheme.primary }]}>Log In</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: defaultTheme.background,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: defaultTheme.border,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: defaultTheme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backButtonText: {
      color: defaultTheme.background,
      fontSize: 20,
      fontWeight: 'bold',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: defaultTheme.primary,
    },
    placeholder: {
      width: 40,
    },
    scrollView: {
      flex: 1,
    },
    avatarSection: {
      alignItems: 'center',
      paddingVertical: 24,
    },
    avatarUploadContainer: {
      marginBottom: 0,
    },
    formContainer: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      gap: 10,
    },
    nameRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    nameField: {
      flex: 1,
    },
    fieldContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: defaultTheme.text,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      backgroundColor: '#f9f9f9',
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 8,
      backgroundColor: '#f9f9f9',
    },
    passwordInput: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
    },
    eyeButton: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    eyeButtonText: {
      fontSize: 20,
    },
    termsContainer: {
      marginTop: 8,
      marginBottom: 24,
    },
    termsText: {
      fontSize: 14,
      color: '#666',
      lineHeight: 20,
    },
    linkText: {
      color: '#432272',
      fontWeight: '600',
    },
    buttonContainer: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    signUpButton: {
      backgroundColor: '#432272',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    signUpButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 24,
    },
    loginText: {
      fontSize: 16,
      color: '#666',
    },
    loginLink: {
      fontSize: 16,
      color: '#432272',
      fontWeight: '600',
    },
  });
  