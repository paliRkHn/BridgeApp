import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Entypo } from '@expo/vector-icons';

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
  placeholderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  placeholderTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#666',
    marginBottom: 8,
    alignSelf: 'baseline',
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
};

export default SkillsSection;
