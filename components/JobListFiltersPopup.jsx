import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStyles } from './JobList.styles';
import { useTheme } from '../context/ThemeContext';

export default function JobListFiltersPopup({
  isOpen,
  onClose,
  categories = [],
  selectedClassification = 'All', // kept for backward compat
  setSelectedClassification,       // optional, if single-select is still used elsewhere
  selectedCategories = new Set(),
  setSelectedCategories,
  availableJobTypes = [],
  availableWorkModes = [],
  cityToSuburbs = {},
  modalCity = 'All',
  setModalCity,
  selectedJobTypes = new Set(),
  setSelectedJobTypes,
  selectedWorkModes = new Set(),
  setSelectedWorkModes,
  selectedSuburbs = new Set(),
  setSelectedSuburbs,
  pastOnly = false,
  setPastOnly,
  onReset,
}) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [expandedMap, setExpandedMap] = React.useState({});
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

  const allSuburbs = React.useMemo(() => {
    const acc = [];
    Object.values(cityToSuburbs).forEach((list) => {
      if (Array.isArray(list)) {
        for (let i = 0; i < list.length; i += 1) {
          acc.push(list[i]);
        }
      }
    });
    return Array.from(new Set(acc)).sort((a, b) => a.localeCompare(b));
  }, [cityToSuburbs]);

  const suburbsToRender = modalCity === 'All' ? allSuburbs : (modalCity ? (cityToSuburbs[modalCity] || []) : []);

  return (
    <Modal animationType="slide" transparent={true} visible={isOpen} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>More filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Fixed Reset Button */}
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity style={styles.modalResetButton} onPress={onReset}>
              <Text style={styles.modalResetText}>Reset filters</Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="handled">

            {/* Categories Section */}
            <Text style={styles.modalSectionTitle}>Categories</Text>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setSelectedCategories && setSelectedCategories(new Set())}
              accessible={true}
              accessibilityLabel="All categories filter"
              accessibilityHint="Tap to select all categories and clear current filters"
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selectedCategories.size === 0 }}
            >
              <View style={[styles.checkboxBox, selectedCategories.size === 0 && styles.checkboxBoxChecked]}>
                {selectedCategories.size === 0 && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <Text style={styles.checkboxLabel}>All</Text>
            </TouchableOpacity>
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((cat, idx) => {
                const hasSubs = Array.isArray(cat.subcategories) && cat.subcategories.length > 0;
                const isExpanded = !!expandedMap[cat.name];
                const isSelected = selectedCategories.has((cat.name || '').trim().toLowerCase());
                return (
                  <View key={cat.id || `${cat.name}-${idx}`}>
                    <TouchableOpacity
                      style={styles.checkboxRow}
                      onPress={() => {
                        if (!setSelectedCategories) return;
                        const key = (cat.name || '').trim().toLowerCase();
                        const next = new Set(selectedCategories);
                        if (next.has(key)) next.delete(key); else next.add(key);
                        setSelectedCategories(next);
                      }}
                      accessible={true}
                      accessibilityLabel={`${cat.name} category filter`}
                      accessibilityHint={`Tap to ${isSelected ? 'remove' : 'add'} ${cat.name} category filter`}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: isSelected }}
                    >
                      <View style={[styles.checkboxBox, isSelected && styles.checkboxBoxChecked]}>
                        {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                      </View>
                      <Text style={styles.checkboxLabel}>{cat.name}</Text>
                      {hasSubs && (
                        <TouchableOpacity
                          onPress={() => setExpandedMap((prev) => ({ ...prev, [cat.name]: !prev[cat.name] }))}
                          style={{ padding: 8 }}
                          accessible={true}
                          accessibilityLabel={`${isExpanded ? 'Collapse' : 'Expand'} ${cat.name} subcategories`}
                          accessibilityHint={`Tap to ${isExpanded ? 'hide' : 'show'} subcategories for ${cat.name}`}
                          accessibilityRole="button"
                        >
                          <Ionicons name={isExpanded ? 'chevron-down' : 'chevron-forward'} size={18} color="#666" />
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                    {hasSubs && isExpanded && (
                      <View>
                        {cat.subcategories.map((sub) => {
                          const subKey = (sub || '').trim().toLowerCase();
                          const subSelected = selectedCategories.has(subKey);
                          return (
                            <TouchableOpacity
                              key={`${cat.name}-${sub}`}
                              style={[styles.checkboxRow, { paddingLeft: 32 }]}
                              onPress={() => {
                                if (!setSelectedCategories) return;
                                const next = new Set(selectedCategories);
                                if (next.has(subKey)) next.delete(subKey); else next.add(subKey);
                                setSelectedCategories(next);
                              }}
                              accessible={true}
                              accessibilityLabel={`${sub} subcategory filter`}
                              accessibilityHint={`Tap to ${subSelected ? 'remove' : 'add'} ${sub} subcategory filter`}
                              accessibilityRole="checkbox"
                              accessibilityState={{ checked: subSelected }}
                            >
                              <View style={[styles.checkboxBox, subSelected && styles.checkboxBoxChecked]}>
                                {subSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                              </View>
                              <Text style={styles.checkboxLabel}>{sub}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}
                  </View>
                );
              })
            ) : (
              <Text style={styles.modalEmptyText}>No categories available</Text>
            )}

            {/* Job Type Section */}
            <Text style={styles.modalSectionTitle}>Job type</Text>
            {availableJobTypes.length === 0 ? (
              <Text style={styles.modalEmptyText}>No job types available</Text>
            ) : (
              availableJobTypes.map((jobType) => {
                const key = (jobType || '').trim().toLowerCase();
                const isChecked = selectedJobTypes.has(key);
                return (
                  <TouchableOpacity
                    key={`jobtype-${key}`}
                    style={styles.checkboxRow}
                    onPress={() => toggleInSet(setSelectedJobTypes, selectedJobTypes, key)}
                    accessible={true}
                    accessibilityLabel={`${jobType} job type filter`}
                    accessibilityHint={`Tap to ${isChecked ? 'remove' : 'add'} ${jobType} job type filter`}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isChecked }}
                  >
                    <View style={[styles.checkboxBox, isChecked && styles.checkboxBoxChecked]}>
                      {isChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
                    </View>
                    <Text style={styles.checkboxLabel}>{jobType}</Text>
                  </TouchableOpacity>
                );
              })
            )}

            {/* Work Mode Section */}
            <Text style={styles.modalSectionTitle}>Work mode</Text>
            {availableWorkModes.length === 0 ? (
              <Text style={styles.modalEmptyText}>No work modes available</Text>
            ) : (
              availableWorkModes.map((workMode) => {
                const key = (workMode || '').trim().toLowerCase();
                const isChecked = selectedWorkModes.has(key);
                return (
                  <TouchableOpacity
                    key={`workmode-${key}`}
                    style={styles.checkboxRow}
                    onPress={() => toggleInSet(setSelectedWorkModes, selectedWorkModes, key)}
                    accessible={true}
                    accessibilityLabel={`${workMode} work mode filter`}
                    accessibilityHint={`Tap to ${isChecked ? 'remove' : 'add'} ${workMode} work mode filter`}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isChecked }}
                  >
                    <View style={[styles.checkboxBox, isChecked && styles.checkboxBoxChecked]}>
                      {isChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
                    </View>
                    <Text style={styles.checkboxLabel}>{workMode}</Text>
                  </TouchableOpacity>
                );
              })
            )}

            {/* Suburb Section */}
            <Text style={styles.modalSectionTitle}>Suburb</Text>
            <View style={styles.cityPillsContainer}>
              <Text style={styles.cityPillsLabel}>Select City:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cityPillsScroll}>
                {[...Object.keys(cityToSuburbs).sort((a, b) => a.localeCompare(b)), 'All'].map((city) => (
                  <TouchableOpacity
                    key={`city-pill-${city}`}
                    style={[styles.cityPill, modalCity === city && styles.cityPillActive]}
                    onPress={() => setModalCity(city)}
                    accessible={true}
                    accessibilityLabel={`${city} city filter`}
                    accessibilityHint={`Tap to filter suburbs by ${city}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: modalCity === city }}
                  >
                    <Text style={[styles.cityPillText, modalCity === city && styles.cityPillTextActive]}>
                      {city}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Suburbs List */}
            {suburbsToRender.length === 0 && modalCity === '' ? (
              <Text style={styles.modalEmptyText}>Select a city to see suburbs</Text>
            ) : (
            suburbsToRender.map((suburb) => {
              const key = (suburb || '').trim().toLowerCase();
              const isChecked = selectedSuburbs.has(key);
              return (
                <TouchableOpacity
                  key={`suburb-${key}`}
                  style={styles.checkboxRow}
                  onPress={() => toggleInSet(setSelectedSuburbs, selectedSuburbs, key)}
                  accessible={true}
                  accessibilityLabel={`${suburb} suburb filter`}
                  accessibilityHint={`Tap to ${isChecked ? 'remove' : 'add'} ${suburb} suburb filter`}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isChecked }}
                >
                  <View style={[styles.checkboxBox, isChecked && styles.checkboxBoxChecked]}>
                    {isChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </View>
                  <Text style={styles.checkboxLabel}>{suburb}</Text>
                </TouchableOpacity>
              );
            })
            )}

            {/* Past Positions */}
            <Text style={styles.modalSectionTitle}>Past positions</Text>
            <TouchableOpacity 
              style={styles.checkboxRow} 
              onPress={() => setPastOnly(!pastOnly)}
              accessible={true}
              accessibilityLabel="Show inactive positions filter"
              accessibilityHint={`Tap to ${pastOnly ? 'hide' : 'show'} inactive job positions`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: pastOnly }}
            >
              <View style={[styles.checkboxBox, pastOnly && styles.checkboxBoxChecked]}>
                {pastOnly && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <Text style={styles.checkboxLabel}>Show inactive positions</Text>
            </TouchableOpacity>

            {/* Bottom spacing */}
            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.modalFooterButtonPrimary} 
              onPress={onClose}
            >
              <Text style={styles.modalFooterButtonPrimaryText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}