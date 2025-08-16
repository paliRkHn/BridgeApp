import React, { useState, useEffect } from 'react';
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
import BottomNav from '../components/BottomNav';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function JobList() {
  const navigation = useNavigation();
  const [selectedClassification, setSelectedClassification] = useState('All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [elements, setElements] = useState([]);
  
  // Sample classifications
  const classifications = ['All', 'Physical', 'Social', 'Educational', 'Creative', 'Wellness'];
  
  // Fetch elements from Firestore (collection: 'jobs')
  useEffect(() => {
    const jobsCollection = collection(db, 'jobs');
    const unsubscribe = onSnapshot(jobsCollection, (snapshot) => {
      const fetchedElements = snapshot.docs.map((doc) => {
        const data = doc.data();
        const location = (data && (data.location || data.address)) || {};
        const resolvedSuburb = (location && (location.suburb || location.sub)) || data.suburb || '';
        const resolvedCity = (location && (location.city || location.town)) || data.city || '';
        return {
          id: doc.id,
          title: data.title || 'Untitled',
          logo: data.logo || 'https://via.placeholder.com/80x80/432272/FFFFFF?text=IMG',
          items: Array.isArray(data.items) ? data.items : [],
          classification: data.classification || 'All',
          saved: !!data.saved,
          company: data.company || '',
          category: data.category || '',
          jobType: data.jobType || '',
          suburb: resolvedSuburb,
          city: resolvedCity,
        };
      });
      setElements(fetchedElements);
    });
    return () => unsubscribe();
  }, []);

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
             <TouchableOpacity key={element.id} style={styles.elementContainer} onPress={() => navigation.navigate('JobDescription', { jobId: element.id })}>
              <View style={styles.elementItem}>
                <Image 
                  source={{ uri: element.logo }} 
                  style={styles.elementImage}
                  resizeMode="contain"
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
                    {!!element.company && (
                      <View style={styles.listItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.listItemText}>Company: {element.company}</Text>
                      </View>
                    )}
                    {!!element.category && (
                      <View style={styles.listItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.listItemText}>Category: {element.category}</Text>
                      </View>
                    )}
                    {!!element.jobType && (
                      <View style={styles.listItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.listItemText}>{element.jobType}</Text>
                      </View>
                    )}
                    
                  </View>
                </View>
                </View>
                {(!!element.suburb || !!element.city) && (
                    <View style={styles.listLocation}>
                      <View style={styles.bulletIcon}>
                        <Ionicons name="location-sharp" size={16} color="#432272" />
                      </View>
                      <Text style={styles.listLocationText}>
                        {`${element.suburb || ''}${element.suburb && element.city ? ', ' : ''}${element.city || ''}`}
                      </Text>
                    </View>
                  )}
               
             </TouchableOpacity>
           ))}
          </View>
        {/* Bottom spacer to avoid content under nav */}
        <View style={{ height: 90 }} />
      </ScrollView>
      <BottomNav />
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
  elementContainer: {
    flexDirection: 'column',
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    width: '100%',
  },
  elementItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 6,
    marginBottom: 2,
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
  listLocation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  listLocationText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bulletPoint: {
    fontSize: 16,
    color: '#432272',
    marginRight: 8,
    marginLeft: 4,
    marginTop: 0,
  },
  bulletIcon: {
    width: 16,
    height: 20,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});