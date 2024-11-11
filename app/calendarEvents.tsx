import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import axios from 'axios';
import { IPAddr } from './constants';
import { styles } from './styles';
import GenericMainPageForm from './mainPageTemplate';
import { Task } from '@/components/Types';
import { useFocusEffect } from '@react-navigation/native';

const CLIENT_ID = '982652547040-6pftl2ggc47iplud47t9cend8scdclkd.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = Linking.createURL('/');
const TOKEN_URI = 'https://oauth2.googleapis.com/token';
const AUTH_URI = 'https://accounts.google.com/o/oauth2/v2/auth';

WebBrowser.maybeCompleteAuthSession();

export default function CalendarTracker() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isGoogleCalendarLinked, setIsGoogleCalendarLinked] = useState<boolean>(false);

  const handlePress = async () => {
    try {
      console.log("Initiating OAuth login...");

      const authUrl = `${AUTH_URI}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=https://www.googleapis.com/auth/calendar&access_type=offline&prompt=consent`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);
      console.log("WebBrowser result:", result);

      if (result.type === 'success' && result.url) {
        const authCodeMatch = result.url.match(/code=([^&]*)/);
        const authCode = authCodeMatch ? authCodeMatch[1] : null;

        if (authCode) {
          console.log("Received authorization code:", authCode);
          getAccessToken(authCode);
        } else {
          console.error("Authorization code not found in the redirect URL");
          Alert.alert('Authorization failed: code not found');
        }
      } else {
        console.error("WebBrowser failed to authorize");
        Alert.alert('Authorization failed');
      }
    } catch (error) {
      console.error("Error during OAuth flow:", error);
    }
  };

  const getAccessToken = async (authCode: string) => {
    console.log("Exchanging authorization code for access token...");
    try {
      const params = new URLSearchParams();
      params.append('code', authCode);
      params.append('client_id', CLIENT_ID);
      params.append('client_secret', CLIENT_SECRET);
      params.append('redirect_uri', REDIRECT_URI);
      params.append('grant_type', 'authorization_code');

      const response = await axios.post(TOKEN_URI, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.data.access_token) {
        console.log("Received access token:", response.data.access_token);
        linkGoogleCalendar(1, response.data.access_token);
      } else {
        console.error("Failed to retrieve access token");
        Alert.alert('Failed to retrieve access token');
      }
    } catch (error) {
      console.error('Error exchanging authorization code:', error);
      Alert.alert('Error exchanging authorization code');
    }
  };

  const linkGoogleCalendar = async (userId: any, token: any) => {
    console.log("Linking Google Calendar for user and fetching events...");
    try {
      const response = await axios.post(`${IPAddr}/link_calendar`, {
        userId: userId,
        accessToken: token,
      });

      if (response.status === 200 && response.data.includes("successfully")) {
        console.log('Google Calendar linked successfully:', response.data);
        Alert.alert('Google Calendar linked successfully!');
        setIsGoogleCalendarLinked(true);
        fetchEvents();
      } else {
        console.error("Failed to link Google Calendar");
        Alert.alert('Failed to link Google Calendar');
      }
    } catch (error) {
      console.error('Error linking Google Calendar:', error);
      Alert.alert('Error linking Google Calendar');
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);

    if (hour === 0) {
      return `12:${minutes} AM`;
    } else if (hour < 12) {
      return `${hour}:${minutes} AM`;
    } else if (hour === 12) {
      return `12:${minutes} PM`;
    } else {
      return `${hour - 12}:${minutes} PM`;
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${IPAddr}/get_calendar_events/1`);

      if (response.status === 200 && response.data) {
        const { events, googleCalendarLinked } = response.data;

        setIsGoogleCalendarLinked(googleCalendarLinked);
        const formattedEvents = events.map((event: any) => ({
          id: `${event.id}-${event.event_date}-${event.event_time}`,
          title: `${event.title} at ${formatTime(event.event_time)}`,
          done: false,
          icon: 'calendar-outline',
        }));

        setTasks(formattedEvents);
      } else {
        console.error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };


  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  return (
    <View style={styles.bigContainer}>
      <GenericMainPageForm
        title='Calendar Tracker'
        header='Upcoming Events'
        nextPage='addCalendarEvents'
        tasks={tasks}
      />
      {!isGoogleCalendarLinked && (
        <View style={{alignItems: 'center', marginBottom:25}}>
        <TouchableOpacity style={styles.linkButton} onPress={handlePress}>
          <Text style={styles.linkButtonText}>Link to Google Calendar</Text>
        </TouchableOpacity>
        </View>)
      }
    </View>
  );
}