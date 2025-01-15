import React from 'react';
import GenericAddViewEventForm from './genericAddViewEventPage';
import { calendarFields } from '@/constants/constants';

export default function ViewCalendarEvents() {
  return (
    <GenericAddViewEventForm
      title="Calendar event"
      fields={calendarFields}
      updateEndpoint={`/update_calendar_event`}
      mainPage="mainCalendarEvents"
      method="PUT"
    />
  );
}
