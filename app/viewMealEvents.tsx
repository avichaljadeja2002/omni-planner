import React from 'react';
import GenericViewEventForm from './genericViewEventPage';
import { IPAddr, mealFields } from '@/constants/constants';

export default function ViewMealEvents() {
  return (
    <GenericViewEventForm
      title="Meal Event"
      fields={mealFields}
      updateEndpoint={`${IPAddr}/update_meal_event`}
      fetchEndpoint={`${IPAddr}/get_ingredients`}
      mainPage="mainMealTracker"
      keyValue={{'key':"id", "value":"ingredientName"}}
    />
  );
}
