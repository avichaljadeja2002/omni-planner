import React from 'react'
import axios from 'axios';
import { IPAddr } from './constants';
import GenericAddPageForm from './addEventPage';

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
      const response = await axios.post(IPAddr + '/add_meal_events', saveData);
      console.log('Event saved successfully:', response.data);
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

