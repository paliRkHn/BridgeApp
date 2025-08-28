import { StyleSheet, View, Image, TextInput, Button, TouchableOpacity, Text, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Static default theme for Login screen (unaffected by theme changes)
const defaultTheme = {
  background: '#FFFFFF',
  text: '#333333',
  primary: '#432272',
  secondary: '#666666',
  card: '#f8f9fa',
  border: '#e0e0e0'
};

export default function Login() {
  const navigation = useNavigation();
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(username, password);
      // Save credentials if "Remember Me" is checked
      await saveCredentials(username, password, rememberMe);
      navigation.replace('Dashboard');
    } catch (error) {
      Alert.alert('Sign In Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Load saved credentials on component mount
  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedCredentials = await AsyncStorage.getItem('savedCredentials');
      if (savedCredentials) {
        const { username: savedUsername, password: savedPassword, rememberMe: savedRememberMe } = JSON.parse(savedCredentials);
        setUsername(savedUsername || '');
        setPassword(savedPassword || '');
        setRememberMe(savedRememberMe || false);
      }
    } catch (error) {
      console.error('Error loading saved credentials:', error);
    }
  };

  const saveCredentials = async (username, password, rememberMe) => {
    try {
      if (rememberMe) {
        await AsyncStorage.setItem('savedCredentials', JSON.stringify({
          username,
          password,
          rememberMe: true
        }));
      } else {
        await AsyncStorage.removeItem('savedCredentials');
      }
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };



  const styles = getStyles(defaultTheme);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
                 <View style={styles.bannerContainer}>
           <Image
             source={require('../assets/logo_square.png')}
             style={styles.image}
             resizeMode="cover"
             accessible={true}
             accessibilityLabel="Bridge App Logo"
             accessibilityRole="image"
           />
         </View>
         
         <View style={styles.spacer} />
         
         <TextInput
          style={styles.input}
          placeholder="Email"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          accessible={true}
          accessibilityLabel="Email address"
          accessibilityHint="Enter your email address to sign in"
          accessibilityRole="text"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            returnKeyType="done"
            onSubmitEditing={handleSignIn}
            accessible={true}
            accessibilityLabel="Password"
            accessibilityHint="Enter your password to sign in"
            accessibilityRole="text"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={togglePasswordVisibility}
            accessible={true}
            accessibilityLabel={isPasswordVisible ? "Hide password" : "Show password"}
            accessibilityHint={isPasswordVisible ? "Tap to hide your password" : "Tap to show your password"}
            accessibilityRole="button"
          >
            {isPasswordVisible ? 
              <MaterialIcons name="visibility" size={24} color="black" /> : 
              <MaterialIcons name="visibility-off" size={24} color="black" />
            }
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            title={isLoading ? "Signing In..." : "Sign In"} 
            onPress={handleSignIn} 
            color={defaultTheme.primary}
            disabled={isLoading}
          />
        </View>

        {/* Remember Me and Forgot Password Row */}
        <View style={styles.rememberMeContainer}>
          <View style={styles.rememberMeRow}>
            <TouchableOpacity 
              style={styles.checkboxContainer} 
              onPress={toggleRememberMe}
              accessible={true}
              accessibilityLabel={`Remember me, ${rememberMe ? 'checked' : 'unchecked'}`}
              accessibilityHint="Tap to toggle remembering your login credentials"
              accessibilityRole="checkbox"
              accessibilityState={{ checked: rememberMe }}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && (
                  <MaterialIcons name="check" size={14} color="white" />
                )}
              </View>
              <Text style={styles.rememberMeText}>Remember Me</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => Alert.alert('Forgot Password', 'Password reset functionality will be implemented here.')}
              accessible={true}
              accessibilityLabel="Forgot Password"
              accessibilityHint="Tap to reset your password"
              accessibilityRole="button"
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('SignUp')}
            accessible={true}
            accessibilityLabel="Sign up for new account"
            accessibilityHint="Tap to create a new account"
            accessibilityRole="button"
          >
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  bannerContainer: {
    height: '35%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: theme.primary,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    zIndex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  image: {
    marginBottom: 30,
    width: 170,
    height: 170,
    borderRadius: 20,
  },
  spacer: {
    minHeight: '45%',
  },
  input: {
    width: '100%',
    maxWidth: 350,
    height: 48,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: theme.card,
    fontSize: 16,
  },
  passwordContainer: {
    width: '100%',
    maxWidth: 350,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 24,
    backgroundColor: theme.card,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rememberMeContainer: {
    width: '100%',
    maxWidth: 350,
    marginTop: 20,
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: theme.primary,
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: theme.primary,
  },
  rememberMeText: {
    fontSize: 14,
    color: '#666',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#432272',
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 350,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 24,
    overflow: 'hidden',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginTop: 45,
    width: '100%',
  },
  signUpText: {
    fontSize: 14,
    color: '#666',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  signUpLink: {
    fontSize: 16,
    color: '#432272',
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#432272',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
});
