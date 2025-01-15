import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { cLog } from '@/app/log';
import { RootStackParamList } from "@/components/Types";
import { StackNavigationProp } from "@react-navigation/stack";
import { Field } from "@/components/Types";

// export const IPAddr = "http://34.204.83.156:8080" // For AWS
export const IPAddr = "http://137.112.196.132:8080" // For local testing on lapto

export const repeatingData = [
  { label: 'Daily', value: 1 },
  { label: 'Weekly', value: 2 },
  { label: 'Monthly', value: 3 },
  { label: 'Yearly', value: 4 },
];

export const formatTime = (time: { split: (arg0: string) => [any, any]; }) => {
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

export const getEventIcon = (eventType: string) => {
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

export const getPageName = (page: string) => {
  switch (page) {
    case 'mainFinance':
      return 'viewFinanceEvents';
    case 'mainHealthTracker':
      return 'viewHealthEvents';
    case 'mainMealTracker':
      return 'viewMealEvents';
    case 'mainCalendarEvents':
      return 'viewCalendarEvents';
    default:
      return 'Home';
  }
};

export const getPageFromEventType = (eventType: any) => {
  switch (eventType) {
    case 'health':
      return 'mainHealthTracker';
    case 'meal':
      return 'mainMealTracker';
    case 'calendar':
      return 'mainCalendarEvents';
    default:
      return eventType;
  }
}

export const verifyToken = async (navigation: StackNavigationProp<RootStackParamList, keyof RootStackParamList>) => {
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

export const calendarFields: Field[] = [
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'event_date', label: 'Date', type: 'date' },
  { name: 'event_time', label: 'Time', type: 'time' },
  { name: 'repeat_timeline', label: 'Repeating', type: 'dropdown', options: repeatingData },
];

export const healthFields: Field[] = [
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'event_date', label: 'Date', type: 'date' },
  { name: 'event_time', label: 'Time', type: 'time' },
  { name: 'repeat_timeline', label: 'Repeating', type: 'dropdown', options: repeatingData },
];

export const mealFields: Field[] = [
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'event_date', label: 'Date', type: 'date' },
  { name: 'event_time', label: 'Time', type: 'time' },
  { name: 'repeat_timeline', label: 'Repeating', type: 'dropdown', options: repeatingData },
  { name: 'ingredients', label: 'Ingredients', type: 'multi-select' },
];

export const financeFields: Field[] = [
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'event_date', label: 'Date', type: 'date' },
  { name: 'event_time', label: 'Time', type: 'time' },
  { name: 'repeat_timeline', label: 'Repeating', type: 'dropdown', options: repeatingData },
  { name: 'money', label: 'Money', type: 'number' }
];