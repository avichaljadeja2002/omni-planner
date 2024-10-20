import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Calendar } from 'react-native-calendars';
import { styles } from './styles';
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, Task } from '../components/Types'
import { IPAddr } from './constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import GenericMainPageForm from './mainPageTemplate';

export default function HealthTracker() {
  type HealthNavProp = StackNavigationProp<RootStackParamList, 'addMeals'>;
  const navigation = useNavigation<HealthNavProp>();


  const [selectedDate, setSelectedDate] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const fetchEvents = async () => {
    try {
      const response = await fetch(IPAddr + '/get_health_events/1');
      const data = await response.json();

      const events = data.map((event: any) => ({
        id: event.id.toString(),
        title: `${event.title} at ${event.event_time}`,
        done: false,
        icon: 'calendar-outline',
      }));

      setTasks(events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <GenericMainPageForm
            title='Health Tracker'
            page='healthTracker'
            nextPage='addHealthEvents'
            tasks={tasks}
        />
  );
}
