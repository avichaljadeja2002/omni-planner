import * as Google from 'expo-auth-session/providers/google';
// import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

import axios from 'axios';
import { useState, useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();

interface GoogleEvent {
  id: string;
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

// Google Sign-In and Calendar API Service
export function useGoogleCalendar() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [googleEvents, setGoogleEvents] = useState<GoogleEvent[]>([]);

  // Configure Google sign-in
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '982652547040-6pftl2ggc47iplud47t9cend8scdclkd.apps.googleusercontent.com',
    // androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    // iosClientId: 'YOUR_IOS_CLIENT_ID',
    // webClientId: 'YOUR_WEB_CLIENT_ID',
    // redirectUri: makeRedirectUri({ path: ''}),
    redirectUri: 'https://auth.expo.io/@tuttlr/omni-planner',
  });

  // Handle Google sign-in response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
  
      if (authentication?.accessToken) {
        console.log('Logged in with Google:', authentication.accessToken);
        setAccessToken(authentication.accessToken);
      } else {
        console.log('Authentication object is missing or invalid');
        setAccessToken(null); // Handle the case when authentication is null or accessToken is undefined
      }
    } else if (response?.type === 'error') {
      console.log('Error during Google login:', response.error);
    }
  }, [response]);
  

  // Fetch Google Calendar events using the access token
  const fetchGoogleCalendarEvents = async () => {
    if (!accessToken) {
      console.error("No access token available to fetch Google Calendar events.");
      return;
    }
  
    try {
      const response = await axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setGoogleEvents(response.data.items || []);
      console.log('Fetched events:', response.data.items);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code outside the range of 2xx
          console.error('Error data:', error.response.data);
          console.error('Status code:', error.response.status);
          console.error('Headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
        } else {
          // Something happened in setting up the request
          console.error('Error message:', error.message);
        }
    
        console.error('Error config:', error.config); // Log the configuration of the request
    }}
  };
  

  return {
    promptAsync,
    request,
    accessToken,
    googleEvents,
    fetchGoogleCalendarEvents,
  };
}
