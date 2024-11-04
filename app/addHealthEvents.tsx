import React from 'react';
import axios from 'axios';
import { IPAddr, repeatingData } from './constants';
import GenericAddPageForm from './addEventPage';

export default function AddHealthEvents() {
  const initialData = {
    user_id: 1,
    title: '',
    event_date: new Date(),
    event_time: new Date(),
    repeating: false,
    repeat_timeline: ''
  }

  const fields = [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'event_date', label: 'Date', type: 'date' },
    { name: 'event_time', label: 'Time', type: 'time' },
    { name: 'repeat_timeline', label: 'Repeating', type: 'dropdown', options: repeatingData },
    { name: 'description', label: 'Description', type: 'textarea' },
  ];

  const handleSave = async (saveData: any) => {
    try {
      const payload = {
        ...saveData,
        repeating: Boolean(saveData.repeating),
        repeat_timeline: saveData.repeating
      };
      const response = await axios.post(IPAddr + '/add_health_events', payload);
      console.log('Event saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <GenericAddPageForm
      title="New Health Event"
      initialData={initialData}
      fields={fields}
      mainPage='healthTracker'
      onSave={handleSave}
    />
  );
}
