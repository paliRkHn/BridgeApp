import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Dashboard() {
  const navigation = useNavigation();
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        autoCapitalize="none"
      />
      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.squareButton} onPress={() => navigation.navigate('JobList')}>
          <Image source={require('../assets/mobile.png')} style={styles.buttonIcon} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.squareButton}>
          <Image source={require('../assets/bookmark.png')} style={styles.buttonIcon} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.squareButton}>
          <Image source={require('../assets/papers.png')} style={styles.buttonIcon} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.squareButton} onPress={() => navigation.navigate('Profile')}>
          <Image source={require('../assets/user.png')} style={styles.buttonIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>
      <View style={styles.columnContainer}>
        <TouchableOpacity style={styles.rectButton} onPress={() => navigation.navigate('Activity')}>
          <Image source={require('../assets/time.png')} style={styles.longButtonIcon} resizeMode="contain" />
          <Text style={styles.buttonText}>Activity</Text></TouchableOpacity>
        <TouchableOpacity style={styles.rectButton}>
          <Image source={require('../assets/settings.png')} style={styles.longButtonIcon } resizeMode="contain" />
          <Text style={styles.buttonText}>Settings</Text></TouchableOpacity>
        <TouchableOpacity style={styles.rectButton}>
          <Image source={require('../assets/question.png')} style={styles.longButtonIcon} resizeMode="contain" />
          <Text style={styles.buttonText}>Help</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  searchBar: {
    width: '100%',
    maxWidth: 400,
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    marginBottom: 24,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    marginBottom: 32,
  },
  squareButton: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#432272',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  columnContainer: {
    width: '100%',
    maxWidth: 400,
  },
  rectButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#432272',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    width: 90,
    height: 90,
    tintColor: '#fff',
  },
  longButtonIcon: {
    width: 40,
    height: 40,
    tintColor: '#fff',
  },
});
