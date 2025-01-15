import React from 'react';
import GenericAddViewEventForm from './genericAddViewEventPage';
import { IPAddr, mealFields } from '@/constants/constants';

export default function ViewMealEvents() {
  return (
    <GenericAddViewEventForm
      title="Meal Event"
      fields={mealFields}
      updateEndpoint={`${IPAddr}/update_meal_event`}
      fetchEndpoint={`${IPAddr}/get_ingredients`}
      mainPage="mainMealTracker"
      keyValue={{ 'key': "id", "value": "ingredientName" }}
      method="PUT"
    />
  );
}
