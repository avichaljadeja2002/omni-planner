import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import { IPAddr } from './constants';
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

  const initialData = {
    user_id: 1,
    title: '',
    event_date: new Date(),
    event_time: new Date(),
    repeating: false,
    repeat_timeline: '',
  };

  const fields = [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'event_date', label: 'Date', type: 'date' },
    { name: 'event_time', label: 'Time', type: 'time' },
    { name: 'repeat_timeline', label: 'Repeating', type: 'dropdown', options: data },
  ];

  const handleSave = async (data: any) => {
    try {
      const response = await axios.post(IPAddr + '/add_health_events', data);
      console.log('Event saved successfully:', response.data);
      navigation.navigate('healthTracker');
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleCancel = () => {
    navigation.navigate('healthTracker');
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
