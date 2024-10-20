import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';
import { IPAddr } from './constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../components/Types';
import { useNavigation } from '@react-navigation/native';
import GenericAddPageForm from './addEventPage';
import { StackNavigationProp } from '@react-navigation/stack';


export default function AddMeals() {
  type CalendarTrackerNavigationProp = StackNavigationProp<RootStackParamList, 'addMeals'>;
  const navigation = useNavigation<CalendarTrackerNavigationProp>();

  const [eventData, setEventData] = useState({
    user_id: 1,
    title: '',
    event_date: new Date(),
    event_time: new Date(),
  });

  const handleChange = (name: string, value: any) => {
    setEventData({ ...eventData, [name]: value });
  };

  const handleSave = async () => {
    const formattedData = {
      ...eventData,
      event_date: eventData.event_date.toISOString().split('T')[0],
      event_time: eventData.event_time.toTimeString().split(' ')[0],
    };

    try {
      const response = await axios.post(IPAddr + '/add_meal_events', formattedData);
      console.log('Event saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving event:', error);
    }
    navigation.navigate('mealTracker')
  };

  const handleDateChange = (event: any, selectedDate: any) => {
    if (selectedDate) {
      handleChange('event_date', selectedDate);
    }
  };

  const handleCancel = (() => {
    navigation.navigate('mealTracker')
})

  const initialData = {
    user_id: 1,
    title: '',
    event_date: new Date(),
    event_time: new Date(),
  };
 
  const fields = [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'event_date', label: 'Date', type: 'date' },
    { name: 'event_time', label: 'Time', type: 'time' },
  ];

  return (
    <GenericAddPageForm
      title="New Meal"
      initialData={initialData}
      fields={fields}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};

  