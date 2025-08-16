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
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function JobList() {
  const navigation = useNavigation();
  const [selectedClassification, setSelectedClassification] = useState('All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [elements, setElements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // Fetch categories (and subcategories) from Firestore (collection: 'categories')
  useEffect(() => {
    const categoriesCollection = collection(db, 'categories');
    const unsubscribe = onSnapshot(categoriesCollection, (snapshot) => {
      const items = snapshot.docs.map((doc) => {
        const data = doc.data() || {};
        const nameCandidate = data.name || data.title || data.label || '';
        const name = typeof nameCandidate === 'string' && nameCandidate.trim() !== '' ? nameCandidate.trim() : doc.id;
        const subcategoriesArray = Array.isArray(data.subcategories) ? data.subcategories : [];
        const subcategories = subcategoriesArray
          .filter((s) => typeof s === 'string' && s.trim() !== '')
          .map((s) => s.trim());
        return { id: doc.id, name, subcategories };
      });
      const seen = new Set();
      const deduped = items.filter((item) => {
        const key = item.name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setCategories(deduped);
    });
    return () => unsubscribe();
  }, []);
  
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
          logo: (typeof data.logo === 'string' && data.logo.trim() !== '') ? data.logo : null,
          items: Array.isArray(data.items) ? data.items : [],
          classification: data.classification || 'All',
          saved: !!data.saved,
          company: data.company || '',
          category: data.category || '',
          jobType: data.jobType || '',
          workMode: data.workMode || '',
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

  // Filter elements based on selected category (parent includes its subcategories) and saved toggle
  const normalizeToStringArray = (value) => {
    if (typeof value === 'string') {
      const v = value.trim();
      return v ? [v] : [];
    }
    if (Array.isArray(value)) {
      return value
        .filter((v) => typeof v === 'string')
        .map((v) => v.trim())
        .filter(Boolean);
    }
    if (value && typeof value === 'object') {
      const name = value.name;
      if (typeof name === 'string') {
        const v = name.trim();
        return v ? [v] : [];
      }
    }
    return [];
  };

  const normalizedSelected = (selectedClassification || '').trim().toLowerCase();
  const selectedCategoryObj = categories.find((c) => (c.name || '').trim().toLowerCase() === normalizedSelected);
  const allowedCategoryValues = selectedClassification === 'All'
    ? null
    : new Set(
        (selectedCategoryObj
          ? [selectedCategoryObj.name, ...(selectedCategoryObj.subcategories || [])]
          : [selectedClassification]
        )
          .map((s) => (s || '').trim().toLowerCase())
          .filter(Boolean)
      );

  const filteredElements = elements.filter((element) => {
    const elementCategories = normalizeToStringArray(element.category).map((s) => s.toLowerCase());
    const matchesCategory =
      selectedClassification === 'All' ||
      (allowedCategoryValues && elementCategories.some((cat) => allowedCategoryValues.has(cat)));
    const matchesSaved = !showSavedOnly || element.saved;
    return matchesCategory && matchesSaved;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
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
                {/* All option */}
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedClassification('All');
                    setIsDropdownOpen(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    selectedClassification === 'All' && styles.selectedItem
                  ]}>
                    All
                  </Text>
                </TouchableOpacity>

                {categories.map((category, index) => {
                  const hasSubcategories = Array.isArray(category.subcategories) && category.subcategories.length > 0;
                  const isExpanded = !!expandedCategories[category.name];
                  return (
                    <View key={category.id || index}>
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => {
                          // Select the parent category and close the dropdown.
                          // The chevron button handles expand/collapse without changing selection.
                          setSelectedClassification(category.name);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={[
                            styles.dropdownItemText,
                            selectedClassification === category.name && styles.selectedItem
                          ]}>
                            {category.name}
                          </Text>
                          {hasSubcategories && (
                            <TouchableOpacity
                              onPress={() => {
                                setExpandedCategories((prev) => ({
                                  ...prev,
                                  [category.name]: !prev[category.name],
                                }));
                              }}
                            >
                              <Ionicons name={isExpanded ? 'chevron-down' : 'chevron-forward'} size={18} color="#666" />
                            </TouchableOpacity>
                          )}
                        </View>
                      </TouchableOpacity>

                      {hasSubcategories && isExpanded && (
                        <View>
                          {category.subcategories.map((sub) => (
                            <TouchableOpacity
                              key={`${category.name}-${sub}`}
                              style={styles.subcategoryItem}
                              onPress={() => {
                                setSelectedClassification(sub);
                                setIsDropdownOpen(false);
                              }}
                            >
                              <Text style={[
                                styles.subcategoryItemText,
                                selectedClassification === sub && styles.selectedItem
                              ]}>
                                {sub}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}
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
                  source={element.logo ? { uri: element.logo } : require('../assets/job-offer.png')} 
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
                    {!!element.category && (
                      <View style={styles.listItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.listItemText}>{element.category}</Text>
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
                {element.workMode === 'Remote' ? (
                  <View style={styles.listLocation}>
                    <View style={styles.remoteTag}>
                      <Text style={styles.remoteTagText}>REMOTE</Text>
                    </View>
                  </View>
                ) : ((!!element.suburb || !!element.city) && (
                  <View style={styles.listLocation}>
                    <View style={styles.bulletIcon}>
                      <Ionicons name="location-sharp" size={16} color="#432272" />
                    </View>
                    <Text style={styles.listLocationText}>
                      {`${element.suburb || ''}${element.suburb && element.city ? ', ' : ''}${element.city || ''}`}
                    </Text>
                  </View>
                ))}
               
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
  subcategoryItem: {
    paddingLeft: 32,
    paddingRight: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f6f6f6',
    backgroundColor: '#fafafa',
  },
  subcategoryItemText: {
    fontSize: 15,
    color: '#444',
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
    gap: 10,
  },
  elementContainer: {
    flexDirection: 'column',
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    width: '100%',
    borderRadius: 10,
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
    width: 75,
    height: 75,
    borderRadius: 8,
    marginRight: 20,
    marginLeft: 2,
  },
  elementContent: {
    flex: 1,
  },
  elementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 15,
    textAlign: 'right',
  },
  elementList: {
    marginTop: 10,
    marginLeft: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
   bulletPoint: {
    fontSize: 14,
    color: '#432272',
    marginRight: 10,
    marginLeft: 12,
    marginTop: 0,
  },
  listItemText: {
    flex: 1,
    fontSize: 15,
    color: '#4c4c4c',
    lineHeight: 20,
    marginRight: 20,
  },
  listLocation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
    marginBottom: 16,
  },
  listLocationText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bulletIcon: {
    width: 16,
    height: 20,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remoteTag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#432272',
    opacity: 0.95,
  },
  remoteTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});