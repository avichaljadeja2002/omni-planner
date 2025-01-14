import React from 'react';
import GenericEventPage, { Field } from './genericViewEventPage';
import { IPAddr, repeatingData } from './constants';

export default function ViewMealEvents() {
  const fields: Field[] = [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'event_date', label: 'Date', type: 'date' },
    { name: 'event_time', label: 'Time', type: 'time' },
    { name: 'repeat_timeline', label: 'Repeating', type: 'dropdown', options: repeatingData },
    { name: 'ingredients', label: 'Ingredients', type: 'multi-select' },
  ];

  return (
    <GenericEventPage
      title="Meal Event"
      fields={fields}
      updateEndpoint={`${IPAddr}/update_meal_event`}
      fetchEndpoint={`${IPAddr}/get_ingredients/13`}
      mainPage="mealTracker"
    />
  );
}
