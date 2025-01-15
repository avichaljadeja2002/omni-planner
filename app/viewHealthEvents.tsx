import React from 'react';
import GenericAddViewEventForm from './genericAddViewEventPage';
import { IPAddr, healthFields } from '@/constants/constants';
import { RootStackParamList, EventParams } from '@/components/Types';
import { useRoute, RouteProp } from '@react-navigation/native';
import { cLog } from './log';

export default function ViewHealthEvents() {
  const route = useRoute<RouteProp<RootStackParamList, any>>();
  const { event } = route.params as EventParams;
  cLog("Event:");
  cLog(event);
  return (
    <GenericAddViewEventForm
      title="Health Event"
      fields={healthFields}
      initialData={event}
      updateEndpoint={`${IPAddr}/update_health_event`}
      mainPage="mainHealthTracker"
      method="PUT"
    />
  );
}
