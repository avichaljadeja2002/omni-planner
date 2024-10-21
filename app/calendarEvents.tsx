import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import axios from 'axios';
import { IPAddr } from './constants';
import { styles } from './styles';
import GenericMainPageForm from './mainPageTemplate';
import { Task } from '@/components/Types';

const CLIENT_ID = '982652547040-6pftl2ggc47iplud47t9cend8scdclkd.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = Linking.createURL('/');
const TOKEN_URI = 'https://oauth2.googleapis.com/token';
const AUTH_URI = 'https://accounts.google.com/o/oauth2/v2/auth';

WebBrowser.maybeCompleteAuthSession();

export default function CalendarTracker() {
  const [tasks, setTasks] = useState<Task[]>([]);

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
        fetchLinkedCalendarEvents(response.data.access_token);
      } else {
        console.error("Failed to retrieve access token");
        Alert.alert('Failed to retrieve access token');
      }
    } catch (error) {
      console.error('Error exchanging authorization code:', error);
      Alert.alert('Error exchanging authorization code');
    }
  };

  const fetchLinkedCalendarEvents = async (token: string) => {
    console.log("Fetching events from /link_calendar API...");
    try {
      const response = await axios.get(`${IPAddr}/link_calendar?accessToken=${token}`);

      if (response.status === 200 && response.data) {
        console.log('Received events from link_calendar:', response.data);

        const calendarEvents = response.data.map((event: any) => ({
          id: event.id.toString(),
          title: event.title,
          event_date: event.event_date,
          done: false,
          icon: 'calendar-outline',
        }));

        setTasks((prevTasks) => [...prevTasks, ...calendarEvents]);
        Alert.alert('Successfully fetched and added calendar events!');
      } else {
        console.error("Failed to fetch events from link_calendar API");
        Alert.alert('Failed to fetch events from link_calendar API');
      }
    } catch (error) {
      console.error('Error fetching events from link_calendar API:', error);
      Alert.alert('Error fetching events from link_calendar API');
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${IPAddr}/get_calendar_events/1`);
      const events = response.data.map((event: any) => ({
        id: event.id.toString(),
        title: `${event.title} at ${event.event_time}`,
        done: false,
        icon: 'wallet-outline',
      }));
      setTasks(events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <Text>Link Google Calendar</Text>
      </TouchableOpacity>
      <GenericMainPageForm
        title='Calendar Tracker'
        header='Upcoming Events'
        nextPage='addCalendarEvents'
        tasks={tasks}
      />
    </View>
  );
}
