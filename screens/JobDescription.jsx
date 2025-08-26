import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  Dimensions
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function JobDescription() {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { user, userProfile, updateUserProfile, refreshUserProfile } = useAuth();
  const { jobId } = route.params || {};
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const goBack = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    if (!user || !job || isSaving) return;

    setIsSaving(true);
    try {
      const savedJobs = userProfile?.savedJobs || [];
      let updatedSavedJobs;

      if (isSaved) {
        // Remove from saved jobs
        updatedSavedJobs = savedJobs.filter(savedJob => savedJob.id !== jobId);
        setIsSaved(false);
        console.log('Job removed from saved');
      } else {
        // Add to saved jobs
        const jobToSave = {
          id: jobId,
          title: job.title || 'Untitled Job',
          company: job.company || 'Unknown Company',
          image: job.logo || require('../assets/job-offer.png'),
          items: job.items || [],
          status: 'SAVED',
          savedAt: new Date().toISOString(),
          category: job.category || '',
          jobType: job.jobType || '',
          location: job.location || {}
        };
        updatedSavedJobs = [...savedJobs, jobToSave];
        setIsSaved(true);
        console.log('Job added to saved');
      }

      // Update user profile
      await updateUserProfile(user.uid, {
        savedJobs: updatedSavedJobs
      });
      
      await refreshUserProfile();
    } catch (error) {
      console.error('Error saving job:', error);
      // Revert the state if there was an error
      setIsSaved(!isSaved);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = () => {
    // Handle apply functionality
    console.log('Job applied');
  };

  useEffect(() => {
    let isActive = true;
    async function fetchJob() {
      if (!jobId) {
        setLoading(false);
        return;
      }
      try {
        const ref = doc(db, 'jobs', jobId);
        const snap = await getDoc(ref);
        if (snap.exists() && isActive) {
          setJob(snap.data());
        }
      } catch (e) {
        console.log('Failed to fetch job', e);
      } finally {
        if (isActive) setLoading(false);
      }
    }
    fetchJob();
    return () => { isActive = false; };
  }, [jobId]);

  // Check if job is already saved
  useEffect(() => {
    if (userProfile && jobId) {
      const savedJobs = userProfile.savedJobs || [];
      setIsSaved(savedJobs.some(savedJob => savedJob.id === jobId));
    }
  }, [userProfile, jobId]);

  const bannerUri = (job && job.banner) || 'https://via.placeholder.com/400x200/432272/FFFFFF?text=JOB+BANNER';

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.bannerContainer}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/400x200/432272/FFFFFF?text=LOADING...' }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </View>
        </ScrollView>
        <BottomNav />
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.bannerContainer}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/400x200/432272/FFFFFF?text=NOT+FOUND' }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Job not found</Text>
            <Text style={styles.textContent}>The job you are looking for does not exist.</Text>
          </View>
        </ScrollView>
        <BottomNav />
      </SafeAreaView>
    );
  }

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Banner Image */}
        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: bannerUri }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Section 3: Requirements */}
          {!!(job?.category || job?.company || job?.jobType) && (
            <View style={styles.section}>
              <Text style={[styles.roleTitle, { color: theme.primary }]}>{job?.title || 'Job Overview'}</Text>
              <View style={styles.textBlock}>
                {!!job?.company && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.text }]}>Company: </Text>
                    <Text style={[styles.detailValue, { color: theme.text }]}>{job.company}</Text>
                  </View>
                )}
                {!!job?.category && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.text }]}>Category: </Text>
                    <Text style={[styles.detailValue, { color: theme.text }]}>{job.category}</Text>
                  </View>
                )}
                {!!job?.jobType && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.text }]}>Job type: </Text>
                    <Text style={[styles.detailValue, { color: theme.text }]}>{job.jobType}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Section 1: Job Overview */}
          <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.textBlock}>
              <Text style={styles.textContent}>
                {job?.description || 'No description provided.'}
              </Text>
            </View>
          </View>

          {/* Section 2: Responsibilities */}
          {!!(job?.tasks && job.tasks.length) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tasks</Text>
              <View style={styles.textBlock}>
                <Text style={styles.textContent}>
                  {job.tasks.map((t, i) => `• ${t}${i < job.tasks.length - 1 ? '\n' : ''}`).join('')}
                </Text>
              </View>
            </View>
          )}

          {/* Section 3: Requirements */}
          {!!(job?.category || job?.company || job?.jobType) && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.primary }]}>Details</Text>
              <View style={styles.textBlock}>
                {!!job?.company && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.text }]}>Company: </Text>
                    <Text style={[styles.detailValue, { color: theme.text }]}>{job.company}</Text>
                  </View>
                )}
                {!!job?.category && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.text }]}>Category: </Text>
                    <Text style={[styles.detailValue, { color: theme.text }]}>{job.category}</Text>
                  </View>
                )}
                {!!job?.jobType && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.text }]}>Job type: </Text>
                    <Text style={[styles.detailValue, { color: theme.text }]}>{job.jobType}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Section 4: Benefits */}
          {!!(job?.location) && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.primary }]}>Location</Text>
              <View style={styles.textBlock}>
                <Text style={[styles.textContent, { color: theme.text }]}>
                  {`${job.location.suburb || ''}${job.location.suburb && job.location.city ? ', ' : ''}${job.location.city || ''}`}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              { borderColor: theme.primary },
              isSaved && { backgroundColor: theme.primary }
            ]} 
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={[
              styles.saveButtonText, 
              { color: isSaved ? '#fff' : theme.primary },
              isSaving && { opacity: 0.7 }
            ]}>
              {isSaving ? 'Saving...' : (isSaved ? 'Saved' : 'Save')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.applyButton, { backgroundColor: theme.primary }]} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
        {/* Bottom spacer to avoid content under nav */}
        <View style={{ height: 90 }} />
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  bannerContainer: {
    width: '100%',
    height: height * 0.25, // 25% of screen height
    paddingRight: 10,
    paddingLeft: 10,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 12,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 12,
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
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#432272',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#432272',
    fontSize: 18,
    fontWeight: 'bold',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#432272',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
