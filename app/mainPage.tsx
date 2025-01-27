import React, { useState, useCallback, useEffect } from 'react';
import GenericMainPageForm from './genericMainPage';
import { getEventIcon } from '@/constants/constants';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TaskScreen() {
  const [header, setHeader] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const verifyLoginStatus = async () => {
        const [isLoggedIn, storedUserId] = await AsyncStorage.multiGet(['isLoggedIn', 'userId']);
        if (isLoggedIn[1] === 'true' && storedUserId[1]) {
          console.log(`User is logged in with ID: ${storedUserId[1]}`);
          setUserId(storedUserId[1]);
        } else {
          console.log('User is not logged in');
        }
      };

      verifyLoginStatus();
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
