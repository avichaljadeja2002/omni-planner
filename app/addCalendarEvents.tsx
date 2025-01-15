import React from 'react';
import { calendarFields, calendarInitialData, IPAddr } from '@/constants/constants';
import GenericAddPageForm from './genericAddEventPage';

export default function AddCalendarEvents() {
    return (
        <GenericAddPageForm
            title="New Calendar Event"
            initialData={calendarInitialData}
            fields={calendarFields}
            mainPage="mainCalendarEvents"
            updateEndpoint={`${IPAddr}/add_calendar_event`}
        />
    );
}
