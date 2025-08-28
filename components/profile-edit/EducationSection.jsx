import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Entypo, MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const EducationSection = ({ education, onUpdateEducation, isEditing }) => {
  const { theme } = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEducation, setNewEducation] = useState({
    type: '',
    name: '',
    institution: '',
    endMonth: '',
    endYear: '',
    isCoursework: false
  });

  const educationTypes = [
    "Certification", "Senior Secondary", "Certificate", "Diploma", 
    "Advanced Diploma", "Bachelor Degree", "Graduate Certificate", 
    "Graduate Diploma", "Masters Degree", "Doctoral Degree"
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() - i).toString());

  const resetForm = () => {
    setNewEducation({
      type: '',
      name: '',
      institution: '',
      endMonth: '',
      endYear: '',
      isCoursework: false
    });
    setShowAddForm(false);
    setEditingIndex(null);
  };

  const handleSaveEducation = () => {
    if (!newEducation.type || !newEducation.name || !newEducation.institution) {
      alert('Please fill in required fields');
      return;
    }

    const educationData = {
      id: editingIndex !== null ? education[editingIndex].id : Date.now().toString(),
      type: newEducation.type,
      name: newEducation.name,
      institution: newEducation.institution,
      endDate: newEducation.isCoursework ? 'Coursework' : `${newEducation.endMonth} ${newEducation.endYear}`,
      isCoursework: newEducation.isCoursework
    };

    let updatedEducation;
    if (editingIndex !== null) {
      updatedEducation = [...education];
      updatedEducation[editingIndex] = educationData;
    } else {
      updatedEducation = [...education, educationData];
    }

    onUpdateEducation(updatedEducation);
    resetForm();
  };

  const handleEditEducation = (index) => {
    const edu = education[index];
    const [endMonth, endYear] = edu.endDate === 'Coursework' ? ['', ''] : edu.endDate.split(' ');
    
    setNewEducation({
      type: edu.type,
      name: edu.name,
      institution: edu.institution,
      endMonth: endMonth || '',
      endYear: endYear || '',
      isCoursework: edu.isCoursework || false
    });
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const handleDeleteEducation = (index) => {
    const updatedEducation = education.filter((_, i) => i !== index);
    onUpdateEducation(updatedEducation);
  };

  const DropdownSelect = ({ value, onSelect, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsOpen(!isOpen)}
        >
          <Text style={styles.dropdownText}>
            {value || placeholder}
          </Text>
          <AntDesign name="down" size={14} color="#666" />
        </TouchableOpacity>
        
        {isOpen && (
          <View style={styles.dropdownMenu}>
            <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownItem}
                  onPress={() => {
                    onSelect(option);
                    setIsOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  const styles = getStyles(theme);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Education</Text>
      
      {/* Existing Education */}
      {education && education.length > 0 ? (
        education.map((edu, index) => (
          <View key={edu.id} style={styles.jobItem}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>{edu.name}</Text>              
              <View style={styles.jobActions}>
                {isEditing && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.editJobButton}
                      onPress={() => handleEditEducation(index)}
                    >
                      <MaterialIcons name="edit" size={16} color={theme.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteJobButton}
                      onPress={() => handleDeleteEducation(index)}
                    >
                      <Ionicons name="trash" size={16} color="#e74c3c" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            <Text style={styles.educationType}>{edu.type}</Text>
            <Text style={styles.jobCompany}>{edu.institution}</Text>            
            <Text style={styles.jobDuration}>
                  {edu.endDate}
            </Text>
          </View>
        ))
      ) : (
        <View style={styles.textBlock}>
          <Text style={[styles.textContent, styles.placeholder]}>
            No educational background added yet. {isEditing ? '' : 'Tap Edit to add.'}
          </Text>
        </View>
      )}

      {/* Add Education Button */}
      {isEditing && (
        <View style={styles.addRoleContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <Entypo name="plus" size={20} color={theme.primary} style={styles.addButtonIcon} />
            <Text style={styles.addButtonText}>Add education</Text>
          </TouchableOpacity>

          {/* Cascading Form */}
          {showAddForm && (
            <View style={styles.cascadeForm}>
              {/* Education Type */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Type *</Text>
                <DropdownSelect
                  value={newEducation.type}
                  onSelect={(type) => setNewEducation({...newEducation, type: type})}
                  options={educationTypes}
                  placeholder="Select education type"
                />
              </View>

              {/* Education Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEducation.name}
                  onChangeText={(text) => setNewEducation({...newEducation, name: text})}
                  placeholder="e.g. Computer Science or First Aid"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Institution */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Institution *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEducation.institution}
                  onChangeText={(text) => setNewEducation({...newEducation, institution: text})}
                  placeholder="e.g. University of Sydney"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Coursework Checkbox */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setNewEducation({...newEducation, isCoursework: !newEducation.isCoursework})}
              >
                <View style={[styles.checkbox, newEducation.isCoursework && styles.checkboxChecked]}>
                  {newEducation.isCoursework && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Coursework</Text>
              </TouchableOpacity>

              {/* End Date */}
              {!newEducation.isCoursework && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Ended</Text>
                  <View style={styles.dateRow}>
                    <DropdownSelect
                      value={newEducation.endMonth}
                      onSelect={(month) => setNewEducation({...newEducation, endMonth: month})}
                      options={months}
                      placeholder="Month"
                    />
                    <DropdownSelect
                      value={newEducation.endYear}
                      onSelect={(year) => setNewEducation({...newEducation, endYear: year})}
                      options={years}
                      placeholder="Year"
                    />
                  </View>
                </View>
              )}

              {/* Form Actions */}
              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={resetForm}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveEducation}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const getStyles = (theme) => ({
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 16,
  },
  jobItem: {
    marginBottom: 20,
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.card,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    flex: 1,
  },
  jobActions: {
    alignItems: 'flex-end',
  },
  jobDuration: {
    textAlign: 'right',
    fontSize: 14,
    color: theme.secondary,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editJobButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  deleteJobButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#ffebee',
    borderRadius: 4,
  },
  jobCompany: {
    fontSize: 16,
    color: theme.text,
    marginBottom: 8,
  },
  textBlock: {
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
  },
  textContent: {
    fontSize: 16,
    color: theme.text,
    lineHeight: 24,
  },
  placeholder: {
    color: '#999',
    fontSize: 14,
  },
  addRoleContainer: {
    marginTop: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    borderWidth: 2,
    borderColor: theme.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  addButtonIcon: {
    fontSize: 20,
    color: '#432272',
    textAlign: 'right',
    paddingHorizontal: 10,
  },
  addButtonText: {
    fontSize: 16,
    color: '#432272',
    fontWeight: '800',
    textAlign: 'left',
    paddingHorizontal: 10,
  },
  cascadeForm: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    marginTop: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: theme.card,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dropdownContainer: {
    flex: 1,
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: theme.card,
  },
  dropdownText: {
    fontSize: 16,
    color: theme.text,
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 6,
    marginTop: 2,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  dropdownItemText: {
    fontSize: 14,
    color: theme.text,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: theme.border,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.primary,
    borderColor: '#432272',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: theme.text,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: theme.primary,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  educationType: {
    fontSize: 14,
    color: theme.secondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default EducationSection;
