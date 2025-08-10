import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function Activity() {
  const navigation = useNavigation();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
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
});
