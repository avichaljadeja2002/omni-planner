import React from 'react';
import GenericAddViewEventForm from './genericAddViewEventPage';
import { mealFields } from '@/constants/constants';

export default function ViewMealEvents() {
  return (
    <GenericAddViewEventForm
      title="Meal Event"
      fields={mealFields}
      updateEndpoint={`/update_event/meal`}
      fetchEndpoint={`/get_ingredients`}
      mainPage="mainMealTracker"
      keyValue={{ 'key': "id", "value": "ingredientName" }}
      method="PUT"
      mode='view'
    />
  );
}
