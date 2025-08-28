import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function UserSettings() {
  const navigation = useNavigation();
  const { theme, themeKey, selectTheme, themes, isLoading } = useTheme();

  // Notification preferences state
  const [notificationSettings, setNotificationSettings] = useState({
    jobOpportunities: { push: true, email: true },
    applicationUpdates: { push: true, email: false },
    savedSearches: { push: false, email: true },
    guideInsights: { push: true, email: true },
    surveys: { push: false, email: false }
  });

  const notificationItems = [
    { key: 'jobOpportunities', label: 'Job opportunities', icon: 'briefcase' },
    { key: 'applicationUpdates', label: 'Application updates', icon: 'document-text' },
    { key: 'savedSearches', label: 'Saved searches updates', icon: 'bookmark' },
    { key: 'guideInsights', label: 'Guide and insights', icon: 'bulb' },
    { key: 'surveys', label: 'Surveys', icon: 'chatbox-ellipses' }
  ];

  const themeOptions = [
    { key: 'default', label: 'Default', description: 'Classic purple theme' },
    { key: 'light', label: 'Light', description: 'Clean and bright' },
    { key: 'dark', label: 'Dark', description: 'Easy on the eyes' },
    { key: 'highContrast', label: 'High Contrast', description: 'Enhanced accessibility' }
  ];

  const goBack = () => {
    navigation.goBack();
  };

  const handleNotificationToggle = (itemKey, type) => {
    setNotificationSettings(prev => ({
      ...prev,
      [itemKey]: {
        ...prev[itemKey],
        [type]: !prev[itemKey][type]
      }
    }));
  };

  const handleThemeSelect = (selectedTheme) => {
    selectTheme(selectedTheme);
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color={theme.background} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="notifications" size={24} color={theme.primary} />
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Choose how you'd like to receive notifications
          </Text>

          {notificationItems.map((item) => (
            <View key={item.key} style={styles.notificationItem}>
              <View style={styles.notificationHeader}>
                <View style={styles.notificationLabelContainer}>
                  <Ionicons name={item.icon} size={20} color={theme.secondary} />
                  <Text style={styles.notificationLabel}>{item.label}</Text>
                </View>
              </View>
              
              <View style={styles.notificationOptions}>
                <View style={styles.notificationOption}>
                  <Text style={styles.optionLabel}>Push</Text>
                  <Switch
                    value={notificationSettings[item.key].push}
                    onValueChange={() => handleNotificationToggle(item.key, 'push')}
                    trackColor={{ false: theme.border, true: theme.primary + '40' }}
                    thumbColor={notificationSettings[item.key].push ? theme.primary : theme.secondary}
                  />
                </View>
                
                <View style={styles.notificationOption}>
                  <Text style={styles.optionLabel}>Email</Text>
                  <Switch
                    value={notificationSettings[item.key].email}
                    onValueChange={() => handleNotificationToggle(item.key, 'email')}
                    trackColor={{ false: theme.border, true: theme.primary + '40' }}
                    thumbColor={notificationSettings[item.key].email ? theme.primary : theme.secondary}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="palette" size={24} color={theme.primary} />
            <Text style={styles.sectionTitle}>Appearance</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Choose your preferred theme
          </Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading theme preferences...</Text>
            </View>
          ) : (
            themeOptions.map((themeOption) => (
            <TouchableOpacity
              key={themeOption.key}
              style={[
                styles.themeOption,
                themeKey === themeOption.key && styles.selectedThemeOption
              ]}
              onPress={() => handleThemeSelect(themeOption.key)}
            >
              <View style={styles.themeInfo}>
                <Text style={styles.themeLabel}>{themeOption.label}</Text>
                <Text style={styles.themeDescription}>{themeOption.description}</Text>
              </View>
              
              <View style={styles.themePreview}>
                <View style={[styles.previewColor, { backgroundColor: themes[themeOption.key].primary }]} />
                <View style={[styles.previewColor, { backgroundColor: themes[themeOption.key].background }]} />
                <View style={[styles.previewColor, { backgroundColor: themes[themeOption.key].card }]} />
              </View>
              
              {themeKey === themeOption.key && (
                <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
              )}
            </TouchableOpacity>
          ))
          )}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  notificationItem: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  notificationHeader: {
    marginBottom: 12,
  },
  notificationLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginLeft: 8,
  },
  notificationOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  notificationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  optionLabel: {
    fontSize: 14,
    color: theme.secondary,
    fontWeight: '500',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  selectedThemeOption: {
    borderColor: theme.primary,
    borderWidth: 2,
  },
  themeInfo: {
    flex: 1,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 14,
    color: theme.secondary,
  },
  themePreview: {
    flexDirection: 'row',
    marginRight: 12,
  },
  previewColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: theme.border,
  },
  bottomSpacing: {
    height: 40,
  },
  loadingContainer: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: theme.secondary,
    fontStyle: 'italic',
  },
});
