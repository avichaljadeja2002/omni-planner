import React from 'react';
import GenericEventPage, { Field } from './genericViewEventPage';
import { IPAddr, repeatingData } from './constants';

export default function ViewHealthEvents() {
  const fields: Field[] = [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'event_date', label: 'Date', type: 'date' },
    { name: 'event_time', label: 'Time', type: 'time' },
    { name: 'repeat_timeline', label: 'Repeating', type: 'dropdown', options: repeatingData },
    { name: 'money', label: 'Money', type: 'number' }
  ];

  return (
    <GenericEventPage
      title="Finance Event"
      fields={fields}
      updateEndpoint={`${IPAddr}/update_finance_event`}
      mainPage="financeTracker"
    />
  );
}
