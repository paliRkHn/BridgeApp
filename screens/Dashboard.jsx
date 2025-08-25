import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, Text, Image, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Dashboard() {
  const navigation = useNavigation();
  const { user, userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getUserName = () => {
    if (userProfile?.displayName) return userProfile.displayName;
    if (userProfile?.firstName) return userProfile.firstName;
    if (user?.displayName) return user.displayName;
    return 'there';
  };

  const savedJobsCount = userProfile?.savedJobs?.length || 0;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to JobList with search query
      navigation.navigate('JobList', { searchQuery: searchQuery.trim() });
    } else {
      // Navigate to JobList without search
      navigation.navigate('JobList');
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Welcome Header */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeContent}>
            <Text style={styles.greetingText}>{getGreeting()},</Text>
            <Text style={styles.nameText}>{getUserName()}!</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Image 
              source={userProfile?.photoURL ? { uri: userProfile.photoURL } : require('../assets/idea.png')}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Enhanced Search Bar */}
        <TouchableOpacity style={styles.searchContainer} onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search jobs, companies..."
            placeholderTextColor="#999"
            autoCapitalize="none"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </TouchableOpacity>

        {/* Main Actions Grid */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('JobList')}>
          <LinearGradient
            colors={['#432272', '#6a4c93']}
            style={styles.gradientCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="briefcase" size={32} color="#fff" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Browse Jobs</Text>
            <Text style={styles.cardSubtitle}>Find opportunities</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Activity', { initialTab: 'Saved' })}>
          <LinearGradient
            colors={['#e74c3c', '#f39c12']}
            style={styles.gradientCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="bookmark" size={32} color="#fff" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Saved Jobs</Text>
            <Text style={styles.cardSubtitle}>{savedJobsCount} saved</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <LinearGradient
            colors={['#3498db', '#2980b9']}
            style={styles.gradientCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="document-text" size={32} color="#fff" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Templates</Text>
            <Text style={styles.cardSubtitle}>CV & Cover letters</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Profile')}>
          <LinearGradient
            colors={['#27ae60', '#2ecc71']}
            style={styles.gradientCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="person" size={32} color="#fff" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Profile</Text>
            <Text style={styles.cardSubtitle}>Manage details</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Secondary Actions */}
      <Text style={styles.sectionTitle}>More Options</Text>
      <View style={styles.secondaryActionsContainer}>
        <TouchableOpacity style={styles.secondaryAction} onPress={() => navigation.navigate('Activity')}>
          <View style={styles.secondaryActionIcon}>
            <Ionicons name="time" size={24} color="#432272" />
          </View>
          <View style={styles.secondaryActionContent}>
            <Text style={styles.secondaryActionTitle}>Activity</Text>
            <Text style={styles.secondaryActionSubtitle}>Track your progress</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryAction}>
          <View style={styles.secondaryActionIcon}>
            <Ionicons name="settings" size={24} color="#432272" />
          </View>
          <View style={styles.secondaryActionContent}>
            <Text style={styles.secondaryActionTitle}>Settings</Text>
            <Text style={styles.secondaryActionSubtitle}>Customize your experience</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryAction}>
          <View style={styles.secondaryActionIcon}>
            <Ionicons name="help-circle" size={24} color="#432272" />
          </View>
          <View style={styles.secondaryActionContent}>
            <Text style={styles.secondaryActionTitle}>Help & Support</Text>
            <Text style={styles.secondaryActionSubtitle}>Get assistance</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  
  // Welcome Section
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingTop: 10,
    marginBottom: 10,
  },
  welcomeContent: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  avatarContainer: {
    marginLeft: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#432272',
  },

  // Stats Section
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#432272',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },

  // Search Section
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchBar: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },

  // Section Titles
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },

  // Action Cards Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  gradientCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  cardIcon: {
    marginBottom: 12,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    textAlign: 'center',
  },

  // Secondary Actions
  secondaryActionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  secondaryActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  secondaryActionContent: {
    flex: 1,
  },
  secondaryActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  secondaryActionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});
