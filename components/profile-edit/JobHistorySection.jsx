import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Entypo, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const JobHistorySection = ({ jobHistory, onUpdateJobHistory, isEditing }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const { theme } = useTheme();
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
  const [noJobHistory, setNoJobHistory] = useState(false);
  const [noJobHistoryReason, setNoJobHistoryReason] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() - i).toString());

  const noJobHistoryOptions = [
    "New to the workforce",
    "Recently graduated",
    "Looking for interships/apprenticeships",
    "New to the industry",
    "Inclusive Recruitment Program participant",
    "Other"
  ];

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
    setNoJobHistory(false);
    setNoJobHistoryReason('');
    setShowAddForm(false);
    setEditingIndex(null);
  };

  const handleSaveJob = () => {
    // Handle "No job history" case
    if (noJobHistory) {
      if (!noJobHistoryReason) {
        alert('Please select a reason for no job history');
        return;
      }
      
      const noJobHistoryData = {
        id: Date.now().toString(),
        title: 'No job history',
        company: noJobHistoryReason,
        startDate: '',
        endDate: '',
        description: '',
        isCurrent: false,
        isNoJobHistory: true
      };
      
      const updatedHistory = [noJobHistoryData];
      onUpdateJobHistory(updatedHistory);
      resetForm();
      return;
    }

    // Handle regular job entry
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
      isCurrent: newJob.isCurrent,
      isNoJobHistory: false
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
          </View>
        )}
      </View>
    );
  };

  const styles = getStyles(theme);

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
                {isEditing && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.editJobButton}
                      onPress={() => handleEditJob(index)}
                    >
                      <MaterialIcons name="edit" size={16} color="#432272" />
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
            
            <Text style={styles.jobDuration}>
                  {job.startDate} - {job.endDate}
            </Text>
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
              {/* Regular Job Fields - Hidden when "No job history" is checked */}
              {!noJobHistory && (
                <>
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
                </>
              )}

              {/* Description */}
              {!noJobHistory && (
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
              )}

              {/* No Job History Checkbox */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => {
                  setNoJobHistory(!noJobHistory);
                  if (!noJobHistory) {
                    // Reset regular job fields when switching to "no job history"
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
                  } else {
                    // Reset no job history reason when switching back
                    setNoJobHistoryReason('');
                  }
                }}
              >
                <View style={[styles.checkbox, noJobHistory && styles.checkboxChecked]}>
                  {noJobHistory && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>No job history</Text>
              </TouchableOpacity>

              {/* No Job History Dropdown */}
              {noJobHistory && (
                <View style={styles.inputGroup}>
                  <DropdownSelect
                    value={noJobHistoryReason}
                    onSelect={(reason) => setNoJobHistoryReason(reason)}
                    options={noJobHistoryOptions}
                    placeholder="Select reason"
                  />
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

const getStyles = (theme) => StyleSheet.create({
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    overflow: 'visible',
    zIndex: 1,
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
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    borderRadius: 10,
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
    color: theme.text,
    flex: 1,
    fontWeight: 'bold',
  },
  jobActions: {
    alignItems: 'flex-end',
  },
  jobDuration: {
    textAlign: 'right',
    fontSize: 14,
    color: theme.secondary,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
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
    color: theme.text,
    marginBottom: 8,
  },
  jobDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
    color: '#333',
    lineHeight: 24,
  },
  placeholder: {
    color: '#999',
    fontSize: 14,
  },
  addRoleContainer: {
    marginTop: 16,
    overflow: 'visible',
    zIndex: 1,
  },
  addButton: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
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
    overflow: 'visible',
    zIndex: 1,
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
    zIndex: 2,
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
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
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
});

export default JobHistorySection;
