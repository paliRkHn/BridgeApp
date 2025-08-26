import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

const TextEditor = ({ navigation, route }) => {
  const [title, setTitle] = useState(route.params?.title || '');
  const [content, setContent] = useState(route.params?.content || '');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isBullet, setIsBullet] = useState(false);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    
    // Here you would typically save to your data store
    console.log('Saving document:', { title, content });
    
    // Navigate back to Templates screen
    navigation.goBack();
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { 
          text: 'Discard', 
          style: 'destructive',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const toggleBold = () => {
    setIsBold(!isBold);
  };

  const toggleItalic = () => {
    setIsItalic(!isItalic);
  };

  const toggleBullet = () => {
    setIsBullet(!isBullet);
  };

  const getTextStyle = () => {
    let style = { fontSize: 16, color: '#333' };
    
    if (isBold) {
      style.fontWeight = 'bold';
    }
    
    if (isItalic) {
      style.fontStyle = 'italic';
    }
    
    return style;
  };

  const formatContent = (text) => {
    if (isBullet) {
      // Add bullet point to each line
      const lines = text.split('\n');
      const formattedLines = lines.map(line => 
        line.trim() ? `• ${line}` : line
      );
      return formattedLines.join('\n');
    }
    return text;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Write your cover letter</Text>
        </View>

        {/* Toolbar */}
        <View style={styles.toolbar}>
          <TouchableOpacity
            style={[styles.toolButton, isBold && styles.toolButtonActive]}
            onPress={toggleBold}
          >
            <FontAwesome5 name="bold" size={20} color={isBold ? '#432272' : '#666'} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.toolButton, isItalic && styles.toolButtonActive]}
            onPress={toggleItalic}
          >
            <FontAwesome5 name="italic" size={20} color={isItalic ? '#432272' : '#666'} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.toolButton, isBullet && styles.toolButtonActive]}
            onPress={toggleBullet}
          >
            <Ionicons name="list" size={20} color={isBullet ? '#432272' : '#666'} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Input */}
          <View style={styles.titleContainer}>
            <Text style={styles.titleLabel}>Title</Text>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter document title..."
              placeholderTextColor="#999"
              maxLength={100}
            />
          </View>

          {/* Content Input */}
          <View style={styles.contentContainer}>
            <Text style={styles.contentLabel}>Content</Text>
            <TextInput
              style={[styles.contentInput, getTextStyle()]}
              value={content}
              onChangeText={setContent}
              placeholder="Start writing your document..."
              placeholderTextColor="#999"
              multiline
              textAlignVertical="top"
              autoFocus={false}
            />
          </View>
        </ScrollView>

        {/* Bottom Buttons */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#432272',
  },
  headerButton: {
    padding: 8,
  },
  toolbar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 16,
  },
  toolButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  toolButtonActive: {
    backgroundColor: '#e8f4fd',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 24,
  },
  titleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    color: '#333',
  },
  contentContainer: {
    flex: 1,
  },
  contentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  contentInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 300,
    textAlignVertical: 'top',
    color: '#333',
  },
  bottomButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 50,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#432272',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
};

export default TextEditor;
