import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  Dimensions,
  Modal,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function JobDescription() {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme, isLoading: themeLoading } = useTheme();
  const { user, userProfile, updateUserProfile, refreshUserProfile } = useAuth();
  const { jobId } = route.params || {};
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showCoverLetterDropdown, setShowCoverLetterDropdown] = useState(false);
  const [showResumeDropdown, setShowResumeDropdown] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  // Mock templates data (same as Templates screen)
  const [availableTemplates] = useState({
    coverLetters: [
      { id: 'cl1', title: 'Title', date: '15/07/25', isDefault: false, type: null },
      { id: 'cl2', title: 'Title', date: '22/06/25', isDefault: false, type: 'PDF' },
      { id: 'cl3', title: 'Title', date: '08/08/25', isDefault: true, type: null },
    ],
    resumes: [
      { id: 'res1', title: 'Bridge Profile', date: '03/07/25', isDefault: true, type: null },
      { id: 'res2', title: 'Title', date: '19/06/25', isDefault: false, type: 'PDF' },
      { id: 'res3', title: 'Title', date: '27/08/25', isDefault: false, type: 'DOCX' },
    ]
  });


  const styles = getStyles(theme);

  const goBack = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    if (!user || !job || isSaving) return;

    setIsSaving(true);
    try {
      const savedJobs = userProfile?.savedJobs || [];
      let updatedSavedJobs;

      if (isSaved) {
        // Remove from saved jobs
        updatedSavedJobs = savedJobs.filter(savedJob => savedJob.id !== jobId);
        setIsSaved(false);
        console.log('Job removed from saved');
      } else {
        // Add to saved jobs
        const jobToSave = {
          id: jobId,
          title: job.title || 'Untitled Job',
          company: job.company || 'Unknown Company',
          image: job.logo || require('../assets/job-offer.png'),
          items: job.items || [],
          status: 'SAVED',
          savedAt: new Date().toISOString(),
          category: job.category || '',
          jobType: job.jobType || '',
          location: job.location || {}
        };
        updatedSavedJobs = [...savedJobs, jobToSave];
        setIsSaved(true);
        console.log('Job added to saved');
      }

      // Update user profile
      await updateUserProfile(user.uid, {
        savedJobs: updatedSavedJobs
      });
      
      await refreshUserProfile();
    } catch (error) {
      console.error('Error saving job:', error);
      // Revert the state if there was an error
      setIsSaved(!isSaved);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = () => {
    // Set default selections when opening modal
    const defaultCoverLetter = availableTemplates.coverLetters.find(cl => cl.isDefault) || availableTemplates.coverLetters[0];
    const defaultResume = availableTemplates.resumes.find(r => r.isDefault) || availableTemplates.resumes[0];
    
    setSelectedCoverLetter(defaultCoverLetter);
    setSelectedResume(defaultResume);
    setShowApplyModal(true);
  };

  const handleSubmitApplication = () => {
    setShowApplyModal(false);
    
    // Reset dropdowns
    setShowCoverLetterDropdown(false);
    setShowResumeDropdown(false);
    
    // Show success alert
    Alert.alert(
      'Application Submitted!',
      `Your application for "${job?.title || 'this position'}" has been successfully submitted.`,
      [
        {
          text: 'OK',
          style: 'default'
        }
      ]
    );
  };

  const handleNavigateToTemplates = () => {
    setShowApplyModal(false);
    navigation.navigate('Templates');
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

  // Check if job is already saved
  useEffect(() => {
    if (userProfile && jobId) {
      const savedJobs = userProfile.savedJobs || [];
      setIsSaved(savedJobs.some(savedJob => savedJob.id === jobId));
    }
  }, [userProfile, jobId]);

  const bannerUri = (job && job.banner) || 'https://via.placeholder.com/400x200/432272/FFFFFF?text=JOB+BANNER';

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
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
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
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

  const renderApplyModal = () => (
    <Modal
      visible={showApplyModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowApplyModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select documents</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowApplyModal(false)}
              accessible={true}
              accessibilityLabel="Close application modal"
              accessibilityHint="Tap to close the job application form"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBodyContainer}>
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Cover Letter Section */}
              <View style={styles.documentSection}>
                <Text style={styles.modalSectionTitle}>Cover Letter</Text>
                {availableTemplates.coverLetters.length > 0 ? (
                  <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                      style={styles.dropdownButton}
                      onPress={() => {
                        setShowCoverLetterDropdown(!showCoverLetterDropdown);
                        setShowResumeDropdown(false);
                      }}
                      accessible={true}
                      accessibilityLabel={`Cover letter selection, currently selected: ${selectedCoverLetter?.title || 'none'}`}
                      accessibilityHint="Tap to choose a cover letter for your application"
                      accessibilityRole="button"
                    >
                      <View style={styles.selectedDocument}>
                        <View style={styles.documentInfo}>
                          {selectedCoverLetter?.type && (
                            <View style={styles.typeLabel}>
                              <Text style={styles.typeLabelText}>{selectedCoverLetter.type}</Text>
                            </View>
                          )}
                          <Text style={styles.documentTitle}>{selectedCoverLetter?.title || 'Select Cover Letter'}</Text>
                          {selectedCoverLetter?.isDefault && (
                            <View style={styles.defaultLabel}>
                              <Text style={styles.defaultLabelText}>Default</Text>
                            </View>
                          )}
                        </View>
                        <Ionicons 
                          name={showCoverLetterDropdown ? "chevron-up" : "chevron-down"} 
                          size={20} 
                          color={theme.text} 
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.addDocumentButton}
                    onPress={handleNavigateToTemplates}
                    accessible={true}
                    accessibilityLabel="Add Cover Letter"
                    accessibilityHint="Tap to go to Templates screen and create a cover letter"
                    accessibilityRole="button"
                  >
                    <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
                    <Text style={styles.addDocumentText}>Add Cover Letter</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Resume Section */}
              <View style={styles.documentSection}>
                <Text style={styles.modalSectionTitle}>Resume</Text>
                {availableTemplates.resumes.length > 0 ? (
                  <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                      style={styles.dropdownButton}
                      onPress={() => {
                        setShowResumeDropdown(!showResumeDropdown);
                        setShowCoverLetterDropdown(false);
                      }}
                      accessible={true}
                      accessibilityLabel={`Resume selection, currently selected: ${selectedResume?.title || 'none'}`}
                      accessibilityHint="Tap to choose a resume for your application"
                      accessibilityRole="button"
                    >
                      <View style={styles.selectedDocument}>
                        <View style={styles.documentInfo}>
                          {selectedResume?.type && (
                            <View style={styles.typeLabel}>
                              <Text style={styles.typeLabelText}>{selectedResume.type}</Text>
                            </View>
                          )}
                          <Text style={styles.documentTitle}>{selectedResume?.title || 'Select Resume'}</Text>
                          {selectedResume?.isDefault && (
                            <View style={styles.defaultLabel}>
                              <Text style={styles.defaultLabelText}>Default</Text>
                            </View>
                          )}
                        </View>
                        <Ionicons 
                          name={showResumeDropdown ? "chevron-up" : "chevron-down"} 
                          size={20} 
                          color={theme.text} 
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.addDocumentButton}
                    onPress={handleNavigateToTemplates}
                    accessible={true}
                    accessibilityLabel="Add Resume"
                    accessibilityHint="Tap to go to Templates screen and create a resume"
                    accessibilityRole="button"
                  >
                    <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
                    <Text style={styles.addDocumentText}>Add Resume</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowApplyModal(false)}
                accessible={true}
                accessibilityLabel="Cancel application"
                accessibilityHint="Tap to cancel and close the application form"
                accessibilityRole="button"
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!selectedCoverLetter || !selectedResume) && styles.submitButtonDisabled
                ]}
                onPress={handleSubmitApplication}
                disabled={!selectedCoverLetter || !selectedResume}
                accessible={true}
                accessibilityLabel="Submit application"
                accessibilityHint={(!selectedCoverLetter || !selectedResume) ? "Please select both a cover letter and resume before submitting" : "Tap to submit your job application"}
                accessibilityRole="button"
                accessibilityState={{ disabled: !selectedCoverLetter || !selectedResume }}
              >
                <Text style={[
                  styles.submitButtonText,
                  (!selectedCoverLetter || !selectedResume) && styles.submitButtonTextDisabled
                ]}>
                  Submit Application
                </Text>
              </TouchableOpacity>
            </View>

            {/* Dropdown overlays - positioned absolutely over the entire modal */}
            {showCoverLetterDropdown && (
              <View style={styles.dropdownOverlay}>
                <ScrollView 
                  style={[styles.dropdownList, styles.coverLetterDropdown]}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={true}
                >
                  {availableTemplates.coverLetters.map((coverLetter) => (
                    <TouchableOpacity
                      key={coverLetter.id}
                      style={[
                        styles.dropdownItem,
                        selectedCoverLetter?.id === coverLetter.id && styles.selectedDropdownItem
                      ]}
                      onPress={() => {
                        setSelectedCoverLetter(coverLetter);
                        setShowCoverLetterDropdown(false);
                      }}
                    >
                      <View style={styles.documentInfo}>
                        {coverLetter.type && (
                          <View style={styles.typeLabel}>
                            <Text style={styles.typeLabelText}>{coverLetter.type}</Text>
                          </View>
                        )}
                        <Text style={styles.documentTitle}>{coverLetter.title}</Text>
                        {coverLetter.isDefault && (
                          <View style={styles.defaultLabel}>
                            <Text style={styles.defaultLabelText}>Default</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.documentDate}>{coverLetter.date}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {showResumeDropdown && (
              <View style={styles.dropdownOverlay}>
                <ScrollView 
                  style={[styles.dropdownList, styles.resumeDropdown]}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={true}
                >
                  {availableTemplates.resumes.map((resume) => (
                    <TouchableOpacity
                      key={resume.id}
                      style={[
                        styles.dropdownItem,
                        selectedResume?.id === resume.id && styles.selectedDropdownItem
                      ]}
                      onPress={() => {
                        setSelectedResume(resume);
                        setShowResumeDropdown(false);
                      }}
                    >
                      <View style={styles.documentInfo}>
                        {resume.type && (
                          <View style={styles.typeLabel}>
                            <Text style={styles.typeLabelText}>{resume.type}</Text>
                          </View>
                        )}
                        <Text style={styles.documentTitle}>{resume.title}</Text>
                        {resume.isDefault && (
                          <View style={styles.defaultLabel}>
                            <Text style={styles.defaultLabelText}>Default</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.documentDate}>{resume.date}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );

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
          {/* Section 1: Overview */}
          {!!(job?.category || job?.company || job?.jobType) && (
            <View style={styles.section}>
              <Text style={styles.roleTitle}>{job?.title || 'Job Overview'}</Text>
              <View style={styles.textBlock}>
                {!!job?.company && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Company: </Text>
                    <Text style={styles.detailValue}>{job.company}</Text>
                  </View>
                )}
                {!!job?.category && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Category: </Text>
                    <Text style={styles.detailValue}>{job.category}</Text>
                  </View>
                )}
                {!!job?.jobType && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Job type: </Text>
                    <Text style={styles.detailValue}>{job.jobType}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Section 2: Tasks */}
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

                     {/* Section 1: Job Description */}
             <View style={styles.section}>
               <Text style={styles.sectionTitle}>About the Role and Company</Text>
               <View style={styles.textBlock}>
                 <Text style={styles.textContent}>
                   {job?.description || 'No description provided.'}
                 </Text>
                 <View style={styles.additionalCompanyInfo}>
                   <Text style={styles.textContent}>
                     <Text style={styles.boldLabel}>Team Work size: </Text>{job.teamWorkSize}
                   </Text>
                   <Text style={styles.textContent}>
                     <Text style={styles.boldLabel}>Company size: </Text>{job.companySize}
                   </Text>
                 </View>
               </View>
             </View>

           {/* Section: Additional Info */}
           <View style={styles.section}>
             <TouchableOpacity 
               style={styles.collapsibleHeader}
               onPress={() => setShowAdditionalInfo(!showAdditionalInfo)}
               accessible={true}
               accessibilityLabel="Additional information section"
               accessibilityHint="Tap to expand or collapse additional job information"
               accessibilityRole="button"
             >
               <Text style={styles.sectionTitle}>Additional info</Text>
               <Ionicons 
                 name={showAdditionalInfo ? "chevron-up" : "chevron-down"} 
                 size={20} 
                 color={theme.primary} 
               />
             </TouchableOpacity>
             {showAdditionalInfo && (
               <View style={styles.textBlock}>
                 {!!job?.hoursWeekly && (
                   <View style={styles.detailRow}>
                     <Text style={styles.detailLabel}>Hours weekly: </Text>
                     <Text style={styles.detailValue}>{job.hoursWeekly}</Text>
                   </View>
                 )}
                 {!!job?.breakTimes && (
                   <View style={styles.detailRow}>
                     <Text style={styles.detailLabel}>Break times: </Text>
                     <Text style={styles.detailValue}>{job.breakTimes}</Text>
                   </View>
                 )}
                 {job?.flexibleHours !== undefined && (
                   <View style={styles.detailRow}>
                     <Text style={styles.detailLabel}>Flexible hours: </Text>
                     <Text style={styles.detailValue}>{job.flexibleHours ? 'Yes' : 'No'}</Text>
                   </View>
                 )}
                 {job?.involvesCustomerService !== undefined && (
                   <View style={styles.detailRow}>
                     <Text style={styles.detailLabel}>Involves customer service: </Text>
                     <Text style={styles.detailValue}>{job.involvesCustomerService ? 'Yes' : 'No'}</Text>
                   </View>
                 )}
                 {!!job?.dressCode && (
                   <View style={styles.detailRow}>
                     <Text style={styles.detailLabel}>Dress code: </Text>
                     <Text style={styles.detailValue}>{job.dressCode}</Text>
                   </View>
                 )}
               </View>
             )}
           </View>

          {/* Section 3: Location */}
          {!!(job?.location) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              <View style={styles.textBlock}>                
                <Text style={styles.textContent}>
                  <Ionicons name="location-sharp" size={16} color={theme.primary} style={styles.locationTextBlock} />  
                  {[
                    job.location.addressLine1,
                    job.location.addressLine2,
                    job.location.suburb,
                    job.location.city,
                    job.location.state
                  ].filter(Boolean).join(', ')}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              { borderColor: theme.primary },
              isSaved && { backgroundColor: theme.secondary }
            ]} 
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={[
              styles.saveButtonText, 
           
              isSaving && { opacity: 0.7 }
            ]}>
              {isSaving ? 'Saving...' : (isSaved ? 'Saved' : 'Save')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.applyButton, { backgroundColor: theme.primary }]} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
        {/* Bottom spacer to avoid content under nav */}
        <View style={{ height: 90 }} />
      </ScrollView>
      <BottomNav />
      {renderApplyModal()}
    </SafeAreaView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.text,
    marginVertical: 20,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 12,
  },
  textBlock: {
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
  },
  locationTextBlock: {
    marginRight: 30,
  },
  textContent: {
    fontSize: 16,
    color: theme.text,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontSize: 16,
    color: theme.primary,
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 16,
    color: theme.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: theme.primary,
    borderWidth: 2,
    borderColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  applyButton: {
    flex: 1,
    backgroundColor: theme.primary,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.card,
    borderRadius: 16,
    width: '90%',
    height: '60%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'visible',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBodyContainer: {
    flex: 1,
    position: 'relative',
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  documentSection: {
    marginBottom: 24,
    zIndex: 1,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: theme.background,
  },
  selectedDocument: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeLabel: {
    backgroundColor: theme.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  typeLabelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.primary,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
    flex: 1,
  },
  defaultLabel: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultLabelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  dropdownList: {
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 15,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  selectedDropdownItem: {
    backgroundColor: theme.primary + '10',
  },
  documentDate: {
    fontSize: 12,
    color: theme.secondary,
    marginTop: 4,
  },
  addDocumentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    backgroundColor: theme.primary + '05',
  },
  addDocumentText: {
    fontSize: 16,
    color: theme.primary,
    marginLeft: 8,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    gap: 12,
    zIndex: 1,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.secondary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: theme.text,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    backgroundColor: theme.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: theme.secondary,
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButtonTextDisabled: {
    color: '#ccc',
  },
  modalSectionTitle: {
    fontSize: 18,
    color: theme.text,
    marginBottom: 10,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
    pointerEvents: 'box-none',
  },
  coverLetterDropdown: {
    position: 'absolute',
    top: 120, // Adjust based on cover letter section position
    left: 20,
    right: 20,
    maxHeight: 200,
  },
  resumeDropdown: {
    position: 'absolute',
    top: 220, // Adjust based on resume section position
    left: 20,
    right: 20,
    maxHeight: 200,
  },
     additionalCompanyInfo: {
     alignItems: 'flex-start',
     marginTop: 18,
   },
   boldLabel: {
     fontWeight: 'bold',
   },
   collapsibleHeader: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     paddingVertical: 8,
   },
});
