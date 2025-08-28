import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function HelpForm() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { user, userProfile } = useAuth();

  // FAQ state
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  // Contact form state
  const [formData, setFormData] = useState({
    name: userProfile?.displayName || userProfile?.firstName || '',
    email: user?.email || '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqData = [
    {
      id: 1,
      question: "How do I search for jobs?",
      answer: "You can search for jobs using the search bar on the Dashboard. Enter keywords, job titles, or company names. You can also use the advanced filters on the Job List page to narrow down your search by location, job type, and categories."
    },
    {
      id: 2,
      question: "How do I save jobs for later?",
      answer: "When viewing a job description, tap the bookmark icon in the top right corner. Saved jobs will appear in your Activity section under the 'Saved' tab, making it easy to review them later."
    },
    {
      id: 3,
      question: "Can I upload my resume?",
      answer: "Yes! Go to the Templates section from the Dashboard. You can upload existing resumes or create new ones using our built-in editor. You can also create multiple versions for different types of positions."
    },
    {
      id: 4,
      question: "How do I update my profile?",
      answer: "Navigate to your Profile from the bottom navigation. Tap 'Edit Profile' to update your personal information, work history, skills, and special requirements. Make sure to save your changes when done."
    },
    {
      id: 5,
      question: "What notification settings can I control?",
      answer: "In Settings, you can customize notifications for job opportunities, application updates, saved search alerts, guides and insights, and surveys. Each can be set for push notifications, email, or both."
    },
    {
      id: 6,
      question: "How do I change the app theme?",
      answer: "Go to Settings > Appearance to choose from Default, Light, Dark, or High Contrast themes. Changes apply immediately across the entire app."
    },
    {
      id: 7,
      question: "Is my data secure?",
      answer: "Yes, we take data security seriously. All personal information is encrypted and stored securely. We never share your data with third parties without your explicit consent."
    },
    {
      id: 8,
      question: "How do I delete my account?",
      answer: "If you need to delete your account, please contact our support team using the form below. We'll help you with the process and ensure all your data is properly removed."
    }
  ];

  const goBack = () => {
    navigation.goBack();
  };

  const toggleFAQ = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!formData.subject.trim()) {
      Alert.alert('Error', 'Please enter a subject');
      return false;
    }
    if (!formData.message.trim()) {
      Alert.alert('Error', 'Please enter your message');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success', 
        'Your support request has been submitted. We\'ll get back to you within 24 hours.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFormData({
                name: userProfile?.displayName || userProfile?.firstName || '',
                email: user?.email || '',
                subject: '',
                message: ''
              });
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* FAQ Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="help-outline" size={24} color={theme.primary} />
              <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Find quick answers to common questions
            </Text>

            {faqData.map((faq) => (
              <TouchableOpacity
                key={faq.id}
                style={[
                  styles.faqItem,
                  expandedFAQ === faq.id && styles.expandedFaqItem
                ]}
                onPress={() => toggleFAQ(faq.id)}
                activeOpacity={0.7}
              >
                <View style={styles.faqQuestion}>
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  <Ionicons
                    name={expandedFAQ === faq.id ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={theme.primary}
                  />
                </View>
                {expandedFAQ === faq.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Contact Form Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="contact-support" size={24} color={theme.primary} />
              <Text style={styles.sectionTitle}>Contact Support</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Can't find what you're looking for? Send us a message
            </Text>

            <View style={styles.form}>
              {/* Name Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  placeholder="Enter your full name"
                  placeholderTextColor={theme.secondary}
                />
              </View>

              {/* Email Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholder="Enter your email address"
                  placeholderTextColor={theme.secondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Subject Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Subject *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.subject}
                  onChangeText={(value) => handleInputChange('subject', value)}
                  placeholder="Brief description of your issue"
                  placeholderTextColor={theme.secondary}
                />
              </View>

              {/* Message Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Message *</Text>
                <TextInput
                  style={[styles.input, styles.messageInput]}
                  value={formData.message}
                  onChangeText={(value) => handleInputChange('message', value)}
                  placeholder="Please describe your issue or question in detail..."
                  placeholderTextColor={theme.secondary}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isSubmitting && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Text>
                {!isSubmitting && (
                  <Ionicons name="send" size={20} color={theme.background} style={styles.sendIcon} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Legal Links Section */}
          <View style={styles.legalSection}>
            <View style={styles.legalHeader}>
              <MaterialIcons name="info-outline" size={24} color={theme.primary} />
              <Text style={styles.sectionTitle}>Legal Information</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Review our policies and terms
            </Text>

            <View style={styles.legalLinks}>
              <TouchableOpacity
                style={styles.legalLinkButton}
                onPress={() => navigation.navigate('TermsOfService')}
                accessible={true}
                accessibilityLabel="Terms of Service"
                accessibilityHint="Tap to view the Terms of Service"
                accessibilityRole="button"
              >
                <MaterialIcons name="description" size={20} color={theme.primary} />
                <Text style={styles.legalLinkText}>Terms of Service</Text>
                <MaterialIcons name="chevron-right" size={20} color={theme.secondary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.legalLinkButton, styles.lastLegalLinkButton]}
                onPress={() => navigation.navigate('PrivacyPolicy')}
                accessible={true}
                accessibilityLabel="Privacy Policy"
                accessibilityHint="Tap to view the Privacy Policy"
                accessibilityRole="button"
              >
                <MaterialIcons name="privacy-tip" size={20} color={theme.primary} />
                <Text style={styles.legalLinkText}>Privacy Policy</Text>
                <MaterialIcons name="chevron-right" size={20} color={theme.secondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  keyboardAvoidingView: {
    flex: 1,
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
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginLeft: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: theme.secondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  faqItem: {
    backgroundColor: theme.card,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
    overflow: 'hidden',
  },
  expandedFaqItem: {
    borderColor: theme.primary,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  faqAnswerText: {
    fontSize: 14,
    color: theme.secondary,
    lineHeight: 20,
    marginTop: 12,
  },
  form: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.text,
    backgroundColor: theme.background,
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: theme.primary,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: theme.background,
    fontSize: 16,
    fontWeight: '600',
  },
  sendIcon: {
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
  legalSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  legalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legalLinks: {
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    overflow: 'hidden',
  },
  legalLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  legalLinkText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
    flex: 1,
    marginLeft: 12,
  },
  lastLegalLinkButton: {
    borderBottomWidth: 0,
  },
});
