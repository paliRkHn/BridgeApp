import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from './context/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';

import Starter from './screens/Starter';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Dashboard from './screens/Dashboard';
import Activity from './screens/Activity';
import JobList from './screens/JobList';
import JobDescription from './screens/JobDescription';
import Profile from './screens/Profile';
import Templates from './screens/Templates';
import TextEditor from './components/TextEditor';
import UserSettings from './screens/UserSettings';
import HelpForm from './screens/HelpForm';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Starter" component={Starter} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="SignUp" component={SignUp} />
              <Stack.Screen name="Dashboard" component={Dashboard} />
              <Stack.Screen name="Activity" component={Activity} />
              <Stack.Screen name="JobList" component={JobList} />
              <Stack.Screen name="JobDescription" component={JobDescription} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="Templates" component={Templates} />
              <Stack.Screen name="TextEditor" component={TextEditor} />
              <Stack.Screen name="UserSettings" component={UserSettings} />
              <Stack.Screen name="HelpForm" component={HelpForm} />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}


