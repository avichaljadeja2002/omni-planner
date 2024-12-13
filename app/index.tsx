// import { IPAddr } from './constants';
// import axios from 'axios';
import GenericMainPageForm from './mainPageTemplate';
import React, { useState, useCallback, useEffect } from 'react';
import { formatTime, IPAddr } from './constants';
import { Task } from '../components/Types';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { cLog } from './log'
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export default function TaskScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const fetchAllEvents = async () => {
    const hit = IPAddr + '/get_all_events/1';
    cLog('Fetching all events from:' + hit);
    axios.get(hit)
      .then(response => {
        const events = response.data.map((event: any) => ({
          id: event.id.toString(),
          title: `${event.title} at ${event.eventDate}, ${formatTime(event.eventTime)}`,
          done: false,
          icon: getEventIcon(event.event_type), 
        }));
        setTasks(events);
      })
      .catch(error => console.error('Error fetching events:', error));
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'finance':
        return 'wallet-outline';
      case 'calendar':
        return 'calendar-outline';
      case 'health':
        return 'fitness-outline';
      case 'meal':
        return 'fast-food-outline';
      default:
        return 'help-outline';
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllEvents();
    }, [])
  );

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    cLog('Expo Push Token: ' + token);

    return token;
  }

  return (
    <GenericMainPageForm
      title='Home'
      header='Welcome Saayeh!'
      nextPage='index'
      tasks={tasks}
    />
  );
}
