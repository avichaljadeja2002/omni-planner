import React from 'react';
import GenericViewEventForm from './genericViewEventPage';
import { IPAddr, calendarFields } from '@/constants/constants';

export default function ViewHealthEvents() {
  return (
    <GenericViewEventForm
      title="Calendar event"
      fields={calendarFields}
      updateEndpoint={`${IPAddr}/update_calendar_event`}
      mainPage="mainCalendarEvents"
    />
  );
}
