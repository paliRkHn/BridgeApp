import React from 'react';
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
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function JobDescription() {
  const navigation = useNavigation();

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Banner Image */}
        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/400x200/432272/FFFFFF?text=JOB+BANNER' }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Section 1: Job Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Overview</Text>
            <View style={styles.textBlock}>
              <Text style={styles.textContent}>
                This position offers an exciting opportunity to work in a dynamic environment where you'll be responsible for coordinating community activities and supporting participants in various programs. The role involves direct interaction with community members and requires strong organizational skills.
              </Text>
            </View>
          </View>

          {/* Section 2: Responsibilities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Responsibilities</Text>
            <View style={styles.textBlock}>
              <Text style={styles.textContent}>
                • Coordinate and facilitate community workshops and events{'\n'}
                • Provide support and guidance to program participants{'\n'}
                • Maintain accurate records and documentation{'\n'}
                • Collaborate with team members to ensure program success{'\n'}
                • Assist in the development of new community initiatives
              </Text>
            </View>
          </View>

          {/* Section 3: Requirements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            <View style={styles.textBlock}>
              <Text style={styles.textContent}>
                • Previous experience in community work or social services{'\n'}
                • Strong communication and interpersonal skills{'\n'}
                • Ability to work flexible hours including evenings and weekends{'\n'}
                • Valid driver's license and reliable transportation{'\n'}
                • First aid certification (or willingness to obtain)
              </Text>
            </View>
          </View>

          {/* Section 4: Benefits */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Benefits</Text>
            <View style={styles.textBlock}>
              <Text style={styles.textContent}>
                • Competitive salary with opportunities for advancement{'\n'}
                • Comprehensive health and dental coverage{'\n'}
                • Paid time off and holidays{'\n'}
                • Professional development and training opportunities{'\n'}
                • Meaningful work that makes a difference in the community
              </Text>
            </View>
          </View>
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
      </ScrollView>
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
