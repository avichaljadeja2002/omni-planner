import React, { useState } from 'react';
import GenericMainPageForm from './genericMainPage';
import { View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
// import { cLog } from '../components/log';
import { call, full_call } from '../components/apiCall';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Alert from './alert';
import { useAlert } from '../hooks/useAlert';

const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID || '';
const CLIENT_SECRET = process.env.EXPO_PUBLIC_CLIENT_SECRET || '';
const REDIRECT_URI = Linking.createURL('/') || '';
const TOKEN_URI = 'https://oauth2.googleapis.com/token';
const AUTH_URI = 'https://accounts.google.com/o/oauth2/v2/auth';

WebBrowser.maybeCompleteAuthSession();

const { alertModal, showAlert, hideAlert } = useAlert();

export default function CalendarTracker() {
  const [isGoogleCalendarLinked, setIsGoogleCalendarLinked] = useState(false);
  const [isImapLinked, setIsImapLinked] = useState(false);

  const handlePress = async () => {
    try {
      console.log("Initiating OAuth login...");
      const authUrl = `${AUTH_URI}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=https://www.googleapis.com/auth/calendar&access_type=offline&prompt=consent`;
      const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);
      console.log("WebBrowser result:" + result);
      if (result.type === 'success' && result.url) {
        const authCodeMatch = result.url.match(/code=([^&]*)/);
        const authCode = authCodeMatch ? authCodeMatch[1] : null;
        if (authCode) {
          console.log("Received authorization code:" + authCode);
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

  const handlePressImap = async () => {
    console.log("Button pressed");
    try {
      console.log("Initiating OAuth login...");
      const authUrl = `${AUTH_URI}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=https://www.googleapis.com/auth/calendar&access_type=offline&prompt=consent`;
      const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);
      console.log("WebBrowser result:" + result);
      if (result.type === 'success' && result.url) {
        const authCodeMatch = result.url.match(/code=([^&]*)/);
        const authCode = authCodeMatch ? authCodeMatch[1] : null;
        if (authCode) {
          console.log("Received authorization code:" + authCode);
          getAccessTokenImap(authCode);
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
    console.log("Exchanging authorization code for access token...");
    try {
      const params = new URLSearchParams();
      params.append('code', authCode);
      params.append('client_id', CLIENT_ID);
      params.append('client_secret', CLIENT_SECRET);
      params.append('redirect_uri', REDIRECT_URI);
      params.append('grant_type', 'authorization_code');
      const response = await full_call(TOKEN_URI, 'POST', 'application/x-www-form-urlencoded', params);
      if (response.data.access_token) {
        console.log("Received access token:" + response.data.access_token);
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

  const getAccessTokenImap = async (authCode: string) => {
    console.log("Exchanging authorization code for access token...");
    try {
      const params = new URLSearchParams();
      params.append('code', authCode);
      params.append('client_id', CLIENT_ID);
      params.append('client_secret', CLIENT_SECRET);
      params.append('redirect_uri', REDIRECT_URI);
      params.append('grant_type', 'authorization_code');
      const response = await full_call(TOKEN_URI, 'POST', 'application/x-www-form-urlencoded', params);
      if (response.data.access_token) {
        console.log("Received access token:" + response.data.access_token);
        linkImap(response.data.access_token);
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
    console.log("Linking Google Calendar for user and fetching events...");
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await call(`/link_calendar/${token}`, 'POST', undefined, { accessToken: accessToken });
      if (response.status === 200 && response.data.includes("successfully")) {
        console.log('Google Calendar linked successfully:' + response.data);
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

  const linkImap = async (accessToken: any) => {
    console.log("Linking Imap for user and fetching events...");
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await call(`/link_imap/${token}`, 'POST', undefined, { accessToken: accessToken });
      if (response.status === 200 && response.data.includes("successfully")) {
        console.log('Imap linked successfully:' + response.data);
        showAlert('Success', 'Imap linked successfully!', 'Close', '');
        setIsImapLinked(true);
      } else {
        console.error("Failed to link Imap");
        showAlert('Error', 'Failed to link Imap', 'Close', '');
      }
    } catch (error) {
      console.error('Error linking Imap:', error);
      showAlert("Error", 'Error linking Imap', 'Close', '');
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
        isImapLinked={isImapLinked}
        setIsGoogleCalendarLinked={setIsGoogleCalendarLinked}
        setIsImapLinked={setIsImapLinked}
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