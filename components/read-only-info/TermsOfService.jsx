import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const defaultTheme = {
  background: '#FFFFFF',
  text: '#333333',
  primary: '#432272',
  secondary: '#666666',
  card: '#f8f9fa',
  border: '#e0e0e0'
};

export default function TermsOfService() {
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  const styles = getStyles(defaultTheme);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={goBack}
          accessible={true}
          accessibilityLabel="Go back"
          accessibilityHint="Return to the previous screen"
          accessibilityRole="button"
        >
          <MaterialIcons name="arrow-back" size={24} color={defaultTheme.background} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: defaultTheme.primary }]}>Terms of Service</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Terms Content */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentContainer}>
          <Text style={[styles.lastUpdated, { color: defaultTheme.secondary }]}>
            Last Updated: August 28, 2025
          </Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              1. Acceptance of Terms
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              By using Bridge App, you agree to these Terms and Conditions. If you don't agree, please don't use our service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              2. Description of Service
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              Bridge App is a job portal specifically designed for neurodivergent job seekers, with a focus on accessibility and customization features. Our platform helps users create profiles, browse job opportunities, save listings, apply for positions, and manage their job search activity.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              3. User Accounts and Registration
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • You must register using a valid email address and password{'\n'}
              • Account authentication is managed through Firebase Authentication Service{'\n'}
              • You are responsible for maintaining the security of your login credentials{'\n'}
              • You must be at least 16 years old to use this service{'\n'}
              • You are responsible for all activities that occur under your account
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              4. User Profiles and Content
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • You may create a profile, upload an avatar image, and add resume and cover letter files{'\n'}
              • You retain ownership of all content you upload (images, documents, profile information){'\n'}
              • You grant us a license to store and display your content for the purpose of providing our job portal services{'\n'}
              • You are responsible for ensuring your uploaded content is appropriate and doesn't violate others' rights{'\n'}
              • We are not responsible for the accuracy or completeness of user-generated content
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              5. Permissions and Data Access
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              By using Bridge App, you consent to our access to:{'\n'}
              • Camera: For uploading profile pictures and documents{'\n'}
              • Location: For location-based job searching and relevant job recommendations{'\n'}
              • All data is stored securely in our Firestore database and handled according to our Privacy Policy
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              6. Acceptable Use
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              You agree NOT to:{'\n'}
              • Post false, misleading, or inappropriate content in your profile or applications{'\n'}
              • Upload malicious files, viruses, or inappropriate images{'\n'}
              • Attempt to hack, disrupt, or damage our service or database{'\n'}
              • Create multiple accounts or fake profiles{'\n'}
              • Harass employers or other users{'\n'}
              • Use the service for any illegal purposes{'\n'}
              • Violate any applicable employment or anti-discrimination laws
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              7. Job Applications and Employer Relations
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • Bridge App facilitates connections between job seekers and employers but is not responsible for hiring decisions{'\n'}
              • We don't guarantee job placement or interview opportunities{'\n'}
              • Employers are responsible for their own job postings and hiring practices{'\n'}
              • You are responsible for the accuracy of information in your job applications
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              8. Accessibility and Customization Features
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • We strive to maintain high accessibility standards and customization options{'\n'}
              • Features may be updated or modified to improve user experience{'\n'}
              • We welcome feedback on accessibility improvements
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              9. Privacy and Data Protection
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • Your personal information, profile data, and uploaded files are stored in our secure Firestore database{'\n'}
              • We collect and use your data as described in our Privacy Policy{'\n'}
              • We don't sell your personal information to third parties{'\n'}
              • Job application data may be shared with relevant employers when you apply for positions
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              10. Service Availability
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • We strive to keep Bridge App available 24/7, but can't guarantee uninterrupted service{'\n'}
              • We may perform maintenance, updates, or modifications at any time{'\n'}
              • We reserve the right to suspend or terminate service for violations of these terms
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              11. Account Termination
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • You may delete your account at any time through app settings{'\n'}
              • We may suspend or terminate accounts that violate these terms{'\n'}
              • Upon termination, your profile and uploaded content may be removed from our database
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              12. Limitation of Liability
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              Bridge App is provided "as is" without warranties. We're not liable for:{'\n'}
              • Employment outcomes or hiring decisions{'\n'}
              • Loss of data or uploaded files{'\n'}
              • Service interruptions or technical issues{'\n'}
              • Actions of employers or other users{'\n'}
              • Indirect or consequential damages
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              13. Changes to Terms
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              We may update these Terms and Conditions from time to time. We'll notify users of significant changes through the app or email.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              14. Intellectual Property
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • Bridge App's design, features, accessibility tools, and technology are protected by intellectual property laws{'\n'}
              • You may not copy, modify, or distribute our proprietary features or code
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              15. Governing Law
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              These terms are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved in the courts of [Your Location].
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              16. Contact Information
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              For questions about these Terms and Conditions, please contact us at [Your Contact Email].
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: defaultTheme.secondary }]}>
              Bridge App is committed to providing an accessible, inclusive job search experience for the neurodivergent community.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (defaultTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultTheme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: defaultTheme.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: defaultTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: defaultTheme.primary,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  lastUpdated: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  footer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: defaultTheme.border,
  },
  footerText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
});
