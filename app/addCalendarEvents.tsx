import React from 'react';
import { calendarFields, IPAddr } from '@/constants/constants';
import GenericAddViewPageForm from './genericAddViewEventPage';

export default function AddCalendarEvents() {
    const calendarInitialData = {
        userId: 1,
        title: '',
        event_date: new Date(),
        event_time: new Date(),
        description: '',
        repeating: 0, // Or false, depending on the use case
      };
    return (
        <GenericAddViewPageForm
            title="New Calendar Event"
            initialData={calendarInitialData}
            fields={calendarFields}
            mainPage="mainCalendarEvents"
            updateEndpoint={`${IPAddr}/add_calendar_event`}
            method="POST"
        />
    );
}
