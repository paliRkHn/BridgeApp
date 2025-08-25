import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const WorkTypeSection = ({ workType, onUpdateWorkType, isEditing }) => {
  const contractTypes = ["Full time", "Part time", "Casual", "Intership/Apprenticeship"];
  const workModes = ["On-site", "Remote", "Hybrid"];

  const handleContractTypeToggle = (type) => {
    const currentContractTypes = workType?.contractTypes || [];
    let updatedContractTypes;
    
    if (currentContractTypes.includes(type)) {
      updatedContractTypes = currentContractTypes.filter(t => t !== type);
    } else {
      updatedContractTypes = [...currentContractTypes, type];
    }
    
    onUpdateWorkType({
      ...workType,
      contractTypes: updatedContractTypes
    });
  };

  const handleWorkModeToggle = (mode) => {
    const currentWorkModes = workType?.workModes || [];
    let updatedWorkModes;
    
    if (currentWorkModes.includes(mode)) {
      updatedWorkModes = currentWorkModes.filter(m => m !== mode);
    } else {
      updatedWorkModes = [...currentWorkModes, mode];
    }
    
    onUpdateWorkType({
      ...workType,
      workModes: updatedWorkModes
    });
  };

  const isContractTypeSelected = (type) => {
    return workType?.contractTypes?.includes(type) || false;
  };

  const isWorkModeSelected = (mode) => {
    return workType?.workModes?.includes(mode) || false;
  };

  const hasAnyPreferences = () => {
    return (workType?.contractTypes?.length > 0) || (workType?.workModes?.length > 0);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Preferred Work Type</Text>
      
      {/* Display current preferences or placeholder */}
      {!isEditing && (
        <View style={styles.textBlock}>
          {hasAnyPreferences() ? (
            <View>
              {workType?.contractTypes?.length > 0 && (
                <View style={styles.preferenceGroup}>
                  <Text style={styles.preferenceLabel}>Contract Type:</Text>
                  <View style={styles.tagsContainer}>
                    {workType.contractTypes.map((type, index) => (
                      <View key={index} style={styles.preferenceTag}>
                        <Text style={styles.preferenceTagText}>{type}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {workType?.workModes?.length > 0 && (
                <View style={styles.preferenceGroup}>
                  <Text style={styles.preferenceLabel}>Mode:</Text>
                  <View style={styles.tagsContainer}>
                    {workType.workModes.map((mode, index) => (
                      <View key={index} style={styles.preferenceTag}>
                        <Text style={styles.preferenceTagText}>{mode}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ) : (
            <Text style={[styles.textContent, styles.placeholder]}>
              No work type preferences set. Tap Edit to add.
            </Text>
          )}
        </View>
      )}

      {/* Editing mode */}
      {isEditing && (
        <View>
          {/* Contract Type Category */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Contract Type</Text>
            <View style={styles.optionsContainer}>
              {contractTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.radioOption}
                  onPress={() => handleContractTypeToggle(type)}
                >
                  <View style={[styles.radioButton, isContractTypeSelected(type) && styles.radioButtonSelected]}>
                    {isContractTypeSelected(type) && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text style={styles.radioLabel}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Work Mode Category */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Mode</Text>
            <View style={styles.optionsContainer}>
              {workModes.map((mode, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.radioOption}
                  onPress={() => handleWorkModeToggle(mode)}
                >
                  <View style={[styles.radioButton, isWorkModeSelected(mode) && styles.radioButtonSelected]}>
                    {isWorkModeSelected(mode) && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text style={styles.radioLabel}>{mode}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = {
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#432272',
    marginBottom: 16,
  },
  textBlock: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#432272',
  },
  textContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  placeholder: {
    color: '#999',
    fontSize: 14,
  },
  preferenceGroup: {
    marginBottom: 12,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#432272',
    marginBottom: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  preferenceTag: {
    backgroundColor: '#432272',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  preferenceTagText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#432272',
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#432272',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#432272',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
};

export default WorkTypeSection;
