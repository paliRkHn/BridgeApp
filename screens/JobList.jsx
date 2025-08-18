import React, { useState, useEffect } from 'react';
import {  
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../components/BottomNav';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../components/JobList.styles';
import JobListFiltersPopup from '../components/JobListFiltersPopup';
import List from '../components/List';

export default function JobList() {
  const navigation = useNavigation();
  const [selectedClassification, setSelectedClassification] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [elements, setElements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('All');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const [availableJobTypes, setAvailableJobTypes] = useState([]);
  const [availableWorkModes, setAvailableWorkModes] = useState([]);
  const [cityToSuburbs, setCityToSuburbs] = useState({});
  const [modalCity, setModalCity] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedJobTypes, setSelectedJobTypes] = useState(new Set());
  const [selectedWorkModes, setSelectedWorkModes] = useState(new Set());
  const [selectedSuburbs, setSelectedSuburbs] = useState(new Set());
  const [pastOnly, setPastOnly] = useState(false);
  const hasActiveMoreFilters =
    selectedJobTypes.size > 0 ||
    selectedWorkModes.size > 0 ||
    selectedSuburbs.size > 0 ||
    selectedCategories.size > 0 ||
    !!pastOnly;
  
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

  // Build cities list dynamically from elements
  useEffect(() => {
    const unique = Array.from(
      new Set(
        elements
          .map((e) => (typeof e.city === 'string' ? e.city.trim() : ''))
          .filter((c) => c && c.length > 0)
      )
    ).sort((a, b) => a.localeCompare(b));
    setCities(['All', ...unique]);
  }, [elements]);
  
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
          isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
        };
      });
      setElements(fetchedElements);
    });
    return () => unsubscribe();
  }, []);

  const goBack = () => {
    navigation.goBack();
  };

  const handleResetFilters = () => {
    setSelectedClassification('All');
    setSelectedCity('All');
    setExpandedCategories({});
    setIsDropdownOpen(false);
    setIsCityDropdownOpen(false);
    resetMoreFilters();
  };

  const handleMoreFilters = () => {
    setIsDropdownOpen(false);
    setIsCityDropdownOpen(false);
    setIsMoreFiltersOpen(true);
  };

  const resetMoreFilters = () => {
    setSelectedJobTypes(new Set());
    setSelectedWorkModes(new Set());
    setSelectedSuburbs(new Set());
    setPastOnly(false);
    setModalCity('');
    setSelectedCategories(new Set());
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

  // Build allowed category values (OR within group). If multi-select used, it overrides the single dropdown
  const selectedCategoryLabelsLower = (() => {
    if (selectedCategories && selectedCategories.size > 0) {
      return Array.from(selectedCategories).map((s) => (s || '').trim().toLowerCase()).filter(Boolean);
    }
    const single = (selectedClassification || '').trim();
    if (!single || single === 'All') return [];
    return [(single || '').trim().toLowerCase()];
  })();

  const categoryNameToItem = React.useMemo(() => {
    const map = new Map();
    categories.forEach((c) => {
      const key = (c.name || '').trim().toLowerCase();
      if (key) map.set(key, c);
    });
    return map;
  }, [categories]);

  const allowedCategoryValues = selectedCategoryLabelsLower.length === 0
    ? null
    : new Set(
        selectedCategoryLabelsLower.flatMap((label) => {
          const cat = categoryNameToItem.get(label);
          if (cat) {
            const values = [cat.name, ...(Array.isArray(cat.subcategories) ? cat.subcategories : [])];
            return values.map((v) => (v || '').trim().toLowerCase()).filter(Boolean);
          }
          return [(label || '').trim().toLowerCase()].filter(Boolean);
        })
      );

  const filteredElements = elements.filter((element) => {
    const elementCategories = normalizeToStringArray(element.category).map((s) => s.toLowerCase());
    const matchesCategory =
      !allowedCategoryValues || elementCategories.some((cat) => allowedCategoryValues.has(cat));
    const elementCity = typeof element.city === 'string' ? element.city.trim().toLowerCase() : '';
    const matchesCity = selectedCity === 'All' || elementCity === (selectedCity || '').trim().toLowerCase();
    const elementJobType = (element.jobType || '').trim().toLowerCase();
    const elementWorkMode = (element.workMode || '').trim().toLowerCase();
    const elementSuburb = (element.suburb || '').trim().toLowerCase();
    const matchesJobType = selectedJobTypes.size === 0 || selectedJobTypes.has(elementJobType);
    const matchesWorkMode = selectedWorkModes.size === 0 || selectedWorkModes.has(elementWorkMode);
    const matchesSuburb = selectedSuburbs.size === 0 || selectedSuburbs.has(elementSuburb);
    const matchesPast = !pastOnly || (element.isActive === false);
    return (
      matchesCategory &&
      matchesCity &&
      matchesJobType &&
      matchesWorkMode &&
      matchesSuburb &&
      matchesPast
    );
  });

  // Build auxiliary lists for More Filters modal
  useEffect(() => {
    const jobTypeSet = new Set();
    const workModeSet = new Set();
    const cityMap = {};
    elements.forEach((el) => {
      if (typeof el.jobType === 'string' && el.jobType.trim()) {
        jobTypeSet.add(el.jobType.trim());
      }
      if (typeof el.workMode === 'string' && el.workMode.trim()) {
        workModeSet.add(el.workMode.trim());
      }
      const city = typeof el.city === 'string' ? el.city.trim() : '';
      const suburb = typeof el.suburb === 'string' ? el.suburb.trim() : '';
      if (city && suburb) {
        if (!cityMap[city]) cityMap[city] = new Set();
        cityMap[city].add(suburb);
      }
    });
    setAvailableJobTypes(Array.from(jobTypeSet).sort((a, b) => a.localeCompare(b)));
    setAvailableWorkModes(Array.from(workModeSet).sort((a, b) => a.localeCompare(b)));
    const normalizedMap = Object.fromEntries(
      Object.entries(cityMap).map(([c, subs]) => [c, Array.from(subs).sort((a, b) => a.localeCompare(b))])
    );
    setCityToSuburbs(normalizedMap);
    if (modalCity && !normalizedMap[modalCity]) {
      setModalCity('');
    }
  }, [elements]);

  const toggleInSet = (setValue, currentSet, rawKey) => {
    const key = (rawKey || '').trim().toLowerCase();
    const next = new Set(currentSet);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setValue(next);
  };

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
          <View style={{ flex: 1 }}>
            {/* Categories Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Categories</Text>
              <TouchableOpacity 
                style={styles.dropdownButton} 
                onPress={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                  setIsCityDropdownOpen(false);
                }}
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

            {/* City Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>City</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => {
                  setIsCityDropdownOpen(!isCityDropdownOpen);
                  setIsDropdownOpen(false);
                }}
              >
                <Text style={styles.dropdownButtonText}>{selectedCity}</Text>
                <Text style={styles.dropdownArrow}>{isCityDropdownOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isCityDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {cities.map((city, index) => (
                    <TouchableOpacity
                      key={`${city}-${index}`}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedCity(city);
                        setIsCityDropdownOpen(false);
                      }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        selectedCity === city && styles.selectedItem,
                      ]}>
                        {city}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <View style={styles.moreFiltersContainer}>
            <TouchableOpacity style={[styles.resetButton, hasActiveMoreFilters && styles.moreFiltersActiveButton]} onPress={handleMoreFilters}>
                <Text style={[styles.resetButtonText, hasActiveMoreFilters && styles.moreFiltersActiveText]}>More filters</Text>
            </TouchableOpacity>
              <TouchableOpacity style={styles.resetButton} onPress={handleResetFilters}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Render the list of jobs */}
        <List elements={filteredElements} />

        {/* Bottom spacer to avoid content under nav */}
        <View style={{ height: 90 }} />
      </ScrollView>
      <BottomNav />
      
      {/* More Filters Modal */}
      <JobListFiltersPopup
        isOpen={isMoreFiltersOpen}
        onClose={() => setIsMoreFiltersOpen(false)}
        categories={categories}
        selectedClassification={selectedClassification}
        setSelectedClassification={setSelectedClassification}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        availableJobTypes={availableJobTypes}
        availableWorkModes={availableWorkModes}
        cityToSuburbs={cityToSuburbs}
        modalCity={modalCity}
        setModalCity={setModalCity}
        selectedJobTypes={selectedJobTypes}
        setSelectedJobTypes={setSelectedJobTypes}
        selectedWorkModes={selectedWorkModes}
        setSelectedWorkModes={setSelectedWorkModes}
        selectedSuburbs={selectedSuburbs}
        setSelectedSuburbs={setSelectedSuburbs}
        pastOnly={pastOnly}
        setPastOnly={setPastOnly}
        onReset={resetMoreFilters}
      />
    </SafeAreaView>
  );
}
