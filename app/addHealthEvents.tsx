import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from 'react-native-element-dropdown';
import { IPAddr } from './constants';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import GenericAddPageForm from './addEventPage';
import { RootStackParamList } from '@/components/Types';

const data = [
  { label: 'Daily', value: '1' },
  { label: 'Weekly', value: '2' },
  { label: 'Monthly', value: '3' },
  { label: 'Yearly', value: '4' },
];

export default function AddHealthEvents() {
  type AddHealthEventNavProp = StackNavigationProp<RootStackParamList, 'addCalendarEvents'>;
  const navigation = useNavigation<AddHealthEventNavProp>();

  const [value, setValue] = useState<string | null>(null);
  const initialData = {
    user_id: 1,
    title: '',
    event_date: new Date(),
    event_time: new Date(),
    repeating: false,
    repeat_timeline: ''
  }
  const [eventData, setEventData] = useState({
    user_id: 1,
    title: '',
    event_date: new Date(),
    event_time: new Date(),
    repeating: false,
    repeat_timeline: ''
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
      const response = await axios.post(IPAddr + '/add_health_events', formattedData);
      console.log('Event saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving event:', error);
    }
    navigation.navigate('healthTracker')
  };

  const handleDateChange = (event: any, selectedDate: any) => {
    if (selectedDate) {
      handleChange('event_date', selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime: any) => {
    if (selectedTime) {
      handleChange('event_time', selectedTime);
    }
  };

  return (
    <GenericAddPageForm
      title="New Health Event"
      initialData={initialData}
      fields={fields}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
