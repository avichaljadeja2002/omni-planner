import React, { useState, useCallback } from 'react';
import GenericMainPageForm from './genericMainPage';
import { formatTime, getEventIcon } from '../constants/constants';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TaskScreen() {
  const [header, setHeader] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        const name = await AsyncStorage.getItem('name');
        if (name && name !== 'null') {
          setHeader(name);
        }
      };
      fetchUserData();
    }, [])
  );

  return (
    <GenericMainPageForm
      title='Home'
      header={`Welcome ${header && header !== 'null' ? header : 'User'}!`}
      nextPage='home'
      thisPage='home'
      hitAddress={`/get_all_events/`}
      eventTitleFunc = {(event) => `${event.title} at ${event.eventDate}, ${formatTime(event.eventTime)}`}
      eventIconFunc={(event) => getEventIcon(event.event_type)}
    />
  );
}
