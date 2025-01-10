import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import axios from 'axios';
import { IPAddr, formatTime } from './constants';
import { styles } from './styles';
import GenericMainPageForm from './mainPageTemplate';
import { Task } from '@/components/Types';
import { useFocusEffect } from '@react-navigation/native';
import { cLog } from './log'
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID || '';
const CLIENT_SECRET = process.env.EXPO_PUBLIC_CLIENT_SECRET || '';
const REDIRECT_URI = Linking.createURL('/') || '';
const TOKEN_URI = 'https://oauth2.googleapis.com/token';
const AUTH_URI = 'https://accounts.google.com/o/oauth2/v2/auth';

WebBrowser.maybeCompleteAuthSession();

export default function CalendarTracker() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isGoogleCalendarLinked, setIsGoogleCalendarLinked] = useState<boolean>(false);

  const handlePress = async () => {
    try {
      cLog("Initiating OAuth login...");

      const authUrl = `${AUTH_URI}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=https://www.googleapis.com/auth/calendar&access_type=offline&prompt=consent`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);
      cLog("WebBrowser result:" + result);

      if (result.type === 'success' && result.url) {
        const authCodeMatch = result.url.match(/code=([^&]*)/);
        const authCode = authCodeMatch ? authCodeMatch[1] : null;

        if (authCode) {
          cLog("Received authorization code:" + authCode);
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
    cLog("Exchanging authorization code for access token...");
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
        cLog("Received access token:" + response.data.access_token);
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
    cLog("Linking Google Calendar for user and fetching events...");
    try {
      const hit = `${IPAddr}/link_calendar`;
      cLog("Linking Google Calendar with hit:" + hit);
      const response = await axios.post(hit, {
        userId: userId,
        accessToken: token,
      });

      if (response.status === 200 && response.data.includes("successfully")) {
        cLog('Google Calendar linked successfully:' + response.data);
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

  const fetchEvents = async () => {
    try {
      const hit = `${IPAddr}/get_calendar_events/`+(await AsyncStorage.getItem('userId'));
      cLog('Fetching calendar events from:' + hit);
      const response = await axios.get(hit);

      if (response.status === 200 && response.data) {
        const { events, googleCalendarLinked } = response.data;

        setIsGoogleCalendarLinked(googleCalendarLinked);
        const formattedEvents = events.map((event: any) => ({
          id: `${event.id}-${event.event_date}-${event.event_time}`,
          title: `${event.title} at ${event.event_date}, ${formatTime(event.event_time)}`,
          done: false,
          icon: 'calendar-outline',
          event: event
        })).slice(0,20);;

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
        thisPage='calendarEvents'
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