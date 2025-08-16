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

const { width, height } = Dimensions.get('window');

export default function JobDescription() {
  const navigation = useNavigation();
  const route = useRoute();
  const { jobId } = route.params || {};
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const goBack = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    // Handle save functionality
    console.log('Job saved');
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

  const bannerUri = (job && job.banner) || 'https://via.placeholder.com/400x200/432272/FFFFFF?text=JOB+BANNER';

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
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
      <SafeAreaView style={styles.container}>
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
              <Text style={styles.roleTitle}>{job?.title || 'Job Overview'}</Text>              
              <View style={styles.textBlock}>
                <Text style={styles.textContent}>
                  {job?.company ? `Company: ${job.company}\n` : ''}
                  {job?.category ? `Category: ${job.category}\n` : ''}
                  {job?.jobType ? `${job.jobType}` : ''}
                </Text>
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
              <Text style={styles.sectionTitle}>Details</Text>
              <View style={styles.textBlock}>
                <Text style={styles.textContent}>
                  {job?.company ? `Company: ${job.company}\n` : ''}
                  {job?.category ? `Category: ${job.category}\n` : ''}
                  {job?.jobType ? `${job.jobType}` : ''}
                </Text>
              </View>
            </View>
          )}

          {/* Section 4: Benefits */}
          {!!(job?.location) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              <View style={styles.textBlock}>
                <Text style={styles.textContent}>
                  {`${job.location.suburb || ''}${job.location.suburb && job.location.city ? ', ' : ''}${job.location.city || ''}`}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#432272',
    marginBottom: 12,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#432272',
    marginBottom: 12,
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
