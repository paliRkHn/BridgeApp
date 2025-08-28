import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

export const uploadImage = async (uri, path, onProgress = null) => {
  try {
    // Convert image URI to blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create storage reference
    const storageRef = ref(storage, path);

    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const uploadUserAvatar = async (userId, imageUri, onProgress = null) => {
  const timestamp = Date.now();
  const imagePath = `avatars/${userId}/${timestamp}.jpg`;
  return await uploadImage(imageUri, imagePath, onProgress);
};

export const deleteImage = async (imagePath) => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export const getImagePathFromUrl = (url) => {
  try {
    // Extract the path from Firebase Storage URL
    const urlObj = new URL(url);
    const path = decodeURIComponent(urlObj.pathname.split('/o/')[1].split('?')[0]);
    return path;
  } catch (error) {
    console.error('Error extracting image path:', error);
    return null;
  }
};

// Document upload functions
export const uploadDocument = async (uri, fileName, path, onProgress = null) => {
  try {
    // Convert document URI to blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create storage reference
    const storageRef = ref(storage, path);

    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error('Document upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              downloadURL,
              fileName,
              size: uploadTask.snapshot.totalBytes,
              path
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

export const uploadUserDocument = async (userId, documentUri, fileName, documentType = 'general', onProgress = null) => {
  const timestamp = Date.now();
  const fileExtension = fileName.split('.').pop();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const documentPath = `user-docs/${userId}/${documentType}/${timestamp}_${sanitizedFileName}`;
  
  return await uploadDocument(documentUri, fileName, documentPath, onProgress);
};

export const deleteDocument = async (documentPath) => {
  try {
    const docRef = ref(storage, documentPath);
    await deleteObject(docRef);
    console.log('Document deleted successfully');
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};