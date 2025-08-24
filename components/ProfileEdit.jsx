import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';

const JobHistorySection = ({ jobHistory, onUpdateJobHistory, isEditing }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
    description: '',
    isCurrent: false
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() - i).toString());

  const resetForm = () => {
    setNewJob({
      title: '',
      company: '',
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
      description: '',
      isCurrent: false
    });
    setShowAddForm(false);
    setEditingIndex(null);
  };

  const handleSaveJob = () => {
    if (!newJob.title || !newJob.company) {
      alert('Please fill in required fields');
      return;
    }

    const jobData = {
      id: editingIndex !== null ? jobHistory[editingIndex].id : Date.now().toString(),
      title: newJob.title,
      company: newJob.company,
      startDate: `${newJob.startMonth} ${newJob.startYear}`,
      endDate: newJob.isCurrent ? 'Present' : `${newJob.endMonth} ${newJob.endYear}`,
      description: newJob.description,
      isCurrent: newJob.isCurrent
    };

    let updatedHistory;
    if (editingIndex !== null) {
      updatedHistory = [...jobHistory];
      updatedHistory[editingIndex] = jobData;
    } else {
      updatedHistory = [...jobHistory, jobData];
    }

    onUpdateJobHistory(updatedHistory);
    resetForm();
  };

  const handleEditJob = (index) => {
    const job = jobHistory[index];
    const [startMonth, startYear] = job.startDate.split(' ');
    const [endMonth, endYear] = job.endDate === 'Present' ? ['', ''] : job.endDate.split(' ');
    
    setNewJob({
      title: job.title,
      company: job.company,
      startMonth,
      startYear,
      endMonth: endMonth || '',
      endYear: endYear || '',
      description: job.description || '',
      isCurrent: job.isCurrent || false
    });
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const handleDeleteJob = (index) => {
    const updatedHistory = jobHistory.filter((_, i) => i !== index);
    onUpdateJobHistory(updatedHistory);
  };

  const DropdownSelect = ({ value, onSelect, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsOpen(!isOpen)}
        >
          <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
            {value || placeholder}
          </Text>
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

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Job History</Text>
      
      {/* Existing Job History */}
      {jobHistory && jobHistory.length > 0 ? (
        jobHistory.map((job, index) => (
          <View key={job.id} style={styles.jobItem}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <View style={styles.jobActions}>
                <Text style={styles.jobDuration}>
                  {job.startDate} - {job.endDate}
                </Text>
                {isEditing && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.editJobButton}
                      onPress={() => handleEditJob(index)}
                    >
                      <Ionicons name="edit" size={16} color="#432272" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteJobButton}
                      onPress={() => handleDeleteJob(index)}
                    >
                      <Ionicons name="trash" size={16} color="#e74c3c" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            <Text style={styles.jobCompany}>{job.company}</Text>
            {job.description && (
              <Text style={styles.jobDescription}>{job.description}</Text>
            )}
          </View>
        ))
      ) : (
        <View style={styles.textBlock}>
          <Text style={[styles.textContent, styles.placeholder]}>
            No work experience added yet. {isEditing ? 'Tap "Add role" to get started.' : 'Tap Edit to add.'}
          </Text>
        </View>
      )}

      {/* Add Role Button */}
      {isEditing && (
        <View style={styles.addRoleContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <Entypo name="plus" size={20} color="#432272" style={styles.addButtonIcon} />
            <Text style={styles.addButtonText}>Add role</Text>
          </TouchableOpacity>

          {/* Cascading Form */}
          {showAddForm && (
            <View style={styles.cascadeForm}>
              {/* Job Title */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Job title *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newJob.title}
                  onChangeText={(text) => setNewJob({...newJob, title: text})}
                  placeholder="e.g. Data Analyst"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Company */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Company *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newJob.company}
                  onChangeText={(text) => setNewJob({...newJob, company: text})}
                  placeholder="e.g. Tech Corp"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Start Date */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Started</Text>
                <View style={styles.dateRow}>
                  <DropdownSelect
                    value={newJob.startMonth}
                    onSelect={(month) => setNewJob({...newJob, startMonth: month})}
                    options={months}
                    placeholder="Month"
                  />
                  <DropdownSelect
                    value={newJob.startYear}
                    onSelect={(year) => setNewJob({...newJob, startYear: year})}
                    options={years}
                    placeholder="Year"
                  />
                </View>
              </View>

              {/* Current Role Checkbox */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setNewJob({...newJob, isCurrent: !newJob.isCurrent})}
              >
                <View style={[styles.checkbox, newJob.isCurrent && styles.checkboxChecked]}>
                  {newJob.isCurrent && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Still in this role</Text>
              </TouchableOpacity>

              {/* End Date */}
              {!newJob.isCurrent && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Ended</Text>
                  <View style={styles.dateRow}>
                    <DropdownSelect
                      value={newJob.endMonth}
                      onSelect={(month) => setNewJob({...newJob, endMonth: month})}
                      options={months}
                      placeholder="Month"
                    />
                    <DropdownSelect
                      value={newJob.endYear}
                      onSelect={(year) => setNewJob({...newJob, endYear: year})}
                      options={years}
                      placeholder="Year"
                    />
                  </View>
                </View>
              )}

              {/* Description */}
              <View style={styles.inputGroup}>
                <View style={styles.inputLabelContainer}>
                  <Text style={styles.inputLabel}>Description </Text>
                  <Text style={styles.inputLabelLight}>(recommended)</Text>
                </View>
                <TextInput
                  style={styles.textArea}
                  value={newJob.description}
                  onChangeText={(text) => setNewJob({...newJob, description: text})}
                  placeholder="Describe your responsibilities and achievements."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

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
                  onPress={handleSaveJob}
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

// Skills Section Component
const SkillsSection = ({ skills, onUpdateSkills, isEditing }) => {
    const [skillInput, setSkillInput] = useState('');
    const [showPlaceholders, setShowPlaceholders] = useState(!skills || skills.length === 0);
  
    const placeholderSkills = ["Team work", "Highly organized", "Welding", "React Native"];
  
    const capitalizeFirst = (str) => {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
  
    const placeholderSkillsContainer = () => {
      return (
          <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderTitle}>Examples: </Text>
              {placeholderSkills.map((skill, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.placeholderTag}
                  onPress={() => handleAddPlaceholderSkill(skill)}
                >
                  <Text style={styles.placeholderTagText}>{skill}</Text>
                  <Text style={styles.plusIcon}>+</Text>
                </TouchableOpacity>
              ))}
            </View>
      )
    }
  
    const handleAddSkill = () => {
      const trimmedSkill = skillInput.trim();
      if (trimmedSkill && !skills.includes(trimmedSkill)) {
        const capitalizedSkill = capitalizeFirst(trimmedSkill);
        const updatedSkills = [...skills, capitalizedSkill];
        onUpdateSkills(updatedSkills);
        setSkillInput('');
        setShowPlaceholders(false);
      }
    };
  
    const handleRemoveSkill = (skillToRemove) => {
      const updatedSkills = skills.filter(skill => skill !== skillToRemove);
      onUpdateSkills(updatedSkills);
      if (updatedSkills.length === 0) {
        setShowPlaceholders(true);
      }
    };
  
    const handleAddPlaceholderSkill = (skill) => {
      if (!skills.includes(skill)) {
        const updatedSkills = [...skills, skill];
        onUpdateSkills(updatedSkills);
        setShowPlaceholders(false);
      }
    };
  
    const handleKeyPress = (event) => {
      if (event.nativeEvent.key === 'Enter') {
        handleAddSkill();
      }
    };
    
  
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        
        {/* Skills Display */}
        {skills && skills.length > 0 ? (
          <View style={styles.skillsContainer}>
            {skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
                {isEditing && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveSkill(skill)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.textBlock}>
            <Text style={[styles.textContent, styles.placeholder]}>
              {isEditing ? 
                placeholderSkillsContainer() : 
                'Showcase your abilities and expertise. Tap Edit to add.'
              }
            </Text>
          </View>
        )}
  
        {/* Skills Input (only when editing) */}
        {isEditing && (
          <View style={styles.inputContainer}>
            <View style={styles.skillInputRow}>
              <TextInput
                style={styles.skillInput}
                value={skillInput}
                onChangeText={setSkillInput}
                onKeyPress={handleKeyPress}
                placeholder="Type a skill..."
                placeholderTextColor="#999"
                onSubmitEditing={handleAddSkill}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={[styles.addButton, !skillInput.trim()]}
                onPress={handleAddSkill}
                disabled={!skillInput.trim()}
              >
                <Entypo name="plus" size={20} color="#432272" style={styles.addButtonIcon} />
                <Text style={styles.addButtonText}>Add skill</Text>
              </TouchableOpacity>
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
  jobItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    color: '#333',
    flex: 1,
  },
  jobActions: {
    alignItems: 'flex-end',
  },
  jobDuration: {
    fontSize: 14,
    color: '#666',
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
  actionButtonText: {
    fontSize: 12,
    color: '#432272',
    fontWeight: '600',
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: '600',
  },
  jobCompany: {
    fontSize: 16,
    color: '#432272',
    fontWeight: '600',
    marginBottom: 8,
  },
  jobDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
  addRoleContainer: {
    marginTop: 16,
  },
  addButton: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#432272',
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
  dropdownArrow: {
    fontSize: 12,
    color: '#432272',
  },
  cascadeForm: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  inputLabelLight: {
    fontSize: 14,
    fontWeight: '400',
    color: '#999',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    minHeight: 80,
    textAlignVertical: 'top',
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
    borderColor: '#e0e0e0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
    maxHeight: 120,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
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
    borderColor: '#ccc',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#432272',
    borderColor: '#432272',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
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
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#432272',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Skills Section Styles
  inputContainer: {
    marginBottom: 16,
  },
  skillInputRow: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
  },
  skillInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#432272',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  skillText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  removeButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 14,
  },
  placeholderSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  placeholderTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#666',
    marginBottom: 8,
    alignSelf: 'baseline',
  },
  placeholderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  placeholderTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 0.5,
    borderColor: '#666',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  placeholderTagText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '400',
  },
  plusIcon: {
    color: '#432272',
    fontSize: 14,
    fontWeight: 'bold',
  },
  educationType: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
};

// Education Section Component
const EducationSection = ({ education, onUpdateEducation, isEditing }) => {
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
          <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
            {value || placeholder}
          </Text>
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
                <Text style={styles.jobDuration}>
                  {edu.endDate}
                </Text>
                {isEditing && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.editJobButton}
                      onPress={() => handleEditEducation(index)}
                    >
                      <Ionicons name="edit" size={16} color="#432272" />
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
            <Text style={styles.jobCompany}>{edu.institution}</Text>
            <Text style={styles.educationType}>{edu.type}</Text>
          </View>
        ))
      ) : (
        <View style={styles.textBlock}>
          <Text style={[styles.textContent, styles.placeholder]}>
            No educational background added yet. {isEditing ? 'Tap "Add education" to get started.' : 'Tap Edit to add.'}
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
            <Entypo name="plus" size={20} color="#432272" style={styles.addButtonIcon} />
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

// Export all components
export { JobHistorySection, SkillsSection, EducationSection };