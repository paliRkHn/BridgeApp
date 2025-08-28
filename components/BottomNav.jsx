import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function BottomNav() {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  
  // Get current route name for accessibility state
  const currentRouteName = route.name;

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Activity', { initialTab: 'Saved' })}
          accessible={true}
          accessibilityLabel="Saved Jobs"
          accessibilityHint="Navigate to your saved job listings and activity"
          accessibilityRole="tab"
          accessibilityState={{ selected: currentRouteName === 'Activity' }}
        >
          <Ionicons name="bookmark" size={25} color={theme.background} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Dashboard')}
          accessible={true}
          accessibilityLabel="Dashboard"
          accessibilityHint="Navigate to the main dashboard with job search and quick actions"
          accessibilityRole="tab"
          accessibilityState={{ selected: currentRouteName === 'Dashboard' }}
        >
          <Ionicons name="grid" size={25} color={theme.background} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Profile')}
          accessible={true}
          accessibilityLabel="Profile"
          accessibilityHint="Navigate to your profile to view and edit your information"
          accessibilityRole="tab"
          accessibilityState={{ selected: currentRouteName === 'Profile' }}
        >
          <Ionicons name="person" size={25} color={theme.background} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  safeArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: theme.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 50,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: theme.background,
  },
});


