import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { cLog } from './log';

// export const IPAddr = "http://34.204.83.156:8080" // For AWS
export const IPAddr = "http://127.0.0.1:8080" // For local testing on laptop
export const logging = true;

export const repeatingData = [
  { label: 'Daily', value: 1 },
  { label: 'Weekly', value: 2 },
  { label: 'Monthly', value: 3 },
  { label: 'Yearly', value: 4 },
];

export const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);

  if (hour === 0) {
    return `12:${minutes} AM`;
  } else if (hour < 12) {
    return `${hour}:${minutes} AM`;
  } else if (hour === 12) {
    return `12:${minutes} PM`;
  } else {
    return `${hour - 12}:${minutes} PM`;
  }
};

export const getEventIcon = (eventType) => {
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

export const getPageName = (page) => {
  switch (page) {
    case 'finance':
      return 'viewFinanceEvents';
    case 'healthTracker':
      return 'viewHealthEvents';
    case 'mealTracker':
      return 'viewMealEvents';
    case 'calendarEvents':
      return 'viewCalendarEvents';
    default:
      return 'Home';
  }
};

export const getPageFromEventType = (eventType) => {
  switch (eventType) {
    case 'health':
      return 'healthTracker';
    case 'meal':
      return 'mealTracker';
    case 'calendar':
      return 'calendarEvents';
    default:
      return eventType;
  }
}

export const verifyToken = async (navigation) => {
  const hit = IPAddr + '/checkLogin';
  const storedUserName = await AsyncStorage.getItem('userName');
  const storedToken = await AsyncStorage.getItem('token');
  const storedUserId = await AsyncStorage.getItem('userId');
  const response = await axios.put(hit, { userName: storedUserName, token: storedToken, userId: storedUserId });
  if (!response.data) {
    cLog('Token verification failed');
    await AsyncStorage.clear();
    navigation.navigate('index');
    return false;
  }
  cLog('Verify response:', response.data);
  return true;
}

export const getUserId = async () => {
  return await AsyncStorage.getItem('userId');
}