import React from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { IPAddr } from './constants';
import GenericForm from './addEventPage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/Types';

const data = [
  { label: 'Daily', value: '1' },
  { label: 'Weekly', value: '2' },
  { label: 'Monthly', value: '3' },
  { label: 'Yearly', value: '4' },
];

export default function AddCalendarEvents() {
  type AddCalendarTrackerNavigationProp = StackNavigationProp<RootStackParamList, 'addCalendarEvents'>;
  const navigation = useNavigation<AddCalendarTrackerNavigationProp>();

  const initialData = {
    user_id: 1,
    title: '',
    event_date: new Date(),
    event_time: new Date(),
    repeating: false,
    repeat_timeline: '',
    description: '',
  };

  const fields = [  
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'event_date', label: 'Date', type: 'date' },
    { name: 'event_time', label: 'Time', type: 'time' },
    { name: 'repeat_timeline', label: 'Repeating', type: 'dropdown', options: data },
    { name: 'description', label: 'Description', type: 'textarea' },
  ];

  const handleSave = async (data: any) => {    

    try {
        const response = await axios.post(IPAddr + '/add_calendar_events', data);
        console.log('Event saved successfully:', response.data);
        navigation.navigate('calendarEvents');
    } catch (error) {
        console.error('Error saving event:', error);
    }
};


  const handleCancel = () => {
    navigation.navigate('calendarEvents');
  };

  return (
    <GenericForm
      title="New Calendar Event"
      initialData={initialData}
      fields={fields}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
