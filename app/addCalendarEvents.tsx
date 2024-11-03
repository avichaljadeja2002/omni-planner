import React from 'react'
import axios from 'axios';
import { IPAddr, repeatingData } from './constants';
import GenericAddPageForm from './addEventPage';

export default function AddCalandarEvents() {
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
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'repeating', label: 'Repeating', type: 'dropdown', options: repeatingData },

  ];

  const handleSave = async (saveData: any) => {
    try {
      const response = await axios.post(IPAddr + '/add_calendar_events', saveData);
      console.log('Event saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <GenericAddPageForm
      title="New Calendar Event"
      initialData={initialData}
      fields={fields}
      mainPage='calendarEvents'
      onSave={handleSave}
    />
  );
};

