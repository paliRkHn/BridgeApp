import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { uploadUserDocument, deleteDocument } from './storageService';
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

// Upload document and save metadata
export const uploadAndSaveDocument = async (userId, documentType = 'general', onProgress = null) => {
  try {
    // Pick document
    const pickedDocument = await pickDocument();
    if (!pickedDocument) {
      return null;
    }

    // Upload to Firebase Storage
    const uploadResult = await uploadUserDocument(
      userId,
      pickedDocument.uri,
      pickedDocument.name,
      documentType,
      onProgress
    );

    // Save metadata to Firestore
    const documentId = `${userId}_${Date.now()}`;
    const documentRef = doc(db, 'user_documents', documentId);
    
    const documentData = {
      id: documentId,
      userId: userId,
      title: pickedDocument.name.replace(/\.[^/.]+$/, ""), // Remove file extension from title
      fileName: pickedDocument.name,
      fileType: pickedDocument.type,
      mimeType: pickedDocument.mimeType,
      size: pickedDocument.size,
      downloadURL: uploadResult.downloadURL,
      storagePath: uploadResult.path,
      documentType: documentType, // 'coverLetters' or 'resumes'
      isDefault: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(documentRef, documentData);

    return {
      id: documentId,
      title: documentData.title,
      date: new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: '2-digit' 
      }),
      isDefault: false,
      type: documentData.fileType,
      ...documentData
    };
  } catch (error) {
    console.error('Error uploading document:', error);
    Alert.alert('Upload Failed', 'Failed to upload document. Please try again.');
    throw error;
  }
};

// Get user documents by type
export const getUserDocuments = async (userId, documentType = null) => {
  try {
    let q = collection(db, 'user_documents');
    
    if (documentType) {
      q = query(
        collection(db, 'user_documents'),
        where('userId', '==', userId),
        where('documentType', '==', documentType),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, 'user_documents'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    const documents = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      documents.push({
        id: doc.id,
        title: data.title,
        date: data.createdAt?.toDate()?.toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: '2-digit', 
          year: '2-digit' 
        }) || 'Unknown',
        isDefault: data.isDefault || false,
        type: data.fileType,
        ...data
      });
    });

    return documents;
  } catch (error) {
    console.error('Error getting user documents:', error);
    return [];
  }
};

// Update document metadata
export const updateDocumentMetadata = async (documentId, updates) => {
  try {
    const documentRef = doc(db, 'user_documents', documentId);
    await updateDoc(documentRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating document:', error);
    return false;
  }
};

// Delete document
export const deleteUserDocument = async (documentId, storagePath) => {
  try {
    // Delete from Firebase Storage
    if (storagePath) {
      await deleteDocument(storagePath);
    }

    // Delete from Firestore
    const documentRef = doc(db, 'user_documents', documentId);
    await deleteDoc(documentRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
};

// Set document as default
export const setDocumentAsDefault = async (userId, documentId, documentType) => {
  try {
    // First, remove default status from all documents of this type
    const userDocsQuery = query(
      collection(db, 'user_documents'),
      where('userId', '==', userId),
      where('documentType', '==', documentType),
      where('isDefault', '==', true)
    );
    
    const querySnapshot = await getDocs(userDocsQuery);
    const batch = [];
    
    querySnapshot.forEach((doc) => {
      batch.push(updateDoc(doc.ref, { isDefault: false, updatedAt: serverTimestamp() }));
    });
    
    // Execute all updates
    await Promise.all(batch);

    // Set the selected document as default
    const documentRef = doc(db, 'user_documents', documentId);
    await updateDoc(documentRef, {
      isDefault: true,
      updatedAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error setting document as default:', error);
    return false;
  }
};
