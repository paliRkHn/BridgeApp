import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  
  // Sample profile data
  const [profileData, setProfileData] = useState({
    name: 'Sarah Johnson',
    location: 'Melbourne, Australia',
    summary: 'Experienced community worker with a passion for helping others. Skilled in program coordination and building meaningful relationships with diverse populations.',
    avatar: 'https://via.placeholder.com/120x120/432272/FFFFFF?text=SJ'
  });

  const jobHistory = [
    {
      id: 1,
      title: 'Community Coordinator',
      company: 'Bridge Community Services',
      duration: '2021 - Present',
      description: 'Coordinate community programs and support services for diverse populations.'
    },
    {
      id: 2,
      title: 'Social Worker',
      company: 'Melbourne Social Services',
      duration: '2019 - 2021',
      description: 'Provided direct support to individuals and families in need.'
    },
    {
      id: 3,
      title: 'Volunteer Coordinator',
      company: 'Local Community Center',
      duration: '2017 - 2019',
      description: 'Managed volunteer programs and community outreach initiatives.'
    }
  ];

  const education = [
    {
      id: 1,
      degree: 'Bachelor of Social Work',
      institution: 'University of Melbourne',
      year: '2017',
      description: 'Major in Community Development and Social Policy'
    },
    {
      id: 2,
      degree: 'Certificate in Mental Health First Aid',
      institution: 'Mental Health Australia',
      year: '2020',
      description: 'Certified to provide initial support to people experiencing mental health issues'
    }
  ];

  const skills = [
    'Program Coordination',
    'Community Outreach',
    'Case Management',
    'Crisis Intervention',
    'Cultural Sensitivity',
    'Team Leadership',
    'Documentation',
    'Public Speaking'
  ];

  const goBack = () => {
    navigation.navigate('Dashboard');
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const saveProfile = () => {
    setIsEditing(false);
    // Here you would typically save to a database
    console.log('Profile saved');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.editButton} onPress={isEditing ? saveProfile : toggleEdit}>
            <Text style={styles.editButtonText}>{isEditing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: profileData.avatar }} 
            style={styles.avatar}
            resizeMode="cover"
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
              <Text style={styles.name}>{profileData.name}</Text>
            )}
            
            {isEditing ? (
              <TextInput
                style={styles.locationInput}
                value={profileData.location}
                onChangeText={(text) => setProfileData({...profileData, location: text})}
                placeholder="Enter your location (optional)"
              />
            ) : (
              profileData.location && <Text style={styles.location}>{profileData.location}</Text>
            )}
          </View>
        </View>

        {/* Personal Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Summary</Text>
          {isEditing ? (
            <TextInput
              style={styles.summaryInput}
              value={profileData.summary}
              onChangeText={(text) => setProfileData({...profileData, summary: text})}
              placeholder="Write a brief summary about yourself (optional)"
              multiline
              numberOfLines={4}
            />
          ) : (
            profileData.summary && (
              <View style={styles.textBlock}>
                <Text style={styles.textContent}>{profileData.summary}</Text>
              </View>
            )
          )}
        </View>

        {/* Job History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job History</Text>
          {jobHistory.map((job) => (
            <View key={job.id} style={styles.jobItem}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.jobDuration}>{job.duration}</Text>
              </View>
              <Text style={styles.jobCompany}>{job.company}</Text>
              <Text style={styles.jobDescription}>{job.description}</Text>
            </View>
          ))}
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {education.map((edu) => (
            <View key={edu.id} style={styles.educationItem}>
              <View style={styles.educationHeader}>
                <Text style={styles.educationDegree}>{edu.degree}</Text>
                <Text style={styles.educationYear}>{edu.year}</Text>
              </View>
              <Text style={styles.educationInstitution}>{edu.institution}</Text>
              <Text style={styles.educationDescription}>{edu.description}</Text>
            </View>
          ))}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#432272',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#432272',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#432272',
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 8,
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  locationInput: {
    fontSize: 16,
    color: '#666',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 8,
  },
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
  summaryInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 100,
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
  educationItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  educationDegree: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  educationYear: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  educationInstitution: {
    fontSize: 16,
    color: '#432272',
    fontWeight: '600',
    marginBottom: 8,
  },
  educationDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#432272',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
