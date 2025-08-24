import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { uploadUserAvatar } from './storageService';

export const handleAvatarUpload = async (onImageSelected, onUploadProgress, onUploadStateChange, currentAvatar) => {
  try {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to upload your avatar!'
      );
      return;
    }

    // Prepare alert options
    const alertOptions = [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Camera', onPress: () => pickImageFromCamera(onImageSelected, onUploadProgress, onUploadStateChange) },
      { text: 'Gallery', onPress: () => pickImageFromGallery(onImageSelected, onUploadProgress, onUploadStateChange) }
    ];

    // Add delete option if user has a custom avatar (not the default)
    if (currentAvatar && currentAvatar.uri) {
      alertOptions.splice(1, 0, { 
        text: 'Delete Photo', 
        style: 'destructive',
        onPress: () => handleDeleteAvatar(onImageSelected, onUploadStateChange)
      });
    }

    // Show options to user
    Alert.alert(
      'Select Avatar',
      'Choose how you want to manage your avatar',
      alertOptions
    );
  } catch (error) {
    console.error('Error requesting permissions:', error);
    Alert.alert('Error', 'Failed to request permissions');
  }
};

const pickImageFromGallery = async (onImageSelected, onUploadProgress, onUploadStateChange) => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await processSelectedImage(result.assets[0].uri, onImageSelected, onUploadProgress, onUploadStateChange);
    }
  } catch (error) {
    console.error('Error picking image from gallery:', error);
    Alert.alert('Error', 'Failed to pick image from gallery');
  }
};

const pickImageFromCamera = async (onImageSelected, onUploadProgress, onUploadStateChange) => {
  try {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera permissions to take a photo!'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await processSelectedImage(result.assets[0].uri, onImageSelected, onUploadProgress, onUploadStateChange);
    }
  } catch (error) {
    console.error('Error picking image from camera:', error);
    Alert.alert('Error', 'Failed to take photo');
  }
};

const processSelectedImage = async (imageUri, onImageSelected, onUploadProgress, onUploadStateChange) => {
  try {
    onUploadStateChange(true); // Set uploading state to true
    onUploadProgress(0);

    // Resize and compress the image
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 400, height: 400 } }],
      { 
        compress: 0.7, 
        format: ImageManipulator.SaveFormat.JPEG 
      }
    );

    // Update the form data with the processed image
    onImageSelected(manipulatedImage.uri);

    onUploadProgress(100);
    onUploadStateChange(false);

    Alert.alert(
      'Success', 
      'Avatar selected successfully!'
    );
  } catch (error) {
    console.error('Error processing image:', error);
    onUploadStateChange(false);
    onUploadProgress(0);
    Alert.alert('Error', 'Failed to process image');
  }
};

const handleDeleteAvatar = (onImageSelected, onUploadStateChange) => {
  try {
    onUploadStateChange(true);
    
    // Reset to default avatar (null will trigger default image display)
    onImageSelected(null);
    
    onUploadStateChange(false);
    
    Alert.alert(
      'Success', 
      'Avatar photo deleted. Default avatar restored.'
    );
  } catch (error) {
    console.error('Error deleting avatar:', error);
    onUploadStateChange(false);
    Alert.alert('Error', 'Failed to delete avatar');
  }
};

// Function to upload avatar during registration
export const uploadAvatarForUser = async (userId, imageUri, onProgress) => {
  try {
    if (!imageUri) return null;
    
    const photoURL = await uploadUserAvatar(userId, imageUri, onProgress);
    console.log('Avatar uploaded successfully:', photoURL);
    return photoURL;
  } catch (error) {
    console.error('Avatar upload failed:', error);
    throw error;
  }
};
