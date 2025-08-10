import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import Starter from './screens/Starter';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import Activity from './screens/Activity';
import JobList from './screens/JobList';
import JobDescription from './screens/JobDescription';
import Profile from './screens/Profile';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Starter" component={Starter} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Activity" component={Activity} />
        <Stack.Screen name="JobList" component={JobList} />
        <Stack.Screen name="JobDescription" component={JobDescription} />
        <Stack.Screen name="Profile" component={Profile} />
        


      </Stack.Navigator>
    </NavigationContainer>
  );
}


