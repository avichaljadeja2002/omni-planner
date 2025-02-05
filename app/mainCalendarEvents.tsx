import React, { useState } from 'react';
import GenericMainPageForm from './genericMainPage';
import { View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { cLog } from '../components/log'
import { call, full_call } from '../components/apiCall';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Alert from './alert';

const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID || '';
const CLIENT_SECRET = process.env.EXPO_PUBLIC_CLIENT_SECRET || '';
const REDIRECT_URI = Linking.createURL('/') || '';
const TOKEN_URI = 'https://oauth2.googleapis.com/token';
const AUTH_URI = 'https://accounts.google.com/o/oauth2/v2/auth';

WebBrowser.maybeCompleteAuthSession();

const [alertModal, setAlertModal] = useState({
  visible: false,
  header: '',
  message: '',
  closeText: 'Close',
  saveText: '',
  onSave: () => { },
});

const showAlert = (header: string, message: string, closeText: string, saveText: string, onSave: () => void = () => { }) => {
  setAlertModal({ visible: true, header, message, closeText, saveText, onSave });
};

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
        sliceRange={20}
        eventIdFunc={(event: any) => `${event.id}-${event.event_date}-${event.event_time}`}
        eventIconFunc={() => 'calendar-outline'}
        handlePress={handlePress}
        isGoogleCalendarLinked={isGoogleCalendarLinked}
        setIsGoogleCalendarLinked={setIsGoogleCalendarLinked}
      />
      <Alert
        isVisible={alertModal.visible}
        toggleModal={() => setAlertModal({ ...alertModal, visible: false })}
        header={alertModal.header}
        description={alertModal.message}
        onSave={() => alertModal.onSave()}
        saveButtonText={alertModal.saveText}
        closeButtonText={alertModal.closeText}
      />
    </View>
  );
}