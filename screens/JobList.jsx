import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  Switch
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function JobList() {
  const navigation = useNavigation();
  const [selectedClassification, setSelectedClassification] = useState('All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Sample classifications
  const classifications = ['All', 'Physical', 'Social', 'Educational', 'Creative', 'Wellness'];
  
  // Sample data elements
  const elements = [
    {
      id: 1,
      title: 'Morning Yoga Session',
      image: 'https://via.placeholder.com/80x80/432272/FFFFFF?text=YOGA',
      items: ['Improves flexibility and balance', 'Reduces stress and anxiety', 'Enhances mindfulness'],
      classification: 'Physical',
      saved: true
    },
    {
      id: 2,
      title: 'Community Art Workshop',
      image: 'https://via.placeholder.com/80x80/432272/FFFFFF?text=ART',
      items: ['Express creativity through painting', 'Connect with local artists', 'Learn new techniques'],
      classification: 'Creative',
      saved: false
    },
    {
      id: 3,
      title: 'Digital Skills Training',
      image: 'https://via.placeholder.com/80x80/432272/FFFFFF?text=SKILLS',
      items: ['Learn basic computer operations', 'Master social media platforms', 'Develop online safety awareness'],
      classification: 'Educational',
      saved: true
    },
    {
      id: 4,
      title: 'Social Coffee Meetup',
      image: 'https://via.placeholder.com/80x80/432272/FFFFFF?text=COFFEE',
      items: ['Build new friendships', 'Share experiences and stories', 'Practice conversation skills'],
      classification: 'Social',
      saved: false
    },
    {
      id: 5,
      title: 'Mindfulness Meditation',
      image: 'https://via.placeholder.com/80x80/432272/FFFFFF?text=MEDITATE',
      items: ['Reduce stress and anxiety', 'Improve focus and concentration', 'Enhance emotional well-being'],
      classification: 'Wellness',
      saved: true
    },
    {
      id: 6,
      title: 'Gardening Club',
      image: 'https://via.placeholder.com/80x80/432272/FFFFFF?text=GARDEN',
      items: ['Learn plant care techniques', 'Connect with nature', 'Share gardening tips'],
      classification: 'Creative',
      saved: false
    }
  ];

  const goBack = () => {
    navigation.goBack();
  };

  // Filter elements based on selected classification and saved toggle
  const filteredElements = elements.filter(element => {
    const matchesClassification = selectedClassification === 'All' || element.classification === selectedClassification;
    const matchesSaved = !showSavedOnly || element.saved;
    return matchesClassification && matchesSaved;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Classifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Filters Section */}
        <View style={styles.filtersContainer}>
          {/* Dropdown */}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity 
              style={styles.dropdownButton} 
              onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Text style={styles.dropdownButtonText}>{selectedClassification}</Text>
              <Text style={styles.dropdownArrow}>{isDropdownOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            
            {isDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {classifications.map((classification, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedClassification(classification);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      selectedClassification === classification && styles.selectedItem
                    ]}>
                      {classification}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Toggle */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Saved Only</Text>
            <Switch
              value={showSavedOnly}
              onValueChange={setShowSavedOnly}
              trackColor={{ false: '#e0e0e0', true: '#432272' }}
              thumbColor={showSavedOnly ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

                 {/* Elements List */}
         <View style={styles.elementsContainer}>
           {filteredElements.map((element) => (
             <TouchableOpacity key={element.id} style={styles.elementItem} onPress={() => navigation.navigate('JobDescription')}>
              <Image 
                source={{ uri: element.image }} 
                style={styles.elementImage}
                resizeMode="cover"
              />
              <View style={styles.elementContent}>
                <Text style={styles.elementTitle}>{element.title}</Text>
                <View style={styles.elementList}>
                  {element.items.map((item, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.listItemText}>{item}</Text>
                    </View>
                  ))}
                </View>
               </View>
             </TouchableOpacity>
           ))}
         </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#432272',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#432272',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    margin: 16,
    borderRadius: 12,
  },
  dropdownContainer: {
    flex: 1,
    marginRight: 16,
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 4,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedItem: {
    color: '#432272',
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  elementsContainer: {
    paddingHorizontal: 20,
  },
  elementItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  elementImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  elementContent: {
    flex: 1,
  },
  elementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  elementList: {
    marginTop: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#432272',
    marginRight: 8,
    marginTop: 2,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});