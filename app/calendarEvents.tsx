import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Calendar } from 'react-native-calendars';
import { styles } from './styles';
import { IPAddr } from './constants';
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, Task } from '../components/Types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import * as AuthSession from 'expo-auth-session';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';

const GOOGLE_CLIENT_ID = '982652547040-6pftl2ggc47iplud47t9cend8scdclkd.apps.googleusercontent.com';


export default function CalendarTracker() {
  const [selectedDate, setSelectedDate] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  type CalendarTrackerNavigationProp = StackNavigationProp<RootStackParamList, 'calendarEvents'>;
  const navigation = useNavigation<CalendarTrackerNavigationProp>();

  const [accessToken, setAccessToken] = useState(null);

  const GOOGLE_DISCOVERY = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  };


  useEffect(() => {
    axios.get(IPAddr + '/get_calendar_events/1')
      .then(response => {
        const events = response.data.map((event: any) => ({
          id: event.id.toString(),
          title: `${event.title} at ${event.event_time}`,
          done: false,
          icon: 'calendar-outline',
        }));
        setTasks(events);
      })
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  const handleDayPress = (day: { dateString: React.SetStateAction<string>; }) => {
    setSelectedDate(day.dateString);
  };



  const redirectUri = AuthSession.makeRedirectUri();

  // Configure the request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      redirectUri,
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
      responseType: 'code',
    },
    GOOGLE_DISCOVERY
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      sendAuthCode(code);
    }
  }, [response]);

  const linkGoogleCalendar = () => {
    promptAsync();
  };

  const sendAuthCode = async (authCode: string) => {
    try {
      const response = await axios.post(IPAddr + '/link_calendar', JSON.stringify({ "authCode": authCode, "user_id": 1 }));
      console.log('Event saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  }
  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <Text style={styles.bullet}>
        <View style={styles.taskicon}>
          <Ionicons name={item.icon} size={30} color={'#000'} />
        </View>
      </Text>
      <Text style={styles.taskText}>{item.title}</Text>
      <View>
        <BouncyCheckbox
          fillColor="#65558F"
          iconStyle={{ borderRadius: 0 }}
          innerIconStyle={{ borderRadius: 0, borderWidth: 2 }}
          onPress={(isChecked: boolean) => { item.done = isChecked; }} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.headerText}>Calendar Events</Text>
        <Text style={styles.sectionHeader}>Upcoming Events</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title="Link Google Calendar" onPress={linkGoogleCalendar} />
      </View>
      <FlatList style={styles.flatList}
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
      />
      <View style={{ height: 50 }}>
        <Text style={styles.sectionHeader}>Title</Text>
      </View>

      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: {
            selected: true,
            marked: true,
            selectedColor: '#9b59b6',
          },
        }}
        theme={{
          selectedDayBackgroundColor: '#65558F',
          todayTextColor: '#00adf5',
          arrowColor: '#9b59b6',
        }}
      />


      {/* Button to navigate to addCalendarEvents */}
      <TouchableOpacity style={styles.fixedButton}
        onPress={() => navigation.navigate('addCalendarEvents')}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
        <View style={styles.icon}>
          <Ionicons name="add-outline" size={40} color={'#eee'} />
          <Text style={styles.newText}>New</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
