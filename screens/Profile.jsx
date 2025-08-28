import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  TextInput,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../components/BottomNav';
import AvatarUpload from '../components/AvatarUpload';
import JobHistorySection from '../components/profile-edit/JobHistorySection';
import SpecialReqSection from '../components/profile-edit/SpecialReqSection';
import SkillsSection from '../components/profile-edit/SkillsSection';
import EducationSection from '../components/profile-edit/EducationSection';
import WorkTypeSection from '../components/profile-edit/WorkTypeSection';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { uploadAvatarForUser } from '../services/imageUploadService';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const navigation = useNavigation();
  const { user, userProfile, updateUserProfile, refreshUserProfile } = useAuth();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  
  // Get screen dimensions for responsive modal
  const screenHeight = Dimensions.get('window').height;

  // Get avatar source for modal display
  const getModalAvatarSource = () => {
    if (profileData.avatar && profileData.avatar.uri) {
      return { uri: profileData.avatar.uri };
    } else if (profileData.avatar && typeof profileData.avatar === 'string') {
      return { uri: profileData.avatar };
    } else if (profileData.avatar) {
      return profileData.avatar;
    } else {
      return require('../assets/idea.png');
    }
  };
  
  // Use real user data from auth context, with fallbacks
  const [profileData, setProfileData] = useState({
    name: '',
    location: '',
    summary: '',
    avatar: require('../assets/idea.png'),
    jobHistory: [],
    education: [],
    skills: [],
    specialReqs: [],
    workType: { contractTypes: [], workModes: [] }
  });

  // Update local state when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setProfileData({
        name: userProfile.displayName || `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || '',
        location: userProfile.city ? `${userProfile.suburb || ''} ${userProfile.city}`.trim() : '',
        summary: userProfile.summary || '',
        avatar: userProfile.photoURL || require('../assets/idea.png'),
        jobHistory: userProfile.jobHistory || [],
        education: userProfile.education || [],
        skills: userProfile.skills || [],
        specialReqs: userProfile.specialReqs || [],
        workType: userProfile.workType || { contractTypes: [], workModes: [] }
      });
    }
  }, [userProfile]);

  // Handle avatar changes
  const handleAvatarChange = async (newAvatar) => {
    setProfileData(prev => ({
      ...prev,
      avatar: newAvatar
    }));

    // Upload avatar to Firebase Storage if it's a new image
    if (newAvatar && newAvatar.uri && user) {
      try {
        const photoURL = await uploadAvatarForUser(user.uid, newAvatar.uri);
        await updateUserProfile(user.uid, { photoURL });
        await refreshUserProfile();
      } catch (error) {
        console.error('Failed to update avatar:', error);
      }
    } else if (!newAvatar.uri && user) {
      // Remove avatar
      try {
        await updateUserProfile(user.uid, { photoURL: null });
        await refreshUserProfile();
      } catch (error) {
        console.error('Failed to remove avatar:', error);
      }
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const saveProfile = async () => {
    if (!user) return;
    
    try {
      const [firstName, ...lastNameParts] = profileData.name.split(' ');
      const lastName = lastNameParts.join(' ');
      
      await updateUserProfile(user.uid, {
        displayName: profileData.name,
        firstName: firstName || '',
        lastName: lastName || '',
        city: profileData.location.split(' ').pop() || '',
        suburb: profileData.location.split(' ').slice(0, -1).join(' ') || '',
        summary: profileData.summary,
        jobHistory: profileData.jobHistory,
        skills: profileData.skills,
        education: profileData.education,
        specialReqs: profileData.specialReqs,
        workType: profileData.workType
      });
      
      await refreshUserProfile();
      setIsEditing(false);
      console.log('Profile saved');
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        {/* Sticky Header */}
        <View style={styles.stickyHeader}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.editButton} onPress={isEditing ? saveProfile : toggleEdit}>
            <Text style={styles.editButtonText}>{isEditing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <AvatarUpload
            avatar={profileData.avatar}
            onAvatarChange={handleAvatarChange}
            size={120}
            showUploadButton={isEditing}
            buttonText={isEditing ? undefined : null}
            disabled={!isEditing}
            style={styles.avatarUploadContainer}
            onAvatarPress={() => setIsImageModalVisible(true)}
          />
          <View style={styles.profileInfo}>
            {isEditing ? (
              <TextInput
                style={styles.nameInput}
                value={profileData.name}
                onChangeText={(text) => setProfileData({...profileData, name: text})}
                placeholder="Enter your name"
              />
            ) : (
              <Text style={[styles.name, !profileData.name && styles.placeholder]}>
                {profileData.name || 'Name not set'}
              </Text>
            )}
            
            {isEditing ? (
              <View style={styles.locationInputContainer}>
                <Ionicons name="location-sharp" size={14} color={theme.secondary} style={styles.locationIcon} />
                <TextInput
                  style={styles.locationInput}
                  value={profileData.location}
                  onChangeText={(text) => setProfileData({...profileData, location: text})}
                  placeholder="Enter your location (optional)"
                  placeholderTextColor={theme.secondary}
                />
              </View>
            ) : (
              <View style={styles.locationContainer}>
                <Ionicons 
                  name="location-sharp" 
                  size={16} 
                  color={profileData.location ? "#666" : "#999"} 
                  style={styles.locationIcon} 
                />
                <Text style={[styles.location, !profileData.location && styles.placeholder]}>
                  {profileData.location || 'No location set'}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Job History */}
        <JobHistorySection
          jobHistory={profileData.jobHistory}
          onUpdateJobHistory={(updatedHistory) => 
            setProfileData({...profileData, jobHistory: updatedHistory})
          }
          isEditing={isEditing}
        />
     
        {/* Education */}
        <EducationSection
          education={profileData.education}
          onUpdateEducation={(updatedEducation) => 
            setProfileData({...profileData, education: updatedEducation})
          }
          isEditing={isEditing}
        />

        {/* Skills */}
        <SkillsSection
          skills={profileData.skills}
          onUpdateSkills={(updatedSkills) => 
            setProfileData({...profileData, skills: updatedSkills})
          }
          isEditing={isEditing}
        />

        {/* Personal Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Summary</Text>
          {isEditing ? (
            <TextInput
              style={styles.summaryInput}
              value={profileData.summary}
              onChangeText={(text) => setProfileData({...profileData, summary: text})}
              placeholder="Tell everyone a bit about yourself (optional)."
              multiline
              numberOfLines={4}
            />
          ) : (
            <View style={styles.textBlock}>
              <Text style={[styles.textContent, !profileData.summary && styles.placeholder]}>
                {profileData.summary || 'Tell everyone a bit about yourself. Tap Edit to add.'}
              </Text>
            </View>
          )}
        </View>

          <SpecialReqSection
           specialReqs={profileData.specialReqs}
           onUpdateSpecialReqs={(updatedSpecialReqs) => 
             setProfileData({...profileData, specialReqs: updatedSpecialReqs})
           }
           isEditing={isEditing}
          />

         {/* Work Type */}
         <WorkTypeSection
           workType={profileData.workType}
           onUpdateWorkType={(updatedWorkType) => 
             setProfileData({...profileData, workType: updatedWorkType})
           }
           isEditing={isEditing}
         />
 
          {/* Bottom spacer to avoid content under nav */}
        <View style={{ height: 90 }} />
        </ScrollView>
        <BottomNav />
      </KeyboardAvoidingView>

      {/* Avatar Image Modal */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsImageModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIsImageModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Image 
              source={getModalAvatarSource()}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  stickyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: theme.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: theme.background,
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.primary,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.primary,
    borderRadius: 8,
  },
  editButtonText: {
    color: theme.background,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 90,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarUploadContainer: {
    marginRight: 20,
    marginBottom: 0,
  },
  profileInfo: {
    flex: 1,
    marginTop: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
    textAlign: 'right',
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'right',
    color: theme.border,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: theme.searchBar,
    borderRadius: 4,
    padding: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: theme.searchBar,
    borderRadius: 4,
    padding: 8,
  },
  locationIcon: {
    marginRight: 8,
  },
  location: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
    fontStyle: 'italic',
  },
  locationInput: {
    fontSize: 16,
    color: theme.secondary,
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 16,
  },
  summaryInput: {
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.text,
    textAlignVertical: 'top',
    minHeight: 100,
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
  jobItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  jobDuration: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  jobCompany: {
    fontSize: 16,
    color: '#432272',
    fontWeight: '600',
    marginBottom: 8,
  },
  jobDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },


  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 10,
  },
  closeButton: {
    position: 'absolute',
    top: -20,
    right: 10,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  placeholder: {
    color: '#999',
    fontSize: 14,
  },
});
