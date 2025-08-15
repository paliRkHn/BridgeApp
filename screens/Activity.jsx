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

const { width } = Dimensions.get('window');

export default function Activity() {
  const navigation = useNavigation();
  const route = useRoute();
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

  // Sample saved items (like JobList) with statuses
  const savedItems = [
    {
      id: 1,
      title: 'Community Support Worker',
      image: require('../assets/job-offer.png'),
      items: ['Part-time position', 'Shift work available', 'Immediate start'],
      status: 'APPLIED',
    },
    {
      id: 2,
      title: 'Program Coordinator',
      image: require('../assets/job-offer.png'),
      items: ['Full-time role', 'Lead community programs', '3+ years experience'],
      status: 'IN PROCESS',
    },
    {
      id: 3,
      title: 'Outreach Specialist',
      image: require('../assets/job-offer.png'),
      items: ['Contract role', 'Travel within metro area', 'Must have driver license'],
      status: 'CLOSED',
    },
  ];

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
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
          <View style={styles.savedListContainer}>
            {savedItems.map((item) => (
              <View key={item.id} style={styles.savedItem}>
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
              </View>
            ))}
          </View>
        )}
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
    backgroundColor: '#f0eef5',
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
    backgroundColor: '#432272',
  },
  tabText: {
    color: '#432272',
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
    color: '#666',
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
    color: '#333',
  },
  activityDay: {
    backgroundColor: '#432272',
    color: '#fff',
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
    color: '#432272',
    marginBottom: 16,
  },
  activityItem: {
    marginBottom: 20,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  activityDescriptionBlock: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#432272',
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  // Saved Tab styles
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
    marginTop: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#432272',
    marginRight: 8,
    marginTop: 2,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
