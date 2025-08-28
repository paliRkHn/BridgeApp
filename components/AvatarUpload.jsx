import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { handleAvatarUpload } from '../services/imageUploadService';

export default function AvatarUpload({ 
  avatar, 
  onAvatarChange, 
  size = 120,
  showUploadButton = true,
  buttonText = null,
  disabled = false,
  style = {},
  onAvatarPress = null
}) {
  const { theme } = useTheme();
  
  // Local state for avatar upload
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Handle avatar selection and update parent component
  const handleImageSelected = (imageUri) => {
    if (imageUri === null) {
      // Reset to default avatar
      onAvatarChange(require('../assets/idea.png'));
    } else {
      // Set custom image
      onAvatarChange({ uri: imageUri });
    }
  };

  // Handle avatar upload button press
  const handleAvatarPress = () => {
    if (disabled) return;
    
    handleAvatarUpload(
      handleImageSelected,
      setUploadProgress,
      setIsUploadingAvatar,
      avatar
    );
  };

  // Determine button text based on props and state
  const getButtonText = () => {
    if (buttonText) return buttonText;
    if (isUploadingAvatar) return 'Processing...';
    if (avatar && avatar.uri) return 'Change Photo';
    return 'Upload Photo';
  };

  // Determine avatar source
  const getAvatarSource = () => {
    if (avatar && avatar.uri) {
      return { uri: avatar.uri };
    } else if (avatar && typeof avatar === 'string') {
      return { uri: avatar };
    } else if (avatar) {
      return avatar;
    } else {
      return require('../assets/idea.png');
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.avatarContainer, { width: size, height: size }]}>
        <TouchableOpacity 
          onPress={onAvatarPress} 
          disabled={!onAvatarPress}
          style={{ borderRadius: size / 2 }}
          accessible={true}
          accessibilityLabel="Profile picture"
          accessibilityHint="Tap to view full size profile picture"
          accessibilityRole="button"
        >
          <Image 
            source={getAvatarSource()} 
            style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
            resizeMode="cover"
            accessible={true}
            accessibilityLabel={avatar && avatar.uri ? "Custom profile picture" : "Default profile picture"}
            accessibilityRole="image"
          />
        </TouchableOpacity>
        {isUploadingAvatar && (
          <View style={styles.progressOverlay}>
            <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
          </View>
        )}
      </View>
      
      {showUploadButton && (
        <>
          <TouchableOpacity 
            style={[
              styles.uploadButton, 
              { backgroundColor: theme.primary },
              (isUploadingAvatar || disabled) && styles.disabledButton
            ]} 
            onPress={handleAvatarPress}
            disabled={isUploadingAvatar || disabled}
            accessible={true}
            accessibilityLabel={getButtonText()}
            accessibilityHint={avatar && avatar.uri ? "Tap to change your profile picture" : "Tap to upload a profile picture"}
            accessibilityRole="button"
            accessibilityState={{ disabled: isUploadingAvatar || disabled }}
          >
            <Text style={styles.uploadButtonText}>
              {getButtonText()}
            </Text>
          </TouchableOpacity>
          
          {isUploadingAvatar && (
            <Text style={[styles.progressText, { color: theme.secondary }]}>
              {Math.round(uploadProgress)}% complete
            </Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  progressOverlay: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    right: 5,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  uploadButton: {
    backgroundColor: '#432272',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
