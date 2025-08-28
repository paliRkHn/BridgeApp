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

export default function PrivacyPolicy() {
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
        <Text style={[styles.title, { color: defaultTheme.primary }]}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Privacy Content */}
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
              1. Introduction
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              Bridge App is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our job portal platform designed for neurodivergent job seekers.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              2. Information We Collect
            </Text>
            <Text style={[styles.subSectionTitle, { color: defaultTheme.primary }]}>
              Personal Information
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • Account Information: Email address, password (encrypted through Firebase Authentication){'\n'}
              • Profile Information: Name, contact details, work experience, skills, and other career-related information you choose to share{'\n'}
              • Uploaded Content: Profile pictures, resume files, cover letters, and other documents you upload
            </Text>
            
            <Text style={[styles.subSectionTitle, { color: defaultTheme.primary }]}>
              Technical Information
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • Device Information: Device type, operating system, app version{'\n'}
              • Usage Data: How you interact with the app, features used, time spent on different sections{'\n'}
              • Location Data: Your location (when permission is granted) for location-based job recommendations
            </Text>
            
            <Text style={[styles.subSectionTitle, { color: defaultTheme.primary }]}>
              Permissions Data
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • Camera Access: Used only when you choose to upload photos or scan documents{'\n'}
              • Location Access: Used to show relevant local job opportunities and improve search results
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              3. How We Use Your Information
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              We use your information to:{'\n'}
              • Provide Services: Create and maintain your profile, enable job searching and applications{'\n'}
              • Job Matching: Show you relevant job opportunities based on your location, skills, and preferences{'\n'}
              • Communication: Send you job alerts, application updates, and important service notifications{'\n'}
              • Improve Accessibility: Enhance our accessibility features and customization options{'\n'}
              • App Improvement: Analyze usage patterns to improve our platform and user experience{'\n'}
              • Security: Protect against fraud, abuse, and unauthorized access
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              4. Data Storage and Security
            </Text>
            <Text style={[styles.subSectionTitle, { color: defaultTheme.primary }]}>
              Storage Location
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • All user data is securely stored in Google's Firestore database{'\n'}
              • Account authentication is managed through Firebase Authentication Service{'\n'}
              • Data is stored on secure servers with industry-standard encryption
            </Text>
            
            <Text style={[styles.subSectionTitle, { color: defaultTheme.primary }]}>
              Security Measures
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • All passwords are encrypted and never stored in plain text{'\n'}
              • Data transmission is encrypted using SSL/TLS protocols{'\n'}
              • Regular security audits and updates to protect your information{'\n'}
              • Access to user data is strictly limited to authorized personnel
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              5. Information Sharing
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              We share your information in these limited circumstances:
            </Text>
            
            <Text style={[styles.subSectionTitle, { color: defaultTheme.primary }]}>
              With Employers
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • When you apply for a job, relevant profile information and application materials are shared with that employer{'\n'}
              • You control what information is included in each application
            </Text>
            
            <Text style={[styles.subSectionTitle, { color: defaultTheme.primary }]}>
              Service Providers
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • Firebase/Google Cloud services for authentication and data storage{'\n'}
              • Analytics services to improve app performance (data is anonymized)
            </Text>
            
            <Text style={[styles.subSectionTitle, { color: defaultTheme.primary }]}>
              Legal Requirements
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • When required by law, court order, or legal process{'\n'}
              • To protect our rights, safety, or the safety of our users
            </Text>
            
            <Text style={[styles.boldText, { color: defaultTheme.text }]}>
              We DO NOT:
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • Sell your personal information to third parties{'\n'}
              • Share your data with advertisers{'\n'}
              • Use your information for marketing unrelated to job searching
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              6. Your Rights and Choices
            </Text>
            <Text style={[styles.subSectionTitle, { color: defaultTheme.primary }]}>
              Account Control
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • Access: View and download your personal information through your profile settings{'\n'}
              • Update: Modify your profile information, preferences, and uploaded content at any time{'\n'}
              • Delete: Delete your account and associated data through app settings
            </Text>
            
            <Text style={[styles.subSectionTitle, { color: defaultTheme.primary }]}>
              Privacy Controls
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • Location Sharing: Turn location access on/off in your device settings{'\n'}
              • Job Alerts: Customize notification preferences or opt out entirely{'\n'}
              • Profile Visibility: Control what information is visible to potential employers
            </Text>
            
            <Text style={[styles.subSectionTitle, { color: defaultTheme.primary }]}>
              Data Portability
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • Request a copy of your data in a portable format{'\n'}
              • Transfer your information to another service (where technically feasible)
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              7. Data Retention
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • Active Accounts: We retain your information while your account is active{'\n'}
              • Deleted Accounts: Personal information is deleted within 30 days of account deletion{'\n'}
              • Legal Requirements: Some data may be retained longer if required by law{'\n'}
              • Backup Systems: Data in backup systems is automatically purged according to our retention schedule
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              8. Accessibility and Special Needs
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              We recognize that our users may have specific privacy needs related to neurodivergence:{'\n'}
              • Simplified Controls: Privacy settings are designed to be clear and easy to understand{'\n'}
              • Customizable Options: Privacy preferences can be adjusted to match individual comfort levels{'\n'}
              • Support: We provide additional support for privacy-related questions
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              9. Children's Privacy
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              Bridge App is not intended for users under 16. We do not knowingly collect personal information from children under 16. If we become aware that a child under 16 has provided personal information, we will delete it immediately.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              10. International Users
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              If you're using Bridge App from outside [Your Country], please be aware that your information may be transferred to and processed in [Your Country] where our servers are located.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              11. Third-Party Services
            </Text>
            <Text style={[styles.subSectionTitle, { color: defaultTheme.primary }]}>
              Firebase/Google Cloud
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • Authentication and database services provided by Google{'\n'}
              • Subject to Google's Privacy Policy and security standards{'\n'}
              • Data processing agreements are in place to protect your information
            </Text>
            
            <Text style={[styles.subSectionTitle, { color: defaultTheme.primary }]}>
              Analytics
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              • We use anonymized analytics to improve app performance{'\n'}
              • No personally identifiable information is shared with analytics providers
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              12. Changes to This Privacy Policy
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will:{'\n'}
              • Notify you of significant changes through the app or email{'\n'}
              • Post the updated policy with a new "Last Updated" date{'\n'}
              • Continue to protect your information according to the updated policy
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              13. Cookie Policy
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              Bridge App may use cookies and similar technologies to:{'\n'}
              • Remember your preferences and settings{'\n'}
              • Improve app performance and user experience{'\n'}
              • Provide security features{'\n'}
              • Analyze app usage (anonymized data only){'\n\n'}
              You can control cookie preferences through your device settings.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              14. Contact Us
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              If you have questions about this Privacy Policy or your personal information, please contact us:{'\n\n'}
              • Email: [Your Privacy Contact Email]{'\n'}
              • Address: [Your Business Address]{'\n'}
              • Response Time: We aim to respond to privacy inquiries within 7 business days
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: defaultTheme.primary }]}>
              15. Data Protection Officer
            </Text>
            <Text style={[styles.sectionText, { color: defaultTheme.text }]}>
              For users in regions requiring a Data Protection Officer, you can contact our DPO at: [DPO Contact Information]
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: defaultTheme.secondary }]}>
              Bridge App is committed to maintaining the trust of our neurodivergent community by protecting your privacy with the highest standards of care and transparency.
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
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    lineHeight: 22,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    lineHeight: 22,
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