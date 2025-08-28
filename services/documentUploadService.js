import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';

// Supported file types and their extensions
const SUPPORTED_TYPES = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'text/plain': 'TXT'
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// Pick document from device
export const pickDocument = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ],
      copyToCacheDirectory: true,
      multiple: false
    });

    if (result.canceled) {
      return null;
    }

    const document = result.assets[0];
    
    // Check file size
    if (document.size > MAX_FILE_SIZE) {
      Alert.alert(
        'File Too Large', 
        'Please select a file smaller than 5MB.'
      );
      return null;
    }

    // Check file type
    if (!SUPPORTED_TYPES[document.mimeType]) {
      Alert.alert(
        'Unsupported File Type', 
        'Please select a PDF, DOC, DOCX, or TXT file.'
      );
      return null;
    }

    return {
      uri: document.uri,
      name: document.name,
      size: document.size,
      mimeType: document.mimeType,
      type: SUPPORTED_TYPES[document.mimeType]
    };
  } catch (error) {
    console.error('Error picking document:', error);
    Alert.alert('Error', 'Failed to pick document. Please try again.');
    return null;
  }
};
