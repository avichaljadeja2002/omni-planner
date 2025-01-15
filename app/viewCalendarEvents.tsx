import React from 'react';
import GenericEventPage from './genericViewEventPage';
import { IPAddr, calendarFields } from '../constants/constants';

export default function ViewHealthEvents() {
  return (
    <GenericEventPage
      title="Calendar event"
      fields={calendarFields}
      updateEndpoint={`${IPAddr}/update_calendar_event`}
      mainPage="mainCalendarEvents"
    />
  );
}
