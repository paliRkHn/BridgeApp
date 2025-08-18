import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './JobList.styles';

export default function List({ elements = [] }) {
  const navigation = useNavigation();

  return (
    <View style={styles.elementsContainer}>
      {elements.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No job positions available for this selection</Text>
        </View>
      ) : (
        elements.map((element) => (
          <TouchableOpacity
            key={element.id}
            style={styles.elementContainer}
            onPress={() => navigation.navigate('JobDescription', { jobId: element.id })}
          >
            <View style={styles.elementItem}>
              <Image
                source={element.logo ? { uri: element.logo } : require('../assets/job-offer.png')}
                style={styles.elementImage}
                resizeMode="contain"
              />
              <View style={styles.elementContent}>
                <Text style={styles.elementTitle}>{element.title}</Text>
                <View style={styles.elementList}>
                  {Array.isArray(element.items) && element.items.map((item, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.listItemText}>{item}</Text>
                    </View>
                  ))}
                  {!!element.category && (
                    <View style={styles.listItem}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.listItemText}>{element.category}</Text>
                    </View>
                  )}
                  {!!element.jobType && (
                    <View style={styles.listItem}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.listItemText}>{element.jobType}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            {element.workMode === 'Remote' ? (
              <View style={styles.listLocation}>
                <View style={styles.remoteTag}>
                  <Text style={styles.remoteTagText}>REMOTE</Text>
                </View>
              </View>
            ) : ((!!element.suburb || !!element.city) && (
              <View style={styles.listLocation}>
                <View style={styles.bulletIcon}>
                  <Ionicons name="location-sharp" size={16} color="#432272" />
                </View>
                <Text style={styles.listLocationText}>
                  {`${element.suburb || ''}${element.suburb && element.city ? ', ' : ''}${element.city || ''}`}
                </Text>
              </View>
            ))}
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}