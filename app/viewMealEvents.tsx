import React from 'react';
import GenericAddViewEventForm from './genericAddViewEventPage';
import { IPAddr, mealFields } from '@/constants/constants';
import { RootStackParamList, EventParams } from '@/components/Types';
import { useRoute, RouteProp } from '@react-navigation/native';
import { cLog } from './log';

export default function ViewMealEvents() {
  const route = useRoute<RouteProp<RootStackParamList, any>>();
  const { event } = route.params as EventParams;
  cLog("Event:");
  cLog(event);
  return (
    <GenericAddViewEventForm
      title="Meal Event"
      fields={mealFields}
      initialData={event}
      updateEndpoint={`${IPAddr}/update_meal_event`}
      fetchEndpoint={`${IPAddr}/get_ingredients`}
      mainPage="mainMealTracker"
      keyValue={{'key':"id", "value":"ingredientName"}}
      method="PUT"
    />
  );
}
