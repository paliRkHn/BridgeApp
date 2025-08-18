import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BottomNav() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Image
            source={require('../assets/dashboard.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Activity', { initialTab: 'Saved' })}
        >
          <Image
            source={require('../assets/favorite.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image
            source={require('../assets/user.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#432272',
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
    tintColor: '#fff',
  },
});


