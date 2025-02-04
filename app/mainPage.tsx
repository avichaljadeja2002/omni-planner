import React, { useState, useCallback } from 'react';
import GenericMainPageForm from './genericMainPage';
import { getEventIcon } from '@/constants/constants';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cLog } from '@/components/log';

export default function TaskScreen() {
  const [header, setHeader] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const verifyLoginStatus = async () => {
        const [isLoggedIn, storedToken] = await AsyncStorage.multiGet(['isLoggedIn', 'token']);
        if (isLoggedIn[1] === 'true' && storedToken[1]) {
          cLog(1, `User is logged in with Token: ${storedToken[1]}`);
        } else {
          cLog(1, 'User is not logged in');
        }
      };
      const initializeHeader = async () => {
        const name = await AsyncStorage.getItem('name');
        setHeader(name);
      };
      verifyLoginStatus();
      initializeHeader();
    }, [])
  );

  return (
    <GenericMainPageForm
      title='Home'
      header={`Welcome ${header && header !== 'null' ? header : 'User'}!`}
      nextPage='mainPage'
      thisPage='mainPage'
      hitAddress={`/get_all_events/`}
      eventTitleFunc={(event) => `${event.title}`}
      eventIconFunc={(event) => getEventIcon(event.event_type)}
    />
  );
}
