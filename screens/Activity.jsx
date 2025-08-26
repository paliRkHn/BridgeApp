import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  Image 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Activity() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userProfile } = useAuth();
  const { theme } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState(
    route?.params?.initialTab === 'Saved' ? 'Saved' : 'Activity'
  );
  
  // Sample activity dates - these would come from your data
  const activityDates = [5, 12, 18, 25, 30];
  
  // Sample activity types
  const activityTypes = [
    { title: 'Physical Activity', description: 'Exercise, sports, and movement activities' },
    { title: 'Social Events', description: 'Community gatherings and social interactions' },
    { title: 'Learning Sessions', description: 'Educational workshops and skill development' },
    { title: 'Creative Activities', description: 'Arts, crafts, and creative expression' },
    { title: 'Wellness Programs', description: 'Mental health and wellness activities' }
  ];

  // Get saved jobs from user profile or use sample data
  const userSavedJobs = userProfile?.savedJobs || [];
  
  // Sample saved items (kept as examples) with statuses
  const sampleSavedItems = [
    {
      id: 'sample-1',
      title: 'Community Support Worker',
      image: require('../assets/job-offer.png'),
      items: ['Part-time position', 'Shift work available', 'Immediate start'],
      status: 'APPLIED',
    },
    {
      id: 'sample-2',
      title: 'Program Coordinator',
      image: require('../assets/job-offer.png'),
      items: ['Full-time role', 'Lead community programs', '3+ years experience'],
      status: 'IN PROCESS',
    },
    {
      id: 'sample-3',
      title: 'Outreach Specialist',
      image: require('../assets/job-offer.png'),
      items: ['Contract role', 'Travel within metro area', 'Must have driver license'],
      status: 'CLOSED',
    },
  ];

  // Combine user saved jobs with sample items
  const savedItems = [...userSavedJobs, ...sampleSavedItems];

  const goBack = () => {
    navigation.goBack();
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    if (direction === 'next') {
      newMonth.setMonth(newMonth.getMonth() + 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() - 1);
    }
    setCurrentMonth(newMonth);
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Activity' && styles.activeTabButton]}
          onPress={() => setActiveTab('Activity')}
        >
          <Text style={[styles.tabText, activeTab === 'Activity' && styles.activeTabText]}>Activity</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Saved' && styles.activeTabButton]}
          onPress={() => setActiveTab('Saved')}
        >
          <Text style={[styles.tabText, activeTab === 'Saved' && styles.activeTabText]}>Saved</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === 'Activity' ? (
          <>
            {/* Calendar Section */}
            <View style={styles.calendarContainer}>
              <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={() => changeMonth('prev')}>
                  <Text style={styles.monthButton}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.monthTitle}>{getMonthName(currentMonth)}</Text>
                <TouchableOpacity onPress={() => changeMonth('next')}>
                  <Text style={styles.monthButton}>›</Text>
                </TouchableOpacity>
              </View>

              {/* Week days header */}
              <View style={styles.weekDaysContainer}>
                {weekDays.map((day, index) => (
                  <Text key={index} style={styles.weekDay}>{day}</Text>
                ))}
              </View>

              {/* Calendar grid */}
              <View style={styles.calendarGrid}>
                {days.map((day, index) => (
                  <View key={index} style={styles.dayCell}>
                    {day && (
                      <Text style={[
                        styles.dayText,
                        activityDates.includes(day) && styles.activityDay
                      ]}>
                        {day}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Activity Types Section */}
            <View style={styles.activityTypesContainer}>
              <Text style={styles.sectionTitle}>Activity Types</Text>
              {activityTypes.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <View style={styles.activityDescriptionBlock}>
                    <Text style={styles.activityDescription}>{activity.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.savedContainer}>
            {/* Real Saved Jobs Section */}
            {userSavedJobs.length > 0 && (
              <View style={styles.savedJobsSection}>
                <Text style={styles.savedSectionTitle}>Your Saved Jobs</Text>
                <View style={styles.elementsContainer}>
                  {userSavedJobs.map((job) => (
                    <TouchableOpacity
                      key={job.id}
                      style={styles.elementContainer}
                      onPress={() => navigation.navigate('JobDescription', { jobId: job.id })}
                    >
                      <View style={styles.elementItem}>
                        <Image
                          source={typeof job.image === 'string' ? { uri: job.image } : job.image}
                          style={styles.elementImage}
                          resizeMode="contain"
                        />
                        <View style={styles.elementContent}>
                          <Text style={styles.elementTitle}>{job.title}</Text>
                          <View style={styles.elementList}>
                            {Array.isArray(job.items) && job.items.map((item, index) => (
                              <View key={index} style={styles.listItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.listItemText}>{item}</Text>
                              </View>
                            ))}
                            {job.company && (
                              <View style={styles.listItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.listItemText}>{job.company}</Text>
                              </View>
                            )}
                            {job.category && (
                              <View style={styles.listItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.listItemText}>{job.category}</Text>
                              </View>
                            )}
                            {job.jobType && (
                              <View style={styles.listItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.listItemText}>{job.jobType}</Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                      {/* Location or Remote Tag */}
                      {job.location?.workMode === 'Remote' ? (
                        <View style={styles.listLocation}>
                          <View style={styles.remoteTag}>
                            <Text style={styles.remoteTagText}>REMOTE</Text>
                          </View>
                        </View>
                      ) : ((job.location?.suburb || job.location?.city) && (
                        <View style={styles.listLocation}>
                          <View style={styles.bulletIcon}>
                            <Ionicons name="location-sharp" size={16} color={theme.primary} />
                          </View>
                          <Text style={styles.listLocationText}>
                            {`${job.location.suburb || ''}${job.location.suburb && job.location.city ? ', ' : ''}${job.location.city || ''}`}
                          </Text>
                        </View>
                      ))}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Example Data Section */}
            <View style={styles.exampleSection}>
              <View style={styles.savedListContainer}>
                {sampleSavedItems.map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.savedItem}
                    disabled={true} // Make examples non-clickable
                  >
                    <Image source={item.image} style={styles.savedImage} resizeMode="cover" />
                    <View style={styles.savedContent}>
                      <View style={styles.savedTitleRow}>
                        <Text style={styles.savedTitle}>{item.title}</Text>
                        <View
                          style={[
                            styles.statusTag,
                            item.status === 'APPLIED' && { backgroundColor: '#2e7d32' },
                            item.status === 'IN PROCESS' && { backgroundColor: '#f9a825' },
                            item.status === 'CLOSED' && { backgroundColor: '#9e9e9e' },
                          ]}
                        >
                          <Text style={styles.statusTagText}>{item.status}</Text>
                        </View>
                      </View>
                      <View style={styles.elementList}>
                        {item.items.map((point, idx) => (
                          <View key={idx} style={styles.listItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.listItemText}>{point}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: theme.card,
    borderRadius: 10,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: theme.primary,
  },
  tabText: {
    color: theme.primary,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  calendarContainer: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    margin: 16,
    borderRadius: 12,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthButton: {
    fontSize: 24,
    color: '#432272',
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#432272',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: theme.secondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: (width - 80) / 7,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  dayText: {
    fontSize: 16,
    color: theme.text,
  },
  activityDay: {
    backgroundColor: theme.primary,
    color: theme.background,
    borderRadius: 20,
    width: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: 'bold',
  },
  activityTypesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 16,
  },
  activityItem: {
    marginBottom: 20,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },
  activityDescriptionBlock: {
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
  },
  activityDescription: {
    fontSize: 14,
    color: theme.secondary,
    lineHeight: 20,
  },
  // Saved Tab styles
  savedContainer: {
    paddingTop: 12,
  },
  savedJobsSection: {
    marginBottom: 24,
  },
  exampleSection: {
    marginBottom: 24,
  },
  savedSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  // JobList-style elements for saved jobs
  elementsContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  elementContainer: {
    flexDirection: 'column',
    backgroundColor: theme.card,
    alignItems: 'center',
    width: '100%',
    borderRadius: 10,
  },
  elementItem: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 6,
    marginBottom: 2,
    alignItems: 'flex-start',
  },
  elementImage: {
    width: 75,
    height: 75,
    borderRadius: 8,
    marginRight: 20,
    marginLeft: 2,
  },
  elementContent: {
    flex: 1,
  },
  elementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 15,
    textAlign: 'right',
  },
  listLocation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
    marginBottom: 16,
  },
  listLocationText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bulletIcon: {
    width: 16,
    height: 20,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remoteTag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#432272',
    opacity: 0.95,
  },
  remoteTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  // Original example data styles
  savedListContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  savedItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  savedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  savedContent: {
    flex: 1,
  },
  savedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  savedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
    flex: 1,
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  elementList: {
    marginTop: 10,
    marginLeft: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#432272',
    marginRight: 10,
    marginLeft: 12,
    marginTop: 0,
  },
  listItemText: {
    flex: 1,
    fontSize: 15,
    color: '#4c4c4c',
    lineHeight: 20,
    marginRight: 20,
  },
});
