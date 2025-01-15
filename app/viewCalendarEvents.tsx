import React from 'react';
import GenericAddViewEventForm from './genericAddViewEventPage';
import { IPAddr, calendarFields } from '@/constants/constants';
import { RootStackParamList, EventParams } from '@/components/Types';
import { useRoute, RouteProp } from '@react-navigation/native';
import { cLog } from './log';

export default function ViewCalendarEvents() {
  const route = useRoute<RouteProp<RootStackParamList, any>>();
  const { event } = route.params as EventParams;
  cLog("Event:");
  cLog(event);
  return (
    <GenericAddViewEventForm
      title="Calendar event"
      fields={calendarFields}
      initialData={event}
      updateEndpoint={`${IPAddr}/update_calendar_event`}
      mainPage="mainCalendarEvents"
      method="PUT"
    />
  );
}
