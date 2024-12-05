import React from 'react'
import axios from 'axios';
import { IPAddr } from './constants';
import GenericAddPageForm from './addEventPage';
import { cLog } from './log'

export default function AddMeals() {
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

  const handleSave = async (saveData: any) => {
    try {
      const payload = {
        ...saveData,
        repeating: Boolean(saveData.repeating),
        repeat_timeline: saveData.repeating
      };
      const hit = IPAddr + '/add_meal_events';
      cLog('Saving event to:' + hit);
      const response = await axios.post(hit, payload);
      cLog('Event saved successfully:' + response.data);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <GenericAddPageForm
      title="New Meal"
      initialData={initialData}
      fields={fields}
      mainPage='mealTracker'
      onSave={handleSave}
    />
  );
};

