import React, { useEffect, useState } from 'react';
import GenericMainPageForm from './genericMainPage';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { cLog } from '../components/log'
import { call, full_call } from '../components/apiCall';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Alert from './alert';
import { useAlert } from '../hooks/useAlert';

type CalendarEvent = {
  summary: string;
  start: string;
  end: string;
  location?: string;
};

const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID || '';
const CLIENT_SECRET = process.env.EXPO_PUBLIC_CLIENT_SECRET || '';
const REDIRECT_URI = Linking.createURL('/') || '';
const TOKEN_URI = 'https://oauth2.googleapis.com/token';
const AUTH_URI = 'https://accounts.google.com/o/oauth2/v2/auth';

WebBrowser.maybeCompleteAuthSession();

const { alertModal, showAlert, hideAlert } = useAlert();

export default function CalendarTracker() {
  const [isGoogleCalendarLinked, setIsGoogleCalendarLinked] = useState(false);

  const handlePress = async () => {
    try {
      cLog(1, "Initiating OAuth login...");
      const authUrl = `${AUTH_URI}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=https://www.googleapis.com/auth/calendar&access_type=offline&prompt=consent`;
      const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);
      cLog(1, "WebBrowser result:" + result);
      if (result.type === 'success' && result.url) {
        const authCodeMatch = result.url.match(/code=([^&]*)/);
        const authCode = authCodeMatch ? authCodeMatch[1] : null;
        if (authCode) {
          cLog(1, "Received authorization code:" + authCode);
          getAccessToken(authCode);
        } else {
          console.error("Authorization code not found in the redirect URL");
          showAlert('Authorization failed', 'Code not found', 'Close', '');
        }
      } else {
        console.error("WebBrowser failed to authorize");
        showAlert('Authorization failed', '', 'Close', '');
      }
    } catch (error) {
      console.error("Error during OAuth flow:", error);
    }
  };

  const getAccessToken = async (authCode: string) => {
    cLog(1, "Exchanging authorization code for access token...");
    try {
      const params = new URLSearchParams();
      params.append('code', authCode);
      params.append('client_id', CLIENT_ID);
      params.append('client_secret', CLIENT_SECRET);
      params.append('redirect_uri', REDIRECT_URI);
      params.append('grant_type', 'authorization_code');
      const response = await full_call(TOKEN_URI, 'POST', 'application/x-www-form-urlencoded', params);
      if (response.data.access_token) {
        cLog(1, "Received access token:" + response.data.access_token);
        linkGoogleCalendar(response.data.access_token);
      } else {
        console.error("Failed to retrieve access token");
        showAlert('Error', 'Failed to retrieve access token', 'Close', '');
      }
    } catch (error) {
      console.error('Error exchanging authorization code:', error);
      showAlert('Error', 'Error exchanging authorization code', 'Close', '');
    }
  };

  // const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [authCode, setAuthCode] = useState<string | null>(null);

  useEffect(() => {
    if (authCode) {
      // fetch token only when authCode is set
      const fetchToken = async () => {
        try {
          const res = await fetch('http://localhost:3000/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: authCode }),
          });

          const data = await res.json();
          console.log('✅ Access token:', data.token);
        } catch (err) {
          console.error('❌ Error exchanging authorization code:', err);
        }
      };

      fetchToken();
    }
  }, [authCode]);

  const handlePressImap = async () => {
    try {
      console.log('Trying to fetch events:');
      const response = await fetch('http://localhost:3000/events');
      const data = await response.json();

      console.log('✅ Fetched Events:', data);

      // Log each event
      data.forEach(async (event: { summary: any; start: any; end: any; }) => {
        console.log('📅 Event Title:', event.summary.val);
        console.log(new Date(event.start));
        const formattedData = {
          title: "IMAP: " + event.summary.val,
          event_date: (new Date(event.start)).toISOString().split('T')[0],
          event_time: (new Date(event.start)).toTimeString().split(' ')[0],
        };
        cLog(1, formattedData);
        try {
          const token = await AsyncStorage.getItem('token');
          cLog(1, 'Saving event to:' + `/add_event/calendar`);
          const response = await call(
            `/add_event/calendar/${token}`,
            'POST',
            undefined,
            formattedData
          );
          cLog(1, 'Event updated successfully:' + response.data);
          showAlert('Success', 'Event saved successfully!', '', '');
        } catch (error) {
          console.error('Error saving event:', error);
        }
      });
    } catch (err) {
      console.error('❌ Error fetching events:', err);
    }
  };

  const linkGoogleCalendar = async (accessToken: any) => {
    cLog(1, "Linking Google Calendar for user and fetching events...");
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await call(`/link_calendar/${token}`, 'POST', undefined, { accessToken: accessToken });
      if (response.status === 200 && response.data.includes("successfully")) {
        cLog(1, 'Google Calendar linked successfully:' + response.data);
        showAlert('Success', 'Google Calendar linked successfully!', 'Close', '');
        setIsGoogleCalendarLinked(true);
      } else {
        console.error("Failed to link Google Calendar");
        showAlert('Error', 'Failed to link Google Calendar', 'Close', '');
      }
    } catch (error) {
      console.error('Error linking Google Calendar:', error);
      showAlert("Error", 'Error linking Google Calendar', 'Close', '');
    }
  };

  return (
    <View>
      <GenericMainPageForm
        title='Calendar Tracker'
        nextPage='addCalendarEvents'
        thisPage='mainCalendarEvents'
        hitAddress={`/get_calendar_events/`}
        googleCalendar={true}
        imapCalendar={true}
        sliceRange={20}
        eventIdFunc={(event: any) => `${event.id}-${event.event_date}-${event.event_time}`}
        eventIconFunc={() => 'calendar-outline'}
        handlePress={handlePress}
        handlePressImap={handlePressImap}
        isGoogleCalendarLinked={isGoogleCalendarLinked}
        setIsGoogleCalendarLinked={setIsGoogleCalendarLinked}
      />
      <Alert
        isVisible={alertModal.visible}
        toggleModal={hideAlert}  // Updated to use hideAlert
        header={alertModal.header}
        description={alertModal.message}
        onSave={() => {
          alertModal.onSave();
          hideAlert();
        }}
        saveButtonText={alertModal.saveText}
        closeButtonText={alertModal.closeText}
      />
    </View>
  );
}