import React from 'react';
import axios from 'axios';
import { IPAddr, repeatingData } from './constants';
import GenericAddPageForm from './addEventPage';
import { cLog } from './log'

export default function AddCalendarEvents() {
  const initialData = {
    user_id: 1,
    title: '',
    event_date: new Date(),
    event_time: new Date(),
    description: '',
    repeating: 0, // default to false or other valid initial value
  };

  const fields = [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'event_date', label: 'Date', type: 'date' },
    { name: 'event_time', label: 'Time', type: 'time' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'repeat_timeline', label: 'Repeating', type: 'dropdown', options: repeatingData },
  ];

  const handleSave = async (saveData: any) => {
    try {
      // Format date and time before sending
      const payload = {
        ...saveData,
        repeating: Boolean(saveData.repeating),
        repeat_timeline: saveData.repeating
      };
      const hit = IPAddr + '/add_calendar_event';
      cLog('Saving event to:' + hit);
      const response = await axios.post(hit, payload);
      cLog('Event saved successfully:' + response.data);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <GenericAddPageForm
      title="New Calendar Event"
      initialData={initialData}
      fields={fields}
      mainPage="calendarEvents"
      onSave={handleSave}
    />
  );
}
