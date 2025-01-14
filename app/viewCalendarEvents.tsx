import React, { useEffect, useState } from 'react';
import GenericEventPage, { Field } from './genericViewEventPage';
import { IPAddr, repeatingData } from './constants';



export default function ViewHealthEvents() {
  const fields: Field[] = [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'event_date', label: 'Date', type: 'date' },
    { name: 'event_time', label: 'Time', type: 'time' },
        { name: 'repeat_timeline', label: 'Repeating', type: 'dropdown', options: repeatingData },
  ];

  return (
    <GenericEventPage
    title="Calendar event"
    fields={fields}
      updateEndpoint={`${IPAddr}/update_calendar_event`}
      mainPage="calendarEvents"
    />
  );
}
