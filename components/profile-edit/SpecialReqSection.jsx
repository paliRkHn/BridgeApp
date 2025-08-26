import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Entypo, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const SpecialReqSection = ({ specialReqs, onUpdateSpecialReqs, isEditing }) => {
  const { theme } = useTheme();
  const [specialReqInput, setSpecialReqInput] = useState('');
  const [showPlaceholders, setShowPlaceholders] = useState(!specialReqs || specialReqs.length === 0);
  const [isFlexible, setIsFlexible] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);

  const placeholderSpecialReqs = ["Ramp access", "Work better alone", "Soft lighting"];

  const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const placeholderSpecialReqsContainer = () => {
    return (
        <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderTitle}>Examples: </Text>
            {placeholderSpecialReqs.map((specialReq, index) => (
              <TouchableOpacity
                key={index}
                style={styles.placeholderTag}
                onPress={() => handleAddPlaceholderSpecialReq(specialReq)}
              >
                <Text style={styles.placeholderTagText}>{specialReq}</Text>
                <Text style={styles.plusIcon}>+</Text>
              </TouchableOpacity>
            ))}
          </View>
    )
  }

  const handleAddSpecialReq = () => {
    const trimmedSpecialReq = specialReqInput.trim();
    if (trimmedSpecialReq && !specialReqs.some(req => req.text === trimmedSpecialReq)) {
      const capitalizedSpecialReq = capitalizeFirst(trimmedSpecialReq);
      const newSpecialReq = {
        id: Date.now().toString(),
        text: capitalizedSpecialReq,
        isFlexible: isFlexible
      };
      const updatedSpecialReqs = [...specialReqs, newSpecialReq];
      onUpdateSpecialReqs(updatedSpecialReqs);
      setSpecialReqInput('');
      setIsFlexible(false);
      setShowPlaceholders(false);
    }
  };

  const handleRemoveSpecialReq = (specialReqToRemove) => {
    const updatedSpecialReqs = specialReqs.filter(specialReq => 
      specialReq.id !== specialReqToRemove.id
    );
    onUpdateSpecialReqs(updatedSpecialReqs);
    if (updatedSpecialReqs.length === 0) {
      setShowPlaceholders(true);
    }
  };

  const handleAddPlaceholderSpecialReq = (specialReqText) => {
    setSpecialReqInput(specialReqText);
  };

  const handleKeyPress = (event) => {
    if (event.nativeEvent.key === 'Enter') {
      handleAddSpecialReq();
    }
  };
  

  const styles = getStyles(theme);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Special Requirements</Text>
      
      {/* SpecialReqs Display */}
      {specialReqs && specialReqs.length > 0 ? (
        <View style={styles.specialReqsContainer}>
          {specialReqs.map((specialReq, index) => (
            <View key={specialReq.id || index} style={styles.specialReqTag}>
              <View style={styles.specialReqTextContainer}>
                {specialReq.isFlexible && (
                  <FontAwesome6 name="puzzle-piece" size={12} color={theme.background} style={styles.puzzleIcon} />
                )}
                <Text style={styles.specialReqText}>
                  {typeof specialReq === 'string' ? specialReq : specialReq.text}
                </Text>
              </View>
              {isEditing && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveSpecialReq(specialReq)}
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
              placeholderSpecialReqsContainer() : 
              'Do you need specific accessibility adjustments? Tap Edit to add.'
            }
          </Text>
        </View>
      )}

      {/* specialReqs Input (only when editing) */}
      {isEditing && (
        <View style={styles.inputContainer}>
          <View style={styles.specialReqInputRow}>
            <TextInput
              style={styles.specialReqInput}
              value={specialReqInput}
              onChangeText={setSpecialReqInput}
              onKeyPress={handleKeyPress}
              placeholder="Type a requirement..."
              placeholderTextColor="#999"
              onSubmitEditing={handleAddSpecialReq}
              returnKeyType="done"
            />
            
            {/* Flexible Checkbox */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setIsFlexible(!isFlexible)}
              >
                <View style={[styles.checkbox, isFlexible && styles.checkboxChecked]}>
                  {isFlexible && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Can be flexible?</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => setShowInfoPopup(!showInfoPopup)}
              >
                <Ionicons name="information-circle-outline" size={16} color={theme.secondary} />
              </TouchableOpacity>
              
              {/* Info Popup */}
              {showInfoPopup && (
                <View style={styles.infoPopup}>
                  <Text style={styles.infoText}>Flexible when adjustments are considered.</Text>
                  <TouchableOpacity
                    style={styles.closePopup}
                    onPress={() => setShowInfoPopup(false)}
                  >
                    <Ionicons name="close" size={14} color={theme.secondary} />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[styles.addButton, !specialReqInput.trim()]}
              onPress={handleAddSpecialReq}
              disabled={!specialReqInput.trim()}
            >
              <Entypo name="plus" size={20} color={theme.primary} style={styles.addButtonIcon} />
              <Text style={styles.addButtonText}>Add special requirement</Text>
            </TouchableOpacity>
          </View>
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
    color: theme.primary,
    marginBottom: 16,
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
    color: theme.secondary,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 16,
  },
  specialReqInputRow: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
  },
  specialReqInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: theme.card,
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
  specialReqsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  specialReqTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#432272',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  specialReqTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  puzzleIcon: {
    marginRight: 2,
  },
  specialReqText: {
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 8,
    position: 'relative',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 8,
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
  infoButton: {
    padding: 4,
  },
  infoPopup: {
    position: 'absolute',
    top: -40,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
    minWidth: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  closePopup: {
    marginLeft: 8,
    padding: 2,
  },
});

export default SpecialReqSection;
