import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, Text } from 'react-native';
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
        <TouchableOpacity style={styles.squareButton} onPress={() => navigation.navigate('JobList')}><Text style={styles.buttonText}>Button 1</Text></TouchableOpacity>
        <TouchableOpacity style={styles.squareButton}><Text style={styles.buttonText}>Button 2</Text></TouchableOpacity>
        <TouchableOpacity style={styles.squareButton}><Text style={styles.buttonText}>Button 3</Text></TouchableOpacity>
        <TouchableOpacity style={styles.squareButton}><Text style={styles.buttonText}>Button 4</Text></TouchableOpacity>
      </View>
      <View style={styles.columnContainer}>
        <TouchableOpacity style={styles.rectButton} onPress={() => navigation.navigate('Activity')}><Text style={styles.buttonText}>Wide Button 1</Text></TouchableOpacity>
        <TouchableOpacity style={styles.rectButton}><Text style={styles.buttonText}>Wide Button 2</Text></TouchableOpacity>
        <TouchableOpacity style={styles.rectButton}><Text style={styles.buttonText}>Wide Button 3</Text></TouchableOpacity>
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
});
