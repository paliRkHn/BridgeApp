import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const Templates = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [coverLettersExpanded, setCoverLettersExpanded] = useState(true);
  const [resumesExpanded, setResumesExpanded] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [addMenuPosition, setAddMenuPosition] = useState({ x: 0, y: 0 });

  // Mock data with random dates between June and August 2025
  const [coverLetters, setCoverLetters] = useState([
    { id: 'cl1', title: 'Title', date: '15/07/25', isDefault: false, type: null },
    { id: 'cl2', title: 'Title', date: '22/06/25', isDefault: false, type: 'PDF' },
    { id: 'cl3', title: 'Title', date: '08/08/25', isDefault: true, type: null },
  ]);

  const [resumes, setResumes] = useState([
    { id: 'res1', title: 'Bridge Profile', date: '03/07/25', isDefault: true, type: null },
    { id: 'res2', title: 'Title', date: '19/06/25', isDefault: false, type: 'PDF' },
    { id: 'res3', title: 'Title', date: '27/08/25', isDefault: false, type: 'DOCX' },
  ]);

  const formatDate = (dateStr) => {
    return dateStr;
  };



  const handleAddButton = (section) => {
    setActiveSection(section);
    setShowAddMenu(true);
  };

  const handleSelection = (itemId) => {
    const newSelectedItems = selectedItems.includes(itemId) 
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    
    setSelectedItems(newSelectedItems);
    
    // Show action menu if there are selected items, hide if none
    if (newSelectedItems.length > 0) {
      setShowActionMenu(true);
    } else {
      setShowActionMenu(false);
    }
  };

  const handleAddAction = (action) => {
    setShowAddMenu(false);
    // Handle add actions here
    console.log(`${action} for ${activeSection}`);
    
    if (action === 'Write') {
      navigation.navigate('TextEditor', {
        title: '',
        content: ''
      });
    }
  };

  const handleOutsideClick = () => {
    setShowAddMenu(false);
  };

  const handleItemAction = (action) => {
    setShowActionMenu(false);
    // Handle item actions here
    console.log(`${action} for selected items:`, selectedItems);
    
    if (action === 'Delete') {
      Alert.alert(
        'Delete Documents',
        'Are you sure you want to delete the selected documents?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: () => {
              // Remove selected items from both lists
              setCoverLetters(prev => prev.filter(item => !selectedItems.includes(item.id)));
              setResumes(prev => prev.filter(item => !selectedItems.includes(item.id)));
              setSelectedItems([]);
            }
          }
        ]
      );
    } else {
      // For other actions, just clear selection
      setSelectedItems([]);
    }
  };

  const renderDocumentItem = (item, listType) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.documentItem,
        selectedItems.includes(item.id) && styles.selectedItem
      ]}
      onPress={() => handleSelection(item.id)}
    >
      <TouchableOpacity
        style={styles.radioButton}
        onPress={() => handleSelection(item.id)}
      >
        <View style={[
          styles.radioCircle,
          selectedItems.includes(item.id) && styles.radioCircleSelected
        ]}>
          {selectedItems.includes(item.id) && (
            <View style={styles.radioInner} />
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.documentContent}>
        <View style={styles.documentHeader}>
          {item.type && (
            <View style={styles.typeLabel}>
              <Text style={styles.typeLabelText}>{item.type}</Text>
            </View>
          )}
          <Text style={styles.documentTitle}>{item.title}</Text>
          {item.isDefault && (
            <View style={styles.defaultLabel}>
              <Text style={styles.defaultLabelText}>Default</Text>
            </View>
          )}
        </View>
        <Text style={styles.documentDate}>{formatDate(item.date)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSection = (title, items, expanded, setExpanded, sectionKey) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <TouchableOpacity
          style={styles.sectionTitleRow}
          onPress={() => setExpanded(!expanded)}
        >
          <Text style={styles.sectionTitle}>{title}</Text>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.primary}
          />
        </TouchableOpacity>
        
        {expanded && (
          <View style={styles.addButtonContainer}>
                         <TouchableOpacity
               style={styles.addButton}
               onPress={() => handleAddButton(sectionKey)}
               onPressIn={(e) => e.stopPropagation()}
             >
              <Ionicons name="add" size={26} color={theme.primary} />
            </TouchableOpacity>
                         {showAddMenu && activeSection === sectionKey && (
               <View style={styles.addMenuDropdown}>
                 <TouchableOpacity
                   style={styles.dropdownOption}
                   onPress={() => handleAddAction('Write')}
                   onPressIn={(e) => e.stopPropagation()}
                 >
                                       <Ionicons name="create" size={16} color={theme.primary} />
                   <Text style={styles.dropdownOptionText}>Write</Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                   style={styles.dropdownOption}
                   onPress={() => handleAddAction('Upload doc')}
                   onPressIn={(e) => e.stopPropagation()}
                 >
                                       <Ionicons name="cloud-upload" size={16} color={theme.primary} />
                   <Text style={styles.dropdownOptionText}>Upload doc</Text>
                 </TouchableOpacity>
               </View>
             )}
          </View>
        )}
      </View>

      {expanded && (
        <View style={styles.documentsList}>
          {items.map(item => renderDocumentItem(item, sectionKey))}
        </View>
      )}
    </View>
  );

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Templates</Text>
      </View>

      <TouchableOpacity 
        style={styles.content} 
        activeOpacity={1}
        onPress={handleOutsideClick}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
        {renderSection('Cover Letters', coverLetters, coverLettersExpanded, setCoverLettersExpanded, 'coverLetters')}
        {renderSection('Resumes', resumes, resumesExpanded, setResumesExpanded, 'resumes')}
        
        {/* Information Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoContent}>
            <Ionicons name="information-circle" size={20} color={theme.primary} style={styles.infoIcon} />
            <Text style={styles.infoText}>
              You can store up to 10 documents, and up to 10 cover letter texts.{'\n'}
              Supported files: doc, docx, pdf, and text.{'\n'}
              5MB max.
            </Text>
          </View>
                 </View>
       </ScrollView>
       </TouchableOpacity>



      {/* Action Side Menu */}
      {showActionMenu && (
        <View style={styles.actionSideMenu}>
          <View style={styles.actionMenuHeader}>
            <Text style={styles.actionMenuTitle}>
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </Text>
            <TouchableOpacity
              style={styles.closeActionMenu}
              onPress={() => {
                setShowActionMenu(false);
                setSelectedItems([]);
              }}
            >
              <Ionicons name="close" size={20} color={theme.secondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.actionMenuContent}>
            <TouchableOpacity
              style={styles.actionMenuOption}
              onPress={() => handleItemAction('Make default')}
            >
              <Ionicons name="star" size={20} color={theme.primary} />
              <Text style={styles.actionMenuOptionText}>Make default</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionMenuOption}
              onPress={() => handleItemAction('Rename')}
            >
              <Ionicons name="pencil" size={20} color={theme.primary} />
              <Text style={styles.actionMenuOptionText}>Rename</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionMenuOption, styles.deleteActionOption]}
              onPress={() => handleItemAction('Delete')}
            >
              <Ionicons name="trash" size={20} color="#e74c3c" />
              <Text style={[styles.actionMenuOptionText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const getStyles = (theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.primary,
    marginRight: 8,
  },
  addButton: {
    padding: 8,
  },
  documentsList: {
    gap: 8,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  selectedItem: {
    backgroundColor: theme.primary + '20',
    borderColor: theme.primary,
  },
  radioButton: {
    marginRight: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: theme.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.primary,
  },
  documentContent: {
    flex: 1,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeLabel: {
    backgroundColor: theme.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  typeLabelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.primary,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
    flex: 1,
  },
  defaultLabel: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultLabelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  documentDate: {
    fontSize: 12,
    color: theme.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.background,
    borderRadius: 12,
    padding: 16,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalOptionText: {
    fontSize: 16,
    color: theme.text,
    marginLeft: 12,
  },
  deleteOption: {
    borderTopWidth: 1,
    borderTopColor: theme.border,
    marginTop: 8,
    paddingTop: 20,
  },
  deleteText: {
    color: '#e74c3c',
  },
  infoSection: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: theme.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: theme.secondary,
    lineHeight: 20,
  },
  addMenuContent: {
    minWidth: 150,
    maxWidth: 200,
  },
  addButtonContainer: {
    position: 'relative',
  },
  addMenuDropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: theme.background,
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    minWidth: 140,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  dropdownOptionText: {
    fontSize: 14,
    color: theme.text,
    marginLeft: 8,
  },
  actionSideMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 200,
    backgroundColor: theme.background,
    borderLeftWidth: 1,
    borderLeftColor: theme.border,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  actionMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.card,
  },
  actionMenuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.primary,
  },
  closeActionMenu: {
    padding: 4,
  },
  actionMenuContent: {
    padding: 20,
  },
  actionMenuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: theme.card,
  },
  actionMenuOptionText: {
    fontSize: 16,
    color: theme.text,
    marginLeft: 12,
    fontWeight: '500',
  },
  deleteActionOption: {
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#fed7d7',
  },
});

export default Templates;
